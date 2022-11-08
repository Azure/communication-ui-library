# Change Log - @internal/chat-component-bindings

This log was last generated on Fri, 21 Oct 2022 23:02:10 GMT and should not be manually modified.

<!-- Start content -->

## [1.3.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.3.2-beta.1)

Wed, 05 Oct 2022 18:13:55 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.3.1-beta.1...@internal/chat-component-bindings_v1.3.2-beta.1)

### Patches

- Show datetime when there are more than 5 mins between each message ([PR #2299](https://github.com/azure/communication-ui-library/pull/2299) by carolinecao@microsoft.com)
- Bump @internal/acs-ui-common to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)
- Bump @internal/chat-stateful-client to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)
- Bump @internal/react-components to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)

## [1.3.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.3.1-beta.1)

Wed, 29 Jun 2022 17:31:08 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.3.0...@internal/chat-component-bindings_v1.3.1-beta.1)

### Patches

- Bump @internal/acs-ui-common to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)
- Bump @internal/chat-stateful-client to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)
- Bump @internal/react-components to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)

## [1.2.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.2.2-beta.1)

Tue, 19 Apr 2022 20:46:15 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.2.0...@internal/chat-component-bindings_v1.2.2-beta.1)

### Patches

- do not caculate read receipt details, pass read receipt array down to component level ([PR #1691](https://github.com/azure/communication-ui-library/pull/1691) by carolinecao@microsoft.com)
- Disable Read Receipt details in meeting interop ([PR #1728](https://github.com/azure/communication-ui-library/pull/1728) by jiangnanhello@live.com)
- Filter read receipt to not include myself ([PR #1791](https://github.com/azure/communication-ui-library/pull/1791) by carolinecao@microsoft.com)
- Do not show "Not In Thread" Error Banner shown to user when a BotContact is a participant in Teams Interop Chats ([PR #1737](https://github.com/azure/communication-ui-library/pull/1737) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/chat-stateful-client to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)
- Bump @internal/react-components to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)

### Changes

- Adding file metadata parsing to selectors ([PR #1790](https://github.com/azure/communication-ui-library/pull/1790) by anjulgarg@live.com)
- fetch read receipt when participant join the chat, also not show read receipt info when having more than 20 participants ([PR #1639](https://github.com/azure/communication-ui-library/pull/1639) by carolinecao@microsoft.com)
- Modifying the updateMessage handler method to allow passing metadata as a parameter ([PR #1776](https://github.com/azure/communication-ui-library/pull/1776) by anjulgarg@live.com)

## [1.1.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.1.1-beta.1)

Tue, 01 Mar 2022 16:42:56 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.0.1...@internal/chat-component-bindings_v1.1.1-beta.1)

### Minor changes

- Add options param to sendMessage for sending metadata ([PR #1374](https://github.com/azure/communication-ui-library/pull/1374) by anjulgarg@live.com)

### Patches

- using messageid to check read info instead of readon time stamp ([PR #1503](https://github.com/azure/communication-ui-library/pull/1503) by carolinecao@microsoft.com)
- Upgrade @azure/communication-signaling to 1.0.0.beta.12 ([PR #1352](https://github.com/azure/communication-ui-library/pull/1352) by anjulgarg@live.com)
- Bump @internal/acs-ui-common to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/chat-stateful-client to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)
- Bump @internal/react-components to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)

### Changes

- submenu showing who read the message (name and avatar) ([PR #1493](https://github.com/azure/communication-ui-library/pull/1493) by carolinecao@microsoft.com)
- Removed participant should not show up in read information  ([PR #1497](https://github.com/azure/communication-ui-library/pull/1497) by carolinecao@microsoft.com)
- Added Feature to show how many people have read the message ([PR #1407](https://github.com/azure/communication-ui-library/pull/1407) by 96077406+carocao-msft@users.noreply.github.com)

## [1.0.0-beta.8](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.0.0-beta.8)

Wed, 17 Nov 2021 22:21:27 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.0.0-beta.7..@internal/chat-component-bindings_v1.0.0-beta.8)

### Changes

- Update MessageThread selector to filter out unsupported messages ([PR #1007](https://github.com/azure/communication-ui-library/pull/1007) by 2684369+JamesBurnside@users.noreply.github.com)
- Disallow removing Teams participants from chat ([PR #1035](https://github.com/azure/communication-ui-library/pull/1035) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)

## [1.0.0-beta.7](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.0.0-beta.7)

Wed, 27 Oct 2021 19:40:46 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.0.0-beta.6..@internal/chat-component-bindings_v1.0.0-beta.7)

### Changes

- Rename `Error.inner` to `Error.innerError` ([PR #882](https://github.com/azure/communication-ui-library/pull/882) by 82062616+prprabhu-ms@users.noreply.github.com)
- Refactor message.attached logic ([PR #893](https://github.com/azure/communication-ui-library/pull/893) by jinan@microsoft.com)
- Add release tags to all public API ([PR #846](https://github.com/azure/communication-ui-library/pull/846) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update to new ChatMessage types ([PR #830](https://github.com/azure/communication-ui-library/pull/830) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix html message type not rendering ([PR #946](https://github.com/azure/communication-ui-library/pull/946) by jinan@microsoft.com)
- Remove selector instance from export Add types for selectors ([PR #962](https://github.com/azure/communication-ui-library/pull/962) by jinan@microsoft.com)
- Rename `ActiveError` to `ActiveErrorMessage` ([PR #880](https://github.com/azure/communication-ui-library/pull/880) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.0.0-beta.5..@internal/chat-component-bindings_v1.0.0-beta.6)

### Changes

- Bump chat sdk to version 1.1.0 ([PR #816](https://github.com/azure/communication-ui-library/pull/816) by jinan@microsoft.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add edited tag to messages ([PR #759](https://github.com/azure/communication-ui-library/pull/759) by jinan@microsoft.com)

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.0.0-beta.4..@internal/chat-component-bindings_v1.0.0-beta.5)

### Changes

- Apply chat sdk hotfix ([PR #747](https://github.com/azure/communication-ui-library/pull/747) by jinan@microsoft.com)
- Rename ChatErrorTarget ([PR #703](https://github.com/azure/communication-ui-library/pull/703) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add deleted message fileter into bindings ([PR #734](https://github.com/azure/communication-ui-library/pull/734) by jinan@microsoft.com)
- Add methods to clear calling ACS errors ([PR #685](https://github.com/azure/communication-ui-library/pull/685) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add timestamp to teed errors ([PR #753](https://github.com/azure/communication-ui-library/pull/753) by 82062616+prprabhu-ms@users.noreply.github.com)
- Delete ErrorBar handlers ([PR #756](https://github.com/azure/communication-ui-library/pull/756) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump acs-ui-common dep ([PR #732](https://github.com/azure/communication-ui-library/pull/732) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adjust most comments in internal api review ([PR #724](https://github.com/azure/communication-ui-library/pull/724) by jinan@microsoft.com)
- Move the name filter logic to selector Make component acs unrelated ([PR #654](https://github.com/azure/communication-ui-library/pull/654) by jinan@microsoft.com)

## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-component-bindings_v1.0.0-beta.3..@internal/chat-component-bindings_v1.0.0-beta.4)

### Changes

- Replace StatefulChatClient.clearErrors() with modifier pattern ([PR #601](https://github.com/azure/communication-ui-library/pull/601) by 82062616+prprabhu-ms@users.noreply.github.com)
- Workaround before we get sequenceId from signal ([PR #653](https://github.com/azure/communication-ui-library/pull/653) by jinan@microsoft.com)
- Add system message for selector props ([PR #603](https://github.com/azure/communication-ui-library/pull/603) by jinan@microsoft.com)
- updated Typescript version to 4.3.5 ([PR #645](https://github.com/azure/communication-ui-library/pull/645) by alcail@microsoft.com)

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/@internal/chat-component-bindings_v1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/chat-component-bindings_v1.0.0-beta.2..@internal/chat-component-bindings_v1.0.0-beta.3)

### Changes

- Support more error types in ErrorBar ([PR #581](https://github.com/azure/communication-ui-library/pull/581) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fixed MessageThread selector to allow messages of type 'html'. ([PR #588](https://github.com/azure/communication-ui-library/pull/588) by miguelgamis@microsoft.com)
- Fix error handling of failures in `ChatThreadClient.listMessage` ([PR #550](https://github.com/azure/communication-ui-library/pull/550) by 82062616+prprabhu-ms@users.noreply.github.com)
- Limit the number of errors show in UI ([PR #586](https://github.com/azure/communication-ui-library/pull/586) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add data bindings for ErrorBar ([PR #574](https://github.com/azure/communication-ui-library/pull/574) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump prettier version and reformat ([PR #535](https://github.com/azure/communication-ui-library/pull/535) by prprabhu@microsoft.com)

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/chat-component-bindings_v1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT
[Compare changes](https://github.com/azure/communication-ui-library/compare/chat-component-bindings_v1.0.0-beta.1..chat-component-bindings_v1.0.0-beta.2)

### Changes

- Update references to threads object ([PR #461](https://github.com/azure/communication-ui-library/pull/461) by prprabhu@microsoft.com)
- Update to use Object for chat participants ([PR #462](https://github.com/azure/communication-ui-library/pull/462) by prprabhu@microsoft.com)
- Bump prettier version and reformat ([PR #505](https://github.com/azure/communication-ui-library/pull/505) by prprabhu@microsoft.com)
- Adjustments for merging chat&calling hooks ([PR #454](https://github.com/azure/communication-ui-library/pull/454) by jinan@microsoft.com)
- Update to use Object for chatMessages ([PR #463](https://github.com/azure/communication-ui-library/pull/463) by prprabhu@microsoft.com)
- remove extra selector export ([PR #383](https://github.com/azure/communication-ui-library/pull/383) by jinan@microsoft.com)
- update react peer deps to be >=16.8.0 <18.0.0 ([PR #450](https://github.com/azure/communication-ui-library/pull/450) by mail@jamesburnside.com)
- Update usePropsFor to use re-enforced version of type guard ([PR #496](https://github.com/azure/communication-ui-library/pull/496) by jinan@microsoft.com)

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/chat-component-bindings_v1.0.0-beta.1)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- Rename useSelector to useChatSelector ([PR #342](https://github.com/azure/communication-ui-library/pull/342) by easony@microsoft.com)
- renamed disabledReadReceipt props to showMessageStatus ([PR #335](https://github.com/azure/communication-ui-library/pull/335) by alcail@microsoft.com)
- Add check to avoid modifications after unmount ([PR #295](https://github.com/azure/communication-ui-library/pull/295) by allenhwang@microsoft.com)
- removed displayName from chatParticipantListSelector ([PR #341](https://github.com/azure/communication-ui-library/pull/341) by alcail@microsoft.com)
- Update sendMessage back to void return value ([PR #340](https://github.com/azure/communication-ui-library/pull/340) by jinan@microsoft.com)
- Add event support for chat composite ([PR #324](https://github.com/azure/communication-ui-library/pull/324) by jinan@microsoft.com)
- Add participant list to usePropsFor ([PR #329](https://github.com/azure/communication-ui-library/pull/329) by jinan@microsoft.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-library/pull/315) by prprabhu@microsoft.com)
- Move common type to @internal/acs-ui-common ([PR #303](https://github.com/azure/communication-ui-library/pull/303) by prprabhu@microsoft.com)
- Extract hooks and providers to selector package Simplified provider logic, move client creation logic to contoso ([PR #236](https://github.com/azure/communication-ui-library/pull/236) by jinan@microsoft.com)
- Add selectors and handlers for Calling ([PR #232](https://github.com/azure/communication-ui-library/pull/232) by anjulgarg@live.com)
- including message type so we know how to render the message payload ([PR #266](https://github.com/azure/communication-ui-library/pull/266) by alkwa@microsoft.com)
- Add commonjs support ([PR #132](https://github.com/azure/communication-ui-library/pull/132) by mail@jamesburnside.com)
- Add api extractor for package ([PR #68](https://github.com/azure/communication-ui-library/pull/68) by mail@jamesburnside.com)
- Calculate more props in selector for perf improvement ([PR #147](https://github.com/azure/communication-ui-library/pull/147) by jinan@microsoft.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-library/pull/231) by mail@jamesburnside.com)
- Add participantList selector ([PR #140](https://github.com/azure/communication-ui-library/pull/140) by anjulgarg@live.com)
- change StatefulChatClient.state to getState() ([PR #250](https://github.com/azure/communication-ui-library/pull/250) by domessin@microsoft.com)
- Bump azure-communication-{chat, common, identity} to 1.0.0 ([PR #234](https://github.com/azure/communication-ui-library/pull/234) by prprabhu@microsoft.com)
- Add chatHeaderSelector and handlers ([PR #144](https://github.com/azure/communication-ui-library/pull/144) by anjulgarg@live.com)
- Add messages types in selector ([PR #141](https://github.com/azure/communication-ui-library/pull/141) by easony@microsoft.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-library/pull/225) by domessin@microsoft.com)
- accounting for Text as a message content type ([PR #285](https://github.com/azure/communication-ui-library/pull/285) by alkwa@microsoft.com)
- Updated onMessageSend handler for SendBox. Added selector for TypingIndicator. ([PR #148](https://github.com/azure/communication-ui-library/pull/148) by miguelgamis@microsoft.com)
- Reinforce usePropsFor type guard ([PR #251](https://github.com/azure/communication-ui-library/pull/251) by jinan@microsoft.com)
- Update exports to not conflict with other internal packages ([PR #237](https://github.com/azure/communication-ui-library/pull/237) by mail@jamesburnside.com)
- export createAllHandler for adapter to consume ([PR #229](https://github.com/azure/communication-ui-library/pull/229) by jinan@microsoft.com)
- Updated chatParticipantSelector return object property names. Removed WebUiChatParticipant type. ([PR #239](https://github.com/azure/communication-ui-library/pull/239) by miguelgamis@microsoft.com)
- Update chatThread to deep memoize each element when doing mapping ([PR #146](https://github.com/azure/communication-ui-library/pull/146) by jinan@microsoft.com)
- typingIndicatorSelector refactor ([PR #161](https://github.com/azure/communication-ui-library/pull/161) by miguelgamis@microsoft.com)
- Update TypingIndicatorEvent to native SDK type ([PR #261](https://github.com/azure/communication-ui-library/pull/261) by mail@jamesburnside.com)
- update selector for declarative variable change ([PR #131](https://github.com/azure/communication-ui-library/pull/131) by jinan@microsoft.com)
- Fixed empty display names in typingIndicatorSelector ([PR #168](https://github.com/azure/communication-ui-library/pull/168) by miguelgamis@microsoft.com)
- removing chat coolperiod in chat selector ([PR #270](https://github.com/azure/communication-ui-library/pull/270) by alkwa@microsoft.com)
