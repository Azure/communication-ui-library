import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  createAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { IContextualMenuItem, mergeStyles, PartialTheme, Theme } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
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
              userId: { kind: 'communicationUser', communicationUserId: props.userId.communicationUserId },
              displayName: props.displayName,
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
          fluentTheme={props.fluentTheme}
          callInvitationURL={props?.callInvitationURL}
          locale={props?.locale}
          options={props?.options}
          onFetchParticipantMenuItems={participantMenuItemsCallBack}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};

const participantMenuItemsCallBack = () => {
  return menuItems;
};

const menuItems: IContextualMenuItem[] = [
  {
    key: 'newItem',
    className: mergeStyles({ background: 'red' }),
    subMenuProps: {
      items: [
        { key: 'emailMessage', text: 'Email message', title: 'Create an email' },
        { key: 'calendarEvent', text: 'Calendar event', title: 'Create a calendar event' },
        { key: '1', text: 'Email message', title: 'Create an email' },
        { key: '2', text: 'Email message', title: 'Create an email' },
        { key: '3', text: 'Email message', title: 'Create an email' },
        { key: '4', text: 'Email message', title: 'Create an email' },
        { key: '5', text: 'Email message', title: 'Create an email' },
        { key: '6', text: 'Email message', title: 'Create an email' },
        { key: '7', text: 'Email message', title: 'Create an email' },
        { key: '8', text: 'Email message', title: 'Create an email' },
        { key: '11', text: 'Email message', title: 'Create an email' },
        { key: '12', text: 'Email message', title: 'Create an email' },
        { key: '13', text: 'Email message', title: 'Create an email' },
        { key: '14', text: 'Email message', title: 'Create an email' },
        { key: '15', text: 'Email message', title: 'Create an email' },
        { key: '16', text: 'Email message', title: 'Create an email' },
        { key: '111', text: 'Email message', title: 'Create an email' },
        { key: '112', text: 'Email message', title: 'Create an email' },
        { key: '113', text: 'Email message', title: 'Create an email' },
        { key: '114', text: 'Email message', title: 'Create an email' },
        { key: '115', text: 'Email message', title: 'Create an email' },
        { key: '116', text: 'Email message', title: 'Create an email' },
        { key: '121', text: 'Email message', title: 'Create an email' },
        { key: '122', text: 'Email message', title: 'Create an email' }
      ]
    },
    href: 'https://bing.com',
    text: 'New',
    target: '_blank',
    ariaLabel: 'New. Press enter or right arrow keys to open submenu.'
  },
  {
    key: 'share',
    subMenuProps: {
      items: [
        { key: 'sharetotwitter', text: 'Share to Twitter' },
        { key: 'sharetofacebook', text: 'Share to Facebook' },
        {
          key: 'sharetoemail',
          text: 'Share to Email',
          subMenuProps: {
            items: [
              { key: 'sharetooutlook_1', text: 'Share to Outlook', title: 'Share to Outlook' },
              { key: 'sharetogmail_1', text: 'Share to Gmail', title: 'Share to Gmail' }
            ]
          }
        }
      ]
    },
    text: 'Share',
    ariaLabel: 'Share. Press enter, space or right arrow keys to open submenu.'
  },
  {
    key: 'shareSplit',
    split: true,
    'aria-roledescription': 'split button',
    subMenuProps: {
      items: [
        { key: 'sharetotwittersplit', text: 'Share to Twitter' },
        { key: 'sharetofacebooksplit', text: 'Share to Facebook' },
        {
          key: 'sharetoemailsplit',
          text: 'Share to Email',
          subMenuProps: {
            items: [
              { key: 'sharetooutlooksplit_1', text: 'Share to Outlook', title: 'Share to Outlook' },
              { key: 'sharetogmailsplit_1', text: 'Share to Gmail', title: 'Share to Gmail' }
            ]
          }
        }
      ]
    },
    text: 'Share w/ Split',
    ariaLabel: 'Share w/ Split. Press enter or space keys to trigger action. Press right arrow key to open submenu.'
  }
];
