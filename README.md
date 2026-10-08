# 🛠️ Flowork OS — Sovereign Modular Agent Tools (`AGENT-TOOLS`)

Welcome to the official repository for **Flowork OS Nano-Plug Modular Tools**.

## 🏛️ Nano-Plug Tool Architecture
Flowork OS adheres to the **Zero Prompt Bloat** & **On-Demand Dynamic Mounting** doctrine:
1. **Never Load All Tools into Context**: LLM context windows should not be cluttered with hundreds of unused function declarations.
2. **Anchor Tools vs Ephemeral Dynamic Tools**:
   - Only 8 Anchor Tools are mounted permanently (`run_command`, `view_file`, `write_to_file`, `replace_file_content`, `read_url_content`, `search_web`, `invoke_subagent`, `search_tools`).
   - All extended tools are discovered on-demand via `search_tools(action: 'search_remote')` and mounted temporarily via `search_tools(action: 'install', tool_id: '...')`.
3. **1-File / 1-Folder Modular Plug & Play**: Every tool is an isolated directory with its own `manifest.json`, dependencies, and execution entry point.

---

## 📦 Tool Specification (`manifest.json`)
```json
{
  "id": "dns_lookup",
  "name": "DNS Lookup Tool",
  "version": "1.0.0",
  "category": "network",
  "description": "Perform DNS A, AAAA, MX, and TXT record lookups with zero external dependencies",
  "command": "node index.js",
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "domain": {
        "type": "STRING",
        "description": "Domain name to resolve"
      },
      "record_type": {
        "type": "STRING",
        "description": "DNS record type (A, AAAA, MX, TXT, NS)"
      }
    },
    "required": ["domain"]
  },
  "author": "Flowork OS",
  "keywords": ["dns", "network", "resolve", "lookup", "ip", "domain", "mx", "txt", "ns", "nameserver", "sovereign", "flowork", "diagnostics", "internet", "routing", "tcp", "udp", "query", "host", "infrastructure"]
}
```

---

## 🚀 How to Install & Use Tools
In the Flowork OS Agent Terminal / Chat:
- **Search Remote Tools**: `search_tools(action: "search_remote", query: "network")`
- **Install Tool**: `search_tools(action: "install", tool_id: "dns_lookup")`
- **Mount into Session**: `search_tools(action: "mount", tools: ["dns_lookup"])`
- **Publish Community Tool**: `search_tools(action: "publish", tool_id: "my_custom_tool")`

---
*Co-authored-by: Flowork OS <agent@floworkos.com>*
