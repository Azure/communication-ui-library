// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallWithChatAdapter,
  CallWithChatComposite,
  CallWithChatControlOptions,
  CustomCallControlButtonCallback
} from '../../../src';
import { IDS } from '../../browser/common/constants';
import { isMobile } from '../lib/utils';
import { CommonQueryArgs } from './QueryArgs';

/** @internal */
export function BaseApp(props: { queryArgs: CommonQueryArgs; adapter?: CallWithChatAdapter }): JSX.Element {
  const { adapter } = props;

  if (!adapter) {
    return <h3>Initializing call-with-chat adapter...</h3>;
  }

  const callControlOptions: CallWithChatControlOptions | undefined | boolean =
    typeof props.queryArgs.customCompositeOptions?.callControls === 'object'
      ? {
          ...props.queryArgs.customCompositeOptions.callControls,
          onFetchCustomButtonProps: props.queryArgs.injectCustomButtons ? customButtonsForInjection : undefined
        }
      : props.queryArgs.customCompositeOptions?.callControls;

  return (
    <div id="app-under-test-root" style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <_IdentifierProvider identifiers={IDS}>
        <CallWithChatComposite
          adapter={adapter}
          formFactor={isMobile() ? 'mobile' : 'desktop'}
          joinInvitationURL={window.location.href}
          rtl={props.queryArgs.rtl}
          options={{
            ...props.queryArgs.customCompositeOptions,
            callControls: callControlOptions
          }}
        />
      </_IdentifierProvider>
    </div>
  );
}

const customButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'primary',
    strings: {
      label: 'Primary Btn 1'
    }
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'Primary Btn 2'
    },
    disabled: true
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'Primary Btn 3'
    }
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'Primary Btn 4'
    },
    disabled: false
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'Primary Btn 5'
    },
    disabled: true
  }),
  () => ({
    placement: 'secondary',
    strings: {
      label: 'Secondary Btn 1'
    },
    disabled: true,
    showLabel: true
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageRemove',
    strings: {
      label: 'Secondary Btn 2'
    },
    disabled: false,
    showLabel: false
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageRemove',
    strings: {
      label: 'Secondary Btn 3'
    },
    disabled: false
  }),
  () => ({
    placement: 'overflow',
    strings: {
      label: 'Overflow Btn 1'
    },
    disabled: false
  }),
  () => ({
    placement: 'overflow',
    iconName: 'SendBoxSend',
    strings: {
      label: 'Overflow Btn 2'
    },
    disabled: false
  })
];
