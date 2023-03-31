// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import { _isInCall, _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import {
  _ComplianceBanner,
  _ComplianceBannerProps,
  _useContainerHeight,
  _useContainerWidth,
  ErrorBar,
  ErrorBarProps,
  useTheme
} from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '@internal/react-components';
import React, { useMemo, useRef, useState } from 'react';
import { useCallback } from 'react';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { containerDivStyles } from '../../common/ContainerRectProps';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { compositeMinWidthRem } from '../../common/styles/Composite.styles';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallControls, CallControlsProps } from '../components/CallControls';
import { CommonCallControlBar } from '../../common/ControlBar/CommonCallControlBar';
import { useSidePaneState } from '../hooks/useSidePaneState';
import {
  callArrangementContainerStyles,
  callControlsContainerStyles,
  notificationsContainerStyles,
  containerStyleDesktop,
  containerStyleMobile,
  mediaGalleryContainerStyles,
  galleryParentContainerStyles,
  bannerNotificationStyles
} from '../styles/CallPage.styles';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { CommonCallControlOptions } from '../../common/types/CommonCallControlOptions';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { CallPane } from './CallPane';
import { MutedNotification, MutedNotificationProps } from './MutedNotification';
import { CallAdapter } from '../adapter';
import { useSelector } from '../hooks/useSelector';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { CallControlOptions } from '../types/CallControlOptions';
import { PreparedMoreDrawer } from '../../common/Drawer/PreparedMoreDrawer';
/* @conditional-compile-remove(PSTN-calls) */
import { SendDtmfDialpad } from '../../common/SendDtmfDialpad';
/* @conditional-compile-remove(PSTN-calls) */
import { useCallWithChatCompositeStrings } from '../../CallWithChatComposite/hooks/useCallWithChatCompositeStrings';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { getPage } from '../selectors/baseSelectors';
import { drawerContainerStyles } from '../styles/CallComposite.styles';

/**
 * @private
 */
export interface CallArrangementProps {
  id?: string;
  complianceBannerProps: _ComplianceBannerProps;
  errorBarProps: ErrorBarProps | false;
  mutedNotificationProps?: MutedNotificationProps;
  callControlProps: CallControlsProps;
  onRenderGalleryContent: () => JSX.Element;
  dataUiId: string;
  mobileView: boolean;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  modalLayerHostId: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
}

/**
 * @private
 */
