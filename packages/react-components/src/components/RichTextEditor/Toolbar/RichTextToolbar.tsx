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
  setIndentation,
  insertTable
} from 'roosterjs-content-model-api';
import { RichTextStrings } from '../RichTextSendBox';
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
  strings: Partial<RichTextStrings>;
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
    // plugin editor ready event may happen before onFormatChanged is set
    // call update format function to ensure the format state is set
    plugin.updateFormat();
  }, [plugin]);

  const boldButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      dataTestId: 'rich-text-toolbar-bold-button',
      key: 'RichTextToolbarBoldButton',
      icon: 'RichTextBoldButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleBold(editor);
        });
      },
      text: strings.richTextBoldTooltip,
      checked: formatState !== undefined && formatState.isBold === true,
      theme: theme
    });
  }, [formatState, plugin, strings.richTextBoldTooltip, theme]);

  const italicButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      dataTestId: 'rich-text-toolbar-italic-button',
      key: 'RichTextToolbarItalicButton',
      icon: 'RichTextItalicButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleItalic(editor);
        });
      },
      text: strings.richTextItalicTooltip,
      checked: formatState !== undefined && formatState?.isItalic === true,
      theme: theme
    });
  }, [formatState, plugin, strings.richTextItalicTooltip, theme]);

  const underlineButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      dataTestId: 'rich-text-toolbar-underline-button',
      key: 'RichTextToolbarUnderlineButton',
      icon: 'RichTextUnderlineButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          toggleUnderline(editor);
        });
      },
      text: strings.richTextUnderlineTooltip,
      checked: formatState !== undefined && formatState?.isUnderline === true,
      theme: theme
    });
  }, [formatState, plugin, strings.richTextUnderlineTooltip, theme]);

  const bulletListButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      dataTestId: 'rich-text-toolbar-bullet-list-button',
      key: 'RichTextToolbarBulletListButton',
      icon: 'RichTextBulletListButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          // check the format state to see if the bulleted list is already applied
          const isBullet = formatState?.isBullet;
          toggleBullet(editor);
          // the bulleted list was added
          if (!isBullet) {
            setTimeout(() => {
              // a small delay and polite aria live are needed for MacOS VoiceOver to announce the change
              editor.announce({ ariaLiveMode: 'polite', text: strings.richTextBulletedListAppliedAnnouncement });
            }, 50);
          }
        });
      },
      text: strings.richTextBulletListTooltip,
      checked: formatState !== undefined && formatState?.isBullet === true,
      theme: theme
    });
  }, [formatState, plugin, strings.richTextBulletListTooltip, strings.richTextBulletedListAppliedAnnouncement, theme]);

  const numberListButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      dataTestId: 'rich-text-toolbar-number-list-button',
      key: 'RichTextToolbarNumberListButton',
      icon: 'RichTextNumberListButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          // check the format state to see if the numbered list is already applied
          const isNumbering = formatState?.isNumbering;
          toggleNumbering(editor);
          // the numbered list was added
          if (!isNumbering) {
            // a small delay and polite aria live are needed for MacOS VoiceOver to announce the change
            setTimeout(() => {
              editor.announce({ ariaLiveMode: 'polite', text: strings.richTextNumberedListAppliedAnnouncement });
            }, 50);
          }
        });
      },
      text: strings.richTextNumberListTooltip,
      checked: formatState !== undefined && formatState?.isNumbering === true,
      theme: theme
    });
  }, [formatState, plugin, strings.richTextNumberListTooltip, strings.richTextNumberedListAppliedAnnouncement, theme]);

  const indentDecreaseButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      dataTestId: 'rich-text-toolbar-indent-decrease-button',
      key: 'RichTextToolbarIndentDecreaseButton',
      icon: 'RichTextIndentDecreaseButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          setIndentation(editor, 'outdent');
        });
      },
      text: strings.richTextDecreaseIndentTooltip,
      canCheck: false,
      theme: theme
    });
  }, [plugin, strings.richTextDecreaseIndentTooltip, theme]);

  const indentIncreaseButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      dataTestId: 'rich-text-toolbar-indent-increase-button',
      key: 'RichTextToolbarIndentIncreaseButton',
      icon: 'RichTextIndentIncreaseButtonIcon',
      onClick: () => {
        plugin.onToolbarButtonClick((editor) => {
          setIndentation(editor, 'indent');
        });
      },
      text: strings.richTextIncreaseIndentTooltip,
      canCheck: false,
      theme: theme
    });
  }, [plugin, strings.richTextIncreaseIndentTooltip, theme]);

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
      data-testid={'rich-text-editor-toolbar'}
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
  theme,
  dataTestId
}: {
  key: string;
  icon: string;
  onClick: () => void;
  text?: string;
  canCheck?: boolean;
  checked?: boolean;
  disabled?: boolean;
  theme: Theme;
  dataTestId: string;
}): ICommandBarItemProps => {
  return {
    role: canCheck ? 'menuitemcheckbox' : 'menuitem',
    'aria-checked': canCheck ? checked : undefined, // `menuitem` role doesn't support `aria-checked`
    'data-testid': dataTestId,
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
