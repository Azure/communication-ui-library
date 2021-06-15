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
import React, { useState } from 'react';
import { createUserAndGroup } from './snippets/CallBackend.snippet';

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10
};

export const CallBackend = (): JSX.Element => {
  const theme = useTheme();

  const [connectionString, setConnectionString] = useState('');
  const [response, setResponse] = useState();
  // TODO: Error handling when connection string is wrong.
  return (
    <Stack
      tokens={verticalGapStackTokens}
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        width: '75vw'
      })}
    >
      <Stack.Item
        styles={{
          root: {
            background: theme.palette.neutralLight,
            color: theme.palette.themePrimary,
            padding: 5
          }
        }}
      >
        <Stack
          tokens={verticalGapStackTokens}
          className={mergeStyles({
            width: '100%'
          })}
        >
          <Stack.Item
            className={mergeStyles({
              background: theme.palette.neutralLight,
              color: theme.palette.themePrimary
            })}
          >
            <TextField
              required
              className={mergeStyles({
                width: '100%'
              })}
              placeholder="Enter a valid connection string"
              onChange={(_, value) => setConnectionString(value ?? '')}
            />
          </Stack.Item>
          <Stack.Item>
            <PrimaryButton
              text="Generate"
              onClick={async () => setResponse(await createUserAndGroup(connectionString))}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item
        className={mergeStyles({
          background: theme.palette.neutralLight,
          color: theme.palette.themePrimary,
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
    return <Text>Please enter connection string to continue...</Text>;
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
