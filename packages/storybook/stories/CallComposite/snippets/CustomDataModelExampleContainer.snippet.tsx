import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  CallAdapter,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  createAzureCommunicationCallAdapter,
  ParticipantMenuItemsCallback
} from '@azure/communication-react';
import { IContextualMenuItem, PartialTheme, Theme } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  avatarInitials: string;
  callInvitationURL?: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

export const CustomDataModelExampleContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    if (props.token && props.locator) {
      const callLocator = isTeamsMeetingLink(props.locator)
        ? { meetingLink: props.locator }
        : { groupId: props.locator };
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationCallAdapter({
            userId: props.userId,
            displayName: props.displayName,
            credential: new AzureCommunicationTokenCredential(props.token),
            locator: callLocator
          })
        );
      };
      createAdapter();
    }
  }, [props]);

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

  // Data model injection: Contoso provides custom initials for the user avatar.
  //
  // Note: Call Composite doesn't implement a memoization mechanism for this callback.
  // It is recommended that Contoso memoize the `onFetchAvatarPersonaData` callback
  // to avoid costly re-fetching of data.
  // A 3rd Party utility such as Lodash (_.memoize) can be used to memoize the callback.
  const onFetchAvatarPersonaData = async (/* userId: string */): Promise<AvatarPersonaData> => ({
    text: props.avatarInitials ? props.avatarInitials : props.displayName
  });

  // Custom Menu Item Callback for Participant List
  const onFetchParticipantMenuItems: ParticipantMenuItemsCallback = (participantId, userId, defaultMenuItems) => {
    let customMenuItems: IContextualMenuItem[] = [
      {
        key: 'Custom Menu Item',
        text: 'Custom Menu Item',
        onClick: () => console.log('Custom Menu Item Clicked')
      }
    ];
    if (defaultMenuItems) customMenuItems = customMenuItems.concat(defaultMenuItems);
    return customMenuItems;
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {adapter && (
        <CallComposite
          fluentTheme={props.fluentTheme}
          adapter={adapter}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          callInvitationUrl={props?.callInvitationURL}
          locale={props?.locale}
          formFactor={props?.formFactor}
          options={props?.options}
        />
      )}
    </div>
  );
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');
