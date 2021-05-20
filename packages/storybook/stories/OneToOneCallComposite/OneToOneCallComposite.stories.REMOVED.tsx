// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * THIS COMPOSITE HAS BEEN REMOVED FROM STORYBOOK.
 * WHEN THE COMPOSITE HAS BEEN FULLY TESTED AND IS EXPORTED
 * FROM THE REACT-COMPOSITES PACKAGE THIS STORY SHOULD BE
 * REVIVED.
 */

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useState } from 'react';
import { OneToOneCall as OneToOneCallComposite } from 'react-composites';
import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';

const importStatement = `
import { OneToOneCall } from 'react-composites';
import { Provider, teamsTheme } from '@fluentui/react-northstar';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
`;

const exampleCode = `
const containerStyle = {
  width: '90vw',
  height: '90vh'
};

/**
 * Helper function to generate a user token using your ACS connection string.
 * This code should reside in the server-side logic.
 * WARNING: Never expose/use your ACS Connection String in your front-end code.
 */
const createUserToken = async (connectionString: string): Promise<CommunicationUserToken> => {
  if (!connectionString) {
    throw new Error('No ACS connection string provided');
  }
  const tokenClient = new CommunicationIdentityClient(connectionString);
  const user = await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, ['voip']);
  return token;
};

export const OneToOneCallComposite: () => JSX.Element = () => {
  const [token, setToken] = useState<string>('GENERATED_TOKEN_USING_createUserToken()');
  const [userId, setUserId] = useState<string>('CALLEE_ID');

  return (
    <Provider theme={teamsTheme} style={containerStyle}>
      <OneToOneCall displayName={'YOUR_DISPLAY_NAME'} calleeId={userId} token={token} />
    </Provider>
  )
};
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>OneToOneCall</Title>
      <Description>OneToOneCall is an one-stop component that you can make a 1-1 call using ACS.</Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example Code</Heading>
      <Source code={exampleCode} />

      <Heading>Props</Heading>
      <Props of={OneToOneCallComposite} />
    </>
  );
};

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/One To One Call`,
  component: OneToOneCallComposite,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

const createUserToken = async (connectionString: string): Promise<CommunicationUserToken> => {
  if (!connectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(connectionString);
  const token = await tokenClient.createUserAndToken(['voip']);

  console.log('User: ', token.user);
  console.log('Token: ', token.token);

  return token;
};

const firstNames = ['Albus', 'Harry', 'Hermione', 'Ron', 'Dobby', 'Luna', 'Argus'],
  secondNames = ['Dumbledore', 'Potter', 'Granger', 'Voldemort', 'Elf', 'Lovegood', 'Filch'],
  randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min),
  randomName = (nameArray: string[]): string => `${nameArray[randomInt(0, nameArray.length - 1)]}`,
  randomCallerName = (): string => `${randomName(firstNames)} ${randomName(secondNames)}`;

const OneToOneCallCompositeInstance: (token: string, calleeId?: string) => JSX.Element = (
  token: string,
  calleeId?: string
) => {
  const requiredInformationObtained = token;

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {requiredInformationObtained && (
        <OneToOneCallComposite displayName={randomCallerName()} calleeId={calleeId} token={token} />
      )}
      {!requiredInformationObtained &&
        CompositeConnectionParamsErrMessage([
          COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'One To One Call')
        ])}
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const OneToOneCall: () => JSX.Element = () => {
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const connectionString = text(COMPOSITE_STRING_CONNECTIONSTRING, '');

  useEffect(() => {
    (async () => {
      try {
        if (connectionString) {
          const userTokenResponse = await createUserToken(connectionString);
          setToken(userTokenResponse.token);
          setUserId(userTokenResponse.user.communicationUserId);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [connectionString]);

  return OneToOneCallCompositeInstance(token, userId);
};
