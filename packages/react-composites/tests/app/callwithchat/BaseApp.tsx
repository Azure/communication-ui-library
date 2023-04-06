// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallWithChatAdapter,
  CallWithChatComposite,
  CallWithChatControlOptions,
  CustomCallWithChatControlButtonCallback
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

const customButtonsForInjection: CustomCallWithChatControlButtonCallback[] = [
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    text: 'Primary Btn 1',
    key: 'primary-button-1',
    styles: {
      root: {
        background: '#ff6600'
      }
    }
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    text: 'Primary Btn 2',
    key: 'primary-button-2',
    disabled: true
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    text: 'Primary Btn 3',
    key: 'primary-button-3',
    showLabel: false
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    text: 'Primary Btn 4',
    key: 'primary-button-4',
    disabled: false,
    showLabel: false
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    text: 'Primary Btn 5',
    key: 'primary-button-5',
    disabled: true,
    showLabel: false
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageRemove',
    text: 'Secondary Btn 1',
    key: 'secondary-button-1',
    disabled: true,
    showLabel: true
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageRemove',
    text: 'Secondary Btn 2',
    key: 'secondary-button-2',
    disabled: false,
    showLabel: false
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageRemove',
    text: 'Secondary Btn 3',
    key: 'secondary-button-3',
    disabled: false,
    showLabel: false
  }),
  () => ({
    placement: 'overflow',
    iconName: 'SendBoxSend',
    text: 'Overflow Btn 1',
    key: 'overflow-button-1',
    disabled: false,
    showLabel: false
  }),
  () => ({
    placement: 'overflow',
    iconName: 'SendBoxSend',
    text: 'Overflow Btn 2',
    key: 'overflow-button-2',
    disabled: false,
    showLabel: false
  })
];
