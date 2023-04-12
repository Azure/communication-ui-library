// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useTheme } from '@internal/react-components';
import React from 'react';
import { _CaptionsSettingsModal } from '@internal/react-components';
import { _changeSpokenLanguageSelector } from '@internal/calling-component-bindings';
import {
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles
} from '@internal/react-components';
import { useAdaptedSelector } from '../../CallComposite/hooks/useAdaptedSelector';
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
import { spokenLanguageDrawerStyles } from './SpokenLanguageDrawer.styles';

/** @private */
export interface SpokenLanguageDrawerStrings {
  /**
   * Label for spokenLanguage drawerMenuItem
   *
   * @remarks Only displayed when in Teams call, disabled until captions is on
   */
  spokenLanguageMenuTitle: string;
}

/** @private */
export const SpokenLanguageDrawer = (props: {
  setCurrentSpokenLanguage: (language: string) => void;
  currentSpokenLanguage: string;
  onLightDismiss: () => void;
  strings: SpokenLanguageDrawerStrings;
}): JSX.Element => {
  const theme = useTheme();

  /* @conditional-compile-remove(close-captions) */
  const changeSpokenLanguageProps = useAdaptedSelector(_changeSpokenLanguageSelector);
  /* @conditional-compile-remove(close-captions) */
  const changeSpokenLanguageHandlers = useHandlers(_CaptionsSettingsModal);

  /* @conditional-compile-remove(close-captions) */
  const spokenLanguageDrawerItems: DrawerMenuItemProps[] | undefined =
    changeSpokenLanguageProps?.supportedSpokenLanguages?.map((language) => ({
      itemKey: language,
      text: language,
      onItemClick: () => {
        props.setCurrentSpokenLanguage(language);
      },
      secondaryIconProps: props.currentSpokenLanguage === language ? { iconName: 'Accept' } : undefined
    }));

  return (
    <DrawerMenu
      heading={props.strings.spokenLanguageMenuTitle}
      items={spokenLanguageDrawerItems ?? []}
      onLightDismiss={() => {
        changeSpokenLanguageHandlers.onSetSpokenLanguage(props.currentSpokenLanguage);
        props.onLightDismiss();
      }}
      styles={spokenLanguageDrawerStyles(theme)}
    />
  );
};
