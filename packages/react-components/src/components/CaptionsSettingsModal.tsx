// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback } from 'react';
import { useMemo, useState, useEffect } from 'react';
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
import { CaptionsOptions } from './StartCaptionsButton';
import { defaultSpokenLanguage } from './utils';
import {
  SpokenLanguageStrings,
  CaptionLanguageStrings,
  _spokenLanguageToCaptionLanguage,
  SupportedSpokenLanguage,
  SupportedCaptionLanguage,
  SpokenLanguageDropdownOptions,
  CaptionLanguageDropdownOptions
} from '../types';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';

/**
 * @public
 * strings for captions setting modal
 */
export interface CaptionsSettingsModalStrings {
  /**
   * Title for the modal
   */
  captionsSettingsModalTitle?: string;
  /**
   * Label for the spoken language dropdown menu
   */
  captionsSettingsSpokenLanguageDropdownLabel?: string;
  /**
   * Label for the caption language dropdown menu
   */
  captionsSettingsCaptionLanguageDropdownLabel?: string;
  /**
   * Disclaimer for the spoken language dropdown menu
   */
  captionsSettingsSpokenLanguageDropdownInfoText?: string;
  /**
   * Disclaimer for the caption language dropdown menu
   */
  captionsSettingsCaptionLanguageDropdownInfoText?: string;
  /**
   * Label for the confirm button
   */
  captionsSettingsConfirmButtonLabel?: string;
  /**
   * Label for the cancel button
   */
  captionsSettingsCancelButtonLabel?: string;
  /**
   * Aria label for the modal
   */
  captionsSettingsModalAriaLabel?: string;
  /**
   * Aria label for the close modal button
   */
  captionsSettingsCloseModalButtonAriaLabel?: string;
}

/**
 * @public
 * CaptionsSettingsModal Component Props.
 */
export interface CaptionsSettingsModalProps {
  /**
   * List of supported spoken languages
   */
  supportedSpokenLanguages: SupportedSpokenLanguage[];
  /**
   * List of supported caption languages
   */
  supportedCaptionLanguages?: SupportedCaptionLanguage[];
  /**
   * Callback to set spoken language
   */
  onSetSpokenLanguage: (language: SupportedSpokenLanguage) => Promise<void>;
  /**
   * Callback to set caption language
   */
  onSetCaptionLanguage?: (language: SupportedCaptionLanguage) => Promise<void>;
  /**
   * Callback to start captions
   */
  onStartCaptions: (options?: CaptionsOptions) => Promise<void>;
  /**
   * Current spoken language
   */
  currentSpokenLanguage: SupportedSpokenLanguage;
  /**
   * Current caption language
   */
  currentCaptionLanguage?: SupportedCaptionLanguage;
  /**
   * 1 to 1 mapping between language code and language string for spoken languages
   */
  spokenLanguageStrings?: SpokenLanguageStrings;
  /**
   * 1 to 1 mapping between language code and language string for caption languages
   */
  captionLanguageStrings?: CaptionLanguageStrings;
  /**
   * Flag to indicate if captions feature is active
   */
  isCaptionsFeatureActive?: boolean;
  /**
   * Strings for the captions settings modal
   */
  strings?: CaptionsSettingsModalStrings;
  /**
   * Flag to show the modal
   */
  showModal?: boolean;
  /**
   * Callback that is triggered when the modal is dismissed
   */
  onDismissCaptionsSettings?: () => void;
  /**
   * Flag to show the caption language dropdown
   */
  changeCaptionLanguage?: boolean;
}

/**
 * @public
 * a component for setting spoken languages
 */
