// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import {
  IconButton,
  IIconProps,
  IStackTokens,
  mergeStyles,
  PrimaryButton,
  Stack,
  TextField,
  useTheme
} from '@fluentui/react';

/**
 * @private
 */
export interface PollCreatorProps {
  onPresentPoll: (question: PollQuestion) => void;
}

/**
 * @private
 */
export interface PollQuestion {
  prompt: string;
  choices: string[];
}

/**
 * @private
 */
export const PollCreator = (props: PollCreatorProps): JSX.Element => {
  const { onPresentPoll } = props;
  const theme = useTheme();
  const [question, setQuestion] = useState<PollQuestion>({ prompt: '', choices: [] });

  return (
    <Stack
      tokens={containerStackTokens}
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        boxShadow: theme.effects.elevation4,
        width: '75%'
      })}
    >
      <Stack.Item>
        <Stack
          tokens={nestedStackTokens}
          className={mergeStyles({
            width: '100%'
          })}
        >
          <Stack.Item>
            <TextField
              required
              className={mergeStyles({
                width: '100%'
              })}
              placeholder="Enter a poll question"
              onChange={(_, prompt?: string) => prompt && setQuestion({ ...question, prompt })}
            />
          </Stack.Item>
          <Stack.Item>
            <ChiocesInput
              choices={question.choices}
              setChoices={(choices: string[]) => setQuestion({ ...question, choices })}
            />
          </Stack.Item>
          <Stack.Item>
            <PrimaryButton text="Present live poll" onClick={() => onPresentPoll(question)} />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

interface ChoicesInputProps {
  choices: string[];
  setChoices: (displayNames: string[]) => void;
}

const ChiocesInput = (props: ChoicesInputProps): JSX.Element => {
  const { choices, setChoices } = props;

  const onTextChange = useCallback(
    (i: number, value: string | undefined) => {
      const draft = [...choices];
      draft[i] = value ?? '';
      setChoices(draft);
    },
    [choices, setChoices]
  );
  const onAddChoice = useCallback(() => {
    const draft = [...choices];
    draft.push('');
    setChoices(draft);
  }, [choices, setChoices]);
  const onRemoveChoice = useCallback(() => {
    const draft = [...choices];
    draft.splice(draft.length - 1, 1);
    setChoices(draft);
  }, [choices, setChoices]);

  return (
    <Stack
      tokens={nestedStackTokens}
      className={mergeStyles({
        width: '100%'
      })}
    >
      {choices.map((name, i) => (
        <Stack.Item key={`choice.${i}`}>
          <TextField
            className={mergeStyles({
              width: '30%',
              maxWidth: 300
            })}
            placeholder={`Enter choice ${i}`}
            value={choices[i]}
            onChange={(_, value) => onTextChange(i, value)}
          />
        </Stack.Item>
      ))}
      <Stack.Item>
        <Stack
          horizontal
          tokens={nestedStackTokens}
          className={mergeStyles({
            width: '100%'
          })}
        >
          <Stack.Item>
            <IconButton iconProps={addIcon} title="Add choice" ariaLabel="Add choice" onClick={onAddChoice} />
          </Stack.Item>
          {choices.length > 1 ? (
            <Stack.Item>
              <IconButton
                iconProps={removeIcon}
                title="Remove Choice"
                ariaLabel="Remove choice"
                onClick={onRemoveChoice}
              />
            </Stack.Item>
          ) : (
            <></>
          )}
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

const containerStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 15
};

const nestedStackTokens: IStackTokens = {
  childrenGap: 10
};

const addIcon: IIconProps = { iconName: 'Add' };
const removeIcon: IIconProps = { iconName: 'Remove' };
