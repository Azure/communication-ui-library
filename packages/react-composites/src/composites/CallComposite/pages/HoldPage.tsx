// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorBar } from '@internal/react-components';
import React from 'react';
import { CallCompositeOptions } from '../../../index-public';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { HoldPane } from '../components/HoldPane';
import { usePropsFor } from '../hooks/usePropsFor';
import { reduceCallControlsForMobile } from '../utils';

/**
 * @beta
 */
export interface HoldPageProps {
  mobileView: boolean;
  options?: CallCompositeOptions;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  modalLayerHostId: string;
}

/**
 * @beta
 */
export const HoldPage = (props: HoldPageProps): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
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
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() => <HoldPane />}
      dataUiId={'hold-page'}
    />
  );
};
