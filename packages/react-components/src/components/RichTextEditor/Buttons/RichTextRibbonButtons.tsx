// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ContextualMenuItemType, Icon, Theme } from '@fluentui/react';
import { KnownRibbonButtonKey, RibbonButton, getButtons } from 'roosterjs-react';
import { ribbonButtonStyle, ribbonDividerStyle } from '../../styles/RichTextEditor.styles';
import { insertTableButton } from './Table/RichTextInsertTableButton';
import React from 'react';

const MaxRowsNumber = 5;
const MaxColumnsNumber = 5;

const dividerRibbonButton = (theme: Theme, key: string): RibbonButton<string> => {
  return {
    key: key,
    // the icon will be set in `onRender` callback
    // this is needed to make the divider unavailable for keyboard navigation
    iconName: '',
    // no text is needed here
    unlocalizedText: '',
    onClick: () => {},
    isDisabled: () => true,
    commandBarProperties: {
      // show the item correctly for the overflow menu
      itemType: ContextualMenuItemType.Divider,
      // this is still needed to remove checkmark icon space even though it is a divider
      canCheck: false,
      onRender: () => <Icon iconName="RichTextDividerIcon" className={ribbonDividerStyle(theme)} />
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
  return createKnownRibbonButton(KnownRibbonButtonKey.NumberedList, theme, 'RichTextNumberListButtonIcon');
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
      },
      canCheck: false
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
    dividerRibbonButton(theme, 'RichTextRibbonTextFormatDivider'),
    bulletListButton(theme),
    numberListButton(theme),
    indentDecreaseButton(theme),
    indentIncreaseButton(theme),
    dividerRibbonButton(theme, 'RichTextRibbonTableDivider'),
    insertTableButton(theme, MaxRowsNumber, MaxColumnsNumber)
  ].forEach((item) => {
    if (item !== undefined) {
      buttons.push(item);
    }
  });

  return buttons;
};
