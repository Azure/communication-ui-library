// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import { _IdentifierProvider } from '@internal/react-components';
import { CallWithChatAdapter, CallWithChatComposite } from '../../../src';
import { IDS } from '../../browser/common/constants';
import { isMobile } from '../lib/utils';
import { CommonQueryArgs } from './QueryArgs';

/** @internal */
export function BaseApp(props: { queryArgs: CommonQueryArgs; adapter?: CallWithChatAdapter }): JSX.Element {
  const { adapter } = props;

  if (!adapter) {
    return <h3>Initializing call-with-chat adapter...</h3>;
  }
  return (
    <div id="app-under-test-root" style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <_IdentifierProvider identifiers={IDS}>
        <CallWithChatComposite
          adapter={adapter}
          formFactor={isMobile() ? 'mobile' : 'desktop'}
          joinInvitationURL={window.location.href}
          options={props.queryArgs.customCompositeOptions}
        />
      </_IdentifierProvider>
    </div>
  );
}
