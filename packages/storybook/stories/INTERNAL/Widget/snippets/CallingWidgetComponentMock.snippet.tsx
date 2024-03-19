// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier, MicrosoftTeamsAppIdentifier } from '@azure/communication-common';
import { CallAdapter, CallAdapterState, CallComposite } from '@azure/communication-react';
import { IconButton, PrimaryButton, Stack, TextField, useTheme, Checkbox, Icon, Spinner } from '@fluentui/react';
import { _MockCallingWidgetCallAdapter } from '@internal/react-composites';
import React, { useEffect, useRef, useState } from 'react';
import {
  callingWidgetSetupContainerStyles,
  checkboxStyles,
  startCallButtonStyles,
  callingWidgetContainerStyles,
  callIconStyles,
  logoContainerStyles,
  collapseButtonStyles,
  callingWidgetInCallContainerStyles
} from './CallingWidgetComponent.styles';

/**
 * Properties needed for our widget to start a call.
 */
export type WidgetAdapterArgs = {
  token: string;
  userId: CommunicationUserIdentifier;
  teamsAppIdentifier: MicrosoftTeamsAppIdentifier;
};

/**
 * Widget for Calling Widget
 * @param props
 */
export const CallingWidgetComponentMock = (): JSX.Element => {
  const [widgetState, setWidgetState] = useState<'new' | 'setup' | 'inCall'>('new');
  const [displayName, setDisplayName] = useState<string>();
  const [consentToData, setConsentToData] = useState<boolean>(false);
  const [useLocalVideo, setUseLocalVideo] = useState<boolean>(false);
  const [adapter, setAdapter] = useState<CallAdapter>();

  const callIdRef = useRef<string>();

  const theme = useTheme();

  useEffect(() => {
    if (adapter) {
      adapter.on('transferAccepted', (e) => {
        console.log('transferAccepted', e);
      });

      adapter.onStateChange((state: CallAdapterState) => {
        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
        /**
         * We only want to reset the widget state if the call that ended is the same as the current call.
         */
        if (state.acceptedTransferCallState && state.acceptedTransferCallState?.id !== callIdRef.current) {
          return;
        }
        if (state?.call?.state === 'Disconnected') {
          setDisplayName(undefined);
          setWidgetState('new');
          setConsentToData(false);
          setAdapter(undefined);
          adapter.dispose();
        }
      });
    }
  }, [adapter]);

  /** widget template for when widget is open, put any fields here for user information desired */
  if (widgetState === 'setup') {
    return (
      <Stack styles={callingWidgetSetupContainerStyles(theme)} tokens={{ childrenGap: '1rem' }}>
        <IconButton
          styles={collapseButtonStyles}
          iconProps={{ iconName: 'Dismiss' }}
          onClick={() => {
            setDisplayName(undefined);
            setConsentToData(false);
            setUseLocalVideo(false);
            setWidgetState('new');
          }}
        />
        <Stack tokens={{ childrenGap: '1rem' }} styles={logoContainerStyles}>
          <Stack style={{ transform: 'scale(1.8)' }}>
            <img src="/images/logo.svg" alt="acs logo" />
          </Stack>
        </Stack>
        <TextField
          label={'Name'}
          required={true}
          placeholder={'Enter your name'}
          onChange={(_, newValue) => {
            setDisplayName(newValue);
          }}
        />
        <Checkbox
          styles={checkboxStyles(theme)}
          label={'Use video - Checking this box will enable camera controls and screen sharing'}
          onChange={(_, checked?: boolean | undefined) => {
            setUseLocalVideo(!!checked);
            setUseLocalVideo(true);
          }}
        ></Checkbox>
        <Checkbox
          required={true}
          styles={checkboxStyles(theme)}
          disabled={displayName === undefined}
          label={
            'By checking this box, you are consenting that we will collect data from the call for customer support reasons'
          }
          onChange={async (_, checked?: boolean | undefined) => {
            setConsentToData(!!checked);
            setAdapter(new _MockCallingWidgetCallAdapter({}));
          }}
        ></Checkbox>
        <PrimaryButton
          styles={startCallButtonStyles(theme)}
          onClick={() => {
            if (displayName && consentToData && adapter) {
              setWidgetState('inCall');
              adapter.startCall([{ teamsAppId: '28:orgid:test' }]);
            }
          }}
        >
          {!consentToData && `Enter your name`}
          {consentToData && !adapter && <Spinner ariaLive="assertive" labelPosition="top" />}
          {consentToData && adapter && `StartCall`}
        </PrimaryButton>
      </Stack>
    );
  }

  if (widgetState === 'inCall' && adapter) {
    return (
      <Stack styles={callingWidgetInCallContainerStyles(theme)}>
        <CallComposite
          adapter={adapter}
          options={{
            callControls: {
              cameraButton: useLocalVideo,
              screenShareButton: useLocalVideo,
              moreButton: false,
              peopleButton: false,
              displayType: 'compact'
            },
            localVideoTile: !useLocalVideo ? false : { position: 'floating' }
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={callingWidgetContainerStyles(theme)}
      onClick={() => {
        setWidgetState('setup');
      }}
    >
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        style={{
          height: '4rem',
          width: '4rem',
          borderRadius: '50%',
          background: theme.palette.themePrimary
        }}
      >
        <Icon iconName="callAdd" styles={callIconStyles(theme)} />
      </Stack>
    </Stack>
  );
};
