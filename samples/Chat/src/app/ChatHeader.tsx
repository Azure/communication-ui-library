// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { DefaultButton, Icon, IconButton, mergeStyles, Stack } from '@fluentui/react';
import {
  buttonWithIconStyles,
  chatHeaderContainerStyle,
  copilotIconStyle,
  greyIconButtonStyle,
  largeLeaveButtonContainerStyle,
  leaveButtonStyle,
  leaveIcon,
  leaveIconStyle,
  paneButtonContainerStyle,
  smallLeaveButtonContainerStyle
} from './styles/ChatHeader.styles';
import { useTheme } from '@azure/communication-react';
/* @conditional-compile-remove(chat-composite-participant-pane) */
import { PeopleButton, PeopleButtonProps } from './PeopleButton';
import copilotIcon from '../assets/copilot.svg';

export interface CopilotResponse {
  content: string;
}

export interface ChatHeaderProps {
  onEndChat(): void;
}

/* @conditional-compile-remove(chat-composite-participant-pane) */
export interface ChatHeaderProps extends PeopleButtonProps {
  onEndChat(): void;
  setLoading(shouldLoad: boolean): void;
  setNotification(shouldShowNotification: boolean): void;
  setResponse(content: [CopilotResponse]): void;
}

const MOCK_COPILOT_RESPONSE = `
Customer Inquiry:

Initial Request: Correction of shipping address for an existing order.

Additional Interests:
  - Product Inquiry: Expressed interest in the latest iPhone 14 Pro Max.

Details Discussed:
  - Financing Options: Various plans and payment options.
  - Product Variants: Available colors and storage capacities.

Outcome:
  - Order Placement: Customer placed an order for the iPhone 14 Pro Max.

Summary: During the interaction, the customer initially requested a correction to the shipping address of an existing order. Subsequently, she showed interest in the iPhone 14 Pro Max, inquiring about financing options, available colors, and storage capacities. The conversation concluded with the customer placing an order for the iPhone 14 Pro Max.`;

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const theme = useTheme();

  const leaveString = 'Leave';
  return (
    <Stack
      horizontal={true}
      verticalAlign={'center'}
      horizontalAlign="end"
      className={chatHeaderContainerStyle}
      role="banner"
    >
      <div className={paneButtonContainerStyle}>
        {
          /* @conditional-compile-remove(chat-composite-participant-pane) */
          <PeopleButton {...props} />
        }
      </div>
      <DefaultButton
        className={mergeStyles(
          largeLeaveButtonContainerStyle,
          leaveButtonStyle,
          {
            color: theme.palette.neutralPrimaryAlt
          },
          copilotIconStyle
        )}
        styles={buttonWithIconStyles}
        text={'Summary'}
        onClick={() => {
          setTimeout(() => {
            props.setResponse([{ content: '' }]);
            props.setLoading(false);
            props.setResponse([
              {
                content: MOCK_COPILOT_RESPONSE
              }
            ]);
            props.setNotification(true);
          }, 2000);
          props.setLoading(true);
        }}
        onRenderIcon={() => (
          <img
            src={copilotIcon.toString()}
            className={mergeStyles([leaveIconStyle, { width: '20px', height: 'auto' }])}
          />
        )}
      />
      <IconButton
        onRenderIcon={() => (
          <img
            src={copilotIcon.toString()}
            className={mergeStyles([leaveIconStyle, { width: '20px', height: 'auto' }, copilotIconStyle])}
          />
        )}
        className={mergeStyles(smallLeaveButtonContainerStyle, greyIconButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        onClick={() => {
          setTimeout(() => {
            props.setResponse([{ content: '' }]);
            props.setLoading(false);
            props.setResponse([
              {
                content: MOCK_COPILOT_RESPONSE
              }
            ]);
            props.setNotification(true);
          }, 2000);
          props.setLoading(true);
        }}
      />
      <DefaultButton
        className={mergeStyles(largeLeaveButtonContainerStyle, leaveButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        styles={buttonWithIconStyles}
        text={leaveString}
        onClick={() => props.onEndChat()}
        onRenderIcon={() => <Icon iconName={leaveIcon.iconName} className={leaveIconStyle} />}
        aria-live={'polite'}
        aria-label={leaveString}
      />
      <IconButton
        iconProps={leaveIcon}
        className={mergeStyles(smallLeaveButtonContainerStyle, greyIconButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        onClick={() => props.onEndChat()}
        ariaLabel={leaveString}
        aria-live={'polite'}
      />
    </Stack>
  );
};
