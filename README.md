<div align="center">

# 🛠️ Flowork OS Sovereign Agent Tools (`AGENT-TOOLS`)

**High-Performance Micro-Tools & MCP-Compatible Execution Engines for Autonomous AI Agents**

[![AI Agents](https://img.shields.io/badge/AI%20Agents-Autonomous%20Workflows-FF6F00?style=for-the-badge&logo=openai&logoColor=white)](https://floworkos.com)
[![MCP Compatible](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-8A2BE2?style=for-the-badge)](https://modelcontextprotocol.io)
[![Zero Prompt Bloat](https://img.shields.io/badge/Prompt%20Engine-Zero%20Bloat%20JIT-00D26A?style=for-the-badge)](https://floworkos.com)
[![Architecture](https://img.shields.io/badge/Architecture-Nano--Plug%20Sharded-00F5FF?style=for-the-badge)](https://floworkos.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/flowork-os/AGENT-TOOLS/pulls)

<br />

<a href="https://github.com/flowork-os/FLOWORK-AGENT">
  <img src="https://img.shields.io/badge/%E2%9A%A1%20DOWNLOAD%20FLOWORK%20AGENT-INSTALL%20NOW%20%E2%86%92-FF0055?style=for-the-badge&logo=rocket&logoColor=white&labelColor=0D1117" alt="Download Flowork Agent" height="54" />
</a>

<br /><br />

<p align="center">
  <a href="#-get-the-flowork-agent">Download Agent</a> •
  <a href="#-the-problem--solution">The Problem & Solution</a> •
  <a href="#-dynamic-discovery--search">Discovery</a> •
  <a href="#-nano-tool-architecture">Architecture</a> •
  <a href="#-tool-manifest-specification">Manifest Spec</a> •
  <a href="#-zero-api-installation">Installation</a> •
  <a href="#-contributing-new-tools">Contributing</a>
</p>

---

</div>

## ⚡ Get the Flowork Agent

To execute micro-tools dynamically, orchestrate autonomous multi-agent loops, and enjoy Just-In-Time tool mounting with zero prompt bloat, download the official **Flowork Agent Engine**:

<div align="center">

[![Download Flowork Agent](https://img.shields.io/badge/%E2%9A%A1%20DOWNLOAD%20FLOWORK%20AGENT-CLICK%20TO%20GET%20STARTED-FF0055?style=for-the-badge&logo=github&logoColor=white&labelColor=0D1117)](https://github.com/flowork-os/FLOWORK-AGENT)

**[👉 https://github.com/flowork-os/FLOWORK-AGENT 👈](https://github.com/flowork-os/FLOWORK-AGENT)**

*Native support for Linux (x86_64, AArch64) • Windows 10/11 • macOS*

</div>

---

## 💡 The Problem & The Nano-Tool Solution

### The Bottleneck: Context Pollution & Process Overhead
Modern LLMs and autonomous agents suffer performance degradation when bloated with dozens of static tool definitions in the system prompt. Furthermore, running heavy standalone MCP daemon servers for single-purpose utilities drains memory and increases execution latency.

### The Flowork OS Solution: Just-In-Time (JIT) Dynamic Tool Mounting
Flowork OS decouples agent reasoning from tool definitions:
1. **Anchor Tools (Permanent)**: The agent operates with only 8 foundational anchor tools (`run_command`, `view_file`, `write_to_file`, `replace_file_content`, `read_url_content`, `search_web`, `invoke_subagent`, `search_tools`).
2. **Ephemeral Dynamic Tools (On-Demand)**: Domain-specific micro-tools are discovered dynamically via `search_tools` and mounted into the active turn only when required.
3. **Instant De-Mounting**: After the goal is achieved, ephemeral tools are evicted from the LLM prompt context, preserving 100% of context capacity for user instructions and code synthesis.

---

## 🔍 Dynamic Discovery & Search

To support thousands of tools without polluting repository files, all tools are indexed dynamically:

### 1. Agent Dynamic Tool Search
Flowork AI agents discover and mount tools in real time using semantic keyword matching:
```javascript
// Dynamic search invoked directly by AI agent runtime
await agent.callTool("search_tools", {
  action: "search_remote",
  query: "network port scanner"
});
```

### 2. Edge Registry API
Query tools via Edge Gateway API:
```bash
curl -s "https://plugins.floworkos.com/api/tools/search?q=dns"
```

### 3. Sharded File Registry
Direct lookups via Crates.io-style sharded JSON metadata:
`index/<aa>/<bb>/<tool_id>.json`

---

## 🏛️ Nano-Tool Architecture & Sharded Lookup

```
AGENT-TOOLS/
├── index/                        # O(1) Crates.io-style sharded lookup metadata
│   └── <aa>/<bb>/<tool_id>.json
├── tools/                        # Sovereign isolated tool directories
│   └── <aa>/<tool_id>/
│       ├── manifest.json         # Parameter schemas & command runner
│       └── index.js              # Standalone zero-dependency executable
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
  "id": "sample_tool",
  "name": "Sample Micro-Tool",
  "version": "1.0.0",
  "category": "utilities",
  "description": "High-speed standalone utility with zero external dependencies",
  "command": "node index.js",
  "author": "Flowork OS",
  "keywords": [
    "utility", "microtool", "sovereign", "flowork", "mcp", "fast", "zero_dependency",
    "automation", "agentic", "developer", "runtime", "cli", "lightweight", "performance",
    "linux", "windows", "macos", "portable", "sandboxed", "execution"
  ],
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "target": {
        "type": "STRING",
        "description": "Target address or argument"
      }
    },
    "required": ["target"]
  }
}
```

---

## ⚡ Zero-API Direct Installation

Mount tools directly via CDN streaming without consuming GitHub API rate limits:

```bash
TOOL_ID="dns_lookup"
PREFIX="${TOOL_ID:0:2}"

curl -sL "https://codeload.github.com/flowork-os/AGENT-TOOLS/tar.gz/main" | \
  tar -xz --strip-components=3 -C ./.fl_bin/ "AGENT-TOOLS-main/tools/${PREFIX}/${TOOL_ID}"
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
# Add to tools/{id[:2]}/{tool_id}
git add tools/ index/ tools.json
git commit -m "feat(tools): publish <tool_id> micro-tool"
git push origin feature/add-new-tool
```

---

## 📄 License

Licensed under the **MIT License**. Engineered for sovereign AI intelligence by Flowork OS.

Co-authored-by: Flowork OS <agent@floworkos.com>
