# Change Log - @azure/communication-react

This log was last generated on Thu, 22 Jul 2021 17:42:41 GMT and should not be manually modified.

<!-- Start content -->

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

### Storybook page changes
* Fixing link in "Using Composites in a non-react environment"

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
