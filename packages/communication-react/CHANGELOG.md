# Change Log - @azure/communication-react

This log was last generated on Mon, 13 Jun 2022 18:29:25 GMT and should not be manually modified.

<!-- Start content -->

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
