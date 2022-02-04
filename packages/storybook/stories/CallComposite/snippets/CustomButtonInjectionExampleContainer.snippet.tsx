import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  createAzureCommunicationCallAdapter,
  CustomCallControlButtonCallback,
  CustomCallControlButtonCallbackArgs,
  CustomCallControlButtonProps
} from '@azure/communication-react';
import { Icon, PartialTheme, Theme } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  displayCustomButton?: boolean;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');

export const CustomButtonInjectionExampleContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  useEffect(() => {
    (async () => {
      if (!!credential && props.locator && props.displayName) {
        const callLocator = isTeamsMeetingLink(props.locator)
          ? { meetingLink: props.locator }
          : { groupId: props.locator };
        const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
          setAdapter(
            await createAzureCommunicationCallAdapter({
              userId: props.userId,
              displayName: props.displayName, // Max 256 Characters
              credential,
              locator: callLocator
            })
          );
        };
        createAdapter(credential);
      }
    })();
  }, [props, credential]);

  useEffect(() => {
    return () => {
      (async () => {
        if (!adapter) {
          return;
        }
        await adapter.leaveCall().catch((e) => {
          console.error('Failed to leave call', e);
        });
        adapter.dispose();
      })();
    };
  }, [adapter]);

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          callInvitationUrl={props?.callInvitationURL}
          locale={props?.locale}
          options={props?.displayCustomButton ? { callControls: { onFetchCustomButtonProps } } : props?.options}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};

const onFetchCustomButtonProps: CustomCallControlButtonCallback[] = [
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      showLabel: args.displayType !== 'compact',
      // Some non-default icon that is already registered by the composites.
      onRenderOffIcon: () => <Icon iconName="MessageSeen" />,
      onRenderOnIcon: () => <Icon iconName="MessageSeen" />,
      strings: {
        label: 'custom #1'
      },
      placement: 'beforeMicrophoneButton'
    };
  }
];
