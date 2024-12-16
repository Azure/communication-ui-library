# Change Log - @azure/communication-react

<!-- This log was last generated on Mon, 16 Dec 2024 19:44:14 GMT and should not be manually modified. -->

<!-- Start content -->

## [1.22.0](https://github.com/azure/communication-ui-library/tree/1.22.0)

Mon, 16 Dec 2024 19:44:14 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.22.0-beta.1...1.22.0)

### Improvements
- Update nanoid package ([PR #5490](https://github.com/azure/communication-ui-library/pull/5490) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update `@azure/communication-calling-effects` to 1.1.2 ([PR #5407](https://github.com/azure/communication-ui-library/pull/5407) by 2684369+JamesBurnside@users.noreply.github.com)
- Make Start Captions Button a public component ([PR #5499](https://github.com/azure/communication-ui-library/pull/5499) by 96077406+carocao-msft@users.noreply.github.com)
- Make Captions Setting Modal a public component ([PR #5469](https://github.com/azure/communication-ui-library/pull/5469) by 96077406+carocao-msft@users.noreply.github.com)
- Make Captions Banner a public component ([PR #5460](https://github.com/azure/communication-ui-library/pull/5460) by 96077406+carocao-msft@users.noreply.github.com)

### Bug Fixes
- Fix an issue where edited message could be saved without the content and attachments when rich text editor is enabled ([PR #5434](https://github.com/azure/communication-ui-library/pull/5434) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix screenshare tab outline color when presenting ([PR #5431](https://github.com/azure/communication-ui-library/pull/5431) by 2684369+JamesBurnside@users.noreply.github.com)
- In CallCompsite, return focus to control bar when captions is closed from the captions settings button ([PR #5438](https://github.com/azure/communication-ui-library/pull/5438) by 2684369+JamesBurnside@users.noreply.github.com)
- Update configuration page local preview to show 'Video is loading' while camera is switching on or switching source. Also disable camera button while swiching source. ([PR #5430](https://github.com/azure/communication-ui-library/pull/5430) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix error bar icon size for low network quality and local video freeze ([PR #5282](https://github.com/azure/communication-ui-library/pull/5282) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix regression that caused minor inconsistent padding between connecting and call pages in CallComposite ([PR #5423](https://github.com/azure/communication-ui-library/pull/5423) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix an issue where text editors didn't trigger typing events when using input method editor ([PR #5486](https://github.com/azure/communication-ui-library/pull/5486) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix console error that requested Teams conference details in unsupported calls ([PR #5444](https://github.com/azure/communication-ui-library/pull/5444) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix A11y Properties of Participant List More Options to have aria-expanded, aria-controls and aria-label. Correctly apply focus when the CallComposite people pane is opened when no one else has joined the call. ([PR #5427](https://github.com/azure/communication-ui-library/pull/5427) by 2684369+JamesBurnside@users.noreply.github.com)
- Update aria-live property of notifications in the notification stack. Update camera button aria-label to indicate loading status to match announcer. ([PR #5428](https://github.com/azure/communication-ui-library/pull/5428) by 2684369+JamesBurnside@users.noreply.github.com)
- Add aria descriptions to reaction and raise buttons ([PR #5414](https://github.com/azure/communication-ui-library/pull/5414) by dmceachern@microsoft.com)
- Fix an issue where system chat messages weren't announced ([PR #5463](https://github.com/azure/communication-ui-library/pull/5463) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix issue where AudioContext for composites is made too early ([PR #5476](https://github.com/azure/communication-ui-library/pull/5476) by dmceachern@microsoft.com)
- Removed custom styles for scroll bar for ChatComposite and Captions components ([PR #5470](https://github.com/azure/communication-ui-library/pull/5470) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update Control bar button aria-describedby ([PR #5493](https://github.com/azure/communication-ui-library/pull/5493) by dmceachern@microsoft.com)
- Allow for Contoso to hard set the dialer page, on, off, or follow our behaviors ([PR #5454](https://github.com/azure/communication-ui-library/pull/5454) by dmceachern@microsoft.com)
- Fix string typo for captions dropdown info. Fix usePropsFor return type for RaiseHandButton. ([PR #5448](https://github.com/azure/communication-ui-library/pull/5448) by 79475487+mgamis-msft@users.noreply.github.com)


## [1.21.0](https://github.com/azure/communication-ui-library/tree/1.21.0)

Tue, 12 Nov 2024 17:20:46 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.21.0-beta.1...1.21.0)

General improvements and bug fixes.

### Improvements

- Add es-MX and fr-CA locales ([PR #5405](https://github.com/azure/communication-ui-library/pull/5405) by 79475487+mgamis-msft@users.noreply.github.com)
- Updated Chat SDK and Signaling to latest stable release ([PR #5361](https://github.com/azure/communication-ui-library/pull/5361) by 109105353+jpeng-ms@users.noreply.github.com)
- Introduce the Reactions button to allow for a better component meeting experience. ([PR #5401](https://github.com/azure/communication-ui-library/pull/5401) by dmceachern@microsoft.com)
- Update comunication-calling stable version to 1.30.2 ([PR #5393](https://github.com/azure/communication-ui-library/pull/5393) by edwardlee@microsoft.com)
- Update chat-component-bindings with noUncheckedIndexedAccess ([PR #5294](https://github.com/azure/communication-ui-library/pull/5294) by 2684369+JamesBurnside@users.noreply.github.com)
- On safari, do not show speaker dropdown ([PR #5328](https://github.com/azure/communication-ui-library/pull/5328) by 2684369+JamesBurnside@users.noreply.github.com)

### Bug Fixes

- Introduce new aria strings to better announce the state of the participant in the video tile component ([PR #5345](https://github.com/azure/communication-ui-library/pull/5345) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix noUncheckedIndexedAccess for StatefulChatClient ([PR #5293](https://github.com/azure/communication-ui-library/pull/5293) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove unnecessary disabled prop from label ([PR #5365](https://github.com/azure/communication-ui-library/pull/5365) by edwardlee@microsoft.com)
- Fix CallComposite captions to correctly be <li> items nested inside a <ul> ([PR #5375](https://github.com/azure/communication-ui-library/pull/5375) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix the A11y role of the local video tile in the VideoGallery depending on if it is draggable or not ([PR #5377](https://github.com/azure/communication-ui-library/pull/5377) by 2684369+JamesBurnside@users.noreply.github.com)
- Update caption modal styles for 400% zoom scenario ([PR #5403](https://github.com/azure/communication-ui-library/pull/5403) by dmceachern@microsoft.com)
- Fix video dispose problem for multiple video stream ([PR #5188](https://github.com/azure/communication-ui-library/pull/5188) by jiangnanhello@live.com)
- Add High Contrast borders around video tiles, side pane, and side pane close button in CallComposites ([PR #5388](https://github.com/azure/communication-ui-library/pull/5388) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix call not found error when gets removed ([PR #5338](https://github.com/azure/communication-ui-library/pull/5338) by jiangnanhello@live.com)
- Fix device permission comboboxes on CallComposite configuration page to be appropriately labelled ([PR #5376](https://github.com/azure/communication-ui-library/pull/5376) by 2684369+JamesBurnside@users.noreply.github.com)
- Focus will move into the video tile menu directly when menu is opened via keyboard ([PR #5313](https://github.com/azure/communication-ui-library/pull/5313) by jiangnanhello@live.com)
- Add announcements to hold screen and attempting to reconnect screen ([PR #5402](https://github.com/azure/communication-ui-library/pull/5402) by edwardlee@microsoft.com)
- Fix CallComposite issue where the available devices are not updated when the permissions are changed via the browser lock button ([PR #5283](https://github.com/azure/communication-ui-library/pull/5283) by 2684369+JamesBurnside@users.noreply.github.com)
- Update size to stop white border in local video tile when using safari ([PR #5318](https://github.com/azure/communication-ui-library/pull/5318) by dmceachern@microsoft.com)
- Increase Start Call Button height on the Configuration Page to 52px on mobile form factor ([PR #5336](https://github.com/azure/communication-ui-library/pull/5336) by 2684369+JamesBurnside@users.noreply.github.com)
- In configuration page of call composites, move focus to error bar when an error occurs ([PR #5374](https://github.com/azure/communication-ui-library/pull/5374) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix troubleshooting links color in high contrast modes ([PR #5386](https://github.com/azure/communication-ui-library/pull/5386) by 2684369+JamesBurnside@users.noreply.github.com)
- Resolve issue where rich text editor tool bar would not focus when shown. Also fixed issue where editor component would remount when showing/hiding toolbar. ([PR #5337](https://github.com/azure/communication-ui-library/pull/5337) by 73612854+palatter@users.noreply.github.com)
- Add announcement strings for CallComposite page status ([PR #5400](https://github.com/azure/communication-ui-library/pull/5400) by edwardlee@microsoft.com)
- Resolve console errors for aria-hidden ([PR #5311](https://github.com/azure/communication-ui-library/pull/5311) by jiangnanhello@live.com)
- Update video effects picker to a radio group for better A11y control ([PR #5373](https://github.com/azure/communication-ui-library/pull/5373) by 2684369+JamesBurnside@users.noreply.github.com)
- Update configuration screen drop downs to have a button inside enabling users with keyboards to reprompt for the troubleshooting links ([PR #5384](https://github.com/azure/communication-ui-library/pull/5384) by dmceachern@microsoft.com)
- Add enter key support for rich text edit box ([PR #5395](https://github.com/azure/communication-ui-library/pull/5395) by 73612854+palatter@users.noreply.github.com)
- Fix Start Call text color in Desert high contrast mode when a dark theme is applied ([PR #5387](https://github.com/azure/communication-ui-library/pull/5387) by 2684369+JamesBurnside@users.noreply.github.com)


## [1.20.0](https://github.com/azure/communication-ui-library/tree/1.20.0)

Tue, 15 Oct 2024 20:24:24 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.20.0-beta.1...1.20.0)

### Features

- Azure Communication Services Web UI Library now supports the Soft Mute feature. This feature enables users to mute other users in a call. If a user has been soft muted, they retain the ability to unmute themselves. Developers can use this functionality today through our composites (e.g CallComposite, CallWithChatComposite). ([PR #5277](https://github.com/azure/communication-ui-library/pull/5277) by edwardlee@microsoft.com)

- Azure Communication Services Web UI Library now supports Deep Noise Suppression. This feature enables noise suppression algorithms to filter out background noise, ensuring that only the speaker's voice is heard clearly. Developers can use this functionality today through our composites (e.g CallComposite, CallWithChatComposite). ([PR #5265](https://github.com/Azure/communication-ui-library/pull/5265/))

- Azure Communication Services Web UI Library now supports a new way to consume our Composite experiences. If you are wanting to use the Azure Communication Services UI library Composites and don't develop in react, we are introducing a series of loader functions to allow you to use the Composites in your application. These functions load a react node and attach it to your application allowing you to use the Composites as if you were building in react. ([PR #5198](https://github.com/azure/communication-ui-library/pull/5198) by dmceachern@microsoft.com)

### Improvements

- Add accessible name to video effects pane ([PR #5196](https://github.com/azure/communication-ui-library/pull/5196) by 79475487+mgamis-msft@users.noreply.github.com)
- Soft mute now utilizes capabilities to discern if the current user is able to use the feature ([PR #5276](https://github.com/azure/communication-ui-library/pull/5276) by edwardlee@microsoft.com)
- Add Welsh component and composite locales ([PR #5243](https://github.com/azure/communication-ui-library/pull/5243) by 79475487+mgamis-msft@users.noreply.github.com)

### Bug Fixes

- Adding logic to flag when the adapter is in the middle of creation ([PR #5182](https://github.com/azure/communication-ui-library/pull/5182) by 9044372+JoshuaLai@users.noreply.github.com)
- White spaces handling update for text messages in message components ([PR #5225](https://github.com/azure/communication-ui-library/pull/5225) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update aria-labels and contrast colors ([PR #5309](https://github.com/azure/communication-ui-library/pull/5309) by edwardlee@microsoft.com)
- Enable noUncheckedIndexedAccess in statefulcallclient and calling bindings ([PR #5242](https://github.com/azure/communication-ui-library/pull/5242) by 2684369+JamesBurnside@users.noreply.github.com)
- Safely subscribe to on stateChanged events to prevent related events from failing if listeners throw an error ([PR #5165](https://github.com/azure/communication-ui-library/pull/5165) by edwardlee@microsoft.com)
- Fix bug where waiting for others to join text shows up in black under dark mode, and showing up in screen share ([PR #5295](https://github.com/azure/communication-ui-library/pull/5295) by 96077406+carocao-msft@users.noreply.github.com)
- Fix runtime error when starting screenshare alone in a call ([PR #5240](https://github.com/azure/communication-ui-library/pull/5240) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix issue where reactions button was not accessible via keyboard ([PR #5281](https://github.com/azure/communication-ui-library/pull/5281) by 94866715+dmceachernmsft@users.noreply.github.com)
- Increase Notification spacing betwen Title and Description text ([PR #5238](https://github.com/azure/communication-ui-library/pull/5238) by edwardlee@microsoft.com)
- Ensure components re-render when adapter state changes by using useSelector instead of adapter.getState ([PR #5239](https://github.com/azure/communication-ui-library/pull/5239) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix bug where waiting for others to join text shows up in black under dark mode, and showing up in screen share ([PR #5295](https://github.com/azure/communication-ui-library/pull/5295) by 96077406+carocao-msft@users.noreply.github.com)
- Fix Call Controls to allow proper customization of buttons shown ([PR #5193](https://github.com/azure/communication-ui-library/pull/5193) by dmceachern@microsoft.com)
- Fix noUncheckedIndexedAccess for react-composites ([PR #5297](https://github.com/azure/communication-ui-library/pull/5297) by 2684369+JamesBurnside@users.noreply.github.com)
- Enable noUncheckedIndexedAccess for react-components ([PR #5266](https://github.com/azure/communication-ui-library/pull/5266) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.19.0](https://github.com/azure/communication-ui-library/tree/1.19.0)

Thu, 12 Sep 2024 18:13:15 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.19.0-beta.3...1.19.0)

### Features

### Closed Captions

We are excited to announce that Azure Communications Services has recently added the Closed Captions feature. With closed captions, developers can provide a textual representation of the audio content in their videos, making it easier for users who are deaf or hard of hearing to follow along. Developers can enable this functionality today through our composites (e.g CallComposite, CallWithChatComposite). This feature includes support for:

- Enable and disable closed captions in the call
- Change spoken language
- Being able to use captions outside of teams scenario

### Inbound Calling 

We are excited to announce that the Azure Communication Services Web UI Library now supports Inbound Calling. This feature enables users to see, monitor, and handle new incoming calls. This feature is available for users within the Azure Communications ecosystem, and for users using “Communication as a Teams user”. Developers can use this functionality today through our UI components – the Incoming Call Stack and the Incoming Call Toast Notification.  

- Accept calls with Audio, Accept with video, and reject incoming calls.  
- Manage and service multiple calls at once 

### PSTN 

We are excited to announce that the Azure Communication Services Web UI Library now supports PSTN in general availability. This feature enables developers using the UI library to dial and call phone numbers through the Azure Communication Services call service. Developers can use this functionality today through our CallComposite as well as through components (DTMF, Dialpad). 

- PSTN calling support for both 1 to 1 and multi-partcipant calls. 
- Renders a dialpad that supports DTMF (dual tone multi-frequency 
- Enables support for being put on hold, dialing in, removing users from an existing call 

### ACS 1 to N Calling 

We are excited to announce that the Azure Communication Services Web UI Library now supports 1:N Calling. This feature enables developers using the UI library to perform outbound calls through Azure Communication Services call service. Developers can use this functionality today through our CallComposite. 

- Enables 1:1 and 1:N outbound calls with ACS users 
- Enables 1:N outbound calls with both ACS and PSTN users (if an alternate caller ID is provided) 
- Supports On/Off hold features and ability to remove participants from a call. 

### Teams Ad Hoc with Teams users

We are excited to announce that the Azure Communication Services Web UI Library now supports Ad-hoc Calling with Teams users. This feature enables users to start a call directly with a Teams user by using their ID. UI Library already supports Ad Hoc Calls with a Teams bot, but now Developers can use this functionality today through our CallComposite with Teams users directly. 

- Connect directly to a Teams user through Adhoc calling

### Improvements
- Add CallAdapter API to start captions in the background ([PR #5064](https://github.com/azure/communication-ui-library/pull/5064) by 2684369+JamesBurnside@users.noreply.github.com)
- Add PPTLive presenter information ([PR #4494](https://github.com/azure/communication-ui-library/pull/4494) by 93549644+ShaunaSong@users.noreply.github.com)
- Caption fullscreen mode ([PR #5164](https://github.com/azure/communication-ui-library/pull/5164) by jiangnanhello@live.com)
- Update @fluentui-contrib/react-chat to resolve focus in chat component ([PR #4862](https://github.com/azure/communication-ui-library/pull/4862) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update all dependencies with patch updates ([PR #4930](https://github.com/azure/communication-ui-library/pull/4930) by 2684369+JamesBurnside@users.noreply.github.com)
- Update axios to 1.7.5 with a security fix ([PR #5114](https://github.com/azure/communication-ui-library/pull/5114) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Update communication-calling to 1.29.1-beta.1 and 1.28.1 ([PR #5088](https://github.com/azure/communication-ui-library/pull/5088) by 79475487+mgamis-msft@users.noreply.github.com)
- Update communication-chat and signaling dependencies ([PR #5138](https://github.com/azure/communication-ui-library/pull/5138) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update RoosterJS version to improve keyboard table navigation in Rich Text Editor components ([PR #5050](https://github.com/azure/communication-ui-library/pull/5050) by 98852890+vhuseinova-msft@users.noreply.github.com)

### Bug Fixes
- Add announcements for applying bulleted/numbered lists in rich text editor and for adding new list items to them ([PR #4874](https://github.com/azure/communication-ui-library/pull/4874) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add role to SvgWithWorkWrapping and set as a heading in the configuration page on use ([PR #5127](https://github.com/azure/communication-ui-library/pull/5127) by edwardlee@microsoft.com)
- Disable image pasting when onInsertInlineImage is not provided ([PR #5053](https://github.com/azure/communication-ui-library/pull/5053) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Ensure dominant speaker streams are rendered ([PR #5129](https://github.com/azure/communication-ui-library/pull/5129) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix an issue where cursor position was incorrect after rich text input box was reset ([PR #4887](https://github.com/azure/communication-ui-library/pull/4887) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix bug where speakers are getting selected on safari ([PR #4893](https://github.com/azure/communication-ui-library/pull/4893) by 96077406+carocao-msft@users.noreply.github.com)
- Fix chat selectors using read receipts from state ([PR #5063](https://github.com/azure/communication-ui-library/pull/5063) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix error when listening to capabilitiesChanged and spotlightChanged events from AzureCommunicationCallWithChatAdapter ([PR #5066](https://github.com/azure/communication-ui-library/pull/5066) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix for an issue where toolbar didn't correctly show the selected style format during message editing ([PR #4940](https://github.com/azure/communication-ui-library/pull/4940) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix frequent tooltip dismissal when trying to mouse over tooltip content ([PR #5158](https://github.com/azure/communication-ui-library/pull/5158) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix lazy loading for Composites ([PR #5126](https://github.com/azure/communication-ui-library/pull/5126) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Fix Message status announcement where it sometimes takes priority over "Message is deleted" ([PR #4334](https://github.com/azure/communication-ui-library/pull/4334) by 3941071+emlynmac@users.noreply.github.com)
- Fix pinned participant limit to update correctly when pinned participants are removed from call ([PR #4761](https://github.com/azure/communication-ui-library/pull/4761) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix vulnerability of having NaN from calculations in horizontal or vertical overflow gallery ([PR #4861](https://github.com/azure/communication-ui-library/pull/4861) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix visible names for pinning, camera, and mic buttons ([PR #5079](https://github.com/azure/communication-ui-library/pull/5079) by dmceachern@microsoft.com)
- Fixed the issue where image loading placeholder doesn't work for safari ([PR #4846](https://github.com/azure/communication-ui-library/pull/4846) by 109105353+jpeng-ms@users.noreply.github.com)
- Refactored Teams Identity Logic for File Sharing ([PR #4918](https://github.com/azure/communication-ui-library/pull/4918) by 109105353+jpeng-ms@users.noreply.github.com)
- Remove use of phonenumberlib-js and manually format NA numbers ([PR #4920](https://github.com/azure/communication-ui-library/pull/4920) by 2684369+JamesBurnside@users.noreply.github.com)
- Resolve adapter caption events not firing ([PR #5065](https://github.com/azure/communication-ui-library/pull/5065) by 96077406+carocao-msft@users.noreply.github.com)
- Suppress initial notifications of capabilities being present when joining a call ([PR #4994](https://github.com/azure/communication-ui-library/pull/4994) by 79475487+mgamis-msft@users.noreply.github.com)
- Truncate long text used in video effects button ([PR #5097](https://github.com/azure/communication-ui-library/pull/5097) by 79475487+mgamis-msft@users.noreply.github.com)
- Update contrast issues when interacting with other participants in the call ([PR #5141](https://github.com/azure/communication-ui-library/pull/5141) by dmceachern@microsoft.com)


## [1.18.0](https://github.com/azure/communication-ui-library/tree/1.18.0)

Mon, 15 Jul 2024 18:16:36 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.18.0-beta.1...1.18.0)

### Features

### In-call notifications
Azure Communication Services UI Library is adding support for improved in-call notifications. In call notifications are essential for providing users with timely and relevant information about their calling experience. Whether it is an error message, a mute status, or a network quality indicator, notifications can help users troubleshoot issues and improve their communication. The new feature of ACS UI Library simplifies the display and management of multiple notifications in a consistent and user-friendly way. The in-call notification feature introduces a streamlined UI experience for displaying errors and notifications in the calling environment.

### Conference Coordinates
Conference Coordinates feature allows users to dial-in to the meeting with phone. The user can join teams meeting by dialing in dedicated phone number and providing the conference ID given associated with the Teams meeting.

### Improvements
- Add disable option for end call modal ([PR #4771](https://github.com/azure/communication-ui-library/pull/4771) by dmceachern@microsoft.com)
- Added new broken image view for inline image feature ([PR #4812](https://github.com/azure/communication-ui-library/pull/4812) by 109105353+jpeng-ms@users.noreply.github.com)

### Bug Fixes
- Allows for the creation of a TeamsCallAgent with our StatefulCallClient ([PR #4752](https://github.com/azure/communication-ui-library/pull/4752) by dmceachern@microsoft.com)
- Add pinning to participant list ([PR #4699](https://github.com/azure/communication-ui-library/pull/4699) by 97124699+prabhjot-msft@users.noreply.github.com)
- Only allow the user to end the call for everyone if they are acitvely in the call ([PR #4768](https://github.com/azure/communication-ui-library/pull/4768) by dmceachern@microsoft.com)
- update captions test to have user id match with participant list id ([PR #4706](https://github.com/azure/communication-ui-library/pull/4706) by 96077406+carocao-msft@users.noreply.github.com)
- Accessibility title on Image Overlay reading out heading ([PR #4763](https://github.com/azure/communication-ui-library/pull/4763) by 9044372+JoshuaLai@users.noreply.github.com)
- pass in undefined if there is no onParticipant defined ([PR #4714](https://github.com/azure/communication-ui-library/pull/4714) by 9044372+JoshuaLai@users.noreply.github.com)
- Update dark theme color to inverted ([PR #4736](https://github.com/azure/communication-ui-library/pull/4736) by longamy@microsoft.com)
- Fixed bug where reactions is dismissed when receiving new captions ([PR #4707](https://github.com/azure/communication-ui-library/pull/4707) by 96077406+carocao-msft@users.noreply.github.com)
- Fix missing pinned icon when it is the only icon for a remote participant ([PR #4751](https://github.com/azure/communication-ui-library/pull/4751) by 79475487+mgamis-msft@users.noreply.github.com)
- Updating accessibility to include status in the message content ([PR #4729](https://github.com/azure/communication-ui-library/pull/4729) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix Error Bar dismiss button's height for better accessibility ([PR #4830](https://github.com/azure/communication-ui-library/pull/4830) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Update the color of time stamp to meet the contrast requirement from a11y ([PR #4688](https://github.com/azure/communication-ui-library/pull/4688) by longamy@microsoft.com)
- Disable highlight of context menu on touch event in Android ([PR #4726](https://github.com/azure/communication-ui-library/pull/4726) by 3941071+emlynmac@users.noreply.github.com)
- Fixed the issue where chat message bubble has an incorrect margin in editing state ([PR #4832](https://github.com/azure/communication-ui-library/pull/4832) by 109105353+jpeng-ms@users.noreply.github.com)
- Added Disable Styling to Attachment Cards ([PR #4711](https://github.com/azure/communication-ui-library/pull/4711) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix participant pane title to h2 ([PR #4842](https://github.com/azure/communication-ui-library/pull/4842) by 77021369+jimchou-dev@users.noreply.github.com)
- Use display name from participant list for captions speaker display name to keep naming consisitent between different UI  ([PR #4703](https://github.com/azure/communication-ui-library/pull/4703) by 96077406+carocao-msft@users.noreply.github.com)
- Update the dark theme for fail sending icon ([PR #4811](https://github.com/azure/communication-ui-library/pull/4811) by longamy@microsoft.com)
- Fixed the issue where user cannot update message content ([PR #4701](https://github.com/azure/communication-ui-library/pull/4701) by 109105353+jpeng-ms@users.noreply.github.com)
- Remove the themeV8 version for the link color ([PR #4691](https://github.com/azure/communication-ui-library/pull/4691) by longamy@microsoft.com)
- Add message context to aria label ([PR #4695](https://github.com/azure/communication-ui-library/pull/4695) by 3941071+emlynmac@users.noreply.github.com)
- Update DLP message styling ([PR #4765](https://github.com/azure/communication-ui-library/pull/4765) by longamy@microsoft.com)
- Stop all sounds when call connects ([PR #4772](https://github.com/azure/communication-ui-library/pull/4772) by dmceachern@microsoft.com)


## [1.17.0](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.17.0)

Tue, 04 Jun 2024 05:01:39 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.16.1...1.17.0)
### Features

### Communication as Teams user

We are excited to announce that the Azure Communication Services Web UI Library now supports Communication as Teams User. This feature allows users to join Teams meetings using a Teams identity. Developers can use this functionality today through the CallComposite and components (useTeamsAgent, useTeamsCall).
- Build stand-alone ACS applications utilizing existing Teams identities to create M365 rich Communication experiences
- Developers can create an adapter for Teams and use it in the Call Composite
- Developers can build deeply customized Communication experiences leveraging UI components and Teams identity


### File sharing in Teams meeting chat

Azure Communication Services is proud to introduce file sharing in a Teams meeting chat. Specifically, the Communication user in a Microsoft Teams meeting chat can now receive file attachments from a Teams user in the CallWithChat Composite. The external Communication user is able to:
- Open file attachment links in a new tab in their browser
- View, edit or download the files in the new tab

Please note that when the Microsoft Teams user attaches a file to be shared, the file permissions must be set to 'share with external/guest users'. 

Please refer to [External or guest sharing in OneDrive, SharePoint, and Lists - Microsoft Support](https://support.microsoft.com/en-us/office/external-or-guest-sharing-in-onedrive-sharepoint-and-lists-7aa070b8-d094-4921-9dd9-86392f2a79e7) and [Overview of external sharing in SharePoint and OneDrive in Microsoft 365](https://learn.microsoft.com/en-us/sharepoint/external-sharing-overview.)

### Improvements

- Fix menu icon behavior ([PR #4584](https://github.com/azure/communication-ui-library/pull/4584) by jiangnanhello@live.com)
- Updated Storybook for File Sharing GA Release ([PR #4620](https://github.com/azure/communication-ui-library/pull/4620) by 109105353+jpeng-ms@users.noreply.github.com)
- Allow onRenderAvatar to return undefined to hide avatar ([PR #4673](https://github.com/azure/communication-ui-library/pull/4673) by 3941071+emlynmac@users.noreply.github.com)

### Bug Fixes

- Resolve issue with table size selection on mobile ([PR #4681](https://github.com/azure/communication-ui-library/pull/4681) by 73612854+palatter@users.noreply.github.com)
- Fix local participant item to show menu icon when hovered ([PR #4609](https://github.com/azure/communication-ui-library/pull/4609) by 79475487+mgamis-msft@users.noreply.github.com)
- Resolve issue where message does not have outline when using keyboard navigation. ([PR #4641](https://github.com/azure/communication-ui-library/pull/4641) by 73612854+palatter@users.noreply.github.com)
- Status icon should not be keyboard tab navigable, only by voiceover navigation. ([PR #4634](https://github.com/azure/communication-ui-library/pull/4634) by 73612854+palatter@users.noreply.github.com)
- Update styles to fix spacing of labeled background effects ([PR #4614](https://github.com/azure/communication-ui-library/pull/4614) by dmceachern@microsoft.com)
- Fix screen reader announcement when the user goes on hold in the Call Composite ([PR #4664](https://github.com/azure/communication-ui-library/pull/4664) by 2684369+JamesBurnside@users.noreply.github.com)
- Add reaction items narrator strings ([PR #4635](https://github.com/azure/communication-ui-library/pull/4635) by dmceachern@microsoft.com)
- Remove scaling options for PiPiP in the people and chat panes to stop surprise popup controls ([PR #4652](https://github.com/azure/communication-ui-library/pull/4652) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix for an issue where links were opened in the same tab ([PR #4669](https://github.com/azure/communication-ui-library/pull/4669) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add missing Message Options for MessageThread Component ([PR #4600](https://github.com/azure/communication-ui-library/pull/4600) by 109105353+jpeng-ms@users.noreply.github.com)
- Update priority of aria label strings to use visual labels before tool tips to help users using voice controls ([PR #4624](https://github.com/azure/communication-ui-library/pull/4624) by dmceachern@microsoft.com)
- Add snippet for video effects ([PR #4285](https://github.com/azure/communication-ui-library/pull/4285) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fix VideoEffects Pane reseting focus when an item is selected ([PR #4618](https://github.com/azure/communication-ui-library/pull/4618) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix bug where raise hand's height is the height of video tile ([PR #4589](https://github.com/azure/communication-ui-library/pull/4589) by 96077406+carocao-msft@users.noreply.github.com)
- Ensure send box errors are announced when using a screen reader ([PR #4667](https://github.com/azure/communication-ui-library/pull/4667) by 3941071+emlynmac@users.noreply.github.com)
- Fix bug where captions UI stuck at start captions spinner when failed to start captions ([PR #4676](https://github.com/azure/communication-ui-library/pull/4676) by 96077406+carocao-msft@users.noreply.github.com)
- Change icon colors for accessibility contrast requirements ([PR #4640](https://github.com/azure/communication-ui-library/pull/4640) by edwardlee@microsoft.com)
- Fix for Pin tile icon too small ([PR #4587](https://github.com/azure/communication-ui-library/pull/4587) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fix crash bug for remote screen share ([PR #4608](https://github.com/azure/communication-ui-library/pull/4608) by jiangnanhello@live.com)
- Fix aria-allowed-attr errors on call composite announcer component, and on video effects selectable items ([PR #4662](https://github.com/azure/communication-ui-library/pull/4662) by 2684369+JamesBurnside@users.noreply.github.com)
- Tab/keyboard navigation fixes for the MessageThread ([PR #4655](https://github.com/azure/communication-ui-library/pull/4655) by 73612854+palatter@users.noreply.github.com)
- Increase participant item muted icon size ([PR #4610](https://github.com/azure/communication-ui-library/pull/4610) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix width for code snippets sent in messages ([PR #4633](https://github.com/azure/communication-ui-library/pull/4633) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update aria label behavior to better represent the background to be selected ([PR #4672](https://github.com/azure/communication-ui-library/pull/4672) by dmceachern@microsoft.com)
- Fixed bug when call ended due to wrong links/ids users are lead to normal end call screen with survey ([PR #4661](https://github.com/azure/communication-ui-library/pull/4661) by 96077406+carocao-msft@users.noreply.github.com)
- Change menu item div to aria-disabled ([PR #4680](https://github.com/azure/communication-ui-library/pull/4680) by 9044372+JoshuaLai@users.noreply.github.com)
- Add context menu icon for removing participant ([PR #4562](https://github.com/azure/communication-ui-library/pull/4562) by 79475487+mgamis-msft@users.noreply.github.com)
- Allow captions to be used when in a adhoc teams call ([PR #4579](https://github.com/azure/communication-ui-library/pull/4579) by dmceachern@microsoft.com)

## [1.16.1](https://github.com/azure/communication-ui-library/tree/1.16.1)
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.16.0...1.16.1)

### Bug Fixes
- Fix crash bug for remote screen share([PR #4608](https://github.com/Azure/communication-ui-library/pull/4608) by jiangnanhello@live.com))

## [1.16.0](https://github.com/azure/communication-ui-library/tree/1.16.0)

Mon, 06 May 2024 20:38:24 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.15.0...1.16.0)
### Features

### Hide Attendee Names

The Web UI Calling and CallWithChat composite now supports "Hide Attendee Names". This feature supports Teams Premium option of hiding attendees in the meeting and helps protect identities during large Teams interop meetings.

### Join Call with Meeting ID/Passcode

We are excited to announce that the Azure Communication Services Web UI Library now supports joining a call with a Meeting Passcode and ID. Currently, Microsoft Teams allows you to require a meeting password for added security and generates a unique meeting ID for each meeting that participants can use to join. This feature now allows users on ACS to join interop Teams calls that have a meeting passcode or an ID generated. This is useful for private calls or events where limited access needs to be granted. Developers can use this functionality today through our composites (e.g CallComposite, CallWithChatComposite) as well as through components.

### End Call Options
Support end call for everyone feature, developer can now use hangUpForEveryone parameter in Call and CallWithChat composite to allow the user to end the whole call for everyone.


### Improvements

- Add callout on Copy Invite Link button or Add People button when invite link is copied ([PR #4497](https://github.com/azure/communication-ui-library/pull/4497) by 79475487+mgamis-msft@users.noreply.github.com)
- Lay groundwork for supporting the new Teams' short meeting URLs ([PR #4481](https://github.com/azure/communication-ui-library/pull/4481) by 2684369+JamesBurnside@users.noreply.github.com)
- Update File Sharing Public APIs ([PR #4464](https://github.com/azure/communication-ui-library/pull/4464) by 109105353+jpeng-ms@users.noreply.github.com)
- Allow always showing background color for display name containers in VideoTiles ([PR #4489](https://github.com/azure/communication-ui-library/pull/4489) by edwardlee@microsoft.com)

### Bug Fixes

- Fix the issue where aria label contains spacial chars ([PR #4531](https://github.com/azure/communication-ui-library/pull/4531) by 109105353+jpeng-ms@users.noreply.github.com)
- Move internal CallComposite AudioContext to a react context to avoid over creation of audio contexts ([PR #4539](https://github.com/azure/communication-ui-library/pull/4539) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update caption logic to only process current speaker and ignore interceptors until the current speaker stops talking ([PR #4488](https://github.com/azure/communication-ui-library/pull/4488) by 96077406+carocao-msft@users.noreply.github.com)
- Fix an accessibility issue where a send box button disabled state wasn't announced ([PR #4526](https://github.com/azure/communication-ui-library/pull/4526) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix for drawer menu display name not localized ([PR #4558](https://github.com/azure/communication-ui-library/pull/4558) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fix VideoGallery to not use optimal video count when there are no remote videos on ([PR #4364](https://github.com/azure/communication-ui-library/pull/4364) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix for wrong initials in remote video tile ([PR #4561](https://github.com/azure/communication-ui-library/pull/4561) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fix an issue where all messages were re-rendered when a new message was sent ([PR #4451](https://github.com/azure/communication-ui-library/pull/4451) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Improve detecting if camera permission is available by using Permissions API in the StatefulCallClient ([PR #4472](https://github.com/azure/communication-ui-library/pull/4472) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed Upload Issue in Chat Sample App ([PR #4487](https://github.com/azure/communication-ui-library/pull/4487) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix bug where captions stuck at bottom ([PR #4462](https://github.com/azure/communication-ui-library/pull/4462) by 96077406+carocao-msft@users.noreply.github.com)
- Add aria label for sidepane header ([PR #4475](https://github.com/azure/communication-ui-library/pull/4475) by edwardlee@microsoft.com)
- Fix issue where android user's videos would not be on when joining the call caused by a stream change ([PR #4461](https://github.com/azure/communication-ui-library/pull/4461) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix local tile switcher action ([PR #4447](https://github.com/azure/communication-ui-library/pull/4447) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix position of raised hand icon in video tiles ([PR #4453](https://github.com/azure/communication-ui-library/pull/4453) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix exception thrown when joining an Teams Interop meeting that has an unsupported chat thread ([PR #4482](https://github.com/azure/communication-ui-library/pull/4482) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix default constant maxWidth value for fluent chat components ([PR #4510](https://github.com/azure/communication-ui-library/pull/4510) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix Screen Reader Reads `&nbsp;` ([PR #4500](https://github.com/azure/communication-ui-library/pull/4500) by 109105353+jpeng-ms@users.noreply.github.com)
- Update button label rem size to fit shorter text ([PR #4460](https://github.com/azure/communication-ui-library/pull/4460) by edwardlee@microsoft.com)
- Close drawer menu for remote participant when they are no longer in the call ([PR #4466](https://github.com/azure/communication-ui-library/pull/4466) by 79475487+mgamis-msft@users.noreply.github.com)
- Add aria label to People button to indicate selected state action ([PR #4573](https://github.com/azure/communication-ui-library/pull/4573) by edwardlee@microsoft.com)
- Add adapter options to JS bundles ([PR #4486](https://github.com/azure/communication-ui-library/pull/4486) by dmceachern@microsoft.com)
- Update default scaling mode to Crop when selecting a camera ([PR #4502](https://github.com/azure/communication-ui-library/pull/4502) by 79475487+mgamis-msft@users.noreply.github.com)
- Remove PPTLive overlay ([PR #4446](https://github.com/azure/communication-ui-library/pull/4446) by 93549644+ShaunaSong@users.noreply.github.com)
- Introduces API to show or hude the dialpad automatically when the call starts ([PR #4568](https://github.com/azure/communication-ui-library/pull/4568) by dmceachern@microsoft.com)


## [1.15.0](https://github.com/azure/communication-ui-library/tree/1.15.0)

Mon, 08 Apr 2024 20:34:39 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.14.0...1.15.0)
### Features

### PPTLive - General Availability

We are excited to announce that the Azure Communication Services Web UI Library now can view PowerPoint Live sessions initiated by a Teams client. Users can follow along with the current slide the presenter is sharing and view presenter annotations. Developers can use this functionality today through our composites (e.g CallComposite, CallWithChatComposite) as well as through components (e.g VideoGallery)

### Reactions - General Availability

Microsoft Azure Communications Services has recently updated its UI library composites and components to include call reactions. The UI Library will support the following list of live call reactions: 👍 like reaction, ❤️ heart reaction, 👏 applause reaction, 😂 laughter reaction, 😮 surprise reaction. Call reactions are associated to the user sending it and are visible to all types of users (in-tenant, guest, federated, anonymous). Call reactions are supported in all types of calls such as Rooms, group and meetings (scheduled, private, channel) of all sizes (small, large, XL). The addition of this feature will assist with greater engagement within calls, as people can now react or respond in real time without having to speak or interrupt. 

- The ability to have live call reactions added to CallComposite and CallwithChatComposite on web 

- Call reactions added at the component level 

### Spotlight - General Availability
The UI Library now supports spotlight in Teams interop and adhoc calls. ACS users can now give more focus to one or more participants for everyone in the call by spotlighting them. The spotlight feature is now enabled by default in the CallComposite and CallWithChatComposite but can be disabled using composite options.

### End of Call Survey - General Availability
The UI Library now supports End of Call Survey, with the feature added to the CallComposite and CallwithChatComposite on web. The survey supports feedback for the categories of overall quality, audio, video, and screenshare. This survey appears at the end of composite experience. By default, users are taken to a “thank you for your feedback” page after survey is submitted, and taken to the end call screen if survey is skipped. We provide abilities to overwrite those default screens. The survey can be disabled or enabled. The data received is sent to Contoso’s local Azure monitoring where it can be validated for overall call quality. When free form text survey is enabled, the free form text data collected are not sent to local Azure monitoring and will need to be handled by Contoso.

### Improvements
- Update fluent and type-fest dependencies to latest ([PR #4347](https://github.com/azure/communication-ui-library/pull/4347) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove @azure/core-rest-pipeline from dependencies ([PR #4294](https://github.com/azure/communication-ui-library/pull/4294) by 2684369+JamesBurnside@users.noreply.github.com)
- Upgrade Typescript to 5.4.2 ([PR #4284](https://github.com/azure/communication-ui-library/pull/4284) by 2684369+JamesBurnside@users.noreply.github.com)
- Calling SDK Stable update stable version ([PR #4410](https://github.com/azure/communication-ui-library/pull/4410) by 93549644+ShaunaSong@users.noreply.github.com)
### Bug Fixes
- Ensure theme is memoized for calls to useTheme ([PR #4301](https://github.com/azure/communication-ui-library/pull/4301) by 2684369+JamesBurnside@users.noreply.github.com)
- Retain pinning of participants after holding call in CallComposite and CallWithChatComposite ([PR #4319](https://github.com/azure/communication-ui-library/pull/4319) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix participantList not showing remote participant raised hands ([PR #4422](https://github.com/azure/communication-ui-library/pull/4422) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix ordering of dominant speakers in overflow gallery ([PR #4276](https://github.com/azure/communication-ui-library/pull/4276) by miguelgamis@microsoft.com)
- Fix issue where video stream would not recover when re-connecting to the call from a network disconnect ([PR #4300](https://github.com/azure/communication-ui-library/pull/4300) by alkwa@microsoft.com)
- Fix the absence of remove participant drawer menu item in group and interop calls on mobile ([PR #4359](https://github.com/azure/communication-ui-library/pull/4359) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix Message status announcement sometimes takes priority over "Message is deleted" one ([PR #4334](https://github.com/azure/communication-ui-library/pull/4334) by 3941071+emlynmac@users.noreply.github.com)
- Update various visual issues with the configuration screen ([PR #4355](https://github.com/azure/communication-ui-library/pull/4355) by dmceachern@microsoft.com)
- Pass down onFetchAvatarPersonaData to peoplepane to display custom data model ([PR #4391](https://github.com/azure/communication-ui-library/pull/4391) by edwardlee@microsoft.com)
- Fix issue where dtmf sounds would break when hiding the dialpad on mobile inside the composite ([PR #4337](https://github.com/azure/communication-ui-library/pull/4337) by 94866715+dmceachernmsft@users.noreply.github.com)


## [1.14.0](https://github.com/azure/communication-ui-library/tree/1.14.0)

Thu, 14 Mar 2024 03:50:48 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.13.0...1.14.0)

### Teams Interop Chat Image Sharing - General Availability

We are excited to announce that the Azure Communication Services Web UI Library now has the ability to receive Teams interop images inline. Additionally, we have enabled users to click on an individual image to view it in a new ImageOverlay component. This component displays the selected image in full screen and allows users to download the image.

### CallComposite and CallWithChatComposite Custom Branding - General Availability

The CallComposite and CallWithChatComposite now support applying a background image and logo to the Configuration Page. This allows developers to unify their customers' joining experiences if they have a Teams Premium feature enabled called Teams Meeting Themes.

### Features

- Stabilize Custom Branding ([PR #4211](https://github.com/azure/communication-ui-library/pull/4211) by 2684369+JamesBurnside@users.noreply.github.com)
- Stabilize Teams Interop Inline Images([PR #4196](https://github.com/Azure/communication-ui-library/pull/4196) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)

### Improvements

- Update Transfer API to use new SDK 'transferAccepted' event ([PR #4114](https://github.com/azure/communication-ui-library/pull/4114) by dmceachern@microsoft.com)
- Add noImplicitAny support in samples ([PR #4199](https://github.com/azure/communication-ui-library/pull/4199) by edwardlee@microsoft.com)
- Add noImplicitAny support in react-composites and communication-react ([PR #4166](https://github.com/azure/communication-ui-library/pull/4166) by edwardlee@microsoft.com)
- Add NoImplicitAny support for react-components ([PR #4168](https://github.com/azure/communication-ui-library/pull/4168) by edwardlee@microsoft.com)
- Add noImplicitAny support in Storybook ([PR #4206](https://github.com/azure/communication-ui-library/pull/4206) by edwardlee@microsoft.com)
 
### Bug Fixes

- Update gallery logic to not include local participant in grid calculations ([PR #4136](https://github.com/azure/communication-ui-library/pull/4136) by dmceachern@microsoft.com)
- Hangup Call to transfer target when leaving in mid-transfer ([PR #4155](https://github.com/azure/communication-ui-library/pull/4155) by dmceachern@microsoft.com)
- Set correct microphone aria label in Lobby scenarios ([PR #4247](https://github.com/azure/communication-ui-library/pull/4247) by alkwa@microsoft.com)
- Fix for a deleted message accessibility announcement ([PR #4169](https://github.com/azure/communication-ui-library/pull/4169) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix missing alternate Caller id ([PR #4216](https://github.com/azure/communication-ui-library/pull/4216) by dmceachern@microsoft.com)
- Resolve issue where edited label is missing from received messages ([PR #4150](https://github.com/azure/communication-ui-library/pull/4150) by 73612854+palatter@users.noreply.github.com)
- Fix error when spoken language and caption language show up empty on initiation  ([PR #4228](https://github.com/azure/communication-ui-library/pull/4228) by 96077406+carocao-msft@users.noreply.github.com)
- Update Calling sounds to not play end call sound when transfer happens ([PR #4163](https://github.com/azure/communication-ui-library/pull/4163) by dmceachern@microsoft.com)
- Fix hanging express.close if have unclosed connection ([PR #4138](https://github.com/azure/communication-ui-library/pull/4138) by 77021369+jimchou-dev@users.noreply.github.com)

## [1.13.0](https://github.com/azure/communication-ui-library/tree/1.13.0)

Mon, 12 Feb 2024 18:52:29 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.12.0...1.13.0)

### Microsoft Teams Voice applications support - General Availability

We are excited to announce our CallComposite can now connect to Microsoft Teams Voice applications. To facilitate this we are introducing the new Dialpad Component and DTMF Dialer experience in our CallComposite. This includes:

- Sending DTMF Tone with Microsoft Teams Voice Apps.
- Dialpad front and center in our CallComposite when dialing a Microsoft Teams Voice App.

### Features

- Introduce new DTMF tone screen where you can use the dialpad to send DTMF tones in the call ([PR #4041](https://github.com/azure/communication-ui-library/pull/4041) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce the DTMF dialer button to the more button ([PR #4042](https://github.com/azure/communication-ui-library/pull/4042) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce dtmf dialer and controls in mobile ([PR #4059](https://github.com/azure/communication-ui-library/pull/4059) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduces Dialpad behavior based on the participants that are called ([PR #4048](https://github.com/azure/communication-ui-library/pull/4048) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce screen for when a bot timesout the call ([PR #4082](https://github.com/azure/communication-ui-library/pull/4082) by 94866715+dmceachernmsft@users.noreply.github.com)
- Remove old DTMF experience and update dialpad API to be platform agnostic ([PR #4065](https://github.com/azure/communication-ui-library/pull/4065) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update dialpad documentation ([PR #4061](https://github.com/azure/communication-ui-library/pull/4061) by 94866715+dmceachernmsft@users.noreply.github.com)
- Stabilize API's for DTMF Dialer, Dialpad, and remaining Click to Call features ([PR #4066](https://github.com/azure/communication-ui-library/pull/4066) by 94866715+dmceachernmsft@users.noreply.github.com)

### Improvements

- Update localization strings ([PR #4130](https://github.com/azure/communication-ui-library/pull/4130) by 2684369+JamesBurnside@users.noreply.github.com)
- Update minor packages ([PR #4039](https://github.com/azure/communication-ui-library/pull/4039) by 94866715+dmceachernmsft@users.noreply.github.com)
- Clean up conditional compilation code for pinned participants feature ([PR #4049](https://github.com/azure/communication-ui-library/pull/4049) by 79475487+mgamis-msft@users.noreply.github.com)
- Update `@azure/communication-calling` dependency to `1.21.1` ([PR #4055](https://github.com/azure/communication-ui-library/pull/4055) by 96077406+carocao-msft@users.noreply.github.com)
- Add messageThreadSelector tests ([PR #4107](https://github.com/azure/communication-ui-library/pull/4107) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update dependencies that had a patch bump available ([PR #4036](https://github.com/azure/communication-ui-library/pull/4036) by 94866715+dmceachernmsft@users.noreply.github.com)
- Patch dependency updates ([PR #4068](https://github.com/azure/communication-ui-library/pull/4068) by 3941071+emlynmac@users.noreply.github.com)

### Bug Fixes

- Fix offset of message edit box ([PR #4112](https://github.com/azure/communication-ui-library/pull/4112) by 3941071+emlynmac@users.noreply.github.com)
- Fix for an issue when head and body tags were added to messages with html type ([PR #4106](https://github.com/azure/communication-ui-library/pull/4106) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fixing defect when a img is shared via drag and drop and there is no message content ([PR #4084](https://github.com/azure/communication-ui-library/pull/4084) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix color loss of raised hand icon on iOS ([PR #4089](https://github.com/azure/communication-ui-library/pull/4089) by 79475487+mgamis-msft@users.noreply.github.com)
- Update detecting a policy violation check on Chat Messages ([PR #4087](https://github.com/azure/communication-ui-library/pull/4087) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix Dialpad bugs ([PR #4062](https://github.com/azure/communication-ui-library/pull/4062) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update styling to include space for back button ([PR #4079](https://github.com/azure/communication-ui-library/pull/4079) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.12.0](https://github.com/azure/communication-ui-library/tree/1.12.0)

Tue, 16 Jan 2024 22:14:17 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.11.0...1.12.0)

### Calling Sounds - General Availability
Call sounds is now available within the CallComposite and CallWithChatComposite. The feature also includes Call Ringing, Call Ended, Call Busy sounds available through the CallAdapter.

### Features
- Calling sounds feature ([PR #3969](https://github.com/azure/communication-ui-library/pull/3969) by 94866715+dmceachernmsft@users.noreply.github.com)
### Improvements
- Update dependencies ([PR #3933](https://github.com/azure/communication-ui-library/pull/3933) [PR #3901](https://github.com/azure/communication-ui-library/pull/3901) by edwardlee@microsoft.com 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Add messageEdited and messageDeleted events to the ChatAdapter ([PR #3971](https://github.com/azure/communication-ui-library/pull/3971) by 2684369+JamesBurnside@users.noreply.github.com)
- Replace html-to-react with html-react-parser ([PR #3995](https://github.com/azure/communication-ui-library/pull/3995) by 3941071+emlynmac@users.noreply.github.com)
### Bug Fixes
- Prevent showing screenShareButton when formFactor is set to mobile ([PR #3915](https://github.com/azure/communication-ui-library/pull/3915) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix participant list to be the scrollable portion in side pane ([PR #3957](https://github.com/azure/communication-ui-library/pull/3957) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix for a race condition for "The message is deleted" announcement ([PR #3946](https://github.com/azure/communication-ui-library/pull/3946) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Remove speaker dropdown for Safari browsers as speaker enumeration is not available for Safari browsers ([PR #3964](https://github.com/azure/communication-ui-library/pull/3964) by edwardlee@microsoft.com)
- Ensure the CallComposite and CallWithChatComposite side pane's are closed if the call is rejoined ([PR #3941](https://github.com/azure/communication-ui-library/pull/3941) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixed an issues when mentions list wasn't scrolled when navigated by keyboard ([PR #3958](https://github.com/azure/communication-ui-library/pull/3958) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update camera behavior to turn off the camera befroe we go on hold for privacy reasons ([PR #3926](https://github.com/azure/communication-ui-library/pull/3926) by 94866715+dmceachernmsft@users.noreply.github.com)
- Apply tablist role and tablist behavior to sidepane tab headings on mobile ([PR #3955](https://github.com/azure/communication-ui-library/pull/3955) by 2684369+JamesBurnside@users.noreply.github.com)
- Update remote screen share component to respect scaling ([PR #3956](https://github.com/azure/communication-ui-library/pull/3956) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix for an issue when a new messages button was shown because the status didn't match for the same message ([PR #3930](https://github.com/azure/communication-ui-library/pull/3930) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Introduce blocking error when giving wrong kind of identifier to createAzureCommunicationCallAdapter ([PR #3972](https://github.com/azure/communication-ui-library/pull/3972) by 94866715+dmceachernmsft@users.noreply.github.com)
- Show the hand raise order on the local video tile when on mobile ([PR #3938](https://github.com/azure/communication-ui-library/pull/3938) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix for an infinite scrolling at top of Message Thread which existed in some cases ([PR #3942](https://github.com/azure/communication-ui-library/pull/3942) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix issues with turning camera off and on when joining a call, as well fix microphone button to unmute and mute when joining ([PR #3917](https://github.com/azure/communication-ui-library/pull/3917) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix issue where using the keyboard would throw an error when selecting a background effect ([PR #3927](https://github.com/azure/communication-ui-library/pull/3927) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update role for sidepane headers ([PR #3929](https://github.com/azure/communication-ui-library/pull/3929) by edwardlee@microsoft.com)
- Mobile configuration page enable device button when either microphone or camera is available ([PR #3944](https://github.com/azure/communication-ui-library/pull/3944) by edwardlee@microsoft.com)
- Fix side pane content being clipped on a small screen at 200% zoom ([PR #3937](https://github.com/azure/communication-ui-library/pull/3937) by 2684369+JamesBurnside@users.noreply.github.com)
- Disable the camera button while the source is being switched to prevent rapid successive clicks from causing the streams to lock up ([PR #3943](https://github.com/azure/communication-ui-library/pull/3943) by 2684369+JamesBurnside@users.noreply.github.com)
- Update EndCall button appearance to match high contrast expectations on Windows ([PR #3905](https://github.com/azure/communication-ui-library/pull/3905) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix rendering issues in the video effects picker ([PR #3909](https://github.com/azure/communication-ui-library/pull/3909) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix function type signature of StatefulCallClient.selectCamera ([PR #3908](https://github.com/azure/communication-ui-library/pull/3908) by 2684369+JamesBurnside@users.noreply.github.com)


## [1.11.0](https://github.com/azure/communication-ui-library/tree/1.11.0)

Mon, 11 Dec 2023 21:24:49 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.10.0...1.11.0)

### Rooms - General Availability

ACS Web UI Library now supports the concept of a Rooms for developers. On the server-side, developers use Rooms Client from the Calling SDK to create rooms and add users with assigned roles to these rooms. The ACS Web UI Library, in turn, now allows the users to join a room through the CallComposite and managing their capabilities during the call based on their role.

### Features
- Promote rooms feature to GA ([PR #3841](https://github.com/azure/communication-ui-library/pull/3841) by miguelgamis@microsoft.com)
- Add roleChanged event for CallAdapter ([PR #3826](https://github.com/azure/communication-ui-library/pull/3826) by 79475487+mgamis-msft@users.noreply.github.com)
- Make configuration page text stand out against a noisy background ([PR #3842](https://github.com/azure/communication-ui-library/pull/3842) by 2684369+JamesBurnside@users.noreply.github.com)
- Generate theme from single accent color ([PR #3797](https://github.com/azure/communication-ui-library/pull/3797) by 2684369+JamesBurnside@users.noreply.github.com)
### Improvements
- Improve configuration page styling in the Call Composites ([PR #3741](https://github.com/azure/communication-ui-library/pull/3741) by 2684369+JamesBurnside@users.noreply.github.com)
- Rename inlineImage / file card types as per internal reviews ([PR #3846](https://github.com/azure/communication-ui-library/pull/3846) by 3941071+emlynmac@users.noreply.github.com)
- Updating the API for onUpdateMessage ([PR #3760](https://github.com/azure/communication-ui-library/pull/3760) by 9044372+JoshuaLai@users.noreply.github.com)
- Collapsing other identifiers to just CommunicationIdentifierKind ([PR #3761](https://github.com/azure/communication-ui-library/pull/3761) by alkwa@microsoft.com)
- Increase margin between the control bar buttons and their tooltips ([PR #3872](https://github.com/azure/communication-ui-library/pull/3872) by 2684369+JamesBurnside@users.noreply.github.com)
- MessageThread performance improvements ([PR #3809](https://github.com/azure/communication-ui-library/pull/3809) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update TypeScript used for building the package to 5.3.3 ([PR #3900](https://github.com/azure/communication-ui-library/pull/3900) by 2684369+JamesBurnside@users.noreply.github.com)
- Add additional telemetry to userAgent that indicates either Chat Composite, Call Composite, Call with Chat composite or Stateful components.  ([PR #3481](https://github.com/azure/communication-ui-library/pull/3481, https://github.com/azure/communication-ui-library/pull/3779) by 73612854+palatter@users.noreply.github.com)
- Update Calling dependency to use the latest version 1.19.1 ([PR #3831](https://github.com/azure/communication-ui-library/pull/3831) by 94866715+dmceachernmsft@users.noreply.github.com)
- Patch updates to dependencies ([PR #3847](https://github.com/azure/communication-ui-library/pull/3847) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add console errors for ended call scenarios for Rooms in CallComposite ([PR #3874](https://github.com/azure/communication-ui-library/pull/3874) by 79475487+mgamis-msft@users.noreply.github.com)
- Update communication-chat stable to 1.4.0 ([PR #3866](https://github.com/azure/communication-ui-library/pull/3866) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Update Immer to v10 and other packages ([PR #3854](https://github.com/azure/communication-ui-library/pull/3854) by 3941071+emlynmac@users.noreply.github.com)
- Update to type-fest 3.x and clean up unnecessary dependencies ([PR #3895](https://github.com/azure/communication-ui-library/pull/3895) by 3941071+emlynmac@users.noreply.github.com)
- Add image placeholder for interop chat messages ([PR #3861](https://github.com/azure/communication-ui-library/pull/3861) by 109105353+jpeng-ms@users.noreply.github.com)
- Add support for local screenshare streams in Calling Stateful Client ([PR #3865](https://github.com/azure/communication-ui-library/pull/3865) by 2684369+JamesBurnside@users.noreply.github.com)
### Bug Fixes
- Filter out consumers from remote participant list ([PR #3821](https://github.com/azure/communication-ui-library/pull/3821) by 79475487+mgamis-msft@users.noreply.github.com)
- Stop camera when capability to turn video on is no longer present and lower hand when role is changed to Consumer ([PR #3820](https://github.com/azure/communication-ui-library/pull/3820) by 79475487+mgamis-msft@users.noreply.github.com)
- Update @azure/communication-chat peerDependency to match devDependency ([PR #3774](https://github.com/azure/communication-ui-library/pull/3774) by 73612854+palatter@users.noreply.github.com)
- Update hook logic in call arrangement to close people pane appropriately when user goes on hold ([PR #3898](https://github.com/azure/communication-ui-library/pull/3898) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix lobby page text using incorrect theme token value. ([PR #3797](https://github.com/azure/communication-ui-library/pull/3797) by 2684369+JamesBurnside@users.noreply.github.com)
- Add border for avatar coin for raised hand ([PR #3793](https://github.com/azure/communication-ui-library/pull/3793) by ruslanzdor@microsoft.com)
- Participant pane dismiss the participant options menu on second click ([PR #3897](https://github.com/azure/communication-ui-library/pull/3897) by 94866715+dmceachernmsft@users.noreply.github.com)
- Adjust padding in participant item so that the state string is not so far away from the other icons ([PR #3849](https://github.com/azure/communication-ui-library/pull/3849) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update lobby screen camera controls and behavior ([PR #3863](https://github.com/azure/communication-ui-library/pull/3863) by 94866715+dmceachernmsft@users.noreply.github.com)
- Visual alignment improvements to the CallComposite configuration page ([PR #3875](https://github.com/azure/communication-ui-library/pull/3875) by 2684369+JamesBurnside@users.noreply.github.com)
- Dispose of the unparented views when call is starting ([PR #3876](https://github.com/azure/communication-ui-library/pull/3876) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix overflow gallery to use all available space when there is no local video ([PR #3825](https://github.com/azure/communication-ui-library/pull/3825) by 79475487+mgamis-msft@users.noreply.github.com)
- Add a Narrator announcement when a message is deleted ([PR #3844](https://github.com/azure/communication-ui-library/pull/3844) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add handlers for Enter and Space keys for message menu button ([PR #3755](https://github.com/azure/communication-ui-library/pull/3755) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Allow mic to be active in the lobby screen ([PR #3896](https://github.com/azure/communication-ui-library/pull/3896) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix local video stream rendering when camera is turned on while screensharing is active ([PR #3779](https://github.com/azure/communication-ui-library/pull/3779) by 79475487+mgamis-msft@users.noreply.github.com)
- Add ability start captions on mobile with keyboard with toggle on toplevel menu item and not secondary component ([PR #3801](https://github.com/azure/communication-ui-library/pull/3801) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix artifacting when hovering on background picker ([PR #3808](https://github.com/azure/communication-ui-library/pull/3808) by 94866715+dmceachernmsft@users.noreply.github.com)
- Render gallery content only when people pane screens on mobile aren't present ([PR #3754](https://github.com/azure/communication-ui-library/pull/3754) by 94866715+dmceachernmsft@users.noreply.github.com)
- Improve sample troubleshooting message ([PR #3870](https://github.com/azure/communication-ui-library/pull/3870) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix alpha release build poll script ([PR #3858](https://github.com/azure/communication-ui-library/pull/3858) by 3941071+emlynmac@users.noreply.github.com)
- Move noImplicitAny overrides to packlets ([PR #3855](https://github.com/azure/communication-ui-library/pull/3855) by 3941071+emlynmac@users.noreply.github.com)
- Fix for image placeholder issue for GA release ([PR #3911](https://github.com/Azure/communication-ui-library/pull/3911) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix issues with turning camera off and on and microphone button to unmute and mute when joining a call ([PR #3917](https://github.com/Azure/communication-ui-library/pull/3917) by 94866715+dmceachernmsft@users.noreply.github.com)
- Prevent showing screen share button when formFactor is set to mobile ([PR #3915](https://github.com/Azure/communication-ui-library/pull/3915) by 79475487+mgamis-msft@users.noreply.github.com)


## [1.10.0](https://github.com/azure/communication-ui-library/tree/1.10.0)

Mon, 06 Nov 2023 16:44:11 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.9.0...1.10.0)

### Custom Button Injection - General Availability

You can now add your own custom buttons to the CallComposite and CallwithChatComposite on web (on desktop and mobile web). Custom Button Injection enables developers to add their own custom buttons to the call control bar component. Developers have the ability to add buttons to different sections of the call control bar: primary, secondary, or overflow areas of the control bar. With our simplified button API, you can now create a more immersive calling experience that integrates with your applications.

### Features
- Update and stabilize custom button injection ([PR #3642](https://github.com/azure/communication-ui-library/pull/3642) by edwardlee@microsoft.com)

### Improvements
- Update the ACS common package to new stable version ([PR #3634](https://github.com/azure/communication-ui-library/pull/3634) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update to map to attachments to message id ([PR #3679](https://github.com/azure/communication-ui-library/pull/3679) by 9044372+JoshuaLai@users.noreply.github.com)
- Add background image to configuration page on call composite and call with chat composite ([PR #3703](https://github.com/azure/communication-ui-library/pull/3703) by 2684369+JamesBurnside@users.noreply.github.com)
- Update configuration page design with tighter alignment between local preview and controls and more compact start call button. ([PR #3726](https://github.com/azure/communication-ui-library/pull/3726) by 2684369+JamesBurnside@users.noreply.github.com)
- Error message position and font update for edit message component ([PR #3680](https://github.com/azure/communication-ui-library/pull/3680) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Center the configuration page text above the device details on desktop formFactor ([PR #3698](https://github.com/azure/communication-ui-library/pull/3698) by 2684369+JamesBurnside@users.noreply.github.com)
- Update backward-compatible packages ([PR #3690](https://github.com/azure/communication-ui-library/pull/3690) by 3941071+emlynmac@users.noreply.github.com)
- Update image padding for ImageGallery ([PR #3651](https://github.com/azure/communication-ui-library/pull/3651) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
### Bug Fixes
- Remove unused dependencies; migrate to @babel/eslint-parser ([PR #3692](https://github.com/azure/communication-ui-library/pull/3692) by 3941071+emlynmac@users.noreply.github.com)
- Fix startCall handler so that it can call using identifiers as well as the flat strings ([PR #3712](https://github.com/azure/communication-ui-library/pull/3712) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update PiP in the composites to return to the call screen when the pip is tapped and not dragged ([PR #3722](https://github.com/azure/communication-ui-library/pull/3722) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix file card tooltip ([PR #3708](https://github.com/azure/communication-ui-library/pull/3708) by 77021369+jimchou-dev@users.noreply.github.com)
- Fix error saying failed to turn off video when starting a call in react18 strict mode ([PR #3734](https://github.com/azure/communication-ui-library/pull/3734) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix Call with Chat adapter creation hook to handle multiple invokations ([PR #3676](https://github.com/azure/communication-ui-library/pull/3676) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix for an issue with narrator focus for message menu button ([PR #3728](https://github.com/azure/communication-ui-library/pull/3728) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Remove bottom paddings for the edit message buttons ([PR #3683](https://github.com/azure/communication-ui-library/pull/3683) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add disableToolTip prop for ControlBarButton component ([PR #3721](https://github.com/azure/communication-ui-library/pull/3721) by edwardlee@microsoft.com)
- Fix an issue when the menu button was not accessible sometimes ([PR #3672](https://github.com/azure/communication-ui-library/pull/3672) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix the padding for the warning bar in the effects picker and the background label ([PR #3725](https://github.com/azure/communication-ui-library/pull/3725) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add in prop to not fade in the persona ([PR #3688](https://github.com/azure/communication-ui-library/pull/3688) by alkwa@microsoft.com)
- Fix issue where the local participant cannot remove others in a call ([PR #3714](https://github.com/azure/communication-ui-library/pull/3714) by 94866715+dmceachernmsft@users.noreply.github.com)
- Prevent possible endless loop of switching between scrollable and paginated horizontal gallery in VideoGallery ([PR #3730](https://github.com/azure/communication-ui-library/pull/3730) by 79475487+mgamis-msft@users.noreply.github.com)
- Call focus to background effects picker on mount ([PR #3681](https://github.com/azure/communication-ui-library/pull/3681) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update start call in adapter to handle new ids from the ACS Common package ([PR #3674](https://github.com/azure/communication-ui-library/pull/3674) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add onFetchAvatar to captionsBanner component to allow passing in custom avatar icons ([PR #3643](https://github.com/azure/communication-ui-library/pull/3643) by carolinecao@microsoft.com)
- Fix issue where submenu in the mobile bottom sheet drawer were not focusing on the first item ([PR #3678](https://github.com/azure/communication-ui-library/pull/3678) by 94866715+dmceachernmsft@users.noreply.github.com)
- Dismiss moredrawer when dialpad opens ([PR #3720](https://github.com/azure/communication-ui-library/pull/3720) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.9.0](https://github.com/azure/communication-ui-library/tree/1.9.0)

Fri, 06 Oct 2023 19:59:45 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.9.0-beta.1...1.9.0)

### Gallery Layouts - General Availability
ACS Web UI Library now supports new Gallery Layouts in the CallComposite and CallWithChatComposite on web and mobile. This feature allows users to choose a video gallery layout from an existing set of layouts. The existing layouts to choose from are: Gallery, Gallery on Top, Focus Mode, and Speaker Mode. This support also allows call owners to set the default layout for the call.

### Features
- Add support for new Gallery Layouts in the CallComposite and CallWithChatComposite on web and mobile ([PR #3645](https://github.com/azure/communication-ui-library/pull/3645) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce gallery controls to mobile for default and dynamic views ([PR #3603](https://github.com/azure/communication-ui-library/pull/3603) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce storybook docs for gallery layouts ([PR #3616](https://github.com/azure/communication-ui-library/pull/3616) by 94866715+dmceachernmsft@users.noreply.github.com)
### Improvements
- Add Capabilitieschanged event to CallWithChatAdapter ([PR #3570](https://github.com/azure/communication-ui-library/pull/3570) by 79475487+mgamis-msft@users.noreply.github.com)
- Treeshake locales from composites and reduce bundle size ([PR #3615](https://github.com/azure/communication-ui-library/pull/3615) by 97124699+prabhjot-msft@users.noreply.github.com)
- Improve ComplianceBanner preview in storybook ([PR #3635](https://github.com/azure/communication-ui-library/pull/3635) by 79475487+mgamis-msft@users.noreply.github.com)
- Update documentation to remove FluentUI NorthStar wrapper package ([PR #3650](https://github.com/azure/communication-ui-library/pull/3650) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update documentation for file sharing ([PR #3581](https://github.com/azure/communication-ui-library/pull/3581) by 109105353+jpeng-ms@users.noreply.github.com)
- Update storybook anchors to use ref ([PR #3625](https://github.com/azure/communication-ui-library/pull/3625) by joshlai@microsoft.com)
- Remove NorthStar fluent dependency and replace with fluent 9 controls ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update the styling on system messages to a smaller font and reduced vertical padding([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add localized timestamp by default to chat messages([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add storybook documentation for capabilities ([PR #3585](https://github.com/azure/communication-ui-library/pull/3585) by 79475487+mgamis-msft@users.noreply.github.com)
- Storybook changes for ImageGallery ([PR #3590](https://github.com/azure/communication-ui-library/pull/3590) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
### Bug Fixes
- Fix content focusing when opening the video effects pane in call composite ([PR #3627](https://github.com/azure/communication-ui-library/pull/3627) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce missing composite options to the CallWithChat composite ([PR #3565](https://github.com/azure/communication-ui-library/pull/3565) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix legacy control bar logic to limit number of control bar buttons on mobile ([PR #3561](https://github.com/azure/communication-ui-library/pull/3561) by miguelgamis@microsoft.com)
- Default render of participant list item will yield none for presence ([PR #3619](https://github.com/azure/communication-ui-library/pull/3619) by 79329532+alkwa-msft@users.noreply.github.com)
- When screen is too small, decrease captions banner size so scroll bar and more button doesnot overlap ([PR #3653](https://github.com/azure/communication-ui-library/pull/3653) by carolinecao@microsoft.com)
- Enable localized default date/timestamp ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 3941071+emlynmac@users.noreply.github.com)
- Apply background color to overflow menu items in contextual menu and lighten opacity for call readiness prompts ([PR #3639](https://github.com/azure/communication-ui-library/pull/3639) by edwardlee@microsoft.com)
- Fix styles for when the end call button is focused in high contrast scenarios ([PR #3566](https://github.com/azure/communication-ui-library/pull/3566) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update styles of configuration page to match specification ([PR #3621](https://github.com/azure/communication-ui-library/pull/3621) by 94866715+dmceachernmsft@users.noreply.github.com)
- Increase the gap of the floating local video's initial posiition from the bottom right ([PR #3605](https://github.com/azure/communication-ui-library/pull/3605) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix for long display name to truncate after 50 charactrers ([PR #3633](https://github.com/azure/communication-ui-library/pull/3633) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix rtl margins for messages without avatar ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix some repetitions for narrator ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix edit box hover/select styles ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Remove FocusTrapZone from ImageGallery ([PR #3569](https://github.com/azure/communication-ui-library/pull/3569) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Flex-wrap the top div of chat messages ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 3941071+emlynmac@users.noreply.github.com)
- Rich text css styles update ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix up menu size and appearance on mobile ([PR #3654](https://github.com/azure/communication-ui-library/pull/3654) by 3941071+emlynmac@users.noreply.github.com)
- Paddings and margins update for messages ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update verticalGallery key in localization strings ([PR #3652](https://github.com/azure/communication-ui-library/pull/3652) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix up padding for case of action menu not visible ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 3941071+emlynmac@users.noreply.github.com)
- Update editBoxSubmitButton string ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Show more button only if enabled and has at least one context menu button to show ([PR #3583](https://github.com/azure/communication-ui-library/pull/3583) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix redundant presenter role notification when joining Teams interop call ([PR #3584](https://github.com/azure/communication-ui-library/pull/3584) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix issue with black border ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update Message Thread rendering logic ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Prevent the callout for the gallery layouts from dismissing from a rerender ([PR #3568](https://github.com/azure/communication-ui-library/pull/3568) by 94866715+dmceachernmsft@users.noreply.github.com)


## [1.8.0](https://github.com/azure/communication-ui-library/tree/1.8.0)

Thu, 07 Sep 2023 02:42:30 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.8.0-beta.1...1.8.0)

### Capabilities - General Availability
The Web UI Call and CallWithChat composite now supports capabilities from the Calling SDK to manage whether microphone, camera, and screen share buttons are enabled or disabled. Notifications are also shown when capabilities to use microphone, turn on camera, or share screen changes. The selectors for the MicrophoneButton, CameraButton, and ScreenShareButton components now disable the respective component based on capabilities of local user.

### Raise Hand - General Availability
The Web UI Call and CallWitihChat composite now supports Raise Hand feature. This enables users to raise and lower hand in Teams interop meetings.

### Optimal Video Count - General Availability
The Web UI Calling and CallWithChat composite now supports optimal video count which optimally control the maximum number of remote video renderers to ensure good video quality.

### Closed Captions - General Availability
The Web UI Calling and CallWithChat composite now supports Closed Captions in Teams Interop and Teams CTE scenarios.

This feature includes:
- Ability to enable, and show/hide closed captions in a call 
- Choose or change the captions spoken language and caption language
- Ability to scroll through past 50 dialogues after captions has been enabled

### Blurred and Custom Video Backgrounds - General Availability
The Web UI Calling and CallWithChat composite now supports blurred and custom video backgrounds in web desktop.

This feature includes:
- Ability to enable the blur/custom background effect before the call
- Choose or change the video background effect during the call
- Ability to use your own hosted images as custom backgrounds
- Provides an optional way for developers to inject the dependency for video background effects that is not bundled your app

### Pinning Layout and Rendering Options - General Availability
The VideoGallery now provides the ability to pin remote participants and change rendering option for their video streams.

This feature includes:
- Contextual menu for each remote video tile
- Pinning and unpinning participants
- Ability to change rendering options for remote video streams between fit-to-frame and fill frame

### Features
- Add capabilities feature ([PR #3475](https://github.com/azure/communication-ui-library/pull/3475) by 79475487+mgamis-msft@users.noreply.github.com, [PR #3485](https://github.com/azure/communication-ui-library/pull/3485) by 79475487+mgamis-msft@users.noreply.github.com, [PR #3527](https://github.com/azure/communication-ui-library/pull/3527) by 79475487+mgamis-msft@users.noreply.github.com,[PR #3540](https://github.com/azure/communication-ui-library/pull/3540) by 79475487+mgamis-msft@users.noreply.github.com)
- Promote raise hand feature to GA ([PR #3548](https://github.com/azure/communication-ui-library/pull/3548) by 79475487+mgamis-msft@users.noreply.github.com)
- Promote optimal video count feature to GA ([PR #3539](https://github.com/azure/communication-ui-library/pull/3539) by 79475487+mgamis-msft@users.noreply.github.com)
- Promote captions feature to GA ([PR #3547](https://github.com/azure/communication-ui-library/pull/3547) by carolinecao@microsoft.com)
- Promote background effects feature to GA ([PR #3551](https://github.com/azure/communication-ui-library/pull/3551) by 97124699+prabhjot-msft@users.noreply.github.com)
- Promote pinning layouts and rendering options feature to GA ([PR #3394](https://github.com/azure/communication-ui-library/pull/3394) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update CallComposite to use new control bar ([PR #3417](https://github.com/azure/communication-ui-library/pull/3417) by 79475487+mgamis-msft@users.noreply.github.com) 
- Add call control option property 'legacyControlBarExperience' to CallComposite to use legacy control bar ([PR #3417](https://github.com/azure/communication-ui-library/pull/3417) by 79475487+mgamis-msft@users.noreply.github.com)
### Improvements
- Add missing CallAdapterOptions to createAzureCommunicationCallWithChatAdapterFromClients ([PR #3476](https://github.com/azure/communication-ui-library/pull/3476) by 2684369+JamesBurnside@users.noreply.github.com)
- Update documentation of CallwithChat Adapter API for clarification ([PR #3446](https://github.com/azure/communication-ui-library/pull/3446) by 109105353+jpeng-ms@users.noreply.github.com)
- Update @azure/communication-signaling ([PR #3524](https://github.com/azure/communication-ui-library/pull/3524) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update localized strings ([PR #3489](https://github.com/azure/communication-ui-library/pull/3489) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com, [PR #3542](https://github.com/azure/communication-ui-library/pull/3542) by 79475487+mgamis-msft@users.noreply.github.com)
- Update @azure/communication-calling to 1.16.3 ([PR #3508](https://github.com/azure/communication-ui-library/pull/3508) by alkwa@microsoft.com)
- Update stable dependencies to use caret for calling and chat ([PR #3491](https://github.com/azure/communication-ui-library/pull/3491) by alkwa@microsoft.com)
- Upgrade @azure/communication-chat to 1.3.2 ([PR #3510](https://github.com/azure/communication-ui-library/pull/3510) by 77021369+jimchou-dev@users.noreply.github.com)
### Bug Fixes
- Remove controlBar shadow in landscape mobile view ([PR #3501](https://github.com/azure/communication-ui-library/pull/3501) by edwardlee@microsoft.com)
- Maintain scaling mode of remote participants when screen sharing is turned off by remote participant ([PR #3468](https://github.com/azure/communication-ui-library/pull/3468) by 97124699+prabhjot-msft@users.noreply.github.com)
- Add default aria label for video effect items ([PR #3477](https://github.com/azure/communication-ui-library/pull/3477) by edwardlee@microsoft.com)
- Ensure camera and microphone permissions are re-requested when the number of devices goes from 0 to n ([PR #3439](https://github.com/azure/communication-ui-library/pull/3439) by 2684369+JamesBurnside@users.noreply.github.com)
- Announce people button selected state ([PR #3496](https://github.com/azure/communication-ui-library/pull/3496) by carolinecao@microsoft.com)
- Disable raise hand button in lobby ([PR #3512](https://github.com/azure/communication-ui-library/pull/3512) by ruslanzdor@microsoft.com)
- Add stream size to remote video stream ([PR #3516](https://github.com/azure/communication-ui-library/pull/3516) by 97124699+prabhjot-msft@users.noreply.github.com)

## [1.7.0](https://github.com/azure/communication-ui-library/tree/1.7.0)

Mon, 14 Aug 2023 18:28:26 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.7.0-beta.2...1.7.0)

### Improvements
- Update signaling sdk to 1.0.0-beta19 ([PR #3414](https://github.com/azure/communication-ui-library/pull/3414) by joshlai@microsoft.com)
- Expose aria-labelledby prop for participantItems ([PR #3218](https://github.com/azure/communication-ui-library/pull/3218) by edwardlee@microsoft.com)
- Ensure chat client state changes are true changes ([PR #3317](https://github.com/azure/communication-ui-library/pull/3317) by 3941071+emlynmac@users.noreply.github.com)
- Bump @azure/communication-* SDKs ([PR #3355](https://github.com/azure/communication-ui-library/pull/3355) by 2684369+JamesBurnside@users.noreply.github.com)
- Update micPrimaryActionSplitButtonTitle to microphonePrimaryActionSplitButtonTitle ([PR #3214](https://github.com/azure/communication-ui-library/pull/3214) by 2684369+JamesBurnside@users.noreply.github.com)
- Introduce new handler for disposing screen share for remote participants to stop flashing when navigating through overflow galleries ([PR #3202](https://github.com/azure/communication-ui-library/pull/3202) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fetch translated strings ([PR #3270](https://github.com/azure/communication-ui-library/pull/3270) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Improve Czech translated strings ([PR #3367](https://github.com/azure/communication-ui-library/pull/3367) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix PIPIP on people view to be draggable across the whole screen ([PR #3204](https://github.com/azure/communication-ui-library/pull/3204) by alkwa@microsoft.com)
- Introduce total participant counts to participant list and people pane in composites ([PR #2911](https://github.com/azure/communication-ui-library/pull/2911) by 94866715+dmceachernmsft@users.noreply.github.com)
- Merge startScreenShareGeneric and startScreenSharingGeneric strings ([PR #3198](https://github.com/azure/communication-ui-library/pull/3198) by 2684369+JamesBurnside@users.noreply.github.com)
- Update control bar ui ([PR #3254](https://github.com/azure/communication-ui-library/pull/3254) by carolinecao@microsoft.com)
- Enable Node 18 support ([PR #3229](https://github.com/azure/communication-ui-library/pull/3229) by 3941071+emlynmac@users.noreply.github.com)
- New adapter API joinCallWithOptions to allow start with video and mic ([PR #3319](https://github.com/azure/communication-ui-library/pull/3319) by carolinecao@microsoft.com)
- Hoist error tracking to composite level to allow tracking to be shared across components. This fixes an issue where errors would reappear after being dismissed ([PR #3286](https://github.com/azure/communication-ui-library/pull/3286) by 2684369+JamesBurnside@users.noreply.github.com)
### Bug Fixes
- Fix an issue where local participant stops screen share and their local stream disappears but it is still showing to others in the call ([PR #3419](https://github.com/azure/communication-ui-library/pull/3419) by 94866715+dmceachernmsft@users.noreply.github.com)
- Resolve issue where chat keyboard would dismiss randomly during interop meetings ([PR #3421](https://github.com/azure/communication-ui-library/pull/3421) by 73612854+palatter@users.noreply.github.com)
- Fix message type being hard coded in sending state ([PR #3442](https://github.com/azure/communication-ui-library/pull/3442) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix participant count when you are alone in a call ([PR #3432](https://github.com/azure/communication-ui-library/pull/3432) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix accessibility bug where participant items are missing aria parent ([PR #3412](https://github.com/azure/communication-ui-library/pull/3412) by carolinecao@microsoft.com)
- Fix side pane to refocus the people button when user closes the people pane with keyboard ([PR #3403](https://github.com/azure/communication-ui-library/pull/3403) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix speaker icon in contextual menu of microphone and devices button ([PR #3294](https://github.com/azure/communication-ui-library/pull/3294) by miguelgamis@microsoft.com)
- Fix adapter error on mobile querying speakers when speakers are not available ([PR #3331](https://github.com/azure/communication-ui-library/pull/3331) by carolinecao@microsoft.com)
- Extend touchable/clickable area of button to full height of send box ([PR #3185](https://github.com/azure/communication-ui-library/pull/3185) by longamy@microsoft.com)
- Leverage useId from FluentUI instead of React ([PR #3239](https://github.com/azure/communication-ui-library/pull/3239) by edwardlee@microsoft.com)
- Expose aria-labelledby prop for participantItems ([PR #3218](https://github.com/azure/communication-ui-library/pull/3218) by edwardlee@microsoft.com)
- Show local tile in the overflow gallery when video gallery is in default layout ([PR #3222](https://github.com/azure/communication-ui-library/pull/3222) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update video gallery behavior to show local tile when screen sharing alone in a call ([PR #3222](https://github.com/azure/communication-ui-library/pull/3222) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix unread chat messages badge on the CallWithChatComposite being cleared when the call goes on hold ([PR #3332](https://github.com/azure/communication-ui-library/pull/3332) by 2684369+JamesBurnside@users.noreply.github.com)
- Resolve an issue with edit box showing the number zero ([PR #3295](https://github.com/azure/communication-ui-library/pull/3295) by palatter@microsoft.com)
- Add selected state aria label to active tab header ([PR #3345](https://github.com/azure/communication-ui-library/pull/3345) by edwardlee@microsoft.com)
- Cursor icon remains as default cursor on inactionable participantItems ([PR #3191](https://github.com/azure/communication-ui-library/pull/3191) by edwardlee@microsoft.com)
- CallComposite to control the local tile aspect ratio based on screen aspect ratio and formfactor ([PR #3309](https://github.com/azure/communication-ui-library/pull/3309) by 94866715+dmceachernmsft@users.noreply.github.com)


## [1.6.0](https://github.com/azure/communication-ui-library/tree/1.6.0)

Mon, 12 Jun 2023 19:04:18 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.5.1-beta.5...1.6.0)

### Minor changes

- Updated `@azure/communication-calling` to `1.13.1` ([PR #3040](https://github.com/azure/communication-ui-library/pull/3040) by jiangnanhello@live.com)
- Updated `@azure/communication-chat` to `1.3.1` ([PR #2913](https://github.com/azure/communication-ui-library/pull/2913) by 109105353+jpeng-ms@users.noreply.github.com)
- Add a leaving page when the call state is in disconnecting ([PR #3108](https://github.com/azure/communication-ui-library/pull/3108) by jiangnanhello@live.com)
- Updated use of `react-aria-live` to support react 18 support ([PR #3050](https://github.com/azure/communication-ui-library/pull/3050) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove public API usage of ComponentSlotStyle and redefine type internally ([PR #2996](https://github.com/azure/communication-ui-library/pull/2996) by 2684369+JamesBurnside@users.noreply.github.com)
- Internally wrap `@fluentui/northstar` package for react 18 support ([PR #2983](https://github.com/azure/communication-ui-library/pull/2983) by 3941071+emlynmac@users.noreply.github.com)
- Bump peer depedencies to react 18 ([PR #3050](https://github.com/azure/communication-ui-library/pull/3050) by 2684369+JamesBurnside@users.noreply.github.com)
- Update `@azure/communication-chat` perr depedencies from fixed version to a range of supported versions ([PR #2727](https://github.com/azure/communication-ui-library/pull/2727) by edwardlee@microsoft.com)
- Add `isCameraOn` state to help track camera state in the CallAdapter ([PR #2641](https://github.com/azure/communication-ui-library/pull/2641) by 94866715+dmceachernmsft@users.noreply.github.com)
- Edit message error handling UI in ChatThread component ([PR #2891](https://github.com/azure/communication-ui-library/pull/2891) by 3941071+emlynmac@users.noreply.github.com)
- Add `AR_SA`, `FI_FI`, `HE_IL`, `NB_NO`, `PL_PL` and `SV_SE` locales ([PR #3163](https://github.com/azure/communication-ui-library/pull/3163) by 77021369+jimchou-dev@users.noreply.github.com)
- Update `@fluentui/react-icons` to `2.0.194` ([PR #2749](https://github.com/azure/communication-ui-library/pull/2749) by 2684369+JamesBurnside@users.noreply.github.com)
- Update `@fluentui/react-file-type-icons` to `8.8.13` ([PR #2934](https://github.com/azure/communication-ui-library/pull/2934) by 2684369+JamesBurnside@users.noreply.github.com)
- Split buttons now hold primary action for toggling camera and mic on touch devices ([PR #2773](https://github.com/azure/communication-ui-library/pull/2773) by 94866715+dmceachernmsft@users.noreply.github.com)

### Patches

- Switch video seamlessly from different devices ([PR #2726](https://github.com/azure/communication-ui-library/pull/2726) by jinan@microsoft.com)
- Center more button in video tile ([PR #2902](https://github.com/azure/communication-ui-library/pull/2902) by edwardlee@microsoft.com)
- Fix messages thread loading issue when an adapter is updated ([PR #2784](https://github.com/azure/communication-ui-library/pull/2784) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Addressed the issue where local participant label's luminosity ratio does not meet MAS guidelines ([PR #2795](https://github.com/azure/communication-ui-library/pull/2795) by 109105353+jpeng-ms@users.noreply.github.com)
- Allow horizontal gallery tiles to resize to allow for better use of space ([PR #2830](https://github.com/azure/communication-ui-library/pull/2830) by 94866715+dmceachernmsft@users.noreply.github.com)
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
- Fixes error bar messaging for when camera is in use ([PR #2671](https://github.com/azure/communication-ui-library/pull/2671) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add error string for when your remote video feed is frozen for others in the call ([PR #2808](https://github.com/azure/communication-ui-library/pull/2808) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix findDOMNode warning caused by `React.StrictMode` ([PR #2621](https://github.com/azure/communication-ui-library/pull/2621) by 94866715+dmceachernmsft@users.noreply.github.com)
- Utilize `CommunicationIdentifier` (de)serialization logic from `@azure/communication-common` ([PR #2614](https://github.com/azure/communication-ui-library/pull/2614) by petrsvihlik@microsoft.com)
- Add margin to participant item to allow the focus border to show when selecting each participant with keyboard ([PR #3178](https://github.com/azure/communication-ui-library/pull/3178) by 94866715+dmceachernmsft@users.noreply.github.com)
- Prevent overflow of call composite in call with chat composite when side pane is open ([PR #2861](https://github.com/azure/communication-ui-library/pull/2861) by 79475487+mgamis-msft@users.noreply.github.com)
- Hide Camera, Microphone, and Screenshare buttons in rooms calls depending on role ([PR #2944](https://github.com/azure/communication-ui-library/pull/2944) by 79475487+mgamis-msft@users.noreply.github.com)
- Embed the EditBox inside a Chat.Message to enable the accessibility ([PR #3097](https://github.com/azure/communication-ui-library/pull/3097) by longamy@microsoft.com)
- Update useAzureCommunicationCallAdapter hook to protect against multiple client creations ([PR #3157](https://github.com/azure/communication-ui-library/pull/3157) by 94866715+dmceachernmsft@users.noreply.github.com)
- Replace Coffee Icon with Spinner ([PR #2885](https://github.com/azure/communication-ui-library/pull/2885) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update Aria labels for people button to allow for voice access controls on windows ([PR #2833](https://github.com/azure/communication-ui-library/pull/2833) by 94866715+dmceachernmsft@users.noreply.github.com)
- Changed VideoTile not to show persona coin until an appropriate size is calculated ([PR #3051](https://github.com/azure/communication-ui-library/pull/3051) by 79475487+mgamis-msft@users.noreply.github.com)
- Update json5 dependency ([PR #2645](https://github.com/azure/communication-ui-library/pull/2645) by edwardlee@microsoft.com)
- Prevent overflow of VideoGallery when side pane is open ([PR #2850](https://github.com/azure/communication-ui-library/pull/2850) by miguelgamis@microsoft.com)
- Update forced colours on configuration screen to allow better high contrast experience for user ([PR #2955](https://github.com/azure/communication-ui-library/pull/2955) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update overflow gallery logic to allow more video participants to render video streams if available on different pages ([PR #2818](https://github.com/azure/communication-ui-library/pull/2818) by 94866715+dmceachernmsft@users.noreply.github.com)
- Announce by Screen Reader after leaving chat ([PR #2681](https://github.com/azure/communication-ui-library/pull/2681) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Added empty icon render for tab navigation of video tile ([PR #2693](https://github.com/azure/communication-ui-library/pull/2693) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update error message for unsupported chat thread types ([PR #2907](https://github.com/azure/communication-ui-library/pull/2907) by 77021369+jimchou-dev@users.noreply.github.com)
- Resolve overlap of tooltip and list of devices on mobile configuration page ([PR #3013](https://github.com/azure/communication-ui-library/pull/3013) by edwardlee@microsoft.com)
- Fixed richtext css for blockquote and table in chat messages ([PR #2839](https://github.com/azure/communication-ui-library/pull/2839) by 77021369+jimchou-dev@users.noreply.github.com)
- Fix CallAdapter participants joined and left events to show correct participants in event array ([PR #2837](https://github.com/azure/communication-ui-library/pull/2837) by 94866715+dmceachernmsft@users.noreply.github.com)
- Correct MessageThread API definition ([PR #2812](https://github.com/azure/communication-ui-library/pull/2812) by 3941071+emlynmac@users.noreply.github.com)
- Sendbox icon alignment fixes ([PR #3022](https://github.com/azure/communication-ui-library/pull/3022) by longamy@microsoft.com)
- Update internal dispose view logic to be under one utility function for remote and local streams ([PR #2758](https://github.com/azure/communication-ui-library/pull/2758) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix race condition where the remote video tile was not showing the participant's video ([PR #2672](https://github.com/azure/communication-ui-library/pull/2672) by 2684369+JamesBurnside@users.noreply.github.com)
- Set min height to control bar to fix issue where control bar contrainer would collapse when side pane buttons are disabled in Composites ([PR #2963](https://github.com/azure/communication-ui-library/pull/2963) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix horizontal gallery button icon directions in rtl mode ([PR #3008](https://github.com/azure/communication-ui-library/pull/3008) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix dominant speaker ordering to best keep dominant speakers on the first page of overflow gallery ([PR #2819](https://github.com/azure/communication-ui-library/pull/2819) by miguelgamis@microsoft.com)
- Fix VideoGallery rerender when a participant is pinned for the first time ([PR #2650](https://github.com/azure/communication-ui-library/pull/2650) by 79475487+mgamis-msft@users.noreply.github.com)
- Make sure message status in storybook is defined to avoid 'try send again' showing up ([PR #2732](https://github.com/azure/communication-ui-library/pull/2732) by carolinecao@microsoft.com)
- Fix bug where error bar overlays with pane ([PR #3024](https://github.com/azure/communication-ui-library/pull/3024) by carolinecao@microsoft.com)
- Internal RemoteVideoTile should not default to having contextual menu options ([PR #2653](https://github.com/azure/communication-ui-library/pull/2653) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix: Permission Error in Chat after leaving a Teams Interop meeting ([PR #2777](https://github.com/azure/communication-ui-library/pull/2777) by 2684369+JamesBurnside@users.noreply.github.com)
- Show local video and vertical/horizontal gallery when screensharing with no participants ([PR #2822](https://github.com/azure/communication-ui-library/pull/2822) by carolinecao@microsoft.com)
- Add missing 'rem' from width of avatar. This caused formatting issues when embedding inside a Teams Toolkit App ([PR #3161](https://github.com/azure/communication-ui-library/pull/3161) by palatter@microsoft.com)
- Fix bug where static html samples are not showing fluent icons ([PR #3106](https://github.com/azure/communication-ui-library/pull/3106) by carolinecao@microsoft.com)
- Fix bug where captions rtl languages are not right aligned  ([PR #2999](https://github.com/azure/communication-ui-library/pull/2999) by carolinecao@microsoft.com)
- Updates streamUtils to handle multiple Calls from components ([PR #2713](https://github.com/azure/communication-ui-library/pull/2713) by 94866715+dmceachernmsft@users.noreply.github.com)
- Added missing aria label for title in this call ([PR #2667](https://github.com/azure/communication-ui-library/pull/2667) by carolinecao@microsoft.com)
- Enable ArrowUp and ArrowDown key inside EditBox ([PR #3177](https://github.com/azure/communication-ui-library/pull/3177) by longamy@microsoft.com)
- Update stream utils to have general createView function for both remote and local ([PR #2755](https://github.com/azure/communication-ui-library/pull/2755) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update the Errorbar selector to check environmentInfo for mac specific warnings ([PR #2691](https://github.com/azure/communication-ui-library/pull/2691) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix regression where chat and hold buttons werent disabled when the call went into hold ([PR #3029](https://github.com/azure/communication-ui-library/pull/3029) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix empty string bug in createAnnouncmentString() ([PR #2630](https://github.com/azure/communication-ui-library/pull/2630) by jinan@microsoft.com)
- Move logging from StreamUtils to be managed in seperate file ([PR #2753](https://github.com/azure/communication-ui-library/pull/2753) by 94866715+dmceachernmsft@users.noreply.github.com)
- Modify Avatar to person icon when no displayName ([PR #2636](https://github.com/azure/communication-ui-library/pull/2636) by jinan@microsoft.com)
- Added stream type in stream logs ([PR #2705](https://github.com/azure/communication-ui-library/pull/2705) by carolinecao@microsoft.com)
- Fix VideoTile to show menu button on hover when isSpeaking prop is true ([PR #2721](https://github.com/azure/communication-ui-library/pull/2721) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix scroll and new message prompt in sidepane chat for safari ([PR #3116](https://github.com/azure/communication-ui-library/pull/3116) by edwardlee@microsoft.com)
- Update locale strings ([PR #3181](https://github.com/azure/communication-ui-library/pull/3181) by 2684369+JamesBurnside@users.noreply.github.com)
- Bound CallReadiness screens to the boundaries of the app ([PR #2624](https://github.com/azure/communication-ui-library/pull/2624) by edwardlee@microsoft.com)
- Fix sending/delivered/failed message status not showing in large group ([PR #2707](https://github.com/azure/communication-ui-library/pull/2707) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Remove empty space to the right of participant displayName when tile is not being interacted with ([PR #3080](https://github.com/azure/communication-ui-library/pull/3080) by 94866715+dmceachernmsft@users.noreply.github.com)
- Made sure error bar innerText always centered  ([PR #2668](https://github.com/azure/communication-ui-library/pull/2668) by carolinecao@microsoft.com)
- Fix High Contrast issues with the screenshare button and end call button ([PR #2956](https://github.com/azure/communication-ui-library/pull/2956) by 94866715+dmceachernmsft@users.noreply.github.com)
- updating version of node to 16.19.0 across all packlets ([PR #3016](https://github.com/azure/communication-ui-library/pull/3016) by 79329532+alkwa-msft@users.noreply.github.com)
- Changed horizontal gallery to be scrollable when VideoGallery width is narrow ([PR #2640](https://github.com/azure/communication-ui-library/pull/2640) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix issue where new controls were not being respected by the overflow galleries ([PR #3172](https://github.com/azure/communication-ui-library/pull/3172) by 94866715+dmceachernmsft@users.noreply.github.com)
- VideoGallery in call composite will use a vertical overflow gallery when its aspect ratio is 16:9 or greater ([PR #2786](https://github.com/azure/communication-ui-library/pull/2786) by 79475487+mgamis-msft@users.noreply.github.com)
- Video tile ellipsis should only appear on hover ([PR #2661](https://github.com/azure/communication-ui-library/pull/2661) by 97124699+prabhjot-msft@users.noreply.github.com)

## [1.5.0](https://github.com/azure/communication-ui-library/tree/1.5.0)

Wed, 04 Jan 2023 23:56:34 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.4.1-beta.1...1.5.0)

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
  - Fix spacing for local Camera switcher button when in localVideoTile ([PR #2571](https://github.com/azure/communication-ui-library/pull/2571) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update webpack version ([PR #2625](https://github.com/azure/communication-ui-library/pull/2625) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add announcement strings to the composites so the narrator will announce when someone joins or leaves ([PR #2546](https://github.com/azure/communication-ui-library/pull/2546) by 94866715+dmceachernmsft@users.noreply.github.com)
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
