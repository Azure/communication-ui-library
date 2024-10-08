# Documentation for [ci.yml](./ci.yml)

[ci.yml](./ci.yml) contains the [GitHub workflow](https://docs.github.com/en/get-started/getting-started-with-git/git-workflows) definition for presubmit tests in this repository.

All Pull Requests in this repository must pass the checks in this workflow before being merged into the `main` branch. The checks are distributed across several jobs. Each job runs on a seprate build agent. Most of them can run concurrently.

Many of checks build and test the library code in both the [`beta` and `stable` build flavors](../../docs/references/beta-only-features.md). For such jobs, we use a [job matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) to run an instance of the job for each build flavor. The following high-level description of the checks calls out which checks are build-flavor aware.

- `build_packages`: This job consists of the fastest validation steps available. It is build flavor aware.
  - Run linting tool `eslint`
  - Build the [`@azure/communication-react`](../../packages/communication-react/) library and its dependencies.
  - Run all `jest` unittests.
  - Create detailed json and json summary `jest` tests coverage reports and uploads them to Artifacts. The reports can be used to create an HTML report.
  - Make sure that there are no unexpected API changes (using `api-extractor`).
  - Run a tool to check that customers can continue to effectively tree-shake `@azure/communication-react` and its dependencies.

- Browser test jobs (`call_composite_automation_test`, `chat_composite_automation_test` and `call_with_chat_composite_automation_test`): These jobs run [browser tests for the UI composites](../../packages/react-composites/tests/README.md). They are build flavor aware.
  - Build test application for the UI composite and run Playwright tests against the application.
  - Upload test statistics and any UI snapshot differences found as GitHub workflow artifacts.

- Build sample applications (`build_calling_sample`, `build_chat_sample`, `build_call_with_chat_sample`): These jobs build a [sample application](../../samples/) for each of the UI composites and run associated unit-tests. They are build flavor aware.
  - The sample `webpack` build step is slow (takes several minutes). We use separate jobs for each sample so they can run concurrently and not contribute to overall CI latency.

- `build_static_html_composites_sample`: This job builds and tests a sample application that uses a js-only bundle for `@azure/communication-react`. This job is build flavor aware.
  - `webpack` build a sample application that uses the js-bundle generated from `@azure/communication-react` build.
  - Run some Playwright smoke tests against the sample application. These tests only sanity test the sample application. They are not as extensive as the browser tests in the job above.
  - Upload any UI snapshot differences as GitHub workflow artifacts.

- `build_component_examples`: This job builds and tests a sample application that uses the UI components (not composites) from `@azure/communication-react`. This job is build flavor aware.
  - `webpack` build a sample application that uses the components exposed in the `@azure/communication-react` library.
  - Run some Playwright smoke tests against the sample application. These tests only sanity test the sample application. They are not as extensive as the browser tests in the job above.
  - Upload any UI snapshot differences as GitHub workflow artifacts

- `build_storybook`: Build and test [storybook](../../packages/storybook8/). This job is *not* build flavor aware. Storybook is always built using the `beta` build flavor.
  - Run linting tool `eslint`
  - Build storybook using `webpack`.
  - Run unit-tests.

- Informational jobs to track jest tests coverage (`compare_jest_tests_coverage`, `update_jest_coverage_report`): These jobs track the jest tests coverage (lines, functions, statements, branches) for `@azure/communication-react` built in the previous steps. Any differences in the coverage are reported as Pull Request comments, _but do not block Pull Request from being merged_. This jobs are build flavor aware.

- Informational jobs to track sample bundle size (`compare_base_bundle_stats`, `update_base_bundle_report`): These jobs track the expected bundle size of the sample applications built in the previous steps. Any differences in the size are reported as Pull Request comments, _but do not block Pull Request from being merged_. This job is not build flavor aware.

- `check_failure`: This is a meta-job that only applies to _post-submit_ workflow run (which re-uses the same `ci.yml` definition). It opens a new GitHub issue in the repository if any fundamental step in the jobs above fails on post-submit workflow run, because it indicates a problem with the CI infrastructure or a bug in the product on `main`. This job is not build flavor aware.
