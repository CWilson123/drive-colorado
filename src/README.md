# Drive Colorado - Source Code Structure

#metadata
- type: folder
- related: src/components/README.md, src/constants/README.md, src/hooks/README.md, src/screens/README.md, src/services/README.md, src/types/README.md
- last_updated: 2026-02-02
- tags: structure, source, organization
#end-metadata

## Purpose
This directory contains the main source code for the Drive Colorado app.

## Dependencies
- **Internal**: None
- **External**: React Native 0.81.5, React 19.1.0, Expo ~54.0.32

## Directory Structure

| Directory | Purpose | Documentation |
|-----------|---------|----------------|
| `/components` | Reusable UI components | [components/README.md](components/README.md) |
| `/constants` | App-wide configuration and constants | [constants/README.md](constants/README.md) |
| `/hooks` | Custom React hooks | [hooks/README.md](hooks/README.md) |
| `/screens` | Main screen components | [screens/README.md](screens/README.md) |
| `/services` | API integrations and business logic | [services/README.md](services/README.md) |
| `/types` | TypeScript type definitions | [types/README.md](types/README.md) |
| `/assets` | Static assets (images, icons) | - |

## Related Files
- [CLAUDE.md](../../CLAUDE.md) - Development guidelines and architecture principles
- [REPOSITORY_SUMMARY.md](../../REPOSITORY_SUMMARY.md) - Comprehensive repository documentation

## Design Principles Applied
- **Centralized configuration**: All constants in `src/constants/`
- **Type safety**: Explicit TypeScript interfaces in `src/types/`
- **Component organization**: Reusable components in `src/components/`
- **Separation of concerns**: Services, types, hooks in dedicated folders

## Implementation Notes
- Barrel exports (`index.ts` files) for clean imports
- Component types separated into `.types.ts` files
- Constants organized by domain (map, colors, layout, API)
- Services include both API fetching and data parsing logic
