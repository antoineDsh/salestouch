import { resolvePluginApiConfig } from "./config.js";
import { PLUGIN_VERSION } from "./version.js";
const fallbackResources = [
    {
        uri: "salestouch://status",
        name: "SalesTouch Status",
        description: "Workspace installation and API connectivity status.",
        mimeType: "application/json",
    },
    {
        uri: "salestouch://catalog",
        name: "SalesTouch Catalog",
        description: "SalesTouch MCP tool catalog exposed by the local plugin.",
        mimeType: "application/json",
    },
    {
        uri: "salestouch://missions",
        name: "SalesTouch Missions",
        description: "Readable mission context for the current workspace.",
        mimeType: "application/json",
    },
    {
        uri: "salestouch://offers",
        name: "SalesTouch Offers",
        description: "Readable offer context for the current workspace.",
        mimeType: "application/json",
    },
    {
        uri: "salestouch://linkedin/accounts",
        name: "LinkedIn Accounts",
        description: "Readable LinkedIn account inventory for the current workspace.",
        mimeType: "application/json",
    },
];
const PROTOCOL_VERSIONS = [
    "2025-11-05",
    "2025-06-18",
    "2025-03-26",
    "2024-11-05",
];
const schemaCache = new Map();
function writeStderr(message) {
    process.stderr.write(`[salestouch-mcp] ${message}\n`);
}
async function apiRequest(path, init) {
    const { baseUrl, apiKey, accessToken } = await resolvePluginApiConfig();
    const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-SalesTouch-Client": "plugin",
            "X-SalesTouch-Client-Version": PLUGIN_VERSION,
            ...(apiKey ? { "X-API-Key": apiKey } : {}),
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...(init?.headers ?? {}),
        },
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};
    if (!response.ok) {
        const message = payload?.error?.message ??
            `SalesTouch API error (${response.status})`;
        throw new Error(message);
    }
    return payload;
}
async function fetchCatalog() {
    const payload = await apiRequest("/api/v1/commands");
    return (payload.data?.commands ?? []).flatMap((entry) => {
        if (typeof entry.command_id !== "string") {
            return [];
        }
        const commandId = entry.command_id;
        return [
            {
                id: commandId,
                title: entry.title,
                summary: entry.summary,
                description: entry.description ?? entry.summary ?? entry.title ?? commandId,
                risk: entry.risk ?? "read",
                category: entry.category ?? deriveCategory(commandId),
            },
        ];
    });
}
function deriveCategory(commandId) {
    if (commandId.startsWith("lead."))
        return "leads";
    if (commandId.startsWith("mission."))
        return "missions";
    if (commandId.startsWith("offer."))
        return "offers";
    if (commandId.startsWith("import."))
        return "imports";
    if (commandId.startsWith("scoring."))
        return "scoring";
    return "linkedin";
}
async function fetchCommandSchema(commandId) {
    const cached = schemaCache.get(commandId);
    if (cached) {
        return cached;
    }
    const payload = await apiRequest(`/api/v1/commands/${encodeURIComponent(commandId)}/schema`);
    const schema = payload.data?.command?.input_schema ?? {
        type: "object",
        properties: {},
        additionalProperties: true,
    };
    schemaCache.set(commandId, schema);
    return schema;
}
async function fetchResources() {
    const payload = await apiRequest("/api/v1/resources");
    return payload.data?.resources ?? fallbackResources;
}
async function readResource(uri) {
    const payload = await apiRequest(`/api/v1/resources/read?uri=${encodeURIComponent(uri)}`);
    return payload.data?.resource ?? null;
}
function sendMessage(message) {
    const body = JSON.stringify(message);
    const headers = `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n`;
    process.stdout.write(headers + body);
}
function sendResult(id, result) {
    sendMessage({
        jsonrpc: "2.0",
        id,
        result,
    });
}
function sendError(id, code, message, data) {
    sendMessage({
        jsonrpc: "2.0",
        id,
        error: {
            code,
            message,
            ...(data === undefined ? {} : { data }),
        },
    });
}
function safeJsonStringify(value) {
    try {
        return JSON.stringify(value, null, 2);
    }
    catch {
        return String(value);
    }
}
function getToolAnnotations(risk) {
    if (risk === "read") {
        return {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        };
    }
    return {
        readOnlyHint: false,
        destructiveHint: risk === "approval",
        idempotentHint: false,
        openWorldHint: false,
    };
}
async function handleInitialize(id, params) {
    const requestedVersion = typeof params?.protocolVersion === "string" ? params.protocolVersion : null;
    const protocolVersion = requestedVersion && PROTOCOL_VERSIONS.includes(requestedVersion)
        ? requestedVersion
        : PROTOCOL_VERSIONS[0];
    sendResult(id, {
        protocolVersion,
        capabilities: {
            tools: {
                listChanged: false,
            },
            resources: {
                listChanged: false,
                subscribe: false,
            },
        },
        serverInfo: {
            name: "salestouch-mcp",
            version: PLUGIN_VERSION,
        },
    });
}
async function handleToolsList(id) {
    const remoteCatalog = await fetchCatalog();
    const tools = await Promise.all(remoteCatalog.map(async (tool) => ({
        name: tool.id,
        title: tool.title ?? tool.id,
        description: tool.summary ?? tool.description,
        inputSchema: await fetchCommandSchema(tool.id),
        annotations: getToolAnnotations(tool.risk),
    })));
    sendResult(id, { tools });
}
async function handleToolCall(id, params) {
    const toolName = typeof params?.name === "string" ? params.name : null;
    const argumentsValue = params?.arguments && typeof params.arguments === "object"
        ? params.arguments
        : {};
    if (!toolName) {
        sendError(id, -32602, "Tool name is required");
        return;
    }
    const remoteCatalog = await fetchCatalog();
    if (!remoteCatalog.some((entry) => entry.id === toolName)) {
        sendError(id, -32601, `Unknown tool: ${toolName}`);
        return;
    }
    const payload = await apiRequest(`/api/v1/commands/${encodeURIComponent(toolName)}`, {
        method: "POST",
        body: JSON.stringify({
            input: argumentsValue,
        }),
    });
    const resultBody = payload.ok
        ? {
            data: payload.data ?? null,
            meta: payload.meta ?? null,
        }
        : {
            error: payload.error ?? { message: "Unknown command failure" },
            meta: payload.meta ?? null,
        };
    sendResult(id, {
        content: [
            {
                type: "text",
                text: safeJsonStringify(resultBody),
            },
        ],
        structuredContent: resultBody,
        isError: !payload.ok,
    });
}
async function handleResourcesList(id) {
    const resources = await fetchResources();
    sendResult(id, { resources });
}
async function handleResourceRead(id, params) {
    const uri = typeof params?.uri === "string" ? params.uri : null;
    if (!uri) {
        sendError(id, -32602, "Resource uri is required");
        return;
    }
    const resource = await readResource(uri);
    if (!resource?.uri) {
        sendError(id, -32004, "Resource not found");
        return;
    }
    sendResult(id, {
        contents: [
            {
                uri: resource.uri,
                mimeType: "application/json",
                text: safeJsonStringify(resource.payload ?? {}),
            },
        ],
    });
}
async function handleRequest(request) {
    const id = request.id ?? null;
    try {
        switch (request.method) {
            case "initialize":
                await handleInitialize(id, request.params);
                return;
            case "ping":
                sendResult(id, {});
                return;
            case "tools/list":
                await handleToolsList(id);
                return;
            case "tools/call":
                await handleToolCall(id, request.params);
                return;
            case "resources/list":
                await handleResourcesList(id);
                return;
            case "resources/read":
                await handleResourceRead(id, request.params);
                return;
            case "notifications/initialized":
                return;
            default:
                if (request.id !== undefined) {
                    sendError(id, -32601, `Method not found: ${request.method}`);
                }
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown MCP server error";
        writeStderr(message);
        if (request.id !== undefined) {
            sendError(id, -32000, message);
        }
    }
}
let inputBuffer = Buffer.alloc(0);
function processInputBuffer() {
    while (true) {
        const headerEnd = inputBuffer.indexOf("\r\n\r\n");
        if (headerEnd === -1) {
            return;
        }
        const headerText = inputBuffer.slice(0, headerEnd).toString("utf8");
        const contentLengthMatch = headerText.match(/Content-Length:\s*(\d+)/i);
        if (!contentLengthMatch) {
            inputBuffer = Buffer.alloc(0);
            return;
        }
        const contentLength = Number(contentLengthMatch[1]);
        const messageStart = headerEnd + 4;
        const messageEnd = messageStart + contentLength;
        if (inputBuffer.length < messageEnd) {
            return;
        }
        const messageBody = inputBuffer.slice(messageStart, messageEnd).toString("utf8");
        inputBuffer = inputBuffer.slice(messageEnd);
        try {
            const request = JSON.parse(messageBody);
            void handleRequest(request);
        }
        catch (error) {
            writeStderr(error instanceof Error ? error.message : "Invalid JSON-RPC message");
        }
    }
}
process.stdin.on("data", (chunk) => {
    inputBuffer = Buffer.concat([inputBuffer, chunk]);
    processInputBuffer();
});
process.stdin.on("end", () => {
    process.exit(0);
});
writeStderr("ready");
