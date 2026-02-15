# Design: Library and Multi-Language Bindings

**Status**: Phases 1, 3, 4, 5 Complete | TOML Consolidation Complete | Profile Consolidation Complete | Landlock Deny Parity Complete | QA Verified
**Date**: 2026-02-07
**Updated**: 2026-02-11

---

## Progress Tracking

### Phase 1: Workspace Setup - COMPLETE

| Task | Status | Notes |
|------|--------|-------|
| Create workspace structure | Done | `/Users/lukehinds/dev/nono/nono` |
| Create workspace Cargo.toml | Done | Shared dependencies via `workspace.package` |
| Create nono library crate | Done | All core modules: capability, sandbox, state, diagnostic, query, keystore, error |
| Create nono-cli crate | Done | Full CLI implementation |
| Build passes | Done | 181 tests pass (57 library + 5 doc + 87 CLI + 37 FFI), clippy clean |
| Migrate CLI modules | Done | All modules migrated from original nono-rs |
| Security hardening | Done | Escape injection, silent fallback, env var validation |
| TOML consolidation | Done | Removed security-lists.toml, security_lists.rs, TOML profile pipeline. policy.json is single source of truth |
| Query symlink fix | Done | Hybrid canonicalization in query.rs for macOS /tmp -> /private/tmp |
| QA verification | Done | C FFI verified via manual QA plan. Python and Node bindings in separate repos |
| Profile consolidation | Done | Moved built-in profiles from Rust structs into policy.json `profiles` section. `builtin.rs` delegates to policy resolver. `base_groups` and `trust_groups` mechanism for composable profile inheritance |
| Landlock deny parity | Done | Platform-aware deny resolution in `policy.rs`. `deny.access`, `deny.unlink`, and `symlink_pairs` generate Seatbelt rules on macOS only. `validate_deny_overlaps()` detects deny paths that Landlock cannot enforce. Narrowed `user_tools` group to eliminate `~/.local/share/keyrings` overlap |

### Library Modules Implemented

| Module | Description |
|--------|-------------|
| `capability.rs` | `CapabilitySet` with builder pattern, `FsCapability`, `AccessMode` |
| `sandbox/mod.rs` | `Sandbox` facade with `apply()`, `is_supported()`, `support_info()` |
| `sandbox/linux.rs` | Landlock implementation (pure primitive, no built-in paths) |
| `sandbox/macos.rs` | Seatbelt implementation (pure primitive, no built-in paths) |
| `state.rs` | `SandboxState` serialization for diagnostics |
| `diagnostic.rs` | `DiagnosticFormatter` for error messages |
| `query.rs` | `QueryContext` for permission checking (hybrid canonicalization for symlink handling) |
| `keystore.rs` | Secure credential loading from system keystore |
| `error.rs` | `NonoError` enum with library-specific errors |

### CLI Modules Implemented

| Module | Description |
|--------|-------------|
| `main.rs` | Entry point with command routing |
| `cli.rs` | Clap argument definitions |
| `capability_ext.rs` | `CapabilitySetExt` trait for CLI-specific construction |
| `query_ext.rs` | CLI-specific query functions and output formatting |
| `sandbox_state.rs` | CLI-specific state handling for `nono why --self` |
| `exec_strategy.rs` | Fork+exec process model with signal forwarding |
| `hooks.rs` | Claude Code hook installation |
| `setup.rs` | System setup and verification |
| `output.rs` | Banner, dry-run output, prompts |
| `learn.rs` | strace-based path discovery (Linux only) |
| `policy.rs` | Group resolver: parse policy.json, filter, expand, resolve groups. Also loads built-in profiles via `ProfileDef` and manages `base_groups` |
| `config/` | Embedded policy, user config, version tracking |
| `profile/` | Profile loading (user profiles from TOML, built-in profiles delegated to policy.rs) |

### Design Decisions Made

1. **Security policy OUTSIDE library** - Library is pure sandbox primitive. No built-in sensitive paths, dangerous commands, or system paths. Clients define all policy.

2. **System paths are client responsibility** - Library applies ONLY what's in CapabilitySet. CLI must add /usr, /lib, /bin, etc.

3. **Keychain storage IN library** - Reusable by Python/TypeScript bindings.

4. **Builder pattern for CapabilitySet** - Method chaining with `Result<Self>` return.

5. **Async**: Synchronous for Phase 1, API designed for async compatibility.

6. **WASM**: Compiles but returns UnsupportedPlatform error at runtime.

7. **Version sync**: Use `workspace.package` (idiomatic Rust).

8. **Bindings use mutable API**: Python/JS bindings wrap `&mut self` methods (`add_fs`, `set_network_blocked`), not the consuming builder (`allow_path(self, ...) -> Result<Self>`). Consuming ownership doesn't translate to GC-managed languages.

9. **Object types for read-only data**: Node bindings use `#[napi(object)]` (plain JS objects) for `FsCapabilityInfo`, `SupportInfoResult`, `QueryResultInfo` instead of classes. Avoids reference management overhead.

10. **MSRV split**: Node binding requires Rust 1.77+ (`napi-build` uses `cargo::` syntax). Overridden per-crate; workspace MSRV stays at 1.74.

11. **C ABI as universal base layer**: One `extern "C"` surface gives every language with C FFI access to nono. Does not replace PyO3 or napi-rs — those remain the ergonomic bindings for Python and Node.

12. **Opaque pointers for C types**: C consumers never see Rust struct layout. Handles are `Box::into_raw()` pointers freed by `_free()` functions. Thread-local `nono_last_error()` provides detailed error strings alongside integer error codes.

13. **Index-based C iteration**: FsCapability accessors use `_fs_count()` + `_fs_original(caps, index)` rather than exposing raw slice pointers, avoiding double-free risks and keeping the API safe for all C FFI consumers.

14. **Hybrid path canonicalization in QueryContext**: `query_path()` tries `fs::canonicalize()` first (most accurate, follows symlink chain). If the path doesn't exist (canonicalization fails), falls back to checking both `cap.original` and `cap.resolved`. This handles macOS symlinks (`/tmp` -> `/private/tmp`) for both existing and non-existent paths without false denials.

15. **Profiles in policy.json with trust_groups**: Built-in profiles are declarative JSON in the `profiles` section of `policy.json`, not Rust struct construction. `base_groups` array defines the 17 default groups all sandboxes inherit. Profiles declare additional groups via `security.groups` and can exclude base groups via `trust_groups`. Group merging: `final = (base_groups - trust_groups) + profile.security.groups`. `ProfileDef` (JSON representation) is separate from `Profile` (runtime representation with complete merged group list). `builtin.rs` delegates to the policy resolver.

16. **Platform-aware deny resolution**: `deny.access` paths, `deny.unlink`, and `symlink_pairs` only generate Seatbelt `platform_rules` on macOS. On Linux these operations have no Landlock equivalent — Landlock is strictly allow-list and cannot express deny-within-allow. The resolver always collects deny paths into `ResolvedGroups.deny_paths` for post-resolution validation via `validate_deny_overlaps()`, which warns when a deny path falls under a broader allow on Linux. Data-level fixes (narrowing allow groups) are preferred over runtime detection alone.

---

## Goal

Extract nono's core sandbox functionality into a reusable Rust library that serves as the foundation for:

1. **Rust SDK** - Native Rust consumers embedding sandboxing in their tools
2. **Python bindings** - Via PyO3/maturin
3. **TypeScript/Node bindings** - Via napi-rs
4. **CLI** - The existing `nono` command, rebuilt on top of the library

## Strategic Positioning

nono is **application-level, OS-enforced capability sandboxing** that developers embed in agent code. It answers "what is this code allowed to do?" — complementary to containers, which answer "where does this code run?"