export const CallArrangement = (props: CallArrangementProps): JSX.Element => {
  const containerClassName = useMemo(() => {
    return props.mobileView ? containerStyleMobile : containerStyleDesktop;
  }, [props.mobileView]);

  const theme = useTheme();
  const callGalleryStyles = useMemo(
    () => galleryParentContainerStyles(theme.palette.neutralLighterAlt),
    [theme.palette.neutralLighterAlt]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);

  const isInLobby = _isInLobbyOrConnecting(useSelector(callStatusSelector).callStatus);

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const isInLocalHold = useSelector(getPage) === 'hold';

  const adapter = useAdapter();

  const {
    activePane,
    closePane,
    /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
    openPeoplePane,
    togglePeoplePane
  } = useSidePaneState();

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  const isMobileWithActivePane = props.mobileView && activePane;

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  const callCompositeContainerCSS = useMemo(() => {
    return {
      display: isMobileWithActivePane ? 'none' : 'flex',
      minWidth: props.mobileView ? 'unset' : `${compositeMinWidthRem}rem`,
      width: '100%',
      height: '100%'
    };
  }, [isMobileWithActivePane, props.mobileView]);

  /* @conditional-compile-remove(PSTN-calls) */
  const callWithChatStrings = useCallWithChatCompositeStrings();

  /* @conditional-compile-remove(PSTN-calls) */
  const dialpadStrings = useMemo(
    () => ({
      dialpadModalAriaLabel: callWithChatStrings.dialpadModalAriaLabel,
      dialpadCloseModalButtonAriaLabel: callWithChatStrings.dialpadCloseModalButtonAriaLabel,
      placeholderText: callWithChatStrings.dtmfDialpadPlaceholderText
    }),
    [callWithChatStrings]
  );

  const [showDrawer, setShowDrawer] = useState(false);
  const onMoreButtonClicked = useCallback(() => {
    closePane();
    setShowDrawer(true);
  }, [closePane]);
  const closeDrawer = useCallback(() => {
    setShowDrawer(false);
  }, []);
  const onMoreDrawerPeopleClicked = useCallback(() => {
    setShowDrawer(false);
    togglePeoplePane();
  }, [togglePeoplePane]);

  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = useAdapter().getState().alternateCallerId;

  /* @conditional-compile-remove(PSTN-calls) */
  const [showDtmfDialpad, setShowDtmfDialpad] = useState(false);

  /* @conditional-compile-remove(PSTN-calls) */
  const onDismissDtmfDialpad = (): void => {
    setShowDtmfDialpad(false);
  };

  /* @conditional-compile-remove(PSTN-calls) */
  const onClickShowDialpad = (): void => {
    setShowDtmfDialpad(true);
  };

  const drawerContainerStylesValue = useMemo(() => drawerContainerStyles(10), []);

  // To be removed once feature is out of beta, replace with callCompositeContainerCSS
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const callCompositeContainerFlex = () => {
    /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
    return callCompositeContainerCSS;
    return { display: 'flex', width: '100%', height: '100%' };
  };

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  const callPaneContent = useCallback((): JSX.Element => {
    if (adapter && activePane === 'people') {
      return (
        <CallPane
          callAdapter={adapter}
          onClose={closePane}
          onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={props.callControlProps?.onFetchParticipantMenuItems}
          onPeopleButtonClicked={
            showShowPeopleTabHeaderButton(props.callControlProps.options) ? openPeoplePane : undefined
          }
          callControls={
            typeof props.callControlProps.options !== 'boolean' ? props.callControlProps.options : undefined
          }
          modalLayerHostId={props.modalLayerHostId}
          activePane={activePane}
          mobileView={props.mobileView}
          inviteLink={props.callControlProps.callInvitationURL}
        />
      );
    }
    return <></>;
  }, [
    activePane,
    adapter,
    closePane,
    props.callControlProps.callInvitationURL,
    props.callControlProps?.onFetchParticipantMenuItems,
    props.callControlProps.options,
    props.mobileView,
    props.modalLayerHostId,
    props.onFetchAvatarPersonaData,
    openPeoplePane
  ]);

  /* @conditional-compile-remove(rooms) */
  const rolePermissions = _usePermissions();

  let canUnmute = true;
  /* @conditional-compile-remove(rooms) */
  canUnmute = rolePermissions.microphoneButton;

  let errorBarProps = props.errorBarProps;

  /* @conditional-compile-remove(rooms) */
  // TODO: move this logic to the error bar selector once role is plumbed from the headless SDK
  if (!rolePermissions.cameraButton && props.errorBarProps) {
    errorBarProps = {
      ...props.errorBarProps,
      activeErrorMessages: props.errorBarProps.activeErrorMessages.filter(
        (e) => e.type !== 'callCameraAccessDenied' && e.type !== 'callCameraAccessDeniedSafari'
      )
    };
  }

  return (
    <div ref={containerRef} className={mergeStyles(containerDivStyles)} id={props.id}>
      <Stack verticalFill horizontalAlign="stretch" className={containerClassName} data-ui-id={props.dataUiId}>
        <Stack grow styles={callArrangementContainerStyles}>
          {props.callControlProps?.options !== false &&
            /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
            !isMobileWithActivePane && (
              <Stack.Item className={callControlsContainerStyles}>
                {isLegacyCallControlEnabled(props.callControlProps?.options) ? (
                  <CallControls
                    {...props.callControlProps}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                    isMobile={props.mobileView}
                    /* @conditional-compile-remove(one-to-n-calling) */
                    peopleButtonChecked={activePane === 'people'}
                    /* @conditional-compile-remove(one-to-n-calling) */
                    onPeopleButtonClicked={togglePeoplePane}
                  />
                ) : (
                  <CommonCallControlBar
                    {...props.callControlProps}
                    callAdapter={adapter as CallAdapter}
                    mobileView={props.mobileView}
                    disableButtonsForLobbyPage={isInLobby}
                    peopleButtonChecked={activePane === 'people'}
                    onPeopleButtonClicked={togglePeoplePane}
                    onMoreButtonClicked={onMoreButtonClicked}
                  />
                )}
              </Stack.Item>
            )}

          {props.callControlProps?.options !== false && showDrawer && (
            <Stack styles={drawerContainerStylesValue}>
              <PreparedMoreDrawer
                callControls={props.callControlProps.options}
                onLightDismiss={closeDrawer}
                onPeopleButtonClicked={onMoreDrawerPeopleClicked}
                /* @conditional-compile-remove(PSTN-calls) */
                onClickShowDialpad={alternateCallerId ? onClickShowDialpad : undefined}
                /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                disableButtonsForHoldScreen={isInLocalHold}
              />
            </Stack>
          )}

          {
            /* @conditional-compile-remove(PSTN-calls) */
            props.callControlProps?.options !== false && showDtmfDialpad && (
              <Stack styles={drawerContainerStylesValue}>
                <SendDtmfDialpad
                  isMobile={props.mobileView}
                  strings={dialpadStrings}
                  showDialpad={showDtmfDialpad}
                  onDismissDialpad={onDismissDtmfDialpad}
                />
              </Stack>
            )
          }
          <Stack horizontal grow>
            <Stack.Item grow style={callCompositeContainerFlex()}>
              <Stack.Item styles={callGalleryStyles} grow>
                <Stack verticalFill styles={mediaGalleryContainerStyles}>
                  <Stack.Item styles={notificationsContainerStyles}>
                    <Stack styles={bannerNotificationStyles}>
                      <_ComplianceBanner {...props.complianceBannerProps} />
                    </Stack>
                    {errorBarProps !== false && (
                      <Stack styles={bannerNotificationStyles}>
                        <ErrorBar {...errorBarProps} />
                      </Stack>
                    )}
                    {canUnmute && !!props.mutedNotificationProps && (
                      <MutedNotification {...props.mutedNotificationProps} />
                    )}
                  </Stack.Item>
                  {props.onRenderGalleryContent && props.onRenderGalleryContent()}
                </Stack>
              </Stack.Item>
            </Stack.Item>
            {
              /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
              callPaneContent()
            }
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
const showShowPeopleTabHeaderButton = (callControls?: boolean | CommonCallControlOptions): boolean => {
  if (callControls === undefined || callControls === true) {
    return true;
  }
  if (callControls === false) {
    return false;
  }
  return callControls.participantsButton !== false;
};

const isLegacyCallControlEnabled = (options?: boolean | CallControlOptions): boolean => {
  /* @conditional-compile-remove(new-call-control-bar) */
  return !!options && options !== true && !!options?.legacyControlBarExperience;
  return true;
};
