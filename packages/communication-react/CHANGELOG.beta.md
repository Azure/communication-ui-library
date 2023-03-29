# Change Log - @azure/communication-react

This log was last generated on Tue, 28 Mar 2023 16:00:31 GMT and should not be manually modified.

<!-- Start content -->

## [1.5.1-beta.2](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.5.1-beta.2)

Tue, 28 Mar 2023 16:00:31 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.5.1-beta.1...@azure/communication-react_v1.5.1-beta.2)

### Vertical Gallery - Public Preview
We are now introducing a new overflow gallery for remote particants VideoGallery component as well as other improvements!

This feature includes:
- Ability to control overflow gallery to be positioned to vertically on the right by assigning the overflowGalleryPostion property to 'VerticalRight' to better utilize the vertical space in your calling experience. The overflow gallery will still be position horizontally at the bottom by default
- VideoGallery in the Call composite and CallWithChat composite are responsive to switch to the vertical gallery at aspect ratios greater than or equal to 16:9
- Improvements to space utilized by the video tiles of the horizonal overflow gallery
- Enhancements to dominant speaker ordering and video tile rendering of remote participants in the overflow gallery

### Features

- `@azure/communication-react`
  - Update @fluentui/react-icons to 2.0.194 ([PR #2749](https://github.com/azure/communication-ui-library/pull/2749) by 2684369+JamesBurnside@users.noreply.github.com)
  - Added overflowGalleryLayout prop to VideoGallery to control component for overflow participants ([PR #2774](https://github.com/azure/communication-ui-library/pull/2774) by 79475487+mgamis-msft@users.noreply.github.com)
  - Allow horizontal gallery tiles to resize to allow for better use of space. ([PR #2830](https://github.com/azure/communication-ui-library/pull/2830) by 94866715+dmceachernmsft@users.noreply.github.com)
  - VideoGallery in call composite will use a vertical overflow gallery when its aspect ratio is 16:9 or greater. ([PR #2786](https://github.com/azure/communication-ui-library/pull/2786) by 79475487+mgamis-msft@users.noreply.github.com)
  - Update overflow gallery logic to allow more video participants to render video streams if available on different pages. ([PR #2818](https://github.com/azure/communication-ui-library/pull/2818) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Create styles for verticalGallery controls and position. ([PR #2781](https://github.com/azure/communication-ui-library/pull/2781) by 94866715+dmceachernmsft@users.noreply.github.com)

### Bug fixes

- `@azure/communication-react`
  - disable the selectivity of a text in video gallery for long touch to function properly ([PR #2790](https://github.com/azure/communication-ui-library/pull/2790) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Update storybook custom data model calling example to wrap userId as an identifier ([PR #2799](https://github.com/azure/communication-ui-library/pull/2799) by edwardlee@microsoft.com)
  - Thematically change hold icon color ([PR #2706](https://github.com/azure/communication-ui-library/pull/2706) by edwardlee@microsoft.com)
  - Add error string for when your remote video feed is frozen for others in the call. ([PR #2808](https://github.com/azure/communication-ui-library/pull/2808) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update Aria labels for people button to allow for voice access controls on windows. ([PR #2833](https://github.com/azure/communication-ui-library/pull/2833) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update communication-chat version from fixed version to compatible with version ([PR #2727](https://github.com/azure/communication-ui-library/pull/2727) by edwardlee@microsoft.com)
  - Switch video seamlessly from different devices ([PR #2726](https://github.com/azure/communication-ui-library/pull/2726) by jinan@microsoft.com)
  - Fix VideoTile to show menu button on hover when isSpeaking prop is true ([PR #2721](https://github.com/azure/communication-ui-library/pull/2721) by 79475487+mgamis-msft@users.noreply.github.com)
  - Fix sending/delivered/failed message status not showing in large group ([PR #2707](https://github.com/azure/communication-ui-library/pull/2707) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
  - Announce by Screen Reader after leaving chat ([PR #2681](https://github.com/azure/communication-ui-library/pull/2681) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
  - Added empty icon render for tab navigation of video tile ([PR #2693](https://github.com/azure/communication-ui-library/pull/2693) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Split buttons now hold primary action for toggling camera and mic on touch devices. ([PR #2773](https://github.com/azure/communication-ui-library/pull/2773) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix CallAdapter participants joined and left events to show correct participants in event array. ([PR #2837](https://github.com/azure/communication-ui-library/pull/2837) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Correct MessageThread API definition ([PR #2812](https://github.com/azure/communication-ui-library/pull/2812) by 3941071+emlynmac@users.noreply.github.com)
  - Fix dominant speaker ordering to best keep dominant speakers on the first page of overflow gallery. ([PR #2819](https://github.com/azure/communication-ui-library/pull/2819) by miguelgamis@microsoft.com)
  - make sure message status in storybook is defined to avoid 'try send again' showing up ([PR #2732](https://github.com/azure/communication-ui-library/pull/2732) by carolinecao@microsoft.com)
  - Internal RemoteVideoTile should not default to having contextual menu options. ([PR #2653](https://github.com/azure/communication-ui-library/pull/2653) by 79475487+mgamis-msft@users.noreply.github.com)
  - Fix: Permission Error in Chat after leaving a Teams Interop meeting ([PR #2777](https://github.com/azure/communication-ui-library/pull/2777) by 2684369+JamesBurnside@users.noreply.github.com)
  - Show local video and vertical/horizontal gallery when screensharing with no participants ([PR #2822](https://github.com/azure/communication-ui-library/pull/2822) by carolinecao@microsoft.com)
  - Memoize Teams call adapter args for CTE storybook sample code. ([PR #2835](https://github.com/azure/communication-ui-library/pull/2835) by miguelgamis@microsoft.com)
  - Updates streamUtils to handle multiple Calls from components. ([PR #2713](https://github.com/azure/communication-ui-library/pull/2713) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update stream utils to have general createView function for both remote and local. ([PR #2755](https://github.com/azure/communication-ui-library/pull/2755) by 94866715+dmceachernmsft@users.noreply.github.com)
  - update the Errorbar selector to check environmentInfo for mac specific warnings. ([PR #2691](https://github.com/azure/communication-ui-library/pull/2691) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Move logging from StreamUtils to be managed in seperate file. ([PR #2753](https://github.com/azure/communication-ui-library/pull/2753) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix messages thread loading issue when an adapter is updated ([PR #2784](https://github.com/azure/communication-ui-library/pull/2784) by 98852890+vhuseinova-msft@users.noreply.github.com)
  - Add heading role and aria level for start a call config heading ([PR #2845](https://github.com/azure/communication-ui-library/pull/2845) by edwardlee@microsoft.com)
  - Remove emoji from testing that causes failures when emojis update. ([PR #2759](https://github.com/azure/communication-ui-library/pull/2759) by 94866715+dmceachernmsft@users.noreply.github.com)

### Improvements

- `@azure/communication-react`
  - Add parameter to hint displayName from SDK ([PR #2697](https://github.com/azure/communication-ui-library/pull/2697) by jinan@microsoft.com)
  - Draft API for video background effects ([PR #2836](https://github.com/azure/communication-ui-library/pull/2836) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Update beta version of @azure/communication-calling to 1.11.0-beta.1 ([PR #2763](https://github.com/azure/communication-ui-library/pull/2763) by 2684369+JamesBurnside@users.noreply.github.com)
  - Adapter API changes for start/stop video effects ([PR #2836](https://github.com/azure/communication-ui-library/pull/2836) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Add stateful handlers for background effects ([PR #2793](https://github.com/azure/communication-ui-library/pull/2793) by 2684369+JamesBurnside@users.noreply.github.com)
  - Introduce hermetic tests to verify tile size behavior and gallery behavior when resizing window. ([PR #2798](https://github.com/azure/communication-ui-library/pull/2798) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update PSTN and 1:N callstate logic to not show config screen in composites when starting call. ([PR #2740](https://github.com/azure/communication-ui-library/pull/2740) by 94866715+dmceachernmsft@users.noreply.github.com)
  - In the stateful call client subscribe to video effects changes and populate state when those subscriptions fire' ([PR #2728](https://github.com/azure/communication-ui-library/pull/2728) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add video background effect choice items for upcoming background picker ([PR #2789](https://github.com/azure/communication-ui-library/pull/2789) by 2684369+JamesBurnside@users.noreply.github.com)
  - tee video effects errors to state ([PR #2729](https://github.com/azure/communication-ui-library/pull/2729) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add type definitions to the new StatefulCallClient state fields for the incoming VideoEffectsFeature. This includes just type definitions with implementation to follow. ([PR #2702](https://github.com/azure/communication-ui-library/pull/2702) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix CallWithChat overflow buttons onClick not working, styles not being fully applied and and showLabel: false not hiding the button label. ([PR #2750](https://github.com/azure/communication-ui-library/pull/2750) by 2684369+JamesBurnside@users.noreply.github.com)
  - Expose unparentedLocalVideoStreams in the StatefulDeviceManager ([PR #2731](https://github.com/azure/communication-ui-library/pull/2731) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update displayName code snippet for cte ([PR #2766](https://github.com/azure/communication-ui-library/pull/2766) by jinan@microsoft.com)
  - Add support for overflow button in desktop callwithchat ([PR #2748](https://github.com/azure/communication-ui-library/pull/2748) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add Video background effects picker component ([PR #2792](https://github.com/azure/communication-ui-library/pull/2792) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update vertical gallery styles to be responsive to the container height of the video gallery. ([PR #2803](https://github.com/azure/communication-ui-library/pull/2803) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Introduce responsive wrapper component for VerticalGallery. ([PR #2770](https://github.com/azure/communication-ui-library/pull/2770) by 94866715+dmceachernmsft@users.noreply.github.com)
  - update styles to allow tile vertical resizing ([PR #2785](https://github.com/azure/communication-ui-library/pull/2785) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add announcer labels for nav buttons in vertical gallery and allow for style updates through props. ([PR #2796](https://github.com/azure/communication-ui-library/pull/2796) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Video Effects Button and Pane ([PR #2825](https://github.com/azure/communication-ui-library/pull/2825) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Introduce new base component for VerticalGalleries feature. ([PR #2764](https://github.com/azure/communication-ui-library/pull/2764) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update FileUploadAdapter to include the download of authenticated attachments ([PR #2827](https://github.com/azure/communication-ui-library/pull/2827) by joshlai@microsoft.com)
  - Fix PSTN id parsing and add unit test to validate E.164 format numbers. ([PR #2739](https://github.com/azure/communication-ui-library/pull/2739) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Updates LocalVideo tile to be 9:16 aspect ratio to show whole feed. fixes CallWithChat flashing issue with scrollable gallery. ([PR #2734](https://github.com/azure/communication-ui-library/pull/2734) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Draft API for video background effects ([PR #2836](https://github.com/azure/communication-ui-library/pull/2836) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Add onFetchProfile to adapter ([PR #2680](https://github.com/azure/communication-ui-library/pull/2680) by jiangnanhello@live.com)
  - Set all empty/undefined displayName to unnamed ([PR #2720](https://github.com/azure/communication-ui-library/pull/2720) by jinan@microsoft.com)
  - Add 'Try ChatComposite' page to storybook that uses fake adapters ([PR #2710](https://github.com/azure/communication-ui-library/pull/2710) by 77021369+jimchou-dev@users.noreply.github.com)
  - Fixed richtext css for blockquote and table ([PR #2839](https://github.com/azure/communication-ui-library/pull/2839) by 77021369+jimchou-dev@users.noreply.github.com)
  - Added stream type in stream logs ([PR #2705](https://github.com/azure/communication-ui-library/pull/2705) by carolinecao@microsoft.com)

## [1.5.1-beta.1](https://github.com/azure/communication-ui-library/tree/1.5.1-beta.1)

Wed, 01 Feb 2023 17:56:59 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.5.0...1.5.1-beta.1)

### Communications as Teams User - Public Preview
ACS UI Library now enables developers to create a customized Teams experience leveraging communcation as a Teams user (beta).

This feature includes:
- Joining calls using Teams identity instead of an external user
- Browser support on mobile devices
- Fetch and override display externally for participant 

Read more about [Communication as Teams user](https://learn.microsoft.com/en-us/azure/communication-services/concepts/teams-endpoint) through Azure Communication Services.

### Pinning Participants - Public Preview
The VideoGallery now provides the ability to pin participants on the GridLayout.

This feature includes:
1. Contextual menu for each remote video tile
2. Pinning and unpinning participants
3. Change rendering options for remote video streams between fit-to-frame and fill frame

### Features
- Teams identity support on adapter layer ([PR #2426](https://github.com/azure/communication-ui-library/pull/2426) by jinan@microsoft.com)
- VideoTile provides a prop `onLongTouch` that allows users to trigger a custom callback when VideoTile is long touched ([PR #2556](https://github.com/azure/communication-ui-library/pull/2556) by anjulgarg@live.com)
- Drawer menu for mobile devices to video gallery ([PR #2613](https://github.com/azure/communication-ui-library/pull/2613) [PR #2557](https://github.com/azure/communication-ui-library/pull/2557) by anjulgarg@live.com)
- Disable pin menu button on remote VideoTile of VideoGallery when max pinned remote video tiles is reached ([commit](https://github.com/azure/communication-ui-library/commit/not available) by miguelgamis@microsoft.com)
- ScalingMode to VideoGalleryStream type ([PR #2566](https://github.com/azure/communication-ui-library/pull/2566) by anjulgarg@live.com)
- Fit/Fill options to VideoGallery video tiles ([PR #2574](https://github.com/azure/communication-ui-library/pull/2574) by anjulgarg@live.com)
- VideoGallery announces when participants are pinned and unpinned. Added aria labels for pin and unpin menu item ([PR #2662](https://github.com/azure/communication-ui-library/pull/2662) by 79475487+mgamis-msft@users.noreply.github.com)
- Call readiness on by default ([PR #2603](https://github.com/azure/communication-ui-library/pull/2603) by 2684369+JamesBurnside@users.noreply.github.com)
- Introduce UI: browser version out of date, unsupported OS ([PR #2552](https://github.com/azure/communication-ui-library/pull/2552) [PR #2554](https://github.com/azure/communication-ui-library/pull/2554) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update the different environment info modals so the strings are optional props ([PR #2635](https://github.com/azure/communication-ui-library/pull/2635) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce default strings to modals for different unsupported environment situations ([PR #2628](https://github.com/azure/communication-ui-library/pull/2628) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce unsupported browser version ability to let old browser into call in composites ([PR #2581](https://github.com/azure/communication-ui-library/pull/2581) by 94866715+dmceachernmsft@users.noreply.github.com)
- Rename DevicePermissions to DeviceChecks ([PR #2608](https://github.com/azure/communication-ui-library/pull/2608) by 2684369+JamesBurnside@users.noreply.github.com)
- Rename DomainPermissions to SitePermissions ([PR #2605](https://github.com/azure/communication-ui-library/pull/2605) by 2684369+JamesBurnside@users.noreply.github.com)
- Change SitePermissions Components property name from type to kind ([PR #2655](https://github.com/azure/communication-ui-library/pull/2655) by 2684369+JamesBurnside@users.noreply.github.com)
- Change domain Permission prop isSafari to browserHint: 'safari' | 'unset' to allow further customization for other browsers ([PR #2599](https://github.com/azure/communication-ui-library/pull/2599) by carolinecao@microsoft.com)


### Bug Fixes
- Update samples to disable pull down to refresh in chat ([PR #2619](https://github.com/azure/communication-ui-library/pull/2619) by edwardlee@microsoft.com)
- Fix error bar messaging for when camera is in use ([PR #2671](https://github.com/azure/communication-ui-library/pull/2671) by 94866715+dmceachernmsft@users.noreply.github.com)
- Change aspect ratio for local video tile to capture full camera view ([PR #2595](https://github.com/azure/communication-ui-library/pull/2595) by edwardlee@microsoft.com)
- Fix findDOMNode warning caused by react.strictmode ([PR #2621](https://github.com/azure/communication-ui-library/pull/2621) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix issue where browser is going back when pulling in new messages ([PR #2550](https://github.com/azure/communication-ui-library/pull/2550) by 79329532+alkwa-msft@users.noreply.github.com)
- Stop microphone tooltip from opening on initial mount ([PR #2587](https://github.com/azure/communication-ui-library/pull/2587) by edwardlee@microsoft.com)
- Move cursor to the end of input when clicking on dialpad text field ([PR #2576](https://github.com/azure/communication-ui-library/pull/2576) by carolinecao@microsoft.com)
- Fix spacing for local Camera switcher button when in localVideoTile ([PR #2571](https://github.com/azure/communication-ui-library/pull/2571) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bound CallReadiness screens to the boundaries of the app ([PR #2624](https://github.com/azure/communication-ui-library/pull/2624) by edwardlee@microsoft.com)
- Center error bar innerText ([PR #2668](https://github.com/azure/communication-ui-library/pull/2668) by carolinecao@microsoft.com)
- Fix race condition where the remote video tile was not showing the participant's video ([PR #2672](https://github.com/azure/communication-ui-library/pull/2672) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix VideoGallery rerender when a participant is pinned for the first time ([PR #2650](https://github.com/azure/communication-ui-library/pull/2650) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix chat pane view when no parent height is set ([PR #2596](https://github.com/azure/communication-ui-library/pull/2596) by jinan@microsoft.com)
- Display correct error text and guidance text for device permission errors on safari browser ([PR #2590](https://github.com/azure/communication-ui-library/pull/2590) by carolinecao@microsoft.com)
- Fix disableEditing not working in MessageThread ([PR #2570](https://github.com/azure/communication-ui-library/pull/2570) by anjulgarg@live.com)
- Ignore errors from previous call when surfacing errors to composite UI ([PR #2549](https://github.com/azure/communication-ui-library/pull/2549) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix tab order focus on Call Composite and CallWithChat Composite ([PR #2601](https://github.com/azure/communication-ui-library/pull/2601) by edwardlee@microsoft.com)
- Fix issue where local video would be not showing to the user whilst it was broadcasting to everyone else on the call ([PR #2558](https://github.com/azure/communication-ui-library/pull/2558) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix bug where on safari browser the device denied screen is not showing when don't allow is clicked ([PR #2597](https://github.com/azure/communication-ui-library/pull/2597) by carolinecao@microsoft.com)
- Prevent camera permission flash on iOS ([PR #2648](https://github.com/azure/communication-ui-library/pull/2648) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix Icon spacing in CallReadiness warning message bars ([PR #2649](https://github.com/azure/communication-ui-library/pull/2649) by 94866715+dmceachernmsft@users.noreply.github.com)
- Horizontal gallery scrollable when VideoGallery width is narrow ([PR #2640](https://github.com/azure/communication-ui-library/pull/2640) by 79475487+mgamis-msft@users.noreply.github.com)
- Video tile ellipsis to only appear on hover ([PR #2661](https://github.com/azure/communication-ui-library/pull/2661) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fix permissions issue on older iOS devices to cover unsupported permissions API call ([PR #2604](https://github.com/azure/communication-ui-library/pull/2604) by 94866715+dmceachernmsft@users.noreply.github.com)

### Improvements
- Update calling SDK beta version to 1.10.0-beta.1 ([PR #2684](https://github.com/azure/communication-ui-library/pull/2684) by 2684369+JamesBurnside@users.noreply.github.com)
- json5 dependency updates ([PR #2645](https://github.com/azure/communication-ui-library/pull/2645) by edwardlee@microsoft.com)
- Webpack version update to 5.61.0 ([PR #2625](https://github.com/azure/communication-ui-library/pull/2625) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduces announcements for when participants come and go from a call ([PR #2546](https://github.com/azure/communication-ui-library/pull/2546) [PR #2546](https://github.com/azure/communication-ui-library/pull/2546)  by 94866715+dmceachernmsft@users.noreply.github.com)
- Tee errors to state when starting or stopping a local video preview outside of a call fails ([PR #2594](https://github.com/azure/communication-ui-library/pull/2594) by 2684369+JamesBurnside@users.noreply.github.com)
- Modify Avatar to person icon when no displayName ([PR #2636](https://github.com/azure/communication-ui-library/pull/2636) by jinan@microsoft.com)
- Updated remote video tile to be tab accessible to open menu ([PR #2651](https://github.com/azure/communication-ui-library/pull/2651) by 79475487+mgamis-msft@users.noreply.github.com)
- Remote participant display name used as heading for remote video tile drawer menu ([PR #2646](https://github.com/azure/communication-ui-library/pull/2646) by 79475487+mgamis-msft@users.noreply.github.com)
- Add total participant count to stateful client ([PR #2679](https://github.com/azure/communication-ui-library/pull/2679) by 2684369+JamesBurnside@users.noreply.github.com)
- AvatarPersona now exposes showUnknownPersonaCoin prop similar to Persona component ([PR #2533](https://github.com/azure/communication-ui-library/pull/2533) by anjulgarg@live.com)
- Add isCameraOn state to help track camera state in the CallAdapter ([PR #2641](https://github.com/azure/communication-ui-library/pull/2641) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add a prop to ErrorBar component to ignore old errors ([PR #2549](https://github.com/azure/communication-ui-library/pull/2549) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update Composite dropdown behavior to correctly notify the user that they have no devices ([PR #2575](https://github.com/azure/communication-ui-library/pull/2575) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add narrator announcements to participant button copy link and peoplepane copylink button in CallWithChat composite ([PR #2588](https://github.com/azure/communication-ui-library/pull/2588) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update useAdaptedSelector in composites layer to retrieve the new client state variables for environmentInfo and alternateCallerId ([PR #2593](https://github.com/azure/communication-ui-library/pull/2593) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.4.1-beta.1](https://github.com/azure/communication-ui-library/tree/1.4.1-beta.1)

Tue, 15 Nov 2022 21:12:22 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.4.0...1.4.1-beta.1)

### Features
- Add role and getRole to selectors ([PR #2419](https://github.com/azure/communication-ui-library/pull/2419) by miguelgamis@microsoft.com)
- Add rooms role into calling stateful client ([PR #2417](https://github.com/azure/communication-ui-library/pull/2417) by miguelgamis@microsoft.com)
- Add role to CallParticipantListParticipant type ([PR #2419](https://github.com/azure/communication-ui-library/pull/2419) by miguelgamis@microsoft.com)
- Access role from stateful call client in CallComposite ([PR #2481](https://github.com/azure/communication-ui-library/pull/2481) by miguelgamis@microsoft.com)
- Change role prop name in the CallComposite to roleHint ([PR #2481](https://github.com/azure/communication-ui-library/pull/2481) by miguelgamis@microsoft.com)
- Move roleHint prop from CallComposite to CallAdapter state ([PR #2482](https://github.com/azure/communication-ui-library/pull/2482) by miguelgamis@microsoft.com)
- Add TeamsCall and TeamsCallAgent to StatefulClient ([PR #2396](https://github.com/azure/communication-ui-library/pull/2396) by jinan@microsoft.com)
- Allow constant visibilty of dtmf dialpad tone last sent ([PR #2429](https://github.com/azure/communication-ui-library/pull/2429) by 94866715+dmceachernmsft@users.noreply.github.com)
- Remove padding and margins from base dialpad component. ([PR #2474](https://github.com/azure/communication-ui-library/pull/2474) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce individual camera and microphone permission modals ([PR #2485](https://github.com/azure/communication-ui-library/pull/2485) by 2684369+JamesBurnside@users.noreply.github.com)
- Introduce domain permission denied prompt pure UI component ([PR #2486](https://github.com/azure/communication-ui-library/pull/2486) by 2684369+JamesBurnside@users.noreply.github.com)
- Introduce checking device permission prompt pure ui component ([PR #2489](https://github.com/azure/communication-ui-library/pull/2489) by 2684369+JamesBurnside@users.noreply.github.com)
- Make DevicePermission component string prop optional ([PR #2434](https://github.com/azure/communication-ui-library/pull/2434) by carolinecao@microsoft.com)
- Make BrowerPermissionDenied component string optional ([PR #2463](https://github.com/azure/communication-ui-library/pull/2463) by carolinecao@microsoft.com)
- Enable troubleshooting guide error bar to display network error guide or device error guide based on error type  ([PR #2433](https://github.com/azure/communication-ui-library/pull/2433) by carolinecao@microsoft.com)
- Add enable call readiness option for Call and CallWithChat composite ([PR #2393](https://github.com/azure/communication-ui-library/pull/2393) by carolinecao@microsoft.com)
- Add allow access modal to CallComposite configuration screen ([PR #2463](https://github.com/azure/communication-ui-library/pull/2463) by carolinecao@microsoft.com)
- Add troubleshooting error bar to CallComposite configuration screen  ([PR #2433](https://github.com/azure/communication-ui-library/pull/2433) by carolinecao@microsoft.com)
- Add device permission drawer to CallComposite mobile configuration screen ([PR #2434](https://github.com/azure/communication-ui-library/pull/2434) by carolinecao@microsoft.com)

### Bug Fixes
- Revert breaking API change in `CallEndedListener` callback ([PR #2464](https://github.com/azure/communication-ui-library/pull/2464) by 82062616+prprabhu-ms@users.noreply.github.com)
- Filter out devices with blank names ([PR #2366](https://github.com/azure/communication-ui-library/pull/2366) by miguelgamis@microsoft.com)
- Filter out camera devices with blank name when declarative device manager is used. ([PR #2456](https://github.com/azure/communication-ui-library/pull/2456) by anjulgarg@live.com)
- Remove DeclarativeCallAgent from stable API and export only in beta build ([PR #2436](https://github.com/azure/communication-ui-library/pull/2436) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix issue where typingIndicator errors were not being caught by the ChatAdapter. ([PR #2471](https://github.com/azure/communication-ui-library/pull/2471) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix a string name and restrict it to beta builds ([PR #2439](https://github.com/azure/communication-ui-library/pull/2439) [PR #2469](https://github.com/azure/communication-ui-library/pull/2469) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix remove participant logic for teams user by making sure to enforce isRemovable property on participantList participant. ([PR #2454](https://github.com/azure/communication-ui-library/pull/2454) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix CallWithChatPane drawer menu from staying open after switching mobile tabs ([PR #2447](https://github.com/azure/communication-ui-library/pull/2447) by miguelgamis@microsoft.com)
- Fix dark mode text for TroubleshootingGuideErrorBar messages ([PR #2501](https://github.com/azure/communication-ui-library/pull/2501) by edwardlee@microsoft.com)
- Fix for icons re-registered warnings in the console ([PR #2506](https://github.com/azure/communication-ui-library/pull/2506) by carolinecao@microsoft.com)
- Fix mute indicator color not matching display name ([PR #2451](https://github.com/azure/communication-ui-library/pull/2451) by anjulgarg@live.com)

### Improvements
- Update html-to-react dependency. Note: This change requires Webpack > 4 ([PR #2428](https://github.com/azure/communication-ui-library/pull/2428) by 2684369+JamesBurnside@users.noreply.github.com)
- Allow a range of communication services dependency packages ([PR #2457](https://github.com/azure/communication-ui-library/pull/2457) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump dependencies to get closer to react 18 support ([PR #2427](https://github.com/azure/communication-ui-library/pull/2427) by 2684369+JamesBurnside@users.noreply.github.com)
- Focus on participant list when opening people pane ([PR #2492](https://github.com/azure/communication-ui-library/pull/2492) by edwardlee@microsoft.com)
- Config page local preview does not show a black screen when camera devices are removed ([PR #2456](https://github.com/azure/communication-ui-library/pull/2456) by anjulgarg@live.com)

## [1.3.2-beta.1](https://github.com/azure/communication-ui-library/tree/1.3.2-beta.1)

Wed, 05 Oct 2022 18:13:37 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.3.1...1.3.2-beta.1)

### Rooms - Public Preview
Azure Communication Services now supports Rooms in public preview. You can use our CallComposite experience for your users to interact with your Rooms-based calls. Rooms allows our customers to create calls with specific users and the ability to
modify their users' calling experience with a variety of role based access control.

You can read more about [rooms concept here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/rooms/room-concept).

You can apply a Rooms locator in the adapter similar to how you
can join a group call using a locator in the adapter + composite.

`roomId = 99466313975086563 // example roomId`

`locator: { 'roomId': roomId }`

Checkout our [storybook](https://azure.github.io/communication-ui-library) to read more about what the UI Library offers into your Rooms experience.

If you would like to clone a repo and get started immediately.
Check out our quickstarts repo in Github [JS Quickstarts](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-quickstart-rooms "JS Quickstarts")

### PSTN and 1:N Calling - Public Preview
ACS UI Library Call and CallWithChat composites are introducing two new capabilities (beta):
1. PSTN Outbound Calling
2. ACS 1:N Outbound Calling

Users will now be able to:
- Call a phone number through the existing Call and CallWithChat composites
- Call a phone number and add it to an ongoing call
- Put the call on hold during a phone or ACS call
- Send DTMF tones during a 1:1 phone call

Read more about [getting a phone number](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&pivots=platform-azp) through Azure Communication Services.

If you would like to clone a repo and get started immediately.
Check out our quickstarts repo in Github [JS Quickstarts](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-pstn-1-n-calling "JS Quickstarts")

### Features
- Call adapter can join a room ([PR #2063](https://github.com/azure/communication-ui-library/pull/2063) by miguelgamis@microsoft.com)
- CallComposite will not request for camera permissions when the role prop is Consumer during a Rooms call. ([PR #2218](https://github.com/azure/communication-ui-library/pull/2218) by miguelgamis@microsoft.com)
- VideoGallery displays participants connection states such as Connecting, Hold etc. during PSTN and 1:N Calls ([PR #2210](https://github.com/azure/communication-ui-library/pull/2210) by anjulgarg@live.com)
- Custom composite end call screens when room call join fails when room does not exist or user is not invited to room. ([PR #2287](https://github.com/azure/communication-ui-library/pull/2287) by miguelgamis@microsoft.com)
- Add role permission behavior to PeopleButton. ([PR #2211](https://github.com/azure/communication-ui-library/pull/2211) by miguelgamis@microsoft.com)
- People pane context menu to remove participant will be present only if role has permissions. ([PR #2328](https://github.com/azure/communication-ui-library/pull/2328) by miguelgamis@microsoft.com)
- Created dropdown in people pane to open dialpad modal ([PR #2076](https://github.com/azure/communication-ui-library/pull/2076) by carolinecao@microsoft.com)
- Use dialpad to send DTMF tones during a 1:1 PSTN Call ([PR #2196](https://github.com/azure/communication-ui-library/pull/2196) by carolinecao@microsoft.com)
- Introduce hold button to CallWithChat composite ([PR #2213](https://github.com/azure/communication-ui-library/pull/2213) by 94866715+dmceachernmsft@users.noreply.github.com)
- Hiding ScreenShareButton, MicrophoneButton, CameraButton, and DevicesButton in CallControls based on rooms role permissions. ([PR #2303](https://github.com/azure/communication-ui-library/pull/2303) by miguelgamis@microsoft.com)
- Introduced a Hold screen to the Calling composite to reflect when the user is on hold in a call. ([PR #2202](https://github.com/azure/communication-ui-library/pull/2202) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce the alternateCallerId prop to the createAzureCommunicationCallAdapter function for setting up PSTN Calling. ([PR #2095](https://github.com/azure/communication-ui-library/pull/2095) by 94866715+dmceachernmsft@users.noreply.github.com)
- Calling and CallWithChat control bars disable buttons when on hold screen. ([PR #2215](https://github.com/azure/communication-ui-library/pull/2215) by 94866715+dmceachernmsft@users.noreply.github.com)
- New PeoplePaneContent in Call Composite matching the one used by CallWithChat Composite ([PR #2109](https://github.com/azure/communication-ui-library/pull/2109) by edwardlee@microsoft.com)
- Show 'You Left the Call' screen when you remove the last PSTN user. Show 'You were removed' screen when a PSTN user hangs up the call. ([PR #2295](https://github.com/azure/communication-ui-library/pull/2295) by anjulgarg@live.com)
- Add remove participant menu item for participant item if role allows in a rooms call. ([PR #2328](https://github.com/azure/communication-ui-library/pull/2328) by miguelgamis@microsoft.com)
- VideoTile can display a participants state such as Connecting, Ringing etc. ([PR #2210](https://github.com/azure/communication-ui-library/pull/2210) by anjulgarg@live.com)
- Update Video Gallery to display participants in a 'Connecting' or 'Ringing' state for PSTN and 1:N calling. ([PR #2163](https://github.com/azure/communication-ui-library/pull/2163) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce UI for call isntances where the browser is unsupported ([PR #2334](https://github.com/azure/communication-ui-library/pull/2334) by 94866715+dmceachernmsft@users.noreply.github.com)
- Error bar displays troubleshooting links for network/device permission errors ([PR #2345](https://github.com/azure/communication-ui-library/pull/2345) by carolinecao@microsoft.com)

### Bug Fixes
- Fix custom participant menu items not showing in CallComposite([PR #2154](https://github.com/azure/communication-ui-library/pull/2154) by prprabhu@microsoft.com)
- Fix scrollbar showing incorrectly in landscape mobile view due to absolutely positioned participant pane in Chat Composite ([PR #2038](https://github.com/azure/communication-ui-library/pull/2038) by anjulgarg@live.com)
- Fix Participants and ScreenShare buttons being disabled when unrelated options are passed into the call composite ([PR #2181](https://github.com/azure/communication-ui-library/pull/2181) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixes issue where you can start a call if you unplug it on the configuration screen. ([PR #2061](https://github.com/azure/communication-ui-library/pull/2061) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix custom menu items being triggered as a flyout and as a drawer menu item on mobile. Fix custom menu items not triggering on callwithchat composite at all. ([PR #2239](https://github.com/azure/communication-ui-library/pull/2239) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix React hook order console errors for LocalDeviceSettings. ([PR #2198](https://github.com/azure/communication-ui-library/pull/2198) by miguelgamis@microsoft.com)
- Message thread background color in composites matches composite background color ([PR #2126](https://github.com/azure/communication-ui-library/pull/2126) by anjulgarg@live.com)
- Fixed bug where drawer on mobile does not get dismissed after making a selection ([PR #2115](https://github.com/azure/communication-ui-library/pull/2115) by carolinecao@microsoft.com)
- Fix running render passes on people pane on every render ([PR #2240](https://github.com/azure/communication-ui-library/pull/2240) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix Calling Composite's control bar buttons incorrectly showing as disabled when the control bar button is set to `true` in the control bar options ([PR #2325](https://github.com/azure/communication-ui-library/pull/2325) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed input order bug on calling dialpad and dtmf dialpad ([PR #2284](https://github.com/azure/communication-ui-library/pull/2284) by carolinecao@microsoft.com)
- Fix local device settings dropdowns to be disabled until device permissions are granted ([PR #2351](https://github.com/azure/communication-ui-library/pull/2351) by miguelgamis@microsoft.com)
- Autofocus on back button when initially opening People and Chat pane ([PR #2045](https://github.com/azure/communication-ui-library/pull/2045) by edwardlee@microsoft.com)
- Fix joinCall set correct mute state based on microphoneOn parameter ([PR #2131](https://github.com/azure/communication-ui-library/pull/2131) by fanjin1989@gmail.com)
- Add Announcer to copy invite link button to announce action on button. ([PR #2289](https://github.com/azure/communication-ui-library/pull/2289) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix disabled start call button when role is Consumer ([PR #2251](https://github.com/azure/communication-ui-library/pull/2251) by miguelgamis@microsoft.com)
- Fixed bug where voice over does not annouce menu item selected in both calling and callwithchat ([PR #2060](https://github.com/azure/communication-ui-library/pull/2060) by carolinecao@microsoft.com)
- Fix infinite spinner during screenShare ([PR #2191](https://github.com/azure/communication-ui-library/pull/2191) by jinan@microsoft.com)
- Fix invalid scrollbars when gif images are shared in chat ([PR #2037](https://github.com/azure/communication-ui-library/pull/2037) by anjulgarg@live.com)
- Fix bug of dismissed menu when scrolling ([PR #2069](https://github.com/azure/communication-ui-library/pull/2069) by jinan@microsoft.com)
- Fix voiceover tab navigation of messages including system messages. Hide message action flyout when focus blurs. ([PR #2042](https://github.com/azure/communication-ui-library/pull/2042) by miguelgamis@microsoft.com)
- Fix screenshare button selector to disable button when call is InLobby or Connecting state. ([PR #2059](https://github.com/azure/communication-ui-library/pull/2059) by 94866715+dmceachernmsft@users.noreply.github.com)

### Improvements
- Fixed onCallEnded event to trigger before the composite page transition. ([PR #2201](https://github.com/azure/communication-ui-library/pull/2201) by 2684369+JamesBurnside@users.noreply.github.com)
- Introduces fade in/out animations to is speaking while muted indicator ([PR #2312](https://github.com/azure/communication-ui-library/pull/2312) by 94866715+dmceachernmsft@users.noreply.github.com)
- Composites now using theme.semanticColors.bodyBackground as background color ([PR #2117](https://github.com/azure/communication-ui-library/pull/2117) by anjulgarg@live.com)
- Replace floating div with border with inset border of video tile to show user is speaking. ([PR #2236](https://github.com/azure/communication-ui-library/pull/2236) by miguelgamis@microsoft.com)
- Chat message bubble shows border in high contrast modes making each message distinguishable. ([PR #2106](https://github.com/azure/communication-ui-library/pull/2106) by anjulgarg@live.com)
- Load new messages only when scroll bar is at the top ([PR #2355](https://github.com/azure/communication-ui-library/pull/2355) by edwardlee@microsoft.com)
- Fix React hook order console errors for CameraButton. ([PR #2198](https://github.com/azure/communication-ui-library/pull/2198) by miguelgamis@microsoft.com)
- Changed z-index so new message button shows ontop of chat bubble ([PR #2046](https://github.com/azure/communication-ui-library/pull/2046) by carolinecao@microsoft.com)
- Make participant items tab navigable ([PR #2045](https://github.com/azure/communication-ui-library/pull/2045) by edwardlee@microsoft.com)
- Control Bar uses theme.semanticColors.bodyBackground instead of theme.palette.white ([PR #2117](https://github.com/azure/communication-ui-library/pull/2117) by anjulgarg@live.com)
- Updated tooltip strings to not be title case ([PR #2350](https://github.com/azure/communication-ui-library/pull/2350) by miguelgamis@microsoft.com)
- Show datetime when there are more than 5 mins between each message ([PR #2299](https://github.com/azure/communication-ui-library/pull/2299) by carolinecao@microsoft.com)
- Update Fluent-ui/icons package. ([PR #2305](https://github.com/azure/communication-ui-library/pull/2305) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update startCall and removeParticipant adapter methods to use CommunicationIdentifier as userId ([PR #2377](https://github.com/azure/communication-ui-library/pull/2377) by anjulgarg@live.com)
- Use addparticipant handler to call a PSTN user ([PR #2168](https://github.com/azure/communication-ui-library/pull/2168) by carolinecao@microsoft.com)
- Update startCall usage by call adapter to pass in audio and video options from configuration screen. ([PR #2317](https://github.com/azure/communication-ui-library/pull/2317) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add disabled option for CallWithChat control bar buttons ([PR #2294](https://github.com/azure/communication-ui-library/pull/2294) by edwardlee@microsoft.com)
- Bumped calling SDK beta version to 1.8.0-beta.1 ([PR #2362](https://github.com/azure/communication-ui-library/pull/2362) by miguelgamis@microsoft.com)
- Hiding copy link button for Rooms call ([PR #2370](https://github.com/azure/communication-ui-library/pull/2370) by miguelgamis@microsoft.com)

## [1.3.1-beta.1](https://github.com/azure/communication-ui-library/tree/1.3.1-beta.1)

Wed, 29 Jun 2022 17:31:05 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.3.0...1.3.1-beta.1)

### Features

  - Add two new UFDs based on cameraStoppedUnexpectedly call diagnostic: 'callVideoStoppedBySystem','callVideoRecoveredBySystem' ([PR #1991](https://github.com/azure/communication-ui-library/pull/1991) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add error message for call video stopped unexpectedly and call video resumed ([PR #1991](https://github.com/azure/communication-ui-library/pull/1991) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add callMicrophoneUnmutedBySystem UFD and e2e tests for callMicrophoneUnmutedBySystem and callMicrophoneMutedBySystem ([PR #1994](https://github.com/azure/communication-ui-library/pull/1994) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update error message shown when microphoneNotFunctioning is triggered per Calling guidence([PR #1994](https://github.com/azure/communication-ui-library/pull/1994) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update device change events in Calling and CallWithChat Adapters : 'selectedCameraChanged', 'selectedMicrophoneChanged'
'selectedSpeakerChanged', expose these events so that contoso can perform actions on them ([PR #1982](https://github.com/azure/communication-ui-library/pull/1982) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update microphone and camera button to be disabled when there are no cameras or microphones present ([PR #1993](https://github.com/azure/communication-ui-library/pull/1993) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add autofocus to rejoin call button on call end page ([PR #2008](https://github.com/azure/communication-ui-library/pull/2008) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Add new prop onChange to dialpad to grab textfield values and modified onClickDialpadButton type to (buttonValue: string, buttonIndex: number) => void so we can grab info regarding which button is clicked ([PR #1989](https://github.com/azure/communication-ui-library/pull/1989) by carolinecao@microsoft.com)


### Bug Fixes

  - Fix SendBox button for VoiceOver user on iOS so it is actionable by double tap on it  ([PR #2004](https://github.com/azure/communication-ui-library/pull/2004) by miguelgamis@microsoft.com)
  - Disable tooltip for Persona components for mobile users ([PR #1990](https://github.com/azure/communication-ui-library/pull/1990) by carolinecao@microsoft.com)
  - Fix read receipts tooltip position issue in UI tests ([PR #2005](https://github.com/azure/communication-ui-library/pull/2005) by anjulgarg@live.com)
  - Fix bug: When a developer uses the onFetchPersonaAvatarData prop for the CallWIthChat Composite to override the name of the participants, the display name in the chat thread on messages sent will not be overridden. ([PR #2013](https://github.com/azure/communication-ui-library/pull/2013) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix 'No Microphones Found' message persisting when new microphones have been reconnected ([PR #2000](https://github.com/azure/communication-ui-library/pull/2000) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix loading spinner size in small containers ([PR #1995](https://github.com/azure/communication-ui-library/pull/1995) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add aria labels and announcer to file sharing components to make file sharing meet accessibility standards ([PR #1960](https://github.com/azure/communication-ui-library/pull/1960) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Update Participant pane to be an overlay on top of message thread so it can be tapped into when opened ([PR #1943](https://github.com/azure/communication-ui-library/pull/1943) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fix bug where the "New Message" button was getting hidden under messages ([PR #2046](https://github.com/Azure/communication-ui-library/pull/2046) by carolinecao@microsoft.com)
  - Fix bug where Chat participant pane in chat composite mobile view causing overflow ([PR #2038](https://github.com/Azure/communication-ui-library/pull/2038) by anjulgarg@live.com)
  - Fix bug where Chat message thread size is wrong and shows scrollbar when a gif image is shared ([PR #2037](https://github.com/Azure/communication-ui-library/pull/2037) by anjulgarg@live.com)


### Improvements

  - Update variable name dismissSidePaneButton to dismissSidePaneButtonLabel, make some localization string variable optional ([PR #2009](https://github.com/azure/communication-ui-library/pull/2009) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add 0.3rem padding to the top of the fluent message bar to create even spacing in the errorbar component between the text and the edges of the bar and add registered icon for dissmissal button. ([PR #2003](https://github.com/azure/communication-ui-library/pull/2003) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add aria-live: "assertive" for announcing lobby, network failure and call end notices so screen reader users can be aware of call status change immediately([PR #2007](https://github.com/azure/communication-ui-library/pull/2007) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Add best practice around only allowing one instance of the sample to be open at a time on mobile ([PR #1981](https://github.com/azure/communication-ui-library/pull/1981) by 2684369+JamesBurnside@users.noreply.github.com)
  - Memoizes the return from the participant list selector for better optimization. ([PR #1980](https://github.com/azure/communication-ui-library/pull/1980) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update fluentui/react version ([PR #1979](https://github.com/azure/communication-ui-library/pull/1979) by carolinecao@microsoft.com)
  - Update startCall handler in the Calling and CallWithChat Adapters to support the StartCallOptions parameter needed to start a PSTN Call. ([PR #1976](https://github.com/azure/communication-ui-library/pull/1976) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add a new attribute `incomingCalls` to CallAgentDeclarative that returns all active incoming calls ([PR #1975](https://github.com/azure/communication-ui-library/pull/1975) by anjulgarg@live.com)


## [1.2.2-beta.1](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.2.2-beta.1)

Tue, 19 Apr 2022 20:46:13 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.2.0...1.2.2-beta.1)

### Features

  - Show Error Bar to user when joining a call fails ([PR #1788](https://github.com/azure/communication-ui-library/pull/1788) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add local and remote picture-in-picture component in Chat pane of CallWithChat composite in mobile view. ([PR #1617](https://github.com/azure/communication-ui-library/pull/1617) by miguelgamis@microsoft.com)
  - Add error bar to show file download error message in the message thread. ([PR #1625](https://github.com/azure/communication-ui-library/pull/1625) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Add resend button to contextual menu ([PR #1676](https://github.com/azure/communication-ui-library/pull/1676) by carolinecao@microsoft.com)
  - Add filesharing to callwithchat composite ([PR #1667](https://github.com/azure/communication-ui-library/pull/1667) by anjulgarg@live.com)
  - Add telemetry for rendering problems ([PR #1752](https://github.com/azure/communication-ui-library/pull/1752) by jiangnanhello@live.com)

### Bug Fixes

  - Hide People menu item in MoreDrawer when set in CallControl options ([PR #1695](https://github.com/azure/communication-ui-library/pull/1695) by edwardlee@microsoft.com)
  - Fix race condition of "not in chat" ([PR #1652](https://github.com/azure/communication-ui-library/pull/1652) by jiangnanhello@live.com)
  - Fix styles so that the PIPIP shows over the content in the people and chat panes on mobile. ([PR #1674](https://github.com/azure/communication-ui-library/pull/1674) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix PiPiP bounds such that it does not go off screen. ([PR #1748](https://github.com/azure/communication-ui-library/pull/1748) by miguelgamis@microsoft.com)
  - Fix Picture-In-Picture component in mobile composites going outside the screen when the mobile device is rotated from portrait to landscape ([PR #1802](https://github.com/azure/communication-ui-library/pull/1802) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix styles to remove undesired scroll bar in context menus on messages. ([PR #1675](https://github.com/azure/communication-ui-library/pull/1675) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Memoize chat bubble to avoid unnecessary re-render ([PR #1698](https://github.com/azure/communication-ui-library/pull/1698) by jiangnanhello@live.com)
  - Fix A11y bug where user cannot keyboard outside of local video preview ([PR #1623](https://github.com/azure/communication-ui-library/pull/1623) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix styles for local camera switcher for better visibility on white backdrops. ([PR #1767](https://github.com/azure/communication-ui-library/pull/1767) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix chevron alignment issues on message read receipt flyout. ([PR #1701](https://github.com/azure/communication-ui-library/pull/1701) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix floating local video tile going offscreen in the VideoGallery Component ([PR #1725](https://github.com/azure/communication-ui-library/pull/1725) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix bug when deleting failed to send messages ([PR #1780](https://github.com/azure/communication-ui-library/pull/1780) by carolinecao@microsoft.com)
  - Fix for file upload button's inconsistent behavior ([PR #1673](https://github.com/azure/communication-ui-library/pull/1673) by anjulgarg@live.com)
  - Fix for delay in removing file card after a message is sent ([PR #1645](https://github.com/azure/communication-ui-library/pull/1645) by anjulgarg@live.com)
  - Fix for inconsistent fileupload sendbox errors ([PR #1673](https://github.com/azure/communication-ui-library/pull/1673) by anjulgarg@live.com)

### Improvements

  - Reduce min-width and min-height of the composites to support a galaxy fold portrait screen ([PR #1769](https://github.com/azure/communication-ui-library/pull/1769) by 2684369+JamesBurnside@users.noreply.github.com)
  - Introduce Aria-label for the return to call button on mobile. ([PR #1723](https://github.com/azure/communication-ui-library/pull/1723) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add aria-label for SidePaneHeader dismiss button ([PR #1763](https://github.com/azure/communication-ui-library/pull/1763) by edwardlee@microsoft.com)
  - Style update for Screenshare button when checked in CallWithChat composite. ([PR #1653](https://github.com/azure/communication-ui-library/pull/1653) by miguelgamis@microsoft.com)
  - Switch scroll behavior in chat styles so that the parent wrapper dosen't have scroll behavior when file sharing icon present. ([PR #1689](https://github.com/azure/communication-ui-library/pull/1689) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update mobile people and chat tabs to have 'tab' roles for narration. ([PR #1770](https://github.com/azure/communication-ui-library/pull/1770) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add aria label and aria description to back button on TabHeader for mobile view ([PR #1796](https://github.com/azure/communication-ui-library/pull/1796) by edwardlee@microsoft.com)
  - Improve Chat composite behavior in CallWithChatComposite to allow autofocus when opening chat pane. ([PR #1717](https://github.com/azure/communication-ui-library/pull/1717) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Make Chat Message action button icon customizable ([PR #1798](https://github.com/azure/communication-ui-library/pull/1798) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add aria-label for ChatMessageActionMenu button ([PR #1760](https://github.com/azure/communication-ui-library/pull/1760) by edwardlee@microsoft.com)
  - Add aria description to indicate selected camera in LocalVideoCameraButton ([PR #1794](https://github.com/azure/communication-ui-library/pull/1794) by edwardlee@microsoft.com)
  - Add joincall failure strings to ErrorBar component ([PR #1788](https://github.com/azure/communication-ui-library/pull/1788) by 2684369+JamesBurnside@users.noreply.github.com)
  - Attach file icon position changes basis on form factor ([PR #1774](https://github.com/azure/communication-ui-library/pull/1774) by anjulgarg@live.com)
  - Introduces A11y strings for aria-roles for control bar buttons. ([PR #1628](https://github.com/azure/communication-ui-library/pull/1628) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.1.1-beta.1](https://github.com/azure/communication-ui-library/tree/1.1.1-beta.1)

Tue, 01 Mar 2022 16:42:52 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.1-beta.2...1.1.1-beta.1)

### Major Breaking Changes

- Upgraded to calling to 1.4.2-beta.1 ([PR #1509](https://github.com/azure/communication-ui-library/pull/1509) by 79329532+alkwa-msft@users.noreply.github.com)
- MeetingsComposite renamed to CallWithChatComposite ([PR #1446](https://github.com/azure/communication-ui-library/pull/1446) by 2684369+JamesBurnside@users.noreply.github.com)
- Restructure createAzureCommunicationCallWithChatAdapter arguments to enable accepting just a teams link without having to provide an extracted chat thread ID. ([PR #1423](https://github.com/azure/communication-ui-library/pull/1423) by 2684369+JamesBurnside@users.noreply.github.com)

### Features

- CallWithChatComposite Mobile Improvements:
  - Optimized the ControlBar for mobile.
  - Added a mobile drawer navigation to replace context menus on mobile ([PR #1460](https://github.com/azure/communication-ui-library/pull/1460) by 2684369+JamesBurnside@users.noreply.github.com)
  - People and Chat panes span the whole composite for sufficient space ([PR #1486](https://github.com/azure/communication-ui-library/pull/1486), [PR #1440](https://github.com/azure/communication-ui-library/pull/1440) by miguelgamis@microsoft.com)
  - New button for switching camera placed on the local video feed ([PR #1367](https://github.com/azure/communication-ui-library/pull/1367) by 94866715+dmceachernmsft@users.noreply.github.com)
- CallWithChatComposite desktop improvements:
  - Updated the visuals of the ControlBar Buttons ([PR #1388](https://github.com/azure/communication-ui-library/pull/1388) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Added a unread messages badge to the chat button ([PR #1378](https://github.com/azure/communication-ui-library/pull/1378) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added `createAzureCommunicationCallWithChatAdapterFromClients`; a new constructor that accepts stateful client arguments to create a CallWithChatAdapter ([PR #1457](https://github.com/azure/communication-ui-library/pull/1457) by edwardlee@microsoft.com)
- Composites containing Chat features now show who has read the message in the context menu ([PR #1407](https://github.com/azure/communication-ui-library/pull/1407) by carolinecao@microsoft.com)
- Exposed Chat and Call latestErrors in CallWithChatComposite ([PR #1456](https://github.com/azure/communication-ui-library/pull/1456) by edwardlee@microsoft.com)
- Remove `false` from ChatComposite autoFocus property ([PR #1518](https://github.com/azure/communication-ui-library/pull/1518) by 94866715+dmceachernmsft@users.noreply.github.com)
- File sharing work underway. This feature is not ready yet but you may notice API updates related to file sharing.
- Add extra props to ControlBarButton selectors to enable use as a split button ([PR #1392](https://github.com/azure/communication-ui-library/pull/1392), [PR #1436](https://github.com/azure/communication-ui-library/pull/1436) by 82062616+prprabhu-ms@users.noreply.github.com)

### Bug Fixes

- Fix IME keyboard inputs for Safari using KeyCode and which properties. ([PR #1513](https://github.com/azure/communication-ui-library/pull/1513) by 94866715+dmceachernmsft@users.noreply.github.com)
- Vertically aligned Muted indicator notification ([PR #1561](https://github.com/azure/communication-ui-library/pull/1561) by edwardlee@microsoft.com)
- Fix register icons console warning; Use a React Context to set locale, icons, and theme only once through BaseComposite ([PR #1496](https://github.com/azure/communication-ui-library/pull/1496) by edwardlee@microsoft.com)
- Fix CallComposite being stuck on the configuration page when using adapter.startCall ([PR #1403](https://github.com/azure/communication-ui-library/pull/1403) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix exception thrown when trying to log stringified state when azure logger is set to verbose ([PR #1543](https://github.com/azure/communication-ui-library/pull/1543) by 2684369+JamesBurnside@users.noreply.github.com)
- Use `messageid` to check read info instead of `readon` time stamp ([PR #1503](https://github.com/azure/communication-ui-library/pull/1503) by carolinecao@microsoft.com)
- Prevent horizontal scroll in MessageThread by limiting the image preview max size in a chat message ([PR #1490](https://github.com/azure/communication-ui-library/pull/1490) by jiangnanhello@live.com)
- Bugfix for messages from teams users having extra margins around the message content. ([PR #1507](https://github.com/azure/communication-ui-library/pull/1507) by jiangnanhello@live.com)
- Fixed Avatars position in message thread ([PR #1345](https://github.com/azure/communication-ui-library/pull/1345) by edwardlee@microsoft.com)
- Fix EndCallButton theme colors for better contrast ([PR #1471](https://github.com/azure/communication-ui-library/pull/1471) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fixed Editbox border which disappeared after adding file sharing changes ([PR #1523](https://github.com/azure/communication-ui-library/pull/1523) by 97124699+prabhjot-msft@users.noreply.github.com)

### Improvements

- Update locale files with newest localized strings. ([PR #1435](https://github.com/azure/communication-ui-library/pull/1435) by miguelgamis@microsoft.com)
- Identifiers added for HorizontalGallery left and right navigation buttons. ([PR #1347](https://github.com/azure/communication-ui-library/pull/1347) by miguelgamis@microsoft.com)
- Upgrade @azure/communication-signaling to 1.0.0.beta.12 ([PR #1352](https://github.com/azure/communication-ui-library/pull/1352) by anjulgarg@live.com)
- Add documentation for Local camera switcher button to VideoGallery documentation ([PR #1491](https://github.com/azure/communication-ui-library/pull/1491) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update CameraButton documentation to show device flyout ([PR #1436](https://github.com/azure/communication-ui-library/pull/1436) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix locales table in documentation ([PR #1555](https://github.com/azure/communication-ui-library/pull/1555) by miguelgamis@microsoft.com)
- Log most state updates in StastefulClients when Azure logger is set to verbose ([PR #1449](https://github.com/azure/communication-ui-library/pull/1449) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update default label strings for ScreenShareButton ([PR #1472](https://github.com/azure/communication-ui-library/pull/1472) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add tooltip to inputBox buttons ([PR #1506](https://github.com/azure/communication-ui-library/pull/1506) by jiangnanhello@live.com)
- Update string from remove to delete ([PR #1434](https://github.com/azure/communication-ui-library/pull/1434) by jiangnanhello@live.com)
- Allow setting min and max size of the persona avatar in the Video Tile ([PR #1406](https://github.com/azure/communication-ui-library/pull/1406) by 2684369+JamesBurnside@users.noreply.github.com)
- Make ChevronRight customizable through icons interface in CallWithChatComposite ([PR #1533](https://github.com/azure/communication-ui-library/pull/1533) by 2684369+JamesBurnside@users.noreply.github.com)
- Upgrading nanoid to 3.1.32 ([PR #1412](https://github.com/azure/communication-ui-library/pull/1412) by 79329532+alkwa-msft@users.noreply.github.com)
- Initial Call and Meeting adapter support for making Adhoc calls directly to participants (i.e. without use of a groupID) ([PR #1431](https://github.com/azure/communication-ui-library/pull/1431) by 2684369+JamesBurnside@users.noreply.github.com)
- Enable keyboard shortcuts in storybook documentation ([PR #1527](https://github.com/azure/communication-ui-library/pull/1527) by carolinecao@microsoft.com)
- updating version of node suggested for snippets ([PR #1488](https://github.com/azure/communication-ui-library/pull/1488) by 79329532+alkwa-msft@users.noreply.github.com)

## [1.0.1-beta.2](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.0.1-beta.2)

Mon, 24 Jan 2022 23:18:53 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.1-beta.1...1.0.1-beta.2)

### Changes

- Calling Component Bindings
  - Move @azure/communication-calling to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- Stateful Calling Client
  - Move @azure/communication-calling to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- Chat Component Bindings
  - Move @azure/communication-chat to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- Stateful Chat Client
  - Small code modifications for conditional build ([PR #1284](https://github.com/azure/communication-ui-library/pull/1284) by jinan@microsoft.com)
  - Move @azure/communication-chat to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- UI Components
  - Added strings to the side pane from locale context. ([PR #1278](https://github.com/azure/communication-ui-library/pull/1278) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fixed inability to click the horizontal gallery left/right button by changing pointerEvents of LayerHost. ([PR #1293](https://github.com/azure/communication-ui-library/pull/1293) by kaurprabhjot@microsoft.com)
  - Fixed ScreenShareButton style to allow custom styles ([PR #1286](https://github.com/azure/communication-ui-library/pull/1286) by edwardlee@microsoft.com)
  - Small code modifications for conditional build 1. Conditional build does not support <Type*> convert, use `foo as Bar` 2. Add a hook to bypass type error when build meeting composite ([PR #1284](https://github.com/azure/communication-ui-library/pull/1284) by jinan@microsoft.com)
  - Horizontal gallery button height fixed ([PR #1285](https://github.com/azure/communication-ui-library/pull/1285) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fixed alignment of typing indicator in chat composite by reducing minHeight. ([PR #1297](https://github.com/azure/communication-ui-library/pull/1297) by kaurprabhjot@microsoft.com)
  - Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
- UI Composites
  - implemented custom datamodel functionality to meeting composite excluding sidebar. ([PR #1319](https://github.com/azure/communication-ui-library/pull/1319) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Added MeetingCompositeOptions type to the meetings composite. ([PR #1272](https://github.com/azure/communication-ui-library/pull/1272) by 94866715+dmceachernmsft@users.noreply.github.com)
  - changed meeting peopel pane to use ParticipantContainer Component. ([PR #1328](https://github.com/azure/communication-ui-library/pull/1328) by 94866715+dmceachernmsft@users.noreply.github.com)
  - added missing return types. ([PR #1332](https://github.com/azure/communication-ui-library/pull/1332) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add API for injecting custom buttons into CallComposite ([PR #1314](https://github.com/azure/communication-ui-library/pull/1314) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Added strings to the side pane from locale context. ([PR #1278](https://github.com/azure/communication-ui-library/pull/1278) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Do not remove users from chat in the meeting composite. ([PR #1340](https://github.com/azure/communication-ui-library/pull/1340) by 2684369+JamesBurnside@users.noreply.github.com)
  - Small code modifications for conditional build 1. Conditional build does not support <Type*> convert, use `foo as Bar` 2. Add a hook to bypass type error when build meeting composite ([PR #1284](https://github.com/azure/communication-ui-library/pull/1284) by jinan@microsoft.com)
  - Move @azure/communication-{calling, chat} to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Increase size of participant flyout menu items for mobile view ([PR #1322](https://github.com/azure/communication-ui-library/pull/1322) by edwardlee@microsoft.com)
  - Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
- Storybook
  - Fixed storybook controls around the meetings composite to work with the new MeetingCompositeOptions type in the MeetingCompositeProps ([PR #1272](https://github.com/azure/communication-ui-library/pull/1272) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
  - Add manual documentation for adapters ([PR #1325](https://github.com/azure/communication-ui-library/pull/1325) by 2684369+JamesBurnside@users.noreply.github.com)
  - Added entry for endpointUrl in appsettings.json instead of using connectionString twice ([PR #1310](https://github.com/azure/communication-ui-library/pull/1310) by 97124699+prabhjot-msft@users.noreply.github.com)

## [1.0.1-beta.1](https://github.com/azure/communication-ui-library/tree/1.0.1-beta.1)

Tue, 04 Jan 2022 22:57:09 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0...1.0.1-beta.1)

### Changes

- UI Components
  - New aria label string added for `SendBox`. New property added to `SendBox` to autofocus on mount. ([PR #1235](https://github.com/azure/communication-ui-library/pull/1235) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add tooltipVideoLoadingContent to Camera strings ([PR #1253](https://github.com/azure/communication-ui-library/pull/1253) by alcail@microsoft.com)
  - Add aria-label strings to MessageStatusIndicator ([PR #1247](https://github.com/azure/communication-ui-library/pull/1247) by alcail@microsoft.com)
  - Allow focus on control bar button when disabled ([PR #1251](https://github.com/azure/communication-ui-library/pull/1251) by alcail@microsoft.com)
  - Added aria roles to the different menu props. ([PR #1227](https://github.com/azure/communication-ui-library/pull/1227) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Bug Fix: Ensure TypingIndicator correctly displays the number of users ([PR #1248](https://github.com/azure/communication-ui-library/pull/1248) by alcail@microsoft.com)
- UI Composites
  - Added localization strings and added meetingscreen component to increase readability of the meeting composite. ([PR #1274](https://github.com/azure/communication-ui-library/pull/1274) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Added fix to allow for false value for meetingCallOptions to hide whole bar. ([PR #1266](https://github.com/azure/communication-ui-library/pull/1266) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add autofocus property to the Chat Composite ([PR #1235](https://github.com/azure/communication-ui-library/pull/1235) by 94866715+dmceachernmsft@users.noreply.github.com)
- Storybook
  - Bugfix for unreadable canvas code ([PR #1270](https://github.com/azure/communication-ui-library/pull/1270) by anjulgarg@live.com)
  - Bugfix for tooltip alignment in message status indicator storybook  ([PR #1267](https://github.com/azure/communication-ui-library/pull/1267) by anjulgarg@live.com)
  - Making mock videos in storybook cover the entire video tile ([PR #1273](https://github.com/azure/communication-ui-library/pull/1273) by anjulgarg@live.com)
  - Add example ErrorBar to storybook docs. ([PR #1268](https://github.com/azure/communication-ui-library/pull/1268) by anjulgarg@live.com)

## [1.0.0-beta.8](https://github.com/azure/communication-ui-library/tree/1.0.0-beta.8)

Wed, 17 Nov 2021 22:21:27 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.7...1.0.0-beta.8)

### Changes

* Bump headless calling SDK to 1.3.1-beta.1
* [Breaking API change] API polish based on Azure Review Board feedback
* `ChatComposite`: Improved responsive experience when editing messages in the message thread
* `ChatComposite`: Disabled participant pane
* `CallComposite`: Add a screen for bad network conditions
* `CallComposite`: Add a notification UI when local participant is speaking while muted
* `CallComposite`: Make end call pages uniform, add button to return to call
* `CallComposite`: Use `HorizontalGallery` for local and remote screen share streams
* `CallComposite`: Add tooltips to control bar buttons
* Expose User Facing Diagnostics API in `StatefulCallClient` and `CallAdapter`
* Expose more ariaLabel and text strings via the localization API, more styling props

### Bug Fixes

* Fully implement identifier to/from MRI conversion
* Many UI improvements to make the composites responsive to different form factors
* Disallow removing Teams participants from call and chat
* `ChatComposite`: Update MessageThread selector to filter out unsupported messages
* `ChatComposite`: Ensure message thread links open in a new tab
* `ChatComposite`: Ensuring edit/delete context menu is adjacent to its corresponding message
* `ChatComposite`: Fix chat initials not showing in the message thread
* `CallComposite`: `VideoTile` fixes related to isSpeaking indicator
* `CallComposite`: Do not show page navigation buttons in `HorizontalGallery` if all participants can fit
* `CallComposite`: VideoTile label text truncation on overflow, opacity fix
* `CallComposite`: Respect system defaults for audio / video devices
* `CallComposite`: Make all button width consistent in desktop mode

## [1.0.0-beta.7](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.7)

Mon, 1 Nov 2021 12:57:14 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.6...1.0.0-beta.7)

### Changes

* Updated the package to use calling sdk beta 1.2.3-beta.1
* Improved how participants are ordered in the `VideoGallery` using underlying Calling SDK dominant speaking
* Improved how video tiles are laid out in the `VideoGallery`
* Messages in the `MessageThread` make better use of empty space
* Accessibility improvements across calling and chat composites
* Removed onToggleCamera API. Use startCamer and stopCamera instead
* Removed setPage API. Developers can access the current page through `adapter.getState()` and modify the page by interacting with the UI.
* Exposed additional diagnostic events through the `CallAdapter`
* Removed screenshare button by default on Call Composite and Meeting Composite when in mobile view
* Update options button icon to a settings gear
* Updated the Lobby Page call controls to match the Call Page controls
* Updated the "connecting to call" page UI in the Call Composite
* Optimized Configuration Page, Lobby Page and Call Page for mobile in the Call Composite
* Disable Participants button and Screenshare button on the Call Composite lobby screen

### Bug fixes

* Fixed issue where messages from a Teams client would fail to render in `MessageThread` and `ChatComposite`
* `CallControl` items are consistent between Lobby and Call screen
* Maintain position in `MessageThread` when fetching additional messages
* Fixed browser camera indicator still showing in use after turning it off
* Fixed issue where some message thread strings could not be set through the ChatComposite interface
* Fix box-shadow showing below the Call Composite controls bar
* Fixed issue where some message thread strings could not be set through the ChatComposite interface

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.5...1.0.0-beta.6)

### Changes

* Support editing and deleting sent messages in the `MessageThread` UI
* Support customization to the `ParticipantList` to inject menu items for each participant
* (breaking change) API consistency and documentation updates
  * Add a uniform way to set cutomization options on the composites.
* Add `MeetingAdapter` to back the `MeetingComposite`. By default, the `MeetingAdapter` is backed by the Azure Communication Services backends.
* Azure Communication Services SDK updates: @azure/communication-chat bumped to 1.1.0
* (breaking change) Error handling: Stop clearing errors from state on successful operations; drop support for modifying state in `StatefulChatClient` and `StatefulCallClient`.

### Bug fixes

* Stop styling the `body` tag from `FluentThemeProvider` (styling leak to the host application)
* Better themeing support in `ControlBar` component - support container border and shadow customization; support label font costumization

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.4...1.0.0-beta.5)

### Changes

* Update Call Composite to use @azure/communication-calling@1.2.1-beta.1

* Add Dominant Speaker support to Video Gallery

* Add active and dominant speaker support to screenshare gallery

* Add custom Icons injection in components and composites

* Add custom avatar data injection for composites

* Show ACS errors via ErrorBar in CallComposite

* Add a delete API to clear calling ACS errors

* Add call diagnostics to stateful client

* Expose strongly type errors in CallAdapter

* Localize call and chat composite strings

* Localize errors in Call Composite

* Update available locales and translations

* Add chat message edit feature

* Truncating long display names in ParticipantItem

#### Bug Fixes
* Fix menu disappearing during a call when new participants joined
* Fix English (US) and English (GB) exports
* Fix theming for local preview placeholder for calling composite
* Fix theming for MessageThread icons
* Fix Icon misalignment in ParticipantItem


## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.3...1.0.0-beta.4)

### Changes

* Add Localization to Composites. Learn more: https://azure.github.io/communication-ui-library/?path=/story/localization--page

* Add remove participant button to the Meeting Composite and Call Composite

* Add applicationID to chat user agent

* Added rtl property to FluentThemeProvider

* Remove redundant prop VideoTile.isVideoReady

* Bump Typescript version to 4.3.5

* Update Call composite adapter joinCall return type to be the same as startCall

* Add explicit string literals for error targets in Chat Stateful client

* Update createAzureCommunicationChatAdapter and createAzureCommunicationCallAdapter constructors to take in a named object instead of seperate args

* Add meeting composite

* Add system message for selector props

* Replace StatefulChatClient.clearErrors() with modifier pattern

#### Bug Fixes
  * Fix item alignment and 'Leave' button color in Dark Mode for Chat sample header
  * Show avatar when video is off (remote and local)
  * Fix alignment of Chat bubble with/without receipt
  * Fix button menu flyouts exceeding screen width
  * Fix fluent theme provider not being applied to the meeting composite
  * Fix permission banner styling - allow multiline
  * Fix partially composed chat messages being lost when closing and reopening the chat pane in the meeting composite
  * Fix tsdoc comments - rename @Link -> @link
  * Fix Chat infinite scroll jumpy behavior
  * Fix screenshare not displaying for call attendees
  * Fix screenshare dialog eating user input across the whole web page
  * Fix video gallery styling issues during (participant pane too large) and after (messed up format) screenshare
  * Fix sample app dark theme on IPhoneSE
  * Fix RTL responsiveness of TypingIndicator
  * Fix video device icons in ControlBar Options button
  * Fix meeting pane overlapping the call control bar
  * Remove type blocking usage of the package on older typescript versions
  * Fix SendBox padding so we don't overlap text with the send message button
  * Fix video gallery local preview position to be relative to the parent
  * Ensure call composite media gallery has a minimum height

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.2...1.0.0-beta.3)

### Changes

* [Breaking change] Call Composite and Chat Composite adapters now take in a `CommunicationTokenCredential` in the constructor instead of the token

* [Breaking change] Call Composite and Chat Composite adapters take in an object containing all of the parameters instead of passing in the parameters individually
(for the token point above, it is one of the properties of the object)

* Publishing `js` files to use composites outside of a react app as part of the Github Release

* Fixing the send box component where the padding would overlap with the icon

* Fixing the local preview overlapping the call control bar

* Setting minHeight on the call composite media gallery

* Adding a small fix for supporting typescript < 4.1

* React hook useTheme added to ACS Library

* Fix truncation from MessageThread system message

* Add default call control bar button for creating custom call control buttons

* Fix cursor on control button labels

* Fix MessageThread hook related console errors

* Make participant pane in the chat composite optional. Disabled by default

* Make topic heading in the chat composite optional. Disabled by default

* Bugfix to prevent options menu from getting hidden every time a participant joins or leaves

* Drop duplicate thread status banner

* Fixing link on "Using Composites in a non-react environment" in Storybook

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.1...1.0.0-beta.2)

### Changes

* Updated calling sdk dependency to 1.2.0-beta.1

* Added Calling composite improvements including floating local video tile, permission banner when call is being recorded, changing local video device and microphone, and screen-sharing view improvements

* Added Chat composite improvements including notifying a participant when they leave a thread and styling improvements

* Improved Bundle size optimizations when only using chat or only using calling components

* Updated react peer dependency to >=16.8.0 <18.0.0

### Storybook pages added

* Feedback (Help us create even better components for you)
* Identity (How to get a token)
* Adapters (What are adapters for and how you use them)
* Using composites in a non-react environment

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.0.0-beta.1)

Fri, 21 May 2021 16:16:28 GMT

### Composites added

* ChatComposite
* CallingComposite

### UI Components added

* ControlBar
* Control Bar Buttons
  * CameraButton
  * EndCallButton
  * MicrophoneButton
  * DevicesButton
  * ScreenShareButton
* GridLayout
* MessageStatusIndicator
* MessageThread
* ParticipantItem
* ParticipantList
* SendBox
* TypingIndicator
* VideoTile
* VideoGallery

### Stateful Clients support added

* StatefulChatClient
* StatefulCallClient

### UsePropsFor component support added

* ControlBarButtons
* MessageThread
* ParticipantList
* SendBox
* TypingIndicator
* VideoGallery
