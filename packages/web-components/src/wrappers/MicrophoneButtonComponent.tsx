import * as React from 'react';
import { createSlotWrapper, HandlerEventNameMappings, wrapElementWithTypedReact } from '../common/utils';
import { ControlBarButton, ControlBarButtonEventMap, ControlBarButtonProps } from '../web-component/control-bar-button';
import { MicrophoneButton, MicrophoneButtonEventMap, MicrophoneButtonProps } from '../web-component/microphone-button';
import { CustomAvatarAndSlotReact, CustomSingleSlot } from './CustomAvatarAndSlotReact';
// eslint-disable-next-line import/extensions

type NameMappings = HandlerEventNameMappings<MicrophoneButtonEventMap>;

const handlerToEventMapping: NameMappings = {
  onToggleMicrophone: 'toggleMicrophone'
};

export const MicrophoneButtonReact = wrapElementWithTypedReact<
  MicrophoneButtonProps,
  MicrophoneButton,
  MicrophoneButtonEventMap
>(MicrophoneButton, handlerToEventMapping);

export const OnIconSlot = createSlotWrapper('micOnIcon');
export const OffIconSlot = createSlotWrapper('micOffIcon');

export type MicrophoneButtonComponentProps = React.ComponentPropsWithoutRef<typeof MicrophoneButtonReact> & {
  onRenderOnIcon?: () => JSX.Element;
  onRenderOffIcon?: () => JSX.Element;
};

export const MicrophoneButtonComponent = (props: MicrophoneButtonComponentProps) => {
  return (
    <MicrophoneButtonReact {...props}>
      {props.onRenderOnIcon && <OnIconSlot>{props.onRenderOnIcon()}</OnIconSlot>}
      {props.onRenderOffIcon && <OffIconSlot> {props.onRenderOffIcon()}</OffIconSlot>}
    </MicrophoneButtonReact>
  );
};
