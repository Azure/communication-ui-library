// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorBar } from '@internal/react-components';
import React from 'react';
import { CallCompositeOptions } from '../../../index-public';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { HoldPane } from '../components/HoldPane';
import { usePropsFor } from '../hooks/usePropsFor';
import { disableCallControls, reduceCallControlsForMobile } from '../utils';
import { MobileChatSidePaneTabHeaderProps } from '../../common/TabHeader';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';

/**
 * @beta
 */
export interface HoldPageProps {
  mobileView: boolean;
  options?: CallCompositeOptions;
  modalLayerHostId: string;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
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
      // Ignore errors from before current call. This avoids old errors from showing up when a user re-joins a call.
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps, ignorePremountErrors: true }}
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
    />
  );
};
