// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme } from '@fluentui/react';
import { KnownRibbonButtonKey, LocalizedStrings, RibbonButton, getButtons } from 'roosterjs-react';
import { ribbonButtonStyle, ribbonDividerStyle } from '../styles/RichTextEditor.styles';
import { RichTextSendBoxStrings } from './RichTextSendBox';

const dividerRibbonButton = (theme: Theme): RibbonButton<string> => {
  return {
    key: 'Divider',
    iconName: 'RichTextDividerIcon',
    unlocalizedText: '',
    onClick: () => {},
    isDisabled: () => true,
    commandBarProperties: {
      buttonStyles: ribbonDividerStyle(theme)
    }
  };
};

const boldButton = (theme: Theme): RibbonButton<string> | undefined => {
  return createKnownRibbonButton(KnownRibbonButtonKey.Bold, theme, 'RichTextBoldButtonIcon');
};

const italicButton = (theme: Theme): RibbonButton<string> | undefined => {
  return createKnownRibbonButton(KnownRibbonButtonKey.Italic, theme, 'RichTextItalicButtonIcon');
};

const underlineButton = (theme: Theme): RibbonButton<string> | undefined => {
  return createKnownRibbonButton(KnownRibbonButtonKey.Underline, theme, 'RichTextUnderlineButtonIcon');
};

const bulletListButton = (theme: Theme): RibbonButton<string> | undefined => {
  return createKnownRibbonButton(KnownRibbonButtonKey.BulletedList, theme, 'RichTextBulletListButtonIcon');
};

const numberListButton = (theme: Theme): RibbonButton<string> | undefined => {
  return createKnownRibbonButton(KnownRibbonButtonKey.NumberedList, theme, 'RichTexttNumberListButtonIcon');
};

const indentIncreaseButton = (theme: Theme): RibbonButton<string> | undefined => {
  return createKnownRibbonButton(KnownRibbonButtonKey.IncreaseIndent, theme, 'RichTextIndentIncreaseButtonIcon');
};

const indentDecreaseButton = (theme: Theme): RibbonButton<string> | undefined => {
  return createKnownRibbonButton(KnownRibbonButtonKey.DecreaseIndent, theme, 'RichTextIndentDecreaseButtonIcon');
};

const createKnownRibbonButton = (
  key: KnownRibbonButtonKey,
  theme: Theme,
  icon: string
): RibbonButton<string> | undefined => {
  const buttons = getButtons([key]);
  if (buttons.length > 0) {
    const button = buttons[0];
    // AllButtonStringKeys is a union of all the string keys of all the buttons
    const result = buttons[0] as RibbonButton<typeof button.key>;
    button.iconName = icon;
    button.commandBarProperties = {
      ...button.commandBarProperties,
      buttonStyles: {
        ...button.commandBarProperties?.buttonStyles,
        ...ribbonButtonStyle(theme)
      }
    };
    return result;
  }
  return undefined;
};

/**
 * @private
 */
export const ribbonButtons = (theme: Theme): RibbonButton<string>[] => {
  const buttons: RibbonButton<string>[] = [];
  [
    boldButton(theme),
    italicButton(theme),
    underlineButton(theme),
    dividerRibbonButton(theme),
    bulletListButton(theme),
    numberListButton(theme),
    indentIncreaseButton(theme),
    indentDecreaseButton(theme)
  ].forEach((item) => {
    if (item !== undefined) {
      buttons.push(item);
    }
  });

  return buttons;
};

/**
 * @private
 */
export const ribbonButtonsStrings = (strings: Partial<RichTextSendBoxStrings>): LocalizedStrings<string> => {
  return {
    buttonNameBold: strings.boldTooltip,
    buttonNameItalic: strings.italicTooltip,
    buttonNameUnderline: strings.underlineTooltip,
    buttonNameBulletedList: strings.bulletListTooltip,
    buttonNameNumberedList: strings.numberListTooltip,
    buttonNameIncreaseIndent: strings.increaseIndentTooltip,
    buttonNameDecreaseIndent: strings.decreaseIndentTooltip
  };
};
