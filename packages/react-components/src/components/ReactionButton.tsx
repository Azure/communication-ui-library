
import { DefaultPalette, IButtonStyles, IContextualMenuItemStyles, IContextualMenuStyles, mergeStyles, Theme, useTheme } from '@fluentui/react';
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
    /**s
     * Optional strings to override in component
     */
    strings?: Partial<ReactionButtonStrings>;
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
    const onRenderIcon = (): JSX.Element => (
        <_HighContrastAwareIcon iconName="Emoji2" />
      );
    return (
        <ControlBarButton 
            {...props}
            className={mergeStyles(styles, props.styles)}
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