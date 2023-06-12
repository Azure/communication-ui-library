# Change Log - @azure/communication-react

This log was last generated on Mon, 12 Jun 2023 19:04:18 GMT and should not be manually modified.

<!-- Start content -->

## [1.6.0](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.6.0)

Mon, 12 Jun 2023 19:04:18 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.5.1-beta.5...@azure/communication-react_v1.6.0)

### Minor changes

- Updated `@azure/communication-calling` to `1.13.1` ([PR #3040](https://github.com/azure/communication-ui-library/pull/3040) by jiangnanhello@live.com)
- Updated `@azure/communication-chat` to `1.3.1` ([PR #2913](https://github.com/azure/communication-ui-library/pull/2913) by 109105353+jpeng-ms@users.noreply.github.com)
- Add a leaving page when the call state is in disconnecting ([PR #3108](https://github.com/azure/communication-ui-library/pull/3108) by jiangnanhello@live.com)
- Updated use of `react-aria-live` to support react 18 support ([PR #3050](https://github.com/azure/communication-ui-library/pull/3050) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove public API usage of ComponentSlotStyle and redefine type internally ([PR #2996](https://github.com/azure/communication-ui-library/pull/2996) by 2684369+JamesBurnside@users.noreply.github.com)
- Internally wrap `@fluentui/northstar` package for react 18 support ([PR #2983](https://github.com/azure/communication-ui-library/pull/2983) by 3941071+emlynmac@users.noreply.github.com)
- Bump peer depedencies to react 18 ([PR #3050](https://github.com/azure/communication-ui-library/pull/3050) by 2684369+JamesBurnside@users.noreply.github.com)
- Update `@azure/communication-chat` perr depedencies from fixed version to a range of supported versions ([PR #2727](https://github.com/azure/communication-ui-library/pull/2727) by edwardlee@microsoft.com)
- Add `isCameraOn` state to help track camera state in the CallAdapter. ([PR #2641](https://github.com/azure/communication-ui-library/pull/2641) by 94866715+dmceachernmsft@users.noreply.github.com)
- Edit message error handling UI in ChatThread component ([PR #2891](https://github.com/azure/communication-ui-library/pull/2891) by 3941071+emlynmac@users.noreply.github.com)
- Add `AR_SA`, `FI_FI`, `HE_IL`, `NB_NO`, `PL_PL` and `SV_SE` locales ([PR #3163](https://github.com/azure/communication-ui-library/pull/3163) by 77021369+jimchou-dev@users.noreply.github.com)
- Update `@fluentui/react-icons` to `2.0.194` ([PR #2749](https://github.com/azure/communication-ui-library/pull/2749) by 2684369+JamesBurnside@users.noreply.github.com)
- Update `@fluentui/react-file-type-icons` to `8.8.13` ([PR #2934](https://github.com/azure/communication-ui-library/pull/2934) by 2684369+JamesBurnside@users.noreply.github.com)
- Split buttons now hold primary action for toggling camera and mic on touch devices. ([PR #2773](https://github.com/azure/communication-ui-library/pull/2773) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Switch video seamlessly from different devices ([PR #2726](https://github.com/azure/communication-ui-library/pull/2726) by jinan@microsoft.com)
- Center more button in video tile ([PR #2902](https://github.com/azure/communication-ui-library/pull/2902) by edwardlee@microsoft.com)
- Fix messages thread loading issue when an adapter is updated ([PR #2784](https://github.com/azure/communication-ui-library/pull/2784) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Addressed the issue where local participant label's luminosity ratio does not meet MAS guidelines ([PR #2795](https://github.com/azure/communication-ui-library/pull/2795) by 109105353+jpeng-ms@users.noreply.github.com)
- Allow horizontal gallery tiles to resize to allow for better use of space. ([PR #2830](https://github.com/azure/communication-ui-library/pull/2830) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add heading role and aria level for start a call config heading ([PR #2845](https://github.com/azure/communication-ui-library/pull/2845) by edwardlee@microsoft.com)
- Call control buttons should stay centered with regard to viewport width ([PR #2847](https://github.com/azure/communication-ui-library/pull/2847) by carolinecao@microsoft.com)
- Fix bug when side pane is open, error bar was overlayed on top ([PR #2848](https://github.com/azure/communication-ui-library/pull/2848) by carolinecao@microsoft.com)
- Fix how common code deals with E.164 numbers ([PR #3176](https://github.com/azure/communication-ui-library/pull/3176) by alkwa@microsoft.com)
- Refactor internal code to better reuse side pane and control bar across composites ([PR #2976](https://github.com/azure/communication-ui-library/pull/2976) by 2684369+JamesBurnside@users.noreply.github.com)
- Filter messageReceived notification by threadId in ChatAdapter ([PR #3056](https://github.com/azure/communication-ui-library/pull/3056) by longamy@microsoft.com)
- Disable the selectivity of a text in video gallery for long touch to function properly ([PR #2790](https://github.com/azure/communication-ui-library/pull/2790) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fixed long `seen` display name as ellipsis ([PR #3090](https://github.com/azure/communication-ui-library/pull/3090) by 77021369+jimchou-dev@users.noreply.github.com)
- Fix side pane overlapping with composite when window is narrow ([PR #2864](https://github.com/azure/communication-ui-library/pull/2864) by 79475487+mgamis-msft@users.noreply.github.com)
- Remove side pane control button container if no controls are present to be used ([PR #2969](https://github.com/azure/communication-ui-library/pull/2969) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add `Edited` for live message speak out ([PR #3173](https://github.com/azure/communication-ui-library/pull/3173) by longamy@microsoft.com)
- Thematically change hold icon color ([PR #2706](https://github.com/azure/communication-ui-library/pull/2706) by edwardlee@microsoft.com)
- Fixes error bar messaging for when camera is in use. ([PR #2671](https://github.com/azure/communication-ui-library/pull/2671) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add error string for when your remote video feed is frozen for others in the call. ([PR #2808](https://github.com/azure/communication-ui-library/pull/2808) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix findDOMNode warning caused by react.strictmode. ([PR #2621](https://github.com/azure/communication-ui-library/pull/2621) by 94866715+dmceachernmsft@users.noreply.github.com)
- Utilize `CommunicationIdentifier` (de)serialization logic from `@azure/communication-common` ([PR #2614](https://github.com/azure/communication-ui-library/pull/2614) by petrsvihlik@microsoft.com)
- Add margin to participant item to allow the focus border to show when selecting each participant with keyboard ([PR #3178](https://github.com/azure/communication-ui-library/pull/3178) by 94866715+dmceachernmsft@users.noreply.github.com)
- Prevent overflow of call composite in call with chat composite when side pane is open ([PR #2861](https://github.com/azure/communication-ui-library/pull/2861) by 79475487+mgamis-msft@users.noreply.github.com)
- Hide Camera, Microphone, and Screenshare buttons in rooms calls depending on role ([PR #2944](https://github.com/azure/communication-ui-library/pull/2944) by 79475487+mgamis-msft@users.noreply.github.com)
- Embed the EditBox inside a Chat.Message to enable the accessibility ([PR #3097](https://github.com/azure/communication-ui-library/pull/3097) by longamy@microsoft.com)
- Update useAzureCommunicationCallAdapter hook to protect against multiple client creations ([PR #3157](https://github.com/azure/communication-ui-library/pull/3157) by 94866715+dmceachernmsft@users.noreply.github.com)
- Replace Coffee Icon with Spinner ([PR #2885](https://github.com/azure/communication-ui-library/pull/2885) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update Aria labels for people button to allow for voice access controls on windows. ([PR #2833](https://github.com/azure/communication-ui-library/pull/2833) by 94866715+dmceachernmsft@users.noreply.github.com)
- Remove default persona coin size in VideoTile. Changed onRenderAvatar callback not show persona until coin size is defined. ([PR #3051](https://github.com/azure/communication-ui-library/pull/3051) by 79475487+mgamis-msft@users.noreply.github.com)
- Update json5 dependency ([PR #2645](https://github.com/azure/communication-ui-library/pull/2645) by edwardlee@microsoft.com)
- Prevent overflow of VideoGallery when side pane is open ([PR #2850](https://github.com/azure/communication-ui-library/pull/2850) by miguelgamis@microsoft.com)
- Update forced colours on configuration screen to allow better high contrast experience for user. ([PR #2955](https://github.com/azure/communication-ui-library/pull/2955) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update overflow gallery logic to allow more video participants to render video streams if available on different pages. ([PR #2818](https://github.com/azure/communication-ui-library/pull/2818) by 94866715+dmceachernmsft@users.noreply.github.com)
- Announce by Screen Reader after leaving chat ([PR #2681](https://github.com/azure/communication-ui-library/pull/2681) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Added empty icon render for tab navigation of video tile ([PR #2693](https://github.com/azure/communication-ui-library/pull/2693) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update error message for unsupported chat thread types ([PR #2907](https://github.com/azure/communication-ui-library/pull/2907) by 77021369+jimchou-dev@users.noreply.github.com)
- Resolve overlap of tooltip and list of devices on mobile configuration page ([PR #3013](https://github.com/azure/communication-ui-library/pull/3013) by edwardlee@microsoft.com)
- Fixed richtext css for blockquote and table in chat messages ([PR #2839](https://github.com/azure/communication-ui-library/pull/2839) by 77021369+jimchou-dev@users.noreply.github.com)
- Fix CallAdapter participants joined and left events to show correct participants in event array. ([PR #2837](https://github.com/azure/communication-ui-library/pull/2837) by 94866715+dmceachernmsft@users.noreply.github.com)
- Correct MessageThread API definition ([PR #2812](https://github.com/azure/communication-ui-library/pull/2812) by 3941071+emlynmac@users.noreply.github.com)
- Sendbox icon alignment fixes ([PR #3022](https://github.com/azure/communication-ui-library/pull/3022) by longamy@microsoft.com)
- Update internal dispose view logic to be under one utility function for remote and local streams. ([PR #2758](https://github.com/azure/communication-ui-library/pull/2758) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix race condition where the remote video tile was not showing the participant's video ([PR #2672](https://github.com/azure/communication-ui-library/pull/2672) by 2684369+JamesBurnside@users.noreply.github.com)
- Set min height to control bar to fix issue where control bar contrainer would collapse when side pane buttons are disabled in Composites ([PR #2963](https://github.com/azure/communication-ui-library/pull/2963) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix horizontal gallery button icon directions in rtl mode ([PR #3008](https://github.com/azure/communication-ui-library/pull/3008) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix dominant speaker ordering to best keep dominant speakers on the first page of overflow gallery. ([PR #2819](https://github.com/azure/communication-ui-library/pull/2819) by miguelgamis@microsoft.com)
- Fix VideoGallery rerender when a participant is pinned for the first time. ([PR #2650](https://github.com/azure/communication-ui-library/pull/2650) by 79475487+mgamis-msft@users.noreply.github.com)
- Make sure message status in storybook is defined to avoid 'try send again' showing up ([PR #2732](https://github.com/azure/communication-ui-library/pull/2732) by carolinecao@microsoft.com)
- Fix bug where error bar overlays with pane ([PR #3024](https://github.com/azure/communication-ui-library/pull/3024) by carolinecao@microsoft.com)
- Internal RemoteVideoTile should not default to having contextual menu options. ([PR #2653](https://github.com/azure/communication-ui-library/pull/2653) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix: Permission Error in Chat after leaving a Teams Interop meeting ([PR #2777](https://github.com/azure/communication-ui-library/pull/2777) by 2684369+JamesBurnside@users.noreply.github.com)
- Show local video and vertical/horizontal gallery when screensharing with no participants ([PR #2822](https://github.com/azure/communication-ui-library/pull/2822) by carolinecao@microsoft.com)
- Add missing 'rem' from width of avatar. This caused formatting issues when embedding inside a Teams Toolkit App. ([PR #3161](https://github.com/azure/communication-ui-library/pull/3161) by palatter@microsoft.com)
- Fix bug where static html samples are not showing fluent icons ([PR #3106](https://github.com/azure/communication-ui-library/pull/3106) by carolinecao@microsoft.com)
- Fix bug where captions rtl languages are not right aligned  ([PR #2999](https://github.com/azure/communication-ui-library/pull/2999) by carolinecao@microsoft.com)
- Updates streamUtils to handle multiple Calls from components. ([PR #2713](https://github.com/azure/communication-ui-library/pull/2713) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added missing aria label for title in this call ([PR #2667](https://github.com/azure/communication-ui-library/pull/2667) by carolinecao@microsoft.com)
- Enable ArrowUp and ArrowDown key inside EditBox ([PR #3177](https://github.com/azure/communication-ui-library/pull/3177) by longamy@microsoft.com)
- Update stream utils to have general createView function for both remote and local. ([PR #2755](https://github.com/azure/communication-ui-library/pull/2755) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update the Errorbar selector to check environmentInfo for mac specific warnings. ([PR #2691](https://github.com/azure/communication-ui-library/pull/2691) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix regression where chat and hold buttons werent disabled when the call went into hold ([PR #3029](https://github.com/azure/communication-ui-library/pull/3029) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix empty string bug in createAnnouncmentString() ([PR #2630](https://github.com/azure/communication-ui-library/pull/2630) by jinan@microsoft.com)
- Move logging from StreamUtils to be managed in seperate file. ([PR #2753](https://github.com/azure/communication-ui-library/pull/2753) by 94866715+dmceachernmsft@users.noreply.github.com)
- Modify Avatar to person icon when no displayName ([PR #2636](https://github.com/azure/communication-ui-library/pull/2636) by jinan@microsoft.com)
- Added stream type in stream logs ([PR #2705](https://github.com/azure/communication-ui-library/pull/2705) by carolinecao@microsoft.com)
- Fix VideoTile to show menu button on hover when isSpeaking prop is true ([PR #2721](https://github.com/azure/communication-ui-library/pull/2721) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix scroll and new message prompt in sidepane chat for safari ([PR #3116](https://github.com/azure/communication-ui-library/pull/3116) by edwardlee@microsoft.com)
- Update locale strings ([PR #3181](https://github.com/azure/communication-ui-library/pull/3181) by 2684369+JamesBurnside@users.noreply.github.com)
- Bound CallReadiness screens to the boundaries of the app ([PR #2624](https://github.com/azure/communication-ui-library/pull/2624) by edwardlee@microsoft.com)
- Fix sending/delivered/failed message status not showing in large group ([PR #2707](https://github.com/azure/communication-ui-library/pull/2707) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Remove empty space to the right of participant displayName when tile is not being interacted with. ([PR #3080](https://github.com/azure/communication-ui-library/pull/3080) by 94866715+dmceachernmsft@users.noreply.github.com)
- Made sure error bar innerText always centered  ([PR #2668](https://github.com/azure/communication-ui-library/pull/2668) by carolinecao@microsoft.com)
- Fix High Contrast issues with the screenshare button and end call button. ([PR #2956](https://github.com/azure/communication-ui-library/pull/2956) by 94866715+dmceachernmsft@users.noreply.github.com)
- updating version of node to 16.19.0 across all packlets ([PR #3016](https://github.com/azure/communication-ui-library/pull/3016) by 79329532+alkwa-msft@users.noreply.github.com)
- Changed horizontal gallery to be scrollable when VideoGallery width is narrow. ([PR #2640](https://github.com/azure/communication-ui-library/pull/2640) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix issue where new controls were not being respected by the overflow galleries. ([PR #3172](https://github.com/azure/communication-ui-library/pull/3172) by 94866715+dmceachernmsft@users.noreply.github.com)
- VideoGallery in call composite will use a vertical overflow gallery when its aspect ratio is 16:9 or greater. ([PR #2786](https://github.com/azure/communication-ui-library/pull/2786) by 79475487+mgamis-msft@users.noreply.github.com)
- Video tile ellipsis should only appear on hover ([PR #2661](https://github.com/azure/communication-ui-library/pull/2661) by 97124699+prabhjot-msft@users.noreply.github.com)

## [1.5.0](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.5.0)

Wed, 04 Jan 2023 23:56:34 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.4.1-beta.1...@azure/communication-react_v1.5.0)

This minor release contains minor package updates, and a series of small patches.

As well introduces new A11y features in the CallComposite to announce events like when participants come and go. 

Fixes github issue for chatThread being unable to block [editing of messages](https://github.com/Azure/communication-ui-library/issues/2569). 

### Minor changes

- `@internal/react-composites`
  - Revert breaking API change in `CallEndedListener` callback ([PR #2464](https://github.com/azure/communication-ui-library/pull/2464) by 82062616+prprabhu-ms@users.noreply.github.com)
- `@azure/communication-react`
  - Update Composite dropdown behavior to correctly notify the user that they have no devices. ([PR #2575](https://github.com/azure/communication-ui-library/pull/2575) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add narrator announcements to participant button copy link and peoplepane copylink button in CallWithChat composite. ([PR #2588](https://github.com/azure/communication-ui-library/pull/2588) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update adapter selectors for new Calling client variables environmentInfo and alternateCallerId. ([PR #2593](https://github.com/azure/communication-ui-library/pull/2593) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add a prop to ErrorBar component to ignore old errors ([PR #2549](https://github.com/azure/communication-ui-library/pull/2549) by 82062616+prprabhu-ms@users.noreply.github.com)
- `@internal/react-components`
  - Update html-to-react dependency. Note: This change requires Webpack > 4. ([PR #2428](https://github.com/azure/communication-ui-library/pull/2428) by 2684369+JamesBurnside@users.noreply.github.com)

### Patches

- `@internal/react-composites`
  - Fix remove participant logic for teams user. Make sure to enforce isRemovable property on participantList participant. ([PR #2454](https://github.com/azure/communication-ui-library/pull/2454) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Focus on participant list when opening people pane ([PR #2492](https://github.com/azure/communication-ui-library/pull/2492) by edwardlee@microsoft.com)
  - Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Config page local preview does not show a black screen when camera devices are removed. ([PR #2456](https://github.com/azure/communication-ui-library/pull/2456) by anjulgarg@live.com)
  - Fix issue where typingIndicator errors were not being caught by the ChatAdapter ([PR #2471](https://github.com/azure/communication-ui-library/pull/2471) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Bump dependencies to get closer to react 18 support ([PR #2427](https://github.com/azure/communication-ui-library/pull/2427) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix CallWithChatPane drawer menu that stays open after switching mobile tabs ([PR #2447](https://github.com/azure/communication-ui-library/pull/2447) by miguelgamis@microsoft.com)
  - setting icon definition to undefined if icon is already defined by fluent ([PR #2506](https://github.com/azure/communication-ui-library/pull/2506) by carolinecao@microsoft.com)
  - Refresh string translations ([PR #2443](https://github.com/azure/communication-ui-library/pull/2443) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Increase max listener limit to remove warning in console ([PR #2483](https://github.com/azure/communication-ui-library/pull/2483) by carolinecao@microsoft.com)
  - Fix a string name and restrict it to beta builds ([PR #2439](https://github.com/azure/communication-ui-library/pull/2439) by 82062616+prprabhu-ms@users.noreply.github.com)
- `@internal/storybook`
  - Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Add documentation for minimum typescript and webpack versions. ([PR #2428](https://github.com/azure/communication-ui-library/pull/2428) by 2684369+JamesBurnside@users.noreply.github.com)
- `@azure/communication-react`
  - Fix spacing for local Camera switcher button when in localVideoTile. ([PR #2571](https://github.com/azure/communication-ui-library/pull/2571) by 94866715+dmceachernmsft@users.noreply.github.com)
  - update webpack version. ([PR #2625](https://github.com/azure/communication-ui-library/pull/2625) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add anouncement strings to the composites so the narrator will announce when someone joins or leaves ([PR #2546](https://github.com/azure/communication-ui-library/pull/2546) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Tee errors to state when starting or stopping a local video preview outside of a call fails ([PR #2594](https://github.com/azure/communication-ui-library/pull/2594) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix chat pane problem when no parent height is set ([PR #2596](https://github.com/azure/communication-ui-library/pull/2596) by jinan@microsoft.com)
  - Display correct error text and guidance text for device permission errors on safari browser ([PR #2590](https://github.com/azure/communication-ui-library/pull/2590) by carolinecao@microsoft.com)
  - Bugfix disableEditing not working in MessageThread. ([PR #2570](https://github.com/azure/communication-ui-library/pull/2570) by anjulgarg@live.com)
  - Fix tab order focus on Call Composite and CallWithChat Composite ([PR #2601](https://github.com/azure/communication-ui-library/pull/2601) by edwardlee@microsoft.com)
  - Update express, storybook, and cpy-cli dependencies ([PR #2612](https://github.com/azure/communication-ui-library/pull/2612) by edwardlee@microsoft.com)
  - Update samples to disable pull down to refresh in chat ([PR #2619](https://github.com/azure/communication-ui-library/pull/2619) by edwardlee@microsoft.com)
  - Change aspect ratio for local video tile to capture full camera view ([PR #2595](https://github.com/azure/communication-ui-library/pull/2595) by edwardlee@microsoft.com)
  - Memoize local participant in video gallery selector ([PR #2559](https://github.com/azure/communication-ui-library/pull/2559) by 2684369+JamesBurnside@users.noreply.github.com)
  - Move cursor to the end of input when clicking on dialpad text field ([PR #2576](https://github.com/azure/communication-ui-library/pull/2576) by carolinecao@microsoft.com)
  - Fixing an issue if hitting back in the browser when pulling in new messages ([PR #2550](https://github.com/azure/communication-ui-library/pull/2550) by 79329532+alkwa-msft@users.noreply.github.com)
  - Bugfix microphone tooltip opening on initial mount ([PR #2587](https://github.com/azure/communication-ui-library/pull/2587) by edwardlee@microsoft.com)
  - Fix component styles to bring components back in line with designs after fluent updates. ([PR #2527](https://github.com/azure/communication-ui-library/pull/2527) by 94866715+dmceachernmsft@users.noreply.github.com)
- `@internal/calling-component-bindings`
  - Filter out devices with blank names ([PR #2366](https://github.com/azure/communication-ui-library/pull/2366) by miguelgamis@microsoft.com)
  - Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
- `@internal/calling-stateful-client`
  - Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Filter out camera devices with blank name when declarative device manager is used. ([PR #2456](https://github.com/azure/communication-ui-library/pull/2456) by anjulgarg@live.com)
  - Remove DeclarativeCallAgent from stable API ([PR #2436](https://github.com/azure/communication-ui-library/pull/2436) by 82062616+prprabhu-ms@users.noreply.github.com)
- `@internal/chat-component-bindings`
  - Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
- `@internal/chat-stateful-client`
  - Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Fix issue where typingIndicator errors were not being caught by the ChatAdapter. ([PR #2471](https://github.com/azure/communication-ui-library/pull/2471) by 94866715+dmceachernmsft@users.noreply.github.com)
- `@internal/fake-backends`
  - Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
- `@internal/react-components`
  - setting icon definition to undefined if icon is already defined by fluent ([PR #2506](https://github.com/azure/communication-ui-library/pull/2506) by carolinecao@microsoft.com)
  - Refresh string translations ([PR #2443](https://github.com/azure/communication-ui-library/pull/2443) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Bump dependencies to get closer to react 18 support ([PR #2427](https://github.com/azure/communication-ui-library/pull/2427) by 2684369+JamesBurnside@users.noreply.github.com)


## [1.4.1](https://github.com/azure/communication-ui-library/tree/1.4.1)

Wed, 30 Nov 2022 17:40:55 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.4.0...1.4.1)

This is a patch release for issue where the local video tile was not showing the users local stream despite the camera being on [more details](https://github.com/Azure/communication-ui-library/pull/2558):

- Fix: Local video not showing to local user but still broadcasts to others in the call. ([PR #2558](https://github.com/Azure/communication-ui-library/pull/2558) by 2684369+JamesBurnside@users.noreply.github.com).

## [1.4.0](https://github.com/azure/communication-ui-library/tree/1.4.0)

Fri, 21 Oct 2022 23:01:52 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.3.1...1.4.0)

This stable release contains a slew of bug fixes, some of them for bugs filed by our users in our GitHub repository. Thanks!
The release also contains some small API additions to support these fixes.

### Minor changes

- `@internal/react-composites`
  - Add callEndReason to the onCallEnded event and fix the event to trigger before the composite page transition. ([PR #2201](https://github.com/azure/communication-ui-library/pull/2201) by 2684369+JamesBurnside@users.noreply.github.com)
  - BugFix: Add missing foreveryone logic for leaveCall ([PR #2399](https://github.com/azure/communication-ui-library/pull/2399) by carolinecao@microsoft.com)
  - Introduce a typename `ParticipantState`. Permissible values unchanged. ([PR #2161](https://github.com/Azure/communication-ui-library/pull/2161))
- `@internal/react-components`
  - Remove onFocus callback that focuses directly on content in Chat Message. Added string for aria label of local user's message content.  ([PR #2153](https://github.com/azure/communication-ui-library/pull/2153) by miguelgamis@microsoft.com)

### Patches

- `@internal/react-composites`
  - Fixes issue where you can start a call if you unplug it on the configuration screen. ([PR #2061](https://github.com/azure/communication-ui-library/pull/2061) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix adapter logic to join Teams meeting. ([PR #2253](https://github.com/azure/communication-ui-library/pull/2253) by miguelgamis@microsoft.com)
  - Fix custom menu items being triggered as a flyout and as a drawer menu item on mobile. Fix custom menu items not triggering on callwithchat composite at all. ([PR #2239](https://github.com/azure/communication-ui-library/pull/2239) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix React hook order console errors for LocalDeviceSettings. ([PR #2198](https://github.com/azure/communication-ui-library/pull/2198) by miguelgamis@microsoft.com)
  - Message thread background color in composites matches composite background color ([PR #2126](https://github.com/azure/communication-ui-library/pull/2126) by anjulgarg@live.com)
  - Fixed bug where drawer on mobile does not get dismissed after making a selection ([PR #2115](https://github.com/azure/communication-ui-library/pull/2115) by carolinecao@microsoft.com)
  - Fix running render passes on people pane on every render ([PR #2240](https://github.com/azure/communication-ui-library/pull/2240) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix Calling Composite's control bar buttons incorrectly showing as disabled when the control bar button is set to `true` in the control bar options ([PR #2325](https://github.com/azure/communication-ui-library/pull/2325) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix local device settings dropdowns to be disabled until device permissions are granted ([PR #2351](https://github.com/azure/communication-ui-library/pull/2351) by miguelgamis@microsoft.com)
  - Autofocus on back button when initially opening People and Chat pane ([PR #2045](https://github.com/azure/communication-ui-library/pull/2045) by edwardlee@microsoft.com)
  - Update documentation for onFetchAvatarPersonaData property on BaseComposite to drive clarity to what it does and does not do. ([PR #2027](https://github.com/azure/communication-ui-library/pull/2027) by 94866715+dmceachernmsft@users.noreply.github.com)
  - fix: joinCall set correct mute state based on microphoneOn parameter ([PR #2131](https://github.com/azure/communication-ui-library/pull/2131) by fanjin1989@gmail.com)
  - Fix call adapter joinCall logic bug. ([PR #2199](https://github.com/azure/communication-ui-library/pull/2199) by miguelgamis@microsoft.com)
  - Composites now using theme.semanticColors.bodyBackground as background color ([PR #2117](https://github.com/azure/communication-ui-library/pull/2117) by anjulgarg@live.com)
  - Add Announcer to copy invite link button to announce action on button. ([PR #2289](https://github.com/azure/communication-ui-library/pull/2289) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Bugfix: Actually show provided participant menu items in CallComposite ([PR #2154](https://github.com/azure/communication-ui-library/pull/2154) by prprabhu@microsoft.com)
  - Introduces animations to is speaking when muted indicator ([PR #2312](https://github.com/azure/communication-ui-library/pull/2312) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix scrollbar showing incorrectly in landscape mobile view due to absolutely positioned participant pane in Chat Composite ([PR #2038](https://github.com/azure/communication-ui-library/pull/2038) by anjulgarg@live.com)
  - Fix Participants and ScreenShare buttons being disabled when unrelated options are passed into the call composite ([PR #2181](https://github.com/azure/communication-ui-library/pull/2181) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add permissions for Camera and Microphone in devices options ([PR #2402](https://github.com/azure/communication-ui-library/pull/2402) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fix CallWithChat control bar disappearing while the call is in the disconnecting state ([PR #2392](https://github.com/azure/communication-ui-library/pull/2392) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix logic to show label of MoreButton in ControlBar ([PR #2388](https://github.com/azure/communication-ui-library/pull/2388) by miguelgamis@microsoft.com)
  - Bump @fluentui/react dependency to 8.98.3 ([PR #2415](https://github.com/azure/communication-ui-library/pull/2415) by 2684369+JamesBurnside@users.noreply.github.com)
  - bugfix: Avoid blank screen on mobile  when call ends with a side pane open ([PR #2407](https://github.com/azure/communication-ui-library/pull/2407) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Remove end call reason from adapter.onCallEnded ([PR #2371](https://github.com/azure/communication-ui-library/pull/2371) by 2684369+JamesBurnside@users.noreply.github.com)
- `@internal/react-components`
  - Fixed flaky file sharing tests for upload cards by awaiting file type icons ([PR #2023](https://github.com/azure/communication-ui-library/pull/2023) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Chat message bubble shows border in high contrast modes making each message distinguishable. ([PR #2106](https://github.com/azure/communication-ui-library/pull/2106) by anjulgarg@live.com)
  - Fix for file card navigation issue when multiple files are uploaded ([PR #2165](https://github.com/azure/communication-ui-library/pull/2165) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fixed bug where voice over does not annouce menu item selected in both calling and callwithchat ([PR #2060](https://github.com/azure/communication-ui-library/pull/2060) by carolinecao@microsoft.com)
  - Memoize ParticipantList callback functions ([PR #2240](https://github.com/azure/communication-ui-library/pull/2240) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add CSS to show/hide menu button on hover/focus  ([PR #2319](https://github.com/azure/communication-ui-library/pull/2319) by carolinecao@microsoft.com)
  - Load new messages only when scroll bar is at the top ([PR #2355](https://github.com/azure/communication-ui-library/pull/2355) by edwardlee@microsoft.com)
  - Fix React hook order console errors for CameraButton. ([PR #2198](https://github.com/azure/communication-ui-library/pull/2198) by miguelgamis@microsoft.com)
  - Hotfix: infinite spinner for screenShare in stable ([PR #2191](https://github.com/azure/communication-ui-library/pull/2191) by jinan@microsoft.com)
  - changed z-index so new message button shows ontop of chat bubble ([PR #2046](https://github.com/azure/communication-ui-library/pull/2046) by carolinecao@microsoft.com)
  - Fix invalid scrollbars when gif images are shared in chat ([PR #2037](https://github.com/azure/communication-ui-library/pull/2037) by anjulgarg@live.com)
  - Make participant items tab navigable ([PR #2045](https://github.com/azure/communication-ui-library/pull/2045) by edwardlee@microsoft.com)
  - Fix bug of dismissed menu when scrolling ([PR #2069](https://github.com/azure/communication-ui-library/pull/2069) by jinan@microsoft.com)
  - Control Bar uses theme.semanticColors.bodyBackground instead of theme.palette.white ([PR #2117](https://github.com/azure/communication-ui-library/pull/2117) by anjulgarg@live.com)
  - Updated tooltip strings to not be title case ([PR #2350](https://github.com/azure/communication-ui-library/pull/2350) by miguelgamis@microsoft.com)
  - Fix voiceover tab navigation of messages including system messages. Hide message action flyout when focus blurs. ([PR #2042](https://github.com/azure/communication-ui-library/pull/2042) by miguelgamis@microsoft.com)
  - Replace floating div with border with inset border of video tile to show user is speaking. ([PR #2236](https://github.com/azure/communication-ui-library/pull/2236) by miguelgamis@microsoft.com)
  - correctly setting maxHeight for people context menu ([PR #2034](https://github.com/azure/communication-ui-library/pull/2034) by 79329532+alkwa-msft@users.noreply.github.com)
  - Export Announcer component to be used internally. ([PR #2289](https://github.com/azure/communication-ui-library/pull/2289) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Bump @fluentui/react dependency to 8.98.3 ([PR #2415](https://github.com/azure/communication-ui-library/pull/2415) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix VideoGallery showing video spinners when the CallComposites are disconnecting from a call.  ([PR #2392](https://github.com/azure/communication-ui-library/pull/2392) by 2684369+JamesBurnside@users.noreply.github.com)
- `@internal/calling-component-bindings`
  - Fix screenshare button selector to disable button when call is InLobby or Connecting state. ([PR #2059](https://github.com/azure/communication-ui-library/pull/2059) by 94866715+dmceachernmsft@users.noreply.github.com)
  - BugFix: Fix local camera getting into a bad state when the camera takes longer to turn on than the call took to connect ([PR #2412](https://github.com/azure/communication-ui-library/pull/2412) by 2684369+JamesBurnside@users.noreply.github.com)
  - BugFix: Add missing foreveryone logic for leaveCall ([PR #2399](https://github.com/azure/communication-ui-library/pull/2399) by carolinecao@microsoft.com)
- `@internal/calling-stateful-client`
  - Add event logs for disposing local video streams ([PR #2121](https://github.com/azure/communication-ui-library/pull/2121) by 2684369+JamesBurnside@users.noreply.github.com)
- `@internal/chat-component-bindings`
  - Show datetime when there are more than 5 mins between each message ([PR #2299](https://github.com/azure/communication-ui-library/pull/2299) by carolinecao@microsoft.com)

## [1.3.1](https://github.com/azure/communication-ui-library/tree/1.3.1)

This is a patch release for issue [#2186](https://github.com/Azure/communication-ui-library/issues/2186):
- Fix infinite spinner bug during screenshare. ([PR #2191](https://github.com/Azure/communication-ui-library/pull/2191) by jiangnanhello@live.com).

## [1.3.0](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.3.0)

This stable release is mostly minor changes and bug fixes and quality of life improvements, there are no major feature introductions.

A lot of bug fixes in this stable release are related to accessibility. Fixes include improved narration from screen readers in CallWithChat composite as well as improved keyboard navigation.

Also included are updates to the video streams with new features like a loading spinner in the remote stream when the remote participants connection is loading. Available in the components now and coming soon to the composites.

Mon, 13 Jun 2022 18:29:25 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.2.2-beta.1...@azure/communication-react_v1.3.0)

### Minor changes
  - Video Gallery supports a loading spinner to indicate a video stream is incoming but has not yet loaded. This feature will be enabled in the Composites soon. ([PR #1954](https://github.com/azure/communication-ui-library/pull/1954) by chwhilar@microsoft.com)
  - Support updateScalingMode in the VideoGallery to avoid having to destroy and recreate the stream when the localVideoViewOption scaling mode is changed ([PR #1890](https://github.com/azure/communication-ui-library/pull/1890) by 2684369+JamesBurnside@users.noreply.github.com)
  - Announce when microphone is turned on/off and video is turned on/off to screen readers and narrator tools ([PR #1772](https://github.com/azure/communication-ui-library/pull/1772) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches
  - Fix support for onDisposeLocalStreamView in `VideoGallery` ([PR #1866](https://github.com/azure/communication-ui-library/pull/1866) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fixed theming of links for html and richtext/html messages in MessageThread. ([PR #1824](https://github.com/azure/communication-ui-library/pull/1824) by miguelgamis@microsoft.com)
  - Added error text color in light and dark themes in semanticColors property. ([PR #1861](https://github.com/azure/communication-ui-library/pull/1861) by 79475487+mgamis-msft@users.noreply.github.com)
  - Change Microphone Contextual Menu header text to Audio Device when no speakers are detected ([PR #1883](https://github.com/azure/communication-ui-library/pull/1883) by edwardlee@microsoft.com)
  - when there is no menu items, participant item should not be clickable ([PR #1844](https://github.com/azure/communication-ui-library/pull/1844) by carolinecao@microsoft.com)
  - Fix inverted host element when local video plays in picture-in-picture window ([PR #1933](https://github.com/azure/communication-ui-library/pull/1933) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Add split button aria labels to the microphone and camera buttons. Remove the aria-role of menu from the split buttons. ([PR #1829](https://github.com/azure/communication-ui-library/pull/1829) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fixed chat status not annoucing on voice over on iphone bug ([PR #1939](https://github.com/azure/communication-ui-library/pull/1939) by 96077406+carocao-msft@users.noreply.github.com)
  - Delay consecutive messages in _ComplianceBanner to give user time to read the message ([PR #1878](https://github.com/azure/communication-ui-library/pull/1878) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Disable hover behavior when no content in sendBox ([PR #1534](https://github.com/azure/communication-ui-library/pull/1534) by jiangnanhello@live.com)
  - add placeholder participant name for unnamed participants ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by carolinecao@microsoft.com)
  - Code refactor: Update remote video tile to use the useVideoStreamLifecycleMaintainer ([PR #1906](https://github.com/azure/communication-ui-library/pull/1906) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix local preview in the VideoGallery not re-rendering when localVideoViewOptions property changed ([PR #1841](https://github.com/azure/communication-ui-library/pull/1841) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix tab ordering of the New Messages button in the Chat Composite ([PR #1961](https://github.com/azure/communication-ui-library/pull/1961) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add a default host layer in base provider 1. make our lib compatible with react-full-screen 2. avoid polluting global dom tree ([PR #1950](https://github.com/azure/communication-ui-library/pull/1950) by jinan@microsoft.com)
  - Refactor: Ensure the LocalAndRemotePiP reuses the same LocalVideoTile and RemoteVideoTile the VideoGallery component uses ([PR #1930](https://github.com/azure/communication-ui-library/pull/1930) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix param value in callId change event ([PR #1819](https://github.com/azure/communication-ui-library/pull/1819) by jiangnanhello@live.com)
  - Fixed font of LocalPreview label that indicates camera is off. ([PR #1827](https://github.com/azure/communication-ui-library/pull/1827) by 79475487+mgamis-msft@users.noreply.github.com)
  - Fix a memoization in Call-based composites to prevent onRenderAvatar triggering unecessary re-renders ([PR #1935](https://github.com/azure/communication-ui-library/pull/1935) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update createStreamView to return the created stream view result ([PR #1891](https://github.com/azure/communication-ui-library/pull/1891) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fixed contextual menus in CallWithChatComposite and CallComposite to be responsive to window resize. ([PR #1800](https://github.com/azure/communication-ui-library/pull/1800) by miguelgamis@microsoft.com)
  - Ensure referential ID of callwithchatcomposite is unique among call with chat instances ([PR #1869](https://github.com/azure/communication-ui-library/pull/1869) by 2684369+JamesBurnside@users.noreply.github.com)
  - Introduce tests to support new custom data model behaviors. ([PR #1836](https://github.com/azure/communication-ui-library/pull/1836) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Introduce the usage of the adapters error handling to the fetchInitialData function. ([PR #1845](https://github.com/azure/communication-ui-library/pull/1845) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix whole app re-render when callId changes ([PR #1820](https://github.com/azure/communication-ui-library/pull/1820) by jiangnanhello@live.com)
  - Fix the display name of the remote participants when they provide onFetchAvatarPersonaData prop. ([PR #1822](https://github.com/azure/communication-ui-library/pull/1822) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Change Microphone Contextual Menu header text to Audio Device when no speakers are detected ([PR #1883](https://github.com/azure/communication-ui-library/pull/1883) by edwardlee@microsoft.com)
  - Remove spurius console log ([PR #1451](https://github.com/azure/communication-ui-library/pull/1451) by 82062616+prprabhu-ms@users.noreply.github.com)
  - update storybook to v6.5.7 ([PR #1972](https://github.com/azure/communication-ui-library/pull/1972) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix video freeze in LocalPreview story ([PR #1949](https://github.com/azure/communication-ui-library/pull/1949) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Resolve icon centering on SendBox storybook examples ([PR #1833](https://github.com/azure/communication-ui-library/pull/1833) by edwardlee@microsoft.com)
  - patched error on storybook participant item not showing name ([PR #1844](https://github.com/azure/communication-ui-library/pull/1844) by carolinecao@microsoft.com)
  - Add Best Practices documentation to Storybook ([PR #1970](https://github.com/azure/communication-ui-library/pull/1970) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add default replacer to do safe stringify ([PR #1921](https://github.com/azure/communication-ui-library/pull/1921) by jinan@microsoft.com)
  - Update VideoGallery bindings to return the created view when starting a local video stream ([PR #1891](https://github.com/azure/communication-ui-library/pull/1891) by 2684369+JamesBurnside@users.noreply.github.com)
  - When participant doesnt have a name, set the name to unnamed participant ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by carolinecao@microsoft.com)
  - Fix Calling handler to correctly dispose a local view when view is attached to a call ([PR #1867](https://github.com/azure/communication-ui-library/pull/1867) by 2684369+JamesBurnside@users.noreply.github.com)
  - Support calling `updateScalingMode` in the Video Gallery with remote video streams instead of recreating the stream when the scaling mode changes ([PR #1907](https://github.com/azure/communication-ui-library/pull/1907) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fixed onCreateLocalStreamView handler default videostream options to be cropped and mirrored. ([PR #1909](https://github.com/azure/communication-ui-library/pull/1909) by miguelgamis@microsoft.com)
  - Return the renderer and view created when statefulCallClient.createView is called ([PR #1889](https://github.com/azure/communication-ui-library/pull/1889) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add callIdHistory to context + internal context - Update all visit to callId using latestCallId - Encapsule the access to internalMap directly to ensure no leaks ([PR #1817](https://github.com/azure/communication-ui-library/pull/1817) by jiangnanhello@live.com)
  - Update the right call.id into state ([PR #1818](https://github.com/azure/communication-ui-library/pull/1818) by jiangnanhello@live.com)
  - Remove dependency on azure/communication-signalling, instead use types from azure/communication-chat ([PR #1895](https://github.com/azure/communication-ui-library/pull/1895) by 2684369+JamesBurnside@users.noreply.github.com)
  - Only emit stateChanged events where there is an actual change ([PR #1449](https://github.com/azure/communication-ui-library/pull/1449) by 82062616+prprabhu-ms@users.noreply.github.com)



## [1.2.0](https://github.com/azure/communication-ui-library/tree/1.2.0)

[Changes since 1.1.0](https://github.com/azure/communication-ui-library/compare/1.1.0...1.2.0)

This stable release introduces `CallWithChatComposite`, a new out of the box experience that combines calling and chat capabilities.
The new composite provides customization API similar to `CallComposite` and `ChatComposite`. You can add custom themes, provide custom avatars and intercept communication with the Azure Communication Services using APIs you are already familiar with from he earlier composites. In addition, `CallWithChatComposite` has a mobile-optimized UX you can enable with the `mobileView` flag.

In addition to the new composite, this stable release includes various style and accessibility improvements to existing UI components. A changelog since the last public beta follows:

[Changes since 1.1.1-beta.1](https://github.com/azure/communication-ui-library/compare/1.1.0...1.1.1-beta.1)

### Minor changes

- Added ParticipantList prop onParticipantClick and ParticipantItem prop onClick. ([PR #1515](https://github.com/azure/communication-ui-library/pull/1515) by miguelgamis@microsoft.com)
- Introduce useAzureCommunicationCallAdapter hook ([PR #1618](https://github.com/azure/communication-ui-library/pull/1618) by 82062616+prprabhu-ms@users.noreply.github.com)

- Increase the border radius of buttons in composites with call features ([PR #1609](https://github.com/azure/communication-ui-library/pull/1609) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patch changes

- Bump @azure/communication-calling to 1.4.4 ([PR #1610](https://github.com/azure/communication-ui-library/pull/1610) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix ChatMessageActionFlyout useMemo to include exhaustive dependencies to prevent missed re-renders on prop updates ([PR #1597](https://github.com/azure/communication-ui-library/pull/1597) by 2684369+JamesBurnside@users.noreply.github.com)
- Update ControlBarButton to read aria strings from other string sources ([PR #1614](https://github.com/azure/communication-ui-library/pull/1614) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix ChatMessage border color when editing a message to show inactive colors when not active ([PR #1583](https://github.com/azure/communication-ui-library/pull/1583) by 2684369+JamesBurnside@users.noreply.github.com)
- Prevent chat message flyout randomly closing itself by setting preventDismissOnResize property on the chat message flyout ([PR #1573](https://github.com/azure/communication-ui-library/pull/1573) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix SendBox position shift when border size changes. Update sendbox coloring to use theme.primary instead of theme.blue ([PR #1584](https://github.com/azure/communication-ui-library/pull/1584) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix: do not allow sending empty messages when editing chat messages ([PR #1575](https://github.com/azure/communication-ui-library/pull/1575) by 2684369+JamesBurnside@users.noreply.github.com)
- Sidepane copy invite link and cancel button UI style fix ([PR #1581](https://github.com/azure/communication-ui-library/pull/1581) by edwardlee@microsoft.com)
- Fix react useEffect dependencies in composites ([PR #1600](https://github.com/azure/communication-ui-library/pull/1600) by 2684369+JamesBurnside@users.noreply.github.com)
- Add soft vertical height support for unsupported mobile landscape orientation in Calling-based Composites ([PR #1572](https://github.com/azure/communication-ui-library/pull/1572) by 2684369+JamesBurnside@users.noreply.github.com)
- bugfix: Dispose adapter in hook when component unmounts ([PR #1619](https://github.com/azure/communication-ui-library/pull/1619) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix chat unread messages badge border to always be white ([PR #1608](https://github.com/azure/communication-ui-library/pull/1608) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix call control bar wrapping to a new line at high zoom levels and narrow screen heights ([PR #1571](https://github.com/azure/communication-ui-library/pull/1571) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.1.0](https://github.com/azure/communication-ui-library/tree/1.1.0)

[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0...1.1.0)

With this minor release, @azure/communication-react's Azure Communication Service core SDKs have been moved to [peerDependencies](https://nodejs.org/en/blog/npm/peer-dependencies/).
This change gives you a more consistent way to use the core SDKs in your application.

After upgrading to 1.1.0, you will need to install these core SDKs in your application:

```bash
npm i @azure/communication-calling@1.3.2
npm i @azure/communication-chat@1.1.0
```

This minor release also contains general bug fixes and performance improvements.

## Changes since 1.0.0
[Compare changes](https://github.com/Azure/communication-ui-library/compare/1.0.0...1.1.0)


### Changes
  - Upgrade @azure/communication-signaling to 1.0.0.beta.12 ([PR #1352](https://github.com/azure/communication-ui-library/pull/1352) by anjulgarg@live.com)
  - Moved Avatars icons to the left of messages by not displaying usernames in Storybook MessageThread ([PR #1345](https://github.com/azure/communication-ui-library/pull/1345) by edwardlee@microsoft.com)
  - Allows setting min and max size of the persona avatar in the Video Tile ([PR #1406](https://github.com/azure/communication-ui-library/pull/1406) by 2684369+JamesBurnside@users.noreply.github.com)

### Bug Fixes
  - Fix CallComposite being stuck on the configuration page when using adapter.startCall ([PR #1403](https://github.com/azure/communication-ui-library/pull/1403) by 2684369+JamesBurnside@users.noreply.github.com)

## [v1.0.0 - Release](https://github.com/azure/communication-ui-library/tree/1.0.0)

Mon, 06 Dec 2021 19:41:54 GMT

We have heard from developers that building UI is a challenge. The Azure Communication Services UI Library is here to help. It offers modern calling/chat UI features which integrate seamlessly into your application. We designed this library with attention to customizability, localization, and a11y features so that you can create immersive and inclusive experiences your users love. ❤

### Composites

Composites are a low code, end-to-end solution to power your call and chat scenarios with Azure Communication Services. We designed them as an out-of-the box solution to be dropped into your application with the ability to integrate seamlessly with theming, styling and custom application logic.

In the future, we will continue to evolve the composites with the latest Azure Communication Services features so you can integrate them into your application with minimal effort.

Features:
- 🎁 Embed composites into your web applications with a few lines of code
- 🌈 Theme using [FluentUI style theming](https://fluentuipr.z22.web.core.windows.net/heads/master/theming-designer/index.html)
- 🎧 Listen to communication events (e.g when the call has ended)
- 💥 Take action on behalf of the user

### UI Components

We have also added a development experience for developers that want more control over the end-user experience. By exposing our UI components and underlying state management architecture, we seek to empower developers who want granular control over how the UI components build up into the overall communication experience. Compared to composites, the UI components offer increased flexibility at the cost of additional development effort.

Along with the choice to build an open-source library, the UI components allow us to share the tools we use to make great products with you. We hope you will be excited by the level of granularity, use it in your own applications, and consider contributing back.

Features:
- ✏️ Create calling and chat clients using ReactJS
- 🎨 Style UI components using [FluentUI styling patterns](https://github.com/microsoft/fluentui/wiki/Component-Styling)
- 🏠 Layout your calling and chat components
- 🎛️ Integrate your own custom logic

### Storybook

📕 Check out our documentation in [storybook](https://azure.github.io/communication-ui-library/) to learn more about the UI Library.
🚀 Try out our composites and UI components today in the "Preview" tab in Storybook.

## Changes since 1.0.0-beta.8

[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.8...1.0.0)

### Changes

  - Remove beta-only features for 1.0.0 release ([PR #1114](https://github.com/azure/communication-ui-library/pull/1114) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Immediately fetch initial chat data when creating azure communication chat adapter ([PR #1168](https://github.com/azure/communication-ui-library/pull/1168) by 2684369+JamesBurnside@users.noreply.github.com)
  - Disable microphone toggle in Teams lobby as it's not supported by headless SDK ([PR #1139](https://github.com/azure/communication-ui-library/pull/1139) by anjulgarg@live.com)
  - Add localized tooltip to microphone button in lobby informing users that it is disabled. ([PR #1148](https://github.com/azure/communication-ui-library/pull/1148) by anjulgarg@live.com)
  - Update localized resource files. ([PR #1197](https://github.com/azure/communication-ui-library/pull/1197) by miguelgamis@microsoft.com)
  - Storybook doc improvements.
  - Reduce VideoGallery persona size ([PR #1129](https://github.com/azure/communication-ui-library/pull/1129) by 2684369+JamesBurnside@users.noreply.github.com)
  - No longer make Local video tile draggable when horizontal gallery is showing ([PR #1163](https://github.com/azure/communication-ui-library/pull/1163) by miguelgamis@microsoft.com)
  - Remove long press gesture on MessageThread messages ([PR #1118](https://github.com/azure/communication-ui-library/pull/1118) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add tooltip string for disabled ControlBar buttons ([PR #1166](https://github.com/azure/communication-ui-library/pull/1166) by alcail@microsoft.com)
  - Add Scrollbar when editing message in chat ([PR #1158](https://github.com/azure/communication-ui-library/pull/1158) by anjulgarg@live.com)
  - No longer render richtext/media messages until future support is added ([PR #1149](https://github.com/azure/communication-ui-library/pull/1149) by 79329532+alkwa-msft@users.noreply.github.com)
  - GridLayoutProp styles prop type changed to GridLayoutStyles ([PR #1196](https://github.com/azure/communication-ui-library/pull/1196) by miguelgamis@microsoft.com)
  - Sort to participants by name in participantListSelector ([PR #1106](https://github.com/azure/communication-ui-library/pull/1106) by anjulgarg@live.com)
  - Hide users in a Teams lobby from the acs clients ([PR #1112](https://github.com/azure/communication-ui-library/pull/1112) by 79329532+alkwa-msft@users.noreply.github.com)

### Bug Fixes
  - Fix typing indicator going outside of the max width of sendbox ([PR #1191](https://github.com/azure/communication-ui-library/pull/1191) by anjulgarg@live.com)
  - Fix typo in complianceBannerTranscriptionStarted ([PR #1210](https://github.com/azure/communication-ui-library/pull/1210) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Fix ComplianceBanner auto-dismiss ([PR #1117](https://github.com/azure/communication-ui-library/pull/1117) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Fix option naming to options ([PR #1173](https://github.com/azure/communication-ui-library/pull/1173) by jinan@microsoft.com)
  - Fix partially clipped text in `ParticipantItem` ([PR #1145](https://github.com/azure/communication-ui-library/pull/1145) by anjulgarg@live.com)
  - Fix VideoGallery to have a unique identifier for local video tile to dock. ([PR #1111](https://github.com/azure/communication-ui-library/pull/1111) by miguelgamis@microsoft.com)
  - Fix 'New Messages' not clearing when the user scrolls to the bottom of the message thread' ([PR #1115](https://github.com/azure/communication-ui-library/pull/1115) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix stop screen sharing label from stop to stop sharing ([PR #1164](https://github.com/azure/communication-ui-library/pull/1164) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix message thread not loading all messages by setting pagesize to 50 ([PR #1183](https://github.com/azure/communication-ui-library/pull/1183) by jinan@microsoft.com)
  - Fix unwanted dismissal of ParticipantsButtton and DevicesButton Callout on resize events ([PR #1138](https://github.com/azure/communication-ui-library/pull/1138) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Fix Screenshare being rerender on page change. ([PR #1175](https://github.com/azure/communication-ui-library/pull/1175) by miguelgamis@microsoft.com)
  - Fix gap betwen GridLayout and HorizontalGallery for Safari on IPhone SE. ([PR #1162](https://github.com/azure/communication-ui-library/pull/1162) by miguelgamis@microsoft.com)
  - Fix typing indicator wrapping correctly for long names ([PR #1123](https://github.com/azure/communication-ui-library/pull/1123) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix text in system messages in the MessageThread to wrap when it is too long. ([PR #1120](https://github.com/azure/communication-ui-library/pull/1120) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix screenshare button background when active ([PR #1178](https://github.com/azure/communication-ui-library/pull/1178) by 2684369+JamesBurnside@users.noreply.github.com)
  - Remove console log when rendering video ([PR #1188](https://github.com/azure/communication-ui-library/pull/1188) by 82062616+prprabhu-ms@users.noreply.github.com)
