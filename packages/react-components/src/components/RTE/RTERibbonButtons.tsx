// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme } from '@fluentui/react';
import { KnownRibbonButtonKey, RibbonButton, getButtons } from 'roosterjs-react';
import { ribbonButtonStyle, ribbonDividerStyle } from '../styles/RichTextEditor.styles';

const dividerRibbonButton = (theme: Theme): RibbonButton<string> => {
  return {
    key: 'Divider',
    iconName: 'RTEDividerIcon',
    unlocalizedText: '',
    onClick: () => {},
    isDisabled: () => true,
    commandBarProperties: {
      buttonStyles: ribbonDividerStyle(theme)
    }
  };
};

const boldButton = (theme: Theme): RibbonButton<string> => {
  return createKnownRibbonButton(KnownRibbonButtonKey.Bold, theme, 'RTEBoldButtonIcon');
};

const italicButton = (theme: Theme): RibbonButton<string> => {
  return createKnownRibbonButton(KnownRibbonButtonKey.Italic, theme, 'RTEItalicButtonIcon');
};

const underlineButton = (theme: Theme): RibbonButton<string> => {
  return createKnownRibbonButton(KnownRibbonButtonKey.Underline, theme, 'RTEUnderlineButtonIcon');
};

const bulletListButton = (theme: Theme): RibbonButton<string> => {
  return createKnownRibbonButton(KnownRibbonButtonKey.BulletedList, theme, 'RTEBulletListButtonIcon');
};

const numberListButton = (theme: Theme): RibbonButton<string> => {
  return createKnownRibbonButton(KnownRibbonButtonKey.NumberedList, theme, 'RTEtNumberListButtonIcon');
};

const indentIncreaseButton = (theme: Theme): RibbonButton<string> => {
  return createKnownRibbonButton(KnownRibbonButtonKey.IncreaseIndent, theme, 'RTEIndentIncreaseButtonIcon');
};

const indentDecreaseButton = (theme: Theme): RibbonButton<string> => {
  return createKnownRibbonButton(KnownRibbonButtonKey.DecreaseIndent, theme, 'RTEIndentDecreaseButtonIcon');
};

const createKnownRibbonButton = (key: KnownRibbonButtonKey, theme: Theme, icon: string): RibbonButton<string> => {
  const button = getButtons([key])[0] as RibbonButton<string>;
  button.iconName = icon;
  button.commandBarProperties = {
    ...button.commandBarProperties,
    buttonStyles: {
      ...button.commandBarProperties?.buttonStyles,
      ...ribbonButtonStyle(theme)
    }
  };
  return button;
};

/**
 * @private
 */
export const getRibbonButtons = (theme: Theme): RibbonButton<string>[] => {
  return [
    boldButton(theme),
    italicButton(theme),
    underlineButton(theme),
    dividerRibbonButton(theme),
    bulletListButton(theme),
    numberListButton(theme),
    indentIncreaseButton(theme),
    indentDecreaseButton(theme)
  ];
};
