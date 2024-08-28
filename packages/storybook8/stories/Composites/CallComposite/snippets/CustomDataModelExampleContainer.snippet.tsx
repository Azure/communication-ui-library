import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  CallAdapter,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  ParticipantMenuItemsCallback,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { IContextualMenuItem, PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  avatarInitials: string;
  callInvitationURL?: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

export const CustomDataModelExampleContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.token), [props.token]);
  const locator = useMemo(
    () => (isTeamsMeetingLink(props.locator) ? { meetingLink: props.locator } : { groupId: props.locator }),
    [props.locator]
  );
  const adapter = useAzureCommunicationCallAdapter(
    {
      userId: props.userId,
      displayName: props.displayName,
      credential,
      locator
    },
    undefined,
    async (adapter: CallAdapter): Promise<void> => {
      await adapter.leaveCall().catch((e) => {
        console.error('Failed to leave call', e);
      });
    }
  );

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
    if (defaultMenuItems) {
      customMenuItems = customMenuItems.concat(defaultMenuItems);
    }
    return customMenuItems;
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {adapter && (
        <CallComposite
          fluentTheme={props.fluentTheme}
          rtl={props.rtl}
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

const isTeamsMeetingLink = (link: string): boolean =>
  link.startsWith('https://teams.microsoft.com/meet/') || link.startsWith('https://teams.microsoft.com/l/meetup-join');
