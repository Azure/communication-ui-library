# Instructions for Switching to Beta Flavor

> **Note:** Version numbers shown in this document are for demonstration purposes only and may not reflect the latest available versions. Always check npm for the most current version information.

To switch to the "beta" flavor of the `@azure/communication-calling` package and ensure everything is set up correctly, follow these steps in your terminal:

**Estimated Time:** ~8-10 minutes total

1. **Switch to Beta Flavor:**
   Run the following command to switch to the beta flavor:
   ```bash
   rush switch-flavor:beta
   ```
   *Estimated time: ~30 seconds*

2. **Update Packages:**
   After switching to the beta flavor, update the packages to ensure that the version of `@azure/communication-calling` is pointed to the beta version:
   ```bash
   rush update
   ```
   *Estimated time: ~2 seconds (usually already up-to-date from step 1)*

3. **Verify Beta Version:**
   To confirm you're using the beta version, check the installed package:
   ```bash
   cat common/temp/node_modules/@azure/communication-calling/package.json
   ```
   You should see `"version": "X.Y.Z-beta.N"` (or similar beta version) and `"types": "types/communication-calling-beta.d.ts"`

4. **Build the Project:**
   Finally, run the build command to ensure everything is compiled and ready to use:
   ```bash
   rush build
   ```
   *Estimated time: ~8 minutes*

# Instructions for Switching to Stable Flavor

To switch to the "stable" flavor of the `@azure/communication-calling` package and ensure everything is set up correctly, follow these steps in your terminal:

**Estimated Time:** ~12-15 minutes total

1. **Update to Stable Variants:**
  Run the following command to update packages using the stable variant:
  ```bash
  rush update:stable
  ```
  *Estimated time: ~8 seconds*

2. **Switch to Stable Flavor:**
  Run the following command to switch to the stable flavor:
  ```bash
  rush switch-flavor:stable
  ```
  *Estimated time: ~7 seconds*

3. **Update Packages:**
  After switching to the stable flavor, update the packages to ensure everything is in sync:
  ```bash
  rush update
  ```
  *Estimated time: ~2 seconds (usually already up-to-date from step 2)*

4. **Verify Stable Version:**
  To confirm you're using the stable version, check the installed package:
  ```bash
  cat common/temp/node_modules/@azure/communication-calling/package.json
  ```
  You should see `"version": "1.37.1"` (without `-beta` suffix) and `"types": "types/communication-calling.d.ts"`

5. **Build the Project:**
  Finally, run the build command to ensure everything is compiled and ready to use:
  ```bash
  rush build
  ```
  *Estimated time: ~4.5 minutes*

# Instructions for Updating All Beta Dependencies

To efficiently update all Azure Communication Services dependencies to their latest beta versions (not just `@azure/communication-calling`), follow these streamlined steps:

**Estimated Time:** ~10-12 minutes total

1. **Switch to Beta Flavor:**
   Run the following command to switch to the beta flavor:
   ```bash
   rush switch-flavor:beta
   ```
   *This command automatically updates packages and installs the latest beta versions defined in the configuration.*
   *Estimated time: ~30-45 seconds*

2. **Full Update (Recommended):**
   Ensure all dependencies are fully synchronized:
   ```bash
   rush update --full
   ```
   *This ensures all packages are updated and dependency resolution is complete.*
   *Estimated time: ~30-45 seconds*

3. **Rebuild and Verify:**
   Build the entire project to ensure beta compatibility:
   ```bash
   rush rebuild
   ```
   *This verifies that all packages build successfully with the new beta versions.*
   *Estimated time: ~8-10 minutes*

## Expected Beta Dependency Updates

When switching to beta flavor, the following Azure Communication Services dependencies will typically be updated:

- **@azure/communication-calling**: Latest beta version (e.g., `1.38.1-beta.1`)
- **@azure/communication-chat**: Latest beta version (e.g., `1.6.0-beta.7`)
- **@azure/communication-common**: Latest beta version (e.g., `2.3.2-beta.1`)
- **@azure/communication-signaling**: Latest beta version (e.g., `1.0.0-beta.33`)
- **@azure/communication-calling-effects**: Latest version (typically stable)

# Instructions for Updating All Stable Dependencies

To efficiently update all Azure Communication Services dependencies to their latest stable versions, follow these streamlined steps:

**Estimated Time:** ~10-12 minutes total

1. **Switch to Stable Flavor:**
   Run the following command to switch to the stable flavor:
   ```bash
   rush switch-flavor:stable
   ```
   *This command switches the environment to use stable variants.*
   *Estimated time: ~30-45 seconds*

2. **Full Update with Stable Variant:**
   Update all dependencies using the stable variant configuration:
   ```bash
   rush update --full --variant stable
   ```
   *This ensures all packages are updated to their latest stable versions and dependency resolution is complete.*
   *Estimated time: ~30-45 seconds*

