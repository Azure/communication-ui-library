// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPersonaProps, Persona } from '@fluentui/react';
import { PersonalData, PersonalDataCallback } from './PersonalData';
import React, { useEffect } from 'react';

export interface AvatarPersonaProps extends IPersonaProps {
  /**
   * Azure Communicator user ID.
   */
  userId?: string;
  /**
   * A function that returns a Promise that resolves to the data to be displayed.
   */
  dataProvider?: PersonalDataCallback;
}

/**
 * An Avatar component made using the `Persona` component.
 * It allows you to specify a `userId` and a `dataProvider` to retrieve the `AvatarPersonaData`.
 * Read more about `Persona` component at https://developer.microsoft.com/en-us/fluentui#/controls/web/persona
 */
export const AvatarPersona = (props: AvatarPersonaProps): JSX.Element => {
  const { userId, dataProvider } = props;
  const [data, setData] = React.useState<PersonalData | undefined>();

  useEffect(() => {
    (async () => {
      if (dataProvider && userId) {
        const data = await dataProvider(userId);
        setData(data);
      }
    })();
  }, [dataProvider, userId]);

  return (
    <Persona
      {...props}
      text={data?.text ?? props.text}
      imageUrl={data?.imageUrl ?? props.imageUrl}
      imageInitials={data?.imageInitials ?? props.imageInitials}
      initialsColor={data?.initialsColor ?? props.initialsColor}
      initialsTextColor={data?.initialsTextColor ?? props.initialsTextColor ?? 'white'}
    />
  );
};
