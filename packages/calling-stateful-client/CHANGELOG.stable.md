# Change Log - @internal/calling-stateful-client

This log was last generated on Fri, 21 Oct 2022 23:02:10 GMT and should not be manually modified.

<!-- Start content -->

## [1.4.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.4.0)

Fri, 21 Oct 2022 23:02:10 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.3.2-beta.1...@internal/calling-stateful-client_v1.4.0)

### Patches

- Add event logs for disposing local video streams ([PR #2121](https://github.com/azure/communication-ui-library/pull/2121) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)

### Changes

- bump calling beta to 1.6.0-beta.1 ([PR #2047](https://github.com/azure/communication-ui-library/pull/2047) by miguelgamis@microsoft.com)
- Bumped calling SDK beta version to 1.8.0-beta.1 ([PR #2362](https://github.com/azure/communication-ui-library/pull/2362) by miguelgamis@microsoft.com)
- Introduce AlternateCallerId from the Calling SDK to the Calling stateful client. ([PR #2095](https://github.com/azure/communication-ui-library/pull/2095) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce the alternativeCallerId property from the Calling SDK to the stateful Client and CallContext. ([PR #2070](https://github.com/azure/communication-ui-library/pull/2070) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bump calling beta to 1.6.1 beta.1 ([PR #2074](https://github.com/azure/communication-ui-library/pull/2074) by edwardlee@microsoft.com)

## [1.3.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.3.0)

Mon, 13 Jun 2022 18:29:30 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.2.2-beta.1...@internal/calling-stateful-client_v1.3.0)

### Patches

- Return the renderer and view created when statefulCallClient.createView is called ([PR #1889](https://github.com/azure/communication-ui-library/pull/1889) by 2684369+JamesBurnside@users.noreply.github.com)
- - Add callIdHistory to context + internal context - Update all visit to callId using latestCallId - Encapsule the access to internalMap directly to ensure no leaks ([PR #1817](https://github.com/azure/communication-ui-library/pull/1817) by jiangnanhello@live.com)
- Update the right call.id into state ([PR #1818](https://github.com/azure/communication-ui-library/pull/1818) by jiangnanhello@live.com)
- Bump @internal/acs-ui-common to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)

### Changes

- Support `isReceiving` flag for video streams ([PR #1954](https://github.com/azure/communication-ui-library/pull/1954) by chwhilar@microsoft.com)
- Updating @azure/communication-chat to 1.2.0 ([PR #1815](https://github.com/azure/communication-ui-library/pull/1815) by anjulgarg@live.com)
- Update Calling declarative to handle new PSTN functions ([PR #1917](https://github.com/azure/communication-ui-library/pull/1917) by 94866715+dmceachernmsft@users.noreply.github.com)
- updating beta @azure/communication-calling to 1.5.4-beta.1 ([PR #1925](https://github.com/azure/communication-ui-library/pull/1925) by 79475487+mgamis-msft@users.noreply.github.com)

## [1.2.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.2.0)

Fri, 11 Mar 2022 19:20:03 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.1.1-beta.1...@internal/calling-stateful-client_v1.2.0)

### Patches

- Bump @azure/communication-calling to 1.4.3 ([PR #1610](https://github.com/azure/communication-ui-library/pull/1610) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)

### Changes

- Upgrading calling to 1.4.3-beta.1 ([PR #1607](https://github.com/azure/communication-ui-library/pull/1607) by edwardlee@microsoft.com)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.1)

Mon, 24 Jan 2022 23:18:54 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.1...@internal/calling-stateful-client_v1.0.1)

### Patches

- Move @azure/communication-calling to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.1)

Tue, 04 Jan 2022 22:57:09 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0...@internal/calling-stateful-client_v1.0.1)

### Patches

- Bump @internal/acs-ui-common to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)

## [1.0.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0)

Mon, 06 Dec 2021 19:41:59 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0-beta.8..@internal/calling-stateful-client_v1.0.0)

### Changes

- Remove spammy console log when rendering video ([PR #1188](https://github.com/azure/communication-ui-library/pull/1188) by 82062616+prprabhu-ms@users.noreply.github.com)