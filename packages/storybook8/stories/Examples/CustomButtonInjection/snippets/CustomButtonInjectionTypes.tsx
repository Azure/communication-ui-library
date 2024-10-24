import { CustomCallControlButtonPlacement, CustomCallControlButtonStrings } from '@azure/communication-react';
import React from 'react';

export const compositeCanvasContainerStyles = {
  height: '100vh',
  width: '100wh'
};

/**
 * Copy of @CustomCallControlButtonProps as displaying props in storybook using package import
 * is not working correctly.
 */
export interface MockCustomCallControlButtonProps {
  /**
   * Where to place the custom button relative to other buttons.
   */
  placement: CustomCallControlButtonPlacement;
  /**
   * Icon to render. Icon is a non-default icon name that needs to be registered as a
   * custom icon using registerIcons through fluentui. Examples include icons from the fluentui library
   */
  iconName?: string;
  /**
   * Calback for when button is clicked
   */
  onItemClick?: () => void;
  /**
   * Whether the buttons is disabled
   */
  disabled?: boolean;
  /**
   * Whether the label is displayed or not.
   *
   * @defaultValue `false`
   */
  showLabel?: boolean;
  /**
   * A unique id set for the standard HTML id attibute
   */
  id?: string;
  /**
   * Optional strings to override in component
   */
  strings?: CustomCallControlButtonStrings;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const CustomButtonInjection = (props: MockCustomCallControlButtonProps): JSX.Element => {
  return <></>;
};
