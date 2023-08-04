// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useCallback, useEffect } from 'react';
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
  DefaultButton,
  PrimaryButton
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
import { _preventDismissOnEvent } from '@internal/acs-ui-common';

/**
 * @internal
 * strings for captions setting modal
 */
export interface _CaptionsSettingsModalStrings {
  captionsSettingsModalTitle?: string;
  captionsSettingsDropdownLabel?: string;
  captionsSettingsDropdownInfoText?: string;
  captionsSettingsConfirmButtonLabel?: string;
  captionsSettingsCancelButtonLabel?: string;
  captionsSettingsModalAriaLabel?: string;
  captionsSettingsCloseModalButtonAriaLabel?: string;
}

/**
 * @internal
 * _CaptionsSettingsModal Component Props.
 */
export interface _CaptionsSettingsModalProps {
  supportedSpokenLanguages: string[];
  onSetSpokenLanguage: (language: string) => Promise<void>;
  onStartCaptions: (options?: _captionsOptions) => Promise<void>;
  currentSpokenLanguage: string;
  captionsAvailableLanguageStrings?: CaptionsAvailableLanguageStrings;
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

  const [hasSetSpokenLanguage, setHasSetSpokenLanguage] = useState(false);

  const onDismiss = useCallback((): void => {
    if (onDismissCaptionsSettings) {
      onDismissCaptionsSettings();
    }
  }, [onDismissCaptionsSettings]);

  useEffect(() => {
    // set spoken language when start captions with a spoken language specified.
    // this is to fix the bug when a second user starts captions with a new spoken language, captions bot ignore that spoken language
    if (isCaptionsFeatureActive && !hasSetSpokenLanguage) {
      onSetSpokenLanguage(selectedItem.key.toString());
      // we only need to call set spoken language once when first starting captions
      setHasSetSpokenLanguage(true);
    }
  }, [isCaptionsFeatureActive, onSetSpokenLanguage, selectedItem.key, hasSetSpokenLanguage]);

  const onConfirm = useCallback(async (): Promise<void> => {
    const languageCode = selectedItem.key.toString();
    if (isCaptionsFeatureActive) {
      onSetSpokenLanguage(languageCode);
    } else {
      await onStartCaptions({ spokenLanguage: languageCode });
    }
    onDismiss();
  }, [onDismiss, isCaptionsFeatureActive, onSetSpokenLanguage, onStartCaptions, selectedItem.key]);

  const dropdownOptions: IDropdownOption[] = useMemo(() => {
    return supportedSpokenLanguages.map((languageCode) => {
      return {
        key: languageCode,
        text: captionsAvailableLanguageStrings ? captionsAvailableLanguageStrings[languageCode] : languageCode
      };
    });
  }, [supportedSpokenLanguages, captionsAvailableLanguageStrings]);

  const onChange = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption | undefined): void => {
    if (option) {
      setSelectedItem(option);
    }
  };

  const calloutProps = useMemo(
    () => ({
      preventDismissOnEvent: _preventDismissOnEvent
    }),
    []
  );

  const CaptionsSettingsComponent = useCallback((): JSX.Element => {
    return (
      <Stack>
        <Dropdown
          label={strings?.captionsSettingsDropdownLabel}
          selectedKey={selectedItem ? selectedItem.key : undefined}
          onChange={onChange}
          calloutProps={calloutProps}
          placeholder={currentSpokenLanguage !== '' ? currentSpokenLanguage : defaultSpokenLanguage}
          options={dropdownOptions}
          styles={dropdownStyles}
        />
        <Text className={dropdownInfoTextStyle(theme)}>{strings?.captionsSettingsDropdownInfoText}</Text>
      </Stack>
    );
  }, [
    calloutProps,
    currentSpokenLanguage,
    dropdownOptions,
    selectedItem,
    strings?.captionsSettingsDropdownInfoText,
    strings?.captionsSettingsDropdownLabel,
    theme
  ]);

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
          onDismiss={onDismiss}
          isBlocking={true}
          styles={CaptionsSettingsModalStyle}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
            <Text className={titleClassName}>{strings?.captionsSettingsModalTitle}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings?.captionsSettingsCloseModalButtonAriaLabel}
              onClick={onDismiss}
              style={{ color: theme.palette.black }}
            />
          </Stack>

          <Stack className={dropdownContainerClassName}>{CaptionsSettingsComponent()}</Stack>
          <Stack horizontal horizontalAlign="end" className={buttonsContainerClassName}>
            <PrimaryButton styles={buttonStyles(theme)} onClick={onConfirm}>
              <span>{strings?.captionsSettingsConfirmButtonLabel}</span>
            </PrimaryButton>
            <DefaultButton onClick={onDismiss} styles={buttonStyles(theme)}>
              <span>{strings?.captionsSettingsCancelButtonLabel}</span>
            </DefaultButton>
          </Stack>
        </Modal>
      }
    </>
  );
};
