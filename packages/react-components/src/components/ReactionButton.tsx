// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ContextualMenuItemType,
  DefaultPalette,
  IButtonStyles,
  ICalloutContentStyles,
  IContextualMenuItem,
  mergeStyles,
  Theme,
  TooltipHost,
  useTheme
} from '@fluentui/react';
import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
import { useLocale } from '../localization';
import { emojiStyles, reactionEmojiMenuStyles, reactionToolTipHostStyle } from './styles/ReactionButton.styles';
import { isDarkThemed } from '../theming/themeUtils';
import { ReactionResources } from '..';
import { getEmojiFrameCount } from './VideoGallery/utils/videoGalleryLayoutUtils';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';

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
  onReactionClick: (reaction: string) => Promise<void>;
  /**
   * Reaction resource locator and parameters
   */
  reactionResources: ReactionResources;
}

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
            <div
              role="menuitem"
              key={index}
              onClick={() => {
                props.onReactionClick(emoji);
                dismissMenu();
              }}
              className={classname}
              aria-label={emojiButtonTooltip.get(emoji)}
            ></div>
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
        items: emojiList,
        calloutProps: { preventDismissOnEvent: _preventDismissOnEvent }
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
