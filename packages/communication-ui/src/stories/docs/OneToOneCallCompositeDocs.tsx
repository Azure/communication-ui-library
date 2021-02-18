// © Microsoft Corporation. All rights reserved.

import { Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { OneToOneCall } from '../../composites/OneToOneCall/';

const importStatement = `
import { OneToOneCall } from '@azure/communication-ui';
import { Provider } from '@fluentui/react-northstar';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-administration';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
`;

const exampleCode = `
const containerStyle = {
  width: '90vw',
  height: '90vh'
};

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
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

export const OneToOneCallCompositeComponent: () => JSX.Element = () => {
  const [token, setToken] = useState<string>('GENERATED_TOKEN_USING_createUserToken()');
  const [userId, setUserId] = useState<string>('CALLEE_ID');

  return (
    <Provider theme={iconTheme} style={containerStyle}>
      <OneToOneCall displayName={'YOUR_DISPLAY_NAME'} calleeId={userId} token={token} />
    </Provider>
  )
};
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>OneToOneCall</Title>
      <Description>OneToOneCall is an one-stop component that you can make a 1-1 call using ACS.</Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example Code</Heading>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={OneToOneCall} />
    </>
  );
};
