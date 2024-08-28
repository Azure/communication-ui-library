import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AzureCommunicationCallAdapterOptions,
  onResolveVideoEffectDependencyLazy,
  CallComposite,
  CallCompositeOptions,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  groupId: string;
  options?: CallCompositeOptions;
};

/* Video background images are passed to the composite to provide the user with a list of video background images to choose from.
  Each video background image is defined by an object with the following properties:
  - key: A unique key that identifies the video background image.
  - url: The URL of the video background image.
  - tooltipText: The tooltip text that is displayed when the user hovers over the video background image in the video effects menu.
 */
const videoBackgroundImages = [
  {
    key: 'background1',
    url: '/assets/backgrounds/room.png',
    tooltipText: 'Room Background'
  },
  {
    key: 'background2',
    url: '/assets/backgrounds/office.png',
    tooltipText: 'Office Background'
  }
];

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const { userId, token, options, groupId } = props;
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('failed to construct token credential');
      return undefined;
    }
  }, [token]);

  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      videoBackgroundOptions: {
        videoBackgroundImages,
        onResolveDependency: onResolveVideoEffectDependencyLazy
      }
    };
  }, []);

  const callAdapterArgs = useMemo(() => {
    return {
      userId,
      credential,
      locator: { groupId },
      options: callAdapterOptions
    };
  }, [callAdapterOptions, credential, groupId, userId]);

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  if (adapter) {
    return (
      <Stack>
        <CallComposite adapter={adapter} options={options} />
      </Stack>
    );
  }

  return <></>;
};
