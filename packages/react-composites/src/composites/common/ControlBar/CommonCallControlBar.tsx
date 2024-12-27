// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  RefObject
} from 'react';
import { CallAdapterProvider } from '../../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../../CallComposite';
import { PeopleButton } from './PeopleButton';
import {
  concatStyleSets,
  IButton,
  IStyle,
  ITheme,
  mergeStyles,
  mergeStyleSets,
  Stack,
  useTheme
} from '@fluentui/react';
/* @conditional-compile-remove(breakout-rooms) */
import { PrimaryButton } from '@fluentui/react';
import { controlBarContainerStyles } from '../../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../../CallComposite/styles/CallPage.styles';
import { useCallWithChatCompositeStrings } from '../../CallWithChatComposite/hooks/useCallWithChatCompositeStrings';
import { BaseCustomStyles, ControlBarButtonStyles } from '@internal/react-components';
/* @conditional-compile-remove(rtt) */
import { RTTModal, StartRealTimeTextButton } from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
import { ControlBar } from '@internal/react-components';
import { Microphone } from '../../CallComposite/components/buttons/Microphone';
import { Camera } from '../../CallComposite/components/buttons/Camera';
import { ScreenShare } from '../../CallComposite/components/buttons/ScreenShare';
import { EndCall } from '../../CallComposite/components/buttons/EndCall';
import { MoreButton } from '../MoreButton';
import { ContainerRectProps } from '../ContainerRectProps';
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallControlBarButton,
  onFetchCustomButtonPropsTrampoline
} from './CustomButton';
import { DesktopMoreButton } from './DesktopMoreButton';
import { isDisabled, _isSafari } from '../../CallComposite/utils';
import { HiddenFocusStartPoint } from '../HiddenFocusStartPoint';
import { CallWithChatControlOptions } from '../../CallWithChatComposite';
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';
import { CallingCaptionsSettingsModal } from '../CallingCaptionsSettingsModal';
import { RaiseHand } from '../../CallComposite/components/buttons/RaiseHand';
import { Reaction } from '../../CallComposite/components/buttons/Reaction';
import { useSelector } from '../../CallComposite/hooks/useSelector';
import { capabilitySelector } from '../../CallComposite/selectors/capabilitySelector';
import { DtmfDialpadButton } from './DtmfDialerButton';
import { ExitSpotlightButton } from '../ExitSpotlightButton';
import { useLocale } from '../../localization';
import { isBoolean } from '../utils';
import { getEnvironmentInfo } from '../../CallComposite/selectors/baseSelectors';
import { getIsTeamsCall } from '../../CallComposite/selectors/baseSelectors';
/* @conditional-compile-remove(breakout-rooms) */
import { getAssignedBreakoutRoom, getBreakoutRoomSettings } from '../../CallComposite/selectors/baseSelectors';
import { callStatusSelector } from '../../CallComposite/selectors/callStatusSelector';
import { MeetingConferencePhoneInfoModal } from '@internal/react-components';
/* @conditional-compile-remove(breakout-rooms) */
import { Timer } from './Timer';
import { FocusableElement } from '../types/FocusableElement';
/* @conditional-compile-remove(rtt) */
import { usePropsFor } from '../../CallComposite/hooks/usePropsFor';

/**
 * @private
 */
