// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPersonaProps, Persona } from '@fluentui/react';
import { AvatarPersonaDataCallback, AvatarPersonaData } from '@internal/react-components';
import React, { useEffect } from 'react';

/**
 * @private
 */
export interface AvatarPersonaProps extends IPersonaProps {
  /**
   * Azure Communicator user ID.
   */
  userId?: string;
  /**
   * A function that returns a Promise that resolves to the data to be displayed.
   */
  dataProvider?: AvatarPersonaDataCallback;
}

/**
 * An Avatar component made using the `Persona` component.
 * It allows you to specify a `userId` and a `dataProvider` to retrieve the `AvatarPersonaData`.
 * Read more about `Persona` component at https://developer.microsoft.com/fluentui#/controls/web/persona
 *
 * @private
 */
export const AvatarPersona = (props: AvatarPersonaProps): JSX.Element => {
  const { userId, dataProvider, text, imageUrl, imageInitials, initialsColor, initialsTextColor } = props;
  const [data, setData] = React.useState<AvatarPersonaData | undefined>();

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
      text={data?.text ?? text}
      imageUrl={data?.imageUrl ?? imageUrl}
      imageInitials={data?.imageInitials ?? imageInitials}
      initialsColor={data?.initialsColor ?? initialsColor}
      initialsTextColor={data?.initialsTextColor ?? initialsTextColor ?? 'white'}
    />
  );
};
