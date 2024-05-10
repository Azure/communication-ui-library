// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useMemo } from 'react';
import { RichTextToolbarPlugin } from '../Plugins/RichTextToolbarPlugin';
import { CommandBar, ContextualMenuItemType, Icon } from '@fluentui/react';
import type { ICommandBarItemProps, Theme } from '@fluentui/react';
import {
  toolbarButtonStyle,
  ribbonDividerStyle,
  ribbonOverflowButtonStyle,
  richTextToolbarStyle
} from '../../styles/RichTextEditor.styles';
import { useTheme } from '../../../theming';
import { ContentModelFormatState } from 'roosterjs-content-model-types';
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleBullet,
  toggleNumbering,
  setIndentation
} from 'roosterjs-content-model-api';
import { insertTable } from './Table/insertTableAction';
import { RichTextSendBoxStrings } from '../RichTextSendBox';
import { richTextInsertTableCommandBarItem } from './Table/RichTextInsertTableCommandBarItem';

const MaxRowsNumber = 5;
const MaxColumnsNumber = 5;

/**
 * Props for {@link RichTextToolbar}.
 *
 * @private
 */
export interface RichTextToolbarProps {
  // The rich text toolbar plugin used for connect editor and the ribbon.
  plugin: RichTextToolbarPlugin;
  // Strings for localization.
  strings: Partial<RichTextSendBoxStrings>;
}

/**
 * A component to display rich text toolbar.
 *
 * @beta
 */
export const RichTextToolbar = (props: RichTextToolbarProps): JSX.Element => {
  const { plugin, strings } = props;
  const theme = useTheme();
  // need to re-render the buttons when format state changes
  const [formatState, setFormatState] = React.useState<ContentModelFormatState | undefined>(undefined);

  useEffect(() => {
    // update the format state on editor events
    plugin.onFormatChanged = setFormatState;
  }, [plugin]);

  const boldButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarBoldButton',
      icon: 'RichTextBoldButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleBold(editor);
        });
      },
      text: strings.boldTooltip,
      checked: formatState !== undefined && formatState.isBold === true,
      theme: theme
    });
  }, [formatState, plugin, strings.boldTooltip, theme]);

  const italicButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarItalicButton',
      icon: 'RichTextItalicButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleItalic(editor);
        });
      },
      text: strings.italicTooltip,
      checked: formatState !== undefined && formatState?.isItalic === true,
      theme: theme
    });
  }, [formatState, plugin, strings.italicTooltip, theme]);

  const underlineButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarUnderlineButton',
      icon: 'RichTextUnderlineButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleUnderline(editor);
        });
      },
      text: strings.underlineTooltip,
      checked: formatState !== undefined && formatState?.isUnderline === true,
      theme: theme
    });
  }, [formatState, plugin, strings.underlineTooltip, theme]);

  const bulletListButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarBulletListButton',
      icon: 'RichTextBulletListButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleBullet(editor);
        });
      },
      text: strings.bulletListTooltip,
      checked: formatState !== undefined && formatState?.isBullet === true,
      theme: theme
    });
  }, [formatState, plugin, strings.bulletListTooltip, theme]);

  const numberListButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarNumberListButton',
      icon: 'RichTextNumberListButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleNumbering(editor);
        });
      },
      text: strings.numberListTooltip,
      checked: formatState !== undefined && formatState?.isNumbering === true,
      theme: theme
    });
  }, [formatState, plugin, strings.numberListTooltip, theme]);

  const indentDecreaseButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarIndentDecreaseButton',
      icon: 'RichTextIndentDecreaseButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          setIndentation(editor, 'outdent');
        });
      },
      text: strings.decreaseIndentTooltip,
      canCheck: false,
      theme: theme
    });
  }, [plugin, strings.decreaseIndentTooltip, theme]);

  const indentIncreaseButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarIndentIncreaseButton',
      icon: 'RichTextIndentIncreaseButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          setIndentation(editor, 'indent');
        });
      },
      text: strings.increaseIndentTooltip,
      canCheck: false,
      theme: theme
    });
  }, [plugin, strings.increaseIndentTooltip, theme]);

  const divider = useCallback(
    (key: string) => {
      return dividerCommandBarItem(theme, key);
    },
    [theme]
  );

  const tableButton: ICommandBarItemProps = useMemo(() => {
    return richTextInsertTableCommandBarItem(
      theme,
      MaxRowsNumber,
      MaxColumnsNumber,
      strings,
      (column: number, row: number) => {
        plugin.onToolbarButtonClick((editor) => {
          //add format
          insertTable(editor, column, row);
          // when subMenuProps is used and the menu is dismissed, focus is set to the command bar item that opened the menu
          // set focus to editor on next re-render
          setTimeout(() => {
            editor.focus();
          });
        });
      }
    );
  }, [plugin, strings, theme]);

  const buttons: ICommandBarItemProps[] = useMemo(() => {
    return [
      boldButton,
      italicButton,
      underlineButton,
      divider('RichTextRibbonTextFormatDivider'),
      bulletListButton,
      numberListButton,
      indentDecreaseButton,
      indentIncreaseButton,
      divider('RichTextRibbonTableDivider'),
      tableButton
    ];
  }, [
    boldButton,
    italicButton,
    underlineButton,
    divider,
    bulletListButton,
    numberListButton,
    indentDecreaseButton,
    indentIncreaseButton,
    tableButton
  ]);

  const overflowButtonProps = useMemo(() => {
    return {
      ariaLabel: strings.richTextToolbarMoreButtonAriaLabel,
      styles: toolbarButtonStyle(theme),
      menuProps: {
        items: [], // CommandBar will determine items rendered in overflow
        isBeakVisible: false,
        styles: ribbonOverflowButtonStyle(theme)
      }
    };
  }, [strings.richTextToolbarMoreButtonAriaLabel, theme]);

  return (
    <CommandBar
      items={buttons}
      data-testid={'rich-text-editor-ribbon'}
      styles={richTextToolbarStyle}
      overflowButtonProps={overflowButtonProps}
    />
  );
};

const getCommandBarItem = ({
  key,
  icon,
  onClick,
  text,
  canCheck = true,
  checked = false,
  disabled = false,
  theme
}: {
  key: string;
  icon: string;
  onClick: () => void;
  text?: string;
  canCheck?: boolean;
  checked?: boolean;
  disabled?: boolean;
  theme: Theme;
}): ICommandBarItemProps => {
  return {
    key: key,
    iconProps: { iconName: icon },
    onClick: onClick,
    text: text,
    ariaLabel: text,
    iconOnly: true,
    canCheck: canCheck,
    buttonStyles: {
      ...toolbarButtonStyle(theme)
    },
    checked: checked,
    disabled: disabled
  };
};

const dividerCommandBarItem = (theme: Theme, key: string): ICommandBarItemProps => {
  return {
    key: key,
    disabled: true,
    // show the item correctly for the overflow menu
    itemType: ContextualMenuItemType.Divider,
    // this is still needed to remove checkmark icon space even though it is a divider
    canCheck: false,
    onRender: () => <Icon iconName="RichTextDividerIcon" className={ribbonDividerStyle(theme)} />
  };
};
