// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { text } from '@storybook/addon-knobs';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-administration';
import { getDocs } from './OneToOneCallCompositeDocs';
import { OneToOneCall } from 'react-composites';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';
import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/OneToOneCall`,
  component: OneToOneCall,
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
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {requiredInformationObtained && (
        <OneToOneCall displayName={randomCallerName()} calleeId={calleeId} token={token} />
      )}
      {!requiredInformationObtained &&
        CompositeConnectionParamsErrMessage([
          COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'One To One Call')
        ])}
    </div>
  );
};

export const OneToOneCallComposite: () => JSX.Element = () => {
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
