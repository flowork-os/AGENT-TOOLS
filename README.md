<div align="center">

# 🛠️ Flowork OS Sovereign Agent Tools (`AGENT-TOOLS`)

**High-Performance Micro-Tools & MCP-Compatible Execution Engines for Autonomous AI Agents**

[![AI Agents](https://img.shields.io/badge/AI%20Agents-Autonomous%20Workflows-FF6F00?style=for-the-badge&logo=openai&logoColor=white)](https://floworkos.com)
[![MCP Compatible](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-8A2BE2?style=for-the-badge)](https://modelcontextprotocol.io)
[![Zero Prompt Bloat](https://img.shields.io/badge/Prompt%20Engine-Zero%20Bloat%20JIT-00D26A?style=for-the-badge)](https://floworkos.com)
[![Architecture](https://img.shields.io/badge/Architecture-Nano--Plug%20Sharded-00F5FF?style=for-the-badge)](https://floworkos.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/flowork-os/AGENT-TOOLS/pulls)

<p align="center">
  <a href="#-the-problem--solution">The Problem & Solution</a> •
  <a href="#-tools-catalog">Tools Catalog</a> •
  <a href="#-nano-tool-architecture">Architecture</a> •
  <a href="#-tool-manifest-specification">Manifest Spec</a> •
  <a href="#-zero-api-installation">Installation</a> •
  <a href="#-contributing-new-tools">Contributing</a>
</p>

---

</div>

## 💡 The Problem & The Nano-Tool Solution

### The Bottleneck: Context Pollution & Process Overhead
Modern LLMs and autonomous agents degrade in reasoning quality when bloated with dozens of static tool definitions in the system prompt. Furthermore, running heavy standalone MCP daemon servers for single-purpose utilities drains memory and increases latency.

### The Flowork OS Solution: Just-In-Time (JIT) Dynamic Tool Mounting
Flowork OS decouples agent reasoning from tool definitions:
1. **Anchor Tools (Permanent)**: The agent operates with only 8 foundational anchor tools (`run_command`, `view_file`, `write_to_file`, `replace_file_content`, `read_url_content`, `search_web`, `invoke_subagent`, `search_tools`).
2. **Ephemeral Dynamic Tools (On-Demand)**: Domain-specific micro-tools are discovered dynamically via `search_tools` and mounted into the active turn only when needed.
3. **Instant De-Mounting**: After the goal is achieved, ephemeral tools are evicted from the LLM prompt context, preserving 100% of context capacity for user instructions and code synthesis.

---

## 🧰 Verified Sovereign Micro-Tools Catalog

| Icon | Tool ID | Version | Category | Description | Source & Shard |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 🌐 | **`dns_lookup`** | `1.0.0` | `network` | Perform DNS A, AAAA, MX, and TXT record lookups natively with zero external dependencies. | [`tools/dn/dns_lookup`](tools/dn/dns_lookup) • [`shard`](index/dn/s_/dns_lookup.json) |
| 🛡️ | **`port_scanner`** | `1.0.0` | `security` | High-speed asynchronous socket-based TCP port scanner and service prober. | [`tools/po/port_scanner`](tools/po/port_scanner) • [`shard`](index/po/rt/port_scanner.json) |
| 🗄️ | **`sqlite_inspector`** | `1.0.0` | `database` | Inspect table schemas, indexes, row counts, and sample records in SQLite databases. | [`tools/sq/sqlite_inspector`](tools/sq/sqlite_inspector) • [`shard`](index/sq/li/sqlite_inspector.json) |

*More micro-tools (Git diff visualizers, Redis inspectors, AWS STS auditors, Webhook listeners) are added weekly.*

---

## 🏛️ Nano-Tool Architecture & Sharded Lookup

```
AGENT-TOOLS/
├── index/                        # O(1) Crates.io-style sharded lookup metadata
│   ├── dn/s_/dns_lookup.json
│   ├── po/rt/port_scanner.json
│   └── sq/li/sqlite_inspector.json
├── tools/                        # Sovereign isolated tool directories
│   ├── dn/dns_lookup/
│   │   ├── manifest.json         # Parameter schemas & command runner
│   │   └── index.js              # Standalone zero-dependency executable
│   ├── po/port_scanner/
│   │   ├── manifest.json
│   │   └── index.js
│   └── sq/sqlite_inspector/
│       ├── manifest.json
│       └── index.js
├── tools.json                    # Root registry index
└── README.md
```

### O(1) Sharding Algorithm
To guarantee high performance at 10,000+ tools:
$$\text{Tool Directory} = \text{tools}/\{id[0..2]\}/\{id\}$$
$$\text{Index Shard} = \text{index}/\{id[0..2]\}/\{id[2..4]\}/\{id\}.\text{json}$$

---

## 📋 Tool Manifest Specification (`manifest.json`)

Every tool is strictly defined by an agnostic `manifest.json` conforming to Anthropic MCP and OpenAI tool calling standards:

```json
{
  "id": "dns_lookup",
  "name": "DNS Lookup Tool",
  "version": "1.0.0",
  "category": "network",
  "description": "Perform DNS A, AAAA, MX, and TXT record lookups with zero external dependencies",
  "command": "node index.js",
  "author": "Flowork OS",
  "keywords": [
    "dns", "network", "resolve", "lookup", "ip", "domain", "mx", "txt", "ns", "nameserver",
    "sovereign", "flowork", "diagnostics", "internet", "routing", "tcp", "udp", "query", "host", "infrastructure"
  ],
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "domain": {
        "type": "STRING",
        "description": "Domain name to resolve (e.g. floworkos.com)"
      },
      "type": {
        "type": "STRING",
        "description": "DNS record type: A, AAAA, MX, TXT, or ALL",
        "enum": ["A", "AAAA", "MX", "TXT", "ALL"]
      }
    },
    "required": ["domain"]
  }
}
```

---

## ⚡ Zero-API Direct Installation

Mount tools directly via CDN streaming without consuming GitHub API rate limits:

```bash
# Stream and extract micro-tool directly into active workspace
curl -sL "https://codeload.github.com/flowork-os/AGENT-TOOLS/tar.gz/main" | \
  tar -xz --strip-components=3 -C ./.fl_bin/ "AGENT-TOOLS-main/tools/dn/dns_lookup"
```

### Agent In-Session Dynamic Execution
```javascript
// Flowork OS runtime executes tool directly via stdin/stdout IPC
const result = await agent.callTool("dns_lookup", { domain: "floworkos.com", type: "A" });
console.log(result);
```

---

## 🤝 Contributing New Tools

We welcome community micro-tools! Follow these core doctrines:
1. **Single Responsibility**: One tool does exactly one thing well (under 100 lines of code).
2. **Zero or Minimal Dependencies**: Prefer standard library modules (Node.js built-ins, Python standard lib, or standalone Rust binaries).
3. **Mandatory 20 English Keywords**: Frontmatter keywords must contain exactly 20 descriptive terms for semantic search routing.
4. **Deterministic Exit Codes**: Return 0 on success, meaningful JSON on `stdout`, and errors on `stderr`.

```bash
git checkout -b feature/add-new-tool
# Add to tools/{prefix}/{tool_id}
git add tools/ index/ tools.json
git commit -m "feat(tools): add <tool_id> micro-tool"
git push origin feature/add-new-tool
```

---

## 📄 License

Licensed under the **MIT License**. Engineered for sovereign AI intelligence by Flowork OS.

Co-authored-by: Flowork OS <agent@floworkos.com>
