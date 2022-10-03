// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import { _isInCall } from '@internal/calling-component-bindings';
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
import React, { useMemo, useRef } from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { useCallback } from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { containerDivStyles } from '../../common/ContainerRectProps';
/* @conditional-compile-remove(one-to-n-calling) */
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallControls, CallControlsProps } from '../components/CallControls';
/* @conditional-compile-remove(one-to-n-calling) */
import { useSidePaneState } from '../hooks/useSidePaneState';
import {
  callControlsContainerStyles,
  notificationsContainerStyles,
  containerStyleDesktop,
  containerStyleMobile,
  mediaGalleryContainerStyles,
  galleryParentContainerStyles,
  bannerNotificationStyles
} from '../styles/CallPage.styles';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallControlOptions } from '../types/CallControlOptions';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallPane } from './CallPane';
import { MutedNotification, MutedNotificationProps } from './MutedNotification';

/**
 * @private
 */
export interface CallArrangementProps {
  complianceBannerProps: _ComplianceBannerProps;
  errorBarProps: ErrorBarProps | false;
  mutedNotificationProps?: MutedNotificationProps;
  callControlProps: CallControlsProps;
  onRenderGalleryContent: () => JSX.Element;
  dataUiId: string;
  mobileView: boolean;
  /* @conditional-compile-remove(one-to-n-calling) */
  modalLayerHostId: string;
  /* @conditional-compile-remove(one-to-n-calling) */
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

  /* @conditional-compile-remove(one-to-n-calling) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(one-to-n-calling) */
  const { activePane, closePane, openPeoplePane, togglePeoplePane } = useSidePaneState();

  /* @conditional-compile-remove(one-to-n-calling) */
  const isMobileWithActivePane = props.mobileView && activePane;

  /* @conditional-compile-remove(one-to-n-calling) */
  const callCompositeContainerCSS = useMemo(() => {
    return { display: isMobileWithActivePane ? 'none' : 'flex' };
  }, [isMobileWithActivePane]);

  // To be removed once feature is out of beta, replace with callCompositeContainerCSS
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const callCompositeContainerFlex = () => {
    /* @conditional-compile-remove(one-to-n-calling) */
    return callCompositeContainerCSS;
    return { display: 'flex' };
  };

  /* @conditional-compile-remove(one-to-n-calling) */
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

  return (
    <div ref={containerRef} className={mergeStyles(containerDivStyles)}>
      <Stack verticalFill horizontalAlign="stretch" className={containerClassName} data-ui-id={props.dataUiId}>
        <Stack horizontal grow>
          <Stack.Item styles={notificationsContainerStyles}>
            <Stack styles={bannerNotificationStyles}>
              <_ComplianceBanner {...props.complianceBannerProps} />
            </Stack>
            {props.errorBarProps !== false && (
              <Stack styles={bannerNotificationStyles}>
                <ErrorBar {...props.errorBarProps} />
              </Stack>
            )}
            {canUnmute && !!props.mutedNotificationProps && <MutedNotification {...props.mutedNotificationProps} />}
          </Stack.Item>
          <Stack.Item grow style={callCompositeContainerFlex()}>
            <Stack.Item styles={callGalleryStyles} grow>
              {props.onRenderGalleryContent && (
                <Stack verticalFill styles={mediaGalleryContainerStyles}>
                  {props.onRenderGalleryContent()}
                </Stack>
              )}
            </Stack.Item>
          </Stack.Item>
          {/* @conditional-compile-remove(one-to-n-calling) */ callPaneContent()}
        </Stack>
        {props.callControlProps?.options !== false &&
          /* @conditional-compile-remove(one-to-n-calling) */ !isMobileWithActivePane && (
            <Stack.Item className={callControlsContainerStyles}>
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
            </Stack.Item>
          )}
      </Stack>
    </div>
  );
};

/* @conditional-compile-remove(one-to-n-calling) */
const showShowPeopleTabHeaderButton = (callControls?: boolean | CallControlOptions): boolean => {
  if (callControls === undefined || callControls === true) {
    return true;
  }
  if (callControls === false) {
    return false;
  }
  return callControls.participantsButton !== false;
};
