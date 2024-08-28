// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DefaultButton,
  IButtonStyles,
  IconButton,
  Modal,
  PrimaryButton,
  Stack,
  Text,
  Theme,
  mergeStyles,
  IModalStyles,
  concatStyleSets
} from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React from 'react';

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
  styles?: Partial<IModalStyles>;
}

/**
 * @private
 */
export const Prompt = (props: PromptProps): JSX.Element => {
  const theme = useTheme();
  const styles = concatStyleSets(modalStyles, props.styles ?? {});

  return (
    <Modal styles={styles} isOpen={props.isOpen} onDismiss={props.onDismiss} isBlocking={false}>
      <Stack className={mergeStyles({ position: 'relative' })}>
        <Text className={mergeStyles({ fontWeight: 600, fontSize: '1.25rem' })}>{props.heading}</Text>
        <IconButton styles={iconButtonStyles(theme)} iconProps={{ iconName: 'Cancel' }} onClick={props.onCancel} />
      </Stack>
      <Stack verticalAlign="center" className={mergeStyles({ minHeight: '6rem' })}>
        <Text className={mergeStyles({ fontSize: '0.875rem' })}>{props.text}</Text>
      </Stack>
      <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: '0.5rem' }}>
        <PrimaryButton styles={buttonTextStyles} text={props.confirmButtonLabel} onClick={props.onConfirm} />
        <DefaultButton styles={buttonTextStyles} text={props.cancelButtonLabel} onClick={props.onCancel} />
      </Stack>
    </Modal>
  );
};

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

const modalStyles = { main: { padding: '1.5rem ', maxWidth: '30rem' } };

const buttonTextStyles: IButtonStyles = { label: { fontSize: '0.875rem' } };

/**
 * Strings used in prompt related to spotlight
 * @public
 */
export interface SpotlightPromptStrings {
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
   * Heading for prompt when stopping all spotlight
   */
  stopAllSpotlightHeading: string;
  /**
   * Text for prompt when stopping spotlight on participant
   */
  stopSpotlightText: string;
  /**
   * Text for prompt when stopping spotlight on local user
   */
  stopSpotlightOnSelfText: string;
  /**
   * Text for prompt when stopping all spotlight
   */
  stopAllSpotlightText: string;
  /**
   * Label for button to confirm stopping spotlight on participant(s) in prompt
   */
  stopSpotlightConfirmButtonLabel: string;
  /**
   * Label for button to confirm stopping spotlight on local user in prompt
   */
  stopSpotlightOnSelfConfirmButtonLabel: string;
  /**
   * Label for button to cancel stopping spotlight on participant(s) in prompt
   */
  stopSpotlightCancelButtonLabel: string;
}
