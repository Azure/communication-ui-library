// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useMemo, useCallback } from 'react';
import { _CaptionsSettingsModal, CaptionLanguageStrings, useTheme } from '@internal/react-components';
import {
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles
} from '@internal/react-components';
import { captionSettingsDrawerStyles } from './captionSettingsDrawer.styles';
import { _getKeys } from '@internal/acs-ui-common';

/** @private */
export interface CaptionSettingsDrawerStrings {
  /**
   * Label for spoken language/caption language drawerMenuItem
   *
   * @remarks Only displayed when in Teams call, disabled until captions is on
   */
  menuTitle: string;
}

/** @private */
export const CaptionLanguageSettingsDrawer = (props: {
  selectLanguage: (language: keyof CaptionLanguageStrings) => void;
  setCurrentLanguage: (language: keyof CaptionLanguageStrings) => void;
  currentLanguage: keyof CaptionLanguageStrings;
  onLightDismiss: () => void;
  strings?: CaptionSettingsDrawerStrings;
  supportedLanguageStrings?: CaptionLanguageStrings;
}): JSX.Element => {
  const theme = useTheme();

  const onDrawerItemClick = useCallback(
    (languageCode: keyof CaptionLanguageStrings) => {
      props.selectLanguage(languageCode);
    },
    [props]
  );

  const drawerItems: DrawerMenuItemProps[] = useMemo(() => {
    return _getKeys(props.supportedLanguageStrings ?? []).map((languageCode) => ({
      itemKey: languageCode,
      text: props.supportedLanguageStrings ? props.supportedLanguageStrings[languageCode] : languageCode,
      onItemClick: () => onDrawerItemClick(languageCode),
      secondaryIconProps: props.currentLanguage === languageCode ? { iconName: 'Accept' } : undefined
    }));
  }, [props.currentLanguage, props.supportedLanguageStrings, onDrawerItemClick]);

  const sortedDrawerItems: DrawerMenuItemProps[] = useMemo(() => {
    const copy = [...drawerItems];
    return copy.sort((a, b) => (a.text && b.text && a.text > b.text ? 1 : -1));
  }, [drawerItems]);

  return (
    <DrawerMenu
      heading={props.strings?.menuTitle}
      items={sortedDrawerItems ?? []}
      onLightDismiss={() => {
        props.setCurrentLanguage(props.currentLanguage);
        props.onLightDismiss();
      }}
      styles={captionSettingsDrawerStyles(theme)}
    />
  );
};
