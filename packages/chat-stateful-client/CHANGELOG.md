# Change Log - @internal/chat-stateful-client

This log was last generated on Tue, 28 Sep 2021 19:19:18 GMT and should not be manually modified.

<!-- Start content -->

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/chat-stateful-client_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-stateful-client_v1.0.0-beta.5..@internal/chat-stateful-client_v1.0.0-beta.6)

### Changes

- Update use of internal exported function ([PR #823](https://github.com/azure/communication-ui-library/pull/823) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump chat sdk to version 1.1.0 ([PR #816](https://github.com/azure/communication-ui-library/pull/816) by jinan@microsoft.com)
- Stop clearing errors in ChatClientState ([PR #781](https://github.com/azure/communication-ui-library/pull/781) by 82062616+prprabhu-ms@users.noreply.github.com)
- Drop state modification API ([PR #782](https://github.com/azure/communication-ui-library/pull/782) by 82062616+prprabhu-ms@users.noreply.github.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/@internal/chat-stateful-client_v1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-stateful-client_v1.0.0-beta.4..@internal/chat-stateful-client_v1.0.0-beta.5)

### Changes

- Apply chat sdk hotfix ([PR #747](https://github.com/azure/communication-ui-library/pull/747) by jinan@microsoft.com)
- bug-fix: Avoid squelching some exceptions ([PR #684](https://github.com/azure/communication-ui-library/pull/684) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add timestamp to teed errors ([PR #753](https://github.com/azure/communication-ui-library/pull/753) by 82062616+prprabhu-ms@users.noreply.github.com)
- Rename ChatErrorTarget ([PR #703](https://github.com/azure/communication-ui-library/pull/703) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump acs-ui-common dep ([PR #732](https://github.com/azure/communication-ui-library/pull/732) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update client to get 'editedOn' property from message update event ([PR #734](https://github.com/azure/communication-ui-library/pull/734) by jinan@microsoft.com)
- Add methods to clear calling ACS errors ([PR #685](https://github.com/azure/communication-ui-library/pull/685) by 82062616+prprabhu-ms@users.noreply.github.com)
- updating immer to 9.0.6 ([PR #764](https://github.com/azure/communication-ui-library/pull/764) by 79329532+alkwa-msft@users.noreply.github.com)

## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/@internal/chat-stateful-client_v1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/chat-stateful-client_v1.0.0-beta.3..@internal/chat-stateful-client_v1.0.0-beta.4)

### Changes

- Link system message to participant received event ([PR #603](https://github.com/azure/communication-ui-library/pull/603) by jinan@microsoft.com)
- Remove type blocking usage of the package on older typescript versions ([PR #624](https://github.com/azure/communication-ui-library/pull/624) by 2684369+JamesBurnside@users.noreply.github.com)
- Replace StatefulChatClient.clearErrors() with modifier pattern ([PR #601](https://github.com/azure/communication-ui-library/pull/601) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add explicit string literals for error targets ([PR #636](https://github.com/azure/communication-ui-library/pull/636) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add applicationID to chat user agent ([PR #669](https://github.com/azure/communication-ui-library/pull/669) by 82062616+prprabhu-ms@users.noreply.github.com)
- updated Typescript version to 4.3.5 ([PR #645](https://github.com/azure/communication-ui-library/pull/645) by alcail@microsoft.com)

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/@internal/chat-stateful-client_v1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/chat-stateful-client_v1.0.0-beta.2..@internal/chat-stateful-client_v1.0.0-beta.3)

### Changes

- When an operation suceeds, clear related errors from state ([PR #535](https://github.com/azure/communication-ui-library/pull/535) by prprabhu@microsoft.com)
- Store errors from ChatThreadClient in the state ([PR #538](https://github.com/azure/communication-ui-library/pull/538) by 82062616+prprabhu-ms@users.noreply.github.com)
- Tee errors from listChatThreads to state ([PR #531](https://github.com/azure/communication-ui-library/pull/531) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add method to clear errors ([PR #574](https://github.com/azure/communication-ui-library/pull/574) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add chat thread creation and deletion error handling ([PR #535](https://github.com/azure/communication-ui-library/pull/535) by prprabhu@microsoft.com)

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/chat-stateful-client_v1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/chat-stateful-client_v1.0.0-beta.1..chat-stateful-client_v1.0.0-beta.2)

### Changes

- Replace Map with Object in chatMessages ([PR #463](https://github.com/azure/communication-ui-library/pull/463) by prprabhu@microsoft.com)
- Use Object for chat participants ([PR #462](https://github.com/azure/communication-ui-library/pull/462) by prprabhu@microsoft.com)
- Add error handling facilities ([PR #510](https://github.com/azure/communication-ui-library/pull/510) by prprabhu@microsoft.com)
- Bump up max listeners limit ([PR #360](https://github.com/azure/communication-ui-library/pull/360) by allenhwang@microsoft.com)
- Bump prettier version and reformat ([PR #505](https://github.com/azure/communication-ui-library/pull/505) by prprabhu@microsoft.com)
- Replace Map with Object for ChatClientState.threads ([PR #461](https://github.com/azure/communication-ui-library/pull/461) by prprabhu@microsoft.com)
- Make max listeners configurable ([PR #393](https://github.com/azure/communication-ui-library/pull/393) by allenhwang@microsoft.com)

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/chat-stateful-client_v1.0.0-beta.1)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- Fix pipeline dependencies error ([PR #301](https://github.com/azure/communication-ui-library/pull/301) by jinan@microsoft.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-library/pull/315) by prprabhu@microsoft.com)
- Update createStatefulChatClient to create the underlying chat client internally ([PR #302](https://github.com/azure/communication-ui-library/pull/302) by mail@jamesburnside.com)
- bugfix: Persist fetched chat thread properties ([PR #300](https://github.com/azure/communication-ui-library/pull/300) by prprabhu@microsoft.com)
- removing unused chat error properties ([PR #271](https://github.com/azure/communication-ui-library/pull/271) by alkwa@microsoft.com)
- change StatefulChatClient.state to getState() ([PR #250](https://github.com/azure/communication-ui-library/pull/250) by domessin@microsoft.com)
- removing chat coolperiod in chat selector ([PR #270](https://github.com/azure/communication-ui-library/pull/270) by alkwa@microsoft.com)
- Remove TypingIndicatorEvent export ([PR #261](https://github.com/azure/communication-ui-library/pull/261) by mail@jamesburnside.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-library/pull/231) by mail@jamesburnside.com)
- Add cleaning up timer for typingIndicator every 8 secs ([PR #230](https://github.com/azure/communication-ui-library/pull/230) by jinan@microsoft.com)
- Initial changelog setup ([PR #45](https://github.com/azure/communication-ui-library/pull/45) by mail@jamesburnside.com)
- Add api extractor for package ([PR #68](https://github.com/azure/communication-ui-library/pull/68) by mail@jamesburnside.com)
- Bump azure-communication-{chat, common, identity} to 1.0.0 ([PR #234](https://github.com/azure/communication-ui-library/pull/234) by prprabhu@microsoft.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-library/pull/225) by domessin@microsoft.com)
- Add commonjs support ([PR #132](https://github.com/azure/communication-ui-library/pull/132) by mail@jamesburnside.com)
- Update exports to not conflict with other internal packages ([PR #237](https://github.com/azure/communication-ui-library/pull/237) by mail@jamesburnside.com)
