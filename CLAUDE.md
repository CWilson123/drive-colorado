# Drive Colorado - Development Guidelines

## Architecture Principles
- All configurable values (coordinates, zoom levels, API endpoints, colors, timeouts, etc.) must go in src/constants/ with explicit, descriptive names
- Never hardcode magic numbers or strings in components
- Use TypeScript strict mode - all types must be explicit
- Components should be small and single-purpose

## File Structure
- src/constants/ - All configuration values, organized by domain
  - map.ts - Map-related constants (coordinates, zoom, bounds)
  - api.ts - API endpoints and keys
  - theme.ts - Colors, spacing, typography
- src/components/ - Reusable UI components
- src/screens/ - Full screen views
- src/services/ - API calls and data fetching
- src/types/ - TypeScript interfaces and types
- src/hooks/ - Custom React hooks

## Naming Conventions
- Constants: SCREAMING_SNAKE_CASE (e.g., DEFAULT_MAP_CENTER)
- Components: PascalCase (e.g., MapView.tsx)
- Hooks: camelCase with 'use' prefix (e.g., useRoadConditions.ts)
- Types/Interfaces: PascalCase with descriptive names (e.g., RoadCondition)

## Map Configuration
- Map provider: MapLibre with OpenStreetMap tiles
- Default center: Denver area (will be defined in constants)
- Default zoom: State-wide view of Colorado

## Data Sources
- Road conditions: COtrip.org API
- Traffic cameras: COtrip.org API
- Weather: National Weather Service API

## Documentation Maintenance

### Documentation Structure
All component and folder documentation follows this structure:
- **Location**: Each folder/component has a `README.md` or `.md` file
- **Format**: Markdown with frontmatter for LLM parsing
- **Cross-references**: Use relative paths `[Link](../other-folder/README.md)`
- **Tags**: Include `#tag` format for LLM categorization

### Creating/Updating Documentation

When modifying code:
1. **Component Changes**: Update that component's README.md
2. **Folder Changes**: Update that folder's README.md
3. **New Files**: Add to parent folder README file structure
4. **Cross-reference Updates**: Update any related documentation

### LLM-Efficient Documentation Format

Each README.md must include:

```markdown
# [Name]

#metadata
- type: [component|folder|hook|service|type|screen]
- related: [comma-separated paths to related files]
- last_updated: [YYYY-MM-DD]
- tags: [comma-separated keywords]
#end-metadata

## Purpose
[Concise description]

## Dependencies
- **Internal**: [List of imports from @/...]
- **External**: [NPM packages]

## API/Interface
[For components: Props table]
[For folders: Export table]
[For services: Functions table]

## Usage Example
\`\`\`typescript
// Code example
\`\`\`

## Related Files
- [Path 1](path1) - Description
- [Path 2](path2) - Description

## Design Principles Applied
[References to specific principles from this file]

## Implementation Notes
[Gotchas, performance considerations, etc.]
```

### Documentation Update Commands

```bash
# To update documentation for a specific file:
1. Read the current file
2. Update documentation to match changes
3. Update `last_updated` metadata
4. Update cross-references if needed

# To find outdated documentation:
grep -r "last_updated: [0-9]{4}-[0-9]{2}-[0-9]{2}" src/
```

### Rules for LLM Efficiency

1. **Always use frontmatter** with `#metadata` block for parsing
2. **Cross-reference everything** - never duplicate information
3. **Use absolute paths** from `/src/` for consistency (e.g., `src/components/Map/`)
4. **Keep examples minimal** - show only the essential usage
5. **Tag everything** - use descriptive tags for LLM context
6. **Update timestamps** - maintain `last_updated` field
7. **Single source of truth** - if info exists elsewhere, link to it
8. **Avoid prose** - use tables, lists, and code blocks
