// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IStackTokens,
  Stack,
  Text,
  TextField,
  PrimaryButton,
  IconButton,
  IIconProps,
  mergeStyles,
  useTheme
} from '@fluentui/react';
import copy from 'copy-to-clipboard';
import React, { useCallback, useState } from 'react';
import { createUserAndGroup } from './snippets/CallBackend.snippet';

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
    setResponse(await createUserAndGroup(connectionString));
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

      <Stack.Item
        className={mergeStyles({
          background: theme.palette.neutralLighter,
          padding: 15
        })}
      >
        <CopyableResponse response={response} />
      </Stack.Item>
    </Stack>
  );
};

const CopyableResponse = (props: { response: unknown | undefined }): JSX.Element => {
  const { response } = props;

  if (response === undefined) {
    return <Text>Tip: Connection string can be found from the azure portal.</Text>;
  }

  const lines = JSON.stringify(response, null, 2).split(/\r?\n/);
  return (
    <Stack>
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
