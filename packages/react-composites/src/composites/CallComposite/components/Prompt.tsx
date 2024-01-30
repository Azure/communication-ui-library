// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import {
  DefaultButton,
  IButtonStyles,
  IconButton,
  Modal,
  PrimaryButton,
  Stack,
  Text,
  Theme,
  mergeStyles
} from '@fluentui/react';
/* @conditional-compile-remove(spotlight) */
import { useTheme } from '@internal/react-components';
/* @conditional-compile-remove(spotlight) */
import React from 'react';

/* @conditional-compile-remove(spotlight) */
/**
 * @private
 */
export interface PromptProps {
  isOpen?: boolean;
  onDismiss?: () => void;
  heading?: string;
  text?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/* @conditional-compile-remove(spotlight) */
/**
 * @private
 */
export const Prompt = (props: PromptProps): JSX.Element => {
  const theme = useTheme();

  return (
    <Modal styles={modalStyles} isOpen={props.isOpen} onDismiss={props.onDismiss} isBlocking={false}>
      <Stack className={mergeStyles({ position: 'relative' })}>
        <Text className={mergeStyles({ fontWeight: 600, fontSize: 20 })}>{props.heading}</Text>
        <IconButton styles={iconButtonStyles(theme)} iconProps={{ iconName: 'Cancel' }} onClick={props.onCancel} />
      </Stack>
      <Stack verticalAlign="center" className={mergeStyles({ minHeight: '6rem' })}>
        <Text className={mergeStyles({ fontSize: 14 })}>{props.text}</Text>
      </Stack>
      <Stack horizontal reversed tokens={{ childrenGap: '0.5rem' }} className={mergeStyles({ fontSize: 14 })}>
        <DefaultButton text={props.cancelButtonLabel} onClick={props.onCancel} />
        <PrimaryButton text={props.confirmButtonLabel} onClick={props.onConfirm} />
      </Stack>
    </Modal>
  );
};

/* @conditional-compile-remove(spotlight) */
const iconButtonStyles = (theme: Theme): IButtonStyles => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: theme.palette.neutralPrimary
  },
  rootHovered: {
    color: theme.palette.neutralDark
  }
});

/* @conditional-compile-remove(spotlight) */
const modalStyles = { main: { padding: '1.5rem ', maxWidth: '30rem' } };

/* @conditional-compile-remove(spotlight) */
/**
 * Strings in call composite prompt
 * @beta
 */
export interface PromptStrings {
  /**
   * Strings in prompt related to spotlight
   */
  spotlight: {
    /**
     * Heading for prompt when starting spotlight on participant
     */
    startSpotlightHeading: string;
    /**
     * Text for prompt when starting spotlight on participant
     */
    startSpotlightText: string;
    /**
     * Label for button to confirm starting spotlight on local user in prompt
     */
    startSpotlightOnSelfText: string;
    /**
     * Label for button to confirm starting spotlight on participant in prompt
     */
    startSpotlightConfirmButtonLabel: string;
    /**
     * Label for button to cancel starting spotlight on participant in prompt
     */
    startSpotlightCancelButtonLabel: string;
    /**
     * Heading for prompt when stopping spotlight on participant
     */
    stopSpotlightHeading: string;
    /**
     * Heading for prompt when stopping spotlight on local user
     */
    stopSpotlightOnSelfHeading: string;
    /**
     * Text for prompt when stopping spotlight on participant
     */
    stopSpotlightText: string;
    /**
     * Text for prompt when stopping spotlight on local user
     */
    stopSpotlightOnSelfText: string;
    /**
     * Label for button to confirm stopping spotlight on participant in prompt
     */
    stopSpotlightConfirmButtonLabel: string;
    /**
     * Label for button to confirm stopping spotlight on local user in prompt
     */
    stopSpotlightOnSelfConfirmButtonLabel: string;
    /**
     * Label for button to cancel stopping spotlight on participant in prompt
     */
    stopSpotlightCancelButtonLabel: string;
  };
}
