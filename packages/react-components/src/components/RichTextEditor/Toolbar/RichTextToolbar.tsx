// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useMemo } from 'react';
import { RichTextToolbarPlugin } from '../Plugins/RichTextToolbarPlugin';
import { CommandBar, ContextualMenuItemType, Icon } from '@fluentui/react';
import type { ICommandBarItemProps, Theme } from '@fluentui/react';
import { ribbonButtonStyle, ribbonDividerStyle, richTextToolbarStyle } from '../../styles/RichTextEditor.styles';
import { useTheme } from '../../../theming';
import { ContentModelFormatState, IEditor } from 'roosterjs-content-model-types';
import {
  toggleBold,
  getFormatState,
  toggleItalic,
  toggleUnderline,
  toggleBullet,
  toggleNumbering
} from 'roosterjs-content-model-api';
import { RichTextSendBoxStrings } from '../RichTextSendBox';

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
    //set the initial state of formatState
    if (plugin.editor) {
      setFormatState(getFormatState(plugin.editor));
    }
  }, [plugin]);

  const onClickWrapper = useCallback(
    (onClick: (editor: IEditor) => void) => {
      if (plugin.editor) {
        onClick(plugin.editor);
        setFormatState(getFormatState(plugin.editor));
      }
    },
    [plugin.editor]
  );
  const boldButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarBoldButton',
      icon: 'RichTextBoldButtonIcon',
      onClick: () => {
        onClickWrapper((editor) => {
          toggleBold(editor);
        });
      },
      text: strings.boldTooltip,
      checked: formatState !== undefined && formatState?.isBold === true,
      theme: theme
    });
  }, [formatState, onClickWrapper, strings.boldTooltip, theme]);

  const italicButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarItalicButton',
      icon: 'RichTextItalicButtonIcon',
      onClick: () => {
        onClickWrapper((editor) => {
          toggleItalic(editor);
        });
      },
      text: strings.italicTooltip,
      checked: formatState !== undefined && formatState?.isItalic === true,
      theme: theme
    });
  }, [formatState, onClickWrapper, strings.italicTooltip, theme]);

  const underlineButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarUnderlineButton',
      icon: 'RichTextUnderlineButtonIcon',
      onClick: () => {
        onClickWrapper((editor) => {
          toggleUnderline(editor);
        });
      },
      text: strings.underlineTooltip,
      checked: formatState !== undefined && formatState?.isUnderline === true,
      theme: theme
    });
  }, [formatState, onClickWrapper, strings.underlineTooltip, theme]);

  const bulletListButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarBulletListButton',
      icon: 'RichTextBulletListButtonIcon',
      onClick: () => {
        onClickWrapper((editor) => {
          toggleBullet(editor);
        });
      },
      text: strings.bulletListTooltip,
      checked: formatState !== undefined && formatState?.isBullet === true,
      theme: theme
    });
  }, [formatState, onClickWrapper, strings.bulletListTooltip, theme]);

  const numberListButton: ICommandBarItemProps = useMemo(() => {
    return getCommandBarItem({
      key: 'RichTextToolbarNumberListButton',
      icon: 'RichTextNumberListButtonIcon',
      onClick: () => {
        onClickWrapper((editor) => {
          toggleNumbering(editor);
        });
      },
      text: strings.numberListTooltip,
      checked: formatState !== undefined && formatState?.isNumbering === true,
      theme: theme
    });
  }, [formatState, onClickWrapper, strings.numberListTooltip, theme]);

  const divider = useCallback(
    (key: string) => {
      return dividerCommandBarItem(theme, key);
    },
    [theme]
  );

  const buttons: ICommandBarItemProps[] = useMemo(() => {
    return [
      boldButton,
      italicButton,
      underlineButton,
      divider('RichTextRibbonTextFormatDivider'),
      /*divider*/ bulletListButton,
      numberListButton /*divider table*/
    ];
  }, [boldButton, italicButton, underlineButton, divider, bulletListButton, numberListButton]);

  return (
    <CommandBar
      items={buttons}
      data-testid={'rich-text-editor-ribbon'}
      styles={richTextToolbarStyle}
      // {...props}
      // overflowButtonProps={{
      //   ariaLabel: getLocalizedString<string, string>(strings, moreCommandsBtn.key, moreCommandsBtn.unlocalizedText),
      //   ...props?.overflowButtonProps
      // }}
    />
  );
};

const getCommandBarItem = ({
  key,
  icon,
  onClick,
  text,
  canCheck = true,
  checked,
  disabled = false,
  theme
}: {
  key: string;
  icon: string;
  onClick: () => void;
  text?: string;
  canCheck?: boolean;
  checked: boolean;
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
      ...ribbonButtonStyle(theme)
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
