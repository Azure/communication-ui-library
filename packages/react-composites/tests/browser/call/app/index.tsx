// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  CallComposite,
  CompositeLocale,
  COMPOSITE_LOCALE_FR_FR,
  COMPOSITE_LOCALE_EN_US
} from '../../../../src';
import { IDS } from '../../common/constants';
import { isMobile, verifyParamExists } from '../../common/testAppUtils';
import { IContextualMenuItem, mergeStyles } from '@fluentui/react';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Required params
const displayName = verifyParamExists(params.displayName, 'displayName');
const token = verifyParamExists(params.token, 'token');
const groupId = verifyParamExists(params.groupId, 'groupId');
const userId = verifyParamExists(params.userId, 'userId');

// Optional params
const useFrLocale = Boolean(params.useFrLocale);
const showCallDescription = Boolean(params.showCallDescription);
const injectParticipantMenuItems = Boolean(params.injectParticipantMenuItems);

function App(): JSX.Element {
  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      setCallAdapter(
        await createAzureCommunicationCallAdapter({
          userId: { communicationUserId: userId },
          displayName,
          credential: new AzureCommunicationTokenCredential(token),
          locator: { groupId: groupId }
        })
      );
    };

    initialize();

    return () => callAdapter && callAdapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locale = useFrLocale ? COMPOSITE_LOCALE_FR_FR : COMPOSITE_LOCALE_EN_US;
  if (showCallDescription) {
    locale.strings.call.configurationPageCallDetails =
      'Some details about the call that span more than one line - many, many lines in fact. Who would want fewer lines than many, many lines? Could you even imagine?! 😲';
  }

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <_IdentifierProvider identifiers={IDS}>
        {callAdapter && (
          <CallComposite
            adapter={callAdapter}
            locale={locale}
            options={{ mobileView: isMobile() }}
            onFetchParticipantMenuItems={injectParticipantMenuItems ? onFetchParticipantMenuItems : undefined}
          />
        )}
      </_IdentifierProvider>
    </div>
  );
}

function onFetchParticipantMenuItems(): IContextualMenuItem[] {
  return [
    {
      'data-ui-id': 'test-app-participant-menu-item',
      key: 'theOneWithRedBackground',
      className: mergeStyles({ background: 'red' }),
      href: 'https://bing.com',
      text: 'I feel so blue'
    },
    {
      key: 'shareSplit',
      split: true,
      subMenuProps: {
        items: [
          { key: 'sharetotwittersplit', text: 'Share to Twitter' },
          { key: 'sharetofacebooksplit', text: 'Share to Facebook' }
        ]
      },
      text: 'Share w/ Split'
    }
  ];
}

ReactDOM.render(<App />, document.getElementById('root'));
