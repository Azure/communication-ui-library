// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { useMemo, useCallback } from 'react';
/* @conditional-compile-remove(close-captions) */
import { useTheme } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsSettingsModal, AvailableSpokenLanguageStrings, AvailableCaptionLanguageStrings } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import {
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles
} from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { captionSettingsDrawerStyles } from './captionSettingsDrawer.styles';

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
export const CaptionSettingsDrawer = (props: {
  /* @conditional-compile-remove(close-captions) */ selectLanguage: (language: string) => void;
  /* @conditional-compile-remove(close-captions) */ setCurrentLanguage: (language: string) => void;
  /* @conditional-compile-remove(close-captions) */ currentLanguage: string;
  /* @conditional-compile-remove(close-captions) */ onLightDismiss: () => void;
  /* @conditional-compile-remove(close-captions) */ strings?: CaptionSettingsDrawerStrings;
  /* @conditional-compile-remove(close-captions) */ supportedLanguageStrings?: AvailableSpokenLanguageStrings|AvailableCaptionLanguageStrings
}): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const theme = useTheme();

  /* @conditional-compile-remove(close-captions) */
  const onDrawerItemClick = useCallback(
    (languageCode: string) => {
      props.selectLanguage(languageCode);
    },
    [props]
  );

  /* @conditional-compile-remove(close-captions) */
  const drawerItems: DrawerMenuItemProps[] = useMemo(() => {
    return Object.keys(props.supportedLanguageStrings ??[]).map((languageCode) => ({
      itemKey: languageCode,
      text: props.supportedLanguageStrings? props.supportedLanguageStrings[languageCode] : languageCode,
      onItemClick: () => onDrawerItemClick(languageCode),
      secondaryIconProps: props.currentLanguage === languageCode ? { iconName: 'Accept' } : undefined
    }));
  }, [
    props.currentLanguage,
    props.supportedLanguageStrings,
    onDrawerItemClick
  ]);

  /* @conditional-compile-remove(close-captions) */
  return (
    <DrawerMenu
      heading={props.strings?.menuTitle}
      items={drawerItems ?? []}
      onLightDismiss={() => {
        props.setCurrentLanguage(props.currentLanguage);
        props.onLightDismiss();
      }}
      styles={captionSettingsDrawerStyles(theme)}
    />
  );
  return <></>;
};
