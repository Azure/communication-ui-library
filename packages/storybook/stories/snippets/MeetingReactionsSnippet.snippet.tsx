import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  CallCompositeOptions,
  ReactionResources,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  groupId: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  options?: CallCompositeOptions;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const { userId, token, formFactor, fluentTheme, options, groupId } = props;
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('failed to construct token credential');
      return undefined;
    }
  }, [token]);

  const callAdapterArgs = useMemo(() => {
    /**
     * We support 5 specific emotions to render in the meeting.
     * You will need to provide urls where your sprite animation images will live and make sure that they are loaded appropriately.
     * You will also need to provide the frame count of the animation resource.
     */
    const reactionResources: ReactionResources = {
      likeReaction: { url: 'path/to/your/sprite/like.png', frameCount: 128 },
      heartReaction: { url: 'path/to/your/sprite/heart.png', frameCount: 128 },
      laughReaction: { url: 'path/to/your/sprite/laugh.png', frameCount: 128 },
      applauseReaction: { url: 'path/to/your/sprite/applause.png', frameCount: 128 },
      surprisedReaction: { url: 'path/to/your/sprite/surprised.png', frameCount: 128 }
    };
    return {
      userId,
      credential,
      locator: { groupId },
      options: {
        reactionResources: reactionResources
      }
    };
  }, [credential, groupId, userId]);

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  if (adapter) {
    return (
      <Stack>
        <CallComposite adapter={adapter} formFactor={formFactor} fluentTheme={fluentTheme} options={options} />
      </Stack>
    );
  }

  return <></>;
};
