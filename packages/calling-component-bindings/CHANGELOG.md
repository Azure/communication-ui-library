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

## [1.3.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.3.2-beta.1)

Wed, 05 Oct 2022 18:13:53 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.3.1-beta.1...@internal/calling-component-bindings_v1.3.2-beta.1)

### Patches

- Fix screenshare button selector to disable button when call is InLobby or Connecting state. ([PR #2059](https://github.com/azure/communication-ui-library/pull/2059) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)
- Bump @internal/calling-stateful-client to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)
- Bump @internal/react-components to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)

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

## [1.3.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.3.1-beta.1)

Wed, 29 Jun 2022 17:31:07 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.3.0...@internal/calling-component-bindings_v1.3.1-beta.1)

### Minor changes

- Add new UFDs for microphone stopped unexpectedly and microphone recovered ([PR #1994](https://github.com/azure/communication-ui-library/pull/1994) by 2684369+JamesBurnside@users.noreply.github.com)
- Update selectors for microphone and camera to disable buttons when there are no cameras or microphones present ([PR #1993](https://github.com/azure/communication-ui-library/pull/1993) by 2684369+JamesBurnside@users.noreply.github.com)
- Update ErrorBar selector to return new messages when cameraStoppedUnexpectedly call diagnostic is triggered ([PR #1991](https://github.com/azure/communication-ui-library/pull/1991) by 2684369+JamesBurnside@users.noreply.github.com)

### Patches

- Memoizes the return from the participant list selector for better optimization. ([PR #1980](https://github.com/azure/communication-ui-library/pull/1980) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix 'No Microphones Found' message persisting when new microphones have been reconnected ([PR #2000](https://github.com/azure/communication-ui-library/pull/2000) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)
- Bump @internal/calling-stateful-client to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)
- Bump @internal/react-components to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)

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

## [1.2.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.2.2-beta.1)

Tue, 19 Apr 2022 20:46:15 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.2.0...@internal/calling-component-bindings_v1.2.2-beta.1)

### Patches

- Update Error bar selector to handle call agent join failures ([PR #1788](https://github.com/azure/communication-ui-library/pull/1788) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/calling-stateful-client to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/react-components to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)

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

## [1.1.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.1.1-beta.1)

Tue, 01 Mar 2022 16:42:55 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.1...@internal/calling-component-bindings_v1.1.1-beta.1)

### Patches

- Bump @internal/acs-ui-common to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/calling-stateful-client to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/react-components to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)

### Changes

- upgrading calling to 1.4.2-beta.1 ([PR #1509](https://github.com/azure/communication-ui-library/pull/1509) by 79329532+alkwa-msft@users.noreply.github.com)
- Add audio devices to MicrophoneButton selector ([PR #1392](https://github.com/azure/communication-ui-library/pull/1392) by 82062616+prprabhu-ms@users.noreply.github.com)
- Include cameras in CameraButton selector ([PR #1436](https://github.com/azure/communication-ui-library/pull/1436) by 82062616+prprabhu-ms@users.noreply.github.com)
- Camera Logic added for local camera switcher button ([PR #1393](https://github.com/azure/communication-ui-library/pull/1393) by 94866715+dmceachernmsft@users.noreply.github.com)

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

## [1.0.0-beta.8](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.0-beta.8)

Wed, 17 Nov 2021 22:21:27 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.0-beta.7..@internal/calling-component-bindings_v1.0.0-beta.8)

### Changes

- Disallow removing Teams participants from call ([PR #1035](https://github.com/azure/communication-ui-library/pull/1035) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add an internal util function for checking if a call is in lobby ([PR #1091](https://github.com/azure/communication-ui-library/pull/1091) by anjulgarg@live.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)
- Translate several UFDs to ErrorBar notifications ([PR #1008](https://github.com/azure/communication-ui-library/pull/1008) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump headless calling SDK to 1.3.1-beta.1 ([PR #1056](https://github.com/azure/communication-ui-library/pull/1056) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add ErrorBar messages when missing device permissions ([PR #1031](https://github.com/azure/communication-ui-library/pull/1031) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update OptionsButton to DevicesButton ([PR #1084](https://github.com/azure/communication-ui-library/pull/1084) by 2684369+JamesBurnside@users.noreply.github.com)
- Drop error bar for networkReconnect condition ([PR #997](https://github.com/azure/communication-ui-library/pull/997) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.7](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.0-beta.7)

Wed, 27 Oct 2021 19:40:46 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.0-beta.6..@internal/calling-component-bindings_v1.0.0-beta.7)

### Changes

- updating calling to use 1.2.2-beta.1 ([PR #945](https://github.com/azure/communication-ui-library/pull/945) by miguelgamis@microsoft.com)
- Remove selector instance from export Add types for selectors ([PR #962](https://github.com/azure/communication-ui-library/pull/962) by jinan@microsoft.com)
- Add function `smartDominantSpeakerParticipants` for calculating smart dominant speaker tiles ([PR #827](https://github.com/azure/communication-ui-library/pull/827) by anjulgarg@live.com)
- Rename `ActiveError` to `ActiveErrorMessage` ([PR #880](https://github.com/azure/communication-ui-library/pull/880) by 82062616+prprabhu-ms@users.noreply.github.com)
- Remove dominant speaker processing in videoGallerySelector. ([PR #951](https://github.com/azure/communication-ui-library/pull/951) by miguelgamis@microsoft.com)
- Disable old unstable implementation of dominant speaker logic ([PR #890](https://github.com/azure/communication-ui-library/pull/890) by 82062616+prprabhu-ms@users.noreply.github.com)
- Changed dominantSpeakers type format of videoGallerySelector. ([PR #956](https://github.com/azure/communication-ui-library/pull/956) by miguelgamis@microsoft.com)
- bump calling sdk to 1.2.3-beta.1 ([PR #967](https://github.com/azure/communication-ui-library/pull/967) by miguelgamis@microsoft.com)
- Fix camera and mic selectors to interact with the local preview mic/camera settings when a call has not yet been joined ([PR #943](https://github.com/azure/communication-ui-library/pull/943) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix browser camera indicator still showing in use after turning it off ([PR #949](https://github.com/azure/communication-ui-library/pull/949) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.0-beta.5..@internal/calling-component-bindings_v1.0.0-beta.6)

### Changes

- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adjust api comments - iteration 2 ([PR #776](https://github.com/azure/communication-ui-library/pull/776) by jinan@microsoft.com)
- Document all public API and hide leaked exports ([PR #811](https://github.com/azure/communication-ui-library/pull/811) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.0-beta.4..@internal/calling-component-bindings_v1.0.0-beta.5)

### Changes

- Adjust most comments in internal api review ([PR #724](https://github.com/azure/communication-ui-library/pull/724) by jinan@microsoft.com)
- Add Dominant Speaker support to Video Gallery ([PR #742](https://github.com/azure/communication-ui-library/pull/742) by anjulgarg@live.com)
- updating calling to use 1.2.1-beta.1 ([PR #758](https://github.com/azure/communication-ui-library/pull/758) by 79329532+alkwa-msft@users.noreply.github.com)
- Bubble up call connection error to UI ([PR #749](https://github.com/azure/communication-ui-library/pull/749) by 82062616+prprabhu-ms@users.noreply.github.com)
- Show ACS errors via ErrorBar in CallComposite  ([PR #702](https://github.com/azure/communication-ui-library/pull/702) by 82062616+prprabhu-ms@users.noreply.github.com)
- Removed errors from start screen sharing from active errors. ([PR #760](https://github.com/azure/communication-ui-library/pull/760) by miguelgamis@microsoft.com)
- Delete ErrorBar handlers ([PR #756](https://github.com/azure/communication-ui-library/pull/756) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump acs-ui-common dep ([PR #732](https://github.com/azure/communication-ui-library/pull/732) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add active and dominant speaker support to screenshare screen. ([PR #748](https://github.com/azure/communication-ui-library/pull/748) by anjulgarg@live.com)
- Add timestamp to teed errors ([PR #753](https://github.com/azure/communication-ui-library/pull/753) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-component-bindings_v1.0.0-beta.3..@internal/calling-component-bindings_v1.0.0-beta.4)

### Changes

- updated Typescript to version 4.3.5 ([PR #645](https://github.com/azure/communication-ui-library/pull/645) by alcail@microsoft.com)
- Fixing video gallery styling issues during and after screenshare ([PR #649](https://github.com/azure/communication-ui-library/pull/649) by anjulgarg@live.com)

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/@internal/calling-component-bindings_v1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/calling-component-bindings_v1.0.0-beta.2..@internal/calling-component-bindings_v1.0.0-beta.3)

### Changes

- Remove getCall from selector Use more specific props in the call to target the right update ([PR #571](https://github.com/azure/communication-ui-library/pull/571) by jinan@microsoft.com)
- Bump prettier version and reformat ([PR #535](https://github.com/azure/communication-ui-library/pull/535) by prprabhu@microsoft.com)

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/calling-component-bindings_v1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/calling-component-bindings_v1.0.0-beta.1..calling-component-bindings_v1.0.0-beta.2)

### Changes

- added participantsButtonSelector ([PR #452](https://github.com/azure/communication-ui-library/pull/452) by alcail@microsoft.com)
- Serialize userId from state ([PR #423](https://github.com/azure/communication-ui-library/pull/423) by prprabhu@microsoft.com)
- Add undefined case to device permission selector ([PR #427](https://github.com/azure/communication-ui-library/pull/427) by allenhwang@microsoft.com)
- Add selector to retrieve device permissions ([PR #402](https://github.com/azure/communication-ui-library/pull/402) by allenhwang@microsoft.com)
- Bump prettier version and reformat ([PR #505](https://github.com/azure/communication-ui-library/pull/505) by prprabhu@microsoft.com)
- remove selector export ([PR #383](https://github.com/azure/communication-ui-library/pull/383) by jinan@microsoft.com)
- update react peer deps to be >=16.8.0 <18.0.0 ([PR #450](https://github.com/azure/communication-ui-library/pull/450) by mail@jamesburnside.com)
- upgrading version of calling to 1.1.0-beta.2 ([PR #493](https://github.com/azure/communication-ui-library/pull/493) by alkwa@microsoft.com)
- Update calling sdk to 1.1.0-beta1 ([PR #404](https://github.com/azure/communication-ui-library/pull/404) by jinan@microsoft.com)
- Update usePropsFor to use re-enforced version of type guard. ([PR #496](https://github.com/azure/communication-ui-library/pull/496) by jinan@microsoft.com)
- Adjustments for merging chat&calling hooks ([PR #454](https://github.com/azure/communication-ui-library/pull/454) by jinan@microsoft.com)
- Add options to onSelectCamera and onToggleCamera ([PR #436](https://github.com/azure/communication-ui-library/pull/436) by easony@microsoft.com)
- Update selectors for CallClientState ([PR #459](https://github.com/azure/communication-ui-library/pull/459) by prprabhu@microsoft.com)
- Fix for 'no permission warning' everytime ([PR #402](https://github.com/azure/communication-ui-library/pull/402) by jinan@microsoft.com)
- Update remote participants and video streams to use objects ([PR #460](https://github.com/azure/communication-ui-library/pull/460) by prprabhu@microsoft.com)
- Update to use Array for unparentedViews ([PR #469](https://github.com/azure/communication-ui-library/pull/469) by prprabhu@microsoft.com)

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/calling-component-bindings_v1.0.0-beta.1)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- Add calling providers and hooks to the selector package ([PR #342](https://github.com/azure/communication-ui-library/pull/342) by easony@microsoft.com)
- Fix wrong object passed to StreamMedia ([PR #359](https://github.com/azure/communication-ui-library/pull/359) by allenhwang@microsoft.com)
- Update selector types to include rendering status ([PR #279](https://github.com/azure/communication-ui-library/pull/279) by allenhwang@microsoft.com)
- Rename DTOs that shadow objects from Calling SDK ([PR #333](https://github.com/azure/communication-ui-library/pull/333) by prprabhu@microsoft.com)
- Remove selectors not related to components ([PR #346](https://github.com/azure/communication-ui-library/pull/346) by mail@jamesburnside.com)
- Rename state-only shadow type for Call ([PR #328](https://github.com/azure/communication-ui-library/pull/328) by prprabhu@microsoft.com)
- Upgrade selector to use updated Stateful render functions ([PR #293](https://github.com/azure/communication-ui-library/pull/293) by allenhwang@microsoft.com)
- Add Teams Interop to Group Call Sample ([PR #317](https://github.com/azure/communication-ui-library/pull/317) by anjulgarg@live.com)
- [#2404092] Adding stateful attributes to CallClientProvider for starting a call with camera on/off ([PR #292](https://github.com/azure/communication-ui-library/pull/292) by anjulgarg@live.com)
- Update handler to match adapter version of composite ([PR #301](https://github.com/azure/communication-ui-library/pull/301) by jinan@microsoft.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-library/pull/315) by prprabhu@microsoft.com)
- Update videoGallery selectors to get active screenshare from Stateful ([PR #260](https://github.com/azure/communication-ui-library/pull/260) by allenhwang@microsoft.com)
- Move common type to @internal/acs-ui-common ([PR #303](https://github.com/azure/communication-ui-library/pull/303) by prprabhu@microsoft.com)
- Rename DeviceManager to avoid name conflict ([PR #319](https://github.com/azure/communication-ui-library/pull/319) by prprabhu@microsoft.com)
- Throwing error when onToggleMicrophone is invoked before call is started. ([PR #323](https://github.com/azure/communication-ui-library/pull/323) by miguelgamis@microsoft.com)
- fix bugs ([PR #290](https://github.com/azure/communication-ui-library/pull/290) by easony@microsoft.com)
- Change DeviceManagerState to DeviceManager to be consistent with other objects ([PR #200](https://github.com/azure/communication-ui-library/pull/200) by allenhwang@microsoft.com)
- Add initial calling selector package setup ([PR #170](https://github.com/azure/communication-ui-library/pull/170) by allenhwang@microsoft.com)
- ParticipantList selector changed return to to CommunicationCallingParticipant ([PR #282](https://github.com/azure/communication-ui-library/pull/282) by miguelgamis@microsoft.com)
- Add calling handler and selector for VideoGallery and ScreenShare ([PR #277](https://github.com/azure/communication-ui-library/pull/277) by anjulgarg@live.com)
- Update handler type to match component ([PR #251](https://github.com/azure/communication-ui-library/pull/251) by jinan@microsoft.com)
- renamed startRenderVideo to createView and stopRenderVideo to disposeView ([PR #294](https://github.com/azure/communication-ui-library/pull/294) by alcail@microsoft.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-library/pull/225) by domessin@microsoft.com)
- rename declarative packages to stateful ([PR #250](https://github.com/azure/communication-ui-library/pull/250) by domessin@microsoft.com)
- Rename declarative to stateful ([PR #258](https://github.com/azure/communication-ui-library/pull/258) by mail@jamesburnside.com)
- Add initial base selector and handler for calling ([PR #179](https://github.com/azure/communication-ui-library/pull/179) by allenhwang@microsoft.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-library/pull/231) by mail@jamesburnside.com)
- CameraButton selectors and handlers updated to work before a call is started. Selector for unparented videostream added. ([PR #274](https://github.com/azure/communication-ui-library/pull/274) by miguelgamis@microsoft.com)
- Add handler and selector for call controls ([PR #203](https://github.com/azure/communication-ui-library/pull/203) by anjulgarg@live.com)
- Add component binding exports to meta package ([PR #291](https://github.com/azure/communication-ui-library/pull/291) by mail@jamesburnside.com)
- Add memoized selector and VideoGallery component ([PR #232](https://github.com/azure/communication-ui-library/pull/232) by easony@microsoft.com)
- Added ParticipantList selector and handler ([PR #239](https://github.com/azure/communication-ui-library/pull/239) by miguelgamis@microsoft.com)
- Update exports to not conflict with other internal packages ([PR #237](https://github.com/azure/communication-ui-library/pull/237) by mail@jamesburnside.com)
