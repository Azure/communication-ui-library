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
   You should see `"version": "1.37.1-beta.1"` (or similar beta version) and `"types": "types/communication-calling-beta.d.ts"`

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

# Instructions for Updating Beta Version

To update the `@azure/communication-calling` package to the latest beta version while already in beta flavor, follow these steps:

**Estimated Time:** ~15-20 minutes total

1. **Verify Beta Flavor:**
   Confirm you're currently in beta flavor by checking the environment:
   ```bash
   echo $COMMUNICATION_REACT_FLAVOR
   ```
   Should return `beta`. If not, run `rush switch-flavor:beta` first.

2. **Check Current Beta Version:**
   Check the currently installed beta version:
   ```bash
   cat common/temp/node_modules/@azure/communication-calling/package.json | grep version
   ```
   Note the current version (e.g., `"version": "1.37.1-beta.1"`)

3. **Find Latest Beta Version:**
   Check npm for the latest beta version:
   ```bash
   npm view @azure/communication-calling versions --beta --json
   ```
   This will show all available beta versions. Use the latest one.

4. **Update Version in Configuration Files:**
   If a newer beta version is available, update the following files:
   
   **a. Update common-versions.json:**
   ```bash
   # Edit common/config/rush/common-versions.json
   # Update both "preferredVersions" and "allowedAlternativeVersions" sections
   # Replace old beta version with new beta version
   ```
   
   **b. Update package.json files:**
   The following files typically contain `@azure/communication-calling` dependencies:
   - `samples/CallWithChat/package.json`
   - `samples/CallingStateful/package.json`
   - `packages/calling-stateful-client/package.json`
   - `packages/communication-react/package.json`
   - `packages/react-composites/package.json`
   - `packages/storybook8/package.json`
   - `samples/ComponentExamples/package.json`
   - `samples/StaticHtmlComposites/package.json`
   - `samples/tests/package.json`
   - `samples/Calling/package.json`
   - `packages/calling-component-bindings/package.json`
   
   *Use search tools to find all files containing the old beta version and replace with the new version.*

5. **Rebuild Project:**
   After updating all version references, rebuild the entire project:
   ```bash
   rush rebuild
   ```
   *Estimated time: ~10-15 minutes*

6. **Verify Updated Version:**
   Confirm the new beta version is installed:
   ```bash
   cat common/temp/node_modules/@azure/communication-calling/package.json | grep version
   ```
   Should show the new beta version you specified.

## Notes:
- Always ensure all references to the old beta version are updated consistently across all files
- The `rush rebuild` command is necessary to ensure all packages are rebuilt with the new version

# Instructions for Updating Stable Version

To update the `@azure/communication-calling` package to the latest stable version while already in stable flavor, follow these steps:

**Estimated Time:** ~15-20 minutes total

1. **Verify Stable Flavor:**
   Confirm you're currently in stable flavor by checking the environment:
   ```bash
   echo $COMMUNICATION_REACT_FLAVOR
   ```
   Should return `stable`. If not, follow the "Instructions for Switching to Stable Flavor" section first.

2. **Check Current Stable Version:**
   Check the currently installed stable version:
   ```bash
   cat common/temp/node_modules/@azure/communication-calling/package.json | grep version
   ```
   Note the current version (e.g., `"version": "1.37.1"`)

3. **Find Latest Stable Version:**
   Check npm for the latest stable version (without -beta suffix):
   ```bash
   npm view @azure/communication-calling versions --json
   ```
   Look for the highest version number without `-beta`, `-alpha`, or `-rc` suffixes.

4. **Update Version in Configuration Files:**
   If a newer stable version is available, update the following files:
   
   **a. Update stable common-versions.json:**
   ```bash
   # Edit common/config/rush/variants/stable/common-versions.json
   # Update both "preferredVersions" and "allowedAlternativeVersions" sections
   # Replace old stable version with new stable version (e.g., ^1.37.1 -> ^1.37.2)
   ```
   
   **b. Update package.json files:**
   The following files typically contain `@azure/communication-calling` dependencies with patterns like `"1.38.1-beta.1 || ^1.37.1"`:
   - `samples/CallWithChat/package.json`
   - `samples/CallingStateful/package.json`
   - `packages/calling-stateful-client/package.json`
   - `packages/communication-react/package.json`
   - `packages/react-composites/package.json`
   - `packages/storybook8/package.json`
   - `samples/ComponentExamples/package.json`
   - `samples/StaticHtmlComposites/package.json`
   - `samples/tests/package.json`
   - `samples/Calling/package.json`
   - `packages/calling-component-bindings/package.json`
   
   *Update the stable version part (after `||`) in each file. For example, change `"1.38.1-beta.1 || ^1.37.1"` to `"1.38.1-beta.1 || ^1.37.2"`*

5. **Rebuild Project:**
   After updating all version references, rebuild the entire project:
   ```bash
   rush rebuild
   ```
   *Estimated time: ~10-15 minutes*

6. **Verify Updated Version:**
   Confirm the new stable version is installed:
   ```bash
   cat common/temp/node_modules/@azure/communication-calling/package.json | grep version
   ```
   Should show the new stable version you specified.

## Notes:
- Always ensure all references to the old stable version are updated consistently across all files
- The `rush rebuild` command is necessary to ensure all packages are rebuilt with the new version
- Version format should follow pattern: `X.Y.Z` (e.g., `1.37.2`) without any pre-release suffixes
- Make sure to update both the stable variant configuration and all package.json files that contain version ranges
- Version format should follow pattern: `X.Y.Z-beta.N` (e.g., `1.38.1-beta.1`)

# Example Prompts

Here are example prompts you can use to request specific update operations:

## For Beta Update Only:
```
Switch to beta flavor and update the @azure/communication-calling package to the latest beta version. Use the agent.md to understand how to do this.
```

## For Stable Update Only:
```
Switch to stable flavor and update the @azure/communication-calling package to the latest stable version. Use the agent.md to understand how to do this.
```

## For Both Beta and Stable Updates:
```
I want to switch to beta, update the version of calling to the latest beta, then switch to stable, and update the version to the latest stable. Use the agent.md to understand how to do this.
```

These prompts will guide the assistant to:
- Read the agent.md instructions
- Follow the proper sequence of commands (`rush switch-flavor`, `rush update`, etc.)
- Update the appropriate configuration files (`common/config/rush/common-versions.json` for beta, `common/config/rush/variants/stable/common-versions.json` for stable)
- Update all relevant package.json files
- Verify the installations and run rebuilds as needed

Each prompt is designed to be self-contained and will result in the assistant following the established workflow from this documentation.