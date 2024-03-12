// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, IconButton, TextField, Checkbox, PrimaryButton, Spinner, useTheme } from '@fluentui/react';
import React from 'react';
import {
  AzureCommunicationCallAdapterArgs,
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
  callAdapterArgs: AzureCommunicationOutboundCallAdapterArgs | AzureCommunicationCallAdapterArgs;
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
    displayName,
    customFields
  } = props;

  const theme = useTheme();

  /**
   * Render function to display the new custome fields passed in by Contoso
   */
  const renderCustomFields = (fields: CustomField[] | undefined): JSX.Element => {
    if (fields === undefined) {
      return <></>;
    }
    const customFieldElements: JSX.Element[] = fields.map((field) => {
      if (field.kind === 'checkBox') {
        return (
          <Checkbox
            label={field.label}
            onChange={(_, checked) => {
              field.onChange(checked as boolean);
            }}
          ></Checkbox>
        );
      } else {
        return (
          <TextField
            label={field.label}
            onChange={(_, newValue) => {
              field.onChange(newValue as string);
            }}
          ></TextField>
        );
      }
    });
    return <Stack>{customFieldElements}</Stack>;
  };

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
      {renderCustomFields(customFields)}
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
            if ('targetCallees' in callAdapterArgs) {
              setAdapter(
                await createAzureCommunicationCallAdapter({
                  displayName: displayName ?? '',
                  userId: callAdapterArgs.userId,
                  credential: callAdapterArgs.credential,
                  targetCallees: callAdapterArgs.targetCallees,
                  options: callAdapterArgs.options
                })
              );
            } else {
              setAdapter(
                await createAzureCommunicationCallAdapter({
                  displayName: displayName ?? '',
                  userId: callAdapterArgs.userId,
                  credential: callAdapterArgs.credential,
                  locator: callAdapterArgs.locator,
                  options: callAdapterArgs.options
                })
              );
            }
          }
        }}
      ></Checkbox>
      <PrimaryButton
        styles={startCallButtonStyles(theme)}
        onClick={() => {
          if (displayName && consentToData && adapter) {
            setWidgetState('inCall');
            /**
             * We need to kick off any actions the user defined to happen at the
             * call start
             */
            customFields?.forEach((field) => {
              field.onCallStart();
            });
            if ('targetCallees' in callAdapterArgs) {
              adapter?.startCall(callAdapterArgs.targetCallees, {
                audioOptions: { muted: false }
              });
            } else {
              adapter.joinCall({});
            }
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
