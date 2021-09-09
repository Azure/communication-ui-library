// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useTheme } from '@azure/communication-react';
import {
  IconButton,
  IIconProps,
  IStackTokens,
  Link,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  mergeStyles
} from '@fluentui/react';
import copy from 'copy-to-clipboard';
import React, { useCallback, useState } from 'react';
import { createUserAndGroup } from './snippets/CallBackend.snippet';
import { createUserAndThread } from './snippets/ChatBackend.snippet';

const containerStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 15
};

const nestedStackTokens: IStackTokens = {
  childrenGap: 10
};

export const CallBackend = (): JSX.Element => {
  const theme = useTheme();

  const [connectionString, setConnectionString] = useState('');
  const [response, setResponse] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const onConnectionStringChange = useCallback((_, value) => setConnectionString(value ?? ''), []);
  const onGenerateClick = useCallback(async () => {
    createUserAndGroup(connectionString)
      .then((response) => {
        setResponse(response);
        setErrorMessage('');
      })
      .catch((reason) => {
        setResponse(undefined);
        setErrorMessage(reason.toString());
      });
  }, [connectionString]);

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
              errorMessage={errorMessage}
            />
          </Stack.Item>
          <Stack.Item>
            <PrimaryButton text="Generate" onClick={onGenerateClick} />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item>
        <CopyableResponse response={response} />
      </Stack.Item>
    </Stack>
  );
};

export const ChatBackend = (): JSX.Element => {
  const theme = useTheme();

  const [connectionString, setConnectionString] = useState('');
  const [responses, setResponses] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [displayNames, setDisplayNames] = useState(['']);

  const onConnectionStringChange = useCallback((_, value) => setConnectionString(value ?? ''), []);
  const onGenerateClick = useCallback(async () => {
    createUserAndThread(connectionString, displayNames)
      .then((response) => {
        setResponses(response);
        setErrorMessage('');
      })
      .catch((reason) => {
        setResponses(undefined);
        setErrorMessage(reason.toString());
      });
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
              errorMessage={errorMessage}
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

      <Stack.Item>
        <CopyableResponses responses={responses} />
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

const CopyableResponses = (props: { responses: unknown[] | undefined }): JSX.Element => {
  const { responses } = props;
  if (responses === undefined) {
    return <CopyableResponse response={undefined} />;
  }
  return (
    <Stack
      tokens={nestedStackTokens}
      className={mergeStyles({
        width: '100%'
      })}
    >
      {responses.map((response, i) => (
        <Stack.Item key={`response.${i}`}>
          <CopyableResponse response={response} />
        </Stack.Item>
      ))}
    </Stack>
  );
};

const CopyableResponse = (props: { response: unknown | undefined }): JSX.Element => {
  const { response } = props;
  const theme = useTheme();

  if (response === undefined) {
    return (
      <Text>
        Connection string can be{' '}
        <Link href="https://docs.microsoft.com/azure/communication-services/quickstarts/identity/quick-create-identity">
          generated on azure portal
        </Link>
        .
      </Text>
    );
  }

  const lines = JSON.stringify(response, null, 2).split(/\r?\n/);
  return (
    <Stack
      className={mergeStyles({
        background: theme.palette.neutralLighter,
        padding: 15
      })}
    >
      <Stack.Item>
        {lines.map((line) => (
          <Text block nowrap key={line}>
            {line}
          </Text>
        ))}
      </Stack.Item>
      <Stack.Item align="end">
        <IconButton iconProps={copyIcon} title="Copy" ariaLabel="Copy" onClick={() => copy(JSON.stringify(response))} />
      </Stack.Item>
    </Stack>
  );
};

const copyIcon: IIconProps = { iconName: 'Copy' };
const addIcon: IIconProps = { iconName: 'Add' };
const removeIcon: IIconProps = { iconName: 'Remove' };
