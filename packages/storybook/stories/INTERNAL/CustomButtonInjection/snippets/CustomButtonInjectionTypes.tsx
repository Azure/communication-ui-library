import { CustomCallControlButtonPlacement, CustomControlButtonProps } from '@azure/communication-react';
import React from 'react';

export const compositeCanvasContainerStyles = {
  height: '22rem'
};

export const addCSS = (css) => (document.head.appendChild(document.createElement('style')).innerHTML = css);

/**
 * Copy of @CustomCallControlButtonProps as displaying props in storybook using package import
 * is not working correctly.
 */
export interface MockCustomCallControlButtonProps extends CustomControlButtonProps {
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
   * @defaultvalue false
   */
  showLabel?: boolean;
  /**
   * Optional label for the button
   */
  text?: string;
  /**
   * A unique key for the button
   */
  key?: string | number;
  /**
   * The aria label of the button for the benefit of screen readers.
   */
  ariaLabel?: string;
  /**
   * Detailed description of the button for the benefit of screen readers.
   */
  ariaDescription?: string;
  /**
   * A unique id set for the standard HTML id attibute
   */
  id?: string;
}

export const CustomButtonInjection = (props: MockCustomCallControlButtonProps): JSX.Element => {
  return <></>;
};
