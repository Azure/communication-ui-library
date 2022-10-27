# Change Log - @internal/calling-stateful-client

This log was last generated on Wed, 05 Oct 2022 18:13:54 GMT and should not be manually modified.

<!-- Start content -->

## [1.3.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.3.2-beta.1)

Wed, 05 Oct 2022 18:13:54 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.3.1-beta.1...@internal/calling-stateful-client_v1.3.2-beta.1)

### Patches

- Add event logs for disposing local video streams ([PR #2121](https://github.com/azure/communication-ui-library/pull/2121) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.3.2-beta.1 ([PR #2379](https://github.com/azure/communication-ui-library/pull/2379) by beachball)

### Changes

- bump calling beta to 1.6.0-beta.1 ([PR #2047](https://github.com/azure/communication-ui-library/pull/2047) by miguelgamis@microsoft.com)
- Bumped calling SDK beta version to 1.8.0-beta.1 ([PR #2362](https://github.com/azure/communication-ui-library/pull/2362) by miguelgamis@microsoft.com)
- Introduce AlternateCallerId from the Calling SDK to the Calling stateful client. ([PR #2095](https://github.com/azure/communication-ui-library/pull/2095) by 94866715+dmceachernmsft@users.noreply.github.com)
- Introduce the alternativeCallerId property from the Calling SDK to the stateful Client and CallContext. ([PR #2070](https://github.com/azure/communication-ui-library/pull/2070) by 94866715+dmceachernmsft@users.noreply.github.com)
- Bump calling beta to 1.6.1 beta.1 ([PR #2074](https://github.com/azure/communication-ui-library/pull/2074) by edwardlee@microsoft.com)

## [1.3.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.3.1-beta.1)

Wed, 29 Jun 2022 17:31:07 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.3.0...@internal/calling-stateful-client_v1.3.1-beta.1)

### Patches

- Bump @internal/acs-ui-common to v1.3.1-beta.1 ([PR #2030](https://github.com/azure/communication-ui-library/pull/2030) by beachball)

### Changes

- Add incomingCalls array to declarative call agent ([PR #1975](https://github.com/azure/communication-ui-library/pull/1975) by anjulgarg@live.com)

## [1.3.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.3.0)

Mon, 13 Jun 2022 18:29:30 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.2.2-beta.1...@internal/calling-stateful-client_v1.3.0)

### Patches

- Return the renderer and view created when statefulCallClient.createView is called ([PR #1889](https://github.com/azure/communication-ui-library/pull/1889) by 2684369+JamesBurnside@users.noreply.github.com)
- - Add callIdHistory to context + internal context - Update all visit to callId using latestCallId - Encapsule the access to internalMap directly to ensure no leaks ([PR #1817](https://github.com/azure/communication-ui-library/pull/1817) by jiangnanhello@live.com)
- Update the right call.id into state ([PR #1818](https://github.com/azure/communication-ui-library/pull/1818) by jiangnanhello@live.com)
- Bump @internal/acs-ui-common to v1.3.0 ([PR #1978](https://github.com/azure/communication-ui-library/pull/1978) by beachball)

### Changes

- Support `isReceiving` flag for video streams ([PR #1954](https://github.com/azure/communication-ui-library/pull/1954) by chwhilar@microsoft.com)
- Updating @azure/communication-chat to 1.2.0 ([PR #1815](https://github.com/azure/communication-ui-library/pull/1815) by anjulgarg@live.com)
- Update Calling declarative to handle new PSTN functions ([PR #1917](https://github.com/azure/communication-ui-library/pull/1917) by 94866715+dmceachernmsft@users.noreply.github.com)
- updating beta @azure/communication-calling to 1.5.4-beta.1 ([PR #1925](https://github.com/azure/communication-ui-library/pull/1925) by 79475487+mgamis-msft@users.noreply.github.com)

## [1.2.2-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.2.2-beta.1)

Tue, 19 Apr 2022 20:46:15 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.2.0...@internal/calling-stateful-client_v1.2.2-beta.1)

### Patches

- Bump @internal/acs-ui-common to v1.2.2-beta.1 ([PR #1631](https://github.com/azure/communication-ui-library/pull/1631) by beachball)

### Changes

- Add telemetry for rendering problems ([PR #1752](https://github.com/azure/communication-ui-library/pull/1752) by jiangnanhello@live.com)
- Log the function called from stateful client ([PR #1793](https://github.com/azure/communication-ui-library/pull/1793) by jiangnanhello@live.com)

## [1.2.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.2.0)

Fri, 11 Mar 2022 19:20:03 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.1.1-beta.1...@internal/calling-stateful-client_v1.2.0)

### Patches

- Bump @azure/communication-calling to 1.4.3 ([PR #1610](https://github.com/azure/communication-ui-library/pull/1610) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.2.0 ([commit](https://github.com/azure/communication-ui-library/commit/8840a94fa6175db937f697b1c6a6a64cc2fb743f) by beachball)

### Changes

- Upgrading calling to 1.4.3-beta.1 ([PR #1607](https://github.com/azure/communication-ui-library/pull/1607) by edwardlee@microsoft.com)

## [1.1.1-beta.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.1.1-beta.1)

Tue, 01 Mar 2022 16:42:56 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.1...@internal/calling-stateful-client_v1.1.1-beta.1)

### Patches

- Fix exception thrown when trying to log stringified state when azure logger is set to verbose ([PR #1543](https://github.com/azure/communication-ui-library/pull/1543) by 2684369+JamesBurnside@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.1.1-beta.1 ([commit](https://github.com/azure/communication-ui-library/commit/ad59ff742c9fad2fceb1b819cb259c1ee8f29e62) by beachball)

### Changes

- upgrading calling to 1.4.2-beta.1 ([PR #1509](https://github.com/azure/communication-ui-library/pull/1509) by 79329532+alkwa-msft@users.noreply.github.com)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.1)

Mon, 24 Jan 2022 23:18:54 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.1...@internal/calling-stateful-client_v1.0.1)

### Patches

- Move @azure/communication-calling to peer dependency ([PR #1294](https://github.com/azure/communication-ui-library/pull/1294) by 82062616+prprabhu-ms@users.noreply.github.com)
- Bump @internal/acs-ui-common to v1.0.1 ([PR #1335](https://github.com/azure/communication-ui-library/pull/1335) by beachball)

## [1.0.1](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.1)

Tue, 04 Jan 2022 22:57:09 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0...@internal/calling-stateful-client_v1.0.1)

### Patches

- Bump @internal/acs-ui-common to v1.0.1 ([PR #1276](https://github.com/azure/communication-ui-library/pull/1276) by beachball)

## [1.0.0](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0)

Mon, 06 Dec 2021 19:41:59 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0-beta.8..@internal/calling-stateful-client_v1.0.0)

### Changes

- Remove spammy console log when rendering video ([PR #1188](https://github.com/azure/communication-ui-library/pull/1188) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.8](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0-beta.8)

Wed, 17 Nov 2021 22:21:27 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0-beta.7..@internal/calling-stateful-client_v1.0.0-beta.8)

### Changes

- Bump headless calling SDK to 1.3.1-beta.1 ([PR #1056](https://github.com/azure/communication-ui-library/pull/1056) by 82062616+prprabhu-ms@users.noreply.github.com)
- Update according to azure review ([PR #998](https://github.com/azure/communication-ui-library/pull/998) by jinan@microsoft.com)
- Remove call transfer feature ([PR #1105](https://github.com/azure/communication-ui-library/pull/1105) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add diagnostics hint and expose diagnostics API ([PR #1067](https://github.com/azure/communication-ui-library/pull/1067) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix manual conversions of userID ([PR #1038](https://github.com/azure/communication-ui-library/pull/1038) by 82062616+prprabhu-ms@users.noreply.github.com)
- Mark StatefulCallClient `diagnostics` property as public and `transfer` property as beta ([PR #1072](https://github.com/azure/communication-ui-library/pull/1072) by 2684369+JamesBurnside@users.noreply.github.com)
- Generalize state.userId type ([PR #1039](https://github.com/azure/communication-ui-library/pull/1039) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.7](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0-beta.7)

Wed, 27 Oct 2021 19:40:46 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0-beta.6..@internal/calling-stateful-client_v1.0.0-beta.7)

### Changes

- Use objects for call history in state ([PR #886](https://github.com/azure/communication-ui-library/pull/886) by 82062616+prprabhu-ms@users.noreply.github.com)
- Replace CommunicationUserKind with CommunicationUserIdentifier in constructor ([PR #884](https://github.com/azure/communication-ui-library/pull/884) by 82062616+prprabhu-ms@users.noreply.github.com)
- bump calling sdk to 1.2.3-beta.1 ([PR #967](https://github.com/azure/communication-ui-library/pull/967) by miguelgamis@microsoft.com)
- Api changes according to reviews from ARB ([PR #859](https://github.com/azure/communication-ui-library/pull/859) by jinan@microsoft.com)
- Fix browser camera indicator still showing in use after turning it off ([PR #949](https://github.com/azure/communication-ui-library/pull/949) by 2684369+JamesBurnside@users.noreply.github.com)
- Update message type ([PR #958](https://github.com/azure/communication-ui-library/pull/958) by jinan@microsoft.com)
- Rename `Error.inner` to `Error.innerError` ([PR #882](https://github.com/azure/communication-ui-library/pull/882) by 82062616+prprabhu-ms@users.noreply.github.com)
- updating calling to use 1.2.2-beta.1 ([PR #945](https://github.com/azure/communication-ui-library/pull/945) by miguelgamis@microsoft.com)

## [1.0.0-beta.6](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0-beta.6)

Tue, 28 Sep 2021 19:19:18 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0-beta.5..@internal/calling-stateful-client_v1.0.0-beta.6)

### Changes

- Drop state modification API ([PR #782](https://github.com/azure/communication-ui-library/pull/782) by 82062616+prprabhu-ms@users.noreply.github.com)
- Stop clearing errors from calling stateful client ([PR #781](https://github.com/azure/communication-ui-library/pull/781) by 82062616+prprabhu-ms@users.noreply.github.com)
- Document all public API and hide leaked exports ([PR #811](https://github.com/azure/communication-ui-library/pull/811) by 82062616+prprabhu-ms@users.noreply.github.com)
- Fix feature types to conform to naming convention ([PR #832](https://github.com/azure/communication-ui-library/pull/832) by 82062616+prprabhu-ms@users.noreply.github.com)
- Centralize beachball config ([PR #773](https://github.com/azure/communication-ui-library/pull/773) by 82062616+prprabhu-ms@users.noreply.github.com)

## [1.0.0-beta.5](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0-beta.5)

Mon, 13 Sep 2021 21:02:16 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0-beta.4..@internal/calling-stateful-client_v1.0.0-beta.5)

### Changes

- Add methods to clear calling ACS errors ([PR #685](https://github.com/azure/communication-ui-library/pull/685) by 82062616+prprabhu-ms@users.noreply.github.com)
- Adjust most comments in internal api review ([PR #724](https://github.com/azure/communication-ui-library/pull/724) by jinan@microsoft.com)
- Bump acs-ui-common dep ([PR #732](https://github.com/azure/communication-ui-library/pull/732) by 82062616+prprabhu-ms@users.noreply.github.com)
- updating calling to use 1.2.1-beta.1 ([PR #758](https://github.com/azure/communication-ui-library/pull/758) by 79329532+alkwa-msft@users.noreply.github.com)
- Add call diagnostics to stateful client ([PR #749](https://github.com/azure/communication-ui-library/pull/749) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add timestamp to teed errors ([PR #753](https://github.com/azure/communication-ui-library/pull/753) by 82062616+prprabhu-ms@users.noreply.github.com)
- updating immer to 9.0.6 ([PR #764](https://github.com/azure/communication-ui-library/pull/764) by 79329532+alkwa-msft@users.noreply.github.com)
- Tee errors to CallClientState ([PR #680](https://github.com/azure/communication-ui-library/pull/680) by 82062616+prprabhu-ms@users.noreply.github.com)
- Add Dominant Speaker support to Video Gallery ([PR #742](https://github.com/azure/communication-ui-library/pull/742) by anjulgarg@live.com)

## [1.0.0-beta.4](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0-beta.4)

Mon, 16 Aug 2021 21:18:19 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/@internal/calling-stateful-client_v1.0.0-beta.3..@internal/calling-stateful-client_v1.0.0-beta.4)

### Changes

- updated Typescript to version 4.3.5 ([PR #645](https://github.com/azure/communication-ui-library/pull/645) by alcail@microsoft.com)
- Fix tsdoc comments - rename @Link -> @link ([PR #660](https://github.com/azure/communication-ui-library/pull/660) by 2684369+JamesBurnside@users.noreply.github.com)

## [1.0.0-beta.3](https://github.com/azure/communication-ui-library/tree/@internal/calling-stateful-client_v1.0.0-beta.3)

Thu, 22 Jul 2021 17:42:41 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/calling-stateful-client_v1.0.0-beta.2..@internal/calling-stateful-client_v1.0.0-beta.3)

### Changes

- Bump prettier version and reformat ([PR #535](https://github.com/azure/communication-ui-library/pull/535) by prprabhu@microsoft.com)

## [1.0.0-beta.2](https://github.com/azure/communication-ui-library/tree/calling-stateful-client_v1.0.0-beta.2)

Fri, 09 Jul 2021 20:41:33 GMT 
[Compare changes](https://github.com/azure/communication-ui-library/compare/calling-stateful-client_v1.0.0-beta.1..calling-stateful-client_v1.0.0-beta.2)

### Changes

- Use objects for remote participants and video streams ([PR #460](https://github.com/azure/communication-ui-library/pull/460) by prprabhu@microsoft.com)
- upgrading version of calling sdk to 1.1.0-beta.2 ([PR #493](https://github.com/azure/communication-ui-library/pull/493) by alkwa@microsoft.com)
- Replace maps with objects in CallClientState ([PR #459](https://github.com/azure/communication-ui-library/pull/459) by prprabhu@microsoft.com)
- Clean up and update tsdoc ([PR #365](https://github.com/azure/communication-ui-library/pull/365) by allenhwang@microsoft.com)
- Store userId as CommunicationUserKind ([PR #423](https://github.com/azure/communication-ui-library/pull/423) by prprabhu@microsoft.com)
- Fix maxListener warnings ([PR #426](https://github.com/azure/communication-ui-library/pull/426) by jinan@microsoft.com)
- Fix issue where state change is not triggered for some arrays ([PR #358](https://github.com/azure/communication-ui-library/pull/358) by allenhwang@microsoft.com)
- Fix stateful client selected camera assignment. ([PR #501](https://github.com/azure/communication-ui-library/pull/501) by miguelgamis@microsoft.com)
- Bump up max listeners limit ([PR #360](https://github.com/azure/communication-ui-library/pull/360) by allenhwang@microsoft.com)
- Deduplicating audio and video devices from SDK ([PR #439](https://github.com/azure/communication-ui-library/pull/439) by miguelgamis@microsoft.com)
- Fixed initial value selectedCamera when permissions have been granted. ([PR #491](https://github.com/azure/communication-ui-library/pull/491) by miguelgamis@microsoft.com)
- Fixing LocalPreview Toggle bug ([PR #367](https://github.com/azure/communication-ui-library/pull/367) by anjulgarg@live.com)
- Use CommunicationIdentifierKind in stream utils ([PR #394](https://github.com/azure/communication-ui-library/pull/394) by allenhwang@microsoft.com)
- Update calling sdk to 1.1.0-beta1 ([PR #404](https://github.com/azure/communication-ui-library/pull/404) by jinan@microsoft.com)
- Use Array for unparentedViews ([PR #469](https://github.com/azure/communication-ui-library/pull/469) by prprabhu@microsoft.com)
- Make max listeners configurable ([PR #393](https://github.com/azure/communication-ui-library/pull/393) by allenhwang@microsoft.com)
- Bump prettier version and reformat ([PR #505](https://github.com/azure/communication-ui-library/pull/505) by prprabhu@microsoft.com)
- Breaking: Make arguments to CreateStatefulCallClient optional ([PR #414](https://github.com/azure/communication-ui-library/pull/414) by prprabhu@microsoft.com)

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
