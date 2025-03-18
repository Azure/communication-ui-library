// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { IButtonProps, IStyle, mergeStyles, PrimaryButton, Spinner, Stack, Text } from '@fluentui/react';
import {
  containerStyle,
  moreDetailsStyles,
  containerItemGap,
  titleStyles,
  rejoinCallButtonContainerStyles
} from '../styles/SummaryEndCall.styles';
import { CallCompositeIcons, CommonCallAdapter } from '@azure/communication-react';
import { Video20Filled, CallEnd20Filled } from '@fluentui/react-icons';
import { buttonStyle, buttonWithIconStyles, videoCameraIconStyle } from '../styles/StartCallButton.styles';
import { SummarizeResult } from '../utils/CallAutomationUtils';
/**
 * @private
 */
export interface SummaryEndCallScreenProps {
  iconName?: keyof CallCompositeIcons;
  disableStartCallButton?: boolean;
  pageStyle?: IStyle;
  adapter: CommonCallAdapter;
  summary?: SummarizeResult;
  summarizationStatus?: 'InProgress' | 'Complete' | 'None';
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export const SummaryEndCallScreen = (props: SummaryEndCallScreenProps): JSX.Element => {
  const { adapter, summarizationStatus, summary } = props;

  return (
    <Stack
      className={mergeStyles(props.pageStyle)}
      verticalFill
      verticalAlign="center"
      horizontalAlign="center"
      data-ui-id={props.dataUiId}
      aria-atomic
    >
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        <CallEnd20Filled />
        <Text className={mergeStyles(titleStyles)} aria-live="assertive" role="alert">
          {'You left the call'}
        </Text>
        <Text className={mergeStyles(moreDetailsStyles)} aria-live="assertive">
          {'If this was a mistake , re-join the call.'}
        </Text>
        {!props.disableStartCallButton && (
          <Stack styles={rejoinCallButtonContainerStyles}>
            <StartCallButton
              onClick={() => {
                adapter.joinCall();
              }}
              disabled={false}
              rejoinCall={true}
              autoFocus
            />
          </Stack>
        )}
      </Stack>
      {summarizationStatus === 'InProgress' && (
        <Spinner styles={{ root: { marginTop: '2rem' } }} label="Summarizing conversation..." />
      )}
      {summarizationStatus === 'Complete' && summary && (
        <Stack
          horizontalAlign={'center'}
          verticalAlign={'center'}
          styles={{ root: { marginTop: '1rem', width: '100%' } }}
        >
          <Text styles={{ root: { marginTop: '0.5rem', fontWeight: 600 } }} variant="large">
            Summary
          </Text>
          <Text styles={{ root: { marginTop: '0.5rem', marginBottom: '1rem', fontStyle: 'italic' } }}>
            {summary.recap}
          </Text>
          {summary.chapters.map((chapter, index) => (
            <Chapter key={index} title={chapter.chapterTitle} narrative={chapter.narrative} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

/**
 * @private
 */
export interface StartCallButtonProps extends IButtonProps {
  className?: string;
  /** If set, the button is intended to rejoin an existing call. */
  rejoinCall?: boolean;
  hideIcon?: boolean;
}

/**
 * @private
 */
const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { rejoinCall } = props;

  return (
    <PrimaryButton
      {...props}
      data-ui-id="call-composite-start-call-button"
      className={mergeStyles(buttonStyle, props.className)}
      styles={buttonWithIconStyles}
      text={rejoinCall ? 'Re-join call' : 'Start call'}
      onRenderIcon={props.hideIcon ? undefined : () => <Video20Filled className={videoCameraIconStyle} />}
    />
  );
};

const Chapter = (props: { title: string; narrative: string }): JSX.Element => {
  return (
    <Stack
      styles={{
        root: {
          paddingLeft: '2rem',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          borderLeft: '2px solid #ccc'
        }
      }}
    >
      <Text styles={{ root: { marginBottom: '0.25rem', fontWeight: 600 } }}>{props.title}</Text>
      <Text>{props.narrative}</Text>
    </Stack>
  );
};
