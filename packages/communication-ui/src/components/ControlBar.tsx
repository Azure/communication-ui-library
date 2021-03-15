// © Microsoft Corporation. All rights reserved.
import { DefaultButton, IContextualMenuProps, IIconProps, IStyle, mergeStyles, Stack } from '@fluentui/react';
import {
  CallControlCloseTrayIcon,
  CallControlPresentNewIcon,
  CallEndIcon,
  CallIcon,
  CallVideoIcon,
  CallVideoOffIcon,
  MicIcon,
  MicOffIcon,
  MoreIcon
} from '@fluentui/react-northstar';
import React, { MouseEventHandler } from 'react';
import {
  controlBarStyles,
  controlButtonLabelStyles,
  controlButtonStyles,
  hangUpControlButtonStyles
} from './styles/ControlBar.styles';

export interface CustomStylesProps {
  root?: IStyle;
}

export interface ControlButtonStylesProps extends CustomStylesProps {
  /**
   * The flex container containing the elements inside a button.
   */
  flexContainer?: IStyle;
  /**
   * Text label styles.
   */
  label?: IStyle;
}

export interface CallControlButtonProps {
  /**
   * React Child components.
   */
  children?: React.ReactNode;
  /**
   * Whether the button is in a toggled state. Will render the toggled Icon if
   * set to `true`.
   */
  isToggled?: boolean;
  /**
   * Custom CSS Styling.
   */
  styles?: ControlButtonStylesProps;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * OnClick event handler.
   */
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Display the `defaultLabel` and `toggledLabel` when set to true.
   */
  showLabel?: boolean;
  /**
   * Default Icon element to display.
   */
  defaultIcon?: JSX.Element;
  /**
   * Icon element to display when `isToggled` is `true`.
   */
  toggledIcon?: JSX.Element;
  /**
   * Default label to display is `showLabel` is set to `true`.
   */
  defaultLabel?: JSX.Element;
  /**
   * Label to display when `showLabel` and `isToggled` are true.
   */
  toggledLabel?: JSX.Element;
  /**
   * The props for the icon shown when providing a menu dropdown.
   * Uses `IIconProps` from FluentUI.
   * Visit https://developer.microsoft.com/en-us/fluentui#/controls/web/icon#IIconProps for more info.
   */
  menuIconProps?: IIconProps;
  /**
   * Props for button menu. Providing this will default to showing the menu icon. See menuIconProps for overriding
   * how the default icon looks. Providing this in addition of onClick and setting the split property to true will
   * render a SplitButton.
   * Uses `IContextualMenuProps` from FluentUI
   * Visit https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps for more info.
   */
  menuProps?: IContextualMenuProps;
}

/**
 * A Button component that can be rendered inside a Control Bar
 * @returns JSX.Element
 */
export const ControlButton = (props: CallControlButtonProps): JSX.Element => {
  const { defaultIcon, toggledIcon, defaultLabel, toggledLabel } = props;
  return (
    <DefaultButton
      disabled={props.disabled}
      onClick={props.onClick}
      className={mergeStyles(controlButtonStyles, props.styles?.root)}
      styles={{
        flexContainer: props.styles?.flexContainer ?? {
          flexDirection: 'column'
        }
      }}
      menuIconProps={props.menuIconProps}
      menuProps={props.menuProps}
    >
      {props.isToggled && toggledIcon ? toggledIcon : defaultIcon}
      <Stack className={mergeStyles(controlButtonLabelStyles, props.styles?.label)}>
        {props.showLabel
          ? (() => {
              if (props.isToggled && toggledLabel) {
                return toggledLabel;
              } else if (!props.isToggled && defaultLabel) {
                return defaultLabel;
              } else {
                return null;
              }
            })()
          : null}
      </Stack>
    </DefaultButton>
  );
};

export const videoButtonProps: CallControlButtonProps = {
  defaultIcon: <CallVideoIcon />,
  toggledIcon: <CallVideoOffIcon />,
  defaultLabel: <Stack>Camera</Stack>,
  toggledLabel: <Stack>Camera</Stack>
};

export const audioButtonProps: CallControlButtonProps = {
  defaultIcon: <MicIcon />,
  toggledIcon: <MicOffIcon />,
  defaultLabel: <Stack>Mute</Stack>,
  toggledLabel: <Stack>Unmute</Stack>
};

export const screenShareButtonProps: CallControlButtonProps = {
  defaultIcon: <CallControlPresentNewIcon bordered={false} />,
  toggledIcon: <CallControlCloseTrayIcon />,
  defaultLabel: <Stack>Share</Stack>,
  toggledLabel: <Stack>Stop</Stack>
};

export const optionsButtonProps: CallControlButtonProps = {
  defaultIcon: <MoreIcon />,
  defaultLabel: <Stack>Options</Stack>,
  menuIconProps: {
    hidden: true
  }
};

export const answerButtonProps: CallControlButtonProps = {
  defaultIcon: <CallIcon />,
  defaultLabel: <Stack>Answer</Stack>
};

export const hangupButtonProps: CallControlButtonProps = {
  defaultIcon: <CallEndIcon />,
  defaultLabel: <Stack>Hangup</Stack>,
  styles: hangUpControlButtonStyles
};

export const CONTROL_BAR_LAYOUTS = [
  'horizontal',
  'vertical',
  'dockedTop',
  'dockedBottom',
  'dockedLeft',
  'dockedRight',
  'floatingTop',
  'floatingBottom',
  'floatingLeft',
  'floatingRight'
] as const;

export interface ControlBarProps {
  children?: React.ReactNode;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * Example
   * ```
   * <ControlBar styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: CustomStylesProps;
  /**
   * Changes the layout of the control bar.
   * Available layouts are `horizontal`, `vertical`, `dockedTop`, `dockedBottom`,
   * `dockedLeft`, `dockedRight`, `floatingTop`, `floatingBottom`, `floatingLeft`,
   * `floatingRight`
   * Defaults to a `horizontal` layout.
   */
  layout?: typeof CONTROL_BAR_LAYOUTS[number];
}

/**
 * A Call Control Bar used for handling a call state. Contains actions like
 * toggle video, audo, device settings etc.
 * @returns JSX.Element
 */
export const ControlBar = (props: ControlBarProps): JSX.Element => {
  const { styles, layout } = props;
  const controlBarStyle = controlBarStyles[layout ?? 'horizontal'];
  return <Stack className={mergeStyles(controlBarStyle, styles?.root)}>{props.children}</Stack>;
};
