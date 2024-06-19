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

/**
 * @beta
 */
export interface HoldPageProps {
  mobileView: boolean;
  options?: CallCompositeOptions;
  modalLayerHostId: string;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  latestErrors: ActiveErrorMessage[];
  onDismissError: (error: ActiveErrorMessage) => void;

  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
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
      onDismissError={props.onDismissError}
    />
  );
};