| Technology | Level | Developer experience | Agent-aware? |
|---|---|---|---|
| Docker/K8s/ECS | Infrastructure | YAML manifests, ops teams | No |
| gVisor/Firecracker | VM | Requires orchestration | No |
| Seccomp | Syscall | Raw BPF programs | No |
| SELinux/AppArmor | System MAC | Admin-configured policies | No |
| WASM (Wasmtime) | Compilation target | Requires recompilation | No |
| **nono** | **Application** | **`import nono; nono.apply(caps)`** | **Yes** |

The library is the core asset. The CLI is one consumer. Enterprise value builds on top:

```
                    ┌─────────────────────────────────┐
                    │     nono Policy Management       │  ← Enterprise (paid)
                    │  Central policy, audit, compliance│
                    └──────────────┬──────────────────┘
                                   │ policy pull
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
    ┌────┴────┐              ┌────┴────┐              ┌────┴────┐
    │ Agent A  │              │ Agent B  │              │ Agent C  │
    │ Python   │              │ TypeScript│             │ Rust     │
    │ nono-py  │              │ nono-js  │              │ nono     │
    └─────────┘              └─────────┘              └─────────┘
    Container/VM/bare metal — nono works everywhere
```

- **Library** (open source): `nono`, `nono-py`, `nono-js`. Any developer can sandbox their agent.
- **Policy management** (enterprise): Centralized policy definition, distribution, versioning.
- **Audit and compliance**: Every `nono.apply()` call is logged. Every denied access is traceable.

nono runs **inside containers as defense-in-depth**, not instead of them. Containers don't know what files are credentials. Nono does.

## Package Naming

| Package | Purpose | Registry |
|---------|---------|----------|
| `nono` | Core Rust library | crates.io |
| `nono-cli` | CLI binary | crates.io |
| `nono-ffi` | C FFI bindings (universal ABI) | Source / system package |
| `nono-py` | Python bindings (separate repo) | PyPI |
| `nono-ts` | Node.js/TypeScript bindings (separate repo) | npm |

The existing `nono-rs` package will be deprecated in favor of `nono` (library) + `nono-cli`.

## Architecture

```
nono (Rust library - in workspace)
    │
    ├── nono-cli (Rust CLI - in workspace)
    │
    ├── nono-ffi (C FFI via cbindgen - in workspace) -> nono.h
    │   ├── Go (cgo)
    │   ├── Swift (direct C interop)
    │   ├── Ruby (FFI gem)
    │   ├── Java/Kotlin (JNI / Panama)
    │   ├── C#/.NET (P/Invoke)
    │   └── Zig (direct C import)
    │
    └── Language-specific bindings (separate repos, ergonomic APIs)
        ├── nono-py (Python via PyO3 - separate repo, PyPI)
        └── nono-ts (TypeScript via napi-rs - separate repo, npm)
```

**Key principles**:
- The Rust library remains fully idiomatic Rust. No capability is sacrificed for FFI compatibility.
- PyO3 and napi-rs produce ergonomic, language-native APIs for Python and Node.js.
- The C FFI layer provides a stable ABI for all other languages through their native C interop mechanisms. One `extern "C"` surface, N languages.

---

## Crate Structure

### Workspace Layout

```
nono/                           # Cargo workspace
├── Cargo.toml                  # Workspace root (3 members)
├── crates/
│   ├── nono/                   # Core library (pure sandbox primitive)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── capability.rs
│   │       ├── sandbox/
│   │       │   ├── mod.rs
│   │       │   ├── linux.rs
│   │       │   └── macos.rs
│   │       ├── state.rs
│   │       ├── diagnostic.rs
│   │       ├── query.rs
│   │       ├── keystore.rs
│   │       └── error.rs
│   └── nono-cli/               # CLI binary (security policy and UX)
│       ├── Cargo.toml
│       ├── build.rs
│       └── src/
│           ├── main.rs
│           ├── cli.rs
│           ├── capability_ext.rs
│           ├── policy.rs
│           ├── query_ext.rs
│           ├── sandbox_state.rs
│           ├── exec_strategy.rs
│           ├── hooks.rs
│           ├── setup.rs
│           ├── output.rs
│           ├── learn.rs
│           ├── config/
│           │   ├── mod.rs
│           │   ├── embedded.rs
│           │   ├── user.rs
│           │   ├── verify.rs
│           │   └── version.rs
│           └── profile/
│               ├── mod.rs
│               └── builtin.rs
└── bindings/
    └── c/                      # C FFI bindings (nono-ffi crate)
        ├── Cargo.toml          # cdylib + staticlib, cbindgen build-dep
        ├── cbindgen.toml       # Header generation config
        ├── build.rs            # Runs cbindgen -> include/nono.h
        ├── include/
        │   └── nono.h          # Auto-generated C header
        └── src/
            ├── lib.rs          # Thread-local error store, string helpers
            ├── types.rs        # #[repr(C)] enums and structs
            ├── capability_set.rs
            ├── fs_capability.rs
            ├── sandbox.rs
            ├── query.rs
            └── state.rs
```

### Separate Repositories

Language bindings live in their own repos with independent release cycles:

```
../nono-py/                     # Python bindings (PyO3, published to PyPI)
├── Cargo.toml                  # Depends on nono crate
├── pyproject.toml              # maturin build backend
├── python/nono_py/             # Python package with type stubs
├── src/lib.rs                  # PyO3 wrapper types
└── tests/                      # Python test suite

../nono-ts/                     # TypeScript/Node bindings (napi-rs, published to npm)
├── Cargo.toml                  # Depends on nono crate
├── package.json                # npm package config
├── index.js                    # Cross-platform native loader
├── index.d.ts                  # Auto-generated TypeScript definitions
├── src/lib.rs                  # napi-rs wrapper types
└── tests/                      # Node test suite
```

### What Goes Where

| Module | Location | Notes |
|--------|----------|-------|
| `CapabilitySet` | `crates/nono/` | Core abstraction with builder pattern |
| `FsCapability` | `crates/nono/` | Core abstraction |
| `AccessMode` | `crates/nono/` | Core enum |
| `Sandbox::apply()` | `crates/nono/` | Platform implementations (pure primitive) |
| `SandboxState` | `crates/nono/` | Serialization |
| `DiagnosticFormatter` | `crates/nono/` | Reusable formatting |
| `NonoError` | `crates/nono/` | Error types |
| Query logic | `crates/nono/` | Path explain |
| Keystore | `crates/nono/` | Secure credential loading |
| Security lists | `crates/nono-cli/` | **Client-defined policy** |
| System paths | `crates/nono-cli/` | **Client responsibility** |
| `ExecStrategy` | `crates/nono-cli/` | CLI process model |
| Profile loading | `crates/nono-cli/` | CLI configuration |
| Hooks | `crates/nono-cli/` | Claude Code specific |
| CLI args | `crates/nono-cli/` | Clap definitions |
| Learn mode | `crates/nono-cli/` | strace-based discovery |

---

## Library Public API

### Rust API

```rust
// crates/nono/src/lib.rs

pub mod capability;
pub mod sandbox;
pub mod state;
pub mod diagnostic;
pub mod query;
pub mod error;

pub use capability::{CapabilitySet, FsCapability, AccessMode};
pub use sandbox::{Sandbox, SandboxSupport, SupportInfo};
pub use state::SandboxState;
pub use diagnostic::DiagnosticFormatter;
pub use query::{QueryResult, QueryContext};
pub use error::{NonoError, Result};
```

### Usage Examples

**Rust:**
```rust
use nono::{CapabilitySet, AccessMode, Sandbox};

fn main() -> nono::Result<()> {
    let caps = CapabilitySet::new()
        .allow_path("/project", AccessMode::ReadWrite)?
        .allow_path("/tmp", AccessMode::ReadWrite)?
        .block_network();

    // Check platform support
    let support = Sandbox::support_info();
    if !support.is_supported {
        eprintln!("Warning: {}", support.reason);
    }

    // Apply sandbox - irreversible
    Sandbox::apply(&caps)?;

    // Now running sandboxed...
    Ok(())
}
```