export interface CommonCallControlBarProps {
  callAdapter: CallAdapter;
  peopleButtonChecked: boolean;
  onPeopleButtonClicked: () => void;
  onMoreButtonClicked?: () => void;
  mobileView: boolean;
  disableButtonsForLobbyPage: boolean;
  callControls?: boolean | CommonCallControlOptions | CallWithChatControlOptions;
  disableButtonsForHoldScreen?: boolean;
  onClickShowDialpad?: () => void;
  onClickVideoEffects?: (showVideoEffects: boolean) => void;
  isCaptionsSupported?: boolean;
  isRealTimeTextSupported?: boolean;
  isCaptionsOn?: boolean;
  displayVertical?: boolean;
  onUserSetOverflowGalleryPositionChange?: (position: 'Responsive' | 'horizontalTop') => void;
  onUserSetGalleryLayout?: (layout: VideoGalleryLayout) => void;
  userSetGalleryLayout?: VideoGalleryLayout;
  peopleButtonRef?: RefObject<IButton>;
  cameraButtonRef?: RefObject<IButton>;
  videoBackgroundPickerRef?: RefObject<IButton>;
  onSetDialpadPage?: () => void;
  dtmfDialerPresent?: boolean;
  onStopLocalSpotlight?: () => void;
  useTeamsCaptions?: boolean;
  onToggleTeamsMeetingConferenceModal?: () => void;
  teamsMeetingConferenceModalPresent?: boolean;
  sidePaneDismissButtonRef?: RefObject<IButton>;
}

const inferCommonCallControlOptions = (
  mobileView: boolean,
  commonCallControlOptions?: boolean | CallWithChatControlOptions
): CallWithChatControlOptions | false => {
  if (commonCallControlOptions === false) {
    return false;
  }

  const options =
    commonCallControlOptions === true || commonCallControlOptions === undefined ? {} : commonCallControlOptions;
  if (mobileView) {
    // Set to compressed mode when composite is optimized for mobile
    options.displayType = 'compact';
    // Set options to always not show screen share button for mobile
    options.screenShareButton = false;
  }
  return options;
};

type CommonCallControlBarMergedProps = CommonCallControlBarProps & ContainerRectProps;

/**
 * @private
 */
