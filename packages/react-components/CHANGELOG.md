# Change Log - @internal/react-components

This log was last generated on Thu, 20 Oct 2022 20:49:50 GMT and should not be manually modified.

<!-- Start content -->

## [1.3.2-beta.2](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.3.2-beta.2)

Thu, 20 Oct 2022 20:49:50 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.3.2-beta.1...@internal/react-components_v1.3.2-beta.2)

### Patches

- Fix VideoGallery showing video spinners when the CallComposites are disconnecting from a call.  ([PR #2400](https://github.com/azure/communication-ui-library/pull/2400) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.3.2-beta.2 ([PR #2413](https://github.com/azure/communication-ui-library/pull/2413) by beachball)

## [1.3.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.3.2-beta.1)

Wed, 05 Oct 2022 18:13:46 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.3.1-beta.1...@internal/react-components_v1.3.2-beta.1)

### Minor changes

- Remove onFocus callback that focuses directly on content in Chat Message. Added string for aria label of local user's message content.  ([PR #2153](https://github.com/azure/communication-ui-library/pull/2153) by miguelgamis@microsoft.com)
- changes for removing participant list button permissions and added permissions for remove participant ([PR #2225](https://github.com/azure/communication-ui-library/pull/2225) by 97124699+prabhjot-msft@users.noreply.github.com)

### Patches

- Replace floating div with border with inset border of video tile to show user is speaking. ([PR #2236](https://github.com/azure/communication-ui-library/pull/2236) by miguelgamis@microsoft.com)
- correctly setting maxHeight for people context menu ([PR #2034](https://github.com/azure/communication-ui-library/pull/2034) by 79329532+alkwa-msft@users.noreply.github.com)
- Export Announcer component to be used internally. ([PR #2289](https://github.com/azure/communication-ui-library/pull/2289) by 94866715+dmceachernmsft@users.noreply.github.com)
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
- Bump @internal/acs-ui-common to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)

### Changes

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
- VideoGallery does not show local video tile if no permissions camera ([PR #2349](https://github.com/azure/communication-ui-library/pull/2349) by miguelgamis@microsoft.com)
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

## [1.3.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.3.1-beta.1)

Wed, 29 Jun 2022 17:31:05 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.3.0...@internal/react-components_v1.3.1-beta.1)

### Minor changes

- Add strings for new UFDs for microphone stopped unexpectedly and microphone recovered ([PR #1994](https://github.com/azure/communication-ui-library/pull/1994) by 2684369+JamesBurnside@users.noreply.github.com)
- Update string types and names per comments from ARB ([PR #2009](https://github.com/azure/communication-ui-library/pull/2009) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Fixes spacing for text in errorbar component ([PR #2003](https://github.com/azure/communication-ui-library/pull/2003) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix SendBox button when using VoiceOver on iOS ([PR #2004](https://github.com/azure/communication-ui-library/pull/2004) by miguelgamis@microsoft.com)
- Update microphone button to be disabled when there are no microphones present ([PR #1993](https://github.com/azure/communication-ui-library/pull/1993) by 2684369+JamesBurnside@users.noreply.github.com)
- Update ErrorBar to accept strings and icons for the cameraStoppedUnexpectedly call diagnostic ([PR #1991](https://github.com/azure/communication-ui-library/pull/1991) by 2684369+JamesBurnside@users.noreply.github.com)
- disable tooltip for persona ([PR #1990](https://github.com/azure/communication-ui-library/pull/1990) by carolinecao@microsoft.com)
- Making tooltips inline-block to prevent sizing and positioning issues in read receipts ([PR #2005](https://github.com/azure/communication-ui-library/pull/2005) by anjulgarg@live.com)
- Bump @internal/acs-ui-common to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)

### Changes

- Add new prop onChange to dialpad to grab textfield values and modified onClickDialpadButton type to (buttonValue: string, buttonIndex: number) => void so we can grab info regarding which button is clicked ([PR #1989](https://github.com/azure/communication-ui-library/pull/1989) by carolinecao@microsoft.com)
- Fix loading spinner size in small containers ([PR #1995](https://github.com/azure/communication-ui-library/pull/1995) by 2684369+JamesBurnside@users.noreply.github.com)
- Make file sharing narrator compliant. Components contain aria labels and announcer ([PR #1960](https://github.com/azure/communication-ui-library/pull/1960) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update fluentui/react version ([PR #1979](https://github.com/azure/communication-ui-library/pull/1979) by carolinecao@microsoft.com)

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

## [1.2.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.2.2-beta.1)

Tue, 19 Apr 2022 20:46:16 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.2.0...@internal/react-components_v1.2.2-beta.1)

### Minor changes

- Introduce strings for the new modal controls. ([PR #1718](https://github.com/azure/communication-ui-library/pull/1718) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Update fluent-northstar dependency to 0.61.0 to fix conflict on react peer dependencies ([PR #1632](https://github.com/azure/communication-ui-library/pull/1632) by 2684369+JamesBurnside@users.noreply.github.com)
- Add aria-label for ChatMessageActionMenu button ([PR #1760](https://github.com/azure/communication-ui-library/pull/1760) by edwardlee@microsoft.com)
- Add aria description to indicate selected camera in LocalVideoCameraButton ([PR #1794](https://github.com/azure/communication-ui-library/pull/1794) by edwardlee@microsoft.com)
- Fixes styles to remove undesired scroll bar in context menus on messages. ([PR #1675](https://github.com/azure/communication-ui-library/pull/1675) by 94866715+dmceachernmsft@users.noreply.github.com)
- add data-ui-id to message tooltips and contextual menu for ui tests, also sort read receipt list for contextual menu ([PR #1759](https://github.com/azure/communication-ui-library/pull/1759) by carolinecao@microsoft.com)
- Use fela style selector ([PR #1655](https://github.com/azure/communication-ui-library/pull/1655) by jiangnanhello@live.com)
- Memoize chat bubble to avoid unnecessary re-render ([PR #1698](https://github.com/azure/communication-ui-library/pull/1698) by jiangnanhello@live.com)
- Left align participant pane elements in mobile and desktop ([PR #1671](https://github.com/azure/communication-ui-library/pull/1671) by edwardlee@microsoft.com)
- Prevent prevent picture in picture from going out of screen when window is resized ([PR #1781](https://github.com/azure/communication-ui-library/pull/1781) by 2684369+JamesBurnside@users.noreply.github.com)
- Set menu role for Split Buttons in controlBar ([PR #1782](https://github.com/azure/communication-ui-library/pull/1782) by edwardlee@microsoft.com)
- Add tab index to local video tile through a wrapper to allow keyboard navigation of the modal controls. ([PR #1716](https://github.com/azure/communication-ui-library/pull/1716) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fixes styles for local camera switcher for better visibility on white backdrops. ([PR #1767](https://github.com/azure/communication-ui-library/pull/1767) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix A11y bug where user cannot keyboard outside of local video preview ([PR #1623](https://github.com/azure/communication-ui-library/pull/1623) by 2684369+JamesBurnside@users.noreply.github.com)
- bugfix: Update readBy count for messages when `mobileView` is set ([PR #1746](https://github.com/azure/communication-ui-library/pull/1746) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix chevron alignment issues on message read receipt flyout. ([PR #1701](https://github.com/azure/communication-ui-library/pull/1701) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix floating local video tile going offscreen in the VideoGallery Component ([PR #1725](https://github.com/azure/communication-ui-library/pull/1725) by 2684369+JamesBurnside@users.noreply.github.com)
- New Aria-labels added for screen reader accessibility on ErrorBar and MessageThread ([PR #1735](https://github.com/azure/communication-ui-library/pull/1735) by edwardlee@microsoft.com)
- Changed the participant item container styles to check if participant is the user and prevent cursor change. ([PR #1690](https://github.com/azure/communication-ui-library/pull/1690) by 94866715+dmceachernmsft@users.noreply.github.com)
- Set overflow to hidden in PiPiP (only currently impacting end to end tests) ([PR #1761](https://github.com/azure/communication-ui-library/pull/1761) by 2684369+JamesBurnside@users.noreply.github.com)
- fixed bug when deleting failed to send messages ([PR #1780](https://github.com/azure/communication-ui-library/pull/1780) by carolinecao@microsoft.com)
- Add joincall failure strings to ErrorBar component ([PR #1788](https://github.com/azure/communication-ui-library/pull/1788) by 2684369+JamesBurnside@users.noreply.github.com)
- Update styles on new modal to use rem not px for border thickness. ([PR #1738](https://github.com/azure/communication-ui-library/pull/1738) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update chat message action button icon styles: increase contrast in dark mode for MessageThread and Chat Composites. Make icon customizable. ([PR #1798](https://github.com/azure/communication-ui-library/pull/1798) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)

### Changes

- Added resend button to contextual menu ([PR #1676](https://github.com/azure/communication-ui-library/pull/1676) by carolinecao@microsoft.com)
- change color for chat bubbles : blue when successfully sent and red when failed, added failed tag ([PR #1681](https://github.com/azure/communication-ui-library/pull/1681) by carolinecao@microsoft.com)
- fetch read receipt when participant join the chat, also not show read receipt info when having more than 20 participant ([PR #1639](https://github.com/azure/communication-ui-library/pull/1639) by carolinecao@microsoft.com)
- Bugfix for inconsistent fileupload sendbox errors ([PR #1673](https://github.com/azure/communication-ui-library/pull/1673) by anjulgarg@live.com)
- Add default file download renderers to MessageThread ([PR #1790](https://github.com/azure/communication-ui-library/pull/1790) by anjulgarg@live.com)
- Preventing text wrapping in file card due to long file names ([PR #1651](https://github.com/azure/communication-ui-library/pull/1651) by anjulgarg@live.com)
- Bugfix for text wrapping onto next line in file card ([PR #1684](https://github.com/azure/communication-ui-library/pull/1684) by anjulgarg@live.com)
- API fix: Hide FileSharing API from stable build ([PR #1744](https://github.com/azure/communication-ui-library/pull/1744) by 82062616+prprabhu-ms@users.noreply.github.com)
- Making File Card consistent with Figma Designs ([PR #1765](https://github.com/azure/communication-ui-library/pull/1765) by anjulgarg@live.com)
- calculate read number and who has read the message on hover tooltip or on click action menu ([PR #1691](https://github.com/azure/communication-ui-library/pull/1691) by carolinecao@microsoft.com)
- FileCard: Do not show progress bar when progress is 0 ([PR #1622](https://github.com/azure/communication-ui-library/pull/1622) by anjulgarg@live.com)
- Introduces A11y strings for aria-roles for control bar buttons. ([PR #1628](https://github.com/azure/communication-ui-library/pull/1628) by 94866715+dmceachernmsft@users.noreply.github.com)

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

## [1.1.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.1.1-beta.1)

Tue, 01 Mar 2022 16:42:57 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.1...@internal/react-components_v1.1.1-beta.1)

### Minor changes

- created button component for local video feed camera switcher ([PR #1367](https://github.com/azure/communication-ui-library/pull/1367) by 94866715+dmceachernmsft@users.noreply.github.com)
- TDBuild - updating localized resource files. ([PR #1435](https://github.com/azure/communication-ui-library/pull/1435) by miguelgamis@microsoft.com)
- Update disabled state from false boolean to string value 'disabled' ([PR #1518](https://github.com/azure/communication-ui-library/pull/1518) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add metadata attribute to ChatMessage type ([PR #1374](https://github.com/azure/communication-ui-library/pull/1374) by anjulgarg@live.com)
- Identifiers added for HorizontalGallery left and right navigation buttons. ([PR #1347](https://github.com/azure/communication-ui-library/pull/1347) by miguelgamis@microsoft.com)
- Add data ui id to local Camera switcher button ([PR #1487](https://github.com/azure/communication-ui-library/pull/1487) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Update wording of labels for ScreenShareButton ([PR #1472](https://github.com/azure/communication-ui-library/pull/1472) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add tooltip to inputBox buttons ([PR #1506](https://github.com/azure/communication-ui-library/pull/1506) by jiangnanhello@live.com)
- Update string from remove to delete ([PR #1434](https://github.com/azure/communication-ui-library/pull/1434) by jiangnanhello@live.com)
- Limit image size from html ([PR #1490](https://github.com/azure/communication-ui-library/pull/1490) by jiangnanhello@live.com)
- Fix IME keyboard inputs for Safari using KeyCode and which properties. ([PR #1513](https://github.com/azure/communication-ui-library/pull/1513) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bugfix for messages from teams users having extra margins around the message content. ([PR #1507](https://github.com/azure/communication-ui-library/pull/1507) by jiangnanhello@live.com)
- Moved Avatars icons to the left of messages by not displaying usernames in Storybook MessageThread ([PR #1345](https://github.com/azure/communication-ui-library/pull/1345) by edwardlee@microsoft.com)
- Fix EndCallButton theme colors for better contrast ([PR #1471](https://github.com/azure/communication-ui-library/pull/1471) by 82062616+prprabhu-ms@users.noreply.github.com)
- MoreDrawer secondaryText maxWidth set to prevent overlap ([PR #1532](https://github.com/azure/communication-ui-library/pull/1532) by edwardlee@microsoft.com)
- Allow setting min and max size of the persona avatar in the Video Tile ([PR #1406](https://github.com/azure/communication-ui-library/pull/1406) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)

### Changes

- Fix typo: `CamerSwitcher` -> `CameraSwitcher` ([PR #1529](https://github.com/azure/communication-ui-library/pull/1529) by 2684369+JamesBurnside@users.noreply.github.com)
- Showing how many people have read the message, sending read receipt to all previous messages  ([PR #1407](https://github.com/azure/communication-ui-library/pull/1407) by 96077406+carocao-msft@users.noreply.github.com)
- Rename MeetingComposite to CallWithChatComposite ([PR #1446](https://github.com/azure/communication-ui-library/pull/1446) by 2684369+JamesBurnside@users.noreply.github.com)
- Meeting/CallComposite: introduces camera logic to local camera switcher button through video gallery selector. ([PR #1393](https://github.com/azure/communication-ui-library/pull/1393) by 94866715+dmceachernmsft@users.noreply.github.com)
- DrawerSurface Component ([PR #1460](https://github.com/azure/communication-ui-library/pull/1460) by 2684369+JamesBurnside@users.noreply.github.com)
- submenu showing who read the message (name and avatar) ([PR #1493](https://github.com/azure/communication-ui-library/pull/1493) by carolinecao@microsoft.com)
- Fixed Editbox border which disappeared after adding file sharing changes ([PR #1523](https://github.com/azure/communication-ui-library/pull/1523) by 97124699+prabhjot-msft@users.noreply.github.com)
- Add a prop onRenderFileUploads for rendering uploaded files in sendbox ([PR #1421](https://github.com/azure/communication-ui-library/pull/1421) by 97124699+prabhjot-msft@users.noreply.github.com)
- contextual menu showing read by x of y ([PR #1482](https://github.com/azure/communication-ui-library/pull/1482) by carolinecao@microsoft.com)
- Add ability to set a custom icon at the End of a Drawer Menu Item ([PR #1498](https://github.com/azure/communication-ui-library/pull/1498) by 2684369+JamesBurnside@users.noreply.github.com)
- Add option to show device selection menu in MicrophoneButton ([PR #1392](https://github.com/azure/communication-ui-library/pull/1392) by 82062616+prprabhu-ms@users.noreply.github.com)
- Updated the message thread component to display attached files in a message. ([PR #1494](https://github.com/azure/communication-ui-library/pull/1494) by 97124699+prabhjot-msft@users.noreply.github.com)
- Introduced new Aria strings and roles to chat notification and local camera switcher. ([PR #1429](https://github.com/azure/communication-ui-library/pull/1429) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add DrawerMenu component ([PR #1462](https://github.com/azure/communication-ui-library/pull/1462) by 2684369+JamesBurnside@users.noreply.github.com)
- Add secondary text field to Drawer Menu Item ([PR #1501](https://github.com/azure/communication-ui-library/pull/1501) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix drawer menu items' content not updating dynamically while the menu is open when props are updated. ([PR #1520](https://github.com/azure/communication-ui-library/pull/1520) by 2684369+JamesBurnside@users.noreply.github.com)
- A11y fixes for DrawerMenu component ([PR #1473](https://github.com/azure/communication-ui-library/pull/1473) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix DrawerMenu MenuItem Icons to be vertically centered ([PR #1528](https://github.com/azure/communication-ui-library/pull/1528) by 2684369+JamesBurnside@users.noreply.github.com)
- Logic introduced to cause local camera switcher to appear on mobile. ([PR #1391](https://github.com/azure/communication-ui-library/pull/1391) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add camera selection menu to CameraButton ([PR #1436](https://github.com/azure/communication-ui-library/pull/1436) by 82062616+prprabhu-ms@users.noreply.github.com)
- Support submenu in DrawerMenu ([PR #1469](https://github.com/azure/communication-ui-library/pull/1469) by 2684369+JamesBurnside@users.noreply.github.com)

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

## [1.0.0-beta.8](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.8)

Wed, 17 Nov 2021 22:21:27 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0-beta.7..@internal/react-components_v1.0.0-beta.8)

### Changes

- added ariaLabel in InputBoxButtonProps and strings for EditBox buttons in MessageThreadStrings ([PR #1025](https://github.com/azure/communication-ui-library/pull/1025) by alcail@microsoft.com)
- update snapshot for test ([PR #1040](https://github.com/azure/communication-ui-library/pull/1040) by jinan@microsoft.com)
- Fix remote video border not flush with isSpeaking indicator ([PR #1045](https://github.com/azure/communication-ui-library/pull/1045) by anjulgarg@live.com)
- HorizontalGallery not showing page navigation buttons if all participants can fit. ([PR #1069](https://github.com/azure/communication-ui-library/pull/1069) by miguelgamis@microsoft.com)
- Update localized strings for components and composites ([PR #1047](https://github.com/azure/communication-ui-library/pull/1047) by anjulgarg@live.com)
- Add support for opening chat message context menu with a long touch press ([PR #1019](https://github.com/azure/communication-ui-library/pull/1019) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix remote video streams in VideoGallery when screensharing is active. ([PR #1032](https://github.com/azure/communication-ui-library/pull/1032) by miguelgamis@microsoft.com)
- Fix text in video tile label to no longer be translucent ([PR #1058](https://github.com/azure/communication-ui-library/pull/1058) by 2684369+JamesBurnside@users.noreply.github.com)
- Expose participant list styling through the participant button interface ([PR #990](https://github.com/azure/communication-ui-library/pull/990) by 2684369+JamesBurnside@users.noreply.github.com)
- Improved responsive experience when editing messages in the message thread ([PR #1036](https://github.com/azure/communication-ui-library/pull/1036) by 2684369+JamesBurnside@users.noreply.github.com)
- fixing send button dimensions to respect icon dimensions ([PR #1082](https://github.com/azure/communication-ui-library/pull/1082) by 79329532+alkwa-msft@users.noreply.github.com)
- Add ErrorBar message types for missing device permissions ([PR #1031](https://github.com/azure/communication-ui-library/pull/1031) by 82062616+prprabhu-ms@users.noreply.github.com)
- Ensure message thread links open in a new tab ([PR #1101](https://github.com/azure/communication-ui-library/pull/1101) by 2684369+JamesBurnside@users.noreply.github.com)
- Update participantButton interface to have required properties for participant list directly instead of extending a participantList interface directly ([PR #988](https://github.com/azure/communication-ui-library/pull/988) by 2684369+JamesBurnside@users.noreply.github.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)
- VideoTile displayName text padding added all around. ([PR #1070](https://github.com/azure/communication-ui-library/pull/1070) by miguelgamis@microsoft.com)
- Fix for preventing video resize when isSpeaking indicator appears ([PR #1052](https://github.com/azure/communication-ui-library/pull/1052) by anjulgarg@live.com)
- Updated VideoGalleryStyles, HorizontalGalleryStyles. Added GridLayoutStyles. ([PR #1093](https://github.com/azure/communication-ui-library/pull/1093) by miguelgamis@microsoft.com)
- Scale down icon to fit ErrorBar size ([PR #1043](https://github.com/azure/communication-ui-library/pull/1043) by 82062616+prprabhu-ms@users.noreply.github.com)
- centralized localization utils to acs-ui-common ([PR #974](https://github.com/azure/communication-ui-library/pull/974) by alcail@microsoft.com)
- Uniformly capitalize icon names and fix intellisense ([PR #1054](https://github.com/azure/communication-ui-library/pull/1054) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add showLabel props to VideoTile. Do not show local preview VideoTile label when the video gallery is narrow. ([PR #1048](https://github.com/azure/communication-ui-library/pull/1048) by 2684369+JamesBurnside@users.noreply.github.com)
- Add local and remote screensharing views into the VideoGallery component. ([PR #999](https://github.com/azure/communication-ui-library/pull/999) by miguelgamis@microsoft.com)
- Support disabling menu to remove participants from roster ([PR #1035](https://github.com/azure/communication-ui-library/pull/1035) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add tooltips to control bar buttons ([PR #1077](https://github.com/azure/communication-ui-library/pull/1077) by 2684369+JamesBurnside@users.noreply.github.com)
- ensuring edit/delete context menu is adjacent to its corresponding message ([PR #1100](https://github.com/azure/communication-ui-library/pull/1100) by 79329532+alkwa-msft@users.noreply.github.com)
- Add more error types to ErrorBar ([PR #1008](https://github.com/azure/communication-ui-library/pull/1008) by 82062616+prprabhu-ms@users.noreply.github.com)
- VideoTile label text truncation on overflow.  ([PR #1059](https://github.com/azure/communication-ui-library/pull/1059) by miguelgamis@microsoft.com)
- Add more data-ui-id tags for e2e tests ([PR #982](https://github.com/azure/communication-ui-library/pull/982) by 82062616+prprabhu-ms@users.noreply.github.com)
- removed InputBoxButtonProps from public API and updated onRenderIcon in SendBox component ([PR #1033](https://github.com/azure/communication-ui-library/pull/1033) by alcail@microsoft.com)
- Improve the styling of the message thread when at narrow width - partially float the avatar on the padding of the message. ([PR #1013](https://github.com/azure/communication-ui-library/pull/1013) by 2684369+JamesBurnside@users.noreply.github.com)
- Rename baseCustomStylesProps to baseCustomStyles ([PR #989](https://github.com/azure/communication-ui-library/pull/989) by 2684369+JamesBurnside@users.noreply.github.com)
- Bugfix for permanent camera disable when it is being used elsewhere ([PR #1050](https://github.com/azure/communication-ui-library/pull/1050) by anjulgarg@live.com)
- Update message status indicator icons and sizes ([PR #1062](https://github.com/azure/communication-ui-library/pull/1062) by 2684369+JamesBurnside@users.noreply.github.com)
- Local VideoTile in VideoGallery overflow fix ([PR #1089](https://github.com/azure/communication-ui-library/pull/1089) by miguelgamis@microsoft.com)
- Display 'You' instead of complete name in local video tile ([PR #1076](https://github.com/azure/communication-ui-library/pull/1076) by anjulgarg@live.com)
- Improve touch target size for editing chat messages ([PR #1022](https://github.com/azure/communication-ui-library/pull/1022) by 2684369+JamesBurnside@users.noreply.github.com)
- Update OptionsButton to DevicesButton ([PR #1084](https://github.com/azure/communication-ui-library/pull/1084) by 2684369+JamesBurnside@users.noreply.github.com)
- Add ability to style the options button flyouts ([PR #985](https://github.com/azure/communication-ui-library/pull/985) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix chat initials not showing in the message thread ([PR #1011](https://github.com/azure/communication-ui-library/pull/1011) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.7](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.7)

Wed, 27 Oct 2021 19:40:46 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0-beta.6..@internal/react-components_v1.0.0-beta.7)

### Changes

- VideoTile persona coin now resizes more smoothly. GridLayout resize updates more smoothly. ([PR #899](https://github.com/azure/communication-ui-library/pull/899) by miguelgamis@microsoft.com)
- Add function `smartDominantSpeakerParticipants` for calculating smart dominant speaker tiles ([PR #827](https://github.com/azure/communication-ui-library/pull/827) by anjulgarg@live.com)
- Theme palette and effects acquired from theme context for VideoTile, Video Gallery, floating ControlBar and EndCallButton. ([PR #941](https://github.com/azure/communication-ui-library/pull/941) by miguelgamis@microsoft.com)
- Put video participants in front of audio participants in VideoGallery. ([PR #956](https://github.com/azure/communication-ui-library/pull/956) by miguelgamis@microsoft.com)
- Add data-ui-ids for components of the participant button ([PR #980](https://github.com/azure/communication-ui-library/pull/980) by 2684369+JamesBurnside@users.noreply.github.com)
- added button text to JumpToNewMessageButtonProps +  strings to MessageThreadStrings and ParticipantItemStrings ([PR #966](https://github.com/azure/communication-ui-library/pull/966) by alcail@microsoft.com)
- GridLayout updated to fill entire rectangle and to respond to resizing. ([PR #840](https://github.com/azure/communication-ui-library/pull/840) by miguelgamis@microsoft.com)
- added VideoGelleryStrings with screenSharingMessage string ([PR #897](https://github.com/azure/communication-ui-library/pull/897) by alcail@microsoft.com)
- Fix weird height of single-line bubble ([PR #894](https://github.com/azure/communication-ui-library/pull/894) by jinan@microsoft.com)
- adding new style container to customize each chat item in the message thread ([PR #834](https://github.com/azure/communication-ui-library/pull/834) by alkwa@microsoft.com)
- Add min-width to align left edge of chat ([PR #895](https://github.com/azure/communication-ui-library/pull/895) by jinan@microsoft.com)
- Remove permanent box shadow on control bar ([PR #891](https://github.com/azure/communication-ui-library/pull/891) by 2684369+JamesBurnside@users.noreply.github.com)
- Replace generic ChatMessage types with discriminating unions ([PR #830](https://github.com/azure/communication-ui-library/pull/830) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix spelling - sendboxTextfield to sendboxTextField ([PR #851](https://github.com/azure/communication-ui-library/pull/851) by 2684369+JamesBurnside@users.noreply.github.com)
- Prop `dominantSpeakers` added to VideoGallery to reorder remoteParticipants with new algorithm. ([PR #951](https://github.com/azure/communication-ui-library/pull/951) by miguelgamis@microsoft.com)
- Rename `ActiveError` to `ActiveErrorMessage` ([PR #880](https://github.com/azure/communication-ui-library/pull/880) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update message type ([PR #958](https://github.com/azure/communication-ui-library/pull/958) by jinan@microsoft.com)
- Fix options button flyout from going out of screen bounds  ([PR #866](https://github.com/azure/communication-ui-library/pull/866) by 2684369+JamesBurnside@users.noreply.github.com)
- Update options button icon to a settings gear ([PR #867](https://github.com/azure/communication-ui-library/pull/867) by 2684369+JamesBurnside@users.noreply.github.com)
- Added HorizontalGallery in VideoGallery to accomodate audio only participants. ([PR #978](https://github.com/azure/communication-ui-library/pull/978) by miguelgamis@microsoft.com)
- moved screensharing message from component to composite strings ([PR #944](https://github.com/azure/communication-ui-library/pull/944) by alcail@microsoft.com)

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0-beta.5..@internal/react-components_v1.0.0-beta.6)

### Changes

- Change ControlBar to be affected by theme.effects ([PR #793](https://github.com/azure/communication-ui-library/pull/793) by miguelgamis@microsoft.com)
- Localization for edit + delete messages ([PR #809](https://github.com/azure/communication-ui-library/pull/809) by jinan@microsoft.com)
- Make ControlBarButton styling consistent ([PR #829](https://github.com/azure/communication-ui-library/pull/829) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adjust api comments - iteration 2 ([PR #776](https://github.com/azure/communication-ui-library/pull/776) by jinan@microsoft.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add edited tag to messages ([PR #759](https://github.com/azure/communication-ui-library/pull/759) by jinan@microsoft.com)
- Undo styling to body tag from FluentThemeProvider ([PR #817](https://github.com/azure/communication-ui-library/pull/817) by miguelgamis@microsoft.com)
- ControlBarButton labels have regular font weight and font is customizable through FluentThemeProvider. ([PR #789](https://github.com/azure/communication-ui-library/pull/789) by miguelgamis@microsoft.com)
- Add custom menu items injection support to ParticipantList ([PR #795](https://github.com/azure/communication-ui-library/pull/795) by anjulgarg@live.com)
- TDBuild - updating localized resource files. ([PR #836](https://github.com/azure/communication-ui-library/pull/836) by miguelgamis@microsoft.com)
- Add release tags to all public API. Lint clean internal API. ([PR #825](https://github.com/azure/communication-ui-library/pull/825) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add data-ui-id for video tiles ([PR #802](https://github.com/azure/communication-ui-library/pull/802) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix chat message text being always bold ([PR #799](https://github.com/azure/communication-ui-library/pull/799) by 2684369+JamesBurnside@users.noreply.github.com)
- TDBuild - updating localized resource files. ([PR #794](https://github.com/azure/communication-ui-library/pull/794) by miguelgamis@microsoft.com)
- Allow custom menu items in ParticipantList ([PR #800](https://github.com/azure/communication-ui-library/pull/800) by anjulgarg@live.com)

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0-beta.4..@internal/react-components_v1.0.0-beta.5)

### Changes

- Custom Icons injection in components and composites. ([PR #716](https://github.com/azure/communication-ui-library/pull/716) by anjulgarg@live.com)
- Bump acs-ui-common dep ([PR #732](https://github.com/azure/communication-ui-library/pull/732) by 82062616+prprabhu-ms@users.noreply.github.com)
- Delete API to clear stateful errors ([PR #756](https://github.com/azure/communication-ui-library/pull/756) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add custom avatar data injection for composites ([PR #677](https://github.com/azure/communication-ui-library/pull/677) by anjulgarg@live.com)
- Show ACS errors via ErrorBar in CallComposite ([PR #702](https://github.com/azure/communication-ui-library/pull/702) by 82062616+prprabhu-ms@users.noreply.github.com)
- Do not show unnamed moderator ([PR #654](https://github.com/azure/communication-ui-library/pull/654) by jinan@microsoft.com)
- Fixed theming for MessageThread icons. ([PR #692](https://github.com/azure/communication-ui-library/pull/692) by miguelgamis@microsoft.com)
- Rename component locale types to match composites ([PR #720](https://github.com/azure/communication-ui-library/pull/720) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add Dominant Speaker support to Video Gallery ([PR #742](https://github.com/azure/communication-ui-library/pull/742) by anjulgarg@live.com)
- Adjust most comments in internal api review ([PR #724](https://github.com/azure/communication-ui-library/pull/724) by jinan@microsoft.com)
- Add message edit feature to message thread component ([PR #734](https://github.com/azure/communication-ui-library/pull/734) by jinan@microsoft.com)
- Updated available locales and translations. ([PR #712](https://github.com/azure/communication-ui-library/pull/712) by miguelgamis@microsoft.com)
- Add different types for ChatComposite and CallCompposite Icons ([PR #757](https://github.com/azure/communication-ui-library/pull/757) by anjulgarg@live.com)
- Add active and dominant speaker support to screenshare screen. ([PR #748](https://github.com/azure/communication-ui-library/pull/748) by anjulgarg@live.com)
- Track dimissed errors internally in ErrorBar ([PR #754](https://github.com/azure/communication-ui-library/pull/754) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bubble up call connection error to UI ([PR #749](https://github.com/azure/communication-ui-library/pull/749) by 82062616+prprabhu-ms@users.noreply.github.com)
- Remove some accidental imports; mark Identifiers experimental ([PR #728](https://github.com/azure/communication-ui-library/pull/728) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add timestamp to teed errors ([PR #753](https://github.com/azure/communication-ui-library/pull/753) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update participant button's props relating to the participant list to be top level ([PR #674](https://github.com/azure/communication-ui-library/pull/674) by 2684369+JamesBurnside@users.noreply.github.com)
- Truncating long display names in ParticipantItem. Ensuring icons are aligned on right side of ParticipantItem. ([PR #699](https://github.com/azure/communication-ui-library/pull/699) by miguelgamis@microsoft.com)
- Add is speaking indicator to video tiles and gallery ([PR #738](https://github.com/azure/communication-ui-library/pull/738) by anjulgarg@live.com)
- Remove unnecessary API exports ([PR #711](https://github.com/azure/communication-ui-library/pull/711) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0-beta.3..@internal/react-components_v1.0.0-beta.4)

### Changes

- Fix partially composed chat messages being lost when closing and reopening the chat pane in the meeting composite ([PR #662](https://github.com/azure/communication-ui-library/pull/662) by 2684369+JamesBurnside@users.noreply.github.com)
- Update to align chat bubble with/without receipt ([PR #670](https://github.com/azure/communication-ui-library/pull/670) by jinan@microsoft.com)
- Video device icon updated in DevicesButton ([PR #629](https://github.com/azure/communication-ui-library/pull/629) by miguelgamis@microsoft.com)
- Fix video gallery local preview position to be relative to the parent ([PR #620](https://github.com/azure/communication-ui-library/pull/620) by 79329532+alkwa-msft@users.noreply.github.com)
- Fix infinite scroll jumpy behavior ([PR #657](https://github.com/azure/communication-ui-library/pull/657) by jinan@microsoft.com)
- updated Typescript version to 4.3.5 ([PR #645](https://github.com/azure/communication-ui-library/pull/645) by alcail@microsoft.com)
- FluentThemeProvider style prop overflow set to 'auto'. ([PR #641](https://github.com/azure/communication-ui-library/pull/641) by miguelgamis@microsoft.com)
- Fix button menu flyouts exceeding screen width ([PR #667](https://github.com/azure/communication-ui-library/pull/667) by 2684369+JamesBurnside@users.noreply.github.com)
- Delete redundant prop VideoTile.isVideoReady ([PR #646](https://github.com/azure/communication-ui-library/pull/646) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix local video icon + avatar not showing ([PR #664](https://github.com/azure/communication-ui-library/pull/664) by jinan@microsoft.com)
- adding padding in sendbox so we don't overlap text with the send message button ([PR #621](https://github.com/azure/communication-ui-library/pull/621) by 79329532+alkwa-msft@users.noreply.github.com)
- Added rtl property to FluentThemeProvider ([PR #658](https://github.com/azure/communication-ui-library/pull/658) by miguelgamis@microsoft.com)
- Add system message to MessageThread component Add system message for selector props Link system message to participant received event ([PR #603](https://github.com/azure/communication-ui-library/pull/603) by jinan@microsoft.com)
- Fixed RTL responsiveness of TypingIndicator. ([PR #631](https://github.com/azure/communication-ui-library/pull/631) by miguelgamis@microsoft.com)

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/react-components_v1.0.0-beta.2..@internal/react-components_v1.0.0-beta.3)

### Changes

- Fixed RTL responsiveness for MessageThread, ControlBar, and FluentThemeProvider. TypingIndicator set always to LTR. ([PR #530](https://github.com/azure/communication-ui-library/pull/530) by miguelgamis@microsoft.com)
- Add an ErrorBar component ([PR #574](https://github.com/azure/communication-ui-library/pull/574) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fixed cursor on control button labels. ([PR #567](https://github.com/azure/communication-ui-library/pull/567) by miguelgamis@microsoft.com)
- Exporting locales separately. ([PR #547](https://github.com/azure/communication-ui-library/pull/547) by miguelgamis@microsoft.com)
- Bugfix - Removed usage of hooks inside useMemo for MessageThread ([PR #591](https://github.com/azure/communication-ui-library/pull/591) by anjulgarg@live.com)
- Fix MessageThread hook related console errors. ([PR #566](https://github.com/azure/communication-ui-library/pull/566) by miguelgamis@microsoft.com)
- Support more errors in ErrorBar ([PR #581](https://github.com/azure/communication-ui-library/pull/581) by 82062616+prprabhu-ms@users.noreply.github.com)
- Localized strings for SendBox and MessageStatusIndicator ([PR #535](https://github.com/azure/communication-ui-library/pull/535) by miguelgamis@microsoft.com)
- Add E2E Chat Composite tests ([PR #578](https://github.com/azure/communication-ui-library/pull/578) by anjulgarg@live.com)
- Add identifier injection mechanism in components for e2e testing ([PR #556](https://github.com/azure/communication-ui-library/pull/556) by anjulgarg@live.com)
- Add default call control bar button ([PR #585](https://github.com/azure/communication-ui-library/pull/585) by 2684369+JamesBurnside@users.noreply.github.com)
- React hook useTheme added to ACS library. ([PR #572](https://github.com/azure/communication-ui-library/pull/572) by miguelgamis@microsoft.com)
- Add E2E browser tests for chat composite ([PR #517](https://github.com/azure/communication-ui-library/pull/517) by anjulgarg@live.com)
- Removed truncation from MessageThread system message. ([PR #575](https://github.com/azure/communication-ui-library/pull/575) by miguelgamis@microsoft.com)

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/react-components_v1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/react-components_v1.0.0-beta.1..react-components_v1.0.0-beta.2)

### Changes

- Updated SendBox component based on new visual design. ([PR #398](https://github.com/azure/communication-ui-library/pull/398) by miguelgamis@microsoft.com)
- Dispose view when stream is not available ([PR #404](https://github.com/azure/communication-ui-library/pull/404) by jinan@microsoft.com)
- Expose more customized api for rendering ([PR #457](https://github.com/azure/communication-ui-library/pull/457) by jinan@microsoft.com)
- update react peer deps to be >=16.8.0 <18.0.0 ([PR #450](https://github.com/azure/communication-ui-library/pull/450) by mail@jamesburnside.com)
- Adding floating localvideopreview layout to VideoGallery. ([PR #425](https://github.com/azure/communication-ui-library/pull/425) by anjulgarg@live.com)
- Update to fluentui version 8 ([PR #448](https://github.com/azure/communication-ui-library/pull/448) by mail@jamesburnside.com)
- Remove @fluentui/react-northstar-icons, use only @fluentui/react-icons ([PR #143](https://github.com/azure/communication-ui-library/pull/143) by mail@jamesburnside.com)
- Bug fix: MesageThread scrollTop throws exception when chat composite is hidden ([PR #506](https://github.com/azure/communication-ui-library/pull/506) by mail@jamesburnside.com)
- add ButtonCustomStylesProps as new type ([PR #438](https://github.com/azure/communication-ui-library/pull/438) by alcail@microsoft.com)
- Add options to onSelectCamera and onToggleCamera ([PR #436](https://github.com/azure/communication-ui-library/pull/436) by easony@microsoft.com)
- Fixing minor bugs and handling teams meeting denied. ([PR #367](https://github.com/azure/communication-ui-library/pull/367) by anjulgarg@live.com)
- Add mute indicator to VideoGallery and VideoTile ([PR #483](https://github.com/azure/communication-ui-library/pull/483) by anjulgarg@live.com)
- Use sections in device settings context menu ([PR #442](https://github.com/azure/communication-ui-library/pull/442) by prprabhu@microsoft.com)
- Replace memoizeFn with react.memo Fix maxListener warning by default ([PR #426](https://github.com/azure/communication-ui-library/pull/426) by jinan@microsoft.com)
- added showMessageDate in MessageThreadProps and showDate in MessageProps ([PR #395](https://github.com/azure/communication-ui-library/pull/395) by alcail@microsoft.com)
- add ParticipantsButton component with ParticipantsButtonStylesProps and ParticipantsButtonProps, as well as excludeMe props to ParticipantList component ([PR #415](https://github.com/azure/communication-ui-library/pull/415) by alcail@microsoft.com)
- Fix leave call button label ([PR #434](https://github.com/azure/communication-ui-library/pull/434) by prprabhu@microsoft.com)
- Fix option button props ([PR #383](https://github.com/azure/communication-ui-library/pull/383) by jinan@microsoft.com)
- Tiny fix for send button ([PR #500](https://github.com/azure/communication-ui-library/pull/500) by jinan@microsoft.com)
- Bump prettier version and reformat ([PR #505](https://github.com/azure/communication-ui-library/pull/505) by prprabhu@microsoft.com)
- Added LocalizationProvider. ([PR #468](https://github.com/azure/communication-ui-library/pull/468) by miguelgamis@microsoft.com)
- Show mute indicator while screensharing. Fix icon padding ([PR #502](https://github.com/azure/communication-ui-library/pull/502) by anjulgarg@live.com)
- Fixed DevicesButton cameras, microphones, and speakers property types. OptionButton default menu props only used not empty. ([PR #439](https://github.com/azure/communication-ui-library/pull/439) by miguelgamis@microsoft.com)
- ParticipantItem has menu button when hovered. ParticipantItem showing '(you)' when me property is true.  ([PR #405](https://github.com/azure/communication-ui-library/pull/405) by miguelgamis@microsoft.com)
- include local user to Participant list in ParticipantsButton ([PR #452](https://github.com/azure/communication-ui-library/pull/452) by alcail@microsoft.com)
- Small responsive fixes for calling components ([PR #536](https://github.com/azure/communication-ui-library/pull/536) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/react-components_v1.0.0-beta.1)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- removing maxHeight from participantList ([PR #352](https://github.com/azure/communication-ui-library/pull/352) by alkwa@microsoft.com)
- Possible fix for clone stream issue ([PR #286](https://github.com/azure/communication-ui-library/pull/286) by allenhwang@microsoft.com)
- Bugfix for TeamsInterop Lobby ([PR #344](https://github.com/azure/communication-ui-library/pull/344) by anjulgarg@live.com)
- Drop unused button props ([PR #331](https://github.com/azure/communication-ui-library/pull/331) by prprabhu@microsoft.com)
- renamed ReadReceipt component to MessageStatusIndicator, onRenderReadReceipt props to onRenderMessageStatus in MessageThread, and readReceiptContainer style to messageStatusContainer  ([PR #335](https://github.com/azure/communication-ui-library/pull/335) by alcail@microsoft.com)
- Add checks to ensure correct status before calling render ([PR #279](https://github.com/azure/communication-ui-library/pull/279) by allenhwang@microsoft.com)
- Add on render avatar for calling composite ([PR #321](https://github.com/azure/communication-ui-library/pull/321) by jinan@microsoft.com)
- Fixed VideoTile label ([PR #337](https://github.com/azure/communication-ui-library/pull/337) by miguelgamis@microsoft.com)
- Add default menu props and selector props to DevicesButton ([PR #317](https://github.com/azure/communication-ui-library/pull/317) by anjulgarg@live.com)
- merged PlaceholderProps in VideoTileProps and added showDisplayName props to it, also added displayNameContainer to VideoTileStylesProps ([PR #313](https://github.com/azure/communication-ui-library/pull/313) by alcail@microsoft.com)
- Remove error bar export ([PR #312](https://github.com/azure/communication-ui-library/pull/312) by mail@jamesburnside.com)
- [#2404092] Adding stateful attributes to CallClientProvider for starting a call with camera on/off ([PR #292](https://github.com/azure/communication-ui-library/pull/292) by anjulgarg@live.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-library/pull/315) by prprabhu@microsoft.com)
- Set maxWidth to 20rem for ParticipantItem. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Removed userId and displayName props from SendBox. Updated SendBox storybook doc. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Add EndCallButton component ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by alcail@microsoft.com)
- Fixed exported props of ControlBar ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Update js sdk dependency version to beta4 ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by jinan@microsoft.com)
- Wrote theming documentation page in storybook. Updated dark theme palette. Updated ControlBar and VideoTile theme mapping. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Fix styling props for all components to have the same format. Add more comments to the interfaces. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Add DevicesButton Component ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by alcail@microsoft.com)
- Update from renaming declarative to stateful ([PR #258](https://github.com/azure/communication-ui-library/pull/258) by mail@jamesburnside.com)
- Refactor ChatThread component and optimize ReadReceipt data flow ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Fix small bugs for chat messages mapper ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Convert duplicate render from error to warning since Stateful handles it ([PR #248](https://github.com/azure/communication-ui-library/pull/248) by allenhwang@microsoft.com)
- adding MessageProps type and using them for default render of Message ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by alcail@microsoft.com)
- ParticipantItem now has onRenderIcon and onRenderAvatar properties. ControlButton deleted and replaced with Fluent UI DefaultButton. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Renamed props of interface SendBoxStylesProps. SendBox system message component change. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Add memoizeAll to MessageThread to avoid generate unnecessary instances ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by jinan@microsoft.com)
- added CallingTheme and used it for EndCallButton styles ([PR #249](https://github.com/azure/communication-ui-library/pull/249) by alcail@microsoft.com)
- add documentation for MicrophoneButton Component ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by alcail@microsoft.com)
- Standardize the export names for components. Pure components should export as XXXComponent from now on; Export all types and interfaces as well ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Added ThemeSelector and ThemeToggler. Created SwitchableFluentThemeProvider to allow switching of themes. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Prune exports for beta release ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- Add some basic styling for placeholder in VideoTile ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Added ParticipantList component ([PR #239](https://github.com/azure/communication-ui-library/pull/239) by miguelgamis@microsoft.com)
- Add ScreenShare button component ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by prprabhu@microsoft.com)
- Added examples for icon and avatar customization for ParticipantItem and SendBox in storybook docs. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Initial changelog setup ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- Add calling handler and selector for VideoGallery and ScreenShare ([PR #277](https://github.com/azure/communication-ui-library/pull/277) by anjulgarg@live.com)
- Updated light and dark theme. ParticipantItem initials color fixed to white. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Add support for CommonJS ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- CommunicationCallingParticipant and CommunicationParticipant changed to interface ([PR #282](https://github.com/azure/communication-ui-library/pull/282) by miguelgamis@microsoft.com)
- TypingIndicator property updated to render all users instead of each one. Removed property from TypingIndicator styles. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Remove dependency on chat-selector ([PR #211](https://github.com/azure/communication-ui-library/pull/211) by mail@jamesburnside.com)
- Export Chat thread component base from components and add more docs ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Add participantList selector ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by anjulgarg@live.com)
- Fixed default theming when no theme is given to FluentThemeProvider. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Upgrade to Calling SDK version 1.0.1-beta.1 ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by allenhwang@microsoft.com)
- Fix import for SizeValue in ReadReceipt ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- ControlBar boolean prop added to remap background if floating layout and dark theme is used. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Updated onRenderText prop for video button and styling. Removed centering style in FluentThemeProvider. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Exporting ErrorBarProps. Fixed ErrorBar when severity is INFO. Added ErrorBar storybook docs. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Removed SwitchableFluentThemeProvider, ThemeSelector, ThemeToggler, NamedTheme, and ThemeCollection. ([PR #220](https://github.com/azure/communication-ui-library/pull/220) by miguelgamis@microsoft.com)
- Add MicrophoneButton component to replace DefaultButton for microphone ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by alcail@microsoft.com)
- ThemeSelector component changed to radio button selection. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- parsing a Text message content type as text ([PR #285](https://github.com/azure/communication-ui-library/pull/285) by alkwa@microsoft.com)
- Add basic support for system message and custom message in MessageThread ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- renamed VideoTile props placeholderProvider to placeholder ([PR #284](https://github.com/azure/communication-ui-library/pull/284) by alcail@microsoft.com)
- Ensure react-northstar icons are always loaded as part of FluentThemeProvider.
 Fix ParticipantItem to show context menu if the participant is you.
 Add Storybook background change when storybook theme is changed.
 ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Move Storybook into its own project ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- Add api extractor for package ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- Update button docstrings ([PR #206](https://github.com/azure/communication-ui-library/pull/206) by prprabhu@microsoft.com)
- update name and avartarName to displayName ([PR #278](https://github.com/azure/communication-ui-library/pull/278) by alcail@microsoft.com)
- using message type to render RichText/html messages ([PR #266](https://github.com/azure/communication-ui-library/pull/266) by alkwa@microsoft.com)
- Updated onMessageSend handler. Updated prop names in SendBox. Updated props and added selector for TypingIndicator. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Fix theming for links in chat content of MessageThread. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Add useCallClient, useDeviceManager, and useCall utilities ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by allenhwang@microsoft.com)
- clean up states, hooks and mappers in chat ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Removing references to static media.svg and styles ([PR #212](https://github.com/azure/communication-ui-library/pull/212) by alkwa@microsoft.com)
- Remove mappers used in Sample Chat App ChatHeader ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by anjulgarg@live.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-library/pull/225) by domessin@microsoft.com)
- Refactor mediaControls and Headers to use control bar component ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- Add CameraButton component to replace DefaultButton in ControlBar ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by prprabhu@microsoft.com)
- Remove THEMES singleton. Refine theme related exports. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- Add selectors and handlers for Calling ([PR #232](https://github.com/azure/communication-ui-library/pull/232) by anjulgarg@live.com)
- Ignoring typing users with no display name in TypingIndicator component ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
- Remove MapToChatThreadProps ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by easony@microsoft.com)
- changing invertedVideo to isMirrored ([PR #268](https://github.com/azure/communication-ui-library/pull/268) by alkwa@microsoft.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-library/pull/231) by mail@jamesburnside.com)
- Adding custom palette color and fixing lobby example theming ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by anjulgarg@live.com)
- Updated FluentThemeProvider theming for MessageThread. MessageThread button to load previous messages changed. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by miguelgamis@microsoft.com)