3. **Rebuild and Verify:**
   Build the entire project to ensure stable compatibility:
   ```bash
   rush rebuild
   ```
   *This verifies that all packages build successfully with the new stable versions.*
   *Estimated time: ~8-10 minutes*

## Expected Stable Dependency Updates

When updating to stable versions, the following Azure Communication Services dependencies will typically be updated:

- **@azure/communication-calling**: Latest stable version (e.g., `1.37.2`)
- **@azure/communication-chat**: Latest stable version (e.g., `1.6.0`)
- **@azure/communication-common**: Latest stable version (e.g., `2.4.0`)
- **@azure/communication-signaling**: Latest stable version (e.g., `1.0.0-beta.34`)
- **@azure/communication-calling-effects**: Latest stable version (e.g., `1.1.4`)

## Build Error Handling

**Important:** If any build step fails during the update process, **STOP immediately** and do not proceed with remaining steps. Follow this protocol:

1. **Stop on First Error:** Do not continue with subsequent commands if `rush rebuild` or `rush build` fails
2. **Capture Error Details:** Note the specific package(s) that failed and the error messages
3. **Summarize the Problem:** Provide a clear summary including:
   - Which step failed (e.g., "rush rebuild failed during stable dependency update")
   - Which package(s) had build errors
   - Key error messages or TypeScript compilation errors
   - Suggested next steps (e.g., "Review package.json conflicts" or "Check for breaking changes in X.Y.Z version")

**Example Error Summary:**
```
Build failed during step 3 (rush rebuild) of beta dependency update.

Failed packages:
- @azure/communication-react: TypeScript compilation errors
- packages/react-composites: Dependency resolution issues

Key errors:
- TS2304: Cannot find name 'CallClientState' in communication-react
- Package version conflicts between @azure/communication-calling@1.38.1-beta.1 and @azure/communication-common@2.3.2-beta.1

Recommended action: Investigate breaking changes in beta versions before proceeding.
```

This approach prevents cascading issues and allows for proper troubleshooting before continuing with the update process.

## Verification Steps (For Both Beta and Stable)

After the process completes, you can verify the updates:

1. **Check specific package versions:**
   ```bash
   cat common/temp/node_modules/@azure/communication-calling/package.json | grep version
   cat common/temp/node_modules/@azure/communication-chat/package.json | grep version
   cat common/temp/node_modules/@azure/communication-common/package.json | grep version
   ```

2. **Review configuration files:**
   - **Beta**: [`common/config/rush/common-versions.json`](common/config/rush/common-versions.json)
   - **Stable**: [`common/config/rush/variants/stable/common-versions.json`](common/config/rush/variants/stable/common-versions.json)

3. **Build success indicators:**
   - All packages should build successfully (22/24 typically pass)
   - Minor TypeScript warnings are acceptable and non-blocking
   - No critical build failures

## Notes for PR Documentation

When creating a PR for dependency updates, include:

**Major Changes:**
- List each Azure Communication Services dependency and its version change (from → to)
- Note any version regressions or notable changes
- Highlight the switch between beta/stable versions

**Build Verification:**
- Confirm successful build completion with package count (e.g., "22/24 packages built successfully")
- Note any warnings (typically TypeScript warnings in communication-react or storybook8)
- Mention total build time and success rate

**Impact:**
- **Beta**: Enables access to latest beta features and fixes, prepares codebase for testing cutting-edge functionality
- **Stable**: Ensures production-ready stability, maintains backward compatibility with latest stable releases

# Example Prompts

Here are example prompts you can use to request specific update operations:

## For Beta Dependencies Update:
```
Switch to beta flavor and update all Azure Communication Services dependencies (including @azure/communication-calling, @azure/communication-chat, @azure/communication-common, @azure/communication-signaling, and @azure/communication-calling-effects) to the latest beta versions. Use the agent.md to understand how to do this.
```

## For Stable Dependencies Update:
```
Switch to stable flavor and update all Azure Communication Services dependencies (including @azure/communication-calling, @azure/communication-chat, @azure/communication-common, @azure/communication-signaling, and @azure/communication-calling-effects) to the latest stable versions. Use the agent.md to understand how to do this.
```

## For Both Beta and Stable Updates:
```
I want to switch to beta, update all Azure Communication Services dependencies (calling, chat, common, signaling, and calling-effects) to the latest beta versions, then switch to stable, and update all dependencies to the latest stable versions. Use the agent.md to understand how to do this.
```

These prompts will guide the assistant to:
- Read the agent.md instructions
- Follow the proper sequence of commands (`rush switch-flavor`, `rush update`, etc.)
- Update the appropriate configuration files (`common/config/rush/common-versions.json` for beta, `common/config/rush/variants/stable/common-versions.json` for stable)
- Update all relevant package.json files
- Verify the installations and run rebuilds as needed

Each prompt is designed to be self-contained and will result in the assistant following the established workflow from this documentation.