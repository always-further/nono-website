# TODO

## Theme: Light/Dark Mode + Mintlify Sync

- [ ] Add a user-facing theme toggle on `nono.sh` with modes: `light`, `dark`, `system`.
- [ ] Implement theme state on the main site (`<html>` should use `class="dark"` for dark mode).
- [ ] Persist theme preference in local storage using Mintlify's key:
  - key: `isDarkMode`
  - values:
    - `true` => dark
    - `false` => light
    - `system` => follow OS
- [ ] On main-site load, initialize theme from `localStorage.getItem("isDarkMode")` so docs-first users get the same theme on `nono.sh`.
- [ ] When theme changes on main site, always sync `isDarkMode`:
  - `dark` => `localStorage.setItem("isDarkMode", "true")`
  - `light` => `localStorage.setItem("isDarkMode", "false")`
  - `system` => `localStorage.setItem("isDarkMode", "system")`
- [ ] If using `next-themes`, add bidirectional sync:
  - read initial value from `isDarkMode`
  - write back to `isDarkMode` whenever `next-themes` updates
- [ ] QA across both `nono.sh` and `nono.sh/docs`:
  - set theme on main site, confirm docs matches
  - set theme in docs, confirm main site matches
  - validate `system` mode respects OS changes
  - test hard refresh and new tab behavior

## Notes

- `nono.sh` and `nono.sh/docs` share local storage because they are on the same origin.
- No cookie/header sync required for theme propagation to Mintlify docs.
