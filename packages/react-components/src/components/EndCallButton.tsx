// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, Icon, IStyle, PartialTheme } from '@fluentui/react';
/* @conditional-compile-remove(end-call-options) */
import { IContextualMenuProps, DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';
import React from 'react';
/* @conditional-compile-remove(end-call-options) */
import { useCallback } from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { CallingTheme, darkTheme, lightTheme } from '../theming/themes';
import { isDarkThemed } from '../theming/themeUtils';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
/* @conditional-compile-remove(end-call-options) */
import { _preventDismissOnEvent as preventDismissOnEvent } from '@internal/acs-ui-common';

/**
 * Strings of {@link EndCallButton} that can be overridden.
 *
 * @public
 */
export interface EndCallButtonStrings {
  /**
   * Label of button
   */
  label: string;
  /** Tooltip content. */
  tooltipContent?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Label for leave option when ending call */
  leaveOption?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Label for end the whole call option when ending call */
  endCallOption?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Label for confirm button in hang up confirm dialog */
  hangUpConfirmButtonLabel?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Label for cancel button in hang up confirm dialog */
  hangUpCancelButtonLabel?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Title of confirm dialog when leaving */
  leaveConfirmDialogTitle?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Content of confirm dialog when leaving */
  leaveConfirmDialogContent?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Title of confirm dialog when leaving */
  endCallConfirmDialogTitle?: string;

  /* @conditional-compile-remove(end-call-options) */
  /* Content of confirm dialog when leaving */
  endCallConfirmDialogContent?: string;
}

/**
 * Props for {@link EndCallButton}.
 *
 * @public
 */
export interface EndCallButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onHangUp?: (forEveryone?: boolean) => Promise<void>;

  /* @conditional-compile-remove(end-call-options) */
  /**
   * Set this to true to make it a split button.
   * The split arrow will trigger a contextual menu to allow end for everyone or just for the user.
   */
  enableEndCallMenu?: boolean;

  /**
   * Optional strings to override in component
   */
  strings?: EndCallButtonStrings;
}

const onRenderEndCallIcon = (): JSX.Element => <Icon iconName="ControlButtonEndCall" />;

/**
 * A button to end an ongoing call.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const EndCallButton = (props: EndCallButtonProps): JSX.Element => {
  const { styles, /* @conditional-compile-remove(end-call-options) */ enableEndCallMenu, onHangUp } = props;

  /* @conditional-compile-remove(end-call-options) */
  const [showHangUpConfirm, setShowHangUpConfirm] = React.useState(false);

  /* @conditional-compile-remove(end-call-options) */
  const toggleConfirm = useCallback(() => {
    setShowHangUpConfirm(!showHangUpConfirm);
  }, [showHangUpConfirm]);

  /* @conditional-compile-remove(end-call-options) */
  const onHangUpConfirm = useCallback(
    (hangUpForEveryone?: boolean) => {
      onHangUp && onHangUp(hangUpForEveryone);
      toggleConfirm();
    },
    [onHangUp, toggleConfirm]
  );

  const localeStrings = useLocale().strings.endCallButton;
  const strings = { ...localeStrings, ...props.strings };

  const theme = useTheme();
  const isDarkTheme = isDarkThemed(theme);
  const componentStyles = concatStyleSets(
    isDarkTheme ? darkThemeCallButtonStyles : lightThemeCallButtonStyles,
    styles ?? {}
  );

  /* @conditional-compile-remove(end-call-options) */
  const defaultMenuProps: IContextualMenuProps = {
    items: [
      {
        key: 'endForSelf',
        text: localeStrings.leaveOption,
        title: localeStrings.leaveOption,
        onClick: () => {
          onHangUp && onHangUp();
        }
      },
      {
        key: 'endForEveryone',
        text: localeStrings.endCallOption,
        title: localeStrings.endCallOption,
        onClick: () => {
          toggleConfirm();
        }
      }
    ],
    styles: props.styles,
    calloutProps: {
      styles: {
        root: {
          maxWidth: '95%'
        }
      },
      preventDismissOnEvent
    }
  };

  return (
    <>
      {
        /* @conditional-compile-remove(end-call-options) */
        <ConfirmDialog
          title={
            (enableEndCallMenu ? localeStrings.endCallConfirmDialogTitle : localeStrings.leaveConfirmDialogTitle) ?? ''
          }
          content={
            (enableEndCallMenu
              ? localeStrings.endCallConfirmDialogContent
              : localeStrings.endCallConfirmDialogContent) ?? ''
          }
          onConfirm={() => onHangUpConfirm(enableEndCallMenu)} // if enableEndCallMenu is true, that means the dialog is triggered by hangUpForEveryone button
          isOpen={showHangUpConfirm}
          onClose={toggleConfirm}
        />
      }
      <ControlBarButton
        {...props}
        /* @conditional-compile-remove(end-call-options) */
        menuProps={enableEndCallMenu ? defaultMenuProps : undefined}
        onClick={
          onHangUp
            ? props.showLabel //TODO: we don't have mobile UX yet, showLabel === desktop UX, will need to change when we have it
              ? toggleConfirm
              : () => onHangUp()
            : props.onClick
        }
        styles={componentStyles}
        onRenderIcon={props.onRenderIcon ?? onRenderEndCallIcon}
        strings={strings}
        labelKey={props.labelKey ?? 'endCallButtonLabel'}
      />
    </>
  );
};

