// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(one-to-n-calling) */
import { useId } from '@fluentui/react-hooks';
import {
  _ComplianceBanner,
  _ComplianceBannerProps,
  _useContainerHeight,
  _useContainerWidth,
  ErrorBar,
  ErrorBarProps,
  useTheme
} from '@internal/react-components';
import React, { useMemo, useRef } from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { useCallback, useState } from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { containerDivStyles } from '../../common/ContainerRectProps';
import { modalLayerHostStyle } from '../../common/styles/ModalLocalAndRemotePIP.styles';
/* @conditional-compile-remove(one-to-n-calling) */
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallControls, CallControlsProps } from '../components/CallControls';
/* @conditional-compile-remove(one-to-n-calling) */
import { useSelector } from '../hooks/useSelector';
/* @conditional-compile-remove(one-to-n-calling) */
import { callStatusSelector } from '../selectors/callStatusSelector';
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
import { CallPane, CallPaneOption } from './CallPane';
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
  const [activePane, setActivePane] = useState<CallPaneOption>('none');
  /* @conditional-compile-remove(one-to-n-calling) */
  const { callStatus } = useSelector(callStatusSelector);

  /* @conditional-compile-remove(one-to-n-calling) */
  const closePane = useCallback(() => {
    setActivePane('none');
  }, [setActivePane]);

  /* @conditional-compile-remove(one-to-n-calling) */
  const modalLayerHostId = useId('modalLayerhost');
  /* @conditional-compile-remove(one-to-n-calling) */
  const isMobileWithActivePane = props.mobileView && activePane !== 'none';

  /* @conditional-compile-remove(one-to-n-calling) */
  const togglePeople = useCallback(() => {
    if (activePane === 'people' || !(callStatus === 'Connected')) {
      setActivePane('none');
    } else {
      setActivePane('people');
    }
  }, [activePane, setActivePane, callStatus]);

  /* @conditional-compile-remove(one-to-n-calling) */
  const selectPeople = useCallback(() => {
    if (callStatus === 'Connected') {
      setActivePane('people');
    }
  }, [setActivePane, callStatus]);

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
  const callPaneContent = (): JSX.Element => {
    if (adapter && callStatus === 'Connected') {
      return (
        <CallPane
          callAdapter={adapter}
          onClose={closePane}
          onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
          onPeopleButtonClicked={
            showShowPeopleTabHeaderButton(props.callControlProps.options) ? selectPeople : undefined
          }
          modalLayerHostId={modalLayerHostId}
          activePane={activePane}
          mobileView={props.mobileView}
          inviteLink={props.callControlProps.callInvitationURL}
        />
      );
    }
    return <></>;
  };

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
            {!!props.mutedNotificationProps && <MutedNotification {...props.mutedNotificationProps} />}
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
                onPeopleButtonClicked={togglePeople}
              />
            </Stack.Item>
          )}
        {
          // This layer host is for ModalLocalAndRemotePIP in CallPane. This LayerHost cannot be inside the CallPane
          // because when the CallPane is hidden, ie. style property display is 'none', it takes up no space. This causes problems when dragging
          // the Modal because the draggable bounds thinks it has no space and will always return to its initial position after dragging.
          /* @conditional-compile-remove(one-to-n-calling) */
          props.mobileView && <LayerHost id={modalLayerHostId} className={mergeStyles(modalLayerHostStyle)} />
        }
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
