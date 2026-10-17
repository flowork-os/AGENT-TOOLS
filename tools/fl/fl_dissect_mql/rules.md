# 🔬 fl_dissect_mql - Sovereign Governance Rules

1. **Pure Binary Inspection:** Never attempt to execute, load into an active process, or run target .ex4/.ex5 binaries.
2. **Strict English Payloads:** All JSON keys, status messages, and diagnostics must be emitted strictly in English.
3. **Entropy Classification:** Payloads with Shannon entropy >= 7.5 must be flagged as ENCRYPTED_OR_COMPRESSED.
4. **Header Slot Preservation:** Read fixed UTF-16LE property slots at 0x000a8 (Title), 0x001a8 (Link), and 0x002a8 (Version).
5. **Zero-Crash Containment:** Any file read error, truncation, or format anomaly must exit gracefully with Exit Code 0 and structured error JSON.
6. **Multi-OS File Paths:** Normalize input paths using standard path resolution across Linux, macOS, and Windows.
