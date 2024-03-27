import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { AzureCommunicationCallAdapterOptions } from '@azure/communication-react';
import { onResolveVideoEffectDependencyLazy } from '@azure/communication-react';
import { CallComposite, CallCompositeOptions, useAzureCommunicationCallAdapter } from '@azure/communication-react';
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

const videoBackgroundImages = [
  {
    key: 'ab1',
    url: '/assets/backgrounds/contoso.png',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab1',
    url: '/assets/backgrounds/contoso.png',
    tooltipText: 'Custom Background'
  }
];
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
        <CallComposite adapter={adapter} formFactor={formFactor} fluentTheme={fluentTheme} options={options} />
      </Stack>
    );
  }

  return <></>;
};
