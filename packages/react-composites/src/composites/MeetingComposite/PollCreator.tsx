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
  Text,
  TextField,
  useTheme
} from '@fluentui/react';

interface PollCreatorProps {
  question: string;
}

/**
 * @private
 */
export const PollCreator = (props: PollCreatorProps): JSX.Element => {
  const theme = useTheme();

  const [displayNames, setDisplayNames] = useState(['']);
  const [connectionString, setConnectionString] = useState('');

  const onConnectionStringChange = useCallback((_, value) => setConnectionString(value ?? ''), []);
  const onGenerateClick = useCallback(async () => {
    // TODO: Add a callback prop to set the poll question.
  }, [connectionString, displayNames]);
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
              placeholder="Enter a valid connection string"
              onChange={onConnectionStringChange}
            />
          </Stack.Item>
          <Stack.Item>
            <Text>Chat participants:</Text>
          </Stack.Item>
          <Stack.Item>
            <DisplayNamesInput displayNames={displayNames} setDisplayNames={setDisplayNames} />
          </Stack.Item>
          <Stack.Item>
            <PrimaryButton text="Generate" onClick={onGenerateClick} />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

interface DisplayNamesInputProps {
  displayNames: string[];
  setDisplayNames: (displayNames: string[]) => void;
}

const DisplayNamesInput = (props: DisplayNamesInputProps): JSX.Element => {
  const { displayNames, setDisplayNames } = props;

  const onTextChange = useCallback(
    (i: number, value: string | undefined) => {
      // TODO: `draft` is unnecessary.
      const draft = [...displayNames];
      draft[i] = value ?? '';
      setDisplayNames(draft);
    },
    [displayNames, setDisplayNames]
  );
  const onAddParticipant = useCallback(() => {
    const draft = [...displayNames];
    draft.push('');
    setDisplayNames(draft);
  }, [displayNames, setDisplayNames]);
  const onRemoveParticipant = useCallback(() => {
    const draft = [...displayNames];
    draft.splice(draft.length - 1, 1);
    setDisplayNames(draft);
  }, [displayNames, setDisplayNames]);

  return (
    <Stack
      tokens={nestedStackTokens}
      className={mergeStyles({
        width: '100%'
      })}
    >
      {displayNames.map((name, i) => (
        <Stack.Item key={`displayNameInput.${i}`}>
          <TextField
            className={mergeStyles({
              width: '30%',
              maxWidth: 300
            })}
            placeholder="Enter display name"
            value={displayNames[i]}
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
            <IconButton
              iconProps={addIcon}
              title="Add Participant"
              ariaLabel="Add Participant"
              onClick={onAddParticipant}
            />
          </Stack.Item>
          {displayNames.length > 1 ? (
            <Stack.Item>
              <IconButton
                iconProps={removeIcon}
                title="Remove Participant"
                ariaLabel="Remove Participant"
                onClick={onRemoveParticipant}
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
