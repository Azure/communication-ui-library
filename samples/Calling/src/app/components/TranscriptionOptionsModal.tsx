// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DefaultButton,
  Dropdown,
  IconButton,
  IDropdownStyles,
  Modal,
  PrimaryButton,
  Stack,
  Text,
  useTheme
} from '@fluentui/react';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { LocaleCode, localeDisplayNames } from '../utils/CallAutomationUtils';
import React, { useState } from 'react';

export interface TranscriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  startTranscription: (locale: LocaleCode) => Promise<void>;
}

export const TranscriptionOptionsModal = (props: TranscriptionModalProps): JSX.Element => {
  const { isOpen, setIsOpen, startTranscription } = props;
  const [currentLanguage, setCurrentLanguage] = useState<LocaleCode>('en-US');

  const theme = useTheme();
  const dropdownOptions = Object.keys(localeDisplayNames).map((key) => ({
    key,
    text: localeDisplayNames[key as LocaleCode]
  }));
  return (
    <Modal
      isOpen={isOpen}
      isBlocking={false}
      onDismiss={() => {
        setIsOpen(false);
      }}
      styles={{ main: { width: '27.5rem', height: '16.75rem' } }}
    >
      <Stack tokens={{ childrenGap: '1.5rem' }} styles={{ root: { margin: '1.5rem' } }}>
        <Stack horizontal verticalAlign="center" style={{ position: 'relative' }}>
          <Text style={{ fontWeight: 600, fontSize: '1.25rem' }}>What Language is being spoken?</Text>
          <IconButton
            style={{ position: 'absolute', right: 0 }}
            onRenderIcon={() => <Dismiss20Regular style={{ color: theme.palette.neutralPrimary }} />}
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: '0.25rem' }}>
          <Dropdown
            options={dropdownOptions}
            styles={dropdownStyles}
            placeholder={localeDisplayNames[currentLanguage]}
            onChange={(_, option) => {
              if (option) {
                setCurrentLanguage(option.key as LocaleCode);
              }
            }}
            label={'Spoken Language'}
            selectedKey={currentLanguage}
          ></Dropdown>
          <Text style={{ fontSize: '0.75rem', color: theme.palette.neutralSecondary }}>
            language that everyone on this call is speaking.
          </Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: '0.5rem' }} horizontalAlign="end" style={{ paddingTop: '1.5rem' }}>
          <PrimaryButton
            onClick={() => {
              startTranscription(currentLanguage)
                .then(() => {
                  setIsOpen(false);
                })
                .catch((error) => {
                  console.error('Error starting transcription:', error);
                });
            }}
          >
            Confirm
          </PrimaryButton>
          <DefaultButton
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </DefaultButton>
        </Stack>
      </Stack>
    </Modal>
  );
};

const dropdownStyles: Partial<IDropdownStyles> = {
  callout: {
    height: '25rem'
  }
};