const getButtonStyles = (
  theme: PartialTheme & CallingTheme
): { regular: IStyle; pressed: IStyle; hovered: IStyle } => ({
  regular: {
    color: theme.callingPalette.iconWhite,
    background: theme.callingPalette.callRed,
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'auto',
      border: `1px ${theme.palette?.neutralQuaternaryAlt} solid`
    },
    ' i': {
      color: theme.callingPalette.iconWhite
    },
    ':focus::after': { outlineColor: `${theme.callingPalette.iconWhite} !important` } // added !important to avoid override by FluentUI button styles
  },
  pressed: {
    color: theme.callingPalette.iconWhite,
    background: theme.callingPalette.callRedDarker,
    border: 'none',
    ' i': {
      color: theme.callingPalette.iconWhite
    },
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'auto'
    }
  },
  hovered: {
    color: theme.callingPalette.iconWhite,
    background: theme.callingPalette.callRedDark,
    border: 'none',
    ' i': {
      color: theme.callingPalette.iconWhite
    },
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'auto'
    }
  }
});

const darkThemeButtonStyles = getButtonStyles(darkTheme);
const lightThemeButtonStyles = getButtonStyles(lightTheme);

// using media query to prevent windows from overwriting the button color
const darkThemeCallButtonStyles = {
  root: darkThemeButtonStyles.regular,
  rootHovered: darkThemeButtonStyles.hovered,
  rootPressed: darkThemeButtonStyles.pressed,
  label: {
    color: darkTheme.callingPalette.iconWhite
  },
  splitButtonMenuButton: {
    ...(darkThemeButtonStyles.regular as object),
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    '&:hover': darkThemeButtonStyles.hovered
  },
  splitButtonMenuButtonChecked: darkThemeButtonStyles.hovered,
  splitButtonMenuButtonExpanded: darkThemeButtonStyles.pressed
};

const lightThemeCallButtonStyles = {
  root: lightThemeButtonStyles.regular,
  rootHovered: lightThemeButtonStyles.hovered,
  rootPressed: lightThemeButtonStyles.pressed,
  splitButtonMenuButton: {
    ...(lightThemeButtonStyles.regular as object),
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    '&:hover': lightThemeButtonStyles.hovered
  },
  splitButtonMenuButtonChecked: lightThemeButtonStyles.hovered,
  splitButtonMenuButtonExpanded: lightThemeButtonStyles.pressed,
  splitButtonMenuFocused: lightThemeButtonStyles.pressed,
  label: {
    color: lightTheme.callingPalette.iconWhite
  }
};

/* @conditional-compile-remove(end-call-options) */
type ConfirmDialogProps = {
  title: string;
  content: string;
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
};

/* @conditional-compile-remove(end-call-options) */
const ConfirmDialog = ({ title, content, onConfirm, isOpen, onClose }: ConfirmDialogProps): JSX.Element => {
  const strings = useLocale().strings.endCallButton;
  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onClose}
      dialogContentProps={{
        type: DialogType.normal,
        title,
        subText: content
      }}
      modalProps={{
        isBlocking: true
      }}
    >
      <DialogFooter>
        <PrimaryButton onClick={onConfirm} text={strings.hangUpConfirmButtonLabel} />
        <DefaultButton onClick={onClose} text={strings.hangUpCancelButtonLabel} />
      </DialogFooter>
    </Dialog>
  );
};