export const CommonCallControlBar = forwardRef<FocusableElement, CommonCallControlBarMergedProps>(
  (props, commonCallControlBarRef): JSX.Element => {
    const theme = useTheme();
    const rtl = theme.rtl;

    // Create an imperatively callable focus function to allow the parent component to focus the control bar any time.
    const [hiddenFocusStartElementKey, setHiddenFocusStartElementKey] = useState(0);
    useImperativeHandle<FocusableElement, FocusableElement>(commonCallControlBarRef, () => ({
      focus: () => {
        // To move focus to the hidden element, we increment the key to force a re-mount of the HiddenFocusStartPoint component
        // which relies on focusOnMount to move focus to the next interact-able element.
        setHiddenFocusStartElementKey((prevKey) => prevKey + 1);
      }
    }));

    const controlBarContainerRef = useRef<HTMLHeadingElement>(null);
    const sidepaneControlsRef = useRef<HTMLHeadingElement>(null);
    const controlBarSizeRef = useRef<HTMLHeadingElement>(null);

    const [controlBarButtonsWidth, setControlBarButtonsWidth] = useState(0);
    const [panelsButtonsWidth, setPanelsButtonsWidth] = useState(0);
    const [controlBarContainerWidth, setControlBarContainerWidth] = useState(0);

    const [totalButtonsWidth, setTotalButtonsWidth] = useState(0);
    const [isOutOfSpace, setIsOutOfSpace] = useState(false);

    const callWithChatStrings = useCallWithChatCompositeStrings();
    const options = inferCommonCallControlOptions(props.mobileView, props.callControls);

    const [showCaptionsSettingsModal, setShowCaptionsSettingsModal] = useState(false);
    /* @conditional-compile-remove(rtt) */
    const [showRealTimeTextModal, setShowRealTimeTextModal] = useState(false);
    /* @conditional-compile-remove(rtt) */
    const startRealTimeTextButtonProps = usePropsFor(StartRealTimeTextButton);

    // If the hangup capability is not present, we default to true
    const isHangUpForEveryoneAllowed =
      useSelector((state) => state.call?.capabilitiesFeature?.capabilities.hangUpForEveryOne.isPresent) ?? true;
    const isTeams = useSelector(getIsTeamsCall);

    /* @conditional-compile-remove(breakout-rooms) */
    const assignedBreakoutRoom = useSelector(getAssignedBreakoutRoom);
    /* @conditional-compile-remove(breakout-rooms) */
    const breakoutRoomSettings = useSelector(getBreakoutRoomSettings);

    const handleResize = useCallback((): void => {
      setControlBarButtonsWidth(controlBarContainerRef.current ? controlBarContainerRef.current.offsetWidth : 0);
      setPanelsButtonsWidth(sidepaneControlsRef.current ? sidepaneControlsRef.current.offsetWidth : 0);
      setControlBarContainerWidth(controlBarSizeRef.current ? controlBarSizeRef.current.offsetWidth : 0);
    }, []);

    // on load set inital width
    useEffect(() => {
      setControlBarButtonsWidth(controlBarContainerRef.current ? controlBarContainerRef.current.offsetWidth : 0);
      setPanelsButtonsWidth(sidepaneControlsRef.current ? sidepaneControlsRef.current.offsetWidth : 0);
      setControlBarContainerWidth(controlBarSizeRef.current ? controlBarSizeRef.current.offsetWidth : 0);
    }, []);

    // get the current width of control bar buttons and panel control buttons when browser size change
    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    /* when size change, reset total buttons width and compare with the control bar container width
  if the total width of those buttons exceed container width, do not center the control bar buttons based on parent container width
  Instead let them take up the remaining white space on the left */
    useEffect(() => {
      // white space on the left when control bar buttons are centered based on container width + control bar buttons width + panel control buttons width
      setTotalButtonsWidth(
        (controlBarContainerWidth - controlBarButtonsWidth) / 2 + controlBarButtonsWidth + panelsButtonsWidth
      );
    }, [controlBarButtonsWidth, panelsButtonsWidth, controlBarContainerWidth]);

    useEffect(() => {
      setIsOutOfSpace(totalButtonsWidth > controlBarContainerWidth);
    }, [totalButtonsWidth, controlBarContainerWidth]);

    const openCaptionsSettingsModal = useCallback((): void => {
      setShowCaptionsSettingsModal(true);
    }, []);
    /* @conditional-compile-remove(rtt) */
    const openRealTimeTextModal = useCallback((): void => {
      setShowRealTimeTextModal(true);
    }, []);
    /* @conditional-compile-remove(rtt) */
    const onDismissRealTimeTextModal = useCallback((): void => {
      setShowRealTimeTextModal(false);
    }, []);

    const onDismissCaptionsSettings = useCallback((): void => {
      setShowCaptionsSettingsModal(false);
    }, []);

    const peopleButtonStrings = useMemo(
      () => ({
        label: callWithChatStrings.peopleButtonLabel,
        selectedLabel: callWithChatStrings.selectedPeopleButtonLabel,
        tooltipOpenAriaLabel: callWithChatStrings.peopleButtonTooltipOpenAriaLabel,
        tooltipCloseAriaLabel: callWithChatStrings.peopleButtonTooltipCloseAriaLabel,
        tooltipOffContent: callWithChatStrings.peopleButtonTooltipOpen,
        tooltipOnContent: callWithChatStrings.peopleButtonTooltipClose
      }),
      [callWithChatStrings]
    );
    const moreButtonStrings = useMemo(
      () => ({
        label: callWithChatStrings.moreDrawerButtonLabel,
        tooltipContent: callWithChatStrings.moreDrawerButtonTooltip
      }),
      [callWithChatStrings]
    );
    const callStrings = useLocale().strings.call;
    const exitSpotlightButtonStrings = useMemo(
      () => ({
        label: callStrings.exitSpotlightButtonLabel,
        tooltipContent: callStrings.exitSpotlightButtonTooltip
      }),
      [callStrings]
    );

    const [isDeepNoiseSuppressionOn, setDeepNoiseSuppressionOn] = useState<boolean>(false);

    const startDeepNoiseSuppression = useCallback(async () => {
      await props.callAdapter.startNoiseSuppressionEffect();
    }, [props.callAdapter]);

    const environmentInfo = useSelector(getEnvironmentInfo);
    const isSafari = _isSafari(environmentInfo);

    useEffect(() => {
      if (
        props.callAdapter.getState().onResolveDeepNoiseSuppressionDependency &&
        props.callAdapter.getState().deepNoiseSuppressionOnByDefault
      ) {
        startDeepNoiseSuppression();
        setDeepNoiseSuppressionOn(true);
      }
    }, [props.callAdapter, startDeepNoiseSuppression]);

    const showNoiseSuppressionButton =
      props.callAdapter.getState().onResolveDeepNoiseSuppressionDependency &&
      !props.callAdapter.getState().hideDeepNoiseSuppressionButton &&
      !isSafari
        ? true
        : false;

    const onClickNoiseSuppression = useCallback(async () => {
      if (isDeepNoiseSuppressionOn) {
        await props.callAdapter.stopNoiseSuppressionEffect();
        setDeepNoiseSuppressionOn(false);
      } else {
        await props.callAdapter.startNoiseSuppressionEffect();
        setDeepNoiseSuppressionOn(true);
      }
    }, [props.callAdapter, isDeepNoiseSuppressionOn]);

    const centerContainerStyles = useMemo(() => {
      const styles: BaseCustomStyles = !props.mobileView ? desktopControlBarStyles : {};
      return mergeStyleSets(styles, {
        root: {
          // Enforce a background color on control bar to ensure it matches the composite background color.
          background: theme.semanticColors.bodyBackground
        }
      });
    }, [props.mobileView, theme.semanticColors.bodyBackground]);
    const screenShareButtonStyles = useMemo(
      () => (!props.mobileView ? getDesktopScreenShareButtonStyles(theme) : undefined),
      [props.mobileView, theme]
    );
    const commonButtonStyles = useMemo(
      () => (!props.mobileView ? getDesktopCommonButtonStyles(theme) : undefined),
      [props.mobileView, theme]
    );
    const endCallButtonStyles = useMemo(
      () => (!props.mobileView ? getDesktopEndCallButtonStyles(theme) : undefined),
      [props.mobileView, theme]
    );

    const controlBarWrapperDesktopStyles: IStyle = useMemo(
      // only center control bar buttons based on parent container if there are enough space on the screen and not mobile
      () => (!props.mobileView && !isOutOfSpace ? (rtl ? wrapperDesktopRtlStyles : wrapperDesktopStyles) : {}),
      [props.mobileView, rtl, isOutOfSpace]
    );

    // only center control bar buttons based on parent container if there are enough space on the screen and not mobile
    const controlBarDesktopContainerStyles: IStyle = useMemo(
      () =>
        !props.mobileView && !isOutOfSpace
          ? {
              position: 'relative',
              minHeight: '4.5rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '1rem'
            }
          : {},
      [props.mobileView, isOutOfSpace]
    );

    const customButtons = useMemo(
      () =>
        generateCustomCallControlBarButton(
          onFetchCustomButtonPropsTrampoline(options !== false ? options : undefined),
          options !== false ? options?.displayType : undefined
        ),
      [options]
    );

    const capabilitiesSelector = useSelector(capabilitySelector);
    const callState = useSelector(callStatusSelector);
    const isReactionAllowed =
      callState.callStatus !== 'Connected' ||
      !capabilitiesSelector?.capabilities ||
      capabilitiesSelector.capabilities.useReactions.isPresent;

    /* @conditional-compile-remove(breakout-rooms) */
    const canReturnToMainMeeting = breakoutRoomSettings && breakoutRoomSettings.disableReturnToMainMeeting === false;
    /* @conditional-compile-remove(breakout-rooms) */
    const returnFromBreakoutRoom = useCallback(() => props.callAdapter.returnFromBreakoutRoom(), [props.callAdapter]);

    // when options is false then we want to hide the whole control bar.
    if (options === false) {
      return <></>;
    }

    const sideButtonsPresent =
      isEnabled(options.peopleButton) || isEnabled(options.chatButton) || customButtons['secondary'] !== undefined;

    const screenShareButtonIsEnabled = isEnabled(options?.screenShareButton);

    const microphoneButtonIsEnabled = isEnabled(options?.microphoneButton);

    const cameraButtonIsEnabled = isEnabled(options?.cameraButton);

    const showExitSpotlightButton = options?.exitSpotlightButton !== false;

    const showCaptionsButton = props.isCaptionsSupported && isEnabled(options.captionsButton);
    /* @conditional-compile-remove(rtt) */
    const showRealTimeTextButton = props.isRealTimeTextSupported;

    const showTeamsMeetingPhoneCallButton = isEnabled(options?.teamsMeetingPhoneCallButton);

    const showDesktopMoreButton =
      isEnabled(options?.moreButton) &&
      (false ||
        isEnabled(options?.holdButton) ||
        showCaptionsButton ||
        props.onUserSetGalleryLayout ||
        /* @conditional-compile-remove(rtt) */ showRealTimeTextButton);

    const role = props.callAdapter.getState().call?.role;
    const hideRaiseHandButtonInRoomsCall =
      props.callAdapter.getState().isRoomsCall && role && ['Consumer', 'Unknown'].includes(role);
    const reactionResources = props.callAdapter.getState().reactions;

    return (
      <div ref={controlBarSizeRef}>
        <CallAdapterProvider adapter={props.callAdapter}>
          {showCaptionsSettingsModal && (
            <CallingCaptionsSettingsModal
              showCaptionsSettingsModal={showCaptionsSettingsModal}
              onDismissCaptionsSettings={onDismissCaptionsSettings}
              changeCaptionLanguage={props.isCaptionsOn && props.useTeamsCaptions}
            />
          )}
          {
            /* @conditional-compile-remove(rtt) */ showRealTimeTextModal && (
              <RTTModal
                showModal={showRealTimeTextModal}
                onDismissModal={onDismissRealTimeTextModal}
                onStartRTT={() => startRealTimeTextButtonProps?.onStartRealTimeText()}
              />
            )
          }
          {props.teamsMeetingConferenceModalPresent && (
            <MeetingConferencePhoneInfoModal
              conferencePhoneInfoList={props.callAdapter.getState().call?.meetingConference?.conferencePhones ?? []}
              showModal={props.teamsMeetingConferenceModalPresent}
              onDismissMeetingPhoneInfoSettings={props.onToggleTeamsMeetingConferenceModal}
            />
          )}
        </CallAdapterProvider>
        <Stack
          horizontal
          reversed={!props.mobileView && !isOutOfSpace}
          horizontalAlign="space-between"
          className={mergeStyles(
            callControlsContainerStyles,
            controlBarContainerStyles,
            controlBarDesktopContainerStyles
          )}
        >
          <Stack.Item grow className={mergeStyles(controlBarWrapperDesktopStyles)}>
            <CallAdapterProvider adapter={props.callAdapter}>
              <Stack horizontalAlign="center">
                {/*
              HiddenFocusStartPoint is a util component used when we can't ensure the initial element for first
              tab focus is at the top of dom tree. It moves the first-tab focus to the next interact-able element
              immediately after it in the dom tree.
              */}
                <HiddenFocusStartPoint key={hiddenFocusStartElementKey} />
                <Stack.Item>
                  {/*
                  Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
                  control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
                  set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
                  dockedBottom it has position absolute and would therefore float on top of the media gallery,
                  occluding some of its content.
                */}
                  <div ref={controlBarContainerRef}>
                    <ControlBar
                      layout={props.displayVertical ? 'vertical' : 'horizontal'}
                      styles={centerContainerStyles}
                    >
                      {
                        /* @conditional-compile-remove(breakout-rooms) */
                        !props.mobileView &&
                          assignedBreakoutRoom &&
                          assignedBreakoutRoom.state === 'open' &&
                          assignedBreakoutRoom.call && (
                            <PrimaryButton
                              text={callStrings.joinBreakoutRoomButtonLabel}
                              onClick={async (): Promise<void> => {
                                assignedBreakoutRoom.join();
                              }}
                              styles={commonButtonStyles}
                            />
                          )
                      }
                      {microphoneButtonIsEnabled && (
                        <Microphone
                          displayType={options.displayType}
                          styles={commonButtonStyles}
                          splitButtonsForDeviceSelection={!props.mobileView}
                          disabled={props.disableButtonsForHoldScreen || isDisabled(options.microphoneButton)}
                          disableTooltip={props.mobileView}
                          onClickNoiseSuppression={onClickNoiseSuppression}
                          isDeepNoiseSuppressionOn={isDeepNoiseSuppressionOn}
                          showNoiseSuppressionButton={showNoiseSuppressionButton}
                        />
                      )}
                      {cameraButtonIsEnabled && (
                        <Camera
                          displayType={options.displayType}
                          styles={commonButtonStyles}
                          splitButtonsForDeviceSelection={!props.mobileView}
                          disabled={props.disableButtonsForHoldScreen || isDisabled(options.cameraButton)}
                          onClickVideoEffects={props.onClickVideoEffects}
                          componentRef={props.cameraButtonRef}
                          disableTooltip={props.mobileView}
                        />
                      )}
                      {!props.mobileView &&
                        isReactionAllowed &&
                        isEnabled(options.reactionButton) &&
                        reactionResources && (
                          <Reaction
                            displayType={options.displayType}
                            styles={commonButtonStyles}
                            disabled={props.disableButtonsForHoldScreen}
                            reactionResource={reactionResources}
                          />
                        )}
                      {!props.mobileView && isEnabled(options.raiseHandButton) && !hideRaiseHandButtonInRoomsCall && (
                        <RaiseHand
                          displayType={options.displayType}
                          styles={commonButtonStyles}
                          disabled={props.disableButtonsForHoldScreen || isDisabled(options.microphoneButton)}
                        />
                      )}
                      {showDtmfDialerButton(options) && props.onSetDialpadPage !== undefined && (
                        <DtmfDialpadButton
                          styles={commonButtonStyles}
                          displayType={options.displayType}
                          onClick={() => {
                            if (props.onSetDialpadPage !== undefined) {
                              props.onSetDialpadPage();
                            }
                          }}
                        />
                      )}
                      {showExitSpotlightButton && props.onStopLocalSpotlight && (
                        <ExitSpotlightButton
                          displayType={options.displayType}
                          onClick={props.onStopLocalSpotlight}
                          styles={commonButtonStyles}
                          strings={exitSpotlightButtonStrings}
                        />
                      )}
                      {screenShareButtonIsEnabled && (
                        <ScreenShare
                          option={options.screenShareButton}
                          displayType={options.displayType}
                          styles={screenShareButtonStyles}
                          disabled={props.disableButtonsForHoldScreen || isDisabled(options.screenShareButton)}
                        />
                      )}
                      {customButtons['primary']
                        ?.slice(
                          0,
                          props.mobileView
                            ? CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_MOBILE_CUSTOM_BUTTONS
                            : CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_DESKTOP_CUSTOM_BUTTONS
                        )
                        .map((CustomButton, i) => {
                          return (
                            <CustomButton
                              key={`primary-custom-button-${i}`}
                              styles={commonButtonStyles}
                              showLabel={options.displayType !== 'compact'}
                              disableTooltip={props.mobileView}
                            />
                          );
                        })}
                      {props.mobileView && (
                        <MoreButton
                          data-ui-id="common-call-composite-more-button"
                          strings={moreButtonStrings}
                          onClick={props.onMoreButtonClicked}
                          disabled={props.disableButtonsForLobbyPage}
                          disableTooltip={props.mobileView}
                        />
                      )}
                      {!props.mobileView && showDesktopMoreButton && (
                        <DesktopMoreButton
                          disableButtonsForHoldScreen={props.disableButtonsForHoldScreen}
                          styles={commonButtonStyles}
                          onClickShowDialpad={props.onClickShowDialpad}
                          callControls={props.callControls}
                          isCaptionsSupported={showCaptionsButton}
                          /* @conditional-compile-remove(rtt) */
                          isRealTimeTextSupported={showRealTimeTextButton}
                          onCaptionsSettingsClick={openCaptionsSettingsModal}
                          /* @conditional-compile-remove(rtt) */
                          onStartRealTimeTextClick={openRealTimeTextModal}
                          onUserSetOverflowGalleryPositionChange={props.onUserSetOverflowGalleryPositionChange}
                          onUserSetGalleryLayout={props.onUserSetGalleryLayout}
                          userSetGalleryLayout={props.userSetGalleryLayout}
                          dtmfDialerPresent={props.dtmfDialerPresent}
                          onSetDialpadPage={props.onSetDialpadPage}
                          teamsMeetingPhoneCallEnable={showTeamsMeetingPhoneCallButton}
                          onMeetingPhoneInfoClick={props.onToggleTeamsMeetingConferenceModal}
                        />
                      )}
                      <EndCall
                        displayType="compact"
                        mobileView={props.mobileView}
                        styles={endCallButtonStyles}
                        enableEndCallMenu={
                          !isBoolean(props.callControls) &&
                          !isBoolean(props.callControls?.endCallButton) &&
                          !props.mobileView &&
                          isHangUpForEveryoneAllowed &&
                          !isTeams && // Temporary disable it for Teams call, since capability does not give the right value
                          props.callControls?.endCallButton?.hangUpForEveryone === 'endCallOptions' &&
                          // Only show the end call menu when the call is connected, user should not be able to end the call for everyone
                          // when they are not actively in the call to communicate they will.
                          callState.callStatus === 'Connected' &&
                          /* @conditional-compile-remove(breakout-rooms) */
                          !canReturnToMainMeeting
                        }
                        disableEndCallModal={
                          !isBoolean(props.callControls) &&
                          !isBoolean(props.callControls?.endCallButton) &&
                          props.callControls?.endCallButton?.disableEndCallModal
                        }
                        /* @conditional-compile-remove(breakout-rooms) */
                        returnFromBreakoutRoom={canReturnToMainMeeting ? returnFromBreakoutRoom : undefined}
                      />
                    </ControlBar>
                  </div>
                </Stack.Item>
              </Stack>
            </CallAdapterProvider>
          </Stack.Item>
          {!props.mobileView && sideButtonsPresent && (
            <Stack.Item>
              <div ref={sidepaneControlsRef}>
                <Stack horizontal className={!props.mobileView ? mergeStyles(desktopButtonContainerStyle) : undefined}>
                  {isEnabled(options?.peopleButton) && (
                    <PeopleButton
                      checked={props.peopleButtonChecked}
                      ariaLabel={peopleButtonStrings.label}
                      showLabel={options.displayType !== 'compact'}
                      onClick={props.onPeopleButtonClicked}
                      data-ui-id="common-call-composite-people-button"
                      disabled={
                        props.disableButtonsForLobbyPage ||
                        props.disableButtonsForHoldScreen ||
                        isDisabled(options.peopleButton)
                      }
                      strings={peopleButtonStrings}
                      styles={commonButtonStyles}
                      componentRef={props.peopleButtonRef}
                      chatButtonPresent={isEnabled(options.chatButton)}
                      peoplePaneDismissButtonRef={props.sidePaneDismissButtonRef}
                    />
                  )}
                  {customButtons['secondary']
                    ?.slice(0, CUSTOM_BUTTON_OPTIONS.MAX_SECONDARY_DESKTOP_CUSTOM_BUTTONS)
                    .map((CustomButton, i) => {
                      return (
                        <CustomButton
                          key={`secondary-custom-button-${i}`}
                          styles={commonButtonStyles}
                          showLabel={options.displayType !== 'compact'}
                        />
                      );
                    })}
                </Stack>
              </div>
            </Stack.Item>
          )}
          {
            /* @conditional-compile-remove(breakout-rooms) */
            breakoutRoomSettings?.roomEndTime && !props.mobileView && !isOutOfSpace && (
              <Stack.Item>
                <Timer timeStampInfo={breakoutRoomSettings?.roomEndTime.toString()} />
              </Stack.Item>
            )
          }
        </Stack>
      </div>
    );
  }
);

