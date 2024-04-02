// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import { IRawStyle, IStyle, mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import React from 'react';
/* @conditional-compile-remove(reaction) */
import { useTheme } from '../../theming/FluentThemeProvider';
/* @conditional-compile-remove(reaction) */
import { mobileViewEmojiStyles, mobileViewMenuItemStyle } from '../styles/ReactionButton.styles';
/* @conditional-compile-remove(reaction) */
import { IconButton } from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import { _DrawerMenuItemProps, ReactionResources } from '../..';

/* @conditional-compile-remove(reaction) */
/**
 * Props for the ReactionMenuItem
 *
 * @internal
 */
export interface _ReactionMenuItemProps {
  /**
   * Reaction resources to render for mobile button menus for reaction
   */
  reactionResources?: ReactionResources;
  /**
   * reaction click event from the call adapter.
   */
  onReactionClick?: (reaction: string) => Promise<void>;
  /**
   * Whether the menu item is disabled
   * @defaultvalue false
   */
  disabled?: boolean;
}

/* @conditional-compile-remove(reaction) */
/**
 * Maps the individual item in menuProps.items passed in the {@link DrawerMenu} into a UI component.
 *
 * @internal
 */
export const _ReactionDrawerMenuItem = (props: _ReactionMenuItemProps): JSX.Element => {
  const theme = useTheme();
  const resources = props.reactionResources;
  const emojiResource: Map<string, string | undefined> = new Map([
    ['like', resources?.likeReaction?.url],
    ['heart', resources?.heartReaction?.url],
    ['laugh', resources?.laughReaction?.url],
    ['applause', resources?.applauseReaction?.url],
    ['surprised', resources?.surprisedReaction?.url]
  ]);
  const emojis: string[] = ['like', 'heart', 'laugh', 'applause', 'surprised'];

  const borderRadius = useTheme().effects.roundedCorner4;
  const modifiedFirstItemStyle = {
    root: {
      borderTopRightRadius: borderRadius,
      borderTopLeftRadius: borderRadius,
      marginTop: '12px'
    }
  };

  return (
    <Stack
      data-ui-id="reaction-mobile-drawer-menu-item"
      id="reaction"
      role="menuitem"
      horizontal
      className={mergeStyles(
        drawerMenuItemRootStyles(theme.palette.neutralLight, theme.fonts.small),
        props.disabled ? disabledDrawerMenuItemRootStyles(theme.palette.neutralQuaternaryAlt) : undefined,
        modifiedFirstItemStyle.root
      )}
    >
      <div style={mobileViewMenuItemStyle()}>
        {emojis.map((emoji, index) => {
          const resourceUrl = emojiResource.get(emoji.toString());

          return (
            <IconButton
              key={index}
              onClick={() => {
                props.onReactionClick?.(emoji);
              }}
              style={mobileViewEmojiStyles(resourceUrl ? resourceUrl : '', 'running')}
            />
          );
        })}
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(reaction) */
const drawerMenuItemRootStyles = (hoverBackground: string, fontSize: IRawStyle): IStyle => ({
  ...fontSize,
  height: '3rem',
  lineHeight: '3rem',
  padding: '0rem 0.75rem',
  cursor: 'pointer',
  ':hover, :focus': {
    background: hoverBackground
  }
});

/* @conditional-compile-remove(reaction) */
const disabledDrawerMenuItemRootStyles = (background: string): IStyle => ({
  pointerEvents: 'none',
  background: background,
  ':hover, :focus': {
    background: background
  }
});