**Python (via PyO3):**
```python
import nono_py as nono

caps = nono.CapabilitySet()
caps.allow_path("/project", nono.AccessMode.READ_WRITE)
caps.allow_path("/tmp", nono.AccessMode.READ_WRITE)
caps.block_network()

# Check platform support
support = nono.support_info()
if not support.is_supported:
    print(f"Warning: {support.details}")

# Query before applying
ctx = nono.QueryContext(caps)
result = ctx.query_path("/project/file.txt", nono.AccessMode.READ)
print(result)  # {'status': 'allowed', 'reason': 'granted_path', ...}

# Apply sandbox - irreversible
nono.apply(caps)

# Now running sandboxed...
```

**TypeScript/Node (via napi-rs):**
```typescript
import { CapabilitySet, AccessMode, apply, isSupported, supportInfo } from 'nono-ts';

const caps = new CapabilitySet();
caps.allowPath('/project', AccessMode.ReadWrite);
caps.allowPath('/tmp', AccessMode.ReadWrite);
caps.blockNetwork();

// Check platform support
const support = supportInfo();
if (!support.isSupported) {
  console.warn(`Warning: ${support.details}`);
}

// Apply sandbox - irreversible
apply(caps);

// Now running sandboxed...
```

### Policy Resolver API (Two-Layer Design)

The library exposes two layers: a low-level builder API (`CapabilitySet`) and a policy resolver that transforms JSON group definitions into a `CapabilitySet`. The resolver lives in the `nono` crate as a `policy` module. `Sandbox::apply()` only ever sees `CapabilitySet` — it remains a pure primitive.

```
policy.json + group names --> resolve_groups() --> CapabilitySet --> Sandbox::apply()
                                                       ^
                                               user .allow_path() additions
```

**Rust (library):**
```rust
// crates/nono/src/policy.rs
pub fn resolve_groups(
    policy: &Policy,
    groups: &[&str],
    platform: Platform,
) -> Result<CapabilitySet> { ... }
```

**Python (idiomatic classmethod):**
```python
import nono

# Resolve groups, then layer user paths on top
caps = (nono.CapabilitySet
    .from_policy(policy, groups=["system_read", "deny_credentials"])
    .allow_path("/project", nono.ReadWrite)
    .block_network())

nono.apply(caps)
```

**TypeScript (idiomatic static factory):**
```typescript
import { CapabilitySet, apply } from 'nono';

const caps = CapabilitySet.fromPolicy(policy, ["system_read", "deny_credentials"])
  .allowPath("/project", AccessMode.ReadWrite)
  .blockNetwork();

apply(caps);
```

Each binding wraps the Rust `resolve_groups()` as an idiomatic constructor for its language. The binding layer is thin API-surface adaptation — the Rust library does JSON parsing, group resolution, and platform filtering once.

---

## Binding Implementation

The C FFI is in `bindings/c/src/` (part of the workspace). Python and TypeScript bindings are in separate repos (`../nono-py/src/lib.rs` and `../nono-ts/src/lib.rs`).

All bindings follow the same pattern: a thin wrapper struct with an `inner: RustType` field. Python and Node wrappers expose `&mut self` methods that delegate to the library's mutable API. The C binding uses opaque pointers with `extern "C"` functions that take a handle as the first argument.

### Two-Tier Binding Strategy

| Tier | Bindings | Generator | Target |
|------|----------|-----------|--------|
| Language-specific | nono-py (PyO3), nono-js (napi-rs) | Language FFI generators | Ergonomic, idiomatic APIs for high-traffic languages |
| Universal C ABI | nono-ffi (cbindgen) | `extern "C"` + `nono.h` | Base layer for Go, Swift, Ruby, Java/Kotlin, C#, Zig |

PyO3 and napi-rs remain the recommended bindings for Python and Node.js. The C FFI is for languages without dedicated binding generators.

### Key Pattern: Wrapping CapabilitySet

The Rust library's `CapabilitySet` has two API styles:
- **Builder** (consuming `self`): `caps.allow_path("/tmp", Read)?` — idiomatic Rust chaining
- **Mutable** (`&mut self`): `caps.add_fs(cap)` — for programmatic use

Bindings use the mutable API exclusively because Python and JavaScript have no ownership transfer semantics. The binding's `allow_path()` calls `FsCapability::new_dir()` for validation/canonicalization, then `inner.add_fs()` to add the result.

### Error Mapping

Both bindings convert `NonoError` to language-native exceptions via a `to_py_err()` / `to_napi_err()` function that pattern-matches on the error variant to select the appropriate exception type.

### Deferred Types (all three bindings)

| Type | Reason |
|------|--------|
| `DiagnosticFormatter` | Has lifetime parameter `<'a>` — requires holding a `CapabilitySet` reference alive across the FFI boundary. Cannot be expressed in C without callback-based or copy-out API. |
| `keystore` (`LoadedSecret`) | Uses `Zeroizing<String>` which cannot be safely copied to Python/JS managed memory or C `char*` without defeating its security purpose |
| `platform_rules` | Exposed as `platform_rule(rule: str)` / `nono_capability_set_add_platform_rule()` method but building Seatbelt S-expressions is a CLI concern, not SDK |

---

## Migration Plan

### Phase 1: Workspace Setup - COMPLETE
1. Convert to Cargo workspace - Done
2. Create `crates/nono/` and `crates/nono-cli/` - Done
3. Move core modules to library crate - Done
4. Update CLI to depend on library - Done
5. Ensure `cargo build` produces working `nono` binary - Done
6. All existing tests pass - Done (95 tests)

### Phase 2: API Refinement
1. Design builder pattern for `CapabilitySet`
2. Clean up public API surface
3. Add comprehensive documentation
4. Publish `nono` to crates.io

### Phase 3: Python Bindings - COMPLETE

Canonical repo: `../nono-py/` (separate git repo, published to PyPI as `nono-py`)

| Task | Status | Notes |
|------|--------|-------|
| Create Python binding with PyO3 | Done | PyO3 0.24, abi3-py39 stable ABI |
| Set up maturin build | Done | `pyproject.toml` with maturin backend |
| Implement binding wrappers | Done | All core types exposed |
| Type stubs and py.typed | Done | Full `.pyi` stubs for IDE support |
| Test suite | Done | 5 test files with comprehensive coverage |
| Publish to PyPI as `nono-py` | Pending | Ready for publishing |

#### Python API Surface

| Type | Python API | Notes |
|------|-----------|-------|
| `AccessMode` | `AccessMode.READ`, `.WRITE`, `.READ_WRITE` | Frozen enum with `__repr__`, `__str__`, `__eq__`, `__hash__` |
| `CapabilitySource` | `CapabilitySource.user()`, `.group(name)`, `.system()` | Factory staticmethods |
| `FsCapability` | Read-only getters: `original`, `resolved`, `access`, `is_file`, `source` | Frozen class |
| `CapabilitySet` | Mutable methods: `allow_path()`, `allow_file()`, `block_network()`, `allow_command()`, `block_command()`, `platform_rule()`, `deduplicate()`, `path_covered()`, `fs_capabilities()`, `summary()` | `is_network_blocked` property |
| `SupportInfo` | Read-only getters: `is_supported`, `platform`, `details` | Frozen class |
| `SandboxState` | `from_caps()`, `from_json()` staticmethods; `to_json()`, `to_caps()` methods | JSON round-trip |
| `QueryContext` | `query_path(path, mode)`, `query_network()` returning dicts | Status/reason dicts |
| Module functions | `apply(caps)`, `is_supported()`, `support_info()` | Top-level |

#### Error Mapping

