// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { useMemo, useState } from 'react';
import {
  IModalStyles,
  Modal,
  Stack,
  useTheme,
  Text,
  IconButton,
  Dropdown,
  IDropdownOption,
  DefaultButton
} from '@fluentui/react';

import {
  buttonsContainerClassName,
  buttonStyles,
  dropdownContainerClassName,
  dropdownInfoTextStyle,
  dropdownStyles,
  themedCaptionsSettingsModalStyle,
  titleClassName,
  titleContainerClassName
} from './styles/CaptionsSettingsModal.styles';
import { _captionsOptions } from './StartCaptionsButton';
import { defaultSpokenLanguage } from './utils';
import { CaptionsAvailableLanguageStrings } from '../types';

/**
 * @internal
 * strings for captions setting modal
 */
export interface _CaptionsSettingsModalStrings {
  captionsSettingsModalTitle: string;
  captionsSettingsDropdownLabel: string;
  captionsSettingsDropdownInfoText: string;
  captionsSettingsConfirmButtonLabel: string;
  captionsSettingsCancelButtonLabel: string;
  captionsSettingsModalAriaLabel: string;
  captionsSettingsCloseModalButtonAriaLabel: string;
}

/**
 * @internal
 * _CaptionsSettingsModal Component Props.
 */
export interface _CaptionsSettingsModalProps {
  supportedSpokenLanguages: string[];
  onSetSpokenLanguage: (language: string) => Promise<void>;
  onStartCaptions: (captionsOptions?: _captionsOptions) => Promise<void>;
  currentSpokenLanguage: string;
  captionsAvailableLanguageStrings: CaptionsAvailableLanguageStrings;
  isCaptionsFeatureActive?: boolean;
  strings?: _CaptionsSettingsModalStrings;
  showModal?: boolean;
  onDismissCaptionsSettings?: () => void;
}

/**
 * @internal
 * a component for setting spoken languages
 */
export const _CaptionsSettingsModal = (props: _CaptionsSettingsModalProps): JSX.Element => {
  const {
    supportedSpokenLanguages,
    currentSpokenLanguage,
    isCaptionsFeatureActive,
    showModal,
    onSetSpokenLanguage,
    onDismissCaptionsSettings,
    onStartCaptions,
    strings,
    captionsAvailableLanguageStrings
  } = props;

  const theme = useTheme();

  const [selectedItem, setSelectedItem] = useState<IDropdownOption>({
    key: currentSpokenLanguage !== '' ? currentSpokenLanguage : defaultSpokenLanguage,
    text: currentSpokenLanguage !== '' ? currentSpokenLanguage : defaultSpokenLanguage
  });

  const dismiss = (): void => {
    if (onDismissCaptionsSettings) {
      onDismissCaptionsSettings();
    }
  };

  const confirm = (languageCode: string): void => {
    if (isCaptionsFeatureActive) {
      onSetSpokenLanguage(languageCode);
    } else {
      onStartCaptions({ spokenLanguage: languageCode });
    }
    dismiss();
  };

  const dropdownOptions: IDropdownOption[] = useMemo(() => {
    return supportedSpokenLanguages.map((languageCode) => {
      return { key: languageCode, text: captionsAvailableLanguageStrings[languageCode] ?? languageCode };
    });
  }, [supportedSpokenLanguages, captionsAvailableLanguageStrings]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption<any> | undefined): void => {
    if (option) {
      setSelectedItem(option);
    }
  };

  const CaptionsSettingsComponent = (): JSX.Element => {
    return (
      <Stack>
        <Dropdown
          label={strings?.captionsSettingsDropdownLabel}
          selectedKey={selectedItem ? selectedItem.key : undefined}
          onChange={onChange}
          placeholder={currentSpokenLanguage !== '' ? currentSpokenLanguage : defaultSpokenLanguage}
          options={dropdownOptions}
          styles={dropdownStyles}
        />
        <Text className={dropdownInfoTextStyle(theme)}>{strings?.captionsSettingsDropdownInfoText}</Text>
      </Stack>
    );
  };

  const CaptionsSettingsModalStyle: Partial<IModalStyles> = useMemo(
    () => themedCaptionsSettingsModalStyle(theme),
    [theme]
  );

  return (
    <>
      {
        <Modal
          titleAriaId={strings?.captionsSettingsModalAriaLabel}
          isOpen={showModal}
          onDismiss={dismiss}
          isBlocking={true}
          styles={CaptionsSettingsModalStyle}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
            <Text className={titleClassName}>{strings?.captionsSettingsModalTitle}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings?.captionsSettingsCloseModalButtonAriaLabel}
              onClick={dismiss}
              style={{ color: theme.palette.black }}
            />
          </Stack>

          <Stack className={dropdownContainerClassName}>{CaptionsSettingsComponent()}</Stack>
          <Stack horizontal horizontalAlign="end" className={buttonsContainerClassName}>
            <DefaultButton
              styles={buttonStyles(theme)}
              onClick={() => {
                confirm(selectedItem.key.toString());
              }}
            >
              <span>{strings?.captionsSettingsConfirmButtonLabel}</span>
            </DefaultButton>
            <DefaultButton onClick={dismiss} styles={buttonStyles(theme)}>
              <span>{strings?.captionsSettingsCancelButtonLabel}</span>
            </DefaultButton>
          </Stack>
        </Modal>
      }
    </>
  );
};
