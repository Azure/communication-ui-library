// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { useTheme } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsSettingsModal } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _changeSpokenLanguageSelector } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(close-captions) */
import {
  _DrawerMenu as DrawerMenu,
  _DrawerMenuItemProps as DrawerMenuItemProps,
  _DrawerMenuStyles
} from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
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
  /* @conditional-compile-remove(close-captions) */ setCurrentSpokenLanguage: (language: string) => void;
  /* @conditional-compile-remove(close-captions) */ currentSpokenLanguage: string;
  /* @conditional-compile-remove(close-captions) */ onLightDismiss: () => void;
  /* @conditional-compile-remove(close-captions) */ strings: SpokenLanguageDrawerStrings;
}): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
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

  /* @conditional-compile-remove(close-captions) */
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
  return <></>;
};
