# Change Log - calling-stateful-client

This log was last generated on Fri, 21 May 2021 16:16:28 GMT and should not be manually modified.

<!-- Start content -->

## [1.0.0-beta.1](https://github.com/azure/communication-ui-library/tree/calling-stateful-client_v1.0.0-beta.1)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- Add rendering status to Stateful views ([PR #279](https://github.com/azure/communication-ui-library/pull/279) by allenhwang@microsoft.com)
- Rename state-only shadow type for Call ([PR #328](https://github.com/azure/communication-ui-library/pull/328) by prprabhu@microsoft.com)
- Rename DTOs that shadow objects from Calling SDK ([PR #333](https://github.com/azure/communication-ui-library/pull/333) by prprabhu@microsoft.com)
- Wrap all sources of Call in StatefulCall ([PR #296](https://github.com/azure/communication-ui-library/pull/296) by allenhwang@microsoft.com)
- Prevent collision of streamid to alter state of different participants ([PR #293](https://github.com/azure/communication-ui-library/pull/293) by allenhwang@microsoft.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-library/pull/315) by prprabhu@microsoft.com)
- Update createStatefulCallClient to create the underlying call client internally ([PR #302](https://github.com/azure/communication-ui-library/pull/302) by mail@jamesburnside.com)
- Rename stateful CallAgent to CallAgentState ([PR #320](https://github.com/azure/communication-ui-library/pull/320) by prprabhu@microsoft.com)
- Update state to getState() ([PR #301](https://github.com/azure/communication-ui-library/pull/301) by jinan@microsoft.com)
- Surface active screenshare in Stateful ([PR #260](https://github.com/azure/communication-ui-library/pull/260) by allenhwang@microsoft.com)
- Rename DeviceManager to avoid name conflict ([PR #319](https://github.com/azure/communication-ui-library/pull/319) by prprabhu@microsoft.com)
- Add calling handler and selector for VideoGallery and ScreenShare ([PR #277](https://github.com/azure/communication-ui-library/pull/277) by anjulgarg@live.com)
- Update from renaming declarative to stateful ([PR #258](https://github.com/azure/communication-ui-library/pull/258) by mail@jamesburnside.com)
- Selected camera initialzed as first first camera when cameras are no longer empty. ([PR #274](https://github.com/azure/communication-ui-library/pull/274) by miguelgamis@microsoft.com)
- Allow rendering of Streams created outside of state in StatefulCalling ([PR #248](https://github.com/azure/communication-ui-library/pull/248) by allenhwang@microsoft.com)
- renamed startRenderVideo to createView and stopRenderVideo to disposeView ([PR #294](https://github.com/azure/communication-ui-library/pull/294) by alcail@microsoft.com)
- rename declarative packages to stateful ([PR #250](https://github.com/azure/communication-ui-library/pull/250) by domessin@microsoft.com)
- Upgrade to Calling SDK version 1.0.1-beta.1 ([PR #145](https://github.com/azure/communication-ui-library/pull/145) by allenhwang@microsoft.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-library/pull/231) by mail@jamesburnside.com)
- Add recording notice capability to Calling Declarative ([PR #194](https://github.com/azure/communication-ui-library/pull/194) by allenhwang@microsoft.com)
- Add proxying for Call mute/unmute and Call/IncomingCall/RemoteParticipant CallEndReason states in Declarative Calling. ([PR #130](https://github.com/azure/communication-ui-library/pull/130) by allenhwang@microsoft.com)
- Add subscriber for RemoteVideoStream events to capture those state updates for Calling Declarative ([PR #123](https://github.com/azure/communication-ui-library/pull/123) by allenhwang@microsoft.com)
- Add DeclarativeCallAgent and DeclarativeDeviceManager to calling declarative ([PR #104](https://github.com/azure/communication-ui-library/pull/104) by allenhwang@microsoft.com)
- Add transcription notice capability to Calling Declarative ([PR #190](https://github.com/azure/communication-ui-library/pull/190) by allenhwang@microsoft.com)
- Initial changelog setup ([PR #45](https://github.com/azure/communication-ui-library/pull/45) by mail@jamesburnside.com)
- Add selectors and handlers for Calling ([PR #232](https://github.com/azure/communication-ui-library/pull/232) by anjulgarg@live.com)
- Add proxying of TransferCallFeature state to Calling Declarative ([PR #233](https://github.com/azure/communication-ui-library/pull/233) by allenhwang@microsoft.com)
- Add handler and selector for call controls ([PR #203](https://github.com/azure/communication-ui-library/pull/203) by anjulgarg@live.com)
- Update `DeclarativeCallClient` with calling SDK version beta.9 and add types. Improve performance by only updating changed state. ([PR #77](https://github.com/azure/communication-ui-library/pull/77) by allenhwang@microsoft.com)
- Add ability to render Declarative VideoStreams ([PR #154](https://github.com/azure/communication-ui-library/pull/154) by allenhwang@microsoft.com)
- Add ability to unregister from stateChange events ([PR #187](https://github.com/azure/communication-ui-library/pull/187) by allenhwang@microsoft.com)
- Add commonjs support ([PR #132](https://github.com/azure/communication-ui-library/pull/132) by mail@jamesburnside.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-library/pull/225) by domessin@microsoft.com)
- Add api extractor for package ([PR #68](https://github.com/azure/communication-ui-library/pull/68) by mail@jamesburnside.com)
- Surface userId and displayName in Calling Declarative state ([PR #200](https://github.com/azure/communication-ui-library/pull/200) by allenhwang@microsoft.com)
- Update exports to not conflict with other internal packages ([PR #237](https://github.com/azure/communication-ui-library/pull/237) by mail@jamesburnside.com)