| `NonoError` variant | Python exception |
|---------------------|-----------------|
| `PathNotFound` | `FileNotFoundError` |
| `ExpectedDirectory`, `ExpectedFile` | `ValueError` |
| `PathCanonicalization` | `OSError` |
| `SandboxInit`, `UnsupportedPlatform` | `RuntimeError` |
| `BlockedCommand` | `PermissionError` |
| `ConfigParse`, `ProfileParse` | `ValueError` |
| Other | `RuntimeError` |

#### Design Decisions

- **Mutable methods, not consuming builder**: Python has no ownership semantics. `CapabilitySet` uses `&mut self` methods that return `None`. The Rust builder's consuming `self` pattern is not exposed.
- **Bound API**: Uses PyO3 Bound<'py, T> API (not deprecated GIL refs).
- **Module name**: `_nono_py` (cdylib), published as `nono-py` on PyPI. Python package wraps as `nono_py`.
- **String paths**: Python `str` converted to `Path` internally. No `PathBuf` in the Python API.

### Phase 4: Node.js Bindings - COMPLETE

Canonical repo: `../nono-ts/` (separate git repo, published to npm as `nono-ts`)

| Task | Status | Notes |
|------|--------|-------|
| Create Node binding with napi-rs | Done | napi 3, napi-derive 3 |
| Set up npm build workflow | Done | `package.json` with cross-platform loader |
| Implement binding wrappers | Done | All core types exposed |
| TypeScript definitions | Done | Auto-generated by napi-rs at build time |
| Test suite | Done | 5 test files (platform, query, state, errors, integration) |
| Publish to npm | Pending | Ready for publishing |

#### Node.js/TypeScript API Surface

| Type | JS/TS API | Notes |
|------|----------|-------|
| `AccessMode` | `AccessMode.Read`, `.Write`, `.ReadWrite` | napi enum |
| `FsCapabilityInfo` | Object: `{ original, resolved, access, is_file, source }` | Plain object (napi `#[napi(object)]`) |
| `CapabilitySet` | Constructor + mutable methods: `allowPath()`, `allowFile()`, `blockNetwork()`, `allowCommand()`, `blockCommand()`, `platformRule()`, `deduplicate()`, `pathCovered()`, `fsCapabilities()`, `summary()` | `isNetworkBlocked` getter |
| `SupportInfoResult` | Object: `{ isSupported, platform, details }` | Plain object |
| `SandboxState` | Factory: `SandboxState.fromCaps()`, `.fromJson()`; methods: `toJson()`, `toCaps()` | JSON round-trip |
| `QueryContext` | Constructor + `queryPath(path, mode)`, `queryNetwork()` returning `QueryResultInfo` | Typed result objects |
| `QueryResultInfo` | Object: `{ status, reason, grantedPath?, access?, granted?, requested? }` | Union-like via optional fields |
| Module functions | `apply(caps)`, `isSupported()`, `supportInfo()` | camelCase per JS convention |

#### Design Decisions

- **napi-build MSRV override**: `napi-build` 2.x uses `cargo::` syntax requiring Rust 1.77+. The node binding overrides the workspace MSRV (`rust-version = "1.77"`) while the rest of the workspace stays at 1.74.
- **Object types for read-only data**: `FsCapabilityInfo`, `SupportInfoResult`, `QueryResultInfo` use `#[napi(object)]` (plain JS objects) instead of classes. Avoids reference management overhead.
- **Factory methods**: `SandboxState.fromCaps()` and `.fromJson()` use `#[napi(factory)]` (static methods that return `Self`).
- **Auto TypeScript**: napi-rs generates `index.d.ts` at build time from Rust signatures. No manual type stubs needed.

### Phase 5: C FFI Bindings - COMPLETE

| Task | Status | Notes |
|------|--------|-------|
| Create `bindings/c/` with cbindgen | Done | cbindgen 0.27, auto-generates `include/nono.h` |
| Workspace + Cargo.toml setup | Done | `nono-ffi` crate, cdylib + staticlib |
| Implement `#[repr(C)]` types | Done | 6 enums, 2 structs in `types.rs` |
| Implement error/string helpers | Done | Thread-local `LAST_ERROR`, `nono_string_free()` |
| Implement CapabilitySet wrapper | Done | 12 functions, opaque pointer pattern |
| Implement FsCapability accessors | Done | 7 index-based accessor functions |
| Implement Sandbox wrapper | Done | 3 functions (apply, is_supported, support_info) |
| Implement QueryContext wrapper | Done | 4 functions, flat `NonoQueryResult` struct |
| Implement SandboxState wrapper | Done | 5 functions, JSON round-trip |
| Add Makefile targets | Done | `build-ffi`, `test-ffi` |
| Compile check | Done | Produces `libnono_ffi.dylib` + `libnono_ffi.a` |
| All tests pass | Done | 37 FFI tests, `make ci` clean (181 total) |

#### C API Surface (35 functions)

| Module | Functions | Count |
|--------|-----------|-------|
| Error/String | `nono_last_error`, `nono_clear_error`, `nono_string_free`, `nono_version` | 4 |
| CapabilitySet | `_new`, `_free`, `_allow_path`, `_allow_file`, `_set_network_blocked`, `_allow_command`, `_block_command`, `_add_platform_rule`, `_deduplicate`, `_path_covered`, `_is_network_blocked`, `_summary` | 12 |
| FsCapability | `_fs_count`, `_fs_original`, `_fs_resolved`, `_fs_access`, `_fs_is_file`, `_fs_source_tag`, `_fs_source_group_name` | 7 |
| Sandbox | `_apply`, `_is_supported`, `_support_info` | 3 |
| QueryContext | `_new`, `_free`, `_query_path`, `_query_network` | 4 |
| SandboxState | `_from_caps`, `_free`, `_to_json`, `_from_json`, `_to_caps` | 5 |

#### C-Repr Types

| Type | Kind | Values |
|------|------|--------|
| `NonoAccessMode` | enum | `Read=0`, `Write=1`, `ReadWrite=2` |
| `NonoCapabilitySourceTag` | enum | `User=0`, `Group=1`, `System=2` |
| `NonoQueryStatus` | enum | `Allowed=0`, `Denied=1` |
| `NonoQueryReason` | enum | `GrantedPath=0`, `NetworkAllowed=1`, `PathNotGranted=2`, `InsufficientAccess=3`, `NetworkBlocked=4` |
| `NonoErrorCode` | enum | `Ok=0`, negative values for error categories (`ErrPathNotFound=-1`, ..., `ErrUnknown=-99`) |
| `NonoQueryResult` | struct | Flat struct: `status`, `reason`, nullable `granted_path`, `access`, `granted`, `requested` |
| `NonoSupportInfo` | struct | `is_supported`, `platform` (caller-owned), `details` (caller-owned) |

#### Memory Ownership Rules

1. **Opaque pointers** (`NonoCapabilitySet*`, `NonoQueryContext*`, `NonoSandboxState*`) — caller owns, must free with corresponding `_free()` function
2. **Returned `char*`** — caller owns, must free with `nono_string_free()`
3. **`nono_last_error()` return** — library owns, valid until next failing call on same thread
4. **Input `const char*`** — borrowed, library copies what it needs

#### Error Mapping

| `NonoError` variant | `NonoErrorCode` value |
|---------------------|----------------------|
| `PathNotFound` | `ErrPathNotFound` (-1) |
| `PathCanonicalization` | `ErrPathCanonicalization` (-2) |
| `ExpectedDirectory` | `ErrExpectedDirectory` (-3) |
| `ExpectedFile` | `ErrExpectedFile` (-4) |
| `SandboxInit` | `ErrSandboxInit` (-5) |
| `UnsupportedPlatform` | `ErrUnsupportedPlatform` (-6) |
| `BlockedCommand` | `ErrBlockedCommand` (-7) |
| `ConfigParse`, `ProfileParse` | `ErrConfigParse` (-8) |
| Other | `ErrUnknown` (-99) |

