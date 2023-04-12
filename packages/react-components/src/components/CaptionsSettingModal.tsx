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
  themedCaptionsSettingModalStyle,
  titleClassName,
  titleContainerClassName
} from './styles/CaptionsSettingModal.styles';
import { _captionsOptions } from './StartCaptionsButton';
import { defaultSpokenLanguage } from './utils';
/**
 * @internal
 * strings for captions setting modal
 */
export interface _CaptionsSettingModalStrings {
  captionsSettingModalTitle: string;
  captionsSettingDropdownLabel: string;
  captionsSettingDropdownInfoText: string;
  captionsSettingConfirmButtonLabel: string;
  captionsSettingCancelButtonLabel: string;
  captionsSettingModalAriaLabel: string;
  captionsSettingCloseModalButtonAriaLabel: string;
}

/**
 * @internal
 * _CaptionsSettingModal Component Props.
 */
export interface _CaptionsSettingModalProps {
  supportedSpokenLanguages: string[];
  onSetSpokenLanguage: (language: string) => Promise<void>;
  onStartCaptions: (captionsOptions?: _captionsOptions) => Promise<void>;
  currentSpokenLanguage: string;
  isCaptionsFeatureActive?: boolean;
  strings?: _CaptionsSettingModalStrings;
  showModal?: boolean;
  onDismissCaptionsSetting?: () => void;
}

/**
 * @internal
 * a component for setting spoken languages
 */
export const _CaptionsSettingModal = (props: _CaptionsSettingModalProps): JSX.Element => {
  const {
    supportedSpokenLanguages,
    currentSpokenLanguage,
    isCaptionsFeatureActive,
    showModal,
    onSetSpokenLanguage,
    onDismissCaptionsSetting,
    onStartCaptions,
    strings
  } = props;

  const theme = useTheme();

  const [selectedItem, setSelectedItem] = useState<IDropdownOption>({
    key: currentSpokenLanguage !== '' ? currentSpokenLanguage : defaultSpokenLanguage,
    text: currentSpokenLanguage !== '' ? currentSpokenLanguage : defaultSpokenLanguage
  });

  const supportedLanguageStrings = useLocale().strings.captionsAvailableLanguages;
  const dismiss = (): void => {
    if (onDismissCaptionsSetting) {
      onDismissCaptionsSetting();
    }
  };

  const confirm = (language: string): void => {
    if (isCaptionsFeatureActive) {
      onSetSpokenLanguage(language);
    } else {
      onStartCaptions({ spokenLanguage: selectedItem.text });
    }
    dismiss();
  };

  const dropdownOptions: IDropdownOption[] = supportedSpokenLanguages.map((language) => {
    return { key: language, text: supportedLanguageStrings[language] };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption<any> | undefined): void => {
    if (option) {
      setSelectedItem(option);
    }
  };

  const CaptionsSettingComponent = (): JSX.Element => {
    return (
      <Stack>
        <Dropdown
          label={strings?.captionsSettingDropdownLabel}
          selectedKey={selectedItem ? selectedItem.key : undefined}
          onChange={onChange}
          placeholder={currentSpokenLanguage !== '' ? currentSpokenLanguage : defaultSpokenLanguage}
          options={dropdownOptions}
          styles={dropdownStyles}
        />
        <Text className={dropdownInfoTextStyle(theme)}>{strings?.captionsSettingDropdownInfoText}</Text>
      </Stack>
    );
  };

  const captionsSettingModalStyle: Partial<IModalStyles> = useMemo(
    () => themedCaptionsSettingModalStyle(theme),
    [theme]
  );

  return (
    <>
      {
        <Modal
          titleAriaId={strings?.captionsSettingModalAriaLabel}
          isOpen={showModal}
          onDismiss={dismiss}
          isBlocking={true}
          styles={captionsSettingModalStyle}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
            <Text className={titleClassName}>{strings?.captionsSettingModalTitle}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings?.captionsSettingCloseModalButtonAriaLabel}
              onClick={dismiss}
              style={{ color: theme.palette.black }}
            />
          </Stack>

          <Stack className={dropdownContainerClassName}>{CaptionsSettingComponent()}</Stack>
          <Stack horizontal horizontalAlign="end" className={buttonsContainerClassName}>
            <DefaultButton
              styles={buttonStyles(theme)}
              onClick={() => {
                confirm(selectedItem.text);
              }}
            >
              <span>{strings?.captionsSettingConfirmButtonLabel}</span>
            </DefaultButton>
            <DefaultButton onClick={dismiss} styles={buttonStyles(theme)}>
              <span>{strings?.captionsSettingCancelButtonLabel}</span>
            </DefaultButton>
          </Stack>
        </Modal>
      }
    </>
  );
};
