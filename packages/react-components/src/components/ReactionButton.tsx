import {
  DefaultPalette,
  IButtonStyles,
  IContextualMenuItem,
  IContextualMenuItemStyles,
  IContextualMenuStyles,
  mergeStyles,
  Theme,
  useTheme
} from '@fluentui/react';
import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
import { useLocale } from '../localization';

/* @conditional-compile-remove(reaction) */
/**
 * Props for {@link ReactionButton}.
 *
 * @public
 */
export interface ReactionButtonProps extends ControlBarButtonProps {
  /**
   * Optional strings to override in component
   */
  strings?: Partial<ReactionButtonStrings>;
  /**
   * Click event to send reaction to meeting
   */
  onReactionClicked: (emoji: string) => Promise<void>;
}

/* @conditional-compile-remove(reaction) */
/**
 * Strings of {@link ReactionButton} that can be overridden.
 *
 * @public
 */
export interface ReactionButtonStrings {
  /** Label of the button. */
  label: string;
  /** * Tooltip content when the button is disabled. */
  tooltipDisabledContent?: string;
  /** Tooltip content when the button is enabled. */
  tooltipContent?: string;
}

/* @conditional-compile-remove(reaction) */
/**
 * Styles for flyouts used by various buttons for device selection flyouts.
 *
 * @internal
 */
export interface ReactionMenuStyles extends IContextualMenuStyles {
  menuItemStyles?: IContextualMenuItemStyles;
}

/* @conditional-compile-remove(reaction) */
/**
 * A button to send reactions.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const ReactionButton = (props: ReactionButtonProps): JSX.Element => {
  const localeStrings = useLocale().strings.reactionButton;
  const strings = { ...localeStrings, ...props.strings };
  const theme = useTheme();
  const styles = reactionButtonStyles(theme);
  const onRenderIcon = (): JSX.Element => <_HighContrastAwareIcon iconName="Emoji2" />;

  const emojiList: IContextualMenuItem[] = [
    { key: 'like', text: '👍', itemProps: { style: { width: 20 } } },
    { key: 'heart', text: '❤️', itemProps: { style: { width: 20 } } },
    { key: 'laugh', text: '😂', itemProps: { style: { width: 20 } } },
    { key: 'applause', text: '👏', itemProps: { style: { width: 20 } } },
    { key: 'surprised', text: '😮', itemProps: { style: { width: 20 } } }
  ];
  return (
    <ControlBarButton
      {...props}
      className={mergeStyles(styles, props.styles)}
      menuProps={{
        shouldFocusOnMount: true,
        items: emojiList.map((emoji) => ({
          ...emoji,
          onClick: () => {
            props.onReactionClicked(emoji.key);
          }
        })),
        styles: {
          container: {
            display: 'flex',
            flexDirection: 'row'
          },
          root: {
            padding: '10px'
          }
        }
      }}
      onRenderIcon={props.onRenderIcon ?? onRenderIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'reactionButtonLabel'}
    />
  );
};

/* @conditional-compile-remove(reaction) */
const reactionButtonStyles = (theme: Theme): IButtonStyles => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white,
    ':focus::after': { outlineColor: `${DefaultPalette.white}` }
  },
  rootCheckedHovered: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white,
    ':focus::after': { outlineColor: `${DefaultPalette.white}` }
  },
  labelChecked: { color: DefaultPalette.white }
});
