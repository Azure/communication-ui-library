// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { text } from '@storybook/addon-knobs';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-administration';
import { getDocs } from './OneToOneCallCompositeDocs';
import { OneToOneCall } from '../../../communication-ui/src';
import { Stack } from '@fluentui/react';
import { COMPOSITE_FOLDER_PREFIX } from '../constants';

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/OneToOneCall`,
  component: OneToOneCall,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

const experienceContainerStyle = {
  width: '90vw',
  height: '90vh'
};

const errMessage: () => JSX.Element = () => (
  <Stack horizontalAlign="center" verticalAlign="center" style={{ height: '100%', width: '100%' }}>
    {'Please enter required information below.'}
  </Stack>
);

const createUserToken = async (connectionString: string): Promise<CommunicationUserToken> => {
  if (!connectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(connectionString);
  const user = await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, ['voip']);

  console.log('User: ', user);
  console.log('Token: ', token);

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
    <div style={experienceContainerStyle}>
      {requiredInformationObtained && (
        <OneToOneCall displayName={randomCallerName()} calleeId={calleeId} token={token} />
      )}
      {!requiredInformationObtained && errMessage()}
    </div>
  );
};

export const OneToOneCallCompositeComponent: () => JSX.Element = () => {
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const connectionString = text('Connection String', '');

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
