# Change Log - chat-component-bindings

This log was last generated on Fri, 21 May 2021 16:16:28 GMT and should not be manually modified.

<!-- Start content -->

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
- Move common type to acs-ui-common ([PR #303](https://github.com/azure/communication-ui-library/pull/303) by prprabhu@microsoft.com)
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
