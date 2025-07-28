# Azure Communication Services Dependency Management Guide
 
> **Note:** Version numbers shown in this document are for demonstration purposes only and may not reflect the latest available versions. Always check npm for the most current version information.
 
## Quick Flavor Switching
 
### Switch to Beta Flavor
**Estimated Time:** ~8-10 minutes total
 
```bash
# Switch to beta and update packages
rush switch-flavor:beta          # ~30 seconds
rush update                      # ~2 seconds
rush build                       # ~8 minutes
```
 
### Switch to Stable Flavor  
**Estimated Time:** ~12-15 minutes total
 
```bash
# Update to stable variants and switch
rush switch-flavor:stable        # ~7 seconds
rush update:stable               # ~8 seconds
rush build                       # ~4.5 minutes
```
 
## Complete Dependency Updates
 
For updating **all** Azure Communication Services dependencies (not just communication-calling):
 
### Update to Latest Beta Dependencies
**Estimated Time:** ~10-12 minutes total
 
```bash
rush switch-flavor:beta          # Auto-updates packages (~30-45 seconds)
rush update --full               # Ensure full sync (~30-45 seconds)
rush rebuild                     # Verify compatibility (~8-10 minutes)
```
 
**Expected Updates:**
- `@azure/communication-calling`: Latest beta (e.g., `1.38.1-beta.1`)
- `@azure/communication-chat`: Latest beta (e.g., `1.6.0-beta.7`)
- `@azure/communication-common`: Latest stable (e.g., `2.4.0`)
- `@azure/communication-signaling`: Latest beta (e.g., `1.0.0-beta.33`)
- `@azure/communication-calling-effects`: Latest stable
 
### Update to Latest Stable Dependencies
**Estimated Time:** ~10-12 minutes total
 
```bash
rush switch-flavor:stable        # Switch environment (~30-45 seconds)
rush update --full --variant stable  # Update to stable versions (~30-45 seconds)
rush rebuild                     # Verify compatibility (~8-10 minutes)
```
 
**Expected Updates:**
- `@azure/communication-calling`: Latest stable (e.g., `1.37.2`)
- `@azure/communication-chat`: Latest stable (e.g., `1.6.0`)
- `@azure/communication-common`: Latest stable (e.g., `2.4.0`)
- `@azure/communication-signaling`: Latest stable (e.g., `1.0.0-beta.34`)
- `@azure/communication-calling-effects`: Latest stable (e.g., `1.1.4`)
 
## Verification
 
### Version Check
```bash
# Verify package versions
cat common/temp/node_modules/@azure/communication-calling/package.json | grep version
cat common/temp/node_modules/@azure/communication-chat/package.json | grep version
cat common/temp/node_modules/@azure/communication-common/package.json | grep version
```
 
### Expected Version Indicators
- **Beta**: Version includes `-beta` suffix and `"types": "types/communication-calling-beta.d.ts"`
- **Stable**: Version without `-beta` suffix and `"types": "types/communication-calling.d.ts"`
 
### Configuration Files
- **Beta**: [`common/config/rush/common-versions.json`](common/config/rush/common-versions.json)
- **Stable**: [`common/config/rush/variants/stable/common-versions.json`](common/config/rush/variants/stable/common-versions.json)
 
### Build Success Indicators
- All packages build successfully (22/24 typically pass, 2/24 pass with warnings)
- Minor TypeScript warnings are acceptable and non-blocking
- No critical build failures
 
## Build Error Handling
 
**Important:** If any build step fails, **STOP immediately** and do not proceed.
 
**Protocol:**
1. **Stop on First Error:** Do not continue if `rush rebuild` or `rush build` fails
2. **Capture Error Details:** Note specific package(s) and error messages
3. **Summarize the Problem:** Include:
   - Which step failed
   - Which package(s) had build errors
   - Key error messages
   - Suggested next steps
 
