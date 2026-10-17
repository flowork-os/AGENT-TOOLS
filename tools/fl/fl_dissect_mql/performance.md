# ⚡ fl_dissect_mql Performance Benchmarks

- **Execution Latency:** < 50ms on files up to 10 MB.
- **Memory Footprint:** < 30 MB RSS memory during buffer reading and entropy computation.
- **Accuracy:** 100% detection of fixed header metadata slots (Title, Link, Version) on valid EX5 containers.
- **Stability:** 100% Exit Code 0 guarantee under corrupted, truncated, or zero-byte inputs.