NULL pointer or invalid UTF-8 inputs return `ErrInvalidArg` (-10) with a descriptive `nono_last_error()` message.

#### Design Decisions

- **Thread-local error store**: `nono_last_error()` pattern (like `dlerror()`). Each thread gets its own error string. Thread-local `RefCell<Option<CString>>` avoids synchronization overhead. Error is valid until the next failing call on the same thread.
- **Caller-frees strings**: All returned `char*` are allocated with `CString::into_raw()`. Callers free with `nono_string_free()` (which calls `CString::from_raw()`). This is simpler than arena allocation and matches the `dlerror()` model.
- **Opaque pointers via `Box::into_raw()`**: Handles are heap-allocated Rust structs. `_new()` → `Box::into_raw(Box::new(...))`. `_free()` → `Box::from_raw()`. Never expose struct layout across the ABI boundary.
- **Index-based iteration for FsCapability**: `_fs_count()` + `_fs_original(caps, index)` pattern instead of exposing raw slice pointers. Out-of-bounds returns NULL/defaults instead of panicking. Avoids double-free risks from handing out interior pointers.
- **Flat `NonoQueryResult` struct**: Status discriminant + nullable string fields. Same approach as Node binding's `QueryResultInfo`. Avoids nested unions or tagged unions that are error-prone in C.
- **`unsafe` on free functions**: All `_free()` and `nono_string_free()` are `unsafe extern "C"` because they call `Box::from_raw()` / `CString::from_raw()`, which dereference raw pointers. This satisfies clippy's `not_unsafe_ptr_arg_deref` lint.
- **cbindgen auto-generates header**: `build.rs` runs cbindgen to produce `include/nono.h` on every build. Non-fatal on failure so the crate compiles even without cbindgen installed.
- **Scope exclusions consistent with Python/Node**: `DiagnosticFormatter` (lifetime parameter) and `keystore` (zeroize semantics) are not exposed, matching the other binding crates.

#### Usage Example (C)

```c
#include "nono.h"
#include <stdio.h>

int main(void) {
    // Check platform support
    if (!nono_sandbox_is_supported()) {
        fprintf(stderr, "Sandboxing not supported\n");
        return 1;
    }

    // Build capabilities
    struct NonoCapabilitySet *caps = nono_capability_set_new();
    nono_capability_set_allow_path(caps, "/project", NONO_ACCESS_MODE_READ_WRITE);
    nono_capability_set_allow_path(caps, "/tmp", NONO_ACCESS_MODE_READ_WRITE);
    nono_capability_set_set_network_blocked(caps, true);

    // Query before applying
    struct NonoQueryContext *ctx = nono_query_context_new(caps);
    NonoQueryResult result;
    nono_query_context_query_path(ctx, "/project/file.txt",
                                   NONO_ACCESS_MODE_READ, &result);
    if (result.status == NONO_QUERY_STATUS_ALLOWED) {
        printf("Access granted via: %s\n", result.granted_path);
        nono_string_free(result.granted_path);
        nono_string_free(result.access);
    }
    nono_query_context_free(ctx);

    // Apply sandbox - irreversible
    NonoErrorCode rc = nono_sandbox_apply(caps);
    if (rc != NONO_ERROR_CODE_OK) {
        fprintf(stderr, "Sandbox error: %s\n", nono_last_error());
    }

    nono_capability_set_free(caps);
    return 0;
}
```

---

## Platform Policy Injection: Group-Based JSON Policy

### Problem

The library's `Sandbox::apply(caps)` calls `generate_profile(caps)` internally to produce a Seatbelt profile string (macOS) or Landlock ruleset (Linux). This profile is generated solely from `CapabilitySet`, which only has **allow semantics** — it can express "allow read to /usr" but cannot express "deny read to ~/.ssh".

The old monolith's `generate_profile()` was self-contained with ALL policy in one function. It produced Seatbelt rules that `CapabilitySet` cannot express:

| Old monolith rule | Purpose | Expressible via CapabilitySet? |
|---|---|---|
| `(deny file-read-data (subpath "~/.ssh"))` | Block credential exfiltration | No — no deny semantics |
| `(deny file-write-unlink)` | Block `rm -rf` style attacks | No — no deny semantics |
| `(allow file-write-unlink (subpath "/project"))` | Per-path unlink override | No — no operation-level granularity |
| `(allow file-read* (subpath "/etc"))` | Uncanonicalized symlink path | No — `FsCapability::new_dir()` canonicalizes `/etc` to `/private/etc` |
| `(allow file-write* (subpath "/dev"))` | Direct system path in profile | Partially — goes through canonicalization |
| `(allow file-read* (subpath "$TMPDIR"))` | Dynamic env var in profile | Partially — CLI can resolve and add, but canonicalization may differ |

### Design Constraint

