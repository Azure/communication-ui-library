// © Microsoft Corporation. All rights reserved.
import {
  DefaultButton,
  getTheme,
  loadTheme,
  createTheme,
  ITheme,
  IContextualMenuProps,
  IIconProps,
  IStyle,
  mergeStyles,
  Stack
} from '@fluentui/react';
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

const lightTheme: ITheme = createTheme({
  palette: {
    themeLight: 'white',
    themeDark: 'black'
  }
});

loadTheme(lightTheme);

const theme = getTheme();
const palette = theme.palette;

const controlBarStyle: IStyle = {
  borderRadius: '0.5rem',
  boxShadow: theme.effects.elevation4,
  overflow: 'hidden',
  background: palette.themeLight
};

const controlButtonStyles: IStyle = {
  background: 'none',
  border: 'none',
  borderRadius: 0,
  minHeight: '56px',
  minWidth: '56px'
};

const controlButtonLabelStyles: IStyle = {
  fontSize: '0.75rem',
  color: palette.blackTranslucent40,
  lineHeight: '1.25rem'
};

export interface CustomStylesProps {
  root?: IStyle;
}

export interface ControlButtonStylesProps extends CustomStylesProps {
  flexContainer?: IStyle;
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
   */
  menuIconProps?: IIconProps;
  /**
   * Props for button menu. Providing this will default to showing the menu icon. See menuIconProps for overriding
   * how the default icon looks. Providing this in addition of onClick and setting the split property to true will
   * render a SplitButton.
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
  styles: {
    root: {
      background: palette.redDark,
      color: palette.white,
      ':hover': {
        background: palette.red,
        color: palette.white
      }
    },
    label: {
      color: palette.whiteTranslucent40
    }
  }
};

export interface ControlBarProps {
  children?: React.ReactNode;
  styles?: CustomStylesProps;
  vertical?: boolean;
}

/**
 * A Call Control Bar used for handling a call state. Contains actions like
 * toggle video, audo, device settings etc.
 * @returns JSX.Element
 */
export const ControlBar = (props: ControlBarProps): JSX.Element => {
  const { styles, vertical } = props;
  return (
    <Stack
      horizontal={vertical ? false : true}
      verticalAlign="center"
      className={mergeStyles(controlBarStyle, styles?.root)}
    >
      {props.children ?? (
        <>
          <ControlButton {...videoButtonProps} isToggled={false} />
          <ControlButton {...audioButtonProps} isToggled={false} />
          <ControlButton {...screenShareButtonProps} isToggled={false} />
          <ControlButton {...optionsButtonProps} isToggled={false} />
          <ControlButton {...hangupButtonProps} isToggled={false} />
        </>
      )}
    </Stack>
  );
};
