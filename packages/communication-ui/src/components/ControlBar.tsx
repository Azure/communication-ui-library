// © Microsoft Corporation. All rights reserved.
import { mergeStyles, Stack, IButtonProps } from '@fluentui/react';
import {
  CallControlCloseTrayIcon,
  CallControlPresentNewIcon,
  CallEndIcon,
  CallIcon,
  CallRecordingIcon,
  CallVideoIcon,
  CallVideoOffIcon,
  MicIcon,
  MicOffIcon,
  MoreIcon
} from '@fluentui/react-northstar';
import React from 'react';
import { BaseCustomStylesProps } from '../types';
import {
  controlBarStyles,
  controlButtonLabelStyles,
  controlButtonStyles,
  hangUpControlButtonStyles
} from './styles/ControlBar.styles';

/** Fluent UI Button props for video control */
export const videoButtonProps: IButtonProps = {
  onRenderIcon: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <CallVideoIcon />;
    } else {
      return <CallVideoOffIcon />;
    }
  },
  styles: controlButtonStyles
};

/** Fluent UI Button props for video control with label */
export const labeledVideoButtonProps: IButtonProps = {
  ...videoButtonProps,
  onRenderText: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Turn off</Stack>;
    } else {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Turn on</Stack>;
    }
  }
};

/** Fluent UI Button props for audio control */
export const audioButtonProps: IButtonProps = {
  onRenderIcon: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <MicIcon />;
    } else {
      return <MicOffIcon />;
    }
  },
  styles: controlButtonStyles
};

/** Fluent UI Button props for audio control with label */
export const labeledAudioButtonProps: IButtonProps = {
  ...audioButtonProps,
  onRenderText: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Mute</Stack>;
    } else {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Unmute</Stack>;
    }
  }
};

/** Fluent UI Button props for screenshare control */
export const screenShareButtonProps: IButtonProps = {
  onRenderIcon: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <CallControlCloseTrayIcon />;
    } else {
      return <CallControlPresentNewIcon bordered={false} />;
    }
  },
  styles: controlButtonStyles
};

/** Fluent UI Button props for screenshare control with label */
export const labeledScreenShareButtonProps: IButtonProps = {
  ...screenShareButtonProps,
  onRenderText: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Stop</Stack>;
    } else {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Share</Stack>;
    }
  }
};

/** Fluent UI Button props for options control */
export const optionsButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <MoreIcon />,
  menuIconProps: {
    hidden: true
  },
  styles: controlButtonStyles
};

/** Fluent UI Button props for options control with label */
export const labeledOptionsButtonProps: IButtonProps = {
  ...optionsButtonProps,
  onRenderText: (): JSX.Element => {
    return (
      <Stack className={mergeStyles(controlButtonLabelStyles)}>
        <Stack>Options</Stack>
      </Stack>
    );
  }
};

/** Fluent UI Button props for recording control */
export const recordButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <CallRecordingIcon />,
  styles: controlButtonStyles
};

/** Fluent UI Button props for recording control with label */
export const labeledRecordButtonProps: IButtonProps = {
  ...recordButtonProps,
  onRenderText: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Stop</Stack>;
    } else {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Record</Stack>;
    }
  }
};

/** Fluent UI Button props for call answering control */
export const answerButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <CallIcon />,
  styles: controlButtonStyles
};

/** Fluent UI Button props for call answering control with label */
export const labeledAnswerButtonProps: IButtonProps = {
  ...answerButtonProps,
  onRenderText: (): JSX.Element => {
    return <Stack className={mergeStyles(controlButtonLabelStyles)}>Answer</Stack>;
  }
};

/** Fluent UI Button props for end call control */
export const hangupButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <CallEndIcon />,
  styles: hangUpControlButtonStyles
};

/** Fluent UI Button props for end call control with label */
export const labeledHangupButtonProps: IButtonProps = {
  ...hangupButtonProps,
  onRenderText: (): JSX.Element => {
    return <Stack className={mergeStyles(controlButtonLabelStyles)}>Hangup</Stack>;
  }
};

export type ControlBarLayoutType =
  | 'horizontal'
  | 'vertical'
  | 'dockedTop'
  | 'dockedBottom'
  | 'dockedLeft'
  | 'dockedRight'
  | 'floatingTop'
  | 'floatingBottom'
  | 'floatingLeft'
  | 'floatingRight';

/**
 * Props for ControlBar component.
 */
export interface ControlBarProps {
  /** React Child components. */
  children?: React.ReactNode;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <ControlBar styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
  /**
   * Changes the layout of the control bar.
   * Available layouts are `horizontal`, `vertical`, `dockedTop`, `dockedBottom`,
   * `dockedLeft`, `dockedRight`, `floatingTop`, `floatingBottom`, `floatingLeft`,
   * `floatingRight`
   * Defaults to a `horizontal` layout.
   */
  layout?: ControlBarLayoutType;
}

/**
 * `ControlBar` allows you to easily create a component for call controls using
 * [Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) component from
 * Fluent UI. Users will need to provide methods to Button components used inside `ControlBar`
 * for altering call behavior.
 */
export const ControlBar = (props: ControlBarProps): JSX.Element => {
  const { styles, layout } = props;
  const controlBarStyle = controlBarStyles[layout ?? 'horizontal'];
  return <Stack className={mergeStyles(controlBarStyle, styles?.root)}>{props.children}</Stack>;
};
