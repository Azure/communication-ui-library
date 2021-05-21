# Change Log - @azure/acs-calling-selector

This log was last generated on Fri, 21 May 2021 16:16:28 GMT and should not be manually modified.

<!-- Start content -->

## [1.0.0-beta.0](https://github.com/azure/communication-ui-sdk/tree/@azure/acs-calling-selector_v1.0.0-beta.0)

Fri, 21 May 2021 16:16:28 GMT

### Changes

- Add calling providers and hooks to the selector package ([PR #342](https://github.com/azure/communication-ui-sdk/pull/342) by easony@microsoft.com)
- Fix wrong object passed to StreamMedia ([PR #359](https://github.com/azure/communication-ui-sdk/pull/359) by allenhwang@microsoft.com)
- Update selector types to include rendering status ([PR #279](https://github.com/azure/communication-ui-sdk/pull/279) by allenhwang@microsoft.com)
- Rename DTOs that shadow objects from Calling SDK ([PR #333](https://github.com/azure/communication-ui-sdk/pull/333) by prprabhu@microsoft.com)
- Remove selectors not related to components ([PR #346](https://github.com/azure/communication-ui-sdk/pull/346) by mail@jamesburnside.com)
- Rename state-only shadow type for Call ([PR #328](https://github.com/azure/communication-ui-sdk/pull/328) by prprabhu@microsoft.com)
- Upgrade selector to use updated Stateful render functions ([PR #293](https://github.com/azure/communication-ui-sdk/pull/293) by allenhwang@microsoft.com)
- Add Teams Interop to Group Call Sample ([PR #317](https://github.com/azure/communication-ui-sdk/pull/317) by anjulgarg@live.com)
- [#2404092] Adding stateful attributes to CallClientProvider for starting a call with camera on/off ([PR #292](https://github.com/azure/communication-ui-sdk/pull/292) by anjulgarg@live.com)
- Update handler to match adapter version of composite ([PR #301](https://github.com/azure/communication-ui-sdk/pull/301) by jinan@microsoft.com)
- Introduce common identifier format ([PR #315](https://github.com/azure/communication-ui-sdk/pull/315) by prprabhu@microsoft.com)
- Update videoGallery selectors to get active screenshare from Stateful ([PR #260](https://github.com/azure/communication-ui-sdk/pull/260) by allenhwang@microsoft.com)
- Move common type to acs-ui-common ([PR #303](https://github.com/azure/communication-ui-sdk/pull/303) by prprabhu@microsoft.com)
- Rename DeviceManager to avoid name conflict ([PR #319](https://github.com/azure/communication-ui-sdk/pull/319) by prprabhu@microsoft.com)
- Throwing error when onToggleMicrophone is invoked before call is started. ([PR #323](https://github.com/azure/communication-ui-sdk/pull/323) by miguelgamis@microsoft.com)
- fix bugs ([PR #290](https://github.com/azure/communication-ui-sdk/pull/290) by easony@microsoft.com)
- Change DeviceManagerState to DeviceManager to be consistent with other objects ([PR #200](https://github.com/azure/communication-ui-sdk/pull/200) by allenhwang@microsoft.com)
- Add initial calling selector package setup ([PR #170](https://github.com/azure/communication-ui-sdk/pull/170) by allenhwang@microsoft.com)
- ParticipantList selector changed return to to CommunicationCallingParticipant ([PR #282](https://github.com/azure/communication-ui-sdk/pull/282) by miguelgamis@microsoft.com)
- Add calling handler and selector for VideoGallery and ScreenShare ([PR #277](https://github.com/azure/communication-ui-sdk/pull/277) by anjulgarg@live.com)
- Update handler type to match component ([PR #251](https://github.com/azure/communication-ui-sdk/pull/251) by jinan@microsoft.com)
- renamed startRenderVideo to createView and stopRenderVideo to disposeView ([PR #294](https://github.com/azure/communication-ui-sdk/pull/294) by alcail@microsoft.com)
- Fix copyright header to MIT and add LICENSE files ([PR #225](https://github.com/azure/communication-ui-sdk/pull/225) by domessin@microsoft.com)
- rename declarative packages to stateful ([PR #250](https://github.com/azure/communication-ui-sdk/pull/250) by domessin@microsoft.com)
- Rename declarative to stateful ([PR #258](https://github.com/azure/communication-ui-sdk/pull/258) by mail@jamesburnside.com)
- Add initial base selector and handler for calling ([PR #179](https://github.com/azure/communication-ui-sdk/pull/179) by allenhwang@microsoft.com)
- Fix copyright header to MIT and add LICENSE files (#225) ([PR #231](https://github.com/azure/communication-ui-sdk/pull/231) by mail@jamesburnside.com)
- CameraButton selectors and handlers updated to work before a call is started. Selector for unparented videostream added. ([PR #274](https://github.com/azure/communication-ui-sdk/pull/274) by miguelgamis@microsoft.com)
- Add handler and selector for call controls ([PR #203](https://github.com/azure/communication-ui-sdk/pull/203) by anjulgarg@live.com)
- Add component binding exports to meta package ([PR #291](https://github.com/azure/communication-ui-sdk/pull/291) by mail@jamesburnside.com)
- Add memoized selector and VideoGallery component ([PR #232](https://github.com/azure/communication-ui-sdk/pull/232) by easony@microsoft.com)
- Added ParticipantList selector and handler ([PR #239](https://github.com/azure/communication-ui-sdk/pull/239) by miguelgamis@microsoft.com)
- Update exports to not conflict with other internal packages ([PR #237](https://github.com/azure/communication-ui-sdk/pull/237) by mail@jamesburnside.com)
