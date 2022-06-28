# Change Log - @internal/react-composites

This log was last generated on Mon, 13 Jun 2022 18:29:27 GMT and should not be manually modified.

<!-- Start content -->

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

## [1.2.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.2.2-beta.1)

Tue, 19 Apr 2022 20:46:14 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.2.0...@internal/react-composites_v1.2.2-beta.1)

### Minor changes

- Add useAzureCommunicationChatAdapter hook ([PR #1627](https://github.com/azure/communication-ui-library/pull/1627) by 82062616+prprabhu-ms@users.noreply.github.com)

### Patches

- [object Object] ([PR #1668](https://github.com/azure/communication-ui-library/pull/1668) by 82062616+prprabhu-ms@users.noreply.github.com)
- Show Error Bar to user when joining a call fails ([PR #1788](https://github.com/azure/communication-ui-library/pull/1788) by 2684369+JamesBurnside@users.noreply.github.com)
- Hide People menu item in MoreDrawer when set in CallControl options ([PR #1695](https://github.com/azure/communication-ui-library/pull/1695) by edwardlee@microsoft.com)
- Added local and remote picture-in-picture component in Chat pane of CallWithChat composite in mobile view. ([PR #1617](https://github.com/azure/communication-ui-library/pull/1617) by miguelgamis@microsoft.com)
- Fix race condition of "not in chat" ([PR #1652](https://github.com/azure/communication-ui-library/pull/1652) by jiangnanhello@live.com)
- Reduce min-width and min-height of the composites to support a galaxy fold portrait screen ([PR #1769](https://github.com/azure/communication-ui-library/pull/1769) by 2684369+JamesBurnside@users.noreply.github.com)
- optimization to reduce perf regression for onRenderFileDownloads ([PR #1691](https://github.com/azure/communication-ui-library/pull/1691) by carolinecao@microsoft.com)
- Bump webpack-cli dependency ([PR #1731](https://github.com/azure/communication-ui-library/pull/1731) by 82062616+prprabhu-ms@users.noreply.github.com)
- Introduce Aria-label for the return to call button on mobile. ([PR #1723](https://github.com/azure/communication-ui-library/pull/1723) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add aria-label for SidePaneHeader dismiss button ([PR #1763](https://github.com/azure/communication-ui-library/pull/1763) by edwardlee@microsoft.com)
- Style update for Screenshare button when checked in CallWithChat composite. ([PR #1653](https://github.com/azure/communication-ui-library/pull/1653) by miguelgamis@microsoft.com)
- Switch scroll behavior in chat styles so that the parent wrapper dosen't have scroll behavior when file sharing icon present. ([PR #1689](https://github.com/azure/communication-ui-library/pull/1689) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix styles so that the PIPIP shows over the content in the people and chat panes on mobile. ([PR #1674](https://github.com/azure/communication-ui-library/pull/1674) by 94866715+dmceachernmsft@users.noreply.github.com)
- Left align participant pane elements in mobile and desktop ([PR #1671](https://github.com/azure/communication-ui-library/pull/1671) by edwardlee@microsoft.com)
- Update mobile people and chat tabs to have 'tab' roles for narration. ([PR #1770](https://github.com/azure/communication-ui-library/pull/1770) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add aria label and aria description to back button on TabHeader for mobile view ([PR #1796](https://github.com/azure/communication-ui-library/pull/1796) by edwardlee@microsoft.com)
- Moved starting position of PiPiP higher in chat/people pane of CallWithChat composite. Also fixed PiPiP bounds such that it that does not go off screen. ([PR #1748](https://github.com/azure/communication-ui-library/pull/1748) by miguelgamis@microsoft.com)
- Improve Chat composite behavior in CallWithChatComposite to allow autofocus when opening chat pane. ([PR #1717](https://github.com/azure/communication-ui-library/pull/1717) by 94866715+dmceachernmsft@users.noreply.github.com)
- Make Chat Message action button icon customizable ([PR #1798](https://github.com/azure/communication-ui-library/pull/1798) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix Picture-In-Picture component in mobile composites going outside the screen when the mobile device is rotated from portrait to landscape ([PR #1802](https://github.com/azure/communication-ui-library/pull/1802) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/calling-component-bindings to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/calling-stateful-client to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/chat-component-bindings to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/chat-stateful-client to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/react-components to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)

### Changes

- Bugfix for file upload button's inconsistent behavior ([PR #1673](https://github.com/azure/communication-ui-library/pull/1673) by anjulgarg@live.com)
- Move file download renderer to MessageThread component ([PR #1790](https://github.com/azure/communication-ui-library/pull/1790) by anjulgarg@live.com)
- Flatten pick and omit APIs in CallWithChatComposite ([PR #1630](https://github.com/azure/communication-ui-library/pull/1630) by 2684369+JamesBurnside@users.noreply.github.com)
- Add error bar to show file download error message in the message thread. ([PR #1625](https://github.com/azure/communication-ui-library/pull/1625) by 97124699+prabhjot-msft@users.noreply.github.com)
- Reducing un-needed interfaces from File Sharing Public API ([PR #1700](https://github.com/azure/communication-ui-library/pull/1700) by anjulgarg@live.com)
- Adding gap between downloadable files and message content ([PR #1765](https://github.com/azure/communication-ui-library/pull/1765) by anjulgarg@live.com)
- Changing attach file icon position basis on form factor ([PR #1774](https://github.com/azure/communication-ui-library/pull/1774) by anjulgarg@live.com)
- Introduces number of message tracking for the chat button tooltip ([PR #1606](https://github.com/azure/communication-ui-library/pull/1606) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added chat test setup with per user query arguments & UI tests for file download card ([PR #1771](https://github.com/azure/communication-ui-library/pull/1771) by 97124699+prabhjot-msft@users.noreply.github.com)
- Modifying the updateMessage chat adapter method to allow passing metadata as a parameter ([PR #1776](https://github.com/azure/communication-ui-library/pull/1776) by anjulgarg@live.com)
- Bugfix for delay in removing file card after a message is sent ([PR #1645](https://github.com/azure/communication-ui-library/pull/1645) by anjulgarg@live.com)
- Added resend button to contextual menu ([PR #1676](https://github.com/azure/communication-ui-library/pull/1676) by carolinecao@microsoft.com)
- Add filesharing to callwithchat composite ([PR #1667](https://github.com/azure/communication-ui-library/pull/1667) by anjulgarg@live.com)

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

## [1.1.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.1.1-beta.1)

Tue, 01 Mar 2022 16:42:53 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.1...@internal/react-composites_v1.1.1-beta.1)

### Minor changes

- Created component for ParticipantList and heading ([PR #1440](https://github.com/azure/communication-ui-library/pull/1440) by miguelgamis@microsoft.com)
- Updated calling composite icons to include new icon for local video feed camera switcher ([PR #1367](https://github.com/azure/communication-ui-library/pull/1367) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update autofocus disabled state from false boolean to string value 'disabled' ([PR #1518](https://github.com/azure/communication-ui-library/pull/1518) by 94866715+dmceachernmsft@users.noreply.github.com)
- TDBuild - updating localized resource files. ([PR #1435](https://github.com/azure/communication-ui-library/pull/1435) by miguelgamis@microsoft.com)
- Exposed Chat and Call latestErrors in MeetingComposite ([PR #1456](https://github.com/azure/communication-ui-library/pull/1456) by edwardlee@microsoft.com)
- Added new constructor that accepts stateful client arguments in MeetingComposite ([PR #1457](https://github.com/azure/communication-ui-library/pull/1457) by edwardlee@microsoft.com)
- add new test for local camera swticher button ([PR #1487](https://github.com/azure/communication-ui-library/pull/1487) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Show currently active device in MoreDrawer and SubMenuItems ([PR #1532](https://github.com/azure/communication-ui-library/pull/1532) by edwardlee@microsoft.com)
- Upgrade @azure/communication-signaling to 1.0.0.beta.12 ([PR #1352](https://github.com/azure/communication-ui-library/pull/1352) by anjulgarg@live.com)
- Removed unused conditional compilation and split imports for .../AzureCommunicationCallAdapter ([PR #1481](https://github.com/azure/communication-ui-library/pull/1481) by edwardlee@microsoft.com)
- Using React Context to set locale, icons, and theme only once through BaseComposite ([PR #1496](https://github.com/azure/communication-ui-library/pull/1496) by edwardlee@microsoft.com)
- Vertically aligned Muted indicator notification ([PR #1561](https://github.com/azure/communication-ui-library/pull/1561) by edwardlee@microsoft.com)
- Fix CallComposite being stuck on the configuration page when using adapter.startCall ([PR #1403](https://github.com/azure/communication-ui-library/pull/1403) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/calling-component-bindings to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/calling-stateful-client to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/chat-component-bindings to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/chat-stateful-client to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/react-components to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)

### Changes

- Add file sharing option props to ChatComposite ([PR #1389](https://github.com/azure/communication-ui-library/pull/1389) by anjulgarg@live.com)
- upgrading calling to 1.4.2-beta.1 ([PR #1509](https://github.com/azure/communication-ui-library/pull/1509) by 79329532+alkwa-msft@users.noreply.github.com)
- Changing userId to string in FileUploadHandler ([PR #1455](https://github.com/azure/communication-ui-library/pull/1455) by anjulgarg@live.com)
- Add e2e tests for More Menu on CallWithChat Mobile ([PR #1553](https://github.com/azure/communication-ui-library/pull/1553) by edwardlee@microsoft.com)
- Update visuals of MeetingComposite control bar ([PR #1388](https://github.com/azure/communication-ui-library/pull/1388) by 82062616+prprabhu-ms@users.noreply.github.com)
- Make ChevronRight customizable through icons interface ([PR #1533](https://github.com/azure/communication-ui-library/pull/1533) by 2684369+JamesBurnside@users.noreply.github.com)
- CallWithChatComposite: Drop PeopleButon in mobileView ([PR #1495](https://github.com/azure/communication-ui-library/pull/1495) by 82062616+prprabhu-ms@users.noreply.github.com)
- Modifying file sharing to allow attaching already uploaded files to message ([PR #1556](https://github.com/azure/communication-ui-library/pull/1556) by anjulgarg@live.com)
- Passes Camera logic from call composite to the local camera switcher button. ([PR #1393](https://github.com/azure/communication-ui-library/pull/1393) by 94866715+dmceachernmsft@users.noreply.github.com)
- Drop fixed width for CallWithChatControlBar in mobileView ([PR #1511](https://github.com/azure/communication-ui-library/pull/1511) by 82062616+prprabhu-ms@users.noreply.github.com)
- Do not show label on EndCall button on desktop ([PR #1471](https://github.com/azure/communication-ui-library/pull/1471) by 82062616+prprabhu-ms@users.noreply.github.com)
- introduced aria roles and strings to chat notifaction icon ([PR #1429](https://github.com/azure/communication-ui-library/pull/1429) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update chat and people button styling to match figma spec ([PR #1484](https://github.com/azure/communication-ui-library/pull/1484) by 82062616+prprabhu-ms@users.noreply.github.com)
- Remove DevicesButton from MeetingComposite ([PR #1438](https://github.com/azure/communication-ui-library/pull/1438) by 82062616+prprabhu-ms@users.noreply.github.com)
- CallWithChatComposite/mobileView: Move device selection menu to MoreDrawer ([PR #1492](https://github.com/azure/communication-ui-library/pull/1492) by 82062616+prprabhu-ms@users.noreply.github.com)
- Move chat button to center in mobileView ([PR #1483](https://github.com/azure/communication-ui-library/pull/1483) by 82062616+prprabhu-ms@users.noreply.github.com)
- upgrading nanoid to 3.1.32 ([PR #1412](https://github.com/azure/communication-ui-library/pull/1412) by 79329532+alkwa-msft@users.noreply.github.com)
- Update Chat Screen to display uploaded files in sendbox ([PR #1421](https://github.com/azure/communication-ui-library/pull/1421) by 97124699+prabhjot-msft@users.noreply.github.com)
- Add File upload button to Chat Composite ([PR #1368](https://github.com/azure/communication-ui-library/pull/1368) by anjulgarg@live.com)
- People pane and chat pane take up entire screen on mobile view in CallWithChatComposite ([PR #1486](https://github.com/azure/communication-ui-library/pull/1486) by miguelgamis@microsoft.com)
- Add adapter ui state and selectors for file sharing ([PR #1374](https://github.com/azure/communication-ui-library/pull/1374) by anjulgarg@live.com)
- Added button to copy invite link in people pane of CallWithChat composite in mobile view. ([PR #1516](https://github.com/azure/communication-ui-library/pull/1516) by miguelgamis@microsoft.com)
- Create CallWithChatCompositeIcons type. Move ControlBarButtonBadgeIcon out of CallCompositeIcons ([PR #1531](https://github.com/azure/communication-ui-library/pull/1531) by 2684369+JamesBurnside@users.noreply.github.com)
- Notification Icon for the chat button in the meeting composite. ([PR #1378](https://github.com/azure/communication-ui-library/pull/1378) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add FileCard component to chat composite ([PR #1353](https://github.com/azure/communication-ui-library/pull/1353) by anjulgarg@live.com)
- CallAndChatComopsite/mobile: Add a drawer with people button to show people pane ([PR #1485](https://github.com/azure/communication-ui-library/pull/1485) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add FileDownloadHandler for handling file downloads ([PR #1444](https://github.com/azure/communication-ui-library/pull/1444) by anjulgarg@live.com)
- Introduce People and Chat button icon customization in CallWithChatComposite ([PR #1524](https://github.com/azure/communication-ui-library/pull/1524) by 94866715+dmceachernmsft@users.noreply.github.com)
- Show device selection menu in MirophoneButton in MeetingComposite on desktop ([PR #1392](https://github.com/azure/communication-ui-library/pull/1392) by 82062616+prprabhu-ms@users.noreply.github.com)
- Updated the message thread component to display attached files in a message. ([PR #1494](https://github.com/azure/communication-ui-library/pull/1494) by 97124699+prabhjot-msft@users.noreply.github.com)
- Logic introduced to media gallery to allow for mobile detection for local camera switcher. ([PR #1391](https://github.com/azure/communication-ui-library/pull/1391) by 94866715+dmceachernmsft@users.noreply.github.com)
- Use split CameraButton in MeetingComposite control bar ([PR #1436](https://github.com/azure/communication-ui-library/pull/1436) by 82062616+prprabhu-ms@users.noreply.github.com)
- Initial Call and Meeting adapter support for making Adhoc calls directly to participants (i.e. without use of a groupID) ([PR #1431](https://github.com/azure/communication-ui-library/pull/1431) by 2684369+JamesBurnside@users.noreply.github.com)
- export createAzureCommunicationCallWithChatAdapterFromClients in npm package ([PR #1535](https://github.com/azure/communication-ui-library/pull/1535) by 2684369+JamesBurnside@users.noreply.github.com)
- Rename MeetingComposite to CallWithChatComposite ([PR #1446](https://github.com/azure/communication-ui-library/pull/1446) by 2684369+JamesBurnside@users.noreply.github.com)
- Align File card text to left and remove the right padding in message bubble when files are attached ([PR #1519](https://github.com/azure/communication-ui-library/pull/1519) by 97124699+prabhjot-msft@users.noreply.github.com)
- Rename 'afterDevicesButton' button placement ([PR #1478](https://github.com/azure/communication-ui-library/pull/1478) by 82062616+prprabhu-ms@users.noreply.github.com)
- [BREAKING CHANGE] Update createAzureCommunicationMeetingAdapter arguments to enable accepting just a teams link without having to provide an extracted chat thread ID. ([PR #1423](https://github.com/azure/communication-ui-library/pull/1423) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix typo: `CamerSwitcher` -> `CameraSwitcher` ([PR #1529](https://github.com/azure/communication-ui-library/pull/1529) by 2684369+JamesBurnside@users.noreply.github.com)
- FileUpload: Only show FileCard for files that don't contain errors. Only send files metadata in the message if it doesn't contain errors. ([PR #1539](https://github.com/azure/communication-ui-library/pull/1539) by anjulgarg@live.com)
- MeetingComposite: store messages since last time ChatPane was opened ([PR #1386](https://github.com/azure/communication-ui-library/pull/1386) by 94866715+dmceachernmsft@users.noreply.github.com)

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

## [1.0.0-beta.8](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.0-beta.8)

Wed, 17 Nov 2021 22:21:27 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.0-beta.7..@internal/react-composites_v1.0.0-beta.8)

### Changes

- Bugfix for disappearing lobby when joining a meeting ([PR #1091](https://github.com/azure/communication-ui-library/pull/1091) by anjulgarg@live.com)
- Make lobby screen strings and icons customizable ([PR #1023](https://github.com/azure/communication-ui-library/pull/1023) by 82062616+prprabhu-ms@users.noreply.github.com)
- Rename compressedMode CallCompositeOption to displayType ([PR #1096](https://github.com/azure/communication-ui-library/pull/1096) by 2684369+JamesBurnside@users.noreply.github.com)
- Update snapshots ([PR #1013](https://github.com/azure/communication-ui-library/pull/1013) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix for preventing video resize when isSpeaking indicator appears ([PR #1052](https://github.com/azure/communication-ui-library/pull/1052) by anjulgarg@live.com)
- Update localized strings for components and composites ([PR #1047](https://github.com/azure/communication-ui-library/pull/1047) by anjulgarg@live.com)
- Make lobby icon not be italicized ([PR #1044](https://github.com/azure/communication-ui-library/pull/1044) by 82062616+prprabhu-ms@users.noreply.github.com)
- Generalize adapterState.userId type ([PR #1039](https://github.com/azure/communication-ui-library/pull/1039) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update js bundle automation snapshots related to sendbutton dimensions ([PR #1082](https://github.com/azure/communication-ui-library/pull/1082) by 79329532+alkwa-msft@users.noreply.github.com)
- Optimize participant button flyout when on mobile ([PR #1002](https://github.com/azure/communication-ui-library/pull/1002) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix manual conversions of userId ([PR #1038](https://github.com/azure/communication-ui-library/pull/1038) by 82062616+prprabhu-ms@users.noreply.github.com)
- Uniformly capitalize icon names and fix intellisense ([PR #1054](https://github.com/azure/communication-ui-library/pull/1054) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add new icons for components ([PR #1008](https://github.com/azure/communication-ui-library/pull/1008) by 82062616+prprabhu-ms@users.noreply.github.com)
- Notify local participant when speaking while muted ([PR #987](https://github.com/azure/communication-ui-library/pull/987) by 82062616+prprabhu-ms@users.noreply.github.com)
- Remove call transfer from MeetingState ([PR #1105](https://github.com/azure/communication-ui-library/pull/1105) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update call end pages to be more uniform ([PR #1053](https://github.com/azure/communication-ui-library/pull/1053) by 82062616+prprabhu-ms@users.noreply.github.com)
- Use system default to initialize audio devices ([PR #1037](https://github.com/azure/communication-ui-library/pull/1037) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update composite automation snapshots ([PR #1070](https://github.com/azure/communication-ui-library/pull/1070) by miguelgamis@microsoft.com)
- Display 'You' instead of complete name in local video tile ([PR #1076](https://github.com/azure/communication-ui-library/pull/1076) by anjulgarg@live.com)
- Promote mobileView property on chat and call composites from alpha to public ([PR #1075](https://github.com/azure/communication-ui-library/pull/1075) by 2684369+JamesBurnside@users.noreply.github.com)
- Make mobileView prop a top level property on the composite ([PR #1083](https://github.com/azure/communication-ui-library/pull/1083) by 2684369+JamesBurnside@users.noreply.github.com)
- Replace old permissions banner with ErrorBar messages ([PR #1031](https://github.com/azure/communication-ui-library/pull/1031) by 82062616+prprabhu-ms@users.noreply.github.com)
- Display 'You' instead of complete name in local video tile ([PR #1076](https://github.com/azure/communication-ui-library/pull/1076) by anjulgarg@live.com)
- Fix background of lobby page and call gallery. Add drop shadow to the call controls bar in the Call Composite. ([PR #1066](https://github.com/azure/communication-ui-library/pull/1066) by 2684369+JamesBurnside@users.noreply.github.com)
- Update composite automation snapshots ([PR #1059](https://github.com/azure/communication-ui-library/pull/1059) by miguelgamis@microsoft.com)
- Bump headless calling SDK to 1.3.1-beta.1 ([PR #1056](https://github.com/azure/communication-ui-library/pull/1056) by 82062616+prprabhu-ms@users.noreply.github.com)
- Make all button width consistent in desktop mode ([PR #1078](https://github.com/azure/communication-ui-library/pull/1078) by jinan@microsoft.com)
- Update call composite options button to have larger flyout items when on mobile view ([PR #986](https://github.com/azure/communication-ui-library/pull/986) by 2684369+JamesBurnside@users.noreply.github.com)
- Add a button to rejoin call from end call page ([PR #1060](https://github.com/azure/communication-ui-library/pull/1060) by 82062616+prprabhu-ms@users.noreply.github.com)
- Removed Screenshare component in MediaGallery. VideoGallery component expected to handle screensharing. ([PR #999](https://github.com/azure/communication-ui-library/pull/999) by miguelgamis@microsoft.com)
- Add an interstitial for intermittent network failure ([PR #997](https://github.com/azure/communication-ui-library/pull/997) by 82062616+prprabhu-ms@users.noreply.github.com)
- Rename mobileView prop to formFactor ([PR #1095](https://github.com/azure/communication-ui-library/pull/1095) by 2684369+JamesBurnside@users.noreply.github.com)
- update snapshot for test ([PR #1040](https://github.com/azure/communication-ui-library/pull/1040) by jinan@microsoft.com)
- added strings to Locale for Call composite ([PR #974](https://github.com/azure/communication-ui-library/pull/974) by alcail@microsoft.com)
- Add NoticePage for failure to join due to network issue ([PR #1051](https://github.com/azure/communication-ui-library/pull/1051) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix camera button toggle on no-network tile ([PR #1049](https://github.com/azure/communication-ui-library/pull/1049) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)
- Fix chat initials not showing in the chat composite ([PR #1011](https://github.com/azure/communication-ui-library/pull/1011) by 2684369+JamesBurnside@users.noreply.github.com)
- Make lobby and no network interstitial darker and responsive ([PR #1021](https://github.com/azure/communication-ui-library/pull/1021) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add more data-ui-id tags for e2e tests ([PR #982](https://github.com/azure/communication-ui-library/pull/982) by 82062616+prprabhu-ms@users.noreply.github.com)
- Disabled Chat Composite Participant Pane by default - mark as `@beta` feature ([PR #1018](https://github.com/azure/communication-ui-library/pull/1018) by 2684369+JamesBurnside@users.noreply.github.com)
- Update meeting composite to be marked @beta instead of @alpha ([PR #1074](https://github.com/azure/communication-ui-library/pull/1074) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.7](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.0-beta.7)

Wed, 27 Oct 2021 19:40:46 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.0-beta.6..@internal/react-composites_v1.0.0-beta.7)

### Changes

- Ensure call controls on Meeting Lobby Page match those on when the call has been joined ([PR #940](https://github.com/azure/communication-ui-library/pull/940) by 2684369+JamesBurnside@users.noreply.github.com)
- Optimize call composite control bar on mobile ([PR #876](https://github.com/azure/communication-ui-library/pull/876) by 2684369+JamesBurnside@users.noreply.github.com)
- added screenSharing message string ([PR #944](https://github.com/azure/communication-ui-library/pull/944) by alcail@microsoft.com)
- Api changes according to reviews from ARB ([PR #859](https://github.com/azure/communication-ui-library/pull/859) by jinan@microsoft.com)
- Rename an internal enum value ([PR #969](https://github.com/azure/communication-ui-library/pull/969) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix lobby screen camera and mute buttons ([PR #943](https://github.com/azure/communication-ui-library/pull/943) by 2684369+JamesBurnside@users.noreply.github.com)
- exposing styles prop through chat composite to customize message thread ([PR #834](https://github.com/azure/communication-ui-library/pull/834) by alkwa@microsoft.com)
- Remove setPage API in CallAdapter and MeetingAdapter ([PR #975](https://github.com/azure/communication-ui-library/pull/975) by 2684369+JamesBurnside@users.noreply.github.com)
- Add tsdoc to chat adapter ([PR #870](https://github.com/azure/communication-ui-library/pull/870) by jinan@microsoft.com)
- Rename `Error.inner` to `Error.innerError` ([PR #882](https://github.com/azure/communication-ui-library/pull/882) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add events for diagnostic events to CallAdapter ([PR #963](https://github.com/azure/communication-ui-library/pull/963) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add devices button in mobile view of the call and meeting composites ([PR #866](https://github.com/azure/communication-ui-library/pull/866) by 2684369+JamesBurnside@users.noreply.github.com)
- Swap the position of the microphone and camera buttons on the local preview to match equivalent recent change to the control bar ([PR #959](https://github.com/azure/communication-ui-library/pull/959) by 2684369+JamesBurnside@users.noreply.github.com)
- Update to using new ChatMessage types ([PR #830](https://github.com/azure/communication-ui-library/pull/830) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update options button icon in call controls to be a settings gear ([PR #867](https://github.com/azure/communication-ui-library/pull/867) by 2684369+JamesBurnside@users.noreply.github.com)
- Add left call page ([PR #977](https://github.com/azure/communication-ui-library/pull/977) by 2684369+JamesBurnside@users.noreply.github.com)
- Add tsdoc for calling adapter method ([PR #868](https://github.com/azure/communication-ui-library/pull/868) by jinan@microsoft.com)
- Internal refactor of the ComplianceBanner ([PR #973](https://github.com/azure/communication-ui-library/pull/973) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add AccessDenied and RemovedFromCall pages to the Call Composite ([PR #900](https://github.com/azure/communication-ui-library/pull/900) by 2684369+JamesBurnside@users.noreply.github.com)
- Update message type ([PR #958](https://github.com/azure/communication-ui-library/pull/958) by jinan@microsoft.com)
- Remove screenshare button by default on Call Composite and Meeting Composite when in mobile view ([PR #875](https://github.com/azure/communication-ui-library/pull/875) by 2684369+JamesBurnside@users.noreply.github.com)
- remove toggleCamera api in adapter ([PR #885](https://github.com/azure/communication-ui-library/pull/885) by jinan@microsoft.com)
- Theme palette and effects acquired from theme context for SidePane. ([PR #941](https://github.com/azure/communication-ui-library/pull/941) by miguelgamis@microsoft.com)
- Add min width to the chat bubble ([PR #895](https://github.com/azure/communication-ui-library/pull/895) by jinan@microsoft.com)
- Update call controls to match mobile designs ([PR #891](https://github.com/azure/communication-ui-library/pull/891) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix weird height of single-line bubble ([PR #894](https://github.com/azure/communication-ui-library/pull/894) by jinan@microsoft.com)
- Support mobileView in call composite configuration page  ([PR #865](https://github.com/azure/communication-ui-library/pull/865) by 2684369+JamesBurnside@users.noreply.github.com)
- bump calling sdk to 1.2.3-beta.1 ([PR #967](https://github.com/azure/communication-ui-library/pull/967) by miguelgamis@microsoft.com)
- updating calling to use 1.2.2-beta.1 ([PR #945](https://github.com/azure/communication-ui-library/pull/945) by miguelgamis@microsoft.com)
- Use objects for call history in state ([PR #886](https://github.com/azure/communication-ui-library/pull/886) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add Lobby as a page in adapter state ([PR #898](https://github.com/azure/communication-ui-library/pull/898) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix huge media gallery in meetings when a participant is screen sharing ([PR #871](https://github.com/azure/communication-ui-library/pull/871) by 2684369+JamesBurnside@users.noreply.github.com)
- Add call details to Call Composite and Meeting Composite configuration pages ([PR #869](https://github.com/azure/communication-ui-library/pull/869) by 2684369+JamesBurnside@users.noreply.github.com)
- Disable participants and screenshare buttons on lobby screen ([PR #952](https://github.com/azure/communication-ui-library/pull/952) by 2684369+JamesBurnside@users.noreply.github.com)
- Delete a duplicate field definition ([PR #979](https://github.com/azure/communication-ui-library/pull/979) by 82062616+prprabhu-ms@users.noreply.github.com)
- HorizontalGallery right and left button icons exposed. ([PR #978](https://github.com/azure/communication-ui-library/pull/978) by miguelgamis@microsoft.com)
- Replace CommunicationUserKind with CommunicationUserIdentifier in constructor ([PR #884](https://github.com/azure/communication-ui-library/pull/884) by 82062616+prprabhu-ms@users.noreply.github.com)
- Start triggering 'diagnosticChanged' event ([PR #964](https://github.com/azure/communication-ui-library/pull/964) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update lobby page to match the call page ([PR #902](https://github.com/azure/communication-ui-library/pull/902) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.0-beta.5..@internal/react-composites_v1.0.0-beta.6)

### Changes

- Update meeting examples to make use of the MeetingAdapter ([PR #700](https://github.com/azure/communication-ui-library/pull/700) by 2684369+JamesBurnside@users.noreply.github.com)
- Construct meeting state for the meeting composite adapter. ([PR #698](https://github.com/azure/communication-ui-library/pull/698) by 2684369+JamesBurnside@users.noreply.github.com)
- TDBuild - updating localized resource files. ([PR #836](https://github.com/azure/communication-ui-library/pull/836) by miguelgamis@microsoft.com)
- check if speaker selection is possible ([PR #771](https://github.com/azure/communication-ui-library/pull/771) by 79329532+alkwa-msft@users.noreply.github.com)
- TDBuild - updating localized resource files. ([PR #794](https://github.com/azure/communication-ui-library/pull/794) by miguelgamis@microsoft.com)
- Bump chat sdk to version 1.1.0 ([PR #816](https://github.com/azure/communication-ui-library/pull/816) by jinan@microsoft.com)
- Adding feature toggles to Chat and Call Composites ([PR #765](https://github.com/azure/communication-ui-library/pull/765) by anjulgarg@live.com)
- Add release tags to API and tweak callback names to match events ([PR #837](https://github.com/azure/communication-ui-library/pull/837) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adjust api comments - iteration 2 ([PR #776](https://github.com/azure/communication-ui-library/pull/776) by jinan@microsoft.com)
- Breaking Change: Update Feature Toggle API. Developers will need to use `options` prop in Composite instead of `hiddenElements` ([PR #800](https://github.com/azure/communication-ui-library/pull/800) by anjulgarg@live.com)
- Make IdentifierProvider @internal ([PR #825](https://github.com/azure/communication-ui-library/pull/825) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add custom menu items injection support to Call and Chat Composites ([PR #795](https://github.com/azure/communication-ui-library/pull/795) by anjulgarg@live.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)
- Support editing and deleting chat messages in the meeting composite adapter ([PR #797](https://github.com/azure/communication-ui-library/pull/797) by 2684369+JamesBurnside@users.noreply.github.com)
- Add isTeamsCall to call adapter state ([PR #798](https://github.com/azure/communication-ui-library/pull/798) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix meeting composite requesting access to the meeting chat too early ([PR #783](https://github.com/azure/communication-ui-library/pull/783) by 2684369+JamesBurnside@users.noreply.github.com)
- Add mobileView alpha flag to call and meeting composites ([PR #822](https://github.com/azure/communication-ui-library/pull/822) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.0-beta.4..@internal/react-composites_v1.0.0-beta.5)

### Changes

- Expose errors in CallAdapter ([PR #683](https://github.com/azure/communication-ui-library/pull/683) by 82062616+prprabhu-ms@users.noreply.github.com)
- Show bannrs within call screen ([PR #750](https://github.com/azure/communication-ui-library/pull/750) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adjust most comments in internal api review ([PR #724](https://github.com/azure/communication-ui-library/pull/724) by jinan@microsoft.com)
- Localized call and chat composite strings ([PR #739](https://github.com/azure/communication-ui-library/pull/739) by miguelgamis@microsoft.com)
- Apply chat sdk hotfix ([PR #747](https://github.com/azure/communication-ui-library/pull/747) by jinan@microsoft.com)
- Add initial meeting state and meeting adapter state interfaces ([PR #679](https://github.com/azure/communication-ui-library/pull/679) by 2684369+JamesBurnside@users.noreply.github.com)
- Work around for menu disappearing ([PR #717](https://github.com/azure/communication-ui-library/pull/717) by jinan@microsoft.com)
- Updating composite automation snapshots ([PR #654](https://github.com/azure/communication-ui-library/pull/654) by jinan@microsoft.com)
- Localize errors in CallComposite ([PR #714](https://github.com/azure/communication-ui-library/pull/714) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix unstale participant list test ([PR #709](https://github.com/azure/communication-ui-library/pull/709) by jinan@microsoft.com)
- Add flags for CallComposite visual elements ([PR #722](https://github.com/azure/communication-ui-library/pull/722) by 82062616+prprabhu-ms@users.noreply.github.com)
- Show ACS errors via ErrorBar in CallComposite ([PR #702](https://github.com/azure/communication-ui-library/pull/702) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add active and dominant speaker support to screenshare screen. ([PR #748](https://github.com/azure/communication-ui-library/pull/748) by anjulgarg@live.com)
- Add message edit feature ([PR #734](https://github.com/azure/communication-ui-library/pull/734) by jinan@microsoft.com)
- Generate snapshot in github action for composite ([PR #694](https://github.com/azure/communication-ui-library/pull/694) by jinan@microsoft.com)
- Add different types for ChatComposite and CallCompposite Icons ([PR #757](https://github.com/azure/communication-ui-library/pull/757) by anjulgarg@live.com)
- Custom Icons injection in components and composites. ([PR #716](https://github.com/azure/communication-ui-library/pull/716) by anjulgarg@live.com)
- Fixed English (US) and English (GB) exports. ([PR #737](https://github.com/azure/communication-ui-library/pull/737) by miguelgamis@microsoft.com)
- Add initial meeting adapter interface ([PR #678](https://github.com/azure/communication-ui-library/pull/678) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed theming for local preview placeholder for calling composite. ([PR #692](https://github.com/azure/communication-ui-library/pull/692) by miguelgamis@microsoft.com)
- updating calling to use 1.2.1-beta.1 ([PR #758](https://github.com/azure/communication-ui-library/pull/758) by 79329532+alkwa-msft@users.noreply.github.com)
- Delete API to clear stateful errors ([PR #756](https://github.com/azure/communication-ui-library/pull/756) by 82062616+prprabhu-ms@users.noreply.github.com)
- Updated locale files. ([PR #712](https://github.com/azure/communication-ui-library/pull/712) by miguelgamis@microsoft.com)
- Strongly type errors from adapters ([PR #761](https://github.com/azure/communication-ui-library/pull/761) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump acs-ui-common dep ([PR #732](https://github.com/azure/communication-ui-library/pull/732) by 82062616+prprabhu-ms@users.noreply.github.com)
- Rename component locale type names to match composites ([PR #720](https://github.com/azure/communication-ui-library/pull/720) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix the problem of opacity animation ([PR #715](https://github.com/azure/communication-ui-library/pull/715) by jinan@microsoft.com)
-  Add custom avatar data injection for composites ([PR #677](https://github.com/azure/communication-ui-library/pull/677) by anjulgarg@live.com)
- Rename ChatCompositeVisualElements ([PR #721](https://github.com/azure/communication-ui-library/pull/721) by 82062616+prprabhu-ms@users.noreply.github.com)
- Meeting adapter implementations - forward events to call and chat child adapters ([PR #696](https://github.com/azure/communication-ui-library/pull/696) by 2684369+JamesBurnside@users.noreply.github.com)
- Refactored call join error handling ([PR #760](https://github.com/azure/communication-ui-library/pull/760) by miguelgamis@microsoft.com)
- Create stub `AzureCommunicationMeetingAdapter` ([PR #695](https://github.com/azure/communication-ui-library/pull/695) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove identifiers from composite constructor signature ([PR #728](https://github.com/azure/communication-ui-library/pull/728) by 82062616+prprabhu-ms@users.noreply.github.com)
- Track dismissed errors internally in ErrorBar ([PR #754](https://github.com/azure/communication-ui-library/pull/754) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-composites_v1.0.0-beta.3..@internal/react-composites_v1.0.0-beta.4)

### Changes

- Fix screenshare dialog eating user input across the whole web page ([PR #651](https://github.com/azure/communication-ui-library/pull/651) by 2684369+JamesBurnside@users.noreply.github.com)
- updated Typescript version to 4.3.5 ([PR #645](https://github.com/azure/communication-ui-library/pull/645) by alcail@microsoft.com)
- Add remove participant button to the Meeting Composite ([PR #673](https://github.com/azure/communication-ui-library/pull/673) by 2684369+JamesBurnside@users.noreply.github.com)
- undefined ([PR #599](https://github.com/azure/communication-ui-library/pull/599) by 2684369+JamesBurnside@users.noreply.github.com)
- Return call from `CallComposite.joinCall` ([PR #644](https://github.com/azure/communication-ui-library/pull/644) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix screenshare not displaying for call attendees ([PR #655](https://github.com/azure/communication-ui-library/pull/655) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix fluent theme provider not being applied to the meeting composite ([PR #666](https://github.com/azure/communication-ui-library/pull/666) by 2684369+JamesBurnside@users.noreply.github.com)
- Ensure call composite media gallery has a minimum height ([PR #616](https://github.com/azure/communication-ui-library/pull/616) by 2684369+JamesBurnside@users.noreply.github.com)
- Add meeting composite ([PR #614](https://github.com/azure/communication-ui-library/pull/614) by 2684369+JamesBurnside@users.noreply.github.com)
- Add remove participant button to Call Composite ([PR #671](https://github.com/azure/communication-ui-library/pull/671) by 2684369+JamesBurnside@users.noreply.github.com)
- Update createAzureCommunicationCallAdapter constructor to take in a named object instead of seperate args ([PR #625](https://github.com/azure/communication-ui-library/pull/625) by 2684369+JamesBurnside@users.noreply.github.com)
- Added rtl property to composites ([PR #658](https://github.com/azure/communication-ui-library/pull/658) by miguelgamis@microsoft.com)
- fix meeting pane overlapping the call control bar ([PR #627](https://github.com/azure/communication-ui-library/pull/627) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix partially composed chat messages being lost when closing and reopening the chat pane in the meeting composite ([PR #662](https://github.com/azure/communication-ui-library/pull/662) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix permission banner styling - allow multiline ([PR #665](https://github.com/azure/communication-ui-library/pull/665) by 2684369+JamesBurnside@users.noreply.github.com)
- Stop using deleted prop VideoTile.isVideoReady ([PR #646](https://github.com/azure/communication-ui-library/pull/646) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix local video icon + avatar not showing ([PR #664](https://github.com/azure/communication-ui-library/pull/664) by jinan@microsoft.com)
- Fixing video gallery styling issues during and after screenshare ([PR #649](https://github.com/azure/communication-ui-library/pull/649) by anjulgarg@live.com)
- bugfix: Show avatar when video is off ([PR #676](https://github.com/azure/communication-ui-library/pull/676) by 82062616+prprabhu-ms@users.noreply.github.com)
- Exposed locale prop to localize composites. ([PR #595](https://github.com/azure/communication-ui-library/pull/595) by miguelgamis@microsoft.com)
- Update createAzureCommunicationChatAdapter constructor to take in a named object instead of seperate args ([PR #626](https://github.com/azure/communication-ui-library/pull/626) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/@internal/react-composites_v1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/react-composites_v1.0.0-beta.2..@internal/react-composites_v1.0.0-beta.3)

### Changes

- Make participant pane in the chat composite optional. Disabled by default. ([PR #541](https://github.com/azure/communication-ui-library/pull/541) by 2684369+JamesBurnside@users.noreply.github.com)
- Use ErrorBar component in ChatComposite ([PR #574](https://github.com/azure/communication-ui-library/pull/574) by 82062616+prprabhu-ms@users.noreply.github.com)
- Only emit 'error' on errors teed to state ([PR #535](https://github.com/azure/communication-ui-library/pull/535) by prprabhu@microsoft.com)
- Accept pre-constructed credential in adapter factory functions ([PR #590](https://github.com/azure/communication-ui-library/pull/590) by 82062616+prprabhu-ms@users.noreply.github.com)
- Trigger 'error' event for failure in chat methods ([PR #549](https://github.com/azure/communication-ui-library/pull/549) by 82062616+prprabhu-ms@users.noreply.github.com)
- Hide ErrorBar in ChatComposite behind a feature flag ([PR #608](https://github.com/azure/communication-ui-library/pull/608) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bugfix to prevent options menu from getting hidden every time a participant joins or leaves ([PR #609](https://github.com/azure/communication-ui-library/pull/609) by anjulgarg@live.com)
- Bind all methods of CallAdapter on construction ([PR #558](https://github.com/azure/communication-ui-library/pull/558) by 82062616+prprabhu-ms@users.noreply.github.com)
- Drop duplicate thread status banner ([PR #582](https://github.com/azure/communication-ui-library/pull/582) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add chat e2e tests ([PR #594](https://github.com/azure/communication-ui-library/pull/594) by anjulgarg@live.com)
- Bind all methods of ChatAdaptor on construction ([PR #557](https://github.com/azure/communication-ui-library/pull/557) by 82062616+prprabhu-ms@users.noreply.github.com)
-  Add E2E browser tests for chat composite ([PR #517](https://github.com/azure/communication-ui-library/pull/517) by anjulgarg@live.com)
- Remove getCall from selector Use more specific props in the call to target the right update ([PR #571](https://github.com/azure/communication-ui-library/pull/571) by jinan@microsoft.com)
- Remove sendBoxMaxLength option from chat compsite" ([PR #589](https://github.com/azure/communication-ui-library/pull/589) by 2684369+JamesBurnside@users.noreply.github.com)
- Add E2E Chat Composite tests ([PR #578](https://github.com/azure/communication-ui-library/pull/578) by anjulgarg@live.com)
- Using new React hook useTheme from react-components. ([PR #572](https://github.com/azure/communication-ui-library/pull/572) by miguelgamis@microsoft.com)
- Allow chat composite topic to be hidden ([PR #587](https://github.com/azure/communication-ui-library/pull/587) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix error handling of failures in `ChatThreadClient.listMessages` ([PR #550](https://github.com/azure/communication-ui-library/pull/550) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add identifier injection mechanism in components for e2e testing ([PR #556](https://github.com/azure/communication-ui-library/pull/556) by anjulgarg@live.com)

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/react-composites_v1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/react-composites_v1.0.0-beta.1..react-composites_v1.0.0-beta.2)

### Changes

- gallery height fix for safari ([PR #382](https://github.com/azure/communication-ui-library/pull/382) by alkwa@microsoft.com)
- apply ux changes to composite ([PR #421](https://github.com/azure/communication-ui-library/pull/421) by easony@microsoft.com)
- Update to use Array for unparentedViews ([PR #469](https://github.com/azure/communication-ui-library/pull/469) by prprabhu@microsoft.com)
- Remove @fluentui/react-northstar-icons, use only @fluentui/react-icons ([PR #143](https://github.com/azure/communication-ui-library/pull/143) by mail@jamesburnside.com)
- Use class methods in chat adapter implementation ([PR #515](https://github.com/azure/communication-ui-library/pull/515) by prprabhu@microsoft.com)
- Add error handler for teams interop call denial ([PR #376](https://github.com/azure/communication-ui-library/pull/376) by anjulgarg@live.com)
- Added page to handle removed partiicipant in call composite. ([PR #408](https://github.com/azure/communication-ui-library/pull/408) by miguelgamis@microsoft.com)
- Set default state of permission to true Move deviceManager to outside selector package Remove usage of optionSelector, use getSelector instead ([PR #383](https://github.com/azure/communication-ui-library/pull/383) by jinan@microsoft.com)
- Show mute indicator while screensharing. Fix icon padding ([PR #502](https://github.com/azure/communication-ui-library/pull/502) by anjulgarg@live.com)
- Disable start call button when microphone permission is denied ([PR #427](https://github.com/azure/communication-ui-library/pull/427) by allenhwang@microsoft.com)
- removing group call references and fixing call composite stories ([PR #370](https://github.com/azure/communication-ui-library/pull/370) by alkwa@microsoft.com)
- Update references to threads object ([PR #461](https://github.com/azure/communication-ui-library/pull/461) by prprabhu@microsoft.com)
- Dispose view when stream is not available ([PR #404](https://github.com/azure/communication-ui-library/pull/404) by jinan@microsoft.com)
- Beautify style of chat composite ([PR #379](https://github.com/azure/communication-ui-library/pull/379) by jinan@microsoft.com)
- Add userId to ChatAdapter factory function ([PR #420](https://github.com/azure/communication-ui-library/pull/420) by prprabhu@microsoft.com)
- Push FluentThemeProvider inside composites ([PR #364](https://github.com/azure/communication-ui-library/pull/364) by prprabhu@microsoft.com)
- Add options to onSelectCamera and onToggleCamera ([PR #436](https://github.com/azure/communication-ui-library/pull/436) by easony@microsoft.com)
- Adding floating localvideopreview layout to VideoGallery. ([PR #425](https://github.com/azure/communication-ui-library/pull/425) by anjulgarg@live.com)
- add ParticipantsButtonSelector to calling composite ([PR #452](https://github.com/azure/communication-ui-library/pull/452) by alcail@microsoft.com)
- Drop internal export of getIdentifierFromToken ([PR #411](https://github.com/azure/communication-ui-library/pull/411) by prprabhu@microsoft.com)
- Add device options button to calling composite ([PR #494](https://github.com/azure/communication-ui-library/pull/494) by mail@jamesburnside.com)
- Add explicit userId to CallAdapter constructor arguments ([PR #419](https://github.com/azure/communication-ui-library/pull/419) by prprabhu@microsoft.com)
- Move error handlers, WithErrorHandling to OneToOne composite ([PR #368](https://github.com/azure/communication-ui-library/pull/368) by easony@microsoft.com)
- Automated browser test setup for Chat Composite ([PR #504](https://github.com/azure/communication-ui-library/pull/504) by anjulgarg@live.com)
- Update to fluentui version 8 ([PR #448](https://github.com/azure/communication-ui-library/pull/448) by mail@jamesburnside.com)
- Disable microphone and camera if permission is not granted ([PR #358](https://github.com/azure/communication-ui-library/pull/358) by allenhwang@microsoft.com)
- update react peer deps to be >=16.8.0 <18.0.0 ([PR #450](https://github.com/azure/communication-ui-library/pull/450) by mail@jamesburnside.com)
- CallAdapter: store userId as CommunicationUserKind ([PR #423](https://github.com/azure/communication-ui-library/pull/423) by prprabhu@microsoft.com)
- Update to use Object for chatMessages ([PR #463](https://github.com/azure/communication-ui-library/pull/463) by prprabhu@microsoft.com)
- Expose more customized api for rendering ([PR #457](https://github.com/azure/communication-ui-library/pull/457) by jinan@microsoft.com)
- add teams interop functionality into calling composite ([PR #355](https://github.com/azure/communication-ui-library/pull/355) by alkwa@microsoft.com)
- Add tooltip when permission is not granted in configuration screen ([PR #373](https://github.com/azure/communication-ui-library/pull/373) by allenhwang@microsoft.com)
- Drop spurious references to userId in lobby ([PR #412](https://github.com/azure/communication-ui-library/pull/412) by prprabhu@microsoft.com)
- Implement new screenshare popup design update ([PR #424](https://github.com/azure/communication-ui-library/pull/424) by allenhwang@microsoft.com)
- Notify ChatComposite user when they leave a thread ([PR #380](https://github.com/azure/communication-ui-library/pull/380) by prprabhu@microsoft.com)
- Fix styling of CallComposite controls ([PR #434](https://github.com/azure/communication-ui-library/pull/434) by prprabhu@microsoft.com)
- upgrading version of calling to 1.1.0-beta.2 ([PR #493](https://github.com/azure/communication-ui-library/pull/493) by alkwa@microsoft.com)
- Add permissions banner ([PR #399](https://github.com/azure/communication-ui-library/pull/399) by allenhwang@microsoft.com)
- Make `getIdFromToken` internal to OneToOneCallComposite ([PR #432](https://github.com/azure/communication-ui-library/pull/432) by prprabhu@microsoft.com)
- Update references to CallClientState maps ([PR #459](https://github.com/azure/communication-ui-library/pull/459) by prprabhu@microsoft.com)
- Update to use Object for chat participants ([PR #462](https://github.com/azure/communication-ui-library/pull/462) by prprabhu@microsoft.com)
- Delete OneToOne call ([PR #435](https://github.com/azure/communication-ui-library/pull/435) by prprabhu@microsoft.com)
- Update parameter to Stateful client due to API change ([PR #393](https://github.com/azure/communication-ui-library/pull/393) by allenhwang@microsoft.com)
- Bump prettier version and reformat ([PR #505](https://github.com/azure/communication-ui-library/pull/505) by prprabhu@microsoft.com)
- Add error handling facilities to ChatAdapter ([PR #510](https://github.com/azure/communication-ui-library/pull/510) by prprabhu@microsoft.com)
- Small responsive fixes for calling composite ([PR #536](https://github.com/azure/communication-ui-library/pull/536) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/react-composites_v1.0.0-beta.1)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- Fix wrong object passed to StreamMedia ([PR #359](https://github.com/azure/communication-ui-library/pull/359) by allenhwang@microsoft.com)
- Add leave call event Fix double leave call ([PR #349](https://github.com/azure/communication-ui-library/pull/349) by jinan@microsoft.com)
- Move calling providers and hooks to the calling selector package ([PR #342](https://github.com/azure/communication-ui-library/pull/342) by easony@microsoft.com)
- Add check to avoid modifications after unmount ([PR #295](https://github.com/azure/communication-ui-library/pull/295) by allenhwang@microsoft.com)
- Change how we get preview renders to use the new api ([PR #279](https://github.com/azure/communication-ui-library/pull/279) by allenhwang@microsoft.com)
- Rename state-only shadow type for Call ([PR #328](https://github.com/azure/communication-ui-library/pull/328) by prprabhu@microsoft.com)
- Rename DTOs that shadow objects from Calling SDK ([PR #333](https://github.com/azure/communication-ui-library/pull/333) by prprabhu@microsoft.com)
- fix scroll bar for chat screen ([PR #351](https://github.com/azure/communication-ui-library/pull/351) by jinan@microsoft.com)
- Update sendMessage back to void return value ([PR #340](https://github.com/azure/communication-ui-library/pull/340) by jinan@microsoft.com)
- Add event support for chat composite ([PR #324](https://github.com/azure/communication-ui-library/pull/324) by jinan@microsoft.com)
- Add on render avatar for calling composite ([PR #321](https://github.com/azure/communication-ui-library/pull/321) by jinan@microsoft.com)
- fix rerender issue ([PR #334](https://github.com/azure/communication-ui-library/pull/334) by jinan@microsoft.com)
- Fix local preview mic problem in composite ([PR #322](https://github.com/azure/communication-ui-library/pull/322) by jinan@microsoft.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-library/pull/315) by prprabhu@microsoft.com)
- Rename DeviceManager to avoid name conflict ([PR #319](https://github.com/azure/communication-ui-library/pull/319) by prprabhu@microsoft.com)
- removed all Text/Label children of VideoTile, also renamed local/remoteParticipantName to local/remoteParticipantDisplay name and removed label props from RemoteVideoTile  ([PR #313](https://github.com/azure/communication-ui-library/pull/313) by alcail@microsoft.com)
- Move common type to @internal/acs-ui-common ([PR #303](https://github.com/azure/communication-ui-library/pull/303) by prprabhu@microsoft.com)
- add event implemeration to calling adapter ([PR #311](https://github.com/azure/communication-ui-library/pull/311) by jinan@microsoft.com)
- [#2404092] Adding stateful attributes to CallClientProvider for starting a call with camera on/off ([PR #292](https://github.com/azure/communication-ui-library/pull/292) by anjulgarg@live.com)
- Move legacy mappers, providers and hooks to 1to1 composite ([PR #309](https://github.com/azure/communication-ui-library/pull/309) by easony@microsoft.com)
- Add chat header with thread topic name ([PR #300](https://github.com/azure/communication-ui-library/pull/300) by prprabhu@microsoft.com)
- Add selectors and handlers for Calling ([PR #232](https://github.com/azure/communication-ui-library/pull/232) by anjulgarg@live.com)
- Add ParticipantList to ChatComposite ([PR #267](https://github.com/azure/communication-ui-library/pull/267) by prprabhu@microsoft.com)
- Decouple composite from ACS client and add implement an acs adapter for the interface ([PR #229](https://github.com/azure/communication-ui-library/pull/229) by jinan@microsoft.com)
- Using new local preview in calling composite ([PR #212](https://github.com/azure/communication-ui-library/pull/212) by alkwa@microsoft.com)
- changing invertedVideo to isMirrored ([PR #268](https://github.com/azure/communication-ui-library/pull/268) by alkwa@microsoft.com)
- Removed WebUiChatParticipant type. ([PR #239](https://github.com/azure/communication-ui-library/pull/239) by miguelgamis@microsoft.com)
- adding in MessageContentType for different message rendering in message thread ([PR #266](https://github.com/azure/communication-ui-library/pull/266) by alkwa@microsoft.com)
- renamed VideoTile props placeholderProvider to placeholder ([PR #284](https://github.com/azure/communication-ui-library/pull/284) by alcail@microsoft.com)
- Rename GroupChat* to Chat* in composites ([PR #252](https://github.com/azure/communication-ui-library/pull/252) by prprabhu@microsoft.com)
- update name and avatarName to displayName ([PR #278](https://github.com/azure/communication-ui-library/pull/278) by alcail@microsoft.com)
- Replacing admininstration with identity dependency ([PR #235](https://github.com/azure/communication-ui-library/pull/235) by alkwa@microsoft.com)
- Prune exports and add chat composite to @azure/communication-react ([PR #276](https://github.com/azure/communication-ui-library/pull/276) by mail@jamesburnside.com)
- migrate call composite to statuful ([PR #290](https://github.com/azure/communication-ui-library/pull/290) by easony@microsoft.com)
- added CallingTheme and used it for EndCallButton styles ([PR #249](https://github.com/azure/communication-ui-library/pull/249) by alcail@microsoft.com)
- Create composite package. Migrate files from @internal/react-components to new package. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- First stab at GroupCallAdapter interface ([PR #216](https://github.com/azure/communication-ui-library/pull/216) by domessin@microsoft.com)
- rename declarative packages to stateful ([PR #250](https://github.com/azure/communication-ui-library/pull/250) by domessin@microsoft.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-library/pull/225) by domessin@microsoft.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-library/pull/231) by mail@jamesburnside.com)
- Add calling handler and selector for VideoGallery and ScreenShare ([PR #277](https://github.com/azure/communication-ui-library/pull/277) by anjulgarg@live.com)
- Bump azure-communication-{chat, common, identity} to 1.0.0 ([PR #234](https://github.com/azure/communication-ui-library/pull/234) by prprabhu@microsoft.com)
- Update from renaming declarative to stateful ([PR #258](https://github.com/azure/communication-ui-library/pull/258) by mail@jamesburnside.com)
- renamed startRenderVideo to createView and stopRenderVideo to disposeView ([PR #294](https://github.com/azure/communication-ui-library/pull/294) by alcail@microsoft.com)
