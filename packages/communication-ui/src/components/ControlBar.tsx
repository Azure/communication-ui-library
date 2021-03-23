// © Microsoft Corporation. All rights reserved.
import {
  DefaultButton,
  IContextualMenuProps,
  IIconProps,
  IStyle,
  mergeStyles,
  Stack,
  IButtonProps,
  concatStyleSets
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
   * Optional callback function to render icon of control button
   */
  onRenderIcon?: (props?: CallControlButtonProps) => JSX.Element | null;
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
  const { menuIconProps, menuProps, disabled, isToggled, onClick, onRenderIcon, styles } = props;
  return (
    <DefaultButton
      disabled={disabled}
      onClick={onClick}
      className={mergeStyles(controlButtonStyles, styles?.root)}
      styles={{
        flexContainer: styles?.flexContainer ?? {
          flexDirection: 'column'
        }
      }}
      menuIconProps={menuIconProps}
      menuProps={menuProps}
      checked={isToggled}
    >
      {onRenderIcon && onRenderIcon(props)}
    </DefaultButton>
  );
};

export const videoButtonProps: IButtonProps = {
  onRenderIcon: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <CallVideoIcon />;
    } else {
      return <CallVideoOffIcon />;
    }
  },
  onRenderText: () => (
    <Stack className={mergeStyles(controlButtonLabelStyles)}>
      <Stack>Camera</Stack>
    </Stack>
  ),
  styles: controlButtonStyles
};

export const audioButtonProps: IButtonProps = {
  onRenderIcon: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <MicIcon />;
    } else {
      return <MicOffIcon />;
    }
  },
  onRenderText: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Stack className={mergeStyles(controlButtonLabelStyles)}>
          <Stack>Mute</Stack>
        </Stack>
      );
    } else {
      return (
        <Stack className={mergeStyles(controlButtonLabelStyles)}>
          <Stack>Unmute</Stack>
        </Stack>
      );
    }
  },
  styles: controlButtonStyles
};

export const screenShareButtonProps: IButtonProps = {
  onRenderIcon: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <CallControlPresentNewIcon bordered={false} />;
    } else {
      return <CallControlCloseTrayIcon />;
    }
  },
  onRenderText: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Stack className={mergeStyles(controlButtonLabelStyles)}>
          <Stack>Share</Stack>
        </Stack>
      );
    } else {
      return (
        <Stack className={mergeStyles(controlButtonLabelStyles)}>
          <Stack>Stop</Stack>
        </Stack>
      );
    }
  },
  styles: controlButtonStyles
};

export const optionsButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <MoreIcon />,
  onRenderText: (): JSX.Element => {
    return (
      <Stack className={mergeStyles(controlButtonLabelStyles)}>
        <Stack>Options</Stack>
      </Stack>
    );
  },
  menuIconProps: {
    hidden: true
  },
  styles: controlButtonStyles
};

export const answerButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <CallIcon />,
  onRenderText: (): JSX.Element => {
    return (
      <Stack className={mergeStyles(controlButtonLabelStyles)}>
        <Stack>Answer</Stack>
      </Stack>
    );
  }
};

export const hangupButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <CallEndIcon />,
  onRenderText: (): JSX.Element => {
    return (
      <Stack className={mergeStyles(controlButtonLabelStyles)}>
        <Stack>Hangup</Stack>
      </Stack>
    );
  },
  styles: concatStyleSets(controlButtonStyles, hangUpControlButtonStyles)
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
