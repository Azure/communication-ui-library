# Treeshaking Checker

This tool uses webpack to validate proper dependency boundaries so that a user of our library doesn't bundle unexpected modules.

For example, importing a pure UI element should not lead to any dependency on the headless Azure SDK. Or importing the declarative layer should not import from the UI or React.

Add new forbidden import rules to `forbiddenDependencies.js`, and add a package dependency to package.json if necessary, because this tool operates on the .js build output.