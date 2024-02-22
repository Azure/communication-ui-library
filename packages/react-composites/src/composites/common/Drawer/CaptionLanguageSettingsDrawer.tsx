// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { useMemo, useCallback } from 'react';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsSettingsModal, CaptionLanguageStrings, useTheme } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import {
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles
} from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { captionSettingsDrawerStyles } from './captionSettingsDrawer.styles';
import { getKeys } from '../utils';

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
  /* @conditional-compile-remove(close-captions) */ selectLanguage: (language: keyof CaptionLanguageStrings) => void;
  /* @conditional-compile-remove(close-captions) */ setCurrentLanguage: (
    language: keyof CaptionLanguageStrings
  ) => void;
  /* @conditional-compile-remove(close-captions) */ currentLanguage: keyof CaptionLanguageStrings;
  /* @conditional-compile-remove(close-captions) */ onLightDismiss: () => void;
  /* @conditional-compile-remove(close-captions) */ strings?: CaptionSettingsDrawerStrings;
  /* @conditional-compile-remove(close-captions) */ supportedLanguageStrings?: CaptionLanguageStrings;
}): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const theme = useTheme();

  /* @conditional-compile-remove(close-captions) */
  const onDrawerItemClick = useCallback(
    (languageCode: keyof CaptionLanguageStrings) => {
      props.selectLanguage(languageCode);
    },
    [props]
  );

  /* @conditional-compile-remove(close-captions) */
  const drawerItems: DrawerMenuItemProps[] = useMemo(() => {
    return getKeys(props.supportedLanguageStrings ?? []).map((languageCode) => ({
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

  /* @conditional-compile-remove(close-captions) */
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
  return <></>;
};