**Example Error Summary:**
```
Build failed during rush rebuild of beta dependency update.
 
Failed packages:
- @azure/communication-react: TypeScript compilation errors
- packages/react-composites: Dependency resolution issues
 
Key errors:
- TS2304: Cannot find name 'CallClientState'
- Package version conflicts between @azure/communication-calling@1.38.1-beta.1 and @azure/communication-common@2.3.2-beta.1
 
Recommended action: Investigate breaking changes in beta versions.
```
 
## PR Documentation Guidelines
 
**Major Changes:**
- List each dependency version change (from → to)
- Note any version regressions or notable changes
- Highlight beta/stable version switches
 
**Build Verification:**
- Confirm successful build completion (e.g., "22/24 packages built successfully")
- Note any warnings
- Mention build time and success rate
 
**Impact:**
- **Beta**: Access to latest features/fixes, prepares for testing cutting-edge functionality
- **Stable**: Production-ready stability, maintains backward compatibility
 
## Example Prompts
 
### Beta Update
```
Switch to beta flavor and update all Azure Communication Services dependencies to the latest beta versions. Use the dependency-management-guide.md to understand how to do this.
```
 
### Stable Update
```
Switch to stable flavor and update all Azure Communication Services dependencies to the latest stable versions. Use the dependency-management-guide.md to understand how to do this.
```
 
### Both Beta and Stable Updates
```
Switch to beta, update all Azure Communication Services dependencies to latest beta versions, then switch to stable and update to latest stable versions. Use the dependency-management-guide.md to understand how to do this.
```
 
These prompts guide the assistant to follow the proper sequence, update configuration files, and verify installations.

## @typespec/ts-http-runtime Version Synchronization

### Overview
The `@typespec/ts-http-runtime` package requires version synchronization between `pnpm-lock.yaml` and the Jest configuration file.

### Location
- **pnpm-lock.yaml**: [`common/temp/pnpm-lock.yaml`](../common/temp/pnpm-lock.yaml)
- **Jest configuration**: [`common/config/jest/jest.config.js`](../common/config/jest/jest.config.js)

### Current Configuration
```javascript
// In jest.config.js
moduleNameMapper: {
  '^@typespec/ts-http-runtime/internal/(.*)$':
    '<rootDir>/../../../common/temp/node_modules/.pnpm/@typespec+ts-http-runtime@0.3.0/node_modules/@typespec/ts-http-runtime/dist/commonjs/$1/internal.js'
},
```

### Required Action
Whenever `@typespec/ts-http-runtime` is updated in the [`pnpm-lock.yaml`](../common/temp/pnpm-lock.yaml) file, the corresponding version in [`jest.config.js`](../common/config/jest/jest.config.js) must be updated to match.

#### Steps:
1. Check the new version in [`pnpm-lock.yaml`](../common/temp/pnpm-lock.yaml)
2. Update the version number in the path string in [`jest.config.js`](../common/config/jest/jest.config.js):
   - Change `@typespec+ts-http-runtime@0.3.0` to match the new version
   - Example: `@typespec+ts-http-runtime@0.4.0` if that's the new version

#### Example Update:
```javascript
// Before (version 0.3.0)
'^@typespec/ts-http-runtime/internal/(.*)$':
  '<rootDir>/../../../common/temp/node_modules/.pnpm/@typespec+ts-http-runtime@0.3.0/node_modules/@typespec/ts-http-runtime/dist/commonjs/$1/internal.js'

// After (version 0.4.0)
'^@typespec/ts-http-runtime/internal/(.*)$':
  '<rootDir>/../../../common/temp/node_modules/.pnpm/@typespec+ts-http-runtime@0.4.0/node_modules/@typespec/ts-http-runtime/dist/commonjs/$1/internal.js'
```

### Why This Is Required
This mapping is a workaround for ESM issues (see [Azure SDK issue #34195](https://github.com/Azure/azure-sdk-for-js/issues/34195#issuecomment-2850957045)). The Jest configuration needs to point to the exact version path in the pnpm store to properly resolve the internal modules.

### Automation Opportunities
Consider implementing a pre-commit hook or CI check to automatically verify this synchronization and prevent version mismatches.
 