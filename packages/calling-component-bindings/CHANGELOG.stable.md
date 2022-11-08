# Change Log - @internal/calling-component-bindings

This log was last generated on Fri, 21 Oct 2022 23:02:09 GMT and should not be manually modified.

<!-- Start content -->

## [1.4.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.4.0)

Fri, 21 Oct 2022 23:02:09 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.3.2-beta.1...@internal/calling-component-bindings_v1.4.0)

### Patches

- Fix screenshare button selector to disable button when call is InLobby or Connecting state. ([PR #2059](https://github.com/azure/communication-ui-library/pull/2059) by 94866715+dmceachernmsft@users.noreply.github.com)
- BugFix: Fix local camera getting into a bad state when the camera takes longer to turn on than the call took to connect ([PR #2412](https://github.com/azure/communication-ui-library/pull/2412) by 2684369+JamesBurnside@users.noreply.github.com)
- BugFix: Add missing foreveryone logic for leaveCall ([PR #2399](https://github.com/azure/communication-ui-library/pull/2399) by carolinecao@microsoft.com)
- Bump @internal/acs-ui-common to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/calling-stateful-client to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/react-components to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)

### Changes

- videoGallerySelector returns remote participants with a participant state ([PR #2161](https://github.com/azure/communication-ui-library/pull/2161) by anjulgarg@live.com)
- bump calling beta to 1.6.0-beta.1 ([PR #2047](https://github.com/azure/communication-ui-library/pull/2047) by miguelgamis@microsoft.com)
- Update onStartCall and onRemoveParticipant Calling Handler functions to use CommunicationIdentifier as userId instead of string ([PR #2377](https://github.com/azure/communication-ui-library/pull/2377) by anjulgarg@live.com)
- Bump calling beta to 1.6.1 beta.1 ([PR #2074](https://github.com/azure/communication-ui-library/pull/2074) by edwardlee@microsoft.com)
- Account for RemoteHold call status in Call Composite ([PR #2232](https://github.com/azure/communication-ui-library/pull/2232) by edwardlee@microsoft.com)
- expose conditionally compiled  dialpad code for PSTN call ([PR #2196](https://github.com/azure/communication-ui-library/pull/2196) by carolinecao@microsoft.com)
- Bumped calling SDK beta version to 1.8.0-beta.1 ([PR #2362](https://github.com/azure/communication-ui-library/pull/2362) by miguelgamis@microsoft.com)
- updated _isInCall util function to reflect hold states as being in a call as well. ([PR #2202](https://github.com/azure/communication-ui-library/pull/2202) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update AddParticipant handler to match desired overloads. ([PR #2280](https://github.com/azure/communication-ui-library/pull/2280) by 94866715+dmceachernmsft@users.noreply.github.com)
- videoGallerySelector returns remote participants with their call connection state ([PR #2143](https://github.com/azure/communication-ui-library/pull/2143) by anjulgarg@live.com)
- create handlers for askDevicePermission ([PR #2389](https://github.com/azure/communication-ui-library/pull/2389) by carolinecao@microsoft.com)

## [1.3.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.3.0)

Mon, 13 Jun 2022 18:29:30 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.2.2-beta.1...@internal/calling-component-bindings_v1.3.0)

### Minor changes

- Update the return from the `ParticipantList` selector to handle PSTN users. ([PR #1929](https://github.com/azure/communication-ui-library/pull/1929) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Update VideoGallery bindings to return the created view when starting a local video stream ([PR #1891](https://github.com/azure/communication-ui-library/pull/1891) by 2684369+JamesBurnside@users.noreply.github.com)
- updating beta @azure/communication-calling to 1.5.4-beta.1 ([PR #1925](https://github.com/azure/communication-ui-library/pull/1925) by 79475487+mgamis-msft@users.noreply.github.com)
- When participant doesnt have a name, set the name to unnamed participant ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by carolinecao@microsoft.com)
- Fix Calling handler to correctly dispose a local view when view is attached to a call ([PR #1867](https://github.com/azure/communication-ui-library/pull/1867) by 2684369+JamesBurnside@users.noreply.github.com)
- Support calling `updateScalingMode` in the Video Gallery with remote video streams instead of recreating the stream when the scaling mode changes ([PR #1907](https://github.com/azure/communication-ui-library/pull/1907) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed onCreateLocalStreamView handler default videostream options to be cropped and mirrored. ([PR #1909](https://github.com/azure/communication-ui-library/pull/1909) by miguelgamis@microsoft.com)
- Bump @internal/acs-ui-common to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)
- Bump @internal/calling-stateful-client to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)
- Bump @internal/react-components to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)

### Changes

- Add PSTN Calling handlers for Hold, Resume, and AddParticipant. ([PR #1914](https://github.com/azure/communication-ui-library/pull/1914) by 94866715+dmceachernmsft@users.noreply.github.com)
- Updating @azure/communication-chat to 1.2.0 ([PR #1815](https://github.com/azure/communication-ui-library/pull/1815) by anjulgarg@live.com)
- Support `isReceiving` flag for video streams ([PR #1954](https://github.com/azure/communication-ui-library/pull/1954) by chwhilar@microsoft.com)
- Introduce selector for HoldButton component. ([PR #1919](https://github.com/azure/communication-ui-library/pull/1919) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added onsenddtmf handler for dialpad ([PR #1937](https://github.com/azure/communication-ui-library/pull/1937) by carolinecao@microsoft.com)

## [1.2.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.2.0)

Fri, 11 Mar 2022 19:20:02 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.1.1-beta.1...@internal/calling-component-bindings_v1.2.0)

### Minor changes

- Switch CallWithChat from Beta to Public and Stable ([PR #1612](https://github.com/azure/communication-ui-library/pull/1612) by edwardlee@microsoft.com)

### Patches

- Bump @azure/communication-calling to 1.4.3 ([PR #1610](https://github.com/azure/communication-ui-library/pull/1610) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)
- Bump @internal/calling-stateful-client to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)
- Bump @internal/react-components to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)

### Changes

- Upgrading calling to 1.4.3-beta.1 ([PR #1607](https://github.com/azure/communication-ui-library/pull/1607) by edwardlee@microsoft.com)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.1)

Mon, 24 Jan 2022 23:18:53 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.1...@internal/calling-component-bindings_v1.0.1)

### Patches

- Move @azure/communication-calling to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)
- Bump @internal/calling-stateful-client to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)
- Bump @internal/react-components to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.1)

Tue, 04 Jan 2022 22:57:09 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.0...@internal/calling-component-bindings_v1.0.1)

### Patches

- Bump @internal/acs-ui-common to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)
- Bump @internal/calling-stateful-client to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)
- Bump @internal/react-components to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)

## [1.0.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.0)

Mon, 06 Dec 2021 19:41:59 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.0-beta.8..@internal/calling-component-bindings_v1.0.0)

### Changes

- Add name based ascending sorting to participants returned by participantListSelector ([PR #1106](https://github.com/azure/communication-ui-library/pull/1106) by anjulgarg@live.com)
- hiding users in the lobby from acs clients ([PR #1112](https://github.com/azure/communication-ui-library/pull/1112) by 79329532+alkwa-msft@users.noreply.github.com)
