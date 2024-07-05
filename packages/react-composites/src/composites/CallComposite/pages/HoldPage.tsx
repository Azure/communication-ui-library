// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActiveErrorMessage, ErrorBar } from '@internal/react-components';
import React from 'react';
import { CallCompositeOptions } from '../../../index-public';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { HoldPane } from '../components/HoldPane';
import { usePropsFor } from '../hooks/usePropsFor';
import { disableCallControls, reduceCallControlsForMobile } from '../utils';
import { MobileChatSidePaneTabHeaderProps } from '../../common/TabHeader';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';

import { CapabilitiesChangeNotificationBarProps } from '../components/CapabilitiesChangedNotificationBar';
/* @conditional-compile-remove(notifications) */
import { ActiveNotification } from '@internal/react-components';

/**
 * @beta
 */
export interface HoldPageProps {
  mobileView: boolean;
  options?: CallCompositeOptions;
  modalLayerHostId: string;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  latestErrors: ActiveErrorMessage[] | /* @conditional-compile-remove(notifications) */ ActiveNotification[];
  onDismissError: (
    error: ActiveErrorMessage | /* @conditional-compile-remove(notifications) */ ActiveNotification
  ) => void;
  /* @conditional-compile-remove(notifications) */
  onDismissNotification?: (notification: ActiveNotification) => void;
  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
  /* @conditional-compile-remove(notifications) */
  latestNotifications: ActiveNotification[];
}

/**
 * @beta
 */
export const HoldPage = (props: HoldPageProps): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const strings = useLocale().strings.call;

  let callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  callControlOptions = disableCallControls(callControlOptions, [
    'cameraButton',
    'microphoneButton',
    'devicesButton',
    'screenShareButton',
    /* @conditional-compile-remove(PSTN-calls) */
    /* @conditional-compile-remove(one-to-n-calling) */
    'holdButton'
  ]);

  return (
    <CallArrangement
      complianceBannerProps={{ strings }}
      errorBarProps={props.options?.errorBar !== false && errorBarProps}
      /* @conditional-compile-remove(notifications) */
      showErrorNotifications={props.options?.errorBar ?? true}
      callControlProps={{
        options: callControlOptions,
        increaseFlyoutItemSize: props.mobileView
      }}
      mobileView={props.mobileView}
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() => <HoldPane />}
      dataUiId={'hold-page'}
      updateSidePaneRenderer={props.updateSidePaneRenderer}
      mobileChatTabHeader={props.mobileChatTabHeader}
      latestErrors={props.latestErrors}
      /* @conditional-compile-remove(notifications) */
      latestNotifications={props.latestNotifications}
      onDismissError={props.onDismissError}
      /* @conditional-compile-remove(notifications) */
      onDismissNotification={props.onDismissNotification}
    />
  );
};
