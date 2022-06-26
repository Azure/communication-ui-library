import * as React from 'react';
import { createSlotWrapper, HandlerEventNameMappings, wrapElementWithTypedReact } from '../common/utils';
import { ControlBarButton, ControlBarButtonEventMap, ControlBarButtonProps } from '../web-component/control-bar-button';
import { CustomAvatarAndSlotReact, CustomSingleSlot } from './CustomAvatarAndSlotReact';
// eslint-disable-next-line import/extensions

type NameMappings = HandlerEventNameMappings<ControlBarButtonEventMap>;

const handlerToEventMapping: NameMappings = {
  onClick: 'click'
};

export const ControlBarButtonReact = wrapElementWithTypedReact<
  ControlBarButtonProps,
  ControlBarButton,
  ControlBarButtonEventMap
>(ControlBarButton, handlerToEventMapping);

export const IconSlot = createSlotWrapper('icon');

export type ControlBarButtonComponentProps = React.ComponentPropsWithoutRef<typeof ControlBarButtonReact> & {
  onRenderIcon?: () => JSX.Element;
};

export const ControlButtonComponent = (props: ControlBarButtonComponentProps) => {
  return (
    <ControlBarButtonReact onClick={props.onClick} disabled={false} checked={false}>
      <IconSlot>{props.onRenderIcon && props.onRenderIcon()}</IconSlot>
    </ControlBarButtonReact>
  );
};
