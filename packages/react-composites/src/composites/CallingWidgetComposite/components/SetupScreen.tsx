// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, IconButton, TextField, Checkbox, PrimaryButton, Spinner, useTheme } from '@fluentui/react';
import React from 'react';
import {
  AzureCommunicationOutboundCallAdapterArgs,
  CallAdapter,
  createAzureCommunicationCallAdapter
} from '../../CallComposite';
import {
  callingWidgetSetupContainerStyles,
  collapseButtonStyles,
  logoContainerStyles,
  checkboxStyles,
  startCallButtonStyles
} from '../styles/CallingWidgetComposite.styles';
import { CustomField } from '../CallingWidgetComposite';

export interface SetupScreenProps {
  setUseLocalVideo: (useVideo: boolean) => void;
  setWidgetState: (state: 'new' | 'inCall' | 'setup') => void;
  setDisplayName: (name: string | undefined) => void;
  displayName?: string;
  setConsentToData: (consent: boolean) => void;
  setAdapter: (adapter: CallAdapter) => void;
  callAdapterArgs: AzureCommunicationOutboundCallAdapterArgs;
  consentToData: boolean;
  adapter?: CallAdapter;
  customFields?: CustomField[];
  onRenderLogo?: () => JSX.Element;
  showVideoOptIn?: boolean;
  showDisplayNameField?: boolean;
}

export const SetupScreen = (props: SetupScreenProps): JSX.Element => {
  const {
    setConsentToData,
    setDisplayName,
    setUseLocalVideo,
    setWidgetState,
    callAdapterArgs,
    setAdapter,
    onRenderLogo,
    adapter,
    consentToData,
    displayName
  } = props;

  const theme = useTheme();
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
        <Stack style={{ transform: 'scale(1.8)' }}>{onRenderLogo && onRenderLogo()}</Stack>
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
          if (callAdapterArgs && callAdapterArgs.credential) {
            setAdapter(
              await createAzureCommunicationCallAdapter({
                displayName: displayName ?? '',
                userId: callAdapterArgs.userId,
                credential: callAdapterArgs.credential,
                targetCallees: callAdapterArgs.targetCallees,
                options: callAdapterArgs.options
              })
            );
          }
        }}
      ></Checkbox>
      <PrimaryButton
        styles={startCallButtonStyles(theme)}
        onClick={() => {
          if (displayName && consentToData && adapter) {
            setWidgetState('inCall');
            adapter?.startCall(callAdapterArgs.targetCallees, {
              audioOptions: { muted: false }
            });
          }
        }}
      >
        {!consentToData && `Enter your name`}
        {consentToData && !adapter && <Spinner ariaLive="assertive" labelPosition="top" />}
        {consentToData && adapter && `StartCall`}
      </PrimaryButton>
    </Stack>
  );
};