const desktopButtonContainerStyle: IStyle = {
  padding: '0.75rem',
  columnGap: '0.5rem'
};

const desktopControlBarStyles: BaseCustomStyles = {
  root: desktopButtonContainerStyle
};

{
  /*
    Styling here to ensure the control bar buttons stay in the center of the parent component (control Container) regardless of its siblings
    Need to add 'reversed' to parent container because the styling here reverse the position of the two stack items 
  */
}
const wrapperDesktopStyles: IStyle = {
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, 0)'
};

const wrapperDesktopRtlStyles: IStyle = {
  position: 'absolute',
  right: '50%',
  transform: 'translate(-50%, 0)'
};

/** @private */
export const getDesktopCommonButtonStyles = (theme: ITheme): ControlBarButtonStyles => ({
  root: {
    border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: theme.effects.roundedCorner4,
    minHeight: '2.5rem',
    maxWidth: '12rem' // allot extra space than the regular ControlBarButton. This is to give extra room to have the icon beside the text.
  },
  flexContainer: {
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  textContainer: {
    // Override the default so that label doesn't introduce a new block.
    display: 'inline',

    // Ensure width is set to permit child to show ellipsis when there is a label that is too long
    maxWidth: '100%'
  },
  label: {
    fontSize: theme.fonts.medium.fontSize,

    // Ensure there is enough space between the icon and text to allow for the unread messages badge in the chat button
    marginLeft: '0.625rem',

    // Ensure letters that go above and below the standard text line like 'g', 'y', 'j' are not clipped
    lineHeight: '1.5rem',

    // Do not allow very long button texts to ruin the control bar experience, instead ensure long text is truncated and shows ellipsis
    display: 'block',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  splitButtonMenuButton: {
    border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
    borderTopRightRadius: theme.effects.roundedCorner4,
    borderBottomRightRadius: theme.effects.roundedCorner4,
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0'
  },
  splitButtonMenuButtonChecked: {
    // Default colors the menu half similarly for :hover and when button is checked.
    // To align with how the left-half is styled, override the checked style.
    background: 'none'
  }
});

const getDesktopScreenShareButtonStyles = (theme: ITheme): ControlBarButtonStyles => {
  const overrideStyles = {
    border: 'none',
    background: theme.palette.themePrimary,
    color: theme.palette.white,
    '* > svg': { fill: theme.palette.white },
    '@media (forced-colors: active)': {
      border: '1px solid',
      borderColor: theme.palette.black
    }
  };
  const overrides: ControlBarButtonStyles = {
    rootChecked: overrideStyles,
    rootCheckedHovered: overrideStyles
  };
  return concatStyleSets(getDesktopCommonButtonStyles(theme), overrides);
};

const getDesktopEndCallButtonStyles = (theme: ITheme): ControlBarButtonStyles => {
  const overrides: ControlBarButtonStyles = {
    root: {
      // Suppress border around the dark-red button.
      border: 'none'
    },
    rootFocused: {
      '@media (forced-colors: active)': {
        background: 'highlight',
        color: 'highlightText',
        borderColor: theme.palette.black,
        borderRadius: 'unset',
        outline: `3px solid ${theme.palette.black}`
      }
    },
    icon: {
      '@media (forced-colors: active)': {
        ':focused': {
          color: theme.palette.white
        }
      }
    }
  };
  return concatStyleSets(getDesktopCommonButtonStyles(theme), overrides);
};

const isEnabled = (option: unknown): boolean => option !== false;

const showDtmfDialerButton = (options: CommonCallControlOptions | CallWithChatControlOptions): boolean => {
  if (options.moreButton === false && options.dtmfDialerButton !== false) {
    return true;
  } else {
    return false;
  }
};
