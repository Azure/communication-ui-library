// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(one-to-n-calling) */
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import React, { useEffect, useState } from 'react';
import { fetchTokenResponse } from '../utils/AppUtils';
import {
  FluentThemeProvider,
  StatefulCallClient,
  createStatefulCallClient,
  fromFlatCommunicationIdentifier
} from '@azure/communication-react';
/* @conditional-compile-remove(one-to-n-calling) */
import { DeclarativeCallAgent, DeclarativeTeamsCallAgent } from '@azure/communication-react';
import { Stack, Image, Text, TextField, PrimaryButton } from '@fluentui/react';
import { imgStyle } from '../styles/HomeScreen.styles';

export interface LoginProps {
  /* @conditional-compile-remove(one-to-n-calling) */
  onSetUserIdentifier: (user: CommunicationUserIdentifier) => void;
  onSetStatefulClient: (client: StatefulCallClient) => void;
  /* @conditional-compile-remove(one-to-n-calling) */
  onSetCallAgent: (callAgent: DeclarativeCallAgent | DeclarativeTeamsCallAgent) => void;
  /* @conditional-compile-remove(one-to-n-calling) */
  onSetTeamsIdentity: (identity: string) => void;
  setTokenCredentialError: (error: boolean) => void;
  headerImageProps?: {
    src?: string;
  };
}

export const LoginScreen = (props: LoginProps): JSX.Element => {
  const {
    /* @conditional-compile-remove(one-to-n-calling) */
    onSetCallAgent,
    /* @conditional-compile-remove(one-to-n-calling) */
    onSetUserIdentifier,
    /* @conditional-compile-remove(one-to-n-calling) */
    onSetTeamsIdentity,
    onSetStatefulClient,
    headerImageProps,
    setTokenCredentialError
  } = props;
  // Get Azure Communications Service token and Voice app identification from the server.

  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  /* @conditional-compile-remove(one-to-n-calling) */
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent | DeclarativeTeamsCallAgent>();
  /* @conditional-compile-remove(one-to-n-calling) */
  const [displayName, setDisplayName] = useState<string>();
  /* @conditional-compile-remove(one-to-n-calling) */
  const [tokenCredential, setTokenCredential] = useState<AzureCommunicationTokenCredential>();
  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();

  const [isCTE, setIsCTEUser] = useState<boolean>();
  const [teamsIdentityInformation, setTeamsIdentityInformation] = useState<{
    identifier: string | undefined;
    token: string | undefined;
  }>();

  useEffect(() => {
    (async () => {
      if (isCTE === false) {
        try {
          const { token, user } = await fetchTokenResponse();
          console.log('Token fetched: ', token);
          console.log('User fetched: ', user);
          setUserIdentifier(user);
          /* @conditional-compile-remove(one-to-n-calling) */
          onSetUserIdentifier(user);
          /* @conditional-compile-remove(one-to-n-calling) */
          setTokenCredential(new AzureCommunicationTokenCredential(token));
        } catch (e) {
          console.error(e);
          setTokenCredentialError(true);
        }
      }
    })();
  }, [
    isCTE,
    setTokenCredentialError,
    /* @conditional-compile-remove(one-to-n-calling) */ onSetUserIdentifier,
    setUserIdentifier
  ]);

  useEffect(() => {
    if (statefulCallClient === undefined) {
      if (isCTE === true && teamsIdentityInformation?.identifier !== undefined) {
        const statefulClient = createStatefulCallClient({
          userId: fromFlatCommunicationIdentifier(teamsIdentityInformation.identifier) as MicrosoftTeamsUserIdentifier
        });
        onSetStatefulClient(statefulClient);
        setStatefulCallClient(statefulClient);
        /* @conditional-compile-remove(one-to-n-calling) */
        onSetTeamsIdentity(teamsIdentityInformation.identifier);
        return;
      }
      if (!userIdentifier) {
        return;
      }
      const statefulClient = createStatefulCallClient({ userId: userIdentifier });
      setStatefulCallClient(statefulClient);
      onSetStatefulClient(statefulClient);
    }
    console.log('Stateful client created', statefulCallClient);
  }, [
    userIdentifier,
    isCTE,
    teamsIdentityInformation,
    /* @conditional-compile-remove(one-to-n-calling) */
    onSetStatefulClient,
    /* @conditional-compile-remove(one-to-n-calling) */
    onSetTeamsIdentity,
    setStatefulCallClient,
    statefulCallClient
  ]);

  /* @conditional-compile-remove(one-to-n-calling) */
  useEffect(() => {
    if (!isCTE && callAgent === undefined && statefulCallClient && tokenCredential && displayName) {
      const createCallAgent = async (): Promise<void> => {
        const callAgent = await statefulCallClient.createCallAgent(tokenCredential, { displayName });
        setCallAgent(callAgent);
        onSetCallAgent(callAgent);
      };
      createCallAgent();
    } else if (callAgent === undefined && statefulCallClient && isCTE) {
      const createTeamsCallAgent = async (): Promise<void> => {
        if (teamsIdentityInformation?.token !== undefined) {
          const callAgent = await statefulCallClient.createTeamsCallAgent(
            new AzureCommunicationTokenCredential(teamsIdentityInformation.token)
          );
          setCallAgent(callAgent);
          onSetCallAgent(callAgent);
        }
      };
      createTeamsCallAgent();
    }
  }, [callAgent, statefulCallClient, tokenCredential, displayName, isCTE, teamsIdentityInformation, onSetCallAgent]);

  return (
    <FluentThemeProvider>
      <Stack
        verticalAlign="center"
        tokens={{ childrenGap: '1rem' }}
        style={{ width: '30rem', height: '100%', margin: 'auto', paddingTop: '4rem', position: 'relative' }}
      >
        <Image alt="Welcome to the ACS Calling sample app" className={imgStyle} {...headerImageProps} />
        <Text styles={{ root: { fontWeight: 700, fontSize: 'large' } }}>login CTE</Text>
        <Text>
          Enter your Teams information if you want to login with CTE. Leave blank if you want to log in with ACS
        </Text>
        <TextField
          placeholder="Enter your CTE Id"
          onChange={(_, value) =>
            setTeamsIdentityInformation({ identifier: value, token: teamsIdentityInformation?.token })
          }
        ></TextField>
        <TextField
          placeholder="Enter your CTE Token"
          onChange={(_, value) =>
            setTeamsIdentityInformation({ identifier: teamsIdentityInformation?.identifier, token: value })
          }
        ></TextField>
        <PrimaryButton
          onClick={() => {
            setIsCTEUser(!!teamsIdentityInformation);
          }}
        >
          Login CTE
        </PrimaryButton>
        <Text styles={{ root: { fontWeight: 700, fontSize: 'large' } }}>login ACS</Text>
        <TextField
          placeholder="Enter your display name"
          onChange={(_, value) => {
            /* @conditional-compile-remove(one-to-n-calling) */
            setDisplayName(value);
          }}
        ></TextField>
        <PrimaryButton
          onClick={() => {
            setIsCTEUser(!!teamsIdentityInformation);
          }}
        >
          Login ACS
        </PrimaryButton>
      </Stack>
    </FluentThemeProvider>
  );
};
