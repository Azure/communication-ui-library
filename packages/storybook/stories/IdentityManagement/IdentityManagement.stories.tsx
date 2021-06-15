import React, { useState } from 'react';
import { DefaultButton, Stack, Text, TextField } from '@fluentui/react';
import { createUserAndGroup } from './snippets/CallBackend.snippet';

export const callBackend = (): JSX.Element => {
  const [connectionString, setConnectionString] = useState('');
  const [response, setResponse] = useState('');
  // TODO: Error handling when connection string is wrong.
  return (
    <Stack>
      <TextField
        label="Connection string"
        required
        placeholder="Enter a valid connection string"
        onChange={(_, value) => setConnectionString(value ?? '')}
      />
      <DefaultButton
        text="Generate New User"
        onClick={async () => setResponse(JSON.stringify(await createUserAndGroup(connectionString)))}
      />
      {response ? <Text>{response}</Text> : <Text>Please enter connection string to continue...</Text>}
    </Stack>
  );
};
