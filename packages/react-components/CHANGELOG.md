# Change Log - @internal/react-components

This log was last generated on Tue, 01 Mar 2022 16:42:57 GMT and should not be manually modified.

<!-- Start content -->

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
