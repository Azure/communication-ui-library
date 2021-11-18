# Change Log - @azure/communication-react

This log was last generated on Wed, 17 Nov 2021 22:21:27 GMT and should not be manually modified.

<!-- Start content -->

## [1.0.0-beta.8](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.0.0-beta.8)

acs-ui-common

- centralized localization utils to acs-ui-common ([PR #974](https://github.com/azure/communication-ui-library/pull/974) by alcail@microsoft.com)
- Fully implement identifier to/from MRI conversion ([PR #1038](https://github.com/azure/communication-ui-library/pull/1038) by 82062616+prprabhu-ms@users.noreply.github.com)

calling-component-bindings

- Disallow removing Teams participants from call ([PR #1035](https://github.com/azure/communication-ui-library/pull/1035) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add an internal util function for checking if a call is in lobby ([PR #1091](https://github.com/azure/communication-ui-library/pull/1091) by anjulgarg@live.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)
- Translate several UFDs to ErrorBar notifications ([PR #1008](https://github.com/azure/communication-ui-library/pull/1008) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump headless calling SDK to 1.3.1-beta.1 ([PR #1056](https://github.com/azure/communication-ui-library/pull/1056) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add ErrorBar messages when missing device permissions ([PR #1031](https://github.com/azure/communication-ui-library/pull/1031) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update OptionsButton to DevicesButton ([PR #1084](https://github.com/azure/communication-ui-library/pull/1084) by 2684369+JamesBurnside@users.noreply.github.com)
- Drop error bar for networkReconnect condition ([PR #997](https://github.com/azure/communication-ui-library/pull/997) by 82062616+prprabhu-ms@users.noreply.github.com)

calling-stateful-client


- Bump headless calling SDK to 1.3.1-beta.1 ([PR #1056](https://github.com/azure/communication-ui-library/pull/1056) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)
- Remove call transfer feature ([PR #1105](https://github.com/azure/communication-ui-library/pull/1105) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add diagnostics hint and expose diagnostics API ([PR #1067](https://github.com/azure/communication-ui-library/pull/1067) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix manual conversions of userID ([PR #1038](https://github.com/azure/communication-ui-library/pull/1038) by 82062616+prprabhu-ms@users.noreply.github.com)
- Mark StatefulCallClient `diagnostics` property as public and `transfer` property as beta ([PR #1072](https://github.com/azure/communication-ui-library/pull/1072) by 2684369+JamesBurnside@users.noreply.github.com)
- Generalize state.userId type ([PR #1039](https://github.com/azure/communication-ui-library/pull/1039) by 82062616+prprabhu-ms@users.noreply.github.com)

chat-component-bindings


- Update MessageThread selector to filter out unsupported messages ([PR #1007](https://github.com/azure/communication-ui-library/pull/1007) by 2684369+JamesBurnside@users.noreply.github.com)
- Disallow removing Teams participants from chat ([PR #1035](https://github.com/azure/communication-ui-library/pull/1035) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)

react-components


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

react-composites


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

## [1.0.0-beta.7](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.7)

Mon, 1 Nov 2021 12:57:14 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.6..1.0.0-beta.7)

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
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0-beta.5..1.0.0-beta.6)

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

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.0.0-beta.4..@azure/communication-react_v1.0.0-beta.5)

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


## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.0.0-beta.3..@azure/communication-react_v1.0.0-beta.4)

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

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.0.0-beta.2..@azure/communication-react_v1.0.0-beta.3)

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

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@azure/communication-react_v1.0.0-beta.1..@azure/communication-react_v1.0.0-beta.2)

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

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.0.0-beta.1)

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
