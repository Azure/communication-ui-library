# Change Log - @azure/communication-react

<!-- This log was last generated on Mon, 03 Feb 2025 22:02:22 GMT and should not be manually modified. -->

<!-- Start content -->

## [1.24.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.24.0-beta.1)

Mon, 03 Feb 2025 22:02:22 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.23.0...1.24.0-beta.1)

### Features
- Merge branch 'main' into fuyan/hard_mute_part3_integrate_web_sdk ([PR #5437](https://github.com/azure/communication-ui-library/pull/5437) by fuyan@microsoft.com)
- Change id to sequenceId for RTT feature state ([PR #5592](https://github.com/azure/communication-ui-library/pull/5592) by 96077406+carocao-msft@users.noreply.github.com)
- Components for real time text ([PR #5525](https://github.com/azure/communication-ui-library/pull/5525) by 96077406+carocao-msft@users.noreply.github.com)
- Caption Banner API update, and update the merged caption list to only store 50 entries. Also added tests for the sorting logic ([PR #5580](https://github.com/azure/communication-ui-library/pull/5580) by 96077406+carocao-msft@users.noreply.github.com)
- together mode component ([PR #5517](https://github.com/azure/communication-ui-library/pull/5517) by undefined)
- Included together mode icon ([PR #5513](https://github.com/azure/communication-ui-library/pull/5513) by undefined)
- Update Calling SDK's ([PR #5475](https://github.com/azure/communication-ui-library/pull/5475) by dmceachern@microsoft.com)
- RTT disclosure banner should be a private component ([PR #5527](https://github.com/azure/communication-ui-library/pull/5527) by 96077406+carocao-msft@users.noreply.github.com)
- RTT API changes ([PR #5590](https://github.com/azure/communication-ui-library/pull/5590) by 96077406+carocao-msft@users.noreply.github.com)
- Cleanup code logic ([PR #5568](https://github.com/azure/communication-ui-library/pull/5568) by undefined)
- Included code snippets about signaling events ([PR #5466](https://github.com/azure/communication-ui-library/pull/5466) by undefined)
- Real Time Text component changes and strings ([PR #5555](https://github.com/azure/communication-ui-library/pull/5555) by 96077406+carocao-msft@users.noreply.github.com)
- Fixed some component bugs and completed RTT storybook ([PR #5593](https://github.com/azure/communication-ui-library/pull/5593) by 96077406+carocao-msft@users.noreply.github.com)
- updated together mode subscriber and included notification when together mode starts or stops ([PR #5489](https://github.com/azure/communication-ui-library/pull/5489) by nwankwojustin93@gmail.com)
- Add expand button for mobile  ([PR #5586](https://github.com/azure/communication-ui-library/pull/5586) by 96077406+carocao-msft@users.noreply.github.com)
- Add RTT to composite experience ([PR #5522](https://github.com/azure/communication-ui-library/pull/5522) by 96077406+carocao-msft@users.noreply.github.com)
- Updated together mode types ([PR #5483](https://github.com/azure/communication-ui-library/pull/5483) by undefined)
- Add RTT to calling stateful sample. Fix bug in start RTT button ([PR #5596](https://github.com/azure/communication-ui-library/pull/5596) by carolinecao@microsoft.com)
- Updated apis naming ([PR #5482](https://github.com/azure/communication-ui-library/pull/5482) by undefined)
- Rename rtt to real time text ([PR #5528](https://github.com/azure/communication-ui-library/pull/5528) by 96077406+carocao-msft@users.noreply.github.com)
- Display warning message when RTT length exceed 2000 ([PR #5578](https://github.com/azure/communication-ui-library/pull/5578) by 96077406+carocao-msft@users.noreply.github.com)
- Promote togethermode to beta ([PR #5608](https://github.com/azure/communication-ui-library/pull/5608) by undefined)
- Hard mute feature UI changes ([PR #5452](https://github.com/azure/communication-ui-library/pull/5452) by fuyan@microsoft.com)
### Improvements
- Remove conditional compile for media access - Part 4 ([PR #5603](https://github.com/azure/communication-ui-library/pull/5603) by fuyan@microsoft.com)
- Add hermetic test for hard mute ([PR #5531](https://github.com/azure/communication-ui-library/pull/5531) by fuyan@microsoft.com)
- Remove hard mute conditional compile part 2 ([PR #5591](https://github.com/azure/communication-ui-library/pull/5591) by fuyan@microsoft.com)
- Automate dominant speaker, pinning, and spotlight tests ([PR #5173](https://github.com/azure/communication-ui-library/pull/5173) by miguelgamis@microsoft.com)
- Add story book for Media access (hard mute) feature ([PR #5456](https://github.com/azure/communication-ui-library/pull/5456) by fuyan@microsoft.com)
- Remove hard mute conditional compile - part 3 ([PR #5594](https://github.com/azure/communication-ui-library/pull/5594) by fuyan@microsoft.com)
- UI components changes ([PR #5452](https://github.com/azure/communication-ui-library/pull/5452) by fuyan@microsoft.com)
- Add sdk references to story book ([PR #5544](https://github.com/azure/communication-ui-library/pull/5544) by fuyan@microsoft.com)
- Remove conditional compile media access part 1 ([PR #5587](https://github.com/azure/communication-ui-library/pull/5587) by fuyan@microsoft.com)
- Add hard mute localization ([PR #5485](https://github.com/azure/communication-ui-library/pull/5485) by fuyan@microsoft.com)
- Update to 1.33.1-beta.1 communication calling version ([PR #5588](https://github.com/azure/communication-ui-library/pull/5588) by edwardlee@microsoft.com)
- updating stable/beta dependencies for calling sdk ([PR #5508](https://github.com/azure/communication-ui-library/pull/5508) by 79329532+alkwa-msft@users.noreply.github.com)
- updating express to 4.21.2 so we can fix a dependnecy issue with path-to-regexp ([PR #5577](https://github.com/azure/communication-ui-library/pull/5577) by 79329532+alkwa-msft@users.noreply.github.com)
- temporary change to get bundle size updates to work again ([PR #5547](https://github.com/azure/communication-ui-library/pull/5547) by 79329532+alkwa-msft@users.noreply.github.com)
- Build captions inside caling stateful sample ([PR #5502](https://github.com/azure/communication-ui-library/pull/5502) by 96077406+carocao-msft@users.noreply.github.com)
### Bug Fixes
- Hard mute accessibility ([PR #5539](https://github.com/azure/communication-ui-library/pull/5539) by fuyan@microsoft.com)
- Fix acs room audio video enabled notifications. when acs user just joined room, should not show the audio video enabled notifications ([PR #5563](https://github.com/azure/communication-ui-library/pull/5563) by fuyan@microsoft.com)
- fix media access hermetic test ([PR #5574](https://github.com/azure/communication-ui-library/pull/5574) by fuyan@microsoft.com)
- Revert changes to add undefined type so we are not introducing a breaking change to the beta release ([PR #5461](https://github.com/azure/communication-ui-library/pull/5461) by 96077406+carocao-msft@users.noreply.github.com)
- update text container width to cap text for longer locale strings ([PR #5579](https://github.com/azure/communication-ui-library/pull/5579) by 94866715+dmceachernmsft@users.noreply.github.com)
- Hide read by in chat action flyout when participants is 20 or more, as read count is not supported. ([PR #5585](https://github.com/azure/communication-ui-library/pull/5585) by palatter@microsoft.com)
- Live announcement update when a message is received/edited from/by other users ([PR #5540](https://github.com/azure/communication-ui-library/pull/5540) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Check capability to determine if set caption language should be shown for teams meeting ([PR #5600](https://github.com/azure/communication-ui-library/pull/5600) by 96077406+carocao-msft@users.noreply.github.com)
- Fix keyboard navigation for message menu button ([PR #5576](https://github.com/azure/communication-ui-library/pull/5576) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix condition compile for hard mute. ([PR #5543](https://github.com/azure/communication-ui-library/pull/5543) by fuyan@microsoft.com)


## [1.22.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.22.0-beta.1)

Mon, 02 Dec 2024 20:48:59 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.21.0...1.22.0-beta.1)

### Improvements
- Add AAD sign out capability for sample app ([PR #5310](https://github.com/azure/communication-ui-library/pull/5310) by 77021369+jimchou-dev@users.noreply.github.com)

### Bug Fixes
- Fix configuration page dropdown accessibility properties when permissions have been blocked ([PR #5425](https://github.com/azure/communication-ui-library/pull/5425) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix call readiness modal being not dismissable by keyboard ([PR #5421](https://github.com/azure/communication-ui-library/pull/5421) by 2684369+JamesBurnside@users.noreply.github.com)
- Add Close aria label for spotlight prompt ([PR #5366](https://github.com/azure/communication-ui-library/pull/5366) by edwardlee@microsoft.com)
- Fix an issue where edited message could be saved without the content and attachments when rich text editor is enabled ([PR #5434](https://github.com/azure/communication-ui-library/pull/5434) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix screenshare tab outline color when presenting ([PR #5431](https://github.com/azure/communication-ui-library/pull/5431) by 2684369+JamesBurnside@users.noreply.github.com)
- In CallCompsite, return focus to control bar when captions is closed from the captions settings button ([PR #5438](https://github.com/azure/communication-ui-library/pull/5438) by 2684369+JamesBurnside@users.noreply.github.com)
- Update configuration page local preview to show 'Video is loading' while camera is switching on or switching source. Also disable camera button while swiching source. ([PR #5430](https://github.com/azure/communication-ui-library/pull/5430) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix regression that caused minor inconsistent padding between connecting and call pages in CallComposite ([PR #5423](https://github.com/azure/communication-ui-library/pull/5423) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix console error that requested teams conference details in unsupported calls ([PR #5444](https://github.com/azure/communication-ui-library/pull/5444) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix A11y Properties of Participant List More Options to have aria-expanded, aria-controls and aria-label. Correctly apply focus when the CallComposite people pane is opened when no one else has joined the call. ([PR #5427](https://github.com/azure/communication-ui-library/pull/5427) by 2684369+JamesBurnside@users.noreply.github.com)
- Update aria-live property of notifications in the notification stack. Update camera button aria-label to indicate loading status to match announcer. ([PR #5428](https://github.com/azure/communication-ui-library/pull/5428) by 2684369+JamesBurnside@users.noreply.github.com)
- Add aria descriptions to reaction and raise buttons ([PR #5414](https://github.com/azure/communication-ui-library/pull/5414) by dmceachern@microsoft.com)
- Fix string typo for captions dropdown info. Fix usePropsFor return type for RaiseHandButton. ([PR #5448](https://github.com/azure/communication-ui-library/pull/5448) by 79475487+mgamis-msft@users.noreply.github.com)


## [1.21.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.21.0-beta.1)

Mon, 28 Oct 2024 22:53:26 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.20.0-beta.1...1.21.0-beta.1)

### Improvements
- Update Chat signaling to latest beta ([PR #5361](https://github.com/azure/communication-ui-library/pull/5361) by 109105353+jpeng-ms@users.noreply.github.com)
- Stop showing speaker dropdown on Safari ([PR #5328](https://github.com/azure/communication-ui-library/pull/5328) by 2684369+JamesBurnside@users.noreply.github.com)
- Upgrade calling stable version to 1.29.1 ([PR #5330](https://github.com/azure/communication-ui-library/pull/5330) by 79475487+mgamis-msft@users.noreply.github.com)
### Bug Fixes
- Add new Aria strings to better support narration of participant information in the video gallery ([PR #5345](https://github.com/azure/communication-ui-library/pull/5345) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix BreakoutRoomsBanner component to return null instead of undefined when there is no breakout room state ([PR #5358](https://github.com/azure/communication-ui-library/pull/5358) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix video dispose problem for multiple video stream ([PR #5188](https://github.com/azure/communication-ui-library/pull/5188) by jiangnanhello@live.com)
- Fix call not found error when gets removed ([PR #5338](https://github.com/azure/communication-ui-library/pull/5338) by jiangnanhello@live.com)
- Focus will move into the menu directly when menu open ([PR #5313](https://github.com/azure/communication-ui-library/pull/5313) by jiangnanhello@live.com)
- Expose environmentInfo in callClient state and callAdapter state ([PR #5328](https://github.com/azure/communication-ui-library/pull/5328) by 2684369+JamesBurnside@users.noreply.github.com)
- Increase Start Call button height on the Configuration Page to 52px on mobile form factor ([PR #5336](https://github.com/azure/communication-ui-library/pull/5336) by 2684369+JamesBurnside@users.noreply.github.com)
- Resolve issue where rich text editor tool bar would not focus when shown. Also fixed issue where editor component would remount when showing/hiding toolbar ([PR #5337](https://github.com/azure/communication-ui-library/pull/5337) by 73612854+palatter@users.noreply.github.com)


## [1.20.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.20.0-beta.1)

Tue, 01 Oct 2024 17:03:44 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.19.0-beta.3...1.20.0-beta.1)

### Features

#### JavaScript loaders

Azure Communication services is excited to introduce a new way to consume our Composite experiences. If you are wanting to use the Azure Communication Services UI library Composites and don't develop in react, we are introducing a series of loader functions to allow you to use the Composites in your application. These functions load a react node and attach it to your application allowing you to use the Composites as if you were building in react.

### Improvements

- Change logic of showing button to join breakout room when the breakout room call is available ([PR #5109](https://github.com/azure/communication-ui-library/pull/5109) by 79475487+mgamis-msft@users.noreply.github.com)
- Add waiting overlay when only one person is in the call ([PR #5054](https://github.com/azure/communication-ui-library/pull/5054) by 96077406+carocao-msft@users.noreply.github.com)
- Add new sub package `@azure/communication-react/javascript-loaders` to export the JavaScript loader functions ([PR #5106](https://github.com/azure/communication-ui-library/pull/5106) by dmceachern@microsoft.com)
- Add Welsh component and composite locales ([PR #5243](https://github.com/Azure/communication-ui-library/pull/5243) by 79475487+mgamis-msft@users.noreply.github.com)

### Bug Fixes

- Add better white space handling for text messages in message components ([PR #5225](https://github.com/azure/communication-ui-library/pull/5225) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Delete joined and closing breakout room notifications when user is unassigned from breakout room or re-assigned to a closed breakout room ([PR #5108](https://github.com/azure/communication-ui-library/pull/5108) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix compliance notification not showing that transcription has stopped in react18 strict mode ([PR #5092](https://github.com/azure/communication-ui-library/pull/5092) by 2684369+JamesBurnside@users.noreply.github.com)
- Safely subscribe to on stateChanged events to prevent related events from failing if listeners throw an error ([PR #5165](https://github.com/azure/communication-ui-library/pull/5165) by edwardlee@microsoft.com)
- Introduce logic to flag when the `AzureCommunicationServicesChatAdapter` is in the middle of creation when using the react hook: `useAzureCommunicationServicesChatAdapter` ([PR #5182](https://github.com/azure/communication-ui-library/pull/5182) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix call control configuration API there was an issue where some controls weren't hidden when configured to be removed ([PR #5193](https://github.com/azure/communication-ui-library/pull/5193) by dmceachern@microsoft.com)
- Fix runtime error when starting screenshare alone in a call ([PR #5240](https://github.com/Azure/communication-ui-library/pull/5240) by 79475487+mgamis-msft@users.noreply.github.com)


## [1.19.0-beta.3](https://github.com/azure/communication-ui-library/tree/1.19.0-beta.3)

Fri, 06 Sep 2024 23:30:32 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.19.0-beta.2...1.19.0-beta.3)

### Bug Fixes
- Fix lazy loading for Composites ([PR #5126](https://github.com/azure/communication-ui-library/pull/5126) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)


## [1.19.0-beta.2](https://github.com/azure/communication-ui-library/tree/1.19.0-beta.2)

Mon, 26 Aug 2024 18:25:58 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.19.0-beta.1...1.19.0-beta.2)

### Features

#### Breakout Rooms

We are excited to announce that the Azure Communication Services Web UI Library enables ACS users to be moved to assigned breakout rooms when in Teams meetings. ACS
users will readily be able move to breakout rooms in the Call and CallWithChat composite. In the CallWithChat composite, the chat thread will be updated when in the breakout room. Breakout rooms can also be incorporated into apps that use only our stateful layer. It is important to note that ACS users will not yet be able to choose their own breakout room or manage breakout rooms as a Teams user with an organizer role.

### Improvements
- Update communication calling to 1.28.1-beta.4 and 1.27.5 ([PR #5051](https://github.com/azure/communication-ui-library/pull/5051) by edwardlee@microsoft.com)
- Add PPTLive presenter information ([PR #4494](https://github.com/azure/communication-ui-library/pull/4494) by 93549644+ShaunaSong@users.noreply.github.com)
### Bug Fixes
- Fix CallComposite camera prompts to respect deviceChecks property ([PR #5052](https://github.com/azure/communication-ui-library/pull/5052) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix error when listening to capabilitiesChanged and spotlightChanged events from AzureCommunicationCallWithChatAdapter ([PR #5066](https://github.com/azure/communication-ui-library/pull/5066) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix bug when adapter caption events are not firing ([PR #5065](https://github.com/azure/communication-ui-library/pull/5065) by 96077406+carocao-msft@users.noreply.github.com)
- Update RoosterJS version to fix some issues with keyboard table navigation in Rich Text Editor components ([PR #5050](https://github.com/azure/communication-ui-library/pull/5050) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix chat selectors using read receipts from state ([PR #5063](https://github.com/azure/communication-ui-library/pull/5063) by 79475487+mgamis-msft@users.noreply.github.com)


## [1.19.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.19.0-beta.1)

Tue, 06 Aug 2024 19:45:27 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.18.0...1.19.0-beta.1)

### Features

#### Soft Mute

We are excited to announce that the Azure Communication Services Web UI Library now supports the Soft Mute feature. This feature enables users to mute other users in a call. If a user has been soft muted, they retain the ability to unmute themselves. Developers can use this functionality today through our composites (e.g CallComposite, CallWithChatComposite).

#### Rich Text Editor

This release brings Rich Text Editor to the ChatComposite and the CallWithChatComposite with the following new features:
- We have added support for sending/editing messages that include images when in a Teams meeting using the CallWithChatComposite.
- An additional `onPaste` callback that can be used to customize content pasted to Rich Text Editor.

#### Text Only Messaging Policy
We now support the ability to set a text-only messaging policy for a chat thread. In Teams Meeting Chat scenarios, the CallWithChatComposite will enable/disable image upload based on the text only message policy of the meeting.

### Improvements
- Update @fluentui-contrib/react-chat to fix focus issues in chat component ([PR #4862](https://github.com/azure/communication-ui-library/pull/4862) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update @azure/communication-calling beta to 1.28.1-beta.1 and stable to 1.27.2 ([PR #4954](https://github.com/azure/communication-ui-library/pull/4954) by 79475487+mgamis-msft@users.noreply.github.com)
- Add `aria-checked` for Rich Text Editor toolbar menu items ([PR #4787](https://github.com/azure/communication-ui-library/pull/4787) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update table border width in insert table menu for Rich Text Editor to 1px ([PR #4816](https://github.com/azure/communication-ui-library/pull/4816) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update all dependencies with patch updates ([PR #4930](https://github.com/azure/communication-ui-library/pull/4930) by 2684369+JamesBurnside@users.noreply.github.com)
- Improve Rich Text Editor content handling logic by adding a content sanitizer ([PR #4796](https://github.com/azure/communication-ui-library/pull/4796) by 98852890+vhuseinova-msft@users.noreply.github.com)

### Bug Fixes
- Remove use of phonenumberlib-js and manually format NA numbers ([PR #4920](https://github.com/azure/communication-ui-library/pull/4920) by 2684369+JamesBurnside@users.noreply.github.com)
- Update CallWithChat sample to disable BYOS file sharing in Teams calls ([PR #4786](https://github.com/azure/communication-ui-library/pull/4786) by 109105353+jpeng-ms@users.noreply.github.com)
- Add missing aria label for placeholder on editor ([PR #4750](https://github.com/azure/communication-ui-library/pull/4750) by 73612854+palatter@users.noreply.github.com)
- Resolve an accessibility issue where show richTextEditor button didn't have aria-expanded attribute ([PR #4759](https://github.com/azure/communication-ui-library/pull/4759) by 73612854+palatter@users.noreply.github.com)
- Suppress initial notifications of capabilities being present when joining a call ([PR #4994](https://github.com/azure/communication-ui-library/pull/4994) by 79475487+mgamis-msft@users.noreply.github.com)
- Update roosterjs version and set tabbing to be ignored by editor for accessibility ([PR #4804](https://github.com/azure/communication-ui-library/pull/4804) by 73612854+palatter@users.noreply.github.com)
- Refactor Teams Identity Logic for File Sharing ([PR #4918](https://github.com/azure/communication-ui-library/pull/4918) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix bug where speakers are getting selected on safari ([PR #4893](https://github.com/azure/communication-ui-library/pull/4893) by 96077406+carocao-msft@users.noreply.github.com)
- Fix for rich text editor toolbar buttons hover state on Android devices ([PR #4748](https://github.com/azure/communication-ui-library/pull/4748) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Resolve issue where placeholder didn't always hide. ([PR #4844](https://github.com/azure/communication-ui-library/pull/4844) by palatter@microsoft.com)
- Fix an issue where cursor position was incorrect after rich text input box was reset ([PR #4887](https://github.com/azure/communication-ui-library/pull/4887) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix pinned participant limit to update correctly when pinned participants are removed from call ([PR #4761](https://github.com/azure/communication-ui-library/pull/4761) by 79475487+mgamis-msft@users.noreply.github.com)
- Resolve an accessibility issue with rich text editor table size selection color contrast. ([PR #4767](https://github.com/azure/communication-ui-library/pull/4767) by palatter@microsoft.com)
- Fix vulnerability of having NaN from calculations in horizontal or vertical overflow gallery ([PR #4861](https://github.com/azure/communication-ui-library/pull/4861) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix the issue where Rich Text Editor cannot send rich text with file attachments ([PR #4747](https://github.com/azure/communication-ui-library/pull/4747) by 109105353+jpeng-ms@users.noreply.github.com)
- Update paddings and theme handling for rich text editor toolbar ([PR #4852](https://github.com/azure/communication-ui-library/pull/4852) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix for accessibility issues for selection and placeholder text color in rich text editor ([PR #4743](https://github.com/azure/communication-ui-library/pull/4743) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Resolve issue around rich text editor table size selection buttons. ([PR #4766](https://github.com/azure/communication-ui-library/pull/4766) by palatter@microsoft.com)
- Update rich text editor border table size selection color for accessibility ([PR #4790](https://github.com/azure/communication-ui-library/pull/4790) by 73612854+palatter@users.noreply.github.com)
- Resolve an accessibility issue with rich text editor border color contrast. ([PR #4783](https://github.com/azure/communication-ui-library/pull/4783) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add announcements for applying bulleted/numbered lists in rich text editor and for adding new list items to them ([PR #4874](https://github.com/azure/communication-ui-library/pull/4874) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add Aria Roles for accessibility ([PR #4731](https://github.com/azure/communication-ui-library/pull/4731) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix the issue where image loading placeholder doesn't work for safari ([PR #4846](https://github.com/azure/communication-ui-library/pull/4846) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix for an issue where toolbar didn't correctly show the selected style format during message editing ([PR #4940](https://github.com/azure/communication-ui-library/pull/4940) by 98852890+vhuseinova-msft@users.noreply.github.com)

### Known Issues
- For certain Android devices, pasting of a single image is only supported by long pressing on the Rich Text Editor and choosing paste. Selecting from the clipboard view from keyboard may not be supported.

## [1.18.0-beta.1](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.18.0-beta.1)

Mon, 17 Jun 2024 16:27:12 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.17.0...1.18.0-beta.1)

### Features

#### Data Loss Prevention (DLP) Message Support - Public Preview

- Data Loss Prevention (DLP) support has been enabled in the Composite for Teams interoperability scenarios. When enabled in Teams, DLP policies can be applied to prevent sensitive information from being shared in chat messages.

#### Video Pinning - Public Preview

- UI library has been updated to include functionality for pinning a video tile from the participant list, in addition to the existing video gallery pinning feature.

### Improvements

- Update table border and selection colors for rich text editor and messages ([PR #4675](https://github.com/azure/communication-ui-library/pull/4675) by 98852890+vhuseinova-msft@users.noreply.github.com)

### Bug Fixes

- Fix an issue where reactions are dismissed when receiving new captions ([PR #4707](https://github.com/azure/communication-ui-library/pull/4707) by 96077406+carocao-msft@users.noreply.github.com)
- Update the color of message time stamps to meet a11y contrast requirements ([PR #4688](https://github.com/azure/communication-ui-library/pull/4688) by longamy@microsoft.com)
- Disable highlight of message context menu on touch event on Android ([PR #4726](https://github.com/azure/communication-ui-library/pull/4726) by 3941071+emlynmac@users.noreply.github.com)
- Use display name from participant list for captions speaker display name ([PR #4703](https://github.com/azure/communication-ui-library/pull/4703) by 96077406+carocao-msft@users.noreply.github.com)
- Fix an issue where user cannot update message content ([PR #4701](https://github.com/azure/communication-ui-library/pull/4701) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix an issue where rich the text editor content wasn't scrolled correctly when new content is pasted ([PR #4720](https://github.com/azure/communication-ui-library/pull/4720) by <98852890+vhuseinova-msft@users.noreply.github.com>)

## [1.17.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.17.0-beta.1)

Tue, 21 May 2024 20:14:27 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.16.0...1.17.0-beta.1)

### Features

#### Join Call with Meeting ID/Passcode

We are excited to announce that the Azure Communication Services Web UI Library now supports joining a call with a Meeting Passcode and ID. Currently, Microsoft Teams allows you to require a meeting password for added security and generates a unique meeting ID for each meeting that participants can use to join. This feature now allows users on ACS to join interop Teams calls that have a meeting passcode or an ID generated. This is useful for private calls or events where limited access needs to be granted. Developers can use this functionality today through our composites (e.g CallComposite, CallWithChatComposite) as well as through components.

#### File Sharing

UI library supports file sharing for Teams Interop Scenario in CallWithChatComposite. File sharing capabilities are also supported in ChatComposite in conjunction with your choice of a storage solution. We have made improvements to the file sharing feature in this beta release. The attachment card is now more optimized and you can find the usage instructions in the storybook.

#### Rich Text Editor

This release brings major enhancements to the rich text editor feature. The changes include:

- Upgrading Rooster JS from v8 to v9
- Replacing RoosterJS React components with our own components

#### Improvements

- Add notification for Hide Attendee Names ([PR #4554](https://github.com/azure/communication-ui-library/pull/4554) by 97124699+prabhjot-msft@users.noreply.github.com)
- Menu icon behavior improved ([PR #4584](https://github.com/azure/communication-ui-library/pull/4584) by jiangnanhello@live.com)
- Allow captions to be used when in a adhoc teams call ([PR #4579](https://github.com/azure/communication-ui-library/pull/4579) by dmceachern@microsoft.com)

#### Bug Fixes

- Update styles to fix spacing of labeled background effects ([PR #4614](https://github.com/azure/communication-ui-library/pull/4614) by dmceachern@microsoft.com)
- Add reaction items narrator strings ([PR #4635](https://github.com/azure/communication-ui-library/pull/4635) by dmceachern@microsoft.com)
- Add Missing Message Options for MessageThread Component ([PR #4600](https://github.com/azure/communication-ui-library/pull/4600) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix bug where raise hand's height is the height of video tile ([PR #4589](https://github.com/azure/communication-ui-library/pull/4589) by 96077406+carocao-msft@users.noreply.github.com)
- Fix for Pin tile icon too small ([PR #4587](https://github.com/azure/communication-ui-library/pull/4587) by 97124699+prabhjot-msft@users.noreply.github.com)
- Fix crash bug for remote screen share ([PR #4608](https://github.com/azure/communication-ui-library/pull/4608) by jiangnanhello@live.com)
- Fix bug when there are duplicate captions ([PR #4534](https://github.com/azure/communication-ui-library/pull/4534) by 96077406+carocao-msft@users.noreply.github.com)
- Fix width for code snippets sent in messages ([PR #4633](https://github.com/azure/communication-ui-library/pull/4633) by 98852890+vhuseinova-msft@users.noreply.github.com)

## [1.16.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.16.0-beta.1)

Tue, 23 Apr 2024 17:54:31 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.16.0...1.16.0-beta.1)

### Features

#### Rich Text Editor - Public Preview

The Web UI RichTextSendBox and MessageThread components now support rich text formatting to generate HTML content for chat messages. This feature includes support for:

- Different text styles (bold, italic and underline)
- Bulleted and numbered lists
- Changing indentation for text
- Adding and updating tables

#### Closed Captions - Public Preview

We are excited to announce that Azure Communications Services has recently added the Closed Captions feature. With closed captions, developers can provide a textual representation of the audio content in their videos, making it easier for users who are deaf or hard of hearing to follow along. Developers can enable this functionality today through our composites (e.g CallComposite, CallWithChatComposite). This feature includes support for:

- Enable and disable closed captions in the call
- Change spoken language
- Being able to use captions outside of teams scenario

### Improvements

- Rename "file" to "attachment" for File Sharing Upload Flow ([PR #4369](https://github.com/azure/communication-ui-library/pull/4369) by 109105353+jpeng-ms@users.noreply.github.com)
- Update File Sharing Public APIs ([PR #4464](https://github.com/azure/communication-ui-library/pull/4464) by 109105353+jpeng-ms@users.noreply.github.com)
- Update File Sharing API References in Storybook ([PR #4382](https://github.com/azure/communication-ui-library/pull/4382) by 109105353+jpeng-ms@users.noreply.github.com)
- Add A11y for FluentUI attachment card ([PR #4406](https://github.com/azure/communication-ui-library/pull/4406) by 77021369+jimchou-dev@users.noreply.github.com)
- Allow always showing background color for display name containers in VideoTiles ([PR #4489](https://github.com/azure/communication-ui-library/pull/4489) by edwardlee@microsoft.com)
- Migrate to FluentUI Card for AttachmentCards ([PR #4313](https://github.com/azure/communication-ui-library/pull/4313) by 77021369+jimchou-dev@users.noreply.github.com)
- Update communication-chat to 1.5.0-beta.2 ([PR #4445](https://github.com/azure/communication-ui-library/pull/4445) by 3941071+emlynmac@users.noreply.github.com)

### Bug Fixes

- Solving reaction out of screen viewport issue ([PR #4412](https://github.com/azure/communication-ui-library/pull/4412) by mbellah@microsoft.com)
- Changing the order of the reaction animation appearance. ([PR #4368](https://github.com/azure/communication-ui-library/pull/4368) by mbellah@microsoft.com)
- Reaction animation inconsistency for presentaiton mode burse case fixed. ([PR #4370](https://github.com/azure/communication-ui-library/pull/4370) by mbellah@microsoft.com)
- Fix the issue where file cannot be removed from edit box ([PR #4385](https://github.com/azure/communication-ui-library/pull/4385) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix an issue where all messages were re-rendered when a new message was sent ([PR #4451](https://github.com/azure/communication-ui-library/pull/4451) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Improve detecting if camera permission is available by using Permissions API in the StatefulCallClient ([PR #4472](https://github.com/azure/communication-ui-library/pull/4472) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix Aria label for sidepane header ([PR #4475](https://github.com/azure/communication-ui-library/pull/4475) by edwardlee@microsoft.com)
- Fix issue where android user's videos would not be on when joining the call caused by a stream change ([PR #4461](https://github.com/azure/communication-ui-library/pull/4461) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix local tile switcher action ([PR #4447](https://github.com/azure/communication-ui-library/pull/4447) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix position of raised hand icon in video tiles ([PR #4453](https://github.com/azure/communication-ui-library/pull/4453) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix Screen Reader Reads `&nbsp;` ([PR #4500](https://github.com/azure/communication-ui-library/pull/4500) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix VideoTile MeetingReactionOverlay corner missing rounded style ([PR #4413](https://github.com/azure/communication-ui-library/pull/4413) by mbellah@microsoft.com)
- Update button label rem size to fit shorter text ([PR #4460](https://github.com/azure/communication-ui-library/pull/4460) by edwardlee@microsoft.com)
- Allow capability changes only in connected screen ([PR #4409](https://github.com/azure/communication-ui-library/pull/4409) by mbellah@microsoft.com)
- Fix Reaction button background color fixes on click ([PR #4407](https://github.com/azure/communication-ui-library/pull/4407) by mbellah@microsoft.com)
- Add adapter options to JS bundles ([PR #4486](https://github.com/azure/communication-ui-library/pull/4486) by dmceachern@microsoft.com)
- Remove PPTLive overlay ([PR #4446](https://github.com/azure/communication-ui-library/pull/4446) by 93549644+ShaunaSong@users.noreply.github.com)
- Add Chat Attachments in Live Messages ([PR #4438](https://github.com/azure/communication-ui-library/pull/4438) by 109105353+jpeng-ms@users.noreply.github.com)
- Fix VideoGallery to not use optimal video count when there are no remote videos on ([PR #4364](https://github.com/azure/communication-ui-library/pull/4364) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix bugs of endcall button UX ([commit](https://github.com/azure/communication-ui-library/commit/not available) by jiangnanhello@live.com)
- Fix bugs for end call UX ([commit](https://github.com/azure/communication-ui-library/commit/not available) by jiangnanhello@live.com)
- Fix default constant maxWidth value for fluent chat components ([PR #4510](https://github.com/azure/communication-ui-library/pull/4510) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix exception thrown when joining an Teams Interop meeting that has an unsupported chat thread ([PR #4482](https://github.com/azure/communication-ui-library/pull/4482) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.15.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.15.0-beta.1)

Tue, 26 Mar 2024 17:38:26 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.14.0...1.15.0-beta.1)

### End of Call Survey - Public Preview

The UI Library now supports End of Call Survey, with the feature added to the CallComposite and CallwithChatComposite on web. The survey supports feedback for the categories of overall quality, audio, video, and screenshare. This survey appears at the end of composite experience. By default, users are taken to a “thank you for your feedback” page after survey is submitted, and taken to the end call screen if survey is skipped. We provide abilities to overwrite those default screens. The survey can be disabled or enabled. The data received is sent to Contoso’s local Azure monitoring where it can be validated for overall call quality. When free form text survey is enabled, the free form text data collected are not sent to local Azure monitoring and will need to be handled by Contoso.

### Features
- Move End of Call Survey feature to beta
- Add localRecordingNotification to calling-stateful-client ([PR #4265](https://github.com/azure/communication-ui-library/pull/4265) by edwardlee@microsoft.com)
- Introduce new JS bundles for making outbound calls to teams voice applications ([PR #4315](https://github.com/Azure/communication-ui-library/pull/4315) by dmceachern@microsoft.com)
- Remove the InlineImageMetadata type ([PR #4212](https://github.com/azure/communication-ui-library/pull/4212) by 9044372+JoshuaLai@users.noreply.github.com)
- Introduce new ability in the queue to cancel inflight request ([PR #4237](https://github.com/azure/communication-ui-library/pull/4237) by 9044372+JoshuaLai@users.noreply.github.com)
- In cases of errors when fetch inline images, Chat Stateful Client now returns an empty string ([PR #4230](https://github.com/azure/communication-ui-library/pull/4230) by 9044372+JoshuaLai@users.noreply.github.com)
- Introduce new concept of ResourceResult ([PR #4223](https://github.com/azure/communication-ui-library/pull/4223) by 9044372+JoshuaLai@users.noreply.github.com)

### Improvements
- Change screenShareParticipant to be optional ([PR #4204](https://github.com/azure/communication-ui-library/pull/4204) by 93549644+ShaunaSong@users.noreply.github.com)
- Upgrade Typescript to 5.4.2 ([PR #4284](https://github.com/azure/communication-ui-library/pull/4284) by 2684369+JamesBurnside@users.noreply.github.com)
- Update SDK version ([PR #4221](https://github.com/azure/communication-ui-library/pull/4221) by 93549644+ShaunaSong@users.noreply.github.com)
- Run CI on release branches ([PR #4181](https://github.com/azure/communication-ui-library/pull/4181) by 2684369+JamesBurnside@users.noreply.github.com)
- Improve generate-api-diff output to more easily see errors ([PR #4192](https://github.com/azure/communication-ui-library/pull/4192) by 2684369+JamesBurnside@users.noreply.github.com)
- Update hotfix instructions ([PR #4232](https://github.com/azure/communication-ui-library/pull/4232) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove @azure/core-rest-pipeline from dependencies ([PR #4294](https://github.com/azure/communication-ui-library/pull/4294) by 2684369+JamesBurnside@users.noreply.github.com)
- Make sourceUrl optional ([PR #4268](https://github.com/azure/communication-ui-library/pull/4268) by 9044372+JoshuaLai@users.noreply.github.com)
- Rename imgAttrs to imageAttributes ([PR #4242](https://github.com/azure/communication-ui-library/pull/4242) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- In Composite, use adapter state to get the full size cached image src ([PR #4207](https://github.com/azure/communication-ui-library/pull/4207) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- In the chat composite, if the message contains image that's not an ACS image, we will render the image but it will not be clickable to view and download in the ImageOverlay ([PR #4214](https://github.com/azure/communication-ui-library/pull/4214) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Update Mention api to include isActive argument ([PR #4183](https://github.com/azure/communication-ui-library/pull/4183) by 73612854+palatter@users.noreply.github.com)
- Remove AttachmentMetadata type ([PR #4217](https://github.com/azure/communication-ui-library/pull/4217) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Validate that the src you are fetching from and endpoint match ([PR #4251](https://github.com/azure/communication-ui-library/pull/4251) by 9044372+JoshuaLai@users.noreply.github.com)
- Rename Files to Attachments ([PR #4303](https://github.com/azure/communication-ui-library/pull/4303) by 109105353+jpeng-ms@users.noreply.github.com)
- Relocate File Sharing Data Models to Component level from Composite ([PR #4314](https://github.com/azure/communication-ui-library/pull/4314) by 109105353+jpeng-ms@users.noreply.github.com)

### Bug Fixes
- Fix order of dominant speakers in overflow gallery ([PR #4276](https://github.com/azure/communication-ui-library/pull/4276) by miguelgamis@microsoft.com)
- Prioritize the last stream of each type that is available ([PR #4300](https://github.com/azure/communication-ui-library/pull/4300) by alkwa@microsoft.com)
- Fix bug where the metadata was not being sent up to the handler ([PR #4213](https://github.com/azure/communication-ui-library/pull/4213) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix the issue where image placeholder being shown when fetching failed ([PR #4172](https://github.com/azure/communication-ui-library/pull/4172) by 109105353+jpeng-ms@users.noreply.github.com)
- Add key to MsftMention tag ([PR #4188](https://github.com/azure/communication-ui-library/pull/4188) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Disable clicking before inline image is loaded ([PR #4248](https://github.com/azure/communication-ui-library/pull/4248) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Subscribe to LocalRecordingNotification in Teams interop calls only ([PR #4321](https://github.com/azure/communication-ui-library/pull/4321) by edwardlee@microsoft.com)
- Ensure theme is memoized for calls to useTheme ([PR #4301](https://github.com/azure/communication-ui-library/pull/4301) by 2684369+JamesBurnside@users.noreply.github.com)
- Ensure fileSharingMetadata is only set if there are valid objects ([PR #4322](https://github.com/azure/communication-ui-library/pull/4322) by 3941071+emlynmac@users.noreply.github.com)
- Retain pinned participants after holding call in CallComposite and CallWithChatComposite ([PR #4319](https://github.com/azure/communication-ui-library/pull/4319) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix inline image live message announcement content for accessibility ([PR #4236](https://github.com/azure/communication-ui-library/pull/4236) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)


## [1.14.0-beta.2](https://github.com/azure/communication-ui-library/tree/1.14.0-beta.2)

Tue, 05 Mar 2024 16:19:15 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.14.0-beta.1...1.14.0-beta.2)

Reinclude CallComposite `Branding` option.

## [1.14.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.14.0-beta.1)

Mon, 26 Feb 2024 16:19:15 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.13.0...1.14.0-beta.1)

### Improvements

- Provide managed image cache for inline images and associated APIs
  - [PR #4099](https://github.com/azure/communication-ui-library/pull/4099), [PR #4126](https://github.com/azure/communication-ui-library/pull/4126), [PR #4071](https://github.com/azure/communication-ui-library/pull/4071) by <9044372+JoshuaLai@users.noreply.github.com>
- Rework ImageGallery to ImageOverlay; updates to related APIs
  - [PR #4083](https://github.com/azure/communication-ui-library/pull/4083), [PR #4117](https://github.com/azure/communication-ui-library/pull/4117), [PR #4154](https://github.com/azure/communication-ui-library/pull/4154), [PR #4101](https://github.com/azure/communication-ui-library/pull/4101) by <107075081+Leah-Xia-Microsoft@users.noreply.github.com>

### Bug Fixes

- Update styling to include space for back button ([PR #4079](https://github.com/azure/communication-ui-library/pull/4079) by 94866715+dmceachernmsft@users.noreply.github.com)
- Defect fixing the src of the inline image ([PR #4104](https://github.com/azure/communication-ui-library/pull/4104) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix for an issue when head and body tags were added to messages with html type ([PR #4106](https://github.com/azure/communication-ui-library/pull/4106) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix message rendering of inline image when there is no message text ([PR #4084](https://github.com/azure/communication-ui-library/pull/4084) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix color loss of raised hand icon on iOS ([PR #4089](https://github.com/azure/communication-ui-library/pull/4089) by 79475487+mgamis-msft@users.noreply.github.com)
- Resolve issue where images previews would not show in a message if the message also had a file attachment. ([PR #4167](https://github.com/azure/communication-ui-library/pull/4167) by 73612854+palatter@users.noreply.github.com)
- Update gallery logic to not include local participant in grid calculations. ([PR #4136](https://github.com/azure/communication-ui-library/pull/4136) by dmceachern@microsoft.com)
- Hangup Call to transfer target when leaving in mid-transfer ([PR #4155](https://github.com/azure/communication-ui-library/pull/4155) by dmceachern@microsoft.com)
- Update the policy violation check ([PR #4087](https://github.com/azure/communication-ui-library/pull/4087) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix for a deleted message accessibility announcement ([PR #4169](https://github.com/azure/communication-ui-library/pull/4169) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Replace Inline Image tag with image text for aria text ([PR #4128](https://github.com/azure/communication-ui-library/pull/4128) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Set hide attendee name option to 'False' until replaced by sdk ([PR #4111](https://github.com/azure/communication-ui-library/pull/4111) by 97124699+prabhjot-msft@users.noreply.github.com)
- Resolve issue where edited label is missing from received messages ([PR #4150](https://github.com/azure/communication-ui-library/pull/4150) by 73612854+palatter@users.noreply.github.com)
- Fix offset of message edit box ([PR #4112](https://github.com/azure/communication-ui-library/pull/4112) by 3941071+emlynmac@users.noreply.github.com)

## [1.13.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.13.0-beta.1)

Mon, 29 Jan 2024 17:18:22 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.12.0...1.13.0-beta.1)

### Custom Branding - Public Preview

The CallComposite and CallWithChatComposite now support applying a background image and logo to the Configuration Page. This allows developers to unify their customers' joining experiences if they have a Teams Premium feature enabled called Teams Meeting Themes.

### Features
- Include ability to set background image and logo in CallComposites in beta packages ([PR #3968](https://github.com/azure/communication-ui-library/pull/3968) by 2684369+JamesBurnside@users.noreply.github.com)

### Improvements
- Change onInlineImageClicked API to inlineImageOptions ([PR #4050](https://github.com/azure/communication-ui-library/pull/4050) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Introduce new queue system to download images ([PR #4044](https://github.com/azure/communication-ui-library/pull/4044) by 9044372+JoshuaLai@users.noreply.github.com)
- Update dependencies that had a patch bump available ([PR #4036](https://github.com/azure/communication-ui-library/pull/4036) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add license field for package.json files ([PR #4018](https://github.com/azure/communication-ui-library/pull/4018) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update to TypeScript 4.6.3 minimum ([PR #3862](https://github.com/azure/communication-ui-library/pull/3862) by 3941071+emlynmac@users.noreply.github.com)
- Update to rollup 4.7.0 ([PR #3894](https://github.com/azure/communication-ui-library/pull/3894) by 3941071+emlynmac@users.noreply.github.com)
- Update localized strings for aria label when message is deleted ([PR #3899](https://github.com/azure/communication-ui-library/pull/3899) by miguelgamis@microsoft.com)
- update minor packages ([PR #4039](https://github.com/azure/communication-ui-library/pull/4039) by 94866715+dmceachernmsft@users.noreply.github.com)
- update to new Calling beta ([PR #4008](https://github.com/azure/communication-ui-library/pull/4008) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update calling dependency ([PR #4055](https://github.com/azure/communication-ui-library/pull/4055) by 96077406+carocao-msft@users.noreply.github.com)
- Upgrade rooms client to versions 1.1.0-beta.1 and 1.1.0 ([PR #3819](https://github.com/azure/communication-ui-library/pull/3819) by 79475487+mgamis-msft@users.noreply.github.com)
- TDBuild - updating localized resource files. ([PR #4025](https://github.com/azure/communication-ui-library/pull/4025) by edwardlee@microsoft.com)
### Bug Fixes
- Stop the ringing sound from playing when the call disconnects before the callee answers ([PR #3889](https://github.com/azure/communication-ui-library/pull/3889) by 94866715+dmceachernmsft@users.noreply.github.com)
- Enable the ability for user to edit value in text field with keyboard ([PR #3970](https://github.com/azure/communication-ui-library/pull/3970) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce new endcall screen for when a outbound call times out ([PR #3914](https://github.com/azure/communication-ui-library/pull/3914) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.11.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.11.0-beta.1)

Mon, 20 Nov 2023 21:42:07 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.10.0...1.11.0-beta.1)

### Features
- Ability to generate theme from single accent color ([PR #3797](https://github.com/azure/communication-ui-library/pull/3797) by 2684369+JamesBurnside@users.noreply.github.com)
### Improvements
- Improve how background and logo are applied in the Call Composites ([PR #3741](https://github.com/azure/communication-ui-library/pull/3741) by 2684369+JamesBurnside@users.noreply.github.com)
- Remove isRoomsCall from CallWithChatAdapterState ([PR #3800](https://github.com/azure/communication-ui-library/pull/3800) by 79475487+mgamis-msft@users.noreply.github.com)
- Update rooms call end pages UI including icons and strings ([PR #3758](https://github.com/azure/communication-ui-library/pull/3758) by 79475487+mgamis-msft@users.noreply.github.com)
- Update the API for onUpdateMessage, moved metadata into options bag ([PR #3760](https://github.com/azure/communication-ui-library/pull/3760) by 9044372+JoshuaLai@users.noreply.github.com)
- Simplify types use in the RemoteParticipantstate by collapsing other identifiers to just CommunicationIdentifierKind ([PR #3761](https://github.com/azure/communication-ui-library/pull/3761) by alkwa@microsoft.com)
- Update Calling dependency to use the latest version 1.18.1 for stable and 1.19.1-beta.2 for beta ([PR #3738](https://github.com/azure/communication-ui-library/pull/3738) and [PR #3732](https://github.com/azure/communication-ui-library/pull/3732) by 94866715+dmceachernmsft@users.noreply.github.com)
### Bug Fixes
- Fix the usage of the cleanup script to remove unnecessary properties in the communication-react package.json ([PR #3702](https://github.com/azure/communication-ui-library/pull/3702) by alkwa@microsoft.com)
- Fix lobby page text using incorrect theme token value. ([PR #3797](https://github.com/azure/communication-ui-library/pull/3797) by 2684369+JamesBurnside@users.noreply.github.com)
- Hide raised hand button for consumer in rooms call ([PR #3723](https://github.com/azure/communication-ui-library/pull/3723) by 79475487+mgamis-msft@users.noreply.github.com)
- Add handlers for Enter and Space keys for message menu button ([PR #3755](https://github.com/azure/communication-ui-library/pull/3755) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fix local video stream rendering when camera is turned on while screensharing is active ([PR #3779](https://github.com/azure/communication-ui-library/pull/3779) by 79475487+mgamis-msft@users.noreply.github.com)
- Add ability to start captions on mobile with keyboard with toggle on toplevel menu item and not secondary component ([PR #3801](https://github.com/azure/communication-ui-library/pull/3801) by 94866715+dmceachernmsft@users.noreply.github.com)
- Render gallery content only when people pane screens on mobile aren't present ([PR #3754](https://github.com/azure/communication-ui-library/pull/3754) by 94866715+dmceachernmsft@users.noreply.github.com)
- Prevent possible endless loop of switching between scrollable and paginated horizontal gallery in VideoGallery ([PR #3730](https://github.com/azure/communication-ui-library/pull/3730) by 79475487+mgamis-msft@users.noreply.github.com)


## [1.10.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.10.0-beta.1)

Mon, 23 Oct 2023 18:27:26 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.9.0...1.10.0-beta.1)

### Features
- Update and stabilize custom button injection ([PR #3642](https://github.com/azure/communication-ui-library/pull/3642) by edwardlee@microsoft.com)
### Improvements
- Update communication calling beta and stable dependency ([PR #3682](https://github.com/azure/communication-ui-library/pull/3682) by carolinecao@microsoft.com)
- Update the ACS common package to new stable version ([PR #3634](https://github.com/azure/communication-ui-library/pull/3634) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update documentation and removed FluentUI NorthStar wrapper package ([PR #3650](https://github.com/azure/communication-ui-library/pull/3650) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update verticalGallery key in localization strings ([PR #3652](https://github.com/azure/communication-ui-library/pull/3652) by 94866715+dmceachernmsft@users.noreply.github.com)
### Bug Fixes
- Update image padding for ImageGallery ([PR #3651](https://github.com/azure/communication-ui-library/pull/3651) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Error message position and font update for edit message component ([PR #3680](https://github.com/azure/communication-ui-library/pull/3680) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Remove FocusTrapZone from ImageGallery ([PR #3569](https://github.com/azure/communication-ui-library/pull/3569) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Fixes up menu size and appearance on mobile ([PR #3654](https://github.com/azure/communication-ui-library/pull/3654) by 3941071+emlynmac@users.noreply.github.com)
- Removed bottom paddings for the edit message buttons ([PR #3683](https://github.com/azure/communication-ui-library/pull/3683) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Fixes intermittant issue where the menu button was not accessible ([PR #3672](https://github.com/azure/communication-ui-library/pull/3672) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Add in fluent prop to not fade in the persona ([PR #3688](https://github.com/azure/communication-ui-library/pull/3688) by alkwa@microsoft.com)
- Call focus to background effects picker on mount ([PR #3681](https://github.com/azure/communication-ui-library/pull/3681) by 94866715+dmceachernmsft@users.noreply.github.com)
- When screen is too small, decrease captions banner size so scroll bar and more button does not overlap ([PR #3653](https://github.com/azure/communication-ui-library/pull/3653) by carolinecao@microsoft.com)
- Update start call in adapter to handle new id types from the ACS Common package ([PR #3674](https://github.com/azure/communication-ui-library/pull/3674) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add onFetchAvatar to captionsBanner component to allow passing in custom avatar icons ([PR #3643](https://github.com/azure/communication-ui-library/pull/3643) by carolinecao@microsoft.com)
- Fixes issue where submenus in the mobile bottom sheet drawer were not focusing on the first item ([PR #3678](https://github.com/azure/communication-ui-library/pull/3678) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix Call with Chat adapter creation hook to handle multiple invocations ([PR #3676](https://github.com/azure/communication-ui-library/pull/3676) by 94866715+dmceachernmsft@users.noreply.github.com)


## [1.9.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.9.0-beta.1)

Wed, 04 Oct 2023 17:17:11 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.8.0...1.9.0-beta.1)

### Image Gallery - Public Preview
The Web UI Chat and CallWithChat composite now supports the Image Gallery feature. This enables users to click on an individual inline image in a message bubble and display the selected image in full screen or download the image. 

We are also introducing a new standalone ImageGallery component to display an image in large scale with the ability to download it

### Gallery Layouts - Public Preview
UI Library now supports new Gallery Layouts in the CallComposite and CallWithChatComposite on web and mobile. Users can select the new layouts from the control bar.

### Features
- Add gallery layout feature 
[PR #3637](https://github.com/azure/communication-ui-library/pull/3637)
[PR #3603](https://github.com/azure/communication-ui-library/pull/3603) 
[PR #3611](https://github.com/azure/communication-ui-library/pull/3611)
[PR #3574](https://github.com/azure/communication-ui-library/pull/3574)
- Add image gallery feature
[PR #3507](https://github.com/Azure/communication-ui-library/pull/3507)

### Improvements
- Add capabilitiesChanged event to CallWithChatAdapter ([PR #3570](https://github.com/azure/communication-ui-library/pull/3570) by 79475487+mgamis-msft@users.noreply.github.com)
- Remove Fluent NorthStar ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 3941071+emlynmac@users.noreply.github.com)
- Treeshake locales from composites ([PR #3615](https://github.com/azure/communication-ui-library/pull/3615) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update localized strings ([PR #3542](https://github.com/azure/communication-ui-library/pull/3542) by 79475487+mgamis-msft@users.noreply.github.com)
- Update `@azure/communication-signaling` version to 1.0.0-beta.20 ([PR #3524](https://github.com/azure/communication-ui-library/pull/3524) by 98852890+vhuseinova-msft@users.noreply.github.com)
- Update `@azure/communication-calling` beta verison to 1.17.1-beta.5 [PR #3552](https://github.com/azure/communication-ui-library/pull/3552)

### Bug Fixes
- Fix show more button only if enabled and has at least one context menu button to show ([PR #3583](https://github.com/azure/communication-ui-library/pull/3583) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix redundant presenter role notification when joining Teams interop call ([PR #3584](https://github.com/azure/communication-ui-library/pull/3584) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix icon size of capability changed notification ([PR #3541](https://github.com/azure/communication-ui-library/pull/3541) by 79475487+mgamis-msft@users.noreply.github.com)
- Update license to License (including lint rule) ([PR #3588](https://github.com/azure/communication-ui-library/pull/3588) by 2684369+JamesBurnside@users.noreply.github.com)
- Apply background color to overflow menu items in the contextual menu and lighten opacity for call readiness prompts ([PR #3639](https://github.com/azure/communication-ui-library/pull/3639) by edwardlee@microsoft.com)
- Fix styles for when the end call button is focused in high contrast scenarios ([PR #3566](https://github.com/azure/communication-ui-library/pull/3566) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update styles of configuration page to match specification ([PR #3621](https://github.com/azure/communication-ui-library/pull/3621) by 94866715+dmceachernmsft@users.noreply.github.com)
- Increase the gap of the floating local video's initial position from the bottom right ([PR #3605](https://github.com/azure/communication-ui-library/pull/3605) by 79475487+mgamis-msft@users.noreply.github.com)
- Fix long display name to truncate after 50 charactrers ([PR #3633](https://github.com/azure/communication-ui-library/pull/3633) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix content focusing when opening the video effects pane in call composite ([PR #3627](https://github.com/azure/communication-ui-library/pull/3627) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce missing composite options to the CallWithChat composite ([PR #3565](https://github.com/azure/communication-ui-library/pull/3565) by 94866715+dmceachernmsft@users.noreply.github.com)
- Increase mention popover's z-index ([PR #3526](https://github.com/azure/communication-ui-library/pull/3526) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Update all versioning to caret ([PR #3559](https://github.com/azure/communication-ui-library/pull/3559) by jiangnanhello@live.com)
- Fix legacy control bar logic to limit number of control bar buttons on mobile ([PR #3561](https://github.com/azure/communication-ui-library/pull/3561) by miguelgamis@microsoft.com)
- Fix default render of participant list item will yield none for presence ([PR #3619](https://github.com/azure/communication-ui-library/pull/3619) by 79329532+alkwa-msft@users.noreply.github.com)
- Enable localized default date/timestamp ([PR #3578](https://github.com/azure/communication-ui-library/pull/3578) by 3941071+emlynmac@users.noreply.github.com)
- Fix scaling mode of participants update when screen sharing is turned off by remote user ([PR #3468](https://github.com/azure/communication-ui-library/pull/3468) by 97124699+prabhjot-msft@users.noreply.github.com)
- Prevent the callout for the gallery layouts from dismissing from a rerender ([PR #3568](https://github.com/azure/communication-ui-library/pull/3568) by 94866715+dmceachernmsft@users.noreply.github.com)
### Other Changes
- Stablize Pinning layouts and rendering options ([PR #3394](https://github.com/azure/communication-ui-library/pull/3394) by 97124699+prabhjot-msft@users.noreply.github.com)


## [1.8.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.8.0-beta.1)



Mon, 28 Aug 2023 22:17:59 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.7.0...1.8.0-beta.1)

### Raise Hand - Public Preview
The Web UI Call and CallWitihChat composite now supports Raise Hand feature. This enables users to raise and lower hand in Teams interop meetings.

### Features
- Add Raise hand feature to the UI Library ([PR #3420](https://github.com/azure/communication-ui-library/pull/3420) by ruslanzdor@microsoft.com)
- Introduce speaker layout and other layout controls to composites ([PR #3458](https://github.com/azure/communication-ui-library/pull/3458) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update captions based on new sdk changes, allow changing caption language ([PR #3385](https://github.com/azure/communication-ui-library/pull/3385) by carolinecao@microsoft.com)
- Introduce Speaker gallery layout to the video gallery component ([PR #3443](https://github.com/azure/communication-ui-library/pull/3443) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce FocusedContent layout for optimizing screenshare for local user ([PR #3473](https://github.com/azure/communication-ui-library/pull/3473) by 94866715+dmceachernmsft@users.noreply.github.com)

### Bug Fixes
- Fix image gallery double click to use default behaviour ([PR #3515](https://github.com/azure/communication-ui-library/pull/3515) by 9044372+JoshuaLai@users.noreply.github.com)
- Fix side pane to refocus the people button when user closes the people pane with keyboard ([PR #3403](https://github.com/azure/communication-ui-library/pull/3403) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix typo on Custom data model page in the CallComposite ([PR #3493](https://github.com/azure/communication-ui-library/pull/3493) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix issue when local participant stops screen share their local stream would disappear but still be showing to others in the call ([PR #3419](https://github.com/azure/communication-ui-library/pull/3419) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix to allow iOS browsers to open the image in a new tab ([PR #3502](https://github.com/azure/communication-ui-library/pull/3502) by 9044372+JoshuaLai@users.noreply.github.com)
- Autofocus on Resume Call button in OnHold screen page ([PR #3480](https://github.com/azure/communication-ui-library/pull/3480) by edwardlee@microsoft.com)
- Add default aria label for video effect items ([PR #3477](https://github.com/azure/communication-ui-library/pull/3477) by edwardlee@microsoft.com)
- Ensure camera and microphone permissions are re-requested when the number of devices goes from 0 to n ([PR #3439](https://github.com/azure/communication-ui-library/pull/3439) by 2684369+JamesBurnside@users.noreply.github.com)
- People button announces seleted state ([PR #3496](https://github.com/azure/communication-ui-library/pull/3496) by carolinecao@microsoft.com)
- Resolve issue where chat keyboard would dismiss randomly during interop meetings ([PR #3421](https://github.com/azure/communication-ui-library/pull/3421) by 73612854+palatter@users.noreply.github.com)
- Fix message type being hard coded in sending state ([PR #3442](https://github.com/azure/communication-ui-library/pull/3442) by 109105353+jpeng-ms@users.noreply.github.com)
- Remove controlBar shadow in landscape mobile view ([PR #3501](https://github.com/azure/communication-ui-library/pull/3501) by edwardlee@microsoft.com)
- Fix participant count when you are alone in a call ([PR #3432](https://github.com/azure/communication-ui-library/pull/3432) by 94866715+dmceachernmsft@users.noreply.github.com)

### Improvements
- Add stream size to remote video stream ([PR #3516](https://github.com/azure/communication-ui-library/pull/3516) by 97124699+prabhjot-msft@users.noreply.github.com)
- Add support for dependency isolation for video background effects (Treeshaking + Lazy loading) ([PR #3352](https://github.com/azure/communication-ui-library/pull/3352) by 97124699+prabhjot-msft@users.noreply.github.com)
- Update captions banner width and height for better readibility ([PR #3412](https://github.com/azure/communication-ui-library/pull/3412) by carolinecao@microsoft.com)
- Make overflow gallery movable by the user ([PR #3411](https://github.com/azure/communication-ui-library/pull/3411) by 94866715+dmceachernmsft@users.noreply.github.com)
- Add type check to stable sample calling app ([PR #3313](https://github.com/azure/communication-ui-library/pull/3313) by jiangnanhello@live.com)
- Add capabilities selector to disable camera, microphone and screenshare buttons when corresponding capability is not present ([PR #3374](https://github.com/azure/communication-ui-library/pull/3374) by 79475487+mgamis-msft@users.noreply.github.com)
- Improve Czech translated strings ([PR #3367](https://github.com/azure/communication-ui-library/pull/3367) by 79475487+mgamis-msft@users.noreply.github.com)
- Deprecate old joinCall API and replace with joinCall API with options bag ([PR #3337](https://github.com/azure/communication-ui-library/pull/3337) by carolinecao@microsoft.com)
- Remove role hint and permissions provider from the CallAdapter state allowing for simpler use of the CallComposite with a rooms call ([PR #3360](https://github.com/azure/communication-ui-library/pull/3360) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update Rooms API for naming clarity in icons ([PR #3388](https://github.com/azure/communication-ui-library/pull/3388) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce total participant counts to participant list and people pane in composites ([PR #2911](https://github.com/azure/communication-ui-library/pull/2911) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update captions banner width and height for better readibility ([PR #3359](https://github.com/azure/communication-ui-library/pull/3359) by carolinecao@microsoft.com)
- Add functionality to open image gallery when user taps on an inline image ([PR #3406](https://github.com/azure/communication-ui-library/pull/3406) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Add CapabilitiesChangedListener to CallAdapter ([PR #3485](https://github.com/azure/communication-ui-library/pull/3485) by 79475487+mgamis-msft@users.noreply.github.com)
- Add missing CallAdapterOptions to createAzureCommunicationCallWithChatAdapterFromClients ([PR #3476](https://github.com/azure/communication-ui-library/pull/3476) by 2684369+JamesBurnside@users.noreply.github.com)
- Update Call and CallWithChat composites to use the same control bar ([PR #3417](https://github.com/azure/communication-ui-library/pull/3417) by 79475487+mgamis-msft@users.noreply.github.com)
- Update stable dependencies to use caret for calling and chat ([PR #3491](https://github.com/azure/communication-ui-library/pull/3491) by alkwa@microsoft.com)
- Fix deviceOrientationEvent not found error in samples in safari ([PR #3453](https://github.com/azure/communication-ui-library/pull/3453) by 2684369+JamesBurnside@users.noreply.github.com)
- Enable keyboard navigation for inlineImage ([PR #3504](https://github.com/azure/communication-ui-library/pull/3504) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Add download image functionality to composite ([PR #3460](https://github.com/azure/communication-ui-library/pull/3460) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
- Update gifs and image for VideoGallery pinning docs ([PR #3391](https://github.com/azure/communication-ui-library/pull/3391) by 79475487+mgamis-msft@users.noreply.github.com)
- Update documentation of CallwithChat Adapter API for clarification ([PR #3446](https://github.com/azure/communication-ui-library/pull/3446) by 109105353+jpeng-ms@users.noreply.github.com)
- Handle 413 error when uploading logs in sample apps ([PR #3448](https://github.com/azure/communication-ui-library/pull/3448) by 2684369+JamesBurnside@users.noreply.github.com)
- Update signaling sdk to 1.0.0-beta19 ([PR #3414](https://github.com/azure/communication-ui-library/pull/3414) by joshlai@microsoft.com)
- Update ChatSDK to 1.3.2 ([PR #3510](https://github.com/azure/communication-ui-library/pull/3510) by 77021369+jimchou-dev@users.noreply.github.com)
- Update ChatSDK version to 1.4.0-beta.1 ([PR #3499](https://github.com/azure/communication-ui-library/pull/3499) by 77021369+jimchou-dev@users.noreply.github.com)

## [1.7.0-beta.2](https://github.com/azure/communication-ui-library/tree/1.7.0-beta.2)

Mon, 24 Jul 2023 17:34:36 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.7.0-beta.1...1.7.0-beta.2)

### Improvements
  - Update SDKs dependencies ([PR #3355](https://github.com/azure/communication-ui-library/pull/3355) by 2684369+JamesBurnside@users.noreply.github.com)
  - Ensure chat client state changes are true changes ([PR #3317](https://github.com/azure/communication-ui-library/pull/3317) by 3941071+emlynmac@users.noreply.github.com)
  - Add selected state aria label to active tab header ([PR #3345](https://github.com/azure/communication-ui-library/pull/3345) by edwardlee@microsoft.com)
  - Allow mention to be added after new line break ([PR #3310](https://github.com/azure/communication-ui-library/pull/3310) by 98852890+vhuseinova-msft@users.noreply.github.com)
  - [FileDownloadCards] cleaning up some unused property ([PR #3347](https://github.com/azure/communication-ui-library/pull/3347) by joshlai@microsoft.com)
  - [TeamsInteropFileMetadata] introducing new type for future scalability ([PR #3156](https://github.com/azure/communication-ui-library/pull/3156) by joshlai@microsoft.com)
  - Added Czech component and composite locales ([PR #3298](https://github.com/azure/communication-ui-library/pull/3298) by miguelgamis@microsoft.com)
  - Add new File Attachment types ([PR #3156](https://github.com/azure/communication-ui-library/pull/3156) by 77021369+jimchou-dev@users.noreply.github.com)
  - Update Captions component for mobile landscape to not obstruct the verticalGallery ([PR #3305](https://github.com/azure/communication-ui-library/pull/3305) by 94866715+dmceachernmsft@users.noreply.github.com)
  - CallComposite to control the local tile aspect ratio based on screen aspect ratio and formfactor ([PR #3309](https://github.com/azure/communication-ui-library/pull/3309) by 94866715+dmceachernmsft@users.noreply.github.com)

### Bug Fixes
  - Fix mention popover content view is not wrapped up in the scroll view when the list is long ([PR #3339](https://github.com/azure/communication-ui-library/pull/3339) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
  - Effects pane header misaligned ([PR #3338](https://github.com/azure/communication-ui-library/pull/3338) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Resolve issue with edit box showing the number zero ([PR #3295](https://github.com/azure/communication-ui-library/pull/3295) by palatter@microsoft.com)
  - Add vertical offset for mention popover ([PR #3301](https://github.com/azure/communication-ui-library/pull/3301) by 98852890+vhuseinova-msft@users.noreply.github.com)
  - Fix for cursor position and mention editing issues in SendBox ([PR #3322](https://github.com/azure/communication-ui-library/pull/3322) by 98852890+vhuseinova-msft@users.noreply.github.com)
  - Ensure popover position is set prior to rendering. ([PR #3330](https://github.com/azure/communication-ui-library/pull/3330) by 3941071+emlynmac@users.noreply.github.com)
  - Fix Mention Popover's position is too low when insert mention in the middle of a very long text ([PR #3348](https://github.com/azure/communication-ui-library/pull/3348) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
  - Fix for the text selection for triple click in TextFieldWithMention ([PR #3336](https://github.com/azure/communication-ui-library/pull/3336) by 98852890+vhuseinova-msft@users.noreply.github.com)
  - Fix for VideoTile context menu being dismissed when new captions come in ([PR #3303](https://github.com/azure/communication-ui-library/pull/3303) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fixed adapter error on mobile querying speakers when speakers are not available ([PR #3331](https://github.com/azure/communication-ui-library/pull/3331) by carolinecao@microsoft.com)
  - Fix the bug when video effect fails, none effect in picker is highlighted ([PR #3334](https://github.com/azure/communication-ui-library/pull/3334) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fix tab ordering in the callscreen for the video effects pane ([PR #3351](https://github.com/azure/communication-ui-library/pull/3351) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Addressed the issue where video not scale properly in message content ([PR #3324](https://github.com/azure/communication-ui-library/pull/3324) by 109105353+jpeng-ms@users.noreply.github.com)
  - Fix conditional comments for Chat sample app ([PR #3314](https://github.com/azure/communication-ui-library/pull/3314) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
  - Fixed bug where captions keep scrolling to the bottom when new captions are received  ([PR #3353](https://github.com/azure/communication-ui-library/pull/3353) by carolinecao@microsoft.com)
  - Fix unread chat messages badge on the CallWithChatComposite being cleared when the call goes on hold ([PR #3332](https://github.com/azure/communication-ui-library/pull/3332) by 2684369+JamesBurnside@users.noreply.github.com)
  - Hoist error tracking to composite level to allow tracking to be shared across components. This fixes an issue where errors would reappear after being dismissed. ([PR #3286](https://github.com/azure/communication-ui-library/pull/3286) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.7.0-beta.1](https://github.com/azure/communication-ui-library/tree/1.7.0-beta.1)

Tue, 27 Jun 2023 22:07:18 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.6.0...1.7.0-beta.1)

### Mention - Public Preview
The Web UI SendBox and MessageThread components now support mentions capabilities in chat message thread. Enables user to @ mention another user by providing a Search capability to look for the desired user and then tagging them on the message.

### File Sharing - Public Preview
The Web UI Chat composite now supports to view and download a file shared by a Teams user.

### Optimal Video Count - Public Preview
The Web UI Calling and CallWithChat composite now supports optimal Video Count. This provides a way to get a value which dictates the maximum number of remote renderers that should be rendered to get a good quality video.

### Ad-hoc Calling - Public Preview
The Web UI Calling composite now supports the ability to call Teams users and call queues through their organization id.

### Call Transfer - Public Preview
The Web UI Calling composite now supports the ability to accept or reject transfer requests through CallAdapter event subscription. The Calling composite will show a transfer page when a transfer request is accepted which is then followed by a seamless transition to the new call.

### New CallComposite configurations to support click to call scenarios - Public Preview
The Web UI Calling composite now supports new options to configure LocalVideoTile positioning. This enables new use case scenarios with the composite like click to call

### Bug Fixes
  - Fix issue of intermittently showing participants when leaving while connecting to call by adding a leaving page ([PR #3108](https://github.com/azure/communication-ui-library/pull/3108) by jiangnanhello@live.com)
  - Introduce new handler for disposing screen share for remote participants, stops flash when navigating overflow galleries ([PR #3202](https://github.com/azure/communication-ui-library/pull/3202) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add margin to participant item to allow the focus border to show when selecting each participant with keyboard ([PR #3178](https://github.com/azure/communication-ui-library/pull/3178) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Extend touchable/clickable area of button to full height of send box ([PR #3185](https://github.com/azure/communication-ui-library/pull/3185) by longamy@microsoft.com)
  - Update micPrimaryActionSplitButtonTitle to microphonePrimaryActionSplitButtonTitle ([PR #3214](https://github.com/azure/communication-ui-library/pull/3214) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update useAzureCommunicationCallAdapter hook to protect against multiple client creations ([PR #3157](https://github.com/azure/communication-ui-library/pull/3157) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update unsubscribe logic for captions ([PR #3203](https://github.com/azure/communication-ui-library/pull/3203) by alkwa@microsoft.com)
  - Update VideoTile resize hook to prevent re-renders on the observer reference ([PR #3223](https://github.com/azure/communication-ui-library/pull/3223) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Show local tile in the overflow gallery when video gallery is in default layout ([PR #3222](https://github.com/azure/communication-ui-library/pull/3222) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update video gallery behavior to show local tile when screen sharing alone in a call ([PR #3222](https://github.com/azure/communication-ui-library/pull/3222) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix scroll and new message prompt in sidepane chat for safari ([PR #3116](https://github.com/azure/communication-ui-library/pull/3116) by edwardlee@microsoft.com)
  - Add new handler to dispose screenshare ([PR #3202](https://github.com/azure/communication-ui-library/pull/3202) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Remove empty space to the right of participant displayName when tile is not being interacted with ([PR #3080](https://github.com/azure/communication-ui-library/pull/3080) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix an issue with a cursor position when multiline parameter is set to true ([PR #3233](https://github.com/azure/communication-ui-library/pull/3233) by 98852890+vhuseinova-msft@users.noreply.github.com)
  - Add missing 'rem' from width of avatar. This caused formatting issues when embedding inside a Teams Toolkit App ([PR #3161](https://github.com/azure/communication-ui-library/pull/3161) by palatter@microsoft.com)
  - Fix bug where static html samples are not showing fluent icons ([PR #3106](https://github.com/azure/communication-ui-library/pull/3106) by carolinecao@microsoft.com)
  - Enable ArrowUp and ArrowDown key inside EditBox ([PR #3177](https://github.com/azure/communication-ui-library/pull/3177) by longamy@microsoft.com)
  - Cursor icon remains as default cursor on inactionable participantItems ([PR #3191](https://github.com/azure/communication-ui-library/pull/3191) by edwardlee@microsoft.com)
  - Fix how common code deals with E.164 numbers ([PR #3176](https://github.com/azure/communication-ui-library/pull/3176) by alkwa@microsoft.com)
  - Add height to FocusTrapZone in SpokenLanguageDrawer ([PR #3082](https://github.com/azure/communication-ui-library/pull/3082) by edwardlee@microsoft.com)
  - Convert long visible display names as ellipsis ([PR #3090](https://github.com/azure/communication-ui-library/pull/3090) by 77021369+jimchou-dev@users.noreply.github.com)
  - Prevent device contextMenu to be dismissed ([PR #3102](https://github.com/azure/communication-ui-library/pull/3102) by jiangnanhello@live.com)
  - Decouple types from SDKs by adding new types for BackgroundBlurConfig and BackgroundReplacementConfig ([PR #3152](https://github.com/azure/communication-ui-library/pull/3152) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fix issue where new controls were not being respected by the overflow galleries ([PR #3172](https://github.com/azure/communication-ui-library/pull/3172) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix speaker icon in contextual menu of microphone and devices button ([PR #3294](https://github.com/Azure/communication-ui-library/pull/3294) by miguelgamis@microsoft.com)
  - Resolve issue with edit box showing the number zero ([PR #3295](https://github.com/Azure/communication-ui-library/pull/3295) by palatter@microsoft.com)

### Improvements
  - `@azure/communication-chat` peer dependency updated to 1.3.2-beta.2 for beta packages ([PR #3115](https://github.com/azure/communication-ui-library/pull/3115) by joshlai@microsoft.com)
  - Bump peer dependencies to react 18 ([PR #3050](https://github.com/azure/communication-ui-library/pull/3050) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add const exports for missing supported locales ([PR #3163](https://github.com/azure/communication-ui-library/pull/3163) by 77021369+jimchou-dev@users.noreply.github.com)
  - `react-aria-live` react 18 support ([PR #3050](https://github.com/azure/communication-ui-library/pull/3050) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update button label, tooltips, and split button menu for control bar ([PR #3254](https://github.com/azure/communication-ui-library/pull/3254) by carolinecao@microsoft.com)
  - Add `Edited` for live message speak out ([PR #3173](https://github.com/azure/communication-ui-library/pull/3173) by longamy@microsoft.com)
  - Update communication-calling to 1.14.1-beta.1 ([PR #3182](https://github.com/azure/communication-ui-library/pull/3182) by alkwa@microsoft.com)
  - Embed the EditBox inside a Chat.Message to enable the accessibility ([PR #3097](https://github.com/azure/communication-ui-library/pull/3097) by longamy@microsoft.com)
  - Expose aria-labelledby prop for participantItems ([PR #3218](https://github.com/azure/communication-ui-library/pull/3218) by edwardlee@microsoft.com)
  - Update version of node to 16.19.0 across all packlets ([PR #3016](https://github.com/azure/communication-ui-library/pull/3016) by 79329532+alkwa-msft@users.noreply.github.com)
  - Update side pane heading styles and correct video effects side pane width in the call screen ([PR #3179](https://github.com/azure/communication-ui-library/pull/3179) by 2684369+JamesBurnside@users.noreply.github.com)
  - Use correct host layer id for PIPIP ([PR #3204](https://github.com/azure/communication-ui-library/pull/3204) by alkwa@microsoft.com)
  - Fix resizeObserver infinite loop error in older versions of react ([PR #3192](https://github.com/azure/communication-ui-library/pull/3192) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Expose aria-labelledby prop for participantItems ([PR #3218](https://github.com/azure/communication-ui-library/pull/3218) by edwardlee@microsoft.com)
  - Add onFetchProfile to CommonCallAdapterOptions ([PR #3148](https://github.com/azure/communication-ui-library/pull/3148) by miguelgamis@microsoft.com)
  - Dismiss video effects error when camera is off ([PR #3137](https://github.com/azure/communication-ui-library/pull/3137) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Update communication-calling stable to 1.14.1 ([PR #3258](https://github.com/azure/communication-ui-library/pull/3258) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Introduce E2E tests for Call Composite local tile options ([PR #3096](https://github.com/azure/communication-ui-library/pull/3096) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update fluentui package ([PR #3279](https://github.com/azure/communication-ui-library/pull/3279) by edwardlee@microsoft.com)
  - Fix start captions console error and add loading screen  ([PR #3021](https://github.com/azure/communication-ui-library/pull/3021) by carolinecao@microsoft.com)
  - Add menu item role for mention popover items and create FocusZone to ensure the first item is focused when using talk back ([PR #3055](https://github.com/azure/communication-ui-library/pull/3055) by palatter@microsoft.com)
  - Filter out remote participants with Disconnected state in participant list selector ([PR #3154](https://github.com/azure/communication-ui-library/pull/3154) by miguelgamis@microsoft.com)
  - Add onFetchProfile to CommonCallAdapterOptions to allow displayName changes when using AzureCommunicationCallAdapter ([PR #3148](https://github.com/azure/communication-ui-library/pull/3148) by miguelgamis@microsoft.com)
  - Add Contoso background ([PR #3216](https://github.com/azure/communication-ui-library/pull/3216) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Improve Accessibility for Files Sharing feature ([PR #3139](https://github.com/azure/communication-ui-library/pull/3139) by longamy@microsoft.com)
  - Update types from internal review ([PR #3159](https://github.com/azure/communication-ui-library/pull/3159) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Merge startScreenShareGeneric and startScreenSharingGeneric strings ([PR #3198](https://github.com/azure/communication-ui-library/pull/3198) by 2684369+JamesBurnside@users.noreply.github.com)
  - Rename nonevideoeffect to novideoeffect ([PR #3104](https://github.com/azure/communication-ui-library/pull/3104) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Add new API for hiding local tile in composite ([PR #3036](https://github.com/azure/communication-ui-library/pull/3036) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add logging for time to enumerate devices in adapter ([PR #3190](https://github.com/azure/communication-ui-library/pull/3190) by alkwa@microsoft.com)
  - Auto-dismiss error bar on selection of new effect ([PR #3160](https://github.com/azure/communication-ui-library/pull/3160) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Add Czech component and composite locales ([PR #3298](https://github.com/Azure/communication-ui-library/pull/3298) by miguelgamis@microsoft.com)

## [1.5.1-beta.5](https://github.com/azure/communication-ui-library/tree/1.5.1-beta.5)

Tue, 23 May 2023 21:43:12 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.5.1-beta.4...1.5.1-beta.5)

### Blurred and Custom Video Backgrounds - Public Preview
The Web UI Calling and CallWithChat composite now supports Blurred and Custom Video Backgrounds in web desktop.

This feature includes:
- Ability to enable the blur/custom background effect before the call
- Choose or change the video background effect during the call
- Ability to use your own hosted images as custom backgrounds

### Features
  - Update stateful client video effects API to use activeEffect naming ([PR #3074](https://github.com/azure/communication-ui-library/pull/3074) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add video effects warning when camera is turned off ([PR #2980](https://github.com/azure/communication-ui-library/pull/2980) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update configuration page side pane styles and close on starting a call ([PR #3028](https://github.com/azure/communication-ui-library/pull/3028) by 2684369+JamesBurnside@users.noreply.github.com)
  - Filter the errors based on whether the side pane is currently showing the video effects side pane ([PR #3020](https://github.com/azure/communication-ui-library/pull/3020) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Show Video Effects errors in side pane ([PR #2995](https://github.com/azure/communication-ui-library/pull/2995) by 97124699+prabhjot-msft@users.noreply.github.com)

### Bug Fixes
  - Fix bug where captions rtl languages are not right aligned  ([PR #2999](https://github.com/azure/communication-ui-library/pull/2999) by carolinecao@microsoft.com)
  - Fix disabled chat and hold buttons when the call is on hold ([PR #3029](https://github.com/azure/communication-ui-library/pull/3029) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix bug where captions is subscribed to on ACS call ([PR #2974](https://github.com/azure/communication-ui-library/pull/2974) by carolinecao@microsoft.com)
  - Remove side pane control button container if no controls are present to be used ([PR #2969](https://github.com/azure/communication-ui-library/pull/2969) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Hide Camera, Microphone, and Screenshare buttons in rooms calls depending on role ([PR #2944](https://github.com/azure/communication-ui-library/pull/2944) by 79475487+mgamis-msft@users.noreply.github.com)
  - Default roleHint for AzureCommuncationCallAdapter is 'Consumer' if the locator is for a rooms call ([PR #2942](https://github.com/azure/communication-ui-library/pull/2942) by 79475487+mgamis-msft@users.noreply.github.com)
  - Resolve overlap of tooltip and list of devices on mobile configuration page ([PR #3013](https://github.com/azure/communication-ui-library/pull/3013) by edwardlee@microsoft.com)
  - Fix send button styling in InputBoxComponent ([PR #3022](https://github.com/azure/communication-ui-library/pull/3022) by longamy@microsoft.com)
  - Fix horizontal gallery button icon directions in rtl mode ([PR #3008](https://github.com/azure/communication-ui-library/pull/3008) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix bug where error bar overlays with pane ([PR #3024](https://github.com/azure/communication-ui-library/pull/3024) by carolinecao@microsoft.com)
  - Fix erroneous spacing in the call composite ([PR #2978](https://github.com/azure/communication-ui-library/pull/2978) by 2684369+JamesBurnside@users.noreply.github.com)

### Improvements
  - Filter messageReceived notification by threadId in ChatAdapter ([PR #3056](https://github.com/azure/communication-ui-library/pull/3056) by longamy@microsoft.com)
  - Update communication-calling to 1.13.2-beta.1 ([PR #3071](https://github.com/azure/communication-ui-library/pull/3071) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update localization strings for video effects ([PR #3019](https://github.com/azure/communication-ui-library/pull/3019) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update the logic when one is talking over another ([PR #2985](https://github.com/azure/communication-ui-library/pull/2985) by jiangnanhello@live.com)
  - Creating call with chat adapter from state now take an options bag ([PR #2998](https://github.com/azure/communication-ui-library/pull/2998) by joshlai@microsoft.com)
  - Stabilize the scrolling behavior ([PR #2959](https://github.com/azure/communication-ui-library/pull/2959) by jiangnanhello@live.com)


## [1.5.1-beta.4](https://github.com/azure/communication-ui-library/tree/1.5.1-beta.4)

Fri, 28 Apr 2023 23:16:11 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.5.1-beta.3...1.5.1-beta.4)

### Bug fixes
  - Revert a breaking change for createAzureCommunicationCallWithChatAdapterFromClients

## [1.5.1-beta.3](https://github.com/azure/communication-ui-library/tree/1.5.1-beta.3)

Mon, 24 Apr 2023 15:39:35 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.5.1-beta.2...1.5.1-beta.3)

### Closed Captions - Public Preview
The Web UI Calling and CallWithChat composite now supports Closed Captions in Teams Interop and Teams CTE scenarios.

This feature includes:
- Ability to enable, and show/hide closed captions in a call 
- Choose or change the captions spoken language
- Ability to scroll through past 50 dialogues after captions has been enabled 


### Inline Images - Public Preview
The Web UI Chat Composite now supports teams interop images. An image from teams will be retrieved automatically by our composite. 

This feature includes:
- Message bubble can now provide the ability to download an image protected by header-based authentication
- Developers can write there own HTTP call to get the image so you can provide the applicable headers

### Features
  - Add new message type BlockedMessage ([PR #2821](https://github.com/azure/communication-ui-library/pull/2821) by 77021369+jimchou-dev@users.noreply.github.com)
  - Implement inline image attachment for chat UI component ([PR #2894](https://github.com/azure/communication-ui-library/pull/2894) by 77021369+jimchou-dev@users.noreply.github.com)
  - Enable Teams adhoc call for startCall handler ([PR #2914](https://github.com/azure/communication-ui-library/pull/2914) by 79475487+mgamis-msft@users.noreply.github.com)
  - Captions feature changes ([PR #2846](https://github.com/azure/communication-ui-library/pull/2846)) ([PR #2960](https://github.com/azure/communication-ui-library/pull/2960) by carolinecao@microsoft.com)


### Bug fixes
  - Edit message error handling UI in ChatThread component ([PR #2891](https://github.com/azure/communication-ui-library/pull/2891) by 3941071+emlynmac@users.noreply.github.com)
  - Fix High Contrast issues with the screenshare button and end call button ([PR #2956](https://github.com/azure/communication-ui-library/pull/2956) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update forced colours on configuration screen to allow better high contrast experience for user ([PR #2955](https://github.com/azure/communication-ui-library/pull/2955) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update error message for unsupported chat thread types ([PR #2907](https://github.com/azure/communication-ui-library/pull/2907) by 77021369+jimchou-dev@users.noreply.github.com)
  - Set min height to control bar to fix issue where control bar contrainer would collapse when side pane buttons are disabled in Composites ([PR #2963](https://github.com/azure/communication-ui-library/pull/2963) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Center more button in video tile ([PR #2902](https://github.com/azure/communication-ui-library/pull/2902) by edwardlee@microsoft.com)
  - Center call control buttons with regard to viewport width ([PR #2847](https://github.com/azure/communication-ui-library/pull/2847) by carolinecao@microsoft.com)
  - Fix bug when panel is open, error bar is overlayed on top ([PR #2848](https://github.com/azure/communication-ui-library/pull/2848) by carolinecao@microsoft.com)
  - Fix side pane overlapping with composite when window is narrow ([PR #2864](https://github.com/azure/communication-ui-library/pull/2864) by 79475487+mgamis-msft@users.noreply.github.com)
  - Prevent overflow of call composite in call with chat composite when side pane is open ([PR #2861](https://github.com/azure/communication-ui-library/pull/2861) by 79475487+mgamis-msft@users.noreply.github.com)
  - Replace Coffee Icon with Spinner ([PR #2885](https://github.com/azure/communication-ui-library/pull/2885) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fix hold button behavior to dismiss drawer after call is placed on hold ([PR #2904](https://github.com/azure/communication-ui-library/pull/2904) by 94866715+dmceachernmsft@users.noreply.github.com)
  

### Improvements
  - Update `@fluentui/react-file-type-icons` to v8.8.13 ([PR #2934](https://github.com/azure/communication-ui-library/pull/2934) by 2684369+JamesBurnside@users.noreply.github.com)
  - Use common control bar for Call and CallWithChat ([PR #2856](https://github.com/azure/communication-ui-library/pull/2856) by jiangnanhello@live.com)

## [1.5.1-beta.2](https://github.com/azure/communication-ui-library/tree/1.5.1-beta.2)

Tue, 28 Mar 2023 16:00:31 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.5.1-beta.1...1.5.1-beta.2)

### Vertical Gallery - Public Preview
We are now introducing a new overflow gallery for remote particants VideoGallery component as well as other improvements!

This feature includes:
- The ability to position the overflow gallery on the right, this allows better utilisation of the vertical space in your calling experience.
- VideoGallery is now responsive in the composites, switching between the vertical gallery and horizontal gallery.
- Improvements to space utilized by the video tiles of the horizontal overflow gallery.
- Remote participants are now ordered in the overflow gallery based on participation.

### Features

- `@azure/communication-react`
  - Introduce new base component for VerticalGalleries feature ([PR #2764](https://github.com/azure/communication-ui-library/pull/2764) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update vertical gallery styles to be responsive to the container height of the video gallery ([PR #2803](https://github.com/azure/communication-ui-library/pull/2803) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add overflowGalleryLayout prop to VideoGallery to control component for overflow participants ([PR #2774](https://github.com/azure/communication-ui-library/pull/2774) by 79475487+mgamis-msft@users.noreply.github.com)
  - Allow horizontal gallery tiles to resize to allow for better use of space ([PR #2830](https://github.com/azure/communication-ui-library/pull/2830) by 94866715+dmceachernmsft@users.noreply.github.com)
  - VideoGallery in call composite will use a vertical overflow gallery when its aspect ratio is 16:9 or greater ([PR #2786](https://github.com/azure/communication-ui-library/pull/2786) by 79475487+mgamis-msft@users.noreply.github.com)
  - Update overflow gallery logic to allow more video participants to render video streams if available on different pages ([PR #2818](https://github.com/azure/communication-ui-library/pull/2818) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Create styles for verticalGallery controls and position ([PR #2781](https://github.com/azure/communication-ui-library/pull/2781) by 94866715+dmceachernmsft@users.noreply.github.com)

### Bug fixes

- `@azure/communication-react`
  - Disable the selectivity of text in video gallery for long touch to function properly ([PR #2790](https://github.com/azure/communication-ui-library/pull/2790) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Thematically change hold icon color ([PR #2706](https://github.com/azure/communication-ui-library/pull/2706) by edwardlee@microsoft.com)
  - Add error string for when your remote video feed is frozen for others in the call ([PR #2808](https://github.com/azure/communication-ui-library/pull/2808) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update aria labels for people button to allow for voice access controls on Windows ([PR #2833](https://github.com/azure/communication-ui-library/pull/2833) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update communication-chat version from fixed version to compatible with version ([PR #2727](https://github.com/azure/communication-ui-library/pull/2727) by edwardlee@microsoft.com)
  - Switch video seamlessly from different devices ([PR #2726](https://github.com/azure/communication-ui-library/pull/2726) by jinan@microsoft.com)
  - Fix VideoTile to show menu button on hover when isSpeaking prop is true ([PR #2721](https://github.com/azure/communication-ui-library/pull/2721) by 79475487+mgamis-msft@users.noreply.github.com)
  - Fix sending/delivered/failed message status not showing in large group ([PR #2707](https://github.com/azure/communication-ui-library/pull/2707) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
  - Announce by Screen Reader after leaving chat ([PR #2681](https://github.com/azure/communication-ui-library/pull/2681) by 107075081+Leah-Xia-Microsoft@users.noreply.github.com)
  - Add empty icon render for tab navigation of video tile ([PR #2693](https://github.com/azure/communication-ui-library/pull/2693) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Split buttons now hold primary action for toggling camera and mic on touch devices ([PR #2773](https://github.com/azure/communication-ui-library/pull/2773) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix CallAdapter participants joined and left events to show correct participants in event array ([PR #2837](https://github.com/azure/communication-ui-library/pull/2837) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Correct MessageThread API definition ([PR #2812](https://github.com/azure/communication-ui-library/pull/2812) by 3941071+emlynmac@users.noreply.github.com)
  - Fix dominant speaker ordering to best keep dominant speakers on the first page of overflow gallery ([PR #2819](https://github.com/azure/communication-ui-library/pull/2819) by miguelgamis@microsoft.com)
  - Remote video tile should not default to having contextual menu options ([PR #2653](https://github.com/azure/communication-ui-library/pull/2653) by 79475487+mgamis-msft@users.noreply.github.com)
  - Fix permission error in Chat after leaving a Teams Interop meeting ([PR #2777](https://github.com/azure/communication-ui-library/pull/2777) by 2684369+JamesBurnside@users.noreply.github.com)
  - Update the Errorbar selector to check environmentInfo for mac specific warnings ([PR #2691](https://github.com/azure/communication-ui-library/pull/2691) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix message thread loading issue when an adapter is updated ([PR #2784](https://github.com/azure/communication-ui-library/pull/2784) by 98852890+vhuseinova-msft@users.noreply.github.com)
  - Add heading role and aria level for start a call config heading ([PR #2845](https://github.com/azure/communication-ui-library/pull/2845) by edwardlee@microsoft.com)
  - Update PSTN and 1:N callstate logic to not show config screen in composites when starting call ([PR #2740](https://github.com/azure/communication-ui-library/pull/2740) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix CallWithChat overflow buttons onClick not working, styles not being fully applied and and showLabel: false not hiding the button label ([PR #2750](https://github.com/azure/communication-ui-library/pull/2750) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix PSTN id parsing and add unit test to validate E.164 format numbers ([PR #2739](https://github.com/azure/communication-ui-library/pull/2739) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Prevent overflow of VideoGallery when scrollable horizontal gallery is present and side pane is open ([PR #2850](https://github.com/Azure/communication-ui-library/pull/2850)by 79475487+mgamis-msft@users.noreply.github.com)
  - Prevent overlap of side pane in Call and CallWithChat composites when window is narrow ([PR #2864](https://github.com/Azure/communication-ui-library/pull/2864)by 79475487+mgamis-msft@users.noreply.github.com)

### Improvements

- `@azure/communication-react`
  - Add parameter to hint displayName from SDK ([PR #2697](https://github.com/azure/communication-ui-library/pull/2697) by jinan@microsoft.com)
  - Initial Call adapter API changes for start/stop video effects ([PR #2836](https://github.com/azure/communication-ui-library/pull/2836) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Add stateful handlers for background effects ([PR #2793](https://github.com/azure/communication-ui-library/pull/2793) by 2684369+JamesBurnside@users.noreply.github.com)
  - In the stateful call client subscribe to video effects changes and populate state when those subscriptions fire ([PR #2728](https://github.com/azure/communication-ui-library/pull/2728) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add video background effect choice items for upcoming background picker ([PR #2789](https://github.com/azure/communication-ui-library/pull/2789) by 2684369+JamesBurnside@users.noreply.github.com)
  - Tee video effects errors to state ([PR #2729](https://github.com/azure/communication-ui-library/pull/2729) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add type definitions to the new StatefulCallClient state fields for the incoming VideoEffectsFeature including type definitions with implementation to follow ([PR #2702](https://github.com/azure/communication-ui-library/pull/2702) by 2684369+JamesBurnside@users.noreply.github.com)
  - Expose unparentedLocalVideoStreams in the StatefulDeviceManager ([PR #2731](https://github.com/azure/communication-ui-library/pull/2731) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add support for More button in desktop callwithchat ([PR #2748](https://github.com/azure/communication-ui-library/pull/2748) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add Video background effects picker component ([PR #2792](https://github.com/azure/communication-ui-library/pull/2792) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add announcer labels for nav buttons in vertical gallery and allow for style updates through props ([PR #2796](https://github.com/azure/communication-ui-library/pull/2796) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Video Effects Button and Pane ([PR #2825](https://github.com/azure/communication-ui-library/pull/2825) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Update LocalVideo tile to be 9:16 aspect ratio to show whole feed and fix CallWithChat flashing issue with scrollable gallery ([PR #2734](https://github.com/azure/communication-ui-library/pull/2734) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add onFetchProfile to Teams call adapter ([PR #2680](https://github.com/azure/communication-ui-library/pull/2680) by jiangnanhello@live.com)
  - Set all empty/undefined displayName to unnamed ([PR #2720](https://github.com/azure/communication-ui-library/pull/2720) by jinan@microsoft.com)
  - Fix richtext css for blockquote and table ([PR #2839](https://github.com/azure/communication-ui-library/pull/2839) by 77021369+jimchou-dev@users.noreply.github.com)
  - Add stream type in stream logs ([PR #2705](https://github.com/azure/communication-ui-library/pull/2705) by carolinecao@microsoft.com)
  - Update @fluentui/react-icons to 2.0.194 ([PR #2749](https://github.com/azure/communication-ui-library/pull/2749) by 2684369+JamesBurnside@users.noreply.github.com)

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
- Disable pin menu button on remote VideoTile of VideoGallery when max pinned remote video tiles is reached ([PR #2610](https://github.com/Azure/communication-ui-library/pull/2610) by miguelgamis@microsoft.com)
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
- Remove padding and margins from base dialpad component ([PR #2474](https://github.com/azure/communication-ui-library/pull/2474) by 94866715+dmceachernmsft@users.noreply.github.com)
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
- Filter out camera devices with blank name when declarative device manager is used ([PR #2456](https://github.com/azure/communication-ui-library/pull/2456) by anjulgarg@live.com)
- Remove DeclarativeCallAgent from stable API and export only in beta build ([PR #2436](https://github.com/azure/communication-ui-library/pull/2436) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix issue where typingIndicator errors were not being caught by the ChatAdapter ([PR #2471](https://github.com/azure/communication-ui-library/pull/2471) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix a string name and restrict it to beta builds ([PR #2439](https://github.com/azure/communication-ui-library/pull/2439) [PR #2469](https://github.com/azure/communication-ui-library/pull/2469) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix remove participant logic for teams user by making sure to enforce isRemovable property on participantList participant ([PR #2454](https://github.com/azure/communication-ui-library/pull/2454) by 94866715+dmceachernmsft@users.noreply.github.com)
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
- CallComposite will not request for camera permissions when the role prop is Consumer during a Rooms call ([PR #2218](https://github.com/azure/communication-ui-library/pull/2218) by miguelgamis@microsoft.com)
- VideoGallery displays participants connection states such as Connecting, Hold etc. during PSTN and 1:N Calls ([PR #2210](https://github.com/azure/communication-ui-library/pull/2210) by anjulgarg@live.com)
- Custom composite end call screens when room call join fails when room does not exist or user is not invited to room ([PR #2287](https://github.com/azure/communication-ui-library/pull/2287) by miguelgamis@microsoft.com)
- Add role permission behavior to PeopleButton ([PR #2211](https://github.com/azure/communication-ui-library/pull/2211) by miguelgamis@microsoft.com)
- People pane context menu to remove participant will be present only if role has permissions ([PR #2328](https://github.com/azure/communication-ui-library/pull/2328) by miguelgamis@microsoft.com)
- Created dropdown in people pane to open dialpad modal ([PR #2076](https://github.com/azure/communication-ui-library/pull/2076) by carolinecao@microsoft.com)
- Use dialpad to send DTMF tones during a 1:1 PSTN Call ([PR #2196](https://github.com/azure/communication-ui-library/pull/2196) by carolinecao@microsoft.com)
- Introduce hold button to CallWithChat composite ([PR #2213](https://github.com/azure/communication-ui-library/pull/2213) by 94866715+dmceachernmsft@users.noreply.github.com)
- Hiding ScreenShareButton, MicrophoneButton, CameraButton, and DevicesButton in CallControls based on rooms role permissions ([PR #2303](https://github.com/azure/communication-ui-library/pull/2303) by miguelgamis@microsoft.com)
- Introduced a Hold screen to the Calling composite to reflect when the user is on hold in a call ([PR #2202](https://github.com/azure/communication-ui-library/pull/2202) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce the alternateCallerId prop to the createAzureCommunicationCallAdapter function for setting up PSTN Calling ([PR #2095](https://github.com/azure/communication-ui-library/pull/2095) by 94866715+dmceachernmsft@users.noreply.github.com)
- Calling and CallWithChat control bars disable buttons when on hold screen ([PR #2215](https://github.com/azure/communication-ui-library/pull/2215) by 94866715+dmceachernmsft@users.noreply.github.com)
- New PeoplePaneContent in Call Composite matching the one used by CallWithChat Composite ([PR #2109](https://github.com/azure/communication-ui-library/pull/2109) by edwardlee@microsoft.com)
- Show 'You Left the Call' screen when you remove the last PSTN user. Show 'You were removed' screen when a PSTN user hangs up the call ([PR #2295](https://github.com/azure/communication-ui-library/pull/2295) by anjulgarg@live.com)
- Add remove participant menu item for participant item if role allows in a rooms call ([PR #2328](https://github.com/azure/communication-ui-library/pull/2328) by miguelgamis@microsoft.com)
- VideoTile can display a participants state such as Connecting, Ringing etc ([PR #2210](https://github.com/azure/communication-ui-library/pull/2210) by anjulgarg@live.com)
- Update Video Gallery to display participants in a 'Connecting' or 'Ringing' state for PSTN and 1:N calling ([PR #2163](https://github.com/azure/communication-ui-library/pull/2163) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce UI for call isntances where the browser is unsupported ([PR #2334](https://github.com/azure/communication-ui-library/pull/2334) by 94866715+dmceachernmsft@users.noreply.github.com)
- Error bar displays troubleshooting links for network/device permission errors ([PR #2345](https://github.com/azure/communication-ui-library/pull/2345) by carolinecao@microsoft.com)

### Bug Fixes
- Fix custom participant menu items not showing in CallComposite([PR #2154](https://github.com/azure/communication-ui-library/pull/2154) by prprabhu@microsoft.com)
- Fix scrollbar showing incorrectly in landscape mobile view due to absolutely positioned participant pane in Chat Composite ([PR #2038](https://github.com/azure/communication-ui-library/pull/2038) by anjulgarg@live.com)
- Fix Participants and ScreenShare buttons being disabled when unrelated options are passed into the call composite ([PR #2181](https://github.com/azure/communication-ui-library/pull/2181) by 2684369+JamesBurnside@users.noreply.github.com)
- Fixes issue where you can start a call if you unplug it on the configuration screen ([PR #2061](https://github.com/azure/communication-ui-library/pull/2061) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix custom menu items being triggered as a flyout and as a drawer menu item on mobile. Fix custom menu items not triggering on callwithchat composite at all ([PR #2239](https://github.com/azure/communication-ui-library/pull/2239) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix React hook order console errors for LocalDeviceSettings ([PR #2198](https://github.com/azure/communication-ui-library/pull/2198) by miguelgamis@microsoft.com)
- Message thread background color in composites matches composite background color ([PR #2126](https://github.com/azure/communication-ui-library/pull/2126) by anjulgarg@live.com)
- Fix bug where drawer on mobile does not get dismissed after making a selection ([PR #2115](https://github.com/azure/communication-ui-library/pull/2115) by carolinecao@microsoft.com)
- Fix running render passes on people pane on every render ([PR #2240](https://github.com/azure/communication-ui-library/pull/2240) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix Calling Composite's control bar buttons incorrectly showing as disabled when the control bar button is set to `true` in the control bar options ([PR #2325](https://github.com/azure/communication-ui-library/pull/2325) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix input order bug on calling dialpad and dtmf dialpad ([PR #2284](https://github.com/azure/communication-ui-library/pull/2284) by carolinecao@microsoft.com)
- Fix local device settings dropdowns to be disabled until device permissions are granted ([PR #2351](https://github.com/azure/communication-ui-library/pull/2351) by miguelgamis@microsoft.com)
- Autofocus on back button when initially opening People and Chat pane ([PR #2045](https://github.com/azure/communication-ui-library/pull/2045) by edwardlee@microsoft.com)
- Fix joinCall set correct mute state based on microphoneOn parameter ([PR #2131](https://github.com/azure/communication-ui-library/pull/2131) by fanjin1989@gmail.com)
- Add Announcer to copy invite link button to announce action on button ([PR #2289](https://github.com/azure/communication-ui-library/pull/2289) by 94866715+dmceachernmsft@users.noreply.github.com)
- Fix disabled start call button when role is Consumer ([PR #2251](https://github.com/azure/communication-ui-library/pull/2251) by miguelgamis@microsoft.com)
- Fix bug where voice over does not annouce menu item selected in both calling and callwithchat ([PR #2060](https://github.com/azure/communication-ui-library/pull/2060) by carolinecao@microsoft.com)
- Fix infinite spinner during screenShare ([PR #2191](https://github.com/azure/communication-ui-library/pull/2191) by jinan@microsoft.com)
- Fix invalid scrollbars when gif images are shared in chat ([PR #2037](https://github.com/azure/communication-ui-library/pull/2037) by anjulgarg@live.com)
- Fix bug of dismissed menu when scrolling ([PR #2069](https://github.com/azure/communication-ui-library/pull/2069) by jinan@microsoft.com)
- Fix voiceover tab navigation of messages including system messages. Hide message action flyout when focus blurs ([PR #2042](https://github.com/azure/communication-ui-library/pull/2042) by miguelgamis@microsoft.com)
- Fix screenshare button selector to disable button when call is InLobby or Connecting state ([PR #2059](https://github.com/azure/communication-ui-library/pull/2059) by 94866715+dmceachernmsft@users.noreply.github.com)

### Improvements
- Fix onCallEnded event to trigger before the composite page transition ([PR #2201](https://github.com/azure/communication-ui-library/pull/2201) by 2684369+JamesBurnside@users.noreply.github.com)
- Introduces fade in/out animations to is speaking while muted indicator ([PR #2312](https://github.com/azure/communication-ui-library/pull/2312) by 94866715+dmceachernmsft@users.noreply.github.com)
- Composites now using theme.semanticColors.bodyBackground as background color ([PR #2117](https://github.com/azure/communication-ui-library/pull/2117) by anjulgarg@live.com)
- Replace floating div with border with inset border of video tile to show user is speaking ([PR #2236](https://github.com/azure/communication-ui-library/pull/2236) by miguelgamis@microsoft.com)
- Chat message bubble shows border in high contrast modes making each message distinguishable ([PR #2106](https://github.com/azure/communication-ui-library/pull/2106) by anjulgarg@live.com)
- Load new messages only when scroll bar is at the top ([PR #2355](https://github.com/azure/communication-ui-library/pull/2355) by edwardlee@microsoft.com)
- Fix React hook order console errors for CameraButton ([PR #2198](https://github.com/azure/communication-ui-library/pull/2198) by miguelgamis@microsoft.com)
- Changed z-index so new message button shows ontop of chat bubble ([PR #2046](https://github.com/azure/communication-ui-library/pull/2046) by carolinecao@microsoft.com)
- Make participant items tab navigable ([PR #2045](https://github.com/azure/communication-ui-library/pull/2045) by edwardlee@microsoft.com)
- Control Bar uses theme.semanticColors.bodyBackground instead of theme.palette.white ([PR #2117](https://github.com/azure/communication-ui-library/pull/2117) by anjulgarg@live.com)
- Updated tooltip strings to not be title case ([PR #2350](https://github.com/azure/communication-ui-library/pull/2350) by miguelgamis@microsoft.com)
- Show datetime when there are more than 5 mins between each message ([PR #2299](https://github.com/azure/communication-ui-library/pull/2299) by carolinecao@microsoft.com)
- Update Fluent-ui/icons package ([PR #2305](https://github.com/azure/communication-ui-library/pull/2305) by 94866715+dmceachernmsft@users.noreply.github.com)
- Update startCall and removeParticipant adapter methods to use CommunicationIdentifier as userId ([PR #2377](https://github.com/azure/communication-ui-library/pull/2377) by anjulgarg@live.com)
- Use addparticipant handler to call a PSTN user ([PR #2168](https://github.com/azure/communication-ui-library/pull/2168) by carolinecao@microsoft.com)
- Update startCall usage by call adapter to pass in audio and video options from configuration screen ([PR #2317](https://github.com/azure/communication-ui-library/pull/2317) by 94866715+dmceachernmsft@users.noreply.github.com)
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
  - Fix bug: When a developer uses the onFetchPersonaAvatarData prop for the CallWIthChat Composite to override the name of the participants, the display name in the chat thread on messages sent will not be overridden ([PR #2013](https://github.com/azure/communication-ui-library/pull/2013) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix 'No Microphones Found' message persisting when new microphones have been reconnected ([PR #2000](https://github.com/azure/communication-ui-library/pull/2000) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix loading spinner size in small containers ([PR #1995](https://github.com/azure/communication-ui-library/pull/1995) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add aria labels and announcer to file sharing components to make file sharing meet accessibility standards ([PR #1960](https://github.com/azure/communication-ui-library/pull/1960) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Update Participant pane to be an overlay on top of message thread so it can be tapped into when opened ([PR #1943](https://github.com/azure/communication-ui-library/pull/1943) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fix bug where the "New Message" button was getting hidden under messages ([PR #2046](https://github.com/Azure/communication-ui-library/pull/2046) by carolinecao@microsoft.com)
  - Fix bug where Chat participant pane in chat composite mobile view causing overflow ([PR #2038](https://github.com/Azure/communication-ui-library/pull/2038) by anjulgarg@live.com)
  - Fix bug where Chat message thread size is wrong and shows scrollbar when a gif image is shared ([PR #2037](https://github.com/Azure/communication-ui-library/pull/2037) by anjulgarg@live.com)


### Improvements

  - Update variable name dismissSidePaneButton to dismissSidePaneButtonLabel, make some localization string variable optional ([PR #2009](https://github.com/azure/communication-ui-library/pull/2009) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add 0.3rem padding to the top of the fluent message bar to create even spacing in the errorbar component between the text and the edges of the bar and add registered icon for dissmissal button ([PR #2003](https://github.com/azure/communication-ui-library/pull/2003) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add aria-live: "assertive" for announcing lobby, network failure and call end notices so screen reader users can be aware of call status change immediately([PR #2007](https://github.com/azure/communication-ui-library/pull/2007) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Add best practice around only allowing one instance of the sample to be open at a time on mobile ([PR #1981](https://github.com/azure/communication-ui-library/pull/1981) by 2684369+JamesBurnside@users.noreply.github.com)
  - Memoizes the return from the participant list selector for better optimization ([PR #1980](https://github.com/azure/communication-ui-library/pull/1980) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update fluentui/react version ([PR #1979](https://github.com/azure/communication-ui-library/pull/1979) by carolinecao@microsoft.com)
  - Update startCall handler in the Calling and CallWithChat Adapters to support the StartCallOptions parameter needed to start a PSTN Call ([PR #1976](https://github.com/azure/communication-ui-library/pull/1976) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add a new attribute `incomingCalls` to CallAgentDeclarative that returns all active incoming calls ([PR #1975](https://github.com/azure/communication-ui-library/pull/1975) by anjulgarg@live.com)


## [1.2.2-beta.1](https://github.com/azure/communication-ui-library/tree/@azure/communication-react_v1.2.2-beta.1)

Tue, 19 Apr 2022 20:46:13 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.2.0...1.2.2-beta.1)

### Features

  - Show Error Bar to user when joining a call fails ([PR #1788](https://github.com/azure/communication-ui-library/pull/1788) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add local and remote picture-in-picture component in Chat pane of CallWithChat composite in mobile view ([PR #1617](https://github.com/azure/communication-ui-library/pull/1617) by miguelgamis@microsoft.com)
  - Add error bar to show file download error message in the message thread ([PR #1625](https://github.com/azure/communication-ui-library/pull/1625) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Add resend button to contextual menu ([PR #1676](https://github.com/azure/communication-ui-library/pull/1676) by carolinecao@microsoft.com)
  - Add filesharing to callwithchat composite ([PR #1667](https://github.com/azure/communication-ui-library/pull/1667) by anjulgarg@live.com)
  - Add telemetry for rendering problems ([PR #1752](https://github.com/azure/communication-ui-library/pull/1752) by jiangnanhello@live.com)

### Bug Fixes

  - Hide People menu item in MoreDrawer when set in CallControl options ([PR #1695](https://github.com/azure/communication-ui-library/pull/1695) by edwardlee@microsoft.com)
  - Fix race condition of "not in chat" ([PR #1652](https://github.com/azure/communication-ui-library/pull/1652) by jiangnanhello@live.com)
  - Fix styles so that the PIPIP shows over the content in the people and chat panes on mobile ([PR #1674](https://github.com/azure/communication-ui-library/pull/1674) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix PiPiP bounds such that it does not go off screen ([PR #1748](https://github.com/azure/communication-ui-library/pull/1748) by miguelgamis@microsoft.com)
  - Fix Picture-In-Picture component in mobile composites going outside the screen when the mobile device is rotated from portrait to landscape ([PR #1802](https://github.com/azure/communication-ui-library/pull/1802) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix styles to remove undesired scroll bar in context menus on messages ([PR #1675](https://github.com/azure/communication-ui-library/pull/1675) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Memoize chat bubble to avoid unnecessary re-render ([PR #1698](https://github.com/azure/communication-ui-library/pull/1698) by jiangnanhello@live.com)
  - Fix A11y bug where user cannot keyboard outside of local video preview ([PR #1623](https://github.com/azure/communication-ui-library/pull/1623) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix styles for local camera switcher for better visibility on white backdrops ([PR #1767](https://github.com/azure/communication-ui-library/pull/1767) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix chevron alignment issues on message read receipt flyout ([PR #1701](https://github.com/azure/communication-ui-library/pull/1701) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix floating local video tile going offscreen in the VideoGallery Component ([PR #1725](https://github.com/azure/communication-ui-library/pull/1725) by 2684369+JamesBurnside@users.noreply.github.com)
  - Fix bug when deleting failed to send messages ([PR #1780](https://github.com/azure/communication-ui-library/pull/1780) by carolinecao@microsoft.com)
  - Fix for file upload button's inconsistent behavior ([PR #1673](https://github.com/azure/communication-ui-library/pull/1673) by anjulgarg@live.com)
  - Fix for delay in removing file card after a message is sent ([PR #1645](https://github.com/azure/communication-ui-library/pull/1645) by anjulgarg@live.com)
  - Fix for inconsistent fileupload sendbox errors ([PR #1673](https://github.com/azure/communication-ui-library/pull/1673) by anjulgarg@live.com)

### Improvements

  - Reduce min-width and min-height of the composites to support a galaxy fold portrait screen ([PR #1769](https://github.com/azure/communication-ui-library/pull/1769) by 2684369+JamesBurnside@users.noreply.github.com)
  - Introduce Aria-label for the return to call button on mobile ([PR #1723](https://github.com/azure/communication-ui-library/pull/1723) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add aria-label for SidePaneHeader dismiss button ([PR #1763](https://github.com/azure/communication-ui-library/pull/1763) by edwardlee@microsoft.com)
  - Style update for Screenshare button when checked in CallWithChat composite ([PR #1653](https://github.com/azure/communication-ui-library/pull/1653) by miguelgamis@microsoft.com)
  - Switch scroll behavior in chat styles so that the parent wrapper dosen't have scroll behavior when file sharing icon present ([PR #1689](https://github.com/azure/communication-ui-library/pull/1689) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Update mobile people and chat tabs to have 'tab' roles for narration ([PR #1770](https://github.com/azure/communication-ui-library/pull/1770) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add aria label and aria description to back button on TabHeader for mobile view ([PR #1796](https://github.com/azure/communication-ui-library/pull/1796) by edwardlee@microsoft.com)
  - Improve Chat composite behavior in CallWithChatComposite to allow autofocus when opening chat pane ([PR #1717](https://github.com/azure/communication-ui-library/pull/1717) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Make Chat Message action button icon customizable ([PR #1798](https://github.com/azure/communication-ui-library/pull/1798) by 2684369+JamesBurnside@users.noreply.github.com)
  - Add aria-label for ChatMessageActionMenu button ([PR #1760](https://github.com/azure/communication-ui-library/pull/1760) by edwardlee@microsoft.com)
  - Add aria description to indicate selected camera in LocalVideoCameraButton ([PR #1794](https://github.com/azure/communication-ui-library/pull/1794) by edwardlee@microsoft.com)
  - Add joincall failure strings to ErrorBar component ([PR #1788](https://github.com/azure/communication-ui-library/pull/1788) by 2684369+JamesBurnside@users.noreply.github.com)
  - Attach file icon position changes basis on form factor ([PR #1774](https://github.com/azure/communication-ui-library/pull/1774) by anjulgarg@live.com)
  - Introduces A11y strings for aria-roles for control bar buttons ([PR #1628](https://github.com/azure/communication-ui-library/pull/1628) by 94866715+dmceachernmsft@users.noreply.github.com)

## [1.1.1-beta.1](https://github.com/azure/communication-ui-library/tree/1.1.1-beta.1)

Tue, 01 Mar 2022 16:42:52 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.1-beta.2...1.1.1-beta.1)

### Major Breaking Changes

- Upgraded to calling to 1.4.2-beta.1 ([PR #1509](https://github.com/azure/communication-ui-library/pull/1509) by 79329532+alkwa-msft@users.noreply.github.com)
- MeetingsComposite renamed to CallWithChatComposite ([PR #1446](https://github.com/azure/communication-ui-library/pull/1446) by 2684369+JamesBurnside@users.noreply.github.com)
- Restructure createAzureCommunicationCallWithChatAdapter arguments to enable accepting just a teams link without having to provide an extracted chat thread ID ([PR #1423](https://github.com/azure/communication-ui-library/pull/1423) by 2684369+JamesBurnside@users.noreply.github.com)

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

- Fix IME keyboard inputs for Safari using KeyCode and which properties ([PR #1513](https://github.com/azure/communication-ui-library/pull/1513) by 94866715+dmceachernmsft@users.noreply.github.com)
- Vertically aligned Muted indicator notification ([PR #1561](https://github.com/azure/communication-ui-library/pull/1561) by edwardlee@microsoft.com)
- Fix register icons console warning; Use a React Context to set locale, icons, and theme only once through BaseComposite ([PR #1496](https://github.com/azure/communication-ui-library/pull/1496) by edwardlee@microsoft.com)
- Fix CallComposite being stuck on the configuration page when using adapter.startCall ([PR #1403](https://github.com/azure/communication-ui-library/pull/1403) by 2684369+JamesBurnside@users.noreply.github.com)
- Fix exception thrown when trying to log stringified state when azure logger is set to verbose ([PR #1543](https://github.com/azure/communication-ui-library/pull/1543) by 2684369+JamesBurnside@users.noreply.github.com)
- Use `messageid` to check read info instead of `readon` time stamp ([PR #1503](https://github.com/azure/communication-ui-library/pull/1503) by carolinecao@microsoft.com)
- Prevent horizontal scroll in MessageThread by limiting the image preview max size in a chat message ([PR #1490](https://github.com/azure/communication-ui-library/pull/1490) by jiangnanhello@live.com)
- Bugfix for messages from teams users having extra margins around the message content ([PR #1507](https://github.com/azure/communication-ui-library/pull/1507) by jiangnanhello@live.com)
- Fix Avatars position in message thread ([PR #1345](https://github.com/azure/communication-ui-library/pull/1345) by edwardlee@microsoft.com)
- Fix EndCallButton theme colors for better contrast ([PR #1471](https://github.com/azure/communication-ui-library/pull/1471) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix Editbox border which disappeared after adding file sharing changes ([PR #1523](https://github.com/azure/communication-ui-library/pull/1523) by 97124699+prabhjot-msft@users.noreply.github.com)

### Improvements

- Update locale files with newest localized strings ([PR #1435](https://github.com/azure/communication-ui-library/pull/1435) by miguelgamis@microsoft.com)
- Identifiers added for HorizontalGallery left and right navigation buttons ([PR #1347](https://github.com/azure/communication-ui-library/pull/1347) by miguelgamis@microsoft.com)
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
  - Added strings to the side pane from locale context ([PR #1278](https://github.com/azure/communication-ui-library/pull/1278) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Fix inability to click the horizontal gallery left/right button by changing pointerEvents of LayerHost ([PR #1293](https://github.com/azure/communication-ui-library/pull/1293) by kaurprabhjot@microsoft.com)
  - Fix ScreenShareButton style to allow custom styles ([PR #1286](https://github.com/azure/communication-ui-library/pull/1286) by edwardlee@microsoft.com)
  - Small code modifications for conditional build 1. Conditional build does not support <Type*> convert, use `foo as Bar` 2. Add a hook to bypass type error when build meeting composite ([PR #1284](https://github.com/azure/communication-ui-library/pull/1284) by jinan@microsoft.com)
  - Horizontal gallery button height fixed ([PR #1285](https://github.com/azure/communication-ui-library/pull/1285) by 97124699+prabhjot-msft@users.noreply.github.com)
  - Fix alignment of typing indicator in chat composite by reducing minHeight ([PR #1297](https://github.com/azure/communication-ui-library/pull/1297) by kaurprabhjot@microsoft.com)
  - Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
- UI Composites
  - implemented custom datamodel functionality to meeting composite excluding sidebar ([PR #1319](https://github.com/azure/communication-ui-library/pull/1319) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Added MeetingCompositeOptions type to the meetings composite ([PR #1272](https://github.com/azure/communication-ui-library/pull/1272) by 94866715+dmceachernmsft@users.noreply.github.com)
  - changed meeting peopel pane to use ParticipantContainer Component ([PR #1328](https://github.com/azure/communication-ui-library/pull/1328) by 94866715+dmceachernmsft@users.noreply.github.com)
  - added missing return types ([PR #1332](https://github.com/azure/communication-ui-library/pull/1332) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add API for injecting custom buttons into CallComposite ([PR #1314](https://github.com/azure/communication-ui-library/pull/1314) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Added strings to the side pane from locale context ([PR #1278](https://github.com/azure/communication-ui-library/pull/1278) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Do not remove users from chat in the meeting composite ([PR #1340](https://github.com/azure/communication-ui-library/pull/1340) by 2684369+JamesBurnside@users.noreply.github.com)
  - Small code modifications for conditional build 1. Conditional build does not support <Type*> convert, use `foo as Bar` 2. Add a hook to bypass type error when build meeting composite ([PR #1284](https://github.com/azure/communication-ui-library/pull/1284) by jinan@microsoft.com)
  - Move @azure/communication-{calling, chat} to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
  - Increase size of participant flyout menu items for mobile view ([PR #1322](https://github.com/azure/communication-ui-library/pull/1322) by edwardlee@microsoft.com)
  - Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
- Storybook
  - Fix storybook controls around the meetings composite to work with the new MeetingCompositeOptions type in the MeetingCompositeProps ([PR #1272](https://github.com/azure/communication-ui-library/pull/1272) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Moving dependencies from @uifabric/react-hooks to @fluentui/react-hooks ([PR #1277](https://github.com/azure/communication-ui-library/pull/1277) by anjulgarg@live.com)
  - Add manual documentation for adapters ([PR #1325](https://github.com/azure/communication-ui-library/pull/1325) by 2684369+JamesBurnside@users.noreply.github.com)
  - Added entry for endpointUrl in appsettings.json instead of using connectionString twice ([PR #1310](https://github.com/azure/communication-ui-library/pull/1310) by 97124699+prabhjot-msft@users.noreply.github.com)

## [1.0.1-beta.1](https://github.com/azure/communication-ui-library/tree/1.0.1-beta.1)

Tue, 04 Jan 2022 22:57:09 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/1.0.0...1.0.1-beta.1)

### Changes

- UI Components
  - New aria label string added for `SendBox`. New property added to `SendBox` to autofocus on mount ([PR #1235](https://github.com/azure/communication-ui-library/pull/1235) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add tooltipVideoLoadingContent to Camera strings ([PR #1253](https://github.com/azure/communication-ui-library/pull/1253) by alcail@microsoft.com)
  - Add aria-label strings to MessageStatusIndicator ([PR #1247](https://github.com/azure/communication-ui-library/pull/1247) by alcail@microsoft.com)
  - Allow focus on control bar button when disabled ([PR #1251](https://github.com/azure/communication-ui-library/pull/1251) by alcail@microsoft.com)
  - Added aria roles to the different menu props ([PR #1227](https://github.com/azure/communication-ui-library/pull/1227) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Bug Fix: Ensure TypingIndicator correctly displays the number of users ([PR #1248](https://github.com/azure/communication-ui-library/pull/1248) by alcail@microsoft.com)
- UI Composites
  - Added localization strings and added meetingscreen component to increase readability of the meeting composite ([PR #1274](https://github.com/azure/communication-ui-library/pull/1274) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Added fix to allow for false value for meetingCallOptions to hide whole bar ([PR #1266](https://github.com/azure/communication-ui-library/pull/1266) by 94866715+dmceachernmsft@users.noreply.github.com)
  - Add autofocus property to the Chat Composite ([PR #1235](https://github.com/azure/communication-ui-library/pull/1235) by 94866715+dmceachernmsft@users.noreply.github.com)
- Storybook
  - Bugfix for unreadable canvas code ([PR #1270](https://github.com/azure/communication-ui-library/pull/1270) by anjulgarg@live.com)
  - Bugfix for tooltip alignment in message status indicator storybook  ([PR #1267](https://github.com/azure/communication-ui-library/pull/1267) by anjulgarg@live.com)
  - Making mock videos in storybook cover the entire video tile ([PR #1273](https://github.com/azure/communication-ui-library/pull/1273) by anjulgarg@live.com)
  - Add example ErrorBar to storybook docs ([PR #1268](https://github.com/azure/communication-ui-library/pull/1268) by anjulgarg@live.com)

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

* Fix issue where messages from a Teams client would fail to render in `MessageThread` and `ChatComposite`
* `CallControl` items are consistent between Lobby and Call screen
* Maintain position in `MessageThread` when fetching additional messages
* Fix browser camera indicator still showing in use after turning it off
* Fix issue where some message thread strings could not be set through the ChatComposite interface
* Fix box-shadow showing below the Call Composite controls bar
* Fix issue where some message thread strings could not be set through the ChatComposite interface

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
