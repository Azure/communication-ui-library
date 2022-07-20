# Composite browser tests

This folder contains some hermetic and live browser tests for the composites. See the [top-level testing documentation](../../../docs/references/automated-tests.md) to understand how these tests fit into our overall testing strategy.

## Folder structure

Tests for each composite are contained in their own folder. Further, hermetic and live tests for each composite are contained in separate sub-folders.

* [./browser/call](./browser/call) - Tests for `CallComposite`
  * [./browser/call/app](./browser/call/app) - Test application used for all `CallComposite` tests
  * [./browser/call/hermetic](./browser/call/hermetic) - Hermetic tests for `CallComposite`
  * [./browser/call/live](./browser/call/live) - Live tests for `CallComposite`
* [./browser/chat](./browser/chat) - Tests for `ChatComposite`
  * [./browser/chat/app](./browser/chat/app) - Test application used for all `ChatComposite` tests
  * [./browser/chat/fake-adapter](./browser/chat/fake-adapter) - Hermetic tests for `ChatComposite`
  * [./browser/chat/live-tests](./browser/chat/live-tests) - Live tests for `ChatComposite`
* [./browser/callwithchat](./browser/callwithchat) - Tests for `CallWithChatComposite`
  * [./browser/callwithchat/app](./browser/callwithchat/app) - Test application used for all `CallWithChatComposite` tests
  * [./browser/callwithchat/*](./browser/callwithchat/*) - Live tests for `CallWithChatComposite`

Both hermetic and live tests use [playwright](https://playwright.dev/) test framework. Playwright is configered via

* [../playwright.config.hermetic.ts](../playwright.config.hermetic.ts) for hmermetic tests
* [../playwright.config.live.ts](../playwright.config.live.ts) for live tests

## Setup

* Build all dependencies. Inside `packages/react-composite`, run
  ```sh
  rush build -t .
  ```
* Build the test applications.
  ```sh
  rush build:e2e
  ```

### Live tests

In addition, live tests require credentials to make Azure Communication Services backend API calls.
Update the connection string in [./browser/.env](./browser/.env) file (set `CONNECTION_STRING`).

## Run tests

### Stress testing

## Update snapshots

## Test development

When to write live vs hermetic tests

Note about building the app in your edit-compile-run cycle.

### Conditional compilation

### Desktop-only tests
