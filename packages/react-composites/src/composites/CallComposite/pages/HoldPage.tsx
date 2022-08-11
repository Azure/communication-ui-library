// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorBar, HoldButton } from '@internal/react-components';
import React from 'react';
import { CallCompositeOptions } from '../../../index-public';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { HoldPane } from '../components/HoldPane';
import { usePropsFor } from '../hooks/usePropsFor';
import { reduceCallControlsForMobile } from '../utils';

/**
 * @private
 */
export interface HoldPageProps {
  mobileView: boolean;
  options?: CallCompositeOptions;
  modalLayerHostId: string;
}
/**
 * @private
 */
export const HoldPage = (props: HoldPageProps): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const holdButtonProps = usePropsFor(HoldButton);
  const strings = useLocale().strings.call;

  const callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;
  console.log('hold page');

  return (
    <CallArrangement
      complianceBannerProps={{ strings }}
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps }}
      callControlProps={{
        options: callControlOptions,
        increaseFlyoutItemSize: props.mobileView
      }}
      mobileView={props.mobileView}
      /* @conditional-compile-remove(one-to-n-calling) */
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() => <HoldPane onToggleHold={holdButtonProps.onToggleHold} />}
      dataUiId={'hold-page'}
    />
  );
};
