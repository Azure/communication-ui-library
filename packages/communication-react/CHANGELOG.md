# Change Log - @azure/communication-react

This log was last generated on Tue, 28 Sep 2021 19:19:18 GMT and should not be manually modified.

<!-- Start content -->

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/react-components_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/react-components_v1.0.0-beta.5..@internal/react-components_v1.0.0-beta.6)

### @internal/react-components

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

### @internal/react-composites

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

### @internal/chat-stateful-client

- Update use of internal exported function ([PR #823](https://github.com/azure/communication-ui-library/pull/823) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump chat sdk to version 1.1.0 ([PR #816](https://github.com/azure/communication-ui-library/pull/816) by jinan@microsoft.com)
- Stop clearing errors in ChatClientState ([PR #781](https://github.com/azure/communication-ui-library/pull/781) by 82062616+prprabhu-ms@users.noreply.github.com)
- Drop state modification API ([PR #782](https://github.com/azure/communication-ui-library/pull/782) by 82062616+prprabhu-ms@users.noreply.github.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)

### @internal/chat-component-bindings

- Bump chat sdk to version 1.1.0 ([PR #816](https://github.com/azure/communication-ui-library/pull/816) by jinan@microsoft.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add edited tag to messages ([PR #759](https://github.com/azure/communication-ui-library/pull/759) by jinan@microsoft.com)

### @internal/calling-stateful-client

- Drop state modification API ([PR #782](https://github.com/azure/communication-ui-library/pull/782) by 82062616+prprabhu-ms@users.noreply.github.com)
- Stop clearing errors from calling stateful client ([PR #781](https://github.com/azure/communication-ui-library/pull/781) by 82062616+prprabhu-ms@users.noreply.github.com)
- Document all public API and hide leaked exports ([PR #811](https://github.com/azure/communication-ui-library/pull/811) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix feature types to conform to naming convention ([PR #832](https://github.com/azure/communication-ui-library/pull/832) by 82062616+prprabhu-ms@users.noreply.github.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)

### @internal/calling-component-bindings

- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adjust api comments - iteration 2 ([PR #776](https://github.com/azure/communication-ui-library/pull/776) by jinan@microsoft.com)
- Document all public API and hide leaked exports ([PR #811](https://github.com/azure/communication-ui-library/pull/811) by 82062616+prprabhu-ms@users.noreply.github.com)

### @internal/acs-ui-common

- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add release tags to all public API ([PR #823](https://github.com/azure/communication-ui-library/pull/823) by 82062616+prprabhu-ms@users.noreply.github.com)

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
  * OptionsButton
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
