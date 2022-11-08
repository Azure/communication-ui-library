# Change Log - @internal/react-components

This log was last generated on Fri, 21 Oct 2022 23:01:58 GMT and should not be manually modified.

<!-- Start content -->

## [1.4.0](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.4.0)

Fri, 21 Oct 2022 23:01:58 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.3.2-beta.1...@internal/react-components_v1.4.0)

### Minor changes

- Remove onFocus callback that focuses directly on content in Chat Message. Added string for aria label of local user's message content.  ([PR #2153](https://github.com/azure/communication-ui-library/pull/2153) by miguelgamis@microsoft.com)
- changes for removing participant list button permissions and added permissions for remove participant ([PR #2225](https://github.com/azure/communication-ui-library/pull/2225) by 97124699+prabhjot-msft@users.noreply.github.com)

### Patches

- Fixed flaky file sharing tests for upload cards by awaiting file type icons ([PR #2023](https://github.com/azure/communication-ui-library/pull/2023) by 97124699+prabhjot-msft@users.noreply.github.com)
- Chat message bubble shows border in high contrast modes making each message distinguishable. ([PR #2106](https://github.com/azure/communication-ui-library/pull/2106) by anjulgarg@live.com)
- [object Object] ([PR #2165](https://github.com/azure/communication-ui-library/pull/2165) by 97124699+prabhjot-msft@users.noreply.github.com)
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
- Bump @internal/acs-ui-common to v1.4.0 ([commit](https://github.com/azure/communication-ui-library/commit/6e9b927acf587b957b60434f6ccc8265277d2434) by beachball)

### Changes

- VideoGallery consumes the participantState returned by videoGallerySelector ([PR #2143](https://github.com/azure/communication-ui-library/pull/2143) by anjulgarg@live.com)
- Introduces new component to contoso to provide help to end users struggling with device permissions in the browser. ([PR #2298](https://github.com/azure/communication-ui-library/pull/2298) by 94866715+dmceachernmsft@users.noreply.github.com)
- change dialpad content name to digit and letter ([PR #2262](https://github.com/azure/communication-ui-library/pull/2262) by carolinecao@microsoft.com)
- Localize participant state display strings in video tile ([PR #2149](https://github.com/azure/communication-ui-library/pull/2149) by anjulgarg@live.com)
- VideoTile can display a participants state such as Connecting, Ringing etc. ([PR #2210](https://github.com/azure/communication-ui-library/pull/2210) by anjulgarg@live.com)
- expose conditionally compiled  dialpad code for PSTN call ([PR #2196](https://github.com/azure/communication-ui-library/pull/2196) by carolinecao@microsoft.com)
- Add tests for PSTN and 1:N calling in the videoGallery and horizontalGallery ([PR #2176](https://github.com/azure/communication-ui-library/pull/2176) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add a new prop VideoTile.participantState for tracking a participants call connection state ([PR #2142](https://github.com/azure/communication-ui-library/pull/2142) by anjulgarg@live.com)
- Add sparkle icon to Domain Permissions component ([PR #2307](https://github.com/azure/communication-ui-library/pull/2307) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update Fluent-ui/icons package ([PR #2305](https://github.com/azure/communication-ui-library/pull/2305) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add permissions provider for different roles ([PR #2079](https://github.com/azure/communication-ui-library/pull/2079) by jiangnanhello@live.com)
- Update hold Icon size in more button in controlBars ([PR #2265](https://github.com/azure/communication-ui-library/pull/2265) by 94866715+dmceachernmsft@users.noreply.github.com)
- Changes to add remove button permissions for mobile view & hermetic tests for remove button ([PR #2244](https://github.com/azure/communication-ui-library/pull/2244) by 97124699+prabhjot-msft@users.noreply.github.com)
- updated placeholder text for dialpad ([PR #2076](https://github.com/azure/communication-ui-library/pull/2076) by carolinecao@microsoft.com)
- Hide Hold button for Rooms Call ([PR #2378](https://github.com/azure/communication-ui-library/pull/2378) by 97124699+prabhjot-msft@users.noreply.github.com)
- change label prop for device permission dropdown to be optional ([PR #2372](https://github.com/azure/communication-ui-library/pull/2372) by carolinecao@microsoft.com)
- ParticipantItem can display a participant state using `participantState` prop ([PR #2161](https://github.com/azure/communication-ui-library/pull/2161) by anjulgarg@live.com)
- Update Video Gallery to display participants in a 'Connecting' or 'Ringing' state for PSTN and 1:N calling. ([PR #2163](https://github.com/azure/communication-ui-library/pull/2163) by 94866715+dmceachernmsft@users.noreply.github.com)
- ScreenShareButton, MicrophoneButton, CameraButton, and DevicesButton no longer hooked to role permissions context. ([PR #2303](https://github.com/azure/communication-ui-library/pull/2303) by miguelgamis@microsoft.com)
- Add component behaviors according to permissions ([PR #2104](https://github.com/azure/communication-ui-library/pull/2104) by jiangnanhello@live.com)
- Introduce UI for call isntances where the browser is unsupported ([PR #2334](https://github.com/azure/communication-ui-library/pull/2334) by 94866715+dmceachernmsft@users.noreply.github.com)
- make unused exported beta interface internal, add longpress hook to detect long press and return +   ([PR #2260](https://github.com/azure/communication-ui-library/pull/2260) by carolinecao@microsoft.com)
- Create error bar to display troubleshooting links for network/device permission errors ([PR #2345](https://github.com/azure/communication-ui-library/pull/2345) by carolinecao@microsoft.com)
- Update PSTN Gallery behavior to not use complex logic for participants being dialed into the call. ([PR #2237](https://github.com/azure/communication-ui-library/pull/2237) by 94866715+dmceachernmsft@users.noreply.github.com)
- Delete button added to the Dialpad ([PR #2085](https://github.com/azure/communication-ui-library/pull/2085) by carolinecao@microsoft.com)
- Add disabled option for CallWithChat control bar buttons ([PR #2294](https://github.com/azure/communication-ui-library/pull/2294) by edwardlee@microsoft.com)
- Introduces showFormatting prop to dialpad component to disable our provided formatting. ([PR #2288](https://github.com/azure/communication-ui-library/pull/2288) by 94866715+dmceachernmsft@users.noreply.github.com)
- removed ondisplaydialpadinput, add textFieldValue for contoso to directly set the value inside textfield ([PR #2281](https://github.com/azure/communication-ui-library/pull/2281) by carolinecao@microsoft.com)
- Fixes typing issues with the hold button strings ([PR #2197](https://github.com/azure/communication-ui-library/pull/2197) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added devicePermissionDropdown component ([PR #2367](https://github.com/azure/communication-ui-library/pull/2367) by carolinecao@microsoft.com)
- Icon change of speaker button for consumer ([PR #2340](https://github.com/azure/communication-ui-library/pull/2340) by 97124699+prabhjot-msft@users.noreply.github.com)
- Add isMobile to dialpad so dialpad can handle mobile and web clicks differently ([PR #2283](https://github.com/azure/communication-ui-library/pull/2283) by carolinecao@microsoft.com)
- Add remove participant menu item for participant item if role allows. ([PR #2328](https://github.com/azure/communication-ui-library/pull/2328) by miguelgamis@microsoft.com)
- VideoGallery does not show local video tile if no permissions camera ([PR #2349](https://github.com/azure/communication-ui-library/pull/2349) by miguelgamis@microsoft.com)
- Introduce Hermetic tests for the unsupportedEnvironmentPage in the Call Composite ([PR #2387](https://github.com/azure/communication-ui-library/pull/2387) by 94866715+dmceachernmsft@users.noreply.github.com)
- BrowserPermissionDenied Components created ([PR #2382](https://github.com/azure/communication-ui-library/pull/2382) by edwardlee@microsoft.com)
- modify dropdown props to include askDevicePermission ([PR #2389](https://github.com/azure/communication-ui-library/pull/2389) by carolinecao@microsoft.com)

## [1.3.0](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.3.0)

Mon, 13 Jun 2022 18:29:26 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.2.2-beta.1...@internal/react-components_v1.3.0)

### Minor changes

- Show a loading spinner when remote video stream is loading ([PR #1954](https://github.com/azure/communication-ui-library/pull/1954) by chwhilar@microsoft.com)
- Support updateScalingMode in the VideoGallery to avoid having to destroy and recreate the stream when the localVideoViewOption scaling mode is changed ([PR #1890](https://github.com/azure/communication-ui-library/pull/1890) by 2684369+JamesBurnside@users.noreply.github.com)
- Announce when microphone is turned on/off and video is turned on/off to screen readers and narrator tools ([PR #1772](https://github.com/azure/communication-ui-library/pull/1772) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Fix support for onDisposeLocalStreamView in `VideoGallery` ([PR #1866](https://github.com/azure/communication-ui-library/pull/1866) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed theming of links for html and richtext/html messages in MessageThread. ([PR #1824](https://github.com/azure/communication-ui-library/pull/1824) by miguelgamis@microsoft.com)
- Added error text color in light and dark themes in semanticColors property. ([PR #1861](https://github.com/azure/communication-ui-library/pull/1861) by 79475487+mgamis-msft@users.noreply.github.com)
- Revert directly calling updateScalingMode in the VideoGallery VideoTiles ([PR #1957](https://github.com/azure/communication-ui-library/pull/1957) by 2684369+JamesBurnside@users.noreply.github.com)
- Change Microphone Contextual Menu header text to Audio Device when no speakers are detected ([PR #1883](https://github.com/azure/communication-ui-library/pull/1883) by edwardlee@microsoft.com)
- when there is no menu items, participant item should not be clickable ([PR #1844](https://github.com/azure/communication-ui-library/pull/1844) by carolinecao@microsoft.com)
- Fix inverted host element when local video plays in picture-in-picture window ([PR #1933](https://github.com/azure/communication-ui-library/pull/1933) by 82062616+prprabhu-ms@users.noreply.github.com)
- Support updateScalingMode with remote video tiles ([PR #1907](https://github.com/azure/communication-ui-library/pull/1907) by 2684369+JamesBurnside@users.noreply.github.com)
- Add split button aria labels to the microphone and camera buttons. Remove the aria-role of menu from the split buttons. ([PR #1829](https://github.com/azure/communication-ui-library/pull/1829) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fixed chat status not annoucing on voice over on iphone bug ([PR #1939](https://github.com/azure/communication-ui-library/pull/1939) by 96077406+carocao-msft@users.noreply.github.com)
- Delay consecutive messages in _ComplianceBanner to give user time to read the message ([PR #1878](https://github.com/azure/communication-ui-library/pull/1878) by 82062616+prprabhu-ms@users.noreply.github.com)
- filecard should be clickable, also in mobile view when waiting in lobby, make more button disabled ([PR #1886](https://github.com/azure/communication-ui-library/pull/1886) by carolinecao@microsoft.com)
- Disable hover behavior when no content in sendBox ([PR #1534](https://github.com/azure/communication-ui-library/pull/1534) by jiangnanhello@live.com)
- add placeholder participant name for unnamed participants ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by carolinecao@microsoft.com)
- Code refactor: Update remote video tile to use the useVideoStreamLifecycleMaintainer ([PR #1906](https://github.com/azure/communication-ui-library/pull/1906) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix local preview in the VideoGallery not re-rendering when localVideoViewOptions property changed ([PR #1841](https://github.com/azure/communication-ui-library/pull/1841) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix tab ordering of the New Messages button in the Chat Composite ([PR #1961](https://github.com/azure/communication-ui-library/pull/1961) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)

### Changes

- Added unit test for dialpad, disabled customization for dialpad content, allowed format customization ([PR #1937](https://github.com/azure/communication-ui-library/pull/1937) by carolinecao@microsoft.com)
- Allow sending message without text if the sendbox contains an error free active file upload. ([PR #1814](https://github.com/azure/communication-ui-library/pull/1814) by anjulgarg@live.com)
- Allow removal of files when editing a message  ([PR #1872](https://github.com/azure/communication-ui-library/pull/1872) by anjulgarg@live.com)
- File download cards to use fileMetadata extension instead of parsing it from filename ([PR #1850](https://github.com/azure/communication-ui-library/pull/1850) by anjulgarg@live.com)
- Added max height and scroll to file uploads as it was covering entire screen ([PR #1918](https://github.com/azure/communication-ui-library/pull/1918) by 97124699+prabhjot-msft@users.noreply.github.com)
- Created dialpad component ([PR #1870](https://github.com/azure/communication-ui-library/pull/1870) by carolinecao@microsoft.com)
- Added new prop onDisplayDateTimeString to both messagethread and locale to allow custom date/time format on component and composite level ([PR #1863](https://github.com/azure/communication-ui-library/pull/1863) by carolinecao@microsoft.com)
- Added Icon button for upload button, cancel file upload icon and download icon to make it tab navigable ([PR #1881](https://github.com/azure/communication-ui-library/pull/1881) by 97124699+prabhjot-msft@users.noreply.github.com)
- Attached files are shown while editing a message. ([PR #1864](https://github.com/azure/communication-ui-library/pull/1864) by anjulgarg@live.com)
- Add hold button with strings and icons ([PR #1919](https://github.com/azure/communication-ui-library/pull/1919) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.2.0](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.2.0)

Fri, 11 Mar 2022 19:20:02 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.1.1-beta.1...@internal/react-components_v1.2.0)

### Minor changes

- Switch CallWithChat from Beta to Public and Stable ([PR #1612](https://github.com/azure/communication-ui-library/pull/1612) by edwardlee@microsoft.com)
- Introduce new version of local video tile to address accessibility issues. ([PR #1542](https://github.com/azure/communication-ui-library/pull/1542) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added ParticipantList prop onParticipantClick and ParticipantItem prop onClick. ([PR #1515](https://github.com/azure/communication-ui-library/pull/1515) by miguelgamis@microsoft.com)

### Patches

- Updated PictureInPictureInPicture container styles display property. ([PR #1540](https://github.com/azure/communication-ui-library/pull/1540) by miguelgamis@microsoft.com)
- Fix ChatMessageActionFlyout useMemo to include exhaustive dependencies to prevent missed re-renders on prop updates ([PR #1597](https://github.com/azure/communication-ui-library/pull/1597) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix img size for style defined element ([PR #1588](https://github.com/azure/communication-ui-library/pull/1588) by jiangnanhello@live.com)
- Update ControlBarButton to read aria strings from other string sources ([PR #1614](https://github.com/azure/communication-ui-library/pull/1614) by 94866715+dmceachernmsft@users.noreply.github.com)
- Mobile Participant pane now spans full sidepane width ([PR #1589](https://github.com/azure/communication-ui-library/pull/1589) by edwardlee@microsoft.com)
- Fix ChatMessage border color when editing a message to show inactive colors when not active ([PR #1583](https://github.com/azure/communication-ui-library/pull/1583) by 2684369+JamesBurnside@users.noreply.github.com)
- Prevent chat message flyout randomly closing itself by setting preventDismissOnResize property on the chat message flyout ([PR #1573](https://github.com/azure/communication-ui-library/pull/1573) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix SendBox position shift when border size changes. Update sendbox coloring to use theme.primary instead of theme.blue ([PR #1584](https://github.com/azure/communication-ui-library/pull/1584) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix: do not allow sending empty messages when editing chat messages ([PR #1575](https://github.com/azure/communication-ui-library/pull/1575) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)

### Changes

- Add SendboxErrorBar with timeout for showing file upload errors in SendBox ([PR #1578](https://github.com/azure/communication-ui-library/pull/1578) by anjulgarg@live.com)
- Show error above sendbox if message is sent before all files are uploaded. ([PR #1593](https://github.com/azure/communication-ui-library/pull/1593) by anjulgarg@live.com)
- Show loader in File card until file download promise is resolved ([PR #1574](https://github.com/azure/communication-ui-library/pull/1574) by 97124699+prabhjot-msft@users.noreply.github.com)
- Show file upload errors above sendbox in Composites containing Chat features ([PR #1554](https://github.com/azure/communication-ui-library/pull/1554) by 97124699+prabhjot-msft@users.noreply.github.com)
- Add default implementation of file upload UI to SendBox ([PR #1595](https://github.com/azure/communication-ui-library/pull/1595) by 97124699+prabhjot-msft@users.noreply.github.com)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.1)

Mon, 24 Jan 2022 23:18:54 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.1...@internal/react-components_v1.0.1)

### Minor changes

- Added strings to the side pane from locale context. ([PR #1278](https://github.com/azure/communication-ui-library/pull/1278) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Fixed inability to click the horizontal gallery left/right button by changing pointerEvents of LayerHost. ([PR #1293](https://github.com/azure/communication-ui-library/pull/1293) by kaurprabhjot@microsoft.com)
- Fixed ScreenShareButton style to allow custom styles ([PR #1286](https://github.com/azure/communication-ui-library/pull/1286) by edwardlee@microsoft.com)
- Small code modifications for conditional build 1. Conditional build does not support <Type*> convert, use `foo as Bar` 2. Add a hook to bypass type error when build meeting composite ([PR #1284](https://github.com/azure/communication-ui-library/pull/1284) by jinan@microsoft.com)
- Horizontal gallery button height fixed ([PR #1285](https://github.com/azure/communication-ui-library/pull/1285) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fixed alignment of typing indicator in chat composite by reducing minHeight. ([PR #1297](https://github.com/azure/communication-ui-library/pull/1297) by kaurprabhjot@microsoft.com)
- Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
- Bump @internal/acs-ui-common to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.1)

Tue, 04 Jan 2022 22:57:09 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0...@internal/react-components_v1.0.1)

### Minor changes

- New aria label string added for `SendBox`. New property added to `SendBox` to autofocus on mount. ([PR #1235](https://github.com/azure/communication-ui-library/pull/1235) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add tooltipVideoLoadingContent to Camera strings ([PR #1253](https://github.com/azure/communication-ui-library/pull/1253) by alcail@microsoft.com)
- add aria-label strings to MessageStatusIndicator ([PR #1247](https://github.com/azure/communication-ui-library/pull/1247) by alcail@microsoft.com)

### Patches

- Allow focus on control bar button when disabled ([PR #1251](https://github.com/azure/communication-ui-library/pull/1251) by alcail@microsoft.com)
- Added aria roles to the different menu props. ([PR #1227](https://github.com/azure/communication-ui-library/pull/1227) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bug Fix: Ensure TypingIndicator correctly displays the number of users ([PR #1248](https://github.com/azure/communication-ui-library/pull/1248) by alcail@microsoft.com)
- Bump @internal/acs-ui-common to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)

## [1.0.0](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0)

Mon, 06 Dec 2021 19:41:59 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0-beta.8..@internal/react-components_v1.0.0)

### Changes

- Reduce VideoGallery persona size ([PR #1129](https://github.com/azure/communication-ui-library/pull/1129) by 2684369+JamesBurnside@users.noreply.github.com)
- VideoGallery has unique identifier for local video tile to dock. ([PR #1111](https://github.com/azure/communication-ui-library/pull/1111) by miguelgamis@microsoft.com)
- Local video tile no longer draggable ([PR #1163](https://github.com/azure/communication-ui-library/pull/1163) by miguelgamis@microsoft.com)
- Fix 'New Messages' not clearing when the user scrolls to the bottom of the message thread' ([PR #1115](https://github.com/azure/communication-ui-library/pull/1115) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove long press gesture on MessageThread messages ([PR #1118](https://github.com/azure/communication-ui-library/pull/1118) by 2684369+JamesBurnside@users.noreply.github.com)
- Update stop screen sharing label from stop to stop sharing ([PR #1164](https://github.com/azure/communication-ui-library/pull/1164) by 2684369+JamesBurnside@users.noreply.github.com)
- Set pagesize to 50 to fix thread incomplete ([PR #1183](https://github.com/azure/communication-ui-library/pull/1183) by jinan@microsoft.com)
- TDBuild - updating localized resource files. ([PR #1211](https://github.com/azure/communication-ui-library/pull/1211) by miguelgamis@microsoft.com)
- Do not dismiss ParticipantsButtton and DevicesButton Callout on resize events ([PR #1138](https://github.com/azure/communication-ui-library/pull/1138) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bugfix for vertically truncated participant names ([PR #1145](https://github.com/azure/communication-ui-library/pull/1145) by anjulgarg@live.com)
- Dispose video when video tile gets unmounted ([PR #1198](https://github.com/azure/communication-ui-library/pull/1198) by jinan@microsoft.com)
- Change name contains option to options ([PR #1173](https://github.com/azure/communication-ui-library/pull/1173) by jinan@microsoft.com)
- Screenshare rerender fixed. ([PR #1175](https://github.com/azure/communication-ui-library/pull/1175) by miguelgamis@microsoft.com)
- add tooltip string for disabled ControlBar buttons ([PR #1166](https://github.com/azure/communication-ui-library/pull/1166) by alcail@microsoft.com)
- Add Scrollbar when editing message in chat ([PR #1158](https://github.com/azure/communication-ui-library/pull/1158) by anjulgarg@live.com)
- Fixed gap betwen GridLayout and HorizontalGallery for Safari on IPhone SE. ([PR #1162](https://github.com/azure/communication-ui-library/pull/1162) by miguelgamis@microsoft.com)
- Ensure typing indicator wraps correctly with long names ([PR #1123](https://github.com/azure/communication-ui-library/pull/1123) by 2684369+JamesBurnside@users.noreply.github.com)
- Update screenshare button background when active ([PR #1178](https://github.com/azure/communication-ui-library/pull/1178) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix text in system messages in the MessageThread to wrap when it is too long. ([PR #1120](https://github.com/azure/communication-ui-library/pull/1120) by 2684369+JamesBurnside@users.noreply.github.com)
- TDBuild - updating localized resource files. ([PR #1197](https://github.com/azure/communication-ui-library/pull/1197) by miguelgamis@microsoft.com)
- bugfix: Prevent participant remove flyout dismissal on resize events ([PR #1156](https://github.com/azure/communication-ui-library/pull/1156) by 82062616+prprabhu-ms@users.noreply.github.com)
- GridLayoutProp styles prop type changed to GridLayoutStyles ([PR #1196](https://github.com/azure/communication-ui-library/pull/1196) by miguelgamis@microsoft.com)