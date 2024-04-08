// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import {
  ContextualMenuItemType,
  DefaultPalette,
  IButtonStyles,
  ICalloutContentStyles,
  IconButton,
  IContextualMenuItem,
  mergeStyles,
  Theme,
  TooltipHost,
  useTheme
} from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import React from 'react';
/* @conditional-compile-remove(reaction) */
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
/* @conditional-compile-remove(reaction) */
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
/* @conditional-compile-remove(reaction) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(reaction) */
import { emojiStyles, reactionEmojiMenuStyles, reactionToolTipHostStyle } from './styles/ReactionButton.styles';
/* @conditional-compile-remove(reaction) */
import { isDarkThemed } from '../theming/themeUtils';
/* @conditional-compile-remove(reaction) */
import { ReactionResources } from '..';
/* @conditional-compile-remove(reaction) */
import { getEmojiFrameCount } from './VideoGallery/utils/videoGalleryLayoutUtils';

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
  onReactionClick: (reaction: string) => Promise<void>;
  /**
   * Reaction resource locator and parameters
   */
  reactionResources: ReactionResources;
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
  /** Aria label for reaction button accessibility announcement */
  ariaLabel: string;
  /** Tooltip content when the button is disabled. */
  tooltipDisabledContent?: string;
  /** Tooltip content when the button is enabled. */
  tooltipContent?: string;
  /** Tooltip content of like reaction button. */
  likeReactionTooltipContent?: string;
  /** Tooltip content of heart reaction button. */
  heartReactionTooltipContent?: string;
  /** Tooltip content of clap reaction button. */
  applauseReactionTooltipContent?: string;
  /** Tooltip content of laugh reaction button. */
  laughReactionTooltipContent?: string;
  /** Tooltip content of surprised reaction button. */
  surprisedReactionTooltipContent?: string;
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
  const onRenderIcon = (): JSX.Element => (
    <_HighContrastAwareIcon disabled={props.disabled} iconName="ReactionButtonIcon" />
  );

  const emojis = ['like', 'heart', 'applause', 'laugh', 'surprised'];
  const emojiButtonTooltip: Map<string, string | undefined> = new Map([
    ['like', strings.likeReactionTooltipContent],
    ['heart', strings.heartReactionTooltipContent],
    ['applause', strings.applauseReactionTooltipContent],
    ['laugh', strings.laughReactionTooltipContent],
    ['surprised', strings.surprisedReactionTooltipContent]
  ]);
  const emojiResource: Map<string, string | undefined> = new Map([
    ['like', props.reactionResources.likeReaction?.url],
    ['heart', props.reactionResources.heartReaction?.url],
    ['applause', props.reactionResources.applauseReaction?.url],
    ['laugh', props.reactionResources.laughReaction?.url],
    ['surprised', props.reactionResources.surprisedReaction?.url]
  ]);

  const calloutStyle: Partial<ICalloutContentStyles> = { root: { padding: 0 }, calloutMain: { padding: '0.5rem' } };

  const calloutProps = {
    gapSpace: 4,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };

  const classname = mergeStyles(reactionEmojiMenuStyles());

  const renderEmoji = (item: IContextualMenuItem, dismissMenu: () => void): React.JSX.Element => (
    <div data-ui-id="reaction-sub-menu" className={classname}>
      {emojis.map((emoji, index) => {
        const resourceUrl = emojiResource.get(emoji);
        const frameCount: number =
          props.reactionResources !== undefined ? getEmojiFrameCount(emoji, props.reactionResources) : 0;
        const classname = mergeStyles(emojiStyles(resourceUrl ? resourceUrl : '', frameCount));
        return (
          <TooltipHost
            key={index}
            data-ui-id={index}
            hidden={props.disableTooltip}
            content={emojiButtonTooltip.get(emoji)}
            styles={reactionToolTipHostStyle()}
            calloutProps={{ ...calloutProps }}
          >
            <IconButton
              key={index}
              onClick={() => {
                props.onReactionClick(emoji);
                dismissMenu();
              }}
              className={classname}
            />
          </TooltipHost>
        );
      })}
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
      disabled={props.disabled}
      ariaLabel={strings.ariaLabel}
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
