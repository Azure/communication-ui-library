# Change Log - react-composites

This log was last generated on Fri, 21 May 2021 16:16:28 GMT and should not be manually modified.

<!-- Start content -->

## [1.0.0-beta.0](https://github.com/azure/communication-ui-library/tree/react-composites_v1.0.0-beta.0)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- Fix wrong object passed to StreamMedia ([PR #359](https://github.com/azure/communication-ui-library/pull/359) by allenhwang@microsoft.com)
- Add leave call event Fix double leave call ([PR #349](https://github.com/azure/communication-ui-library/pull/349) by jinan@microsoft.com)
- Move calling providers and hooks to the calling selector package ([PR #342](https://github.com/azure/communication-ui-library/pull/342) by easony@microsoft.com)
- Add check to avoid modifications after unmount ([PR #295](https://github.com/azure/communication-ui-library/pull/295) by allenhwang@microsoft.com)
- Change how we get preview renders to use the new api ([PR #279](https://github.com/azure/communication-ui-library/pull/279) by allenhwang@microsoft.com)
- Rename state-only shadow type for Call ([PR #328](https://github.com/azure/communication-ui-library/pull/328) by prprabhu@microsoft.com)
- Rename DTOs that shadow objects from Calling SDK ([PR #333](https://github.com/azure/communication-ui-library/pull/333) by prprabhu@microsoft.com)
- fix scroll bar for chat screen ([PR #351](https://github.com/azure/communication-ui-library/pull/351) by jinan@microsoft.com)
- Update sendMessage back to void return value ([PR #340](https://github.com/azure/communication-ui-library/pull/340) by jinan@microsoft.com)
- Add event support for chat composite ([PR #324](https://github.com/azure/communication-ui-library/pull/324) by jinan@microsoft.com)
- Add on render avatar for calling composite ([PR #321](https://github.com/azure/communication-ui-library/pull/321) by jinan@microsoft.com)
- fix rerender issue ([PR #334](https://github.com/azure/communication-ui-library/pull/334) by jinan@microsoft.com)
- Fix local preview mic problem in composite ([PR #322](https://github.com/azure/communication-ui-library/pull/322) by jinan@microsoft.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-library/pull/315) by prprabhu@microsoft.com)
- Rename DeviceManager to avoid name conflict ([PR #319](https://github.com/azure/communication-ui-library/pull/319) by prprabhu@microsoft.com)
- removed all Text/Label children of VideoTile, also renamed local/remoteParticipantName to local/remoteParticipantDisplay name and removed label props from RemoteVideoTile  ([PR #313](https://github.com/azure/communication-ui-library/pull/313) by alcail@microsoft.com)
- Move common type to acs-ui-common ([PR #303](https://github.com/azure/communication-ui-library/pull/303) by prprabhu@microsoft.com)
- add event implemeration to calling adapter ([PR #311](https://github.com/azure/communication-ui-library/pull/311) by jinan@microsoft.com)
- [#2404092] Adding stateful attributes to CallClientProvider for starting a call with camera on/off ([PR #292](https://github.com/azure/communication-ui-library/pull/292) by anjulgarg@live.com)
- Move legacy mappers, providers and hooks to 1to1 composite ([PR #309](https://github.com/azure/communication-ui-library/pull/309) by easony@microsoft.com)
- Add chat header with thread topic name ([PR #300](https://github.com/azure/communication-ui-library/pull/300) by prprabhu@microsoft.com)
- Add selectors and handlers for Calling ([PR #232](https://github.com/azure/communication-ui-library/pull/232) by anjulgarg@live.com)
- Add ParticipantList to ChatComposite ([PR #267](https://github.com/azure/communication-ui-library/pull/267) by prprabhu@microsoft.com)
- Decouple composite from ACS client and add implement an acs adapter for the interface ([PR #229](https://github.com/azure/communication-ui-library/pull/229) by jinan@microsoft.com)
- Using new local preview in calling composite ([PR #212](https://github.com/azure/communication-ui-library/pull/212) by alkwa@microsoft.com)
- changing invertedVideo to isMirrored ([PR #268](https://github.com/azure/communication-ui-library/pull/268) by alkwa@microsoft.com)
- Removed WebUiChatParticipant type. ([PR #239](https://github.com/azure/communication-ui-library/pull/239) by miguelgamis@microsoft.com)
- adding in MessageContentType for different message rendering in message thread ([PR #266](https://github.com/azure/communication-ui-library/pull/266) by alkwa@microsoft.com)
- renamed VideoTile props placeholderProvider to placeholder ([PR #284](https://github.com/azure/communication-ui-library/pull/284) by alcail@microsoft.com)
- Rename GroupChat* to Chat* in composites ([PR #252](https://github.com/azure/communication-ui-library/pull/252) by prprabhu@microsoft.com)
- update name and avatarName to displayName ([PR #278](https://github.com/azure/communication-ui-library/pull/278) by alcail@microsoft.com)
- Replacing admininstration with identity dependency ([PR #235](https://github.com/azure/communication-ui-library/pull/235) by alkwa@microsoft.com)
- Prune exports and add chat composite to @azure/communication-react ([PR #276](https://github.com/azure/communication-ui-library/pull/276) by mail@jamesburnside.com)
- migrate call composite to statuful ([PR #290](https://github.com/azure/communication-ui-library/pull/290) by easony@microsoft.com)
- added CallingTheme and used it for EndCallButton styles ([PR #249](https://github.com/azure/communication-ui-library/pull/249) by alcail@microsoft.com)
- Create composite package. Migrate files from react-components to new package. ([PR #188](https://github.com/azure/communication-ui-library/pull/188) by mail@jamesburnside.com)
- First stab at GroupCallAdapter interface ([PR #216](https://github.com/azure/communication-ui-library/pull/216) by domessin@microsoft.com)
- rename declarative packages to stateful ([PR #250](https://github.com/azure/communication-ui-library/pull/250) by domessin@microsoft.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-library/pull/225) by domessin@microsoft.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-library/pull/231) by mail@jamesburnside.com)
- Add calling handler and selector for VideoGallery and ScreenShare ([PR #277](https://github.com/azure/communication-ui-library/pull/277) by anjulgarg@live.com)
- Bump azure-communication-{chat, common, identity} to 1.0.0 ([PR #234](https://github.com/azure/communication-ui-library/pull/234) by prprabhu@microsoft.com)
- Update from renaming declarative to stateful ([PR #258](https://github.com/azure/communication-ui-library/pull/258) by mail@jamesburnside.com)
- renamed startRenderVideo to createView and stopRenderVideo to disposeView ([PR #294](https://github.com/azure/communication-ui-library/pull/294) by alcail@microsoft.com)
