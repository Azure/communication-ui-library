# Change Log - @internal/react-composites

This log was last generated on Fri, 21 Oct 2022 23:01:53 GMT and should not be manually modified.

<!-- Start content -->

## [1.4.0](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.4.0)

Fri, 21 Oct 2022 23:01:53 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.3.2-beta.1...@internal/react-composites_v1.4.0)

### Minor changes

- Call adapter can join a room ([PR #2063](https://github.com/azure/communication-ui-library/pull/2063) by miguelgamis@microsoft.com)
- Add callEndReason to the onCallEnded event and fix the event to trigger before the composite page transition. ([PR #2201](https://github.com/azure/communication-ui-library/pull/2201) by 2684369+JamesBurnside@users.noreply.github.com)
- Convert PeoplePaneContent to a common file ([PR #2083](https://github.com/azure/communication-ui-library/pull/2083) by edwardlee@microsoft.com)
- Enzyme tests for rooms ([PR #2225](https://github.com/azure/communication-ui-library/pull/2225) by 97124699+prabhjot-msft@users.noreply.github.com)

### Patches

- Fixes issue where you can start a call if you unplug it on the configuration screen. ([PR #2061](https://github.com/azure/communication-ui-library/pull/2061) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix adapter logic to join Teams meeting. ([PR #2253](https://github.com/azure/communication-ui-library/pull/2253) by miguelgamis@microsoft.com)
- Fix custom menu items being triggered as a flyout and as a drawer menu item on mobile. Fix custom menu items not triggering on callwithchat composite at all. ([PR #2239](https://github.com/azure/communication-ui-library/pull/2239) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix React hook order console errors for LocalDeviceSettings. ([PR #2198](https://github.com/azure/communication-ui-library/pull/2198) by miguelgamis@microsoft.com)
- Message thread background color in composites matches composite background color ([PR #2126](https://github.com/azure/communication-ui-library/pull/2126) by anjulgarg@live.com)
- Fixed bug where drawer on mobile does not get dismissed after making a selection ([PR #2115](https://github.com/azure/communication-ui-library/pull/2115) by carolinecao@microsoft.com)
- Fix running render passes on people pane on every render ([PR #2240](https://github.com/azure/communication-ui-library/pull/2240) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix Calling Composite's control bar buttons incorrectly showing as disabled when the control bar button is set to `true` in the control bar options ([PR #2325](https://github.com/azure/communication-ui-library/pull/2325) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed input order bug on calling dialpad and dtmf dialpad ([PR #2284](https://github.com/azure/communication-ui-library/pull/2284) by carolinecao@microsoft.com)
- Fix local device settings dropdowns to be disabled until device permissions are granted ([PR #2351](https://github.com/azure/communication-ui-library/pull/2351) by miguelgamis@microsoft.com)
- Autofocus on back button when initially opening People and Chat pane ([PR #2045](https://github.com/azure/communication-ui-library/pull/2045) by edwardlee@microsoft.com)
- Update documentation for onFetchAvatarPersonaData property on BaseComposite to drive clarity to what it does and does not do. ([PR #2027](https://github.com/azure/communication-ui-library/pull/2027) by 94866715+dmceachernmsft@users.noreply.github.com)
- fix: joinCall set correct mute state based on microphoneOn parameter ([PR #2131](https://github.com/azure/communication-ui-library/pull/2131) by fanjin1989@gmail.com)
- Fix call adapter joinCall logic bug. ([PR #2199](https://github.com/azure/communication-ui-library/pull/2199) by miguelgamis@microsoft.com)
- Composites now using theme.semanticColors.bodyBackground as background color ([PR #2117](https://github.com/azure/communication-ui-library/pull/2117) by anjulgarg@live.com)
- Add Announcer to copy invite link button to announce action on button. ([PR #2289](https://github.com/azure/communication-ui-library/pull/2289) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix disabled start call button when role is Consumer ([PR #2251](https://github.com/azure/communication-ui-library/pull/2251) by miguelgamis@microsoft.com)
- Bugfix: Actually show provided participant menu items in CallComposite ([PR #2154](https://github.com/azure/communication-ui-library/pull/2154) by prprabhu@microsoft.com)
- Introduces animations to is speaking when muted indicator ([PR #2312](https://github.com/azure/communication-ui-library/pull/2312) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix scrollbar showing incorrectly in landscape mobile view due to absolutely positioned participant pane in Chat Composite ([PR #2038](https://github.com/azure/communication-ui-library/pull/2038) by anjulgarg@live.com)
- Fix Participants and ScreenShare buttons being disabled when unrelated options are passed into the call composite ([PR #2181](https://github.com/azure/communication-ui-library/pull/2181) by 2684369+JamesBurnside@users.noreply.github.com)
- Add permissions for Camera and Microphone in devices options ([PR #2402](https://github.com/azure/communication-ui-library/pull/2402) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fix CallWithChat control bar disappearing while the call is in the disconnecting state ([PR #2392](https://github.com/azure/communication-ui-library/pull/2392) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix logic to show label of MoreButton in ControlBar ([PR #2388](https://github.com/azure/communication-ui-library/pull/2388) by miguelgamis@microsoft.com)
- BugFix: Add missing foreveryone logic for leaveCall ([PR #2399](https://github.com/azure/communication-ui-library/pull/2399) by carolinecao@microsoft.com)
- Bump @fluentui/react dependency to 8.98.3 ([PR #2415](https://github.com/azure/communication-ui-library/pull/2415) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed bug where icon background is grey in calling dialpad ([PR #2394](https://github.com/azure/communication-ui-library/pull/2394) by carolinecao@microsoft.com)
- bugfix: Avoid blank screen on mobile  when call ends with a side pane open ([PR #2407](https://github.com/azure/communication-ui-library/pull/2407) by 82062616+prprabhu-ms@users.noreply.github.com)
- Remove end call reason from adapter.onCallEnded ([PR #2371](https://github.com/azure/communication-ui-library/pull/2371) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/calling-component-bindings to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/calling-stateful-client to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/chat-component-bindings to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/chat-stateful-client to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/react-components to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)
- Bump @internal/fake-backends to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)

### Changes

- Add role permission behavior to PeopleButton. ([PR #2211](https://github.com/azure/communication-ui-library/pull/2211) by miguelgamis@microsoft.com)
- Update Fluent-ui/icons package. ([PR #2305](https://github.com/azure/communication-ui-library/pull/2305) by 94866715+dmceachernmsft@users.noreply.github.com)
- People pane context menu to remove participant will be present only if role has permissions. ([PR #2328](https://github.com/azure/communication-ui-library/pull/2328) by miguelgamis@microsoft.com)
- Dialpad hidden in non PSTN 1:1 Calls. ([PR #2277](https://github.com/azure/communication-ui-library/pull/2277) by carolinecao@microsoft.com)
- Update startCall and removeParticipant adapter methods to use CommunicationIdentifier as userId ([PR #2377](https://github.com/azure/communication-ui-library/pull/2377) by anjulgarg@live.com)
- Use addparticipant handler to call a PSTN user ([PR #2168](https://github.com/azure/communication-ui-library/pull/2168) by carolinecao@microsoft.com)
- add device permission prompt dropdown to call composite ([PR #2372](https://github.com/azure/communication-ui-library/pull/2372) by carolinecao@microsoft.com)
- Created dropdown in people pane to open dialpad modal ([PR #2076](https://github.com/azure/communication-ui-library/pull/2076) by carolinecao@microsoft.com)
- use dialpad to send DTMF tones  ([PR #2196](https://github.com/azure/communication-ui-library/pull/2196) by carolinecao@microsoft.com)
- Update MediaGallery to provide a default rendered tile to the VideoGallery when a participant is 'Ringing' or 'Connecting' ([PR #2163](https://github.com/azure/communication-ui-library/pull/2163) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add key and aria props to custom buttons ([PR #2311](https://github.com/azure/communication-ui-library/pull/2311) by edwardlee@microsoft.com)
- Introduce hold button to CallWithChat composite ([PR #2213](https://github.com/azure/communication-ui-library/pull/2213) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add permissions provider for different roles ([PR #2079](https://github.com/azure/communication-ui-library/pull/2079) by jiangnanhello@live.com)
- Do not show MutedNotification when user role does not have microphone permissions. ([PR #2335](https://github.com/azure/communication-ui-library/pull/2335) by miguelgamis@microsoft.com)
- Switched file sharing methods in callWithChat adapter to Arrow functions ([PR #2081](https://github.com/azure/communication-ui-library/pull/2081) by 97124699+prabhjot-msft@users.noreply.github.com)
- Hiding ScreenShareButton, MicrophoneButton, CameraButton, and DevicesButton in CallControls based on rooms role permissions. ([PR #2303](https://github.com/azure/communication-ui-library/pull/2303) by miguelgamis@microsoft.com)
- Introduced a Hold screen to the Calling composite to reflect when the user is on hold in a call. ([PR #2202](https://github.com/azure/communication-ui-library/pull/2202) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update startCall usage by call adapter to pass in audio and video options from configuration screen. ([PR #2317](https://github.com/azure/communication-ui-library/pull/2317) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add strings used in CallPane for Call Composite ([PR #2103](https://github.com/azure/communication-ui-library/pull/2103) by edwardlee@microsoft.com)
- Add devicePermissions api for Call Readiness ([PR #2304](https://github.com/azure/communication-ui-library/pull/2304) by edwardlee@microsoft.com)
- Introduce the alternateCallerId prop to the createAzureCommunicationCallAdapter function. ([PR #2095](https://github.com/azure/communication-ui-library/pull/2095) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add disabled option for CallWithChat control bar buttons ([PR #2294](https://github.com/azure/communication-ui-library/pull/2294) by edwardlee@microsoft.com)
- Add role to permissions provider and change default permissions with no role ([PR #2378](https://github.com/azure/communication-ui-library/pull/2378) by 97124699+prabhjot-msft@users.noreply.github.com)
- Introduce the alternativeCallerId property to the CallAdapter and AzureCommunicationsCallAdapter ([PR #2070](https://github.com/azure/communication-ui-library/pull/2070) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add Call composite strings for people button ([PR #2358](https://github.com/azure/communication-ui-library/pull/2358) by edwardlee@microsoft.com)
- Update Icons usage in Custom Buttons to use iconNames from registered Icons ([PR #2017](https://github.com/azure/communication-ui-library/pull/2017) by edwardlee@microsoft.com)
- sort enum variants  ([PR #2273](https://github.com/azure/communication-ui-library/pull/2273) by carolinecao@microsoft.com)
- Change participantIDs to participantIds ([PR #2310](https://github.com/azure/communication-ui-library/pull/2310) by anjulgarg@live.com)
- Introduce resuming state for the holdPane screen in the Calling Composite. ([PR #2266](https://github.com/azure/communication-ui-library/pull/2266) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bumped calling SDK beta version to 1.8.0-beta.1 ([PR #2362](https://github.com/azure/communication-ui-library/pull/2362) by miguelgamis@microsoft.com)
- Add more button and Hold functionality to Calling composite ([PR #2197](https://github.com/azure/communication-ui-library/pull/2197) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update CallWithChat composite inCall logic to accept 'remoteHold' as a state of being in a call. ([PR #2292](https://github.com/azure/communication-ui-library/pull/2292) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update screenshare button logic to utilize new screenshare button selector properties. ([PR #2059](https://github.com/azure/communication-ui-library/pull/2059) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduces overload for addParticipant to accept a flat identifier of the participant to add ([PR #2280](https://github.com/azure/communication-ui-library/pull/2280) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add component behaviors according to permissions ([PR #2104](https://github.com/azure/communication-ui-library/pull/2104) by jiangnanhello@live.com)
- Center icons and add hold button icon into Contextual Menu ([PR #2265](https://github.com/azure/communication-ui-library/pull/2265) by 94866715+dmceachernmsft@users.noreply.github.com)
- Changes to add remove button permissions for mobile view & hermetic tests for remove button ([PR #2244](https://github.com/azure/communication-ui-library/pull/2244) by 97124699+prabhjot-msft@users.noreply.github.com)
- Introduce new Domain permissions UI to help end user diagnose device issues. ([PR #2298](https://github.com/azure/communication-ui-library/pull/2298) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bump calling beta to 1.6.1 beta.1 ([PR #2074](https://github.com/azure/communication-ui-library/pull/2074) by edwardlee@microsoft.com)
- Add Sparkle icon to Domain Permissions component ([PR #2307](https://github.com/azure/communication-ui-library/pull/2307) by 94866715+dmceachernmsft@users.noreply.github.com)
- Hiding copy link button for Rooms call ([PR #2370](https://github.com/azure/communication-ui-library/pull/2370) by miguelgamis@microsoft.com)
- Introduces behavior to the Calling and CallWithChat control bars to disable buttons when on hold screen. ([PR #2215](https://github.com/azure/communication-ui-library/pull/2215) by 94866715+dmceachernmsft@users.noreply.github.com)
- change show dialpad button name ([PR #2242](https://github.com/azure/communication-ui-library/pull/2242) by carolinecao@microsoft.com)
- Resolve ModalLocalAndRemotePIP boundary clipping in PeoplePane mobile view ([PR #2136](https://github.com/azure/communication-ui-library/pull/2136) by edwardlee@microsoft.com)
- Introduce the AlternateCallerId property to the AzureCommunicationsCallWithChatAdapter ([PR #2102](https://github.com/azure/communication-ui-library/pull/2102) by 94866715+dmceachernmsft@users.noreply.github.com)
- bump calling beta to 1.6.0-beta.1 ([PR #2047](https://github.com/azure/communication-ui-library/pull/2047) by miguelgamis@microsoft.com)
- Incorporate PeoplePaneContent into Call Composite ([PR #2109](https://github.com/azure/communication-ui-library/pull/2109) by edwardlee@microsoft.com)
- update dtmf dialpad styles and behavior to overflow left side and not format number generated from dtmf tones. ([PR #2288](https://github.com/azure/communication-ui-library/pull/2288) by 94866715+dmceachernmsft@users.noreply.github.com)
- Hermetic tests for device button in call screen for different roles ([PR #2234](https://github.com/azure/communication-ui-library/pull/2234) by 97124699+prabhjot-msft@users.noreply.github.com)
- Show 'You Left the Call' screen when you remove the last PSTN user. Show 'You were removed' screen when a PSTN user hangs up the call. ([PR #2295](https://github.com/azure/communication-ui-library/pull/2295) by anjulgarg@live.com)
- introdocues hermetic tests to the calling composite for new hold experience. ([PR #2217](https://github.com/azure/communication-ui-library/pull/2217) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add isMobile to dialpad so dialpad can handle mobile and web clicks differently ([PR #2283](https://github.com/azure/communication-ui-library/pull/2283) by carolinecao@microsoft.com)
- Add open dtmf dialpad option for calling and callwithchat ([PR #2227](https://github.com/azure/communication-ui-library/pull/2227) by carolinecao@microsoft.com)
- CallComposite will not request for camera permissions when the role prop is Consumer. ([PR #2218](https://github.com/azure/communication-ui-library/pull/2218) by miguelgamis@microsoft.com)
- Add new icon backspace ([PR #2085](https://github.com/azure/communication-ui-library/pull/2085) by carolinecao@microsoft.com)
- Account for RemoteHold call status in Call Composite ([PR #2232](https://github.com/azure/communication-ui-library/pull/2232) by edwardlee@microsoft.com)
- Introduces link to troubleShooting page provided by Contoso. ([PR #2282](https://github.com/azure/communication-ui-library/pull/2282) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update adhoc call work for making PSTN and 1:N calls. ([PR #2073](https://github.com/azure/communication-ui-library/pull/2073) by 94866715+dmceachernmsft@users.noreply.github.com)
- change dialpad content name to digit and letter ([PR #2262](https://github.com/azure/communication-ui-library/pull/2262) by carolinecao@microsoft.com)
- VideoGallery displays participants connection states such as Connecting, Hold etc. ([PR #2210](https://github.com/azure/communication-ui-library/pull/2210) by anjulgarg@live.com)
- Fix dialpad styles so that ellipsis are on left of the number that is being dialed. ([PR #2268](https://github.com/azure/communication-ui-library/pull/2268) by 94866715+dmceachernmsft@users.noreply.github.com)
- Local and remote PIP not showing local video tile if role does permit camera ([PR #2349](https://github.com/azure/communication-ui-library/pull/2349) by miguelgamis@microsoft.com)
- Custom composite end call screens when room call join fails when room does not exist or user is not invited to room. ([PR #2287](https://github.com/azure/communication-ui-library/pull/2287) by miguelgamis@microsoft.com)
- Introduces hermetic tests in the CallComposite for the unsupportedEnvironment page ([PR #2387](https://github.com/azure/communication-ui-library/pull/2387) by 94866715+dmceachernmsft@users.noreply.github.com)
- BrowserPermissionDenied Components created ([PR #2382](https://github.com/azure/communication-ui-library/pull/2382) by edwardlee@microsoft.com)
- Update lobby screen to reflect to the user who they are calling in a  1:1 PSTN or ACS call. ([PR #2403](https://github.com/azure/communication-ui-library/pull/2403) by 94866715+dmceachernmsft@users.noreply.github.com)
- Use usepropsfor to grab props for dropdown ([PR #2389](https://github.com/azure/communication-ui-library/pull/2389) by carolinecao@microsoft.com)
- Remove camera access error bar error for consumer role ([PR #2404](https://github.com/azure/communication-ui-library/pull/2404) by miguelgamis@microsoft.com)
- introduces unsupported browser page for the calling composites using new component. ([PR #2385](https://github.com/azure/communication-ui-library/pull/2385) by 94866715+dmceachernmsft@users.noreply.github.com)
- Close button set root backgroud to theme.semanticColors.bodyBackground ([PR #2395](https://github.com/azure/communication-ui-library/pull/2395) by miguelgamis@microsoft.com)
- Fix bug where Calling... string would flash when joining a group call. ([PR #2411](https://github.com/azure/communication-ui-library/pull/2411) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.3.0](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.3.0)

Mon, 13 Jun 2022 18:29:27 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.2.2-beta.1...@internal/react-composites_v1.3.0)

### Minor changes

- update dominantspeaker selector to work with videoGalleryUtils function changes. ([PR #1929](https://github.com/azure/communication-ui-library/pull/1929) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Add a default host layer in base provider 1. make our lib compatible with react-full-screen 2. avoid polluting global dom tree ([PR #1950](https://github.com/azure/communication-ui-library/pull/1950) by jinan@microsoft.com)
- Refactor: Ensure the LocalAndRemotePiP reuses the same LocalVideoTile and RemoteVideoTile the VideoGallery component uses ([PR #1930](https://github.com/azure/communication-ui-library/pull/1930) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix param value in callId change event ([PR #1819](https://github.com/azure/communication-ui-library/pull/1819) by jiangnanhello@live.com)
- filecard should be clickable, also in mobile view when waiting in lobby, make more button disabled ([PR #1886](https://github.com/azure/communication-ui-library/pull/1886) by carolinecao@microsoft.com)
- Fixed font of LocalPreview label that indicates camera is off. ([PR #1827](https://github.com/azure/communication-ui-library/pull/1827) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix a memoization in Call-based composites to prevent onRenderAvatar triggering unecessary re-renders ([PR #1935](https://github.com/azure/communication-ui-library/pull/1935) by 2684369+JamesBurnside@users.noreply.github.com)
- Update createStreamView to return the created stream view result ([PR #1891](https://github.com/azure/communication-ui-library/pull/1891) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed contextual menus in CallWithChatComposite and CallComposite to be responsive to window resize. ([PR #1800](https://github.com/azure/communication-ui-library/pull/1800) by miguelgamis@microsoft.com)
- Ensure referential ID of callwithchatcomposite is unique among call with chat instances ([PR #1869](https://github.com/azure/communication-ui-library/pull/1869) by 2684369+JamesBurnside@users.noreply.github.com)
- Introduce tests to support new custom data model behaviors. ([PR #1836](https://github.com/azure/communication-ui-library/pull/1836) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce the usage of the adapters error handling to the fetchInitialData function. ([PR #1845](https://github.com/azure/communication-ui-library/pull/1845) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix whole app re-render when callId changes ([PR #1820](https://github.com/azure/communication-ui-library/pull/1820) by jiangnanhello@live.com)
- Fix the display name of the remote participants when they provide onFetchAvatarPersonaData prop. ([PR #1822](https://github.com/azure/communication-ui-library/pull/1822) by 94866715+dmceachernmsft@users.noreply.github.com)
- updating beta @azure/communication-calling to 1.5.4-beta.1 ([PR #1925](https://github.com/azure/communication-ui-library/pull/1925) by 79475487+mgamis-msft@users.noreply.github.com)
- Change Microphone Contextual Menu header text to Audio Device when no speakers are detected ([PR #1883](https://github.com/azure/communication-ui-library/pull/1883) by edwardlee@microsoft.com)
- Remove spurius console log ([PR #1451](https://github.com/azure/communication-ui-library/pull/1451) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)
- Bump @internal/calling-component-bindings to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)
- Bump @internal/calling-stateful-client to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)
- Bump @internal/chat-component-bindings to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)
- Bump @internal/chat-stateful-client to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)
- Bump @internal/react-components to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)

### Changes

- Rework how Custom buttons are injected in Call Composite and add Custom Button Injection into CallWithChat Composite ([PR #1931](https://github.com/azure/communication-ui-library/pull/1931) by edwardlee@microsoft.com)
- add placeholders for PSTN functions in the adapters for when time to add to composites ([PR #1914](https://github.com/azure/communication-ui-library/pull/1914) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added Icon button for upload button, cancel file upload icon and download icon to make it tab navigable ([PR #1881](https://github.com/azure/communication-ui-library/pull/1881) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update the Call and CallWithChat Adapters to use `onToggleHold` and `onAddParticipant` calling handlers ([PR #1973](https://github.com/azure/communication-ui-library/pull/1973) by 94866715+dmceachernmsft@users.noreply.github.com)
- Performance improvement by preventing CallWithChat composite reloads when toggling side panes on mobile devices ([PR #1941](https://github.com/azure/communication-ui-library/pull/1941) by anjulgarg@live.com)
- Updating @azure/communication-chat to 1.2.0 ([PR #1815](https://github.com/azure/communication-ui-library/pull/1815) by anjulgarg@live.com)
- Allow removal of files when editing a message  ([PR #1872](https://github.com/azure/communication-ui-library/pull/1872) by anjulgarg@live.com)
- Show a loading spinner when remote video stream is loading ([PR #1954](https://github.com/azure/communication-ui-library/pull/1954) by chwhilar@microsoft.com)
- Introduce Icons for hold button to composites. ([PR #1919](https://github.com/azure/communication-ui-library/pull/1919) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.2.0](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.2.0)

Fri, 11 Mar 2022 19:20:02 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.1.1-beta.1...@internal/react-composites_v1.2.0)

### Minor changes

- Switch CallWithChat from Beta to Public and Stable ([PR #1612](https://github.com/azure/communication-ui-library/pull/1612) by edwardlee@microsoft.com)
- Added LocalAndRemotePIP to mobile EmbeddedPeoplePane. ([PR #1540](https://github.com/azure/communication-ui-library/pull/1540) by miguelgamis@microsoft.com)
- Add useAzureCommunicationCallAdapter hook ([PR #1618](https://github.com/azure/communication-ui-library/pull/1618) by 82062616+prprabhu-ms@users.noreply.github.com)
- Using drawer menu when participant is clicked on PeoplePane in mobile view of CallWithChat composite. ([PR #1515](https://github.com/azure/communication-ui-library/pull/1515) by miguelgamis@microsoft.com)
- Increase the border radius of buttons in composites with call features ([PR #1609](https://github.com/azure/communication-ui-library/pull/1609) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Sidepane copy invite link and cancel button UI style fix ([PR #1581](https://github.com/azure/communication-ui-library/pull/1581) by edwardlee@microsoft.com)
- SidePane style updates. ([PR #1599](https://github.com/azure/communication-ui-library/pull/1599) by miguelgamis@microsoft.com)
- Fix react useEffect dependencies in composites ([PR #1600](https://github.com/azure/communication-ui-library/pull/1600) by 2684369+JamesBurnside@users.noreply.github.com)
- CallWithChat SplitButtonMenuButton inner border radius squared ([PR #1570](https://github.com/azure/communication-ui-library/pull/1570) by edwardlee@microsoft.com)
- Add soft vertical height support for unsupported mobile landscape orientation in Calling-based Composites ([PR #1572](https://github.com/azure/communication-ui-library/pull/1572) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @azure/communication-calling to 1.4.3 ([PR #1610](https://github.com/azure/communication-ui-library/pull/1610) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)
- Bump @internal/calling-component-bindings to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)
- Bump @internal/calling-stateful-client to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)
- Bump @internal/chat-component-bindings to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)
- Bump @internal/chat-stateful-client to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)
- Bump @internal/react-components to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)

### Changes

- Show error above sendbox if message is sent before all files are uploaded. ([PR #1593](https://github.com/azure/communication-ui-library/pull/1593) by anjulgarg@live.com)
- Remove customization for unread messages button icon. Fix styling when unread messages exceeds 9 messages ([PR #1582](https://github.com/azure/communication-ui-library/pull/1582) by 2684369+JamesBurnside@users.noreply.github.com)
- Add useAzureCommunicationCallWithChatAdapter hook ([PR #1605](https://github.com/azure/communication-ui-library/pull/1605) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add tooltips to people and chat buttons ([PR #1604](https://github.com/azure/communication-ui-library/pull/1604) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce strings for more buttons to facilitate narrator functionality. ([PR #1614](https://github.com/azure/communication-ui-library/pull/1614) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add filesharing feature to CallWithChat Composite ([PR #1613](https://github.com/azure/communication-ui-library/pull/1613) by anjulgarg@live.com)
- Update filesharing attribute names ([PR #1616](https://github.com/azure/communication-ui-library/pull/1616) by anjulgarg@live.com)
- Add default implementation of file upload UI to SendBox ([PR #1595](https://github.com/azure/communication-ui-library/pull/1595) by 97124699+prabhjot-msft@users.noreply.github.com)
- Mobile Participant pane now spans full sidepane width ([PR #1589](https://github.com/azure/communication-ui-library/pull/1589) by edwardlee@microsoft.com)
- bugfix: Dispose adapter in hook when component unmounts ([PR #1619](https://github.com/azure/communication-ui-library/pull/1619) by 82062616+prprabhu-ms@users.noreply.github.com)
- Rename CallWithChatComposite adapter prop from `callWithChatAdapter` to `adapter` ([PR #1552](https://github.com/azure/communication-ui-library/pull/1552) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix chat unread messages badge border to always be white ([PR #1608](https://github.com/azure/communication-ui-library/pull/1608) by 2684369+JamesBurnside@users.noreply.github.com)
- Timeout file upload error bar after 10 seconds ([PR #1578](https://github.com/azure/communication-ui-library/pull/1578) by anjulgarg@live.com)
- Fix control bar button text wrapping to a new line in the CallWithChatComposite ([PR #1577](https://github.com/azure/communication-ui-library/pull/1577) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix call control bar wrapping to a new line at high zoom levels and narrow screen heights ([PR #1571](https://github.com/azure/communication-ui-library/pull/1571) by 2684369+JamesBurnside@users.noreply.github.com)
- Show file upload errors above sendbox in Composites containing Chat features ([PR #1554](https://github.com/azure/communication-ui-library/pull/1554) by 97124699+prabhjot-msft@users.noreply.github.com)
- Show loader in File card until file download promise is resolved ([PR #1574](https://github.com/azure/communication-ui-library/pull/1574) by 97124699+prabhjot-msft@users.noreply.github.com)
- Upgrading calling to 1.4.3-beta.1 ([PR #1607](https://github.com/azure/communication-ui-library/pull/1607) by edwardlee@microsoft.com)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.1)

Mon, 24 Jan 2022 23:18:55 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.1...@internal/react-composites_v1.0.1)

### Minor changes

- implemented custom datamodel functionality to meeting composite excluding sidebar. ([PR #1319](https://github.com/azure/communication-ui-library/pull/1319) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added MeetingCompositeOptions type to the meetings composite. ([PR #1272](https://github.com/azure/communication-ui-library/pull/1272) by 94866715+dmceachernmsft@users.noreply.github.com)
- changed meeting peopel pane to use ParticipantContainer Component. ([PR #1328](https://github.com/azure/communication-ui-library/pull/1328) by 94866715+dmceachernmsft@users.noreply.github.com)
- added missing return types. ([PR #1332](https://github.com/azure/communication-ui-library/pull/1332) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add API for injecting custom buttons into CallComposite ([PR #1314](https://github.com/azure/communication-ui-library/pull/1314) by 82062616+prprabhu-ms@users.noreply.github.com)
- Added strings to the side pane from locale context. ([PR #1278](https://github.com/azure/communication-ui-library/pull/1278) by 94866715+dmceachernmsft@users.noreply.github.com)
- Do not remove users from chat in the meeting composite. ([PR #1340](https://github.com/azure/communication-ui-library/pull/1340) by 2684369+JamesBurnside@users.noreply.github.com)

### Patches

- Small code modifications for conditional build 1. Conditional build does not support <Type*> convert, use `foo as Bar` 2. Add a hook to bypass type error when build meeting composite ([PR #1284](https://github.com/azure/communication-ui-library/pull/1284) by jinan@microsoft.com)
- Move @azure/communication-{calling, chat} to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- Increase size of participant flyout menu items for mobile view ([PR #1322](https://github.com/azure/communication-ui-library/pull/1322) by edwardlee@microsoft.com)
- Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
- Bump @internal/acs-ui-common to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)
- Bump @internal/calling-stateful-client to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)
- Bump @internal/calling-component-bindings to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)
- Bump @internal/chat-stateful-client to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)
- Bump @internal/chat-component-bindings to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)
- Bump @internal/react-components to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.1)

Tue, 04 Jan 2022 22:57:09 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.0...@internal/react-composites_v1.0.1)

### Minor changes

- added localization strings and added meetingscreen component to increase readability of the meeting composite. ([PR #1274](https://github.com/azure/communication-ui-library/pull/1274) by 94866715+dmceachernmsft@users.noreply.github.com)
- added fix to allow for false value for meetingCallOptions to hide whole bar. ([PR #1266](https://github.com/azure/communication-ui-library/pull/1266) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add autofocus property to the Chat Composite ([PR #1235](https://github.com/azure/communication-ui-library/pull/1235) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Bump @internal/acs-ui-common to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)
- Bump @internal/calling-stateful-client to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)
- Bump @internal/calling-component-bindings to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)
- Bump @internal/chat-stateful-client to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)
- Bump @internal/chat-component-bindings to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)
- Bump @internal/react-components to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)

## [1.0.0](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.0)

Mon, 06 Dec 2021 19:41:59 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.0-beta.8..@internal/react-composites_v1.0.0)

### Changes

- Fix typo in strings field ([PR #1210](https://github.com/azure/communication-ui-library/pull/1210) by 82062616+prprabhu-ms@users.noreply.github.com)
- Restricting typing indicator to the max width of sendbox ([PR #1191](https://github.com/azure/communication-ui-library/pull/1191) by anjulgarg@live.com)
- Disable microphone toggle in lobby as it's not supported by headless SDK ([PR #1139](https://github.com/azure/communication-ui-library/pull/1139) by anjulgarg@live.com)
- Immediately fetch initial chat data when creating azure communication chat adapter ([PR #1168](https://github.com/azure/communication-ui-library/pull/1168) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix ComplianceBanner auto-dismiss ([PR #1117](https://github.com/azure/communication-ui-library/pull/1117) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add localized tooltip to microphone button in lobby informing users that it is disabled. ([PR #1148](https://github.com/azure/communication-ui-library/pull/1148) by anjulgarg@live.com)
- Remove beta-only public API ([PR #1114](https://github.com/azure/communication-ui-library/pull/1114) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adding displayName restriction docs to API ([PR #1202](https://github.com/azure/communication-ui-library/pull/1202) by anjulgarg@live.com)
- TDBuild - updating localized resource files. ([PR #1197](https://github.com/azure/communication-ui-library/pull/1197) by miguelgamis@microsoft.com)
- Update composite automation snapshots ([PR #1158](https://github.com/azure/communication-ui-library/pull/1158) by anjulgarg@live.com)
- Change name contains option to options ([PR #1173](https://github.com/azure/communication-ui-library/pull/1173) by jinan@microsoft.com)
- Enable icons and locales in Meeting Composite ([PR #1132](https://github.com/azure/communication-ui-library/pull/1132) by allenhwang@microsoft.com)