export const CaptionsSettingsModal = (props: CaptionsSettingsModalProps): JSX.Element => {
  const {
    supportedSpokenLanguages,
    supportedCaptionLanguages,
    currentSpokenLanguage,
    currentCaptionLanguage,
    isCaptionsFeatureActive,
    showModal,
    onSetSpokenLanguage,
    onSetCaptionLanguage,
    onDismissCaptionsSettings,
    onStartCaptions,
    changeCaptionLanguage = false
  } = props;
  const theme = useTheme();
  const strings = props.strings;
  const spokenLanguageStrings = props.spokenLanguageStrings;
  const captionLanguageStrings = props.captionLanguageStrings;
  const [hasSetSpokenLanguage, setHasSetSpokenLanguage] = useState(false);

  const [selectedSpokenLanguage, setSelectedSpokenLanguage] = useState<SpokenLanguageDropdownOptions>({
    key: currentSpokenLanguage || defaultSpokenLanguage,
    text: currentSpokenLanguage || defaultSpokenLanguage
  });

  const [selectedCaptionLanguage, setSelectedCaptionLanguage] = useState<CaptionLanguageDropdownOptions>({
    key:
      currentCaptionLanguage ||
      (_spokenLanguageToCaptionLanguage[selectedSpokenLanguage.key] as keyof CaptionLanguageStrings),
    text: currentCaptionLanguage || _spokenLanguageToCaptionLanguage[selectedSpokenLanguage.key]
  });

  useEffect(() => {
    // set spoken language when start captions with a spoken language specified.
    // this is to fix the bug when a second user starts captions with a new spoken language, captions bot ignore that spoken language
    if (isCaptionsFeatureActive && !hasSetSpokenLanguage) {
      onSetSpokenLanguage(selectedSpokenLanguage.key);
      // we only need to call set spoken language once when first starting captions
      setHasSetSpokenLanguage(true);
    }
  }, [isCaptionsFeatureActive, onSetSpokenLanguage, selectedSpokenLanguage.key, hasSetSpokenLanguage]);

  const onDismiss = useCallback((): void => {
    if (onDismissCaptionsSettings) {
      onDismissCaptionsSettings();
    }
  }, [onDismissCaptionsSettings]);

  const onConfirm = useCallback(async (): Promise<void> => {
    const spokenLanguageCode = selectedSpokenLanguage.key;
    const captionLanguageCode = selectedCaptionLanguage.key;
    if (isCaptionsFeatureActive) {
      onSetSpokenLanguage(spokenLanguageCode);
      if (changeCaptionLanguage) {
        onSetCaptionLanguage && onSetCaptionLanguage(captionLanguageCode);
      }
    } else {
      await onStartCaptions({ spokenLanguage: spokenLanguageCode });
    }
    onDismiss();
  }, [
    onDismiss,
    isCaptionsFeatureActive,
    onSetSpokenLanguage,
    onSetCaptionLanguage,
    onStartCaptions,
    selectedSpokenLanguage.key,
    selectedCaptionLanguage.key,
    changeCaptionLanguage
  ]);

  const spokenLanguageDropdownOptions: IDropdownOption[] = useMemo(() => {
    return supportedSpokenLanguages.map((languageCode) => {
      return {
        key: languageCode,
        text: spokenLanguageStrings ? spokenLanguageStrings[languageCode] : languageCode
      };
    });
  }, [supportedSpokenLanguages, spokenLanguageStrings]);

  const captionLanguageDropdownOptions: IDropdownOption[] | undefined = useMemo(() => {
    return supportedCaptionLanguages?.map((languageCode) => {
      return {
        key: languageCode,
        text: captionLanguageStrings ? captionLanguageStrings[languageCode] : languageCode
      };
    });
  }, [supportedCaptionLanguages, captionLanguageStrings]);

  const sortedSpokenLanguageDropdownOptions: IDropdownOption[] = useMemo(() => {
    const copy = [...spokenLanguageDropdownOptions];
    return copy.sort((a, b) => (a.text > b.text ? 1 : -1));
  }, [spokenLanguageDropdownOptions]);

  const sortedCaptionLanguageDropdownOptions: IDropdownOption[] = useMemo(() => {
    const copy = [...(captionLanguageDropdownOptions ?? [])];
    return copy.sort((a, b) => (a.text > b.text ? 1 : -1));
  }, [captionLanguageDropdownOptions]);

  const onSpokenLanguageChange = (
    event: React.FormEvent<HTMLDivElement>,
    option: SpokenLanguageDropdownOptions | undefined
  ): void => {
    if (option) {
      setSelectedSpokenLanguage(option);
    }
  };

  const onCaptionLanguageChange = (
    event: React.FormEvent<HTMLDivElement>,
    option: CaptionLanguageDropdownOptions | undefined
  ): void => {
    if (option) {
      setSelectedCaptionLanguage(option);
    }
  };

  const calloutProps = useMemo(
    () => ({
      preventDismissOnEvent: _preventDismissOnEvent
    }),
    []
  );

  const CaptionsSettingsComponent = useCallback((): JSX.Element => {
    const placeholderSpokenLanguage = currentSpokenLanguage ?? defaultSpokenLanguage;
    const placeholderCaptionLanguage =
      currentCaptionLanguage ?? _spokenLanguageToCaptionLanguage[placeholderSpokenLanguage];
    return (
      <Stack>
        <Dropdown
          label={strings?.captionsSettingsSpokenLanguageDropdownLabel}
          selectedKey={selectedSpokenLanguage ? selectedSpokenLanguage.key : undefined}
          onChange={(ev, option) => onSpokenLanguageChange(ev, option as SpokenLanguageDropdownOptions)}
          calloutProps={calloutProps}
          placeholder={placeholderSpokenLanguage}
          options={sortedSpokenLanguageDropdownOptions}
          styles={dropdownStyles}
        />
        <Text className={dropdownInfoTextStyle(theme)}>{strings?.captionsSettingsSpokenLanguageDropdownInfoText}</Text>
        {changeCaptionLanguage && (
          <>
            <Dropdown
              label={strings?.captionsSettingsCaptionLanguageDropdownLabel}
              selectedKey={selectedCaptionLanguage ? selectedCaptionLanguage.key : undefined}
              onChange={(ev, option) => onCaptionLanguageChange(ev, option as CaptionLanguageDropdownOptions)}
              calloutProps={calloutProps}
              placeholder={placeholderCaptionLanguage}
              options={sortedCaptionLanguageDropdownOptions}
              styles={dropdownStyles}
            />
            <Text className={dropdownInfoTextStyle(theme)}>
              {strings?.captionsSettingsCaptionLanguageDropdownInfoText}
            </Text>
          </>
        )}
      </Stack>
    );
  }, [
    calloutProps,
    currentSpokenLanguage,
    currentCaptionLanguage,
    sortedSpokenLanguageDropdownOptions,
    sortedCaptionLanguageDropdownOptions,
    selectedCaptionLanguage,
    selectedSpokenLanguage,
    strings?.captionsSettingsSpokenLanguageDropdownInfoText,
    strings?.captionsSettingsCaptionLanguageDropdownLabel,
    strings?.captionsSettingsSpokenLanguageDropdownLabel,
    strings?.captionsSettingsCaptionLanguageDropdownInfoText,
    theme,
    changeCaptionLanguage
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