The library must remain a pure sandbox primitive with no built-in security policy (Design Decision #1). The solution must keep policy in the CLI while giving it enough control over profile generation.

### Solution: Two-Layer Architecture

**Layer 1 — Library: `platform_rules` passthrough**

Add a `platform_rules` field to `CapabilitySet`. The library includes these verbatim in the generated Seatbelt profile without interpretation. On Linux (Landlock), they are ignored since Landlock uses a structured API.

```rust
// In crates/nono/src/capability.rs
#[derive(Debug, Clone, Default)]
pub struct CapabilitySet {
    fs: Vec<FsCapability>,
    net_block: bool,
    allowed_commands: Vec<String>,
    blocked_commands: Vec<String>,
    /// Raw platform-specific rules injected verbatim into the sandbox profile.
    /// On macOS: Seatbelt profile expressions (e.g., "(deny file-read-data ...)")
    /// On Linux: Ignored (Landlock uses structured rules, not profiles)
    platform_rules: Vec<String>,
}
```

The library's `generate_profile()` appends these after its own rules:

```rust
// In crates/nono/src/sandbox/macos.rs generate_profile()
// ... existing allow rules from CapabilitySet ...

// Append client-provided platform rules
for rule in caps.platform_rules() {
    profile.push_str(rule);
    profile.push('\n');
}

// Network rules (last)
```

The library has zero built-in policy. It passes through what the client provides.

**Layer 2 — CLI: Group-based JSON policy file**

All security policy is defined declaratively in a single JSON file (`crates/nono-cli/data/policy.json`), replacing the current `security-lists.toml`. The JSON file uses **groups** as the core abstraction — named, composable collections of rules that profiles select by name.

The base sandbox starts with `(deny default)` — everything is blocked. Groups define what gets **allowed** through, and what gets explicitly **denied** (to override broader allows).

### Policy File Structure

Groups use nested `allow` and `deny` objects for a clear taxonomy. Platform-specific groups carry a `platform` tag; groups without it apply to both macOS and Linux. Platform-specific categories (keychains, browser data, dangerous commands) are split into `_macos` and `_linux` variants.

```json
{
  "meta": { "version": 3, "schema_version": "3.0" },
  "base_groups": [
    "deny_credentials", "deny_keychains_macos", "deny_keychains_linux",
    "deny_browser_data_macos", "deny_browser_data_linux", "deny_macos_private",
    "deny_shell_history", "deny_shell_configs",
    "system_read_macos", "system_read_linux", "system_write_macos", "system_write_linux",
    "user_tools", "homebrew",
    "dangerous_commands", "dangerous_commands_macos", "dangerous_commands_linux"
  ],
  "groups": {
    "deny_credentials": {
      "description": "Block access to cryptographic keys, tokens, and cloud credentials",
      "deny": {
        "access": ["~/.ssh", "~/.gnupg", "~/.aws", "~/.azure", "~/.kube", "~/.docker"]
      }
    },
    "deny_keychains_macos": {
      "description": "Block access to macOS keychains and password stores",
      "platform": "macos",
      "deny": { "access": ["~/Library/Keychains", "/Library/Keychains", "~/.password-store"] }
    },
    "deny_keychains_linux": {
      "description": "Block access to Linux keyrings and password stores",
      "platform": "linux",
      "deny": { "access": ["~/.password-store", "~/.local/share/keyrings"] }
    },
    "system_read_macos": {
      "description": "macOS system paths required for executables to function",
      "platform": "macos",
      "allow": { "read": ["/bin", "/usr/lib", "/System/Library", "/etc", "/private/etc", "..."] },
      "symlink_pairs": { "/etc": "/private/etc", "/var": "/private/var", "/tmp": "/private/tmp" }
    },
    "system_write_macos": {
      "description": "macOS paths requiring write for temp files and devices",
      "platform": "macos",
      "allow": { "write": ["/private/tmp", "/tmp", "/dev", "$TMPDIR"] }
    },
    "user_tools": {
      "description": "User-local executables and tool directories",
      "allow": {
        "read": [
          "~/.local/bin", "~/.local/share/applications", "~/.local/share/icons",
          "~/.local/share/fonts", "~/.local/share/man", "~/.local/share/mime",
          "~/.local/state"
        ]
      }
    },
    "user_caches_macos": {
      "description": "User cache, log, and preference directories",
      "platform": "macos",
      "allow": {
        "readwrite": ["~/Library/Caches", "~/Library/Logs"],
        "read": ["~/Library/Preferences"]
      }
    },
    "rust_runtime": {
      "description": "Rust toolchain paths",
      "allow": { "read": ["~/.cargo", "~/.rustup"] }
    },
    "unlink_protection": {
      "description": "Block file deletion globally, override for user-writable paths",
      "deny": { "unlink": true, "unlink_override_for_user_writable": true }
    },
    "dangerous_commands": {
      "description": "Cross-platform commands blocked by default",
      "deny": { "commands": ["rm", "dd", "chmod", "sudo", "mv", "cp"] }
    },
    "dangerous_commands_linux": {
      "description": "Linux-specific commands blocked by default",
      "platform": "linux",
      "deny": { "commands": ["apt", "systemctl", "mkfs", "shred"] }
    }
  }
}
```

The full policy file is at `crates/nono-cli/data/policy.json` with all groups and paths.

### Group Schema

Each group has a `description` field, an optional `platform` field, and nested `allow`/`deny` objects:

| Field | Type | Required | Purpose |
|---|---|---|---|
| `description` | string | yes | Human-readable purpose of the group |
| `platform` | `"macos"` or `"linux"` | no | If set, the resolver skips this group on other platforms. Groups without `platform` apply everywhere. |
| `allow` | object | no | Nested allow operations (`read`, `write`, `readwrite`) |
| `deny` | object | no | Nested deny operations (`access`, `unlink`, `commands`) |
| `symlink_pairs` | object | no | macOS symlink → target path mappings |

### Group Operations

Operations are nested under `allow` or `deny` for a clear taxonomy:

**Allow operations** (nested under `allow`):

| Operation | Seatbelt translation | Purpose |
|---|---|---|
| `allow.read` | `(allow file-read* (subpath "..."))` | Allow reading path and all children |
| `allow.write` | `(allow file-write* (subpath "..."))` | Allow writing to path and all children (write-only) |
| `allow.readwrite` | `(allow file-read* ...)` + `(allow file-write* ...)` | Allow both reading and writing |

**Deny operations** (nested under `deny`):

| Operation | macOS (Seatbelt) | Linux (Landlock) | Purpose |
|---|---|---|---|
| `deny.access` | `(allow file-read-metadata ...)` + `(deny file-read-data ...)` + `(deny file-write* ...)` | No enforcement; path collected in `deny_paths` for overlap validation | Deny both read and write content access; metadata (stat/exists) still allowed |
| `deny.unlink` | `(deny file-write-unlink)` | No enforcement (Seatbelt-specific) | Block file deletion globally |
| `deny.unlink_override_for_user_writable` | `(allow file-write-unlink (subpath "..."))` per user-writable path | No enforcement (Seatbelt-specific) | Override unlink denial for user-granted writable paths |
| `deny.commands` | Application-level check (not Seatbelt) | Application-level check (not Landlock) | Block command execution before exec() [cross-platform] |

**Other fields** (top-level on the group):

| Field | macOS (Seatbelt) | Linux (Landlock) | Purpose |
|---|---|---|---|
| `symlink_pairs` | Adds both symlink and target as separate read rules | No enforcement (macOS symlinks only) | Handle macOS paths where `/etc` and `/private/etc` are both needed |

### Profile Composition

Built-in profiles are defined declaratively in the `profiles` section of `policy.json`. Each profile declares its additional groups (on top of `base_groups`) and can exclude base groups via `trust_groups`. The policy resolver merges them: `final = (base_groups - trust_groups) + profile.security.groups`.

```json
{
  "profiles": {
    "claude-code": {
      "meta": { "name": "claude-code", "version": "1.0.0", "description": "Anthropic Claude Code CLI agent" },
      "security": { "groups": ["user_caches_macos", "node_runtime", "rust_runtime", "unlink_protection"] },
      "trust_groups": [],
      "filesystem": {
        "allow": ["$HOME/.claude"],
        "allow_file": ["$HOME/.claude.json"],
        "read_file": ["$HOME/Library/Keychains/login.keychain-db"]
      },
      "network": { "block": false },
      "workdir": { "access": "readwrite" },
      "hooks": { "claude-code": { "event": "PostToolUseFailure", "matcher": "Read|Write|Edit|Bash", "script": "nono-hook.sh" } },
      "interactive": true
    },
    "openclaw": {
      "meta": { "name": "openclaw", "version": "1.0.0", "description": "OpenClaw messaging gateway" },
      "security": { "groups": ["node_runtime"] },
      "trust_groups": [],
      "filesystem": { "allow": ["$HOME/.openclaw", "$HOME/.config/openclaw", "$HOME/.local", "$TMPDIR/openclaw-$UID"] },
      "workdir": { "access": "read" },
      "interactive": false
    }
  }
}
```

A profile with `trust_groups` can exclude base groups it doesn't need:

```json
{
  "security": { "groups": ["node_runtime"] },
  "trust_groups": ["deny_shell_configs", "dangerous_commands"]
}
```

This removes `deny_shell_configs` and `dangerous_commands` from the base set for that profile, while still inheriting all other base groups.

User-defined profiles are TOML files in `~/.config/nono/profiles/` and follow the same structure as `profile::Profile`.

### User Overrides

Users can trust specific groups via CLI flag:

```
nono run --profile claude-code --trust-group deny_credentials -- claude
```

This removes the `deny_credentials` group for that session, allowing the sandboxed process to read SSH keys, AWS credentials, etc. The trust is explicit, per-session, and auditable.

User config (`~/.config/nono/config.toml`) can also define persistent group overrides:

```toml
[overrides]
trust_groups = ["deny_credentials"]
reason = "Development environment with test credentials only"
```

### CLI Translation Flow

```
policy.json (base_groups + groups + profiles) + CLI args
        │
        ▼
  ProfileDef::to_profile() merges groups:
  (base_groups - trust_groups) + profile.security.groups
        │
        ▼
  CLI applies profile filesystem paths + CLI overrides
        │
        ▼
  For each group:
    allow.read paths       → FsCapability::new_dir(path, Read) into CapabilitySet
    allow.write paths      → FsCapability::new_dir(path, Write) into CapabilitySet
    allow.readwrite paths  → FsCapability::new_dir(path, ReadWrite) into CapabilitySet
    deny.access paths      → always: collect into ResolvedGroups.deny_paths
                              macOS only: caps.add_platform_rule("(deny file-read-data ...)") +
                                          caps.add_platform_rule("(deny file-write* ...)")
    deny.unlink            → macOS only: caps.add_platform_rule("(deny file-write-unlink)")
    deny.commands          → caps.add_blocked_command(cmd) [cross-platform]
    symlink_pairs          → macOS only: caps.add_platform_rule("(allow file-read* ...)")
        │
        ▼
  apply_unlink_overrides() [macOS only: per-writable-path unlink allow rules]
        │
        ▼
  validate_deny_overlaps() [Linux only: warn if deny path is child of allowed path]
        │
        ▼
  Sandbox::apply(caps)
    → macOS: generate_profile() translates CapabilitySet + platform_rules → Seatbelt profile
    → Linux: Landlock ruleset from CapabilitySet (platform_rules ignored)
```

### What Was Replaced (COMPLETE)

All TOML-based security infrastructure has been removed. `policy.json` is the single source of truth.

| Removed | Replaced by |
|---|---|
| `crates/nono-cli/data/security-lists.toml` | `crates/nono-cli/data/policy.json` |
| `crates/nono-cli/src/config/security_lists.rs` | `crates/nono-cli/src/policy.rs` (JSON deserialization + group resolution) |
| `crates/nono-cli/data/profiles/*.toml` | `profiles` section in `policy.json` (declarative JSON) |
| Rust struct construction in `builtin.rs` | `ProfileDef::to_profile()` in `policy.rs` (builtin.rs delegates) |
| Hardcoded `base_groups()` function | `base_groups` array in `policy.json` |
| TOML profile embedding in `build.rs` + `embedded.rs` | `embedded.rs` only embeds `policy.json` |
| Hardcoded system paths in `capability_ext.rs` | `system_read_*` and `system_write_*` groups in `policy.json` |
| Hardcoded writable paths in `capability_ext.rs` | `system_write_*` and `user_caches_*` groups in `policy.json` |
| Sensitive path denials | `deny_*` groups in `policy.json` |
| Unlink blocking | `unlink_protection` group in `policy.json` |
| Symlink handling | `symlink_pairs` in group definitions |

### Why JSON

- Universally parseable across Rust, Python, TypeScript without additional dependencies
- Policy file is machine-consumed, not hand-edited by end users (profiles are the user-facing config)
- **Single file covers both macOS and Linux** — platform-tagged groups are filtered by the resolver at runtime
- **Compiled into the CLI binary** via `build.rs` (same embedding mechanism as current `security-lists.toml`)
- The library's `policy` module can also parse the same JSON, so Python/TypeScript SDK consumers get groups without reimplementing resolution
- Can be signed and verified for integrity

### Why Groups

- **Composability** — profiles are a list of group names, not a wall of paths
- **Granular override** — users trust at the group level (`--trust-group deny_credentials`), not individual paths
- **Auditability** — `nono why ~/.ssh` reports "blocked by group: deny_credentials"
- **Extensibility** — user config can define custom groups without modifying embedded policy
- **Cross-platform** — groups can be platform-tagged (the CLI filters by current OS at resolution time)

### Platform Enforcement Strategy

**macOS (Seatbelt):**
- `(deny default)` base, selective allows and denies via groups
- Full deny-within-allow support (`deny_read_content`, `deny_unlink`)
- `(deny network*)` for network blocking
- Symlink pairs (`/etc` ↔ `/private/etc`) handled via `platform_rules`

**Linux (Landlock tiered):**

| ABI | Capabilities | Kernel | Enterprise Linux |
|---|---|---|---|
| v1-v3 | Filesystem only | 5.13-6.1 | RHEL 9.0-9.3, Ubuntu 22.04 |
| v4 | Filesystem + **TCP network filter** | 6.7+ | RHEL 9.4+, Ubuntu 24.04 |
| v5 | Filesystem + TCP network + **device ioctl restriction** | 6.10+ | RHEL 9.5+, Ubuntu 24.10 |

- **No namespaces** — works inside standard containers without extra capabilities
- **Deny groups as exclusion filters** — `deny_credentials` means "don't grant access to ~/.ssh" (Landlock cannot express deny-within-allow)
- **Platform-aware resolver** — `deny.access`, `deny.unlink`, and `symlink_pairs` only generate Seatbelt `platform_rules` on macOS. On Linux, deny paths are collected for overlap validation but produce no Landlock rules
- **Overlap detection** — `validate_deny_overlaps()` checks if any deny path falls under a broader allow and warns on Linux. Data-level fixes (narrowing allow groups) are the primary mitigation
- **Graceful degradation** — use the best available ABI, warn about what couldn't be enforced
- **`nono setup`** reports detected ABI and coverage gaps

Landlock v4 TCP filtering covers the primary agent threat: HTTP/HTTPS exfiltration. UDP exfiltration (DNS tunneling) remains possible until a future ABI. On macOS, `(deny network*)` blocks all protocols.

### CapabilitySource Tagging

All `FsCapability` entries carry a `source` field:

```rust
pub struct FsCapability {
    pub original: PathBuf,
    pub resolved: PathBuf,
    pub access: AccessMode,
    pub is_file: bool,
    pub source: CapabilitySource,
}

pub enum CapabilitySource {
    User,           // --allow, --read, profile filesystem section
    Group(String),  // "system_read_macos", "node_runtime", etc.
}
```

System paths go through `CapabilitySet` (not bypassed via `platform_rules`) so that `CapabilitySet` is the single source of truth. `nono why` can explain any path. Security audits see the complete picture. For macOS symlink pairs, the canonical path goes through `FsCapability` and the non-canonical symlink goes via `platform_rules`.

### SandboxState Group Diagnostics

`SandboxState` stores group metadata compactly for post-apply diagnostics:

```rust
pub struct SandboxState {
    // ... existing fields ...
    pub profile: String,
    pub active_groups: Vec<String>,
    pub trusted_groups: Vec<String>,
    pub user_paths: Vec<(String, AccessMode)>,
    pub policy_hash: String,
}
```

`nono why` resolves denied paths back to groups:
1. Read `SandboxState` from `NONO_STATE` env var
2. Load embedded `policy.json` (compiled into binary)
3. Intersect `active_groups` with policy, exclude `trusted_groups`
4. Match queried path against group rules
5. Report matching group, rule type, and suggested fix

```
$ nono why ~/.ssh/id_rsa
Access:  DENIED (file-read-data)
Group:   deny_credentials
Reason:  Block access to cryptographic keys and tokens
Rule:    deny.access matched ~/.ssh
Fix:     nono run --trust-group deny_credentials ...
```

---

## Credential Isolation Strategy

### Problem

Agents need API keys to function (Anthropic, OpenAI, internal services). Once a key is loaded into the sandboxed process's memory, a compromised agent can read it — the sandbox controls filesystem and network access, not intra-process memory. The keystore protects credentials at rest; credential isolation protects them at use time.

### Protection Spectrum

| Level | Mechanism | Key in agent memory? | Exfiltration risk |
|---|---|---|---|
| 1. Keystore + zeroize | Load from Keychain/Vault, clear after use | Yes (briefly) | Medium — window exists during HTTP request |
| 2. Network restriction | Sandbox blocks outbound to unauthorized hosts | Yes | Low — key is present but can't be sent anywhere |
| 3. **Proxy** | Separate process holds key, agent connects to local socket | **No** | **Minimal** — agent never has the key |
| 4. Short-lived tokens | Proxy mints scoped, time-limited tokens | No (only token) | Minimal — token expires quickly if stolen |
| 5. Hardware-backed | Yubikey/TPM signs requests, key never leaves device | No | None — key is not extractable |

Levels 1-2 are achievable now. Level 3 (proxy) is the target for enterprise. Levels 4-5 build on the proxy.

### Proxy Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   Sandboxed Agent    │     │    nono-proxy         │
│                      │     │                       │
│  HTTP to localhost   │────▶│  Holds master key     │
│                      │     │  Injects auth header  │
│  Never sees the key  │◀────│  Forwards to real API │
│                      │     │  Rate limits + logs   │
└──────────────────────┘     └──────────────────────┘
     (sandboxed)                  (unsandboxed)
```

The proxy:
- Holds credentials outside the sandboxed process
- Injects `Authorization` headers on outbound requests
- Can rate limit, restrict endpoints, and log every API call
- Can mint short-lived scoped tokens instead of sharing master keys

### Library Trait Design

The library's `keystore` module exposes a `CredentialProvider` trait. The current Keychain/Vault loader becomes one implementation. The proxy becomes another. SDK consumers (Python/TypeScript/Rust) program against the trait.

```rust
// crates/nono/src/keystore.rs

/// How credentials are provided to the sandboxed process
pub enum CredentialMode {
    /// Key loaded directly into process memory.
    /// Use with zeroize — clear as soon as possible.
    Direct { key: SecretString },

    /// Key held by an external proxy. Agent connects to this
    /// endpoint for API calls. Key never enters the process.
    Proxy { endpoint: SocketAddr },

    /// Key held in hardware (Yubikey/TPM/HSM).
    /// Signing happens on-device, key is not extractable.
    Hardware { device_id: String },
}

/// Trait for credential backends
pub trait CredentialProvider: Send + Sync {
    /// Load credential for a named service
    fn load(&self, service: &str) -> Result<CredentialMode>;

    /// Provider name for diagnostics
    fn provider_name(&self) -> &str;
}
```

Built-in implementations (in library):
- `KeychainProvider` — macOS Keychain (existing `keystore.rs`)
- `EnvProvider` — environment variable with zeroize

Future implementations:
- `ProxyProvider` — connects to `nono-proxy` (CLI or separate binary)
- `VaultProvider` — HashiCorp Vault API
- `OnePasswordProvider` — 1Password CLI/SDK
- `HardwareProvider` — PKCS#11 / Yubikey

### Integration with Sandbox

The credential mode informs sandbox configuration:

| Mode | Network requirement | Filesystem requirement |
|---|---|---|
| `Direct` | Agent needs outbound to API host | Agent needs keystore access (blocked after load) |
| `Proxy` | Agent needs localhost only | No keystore access needed |
| `Hardware` | Agent needs outbound to API host | Agent needs device access (`/dev/...`) |

In proxy mode, the sandbox can restrict network to localhost-only — the proxy handles external connections. This is the strongest posture: the agent has no API key and no outbound network access.

### Architectural Decision

The `CredentialProvider` trait is part of the library's public API. This ensures:
- Python/TypeScript bindings expose the same abstraction
- SDK users can implement custom providers (corporate Vault, custom HSM)
- The proxy model works identically across all language bindings
- Future credential backends don't require library API changes

The proxy implementation itself is a separate binary or library component — not part of the initial library release, but the trait ensures the API surface is ready for it.

---

## Resolved Design Questions

### UQ1: Linux deny-within-allow mechanism

Landlock is strictly allow-list. Deny groups (`deny_credentials`, `deny_keychains`, etc.) cannot work the same way on Linux as on macOS.

**Resolution:** Two-pronged approach. (1) The resolver is platform-aware: `deny.access` paths always go into `ResolvedGroups.deny_paths` for tracking, but only generate Seatbelt `platform_rules` on macOS. Same for `deny.unlink` and `symlink_pairs`. On Linux, these produce no Landlock rules since Landlock has no deny semantics. (2) `validate_deny_overlaps()` detects deny paths that fall under broader allows on Linux and warns. The primary mitigation is data-level: narrowing allow groups so deny paths are never covered (e.g., `user_tools` was narrowed from `~/.local/share` to specific subdirs to eliminate the `~/.local/share/keyrings` overlap with `deny_keychains_linux`). See Platform Enforcement Strategy section and Design Decision #16.

---

### UQ2: System paths and CapabilitySet

System paths from groups could either go through `FsCapability` (canonicalization + CapabilitySet) or straight into `platform_rules` as raw Seatbelt strings.

**Resolution:** System paths go through `CapabilitySet` with `CapabilitySource::Group` tagging. `CapabilitySet` is the single source of truth for auditability. macOS symlink pairs use `platform_rules` as a contained workaround. See CapabilitySource Tagging section.

---

### UQ3: Library profile generation ownership

If the CLI injects most rules via `platform_rules`, the library's `generate_profile()` becomes a thin skeleton.

**Resolution:** Library keeps `generate_profile()` with `platform_rules` passthrough. Python/TypeScript SDK users need `nono.apply(caps)` to work without building Seatbelt profiles. The library provides the basic profile; `platform_rules` extends it.

---

### UQ4: Config format consistency

Policy is JSON, user config is TOML.

**Resolution:** `policy.json` is the single source of truth for all machine-consumed data: groups, base_groups, and built-in profile definitions. `builtin.rs` delegates to the policy resolver (`ProfileDef::to_profile()`). User-defined profiles remain TOML in `~/.config/nono/profiles/`. User config remains TOML. The `ProfileDef` type in policy.rs handles JSON deserialization; `Profile` type in profile/mod.rs handles both JSON (via `ProfileDef` conversion) and TOML (direct deserialization).

---

### UQ5: `allow_write` semantics

Does `allow_write` in a group mean write-only or read+write?

**Resolution:** `allow_write` means write-only. `allow_readwrite` is a separate operation. System writable paths like `/dev` get write-only. User project paths get readwrite.

---

### UQ6: `nono why` after sandbox is applied

After `Sandbox::apply()`, group information is gone. `nono why` needs to map denied paths back to groups.

**Resolution:** Store profile name, active group names, trusted groups, user paths, and policy hash in `SandboxState`. `nono why` re-resolves from embedded `policy.json` at query time. Compact (fits in env var), captures runtime overrides, provides actionable diagnostics. See SandboxState Group Diagnostics section.

---

### Previously Resolved

1. **Async support?** — Synchronous for now, API designed for async compatibility (avoid `&mut self`).
2. **WASM target?** — Compile-time support with clear error messaging. Returns `UnsupportedPlatform` at runtime.
3. **Version synchronization** — Use `workspace.package` (idiomatic Rust).
4. **Error types** — Keep detailed `NonoError` enum, let binding generators convert.
5. **DiagnosticFormatter in bindings?** — Deferred across all three bindings. Lifetime `<'a>` complicates FFI. Bindings can call `caps.summary()` / `nono_capability_set_summary()` instead.
6. **Keystore in bindings?** — Deferred across all three bindings. `Zeroizing<String>` cannot be safely copied to Python/JS/C managed memory. Credential loading should happen in Rust.
7. **PyO3 version** — 0.24 with `abi3-py39` stable ABI (compatible Python 3.9+). Uses Bound<'py, T> API.
8. **napi-rs version** — napi 3.8 / napi-derive 3.5 / napi-build 2.3. Auto-generates TypeScript definitions.
9. **C FFI approach** — `extern "C"` with cbindgen-generated header. Opaque pointer pattern with `Box::into_raw()`/`Box::from_raw()`. Thread-local error store via `nono_last_error()`. Produces both `cdylib` (.dylib/.so) and `staticlib` (.a).
10. **C FFI free function safety** — All `_free()` functions marked `unsafe extern "C"` to satisfy clippy `not_unsafe_ptr_arg_deref`. Callers must ensure pointers were produced by corresponding `_new()`/factory functions.

---

## References

- [PyO3 User Guide](https://pyo3.rs/)
- [napi-rs Documentation](https://napi.rs/)
- [cbindgen User Guide](https://github.com/mozilla/cbindgen)
- [Cargo Workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html)
- [DESIGN-diagnostic-and-supervisor.md](./DESIGN-diagnostic-and-supervisor.md) - Process model, Supervised mode, IPC capability expansion
- [DESIGN-undo-system.md](./DESIGN-undo-system.md) - Content-addressable snapshot system, audit trail, restoration
