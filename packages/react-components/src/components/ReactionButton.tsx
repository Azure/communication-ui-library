// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import {
  ContextualMenuItemType,
  DefaultPalette,
  IButtonStyles,
  IContextualMenuItem,
  mergeStyles,
  Theme,
  useTheme
} from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import React, { useState } from 'react';
/* @conditional-compile-remove(reaction) */
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
/* @conditional-compile-remove(reaction) */
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
/* @conditional-compile-remove(reaction) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(reaction) */
import { reactionEmoji } from './utils/videoTileStylesUtils';
/* @conditional-compile-remove(reaction) */
import { emojiStyles, reactionEmojiMenuStyles } from './styles/ReactionButton.styles';

/* @conditional-compile-remove(reaction) */
/**
 * Props for {@link ReactionButton}.
 *
 * @beta
 */
export interface ReactionButtonProps extends ControlBarButtonProps {
  /**
   * Optional strings to override in component
   */
  strings?: Partial<ReactionButtonStrings>;
  /**
   * Click event to send reaction to meeting
   */
  onReactionClicked: (reaction: string) => Promise<void>;
}

/* @conditional-compile-remove(reaction) */
/**
 * Strings of {@link ReactionButton} that can be overridden.
 *
 * @beta
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
 * A button to send reactions.
 *
 * Can be used with {@link ControlBar}.
 *
 * @beta
 */
export const ReactionButton = (props: ReactionButtonProps): JSX.Element => {
  const localeStrings = useLocale().strings.reactionButton;
  const strings = { ...localeStrings, ...props.strings };
  const theme = useTheme();
  const styles = reactionButtonStyles(theme);
  const onRenderIcon = (): JSX.Element => <_HighContrastAwareIcon iconName="ReactionButtonIcon" />;

  const [isHoveredMap, setIsHoveredMap] = useState(new Map());
  const emojis = ['like', 'heart', 'laugh', 'applause', 'surprised'];

  const renderEmoji = (item: IContextualMenuItem, dismissMenu: () => void): React.JSX.Element => (
    <div style={reactionEmojiMenuStyles()}>
      {emojis.map((emoji, index) => (
        <div
          key={index}
          onClick={() => {
            props.onReactionClicked(emoji);
            setIsHoveredMap((prevMap) => {
              return new Map(prevMap).set(emoji, false);
            });
            dismissMenu();
          }}
          style={emojiStyles(reactionEmoji.get(emoji), isHoveredMap.get(emoji) ? 'running' : 'paused')}
          onMouseEnter={() =>
            setIsHoveredMap((prevMap) => {
              return new Map(prevMap).set(emoji, true);
            })
          }
          onMouseLeave={() =>
            setIsHoveredMap((prevMap) => {
              return new Map(prevMap).set(emoji, false);
            })
          }
        />
      ))}
    </div>
  );

  const emojiList: IContextualMenuItem[] = [
    { key: 'reactions', itemType: ContextualMenuItemType.Normal, onRender: renderEmoji }
  ];

  return (
    <ControlBarButton
      {...props}
      className={mergeStyles(styles, props.styles)}
      menuProps={{
        shouldFocusOnMount: true,
        items: emojiList
      }}
      onRenderIcon={props.onRenderIcon ?? onRenderIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'reactionButtonLabel'}
      onRenderMenuIcon={() => <div />}
    />
  );
};

/* @conditional-compile-remove(reaction) */
const reactionButtonStyles = (theme: Theme): IButtonStyles => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white
  },
  rootCheckedHovered: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white
  },
  labelChecked: { color: DefaultPalette.white }
});
