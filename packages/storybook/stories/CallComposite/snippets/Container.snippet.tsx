import { TeamsCall } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterLocator,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';
import { validate as validateUUID } from 'uuid';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');
const isGroupID = (id: string): boolean => validateUUID(id);
const isRoomID = (id: string): boolean => {
  const num = Number(id);

  if (Number.isInteger(num) && num > 0) {
    return true;
  }

  return false;
};

const createCallAdapterLocator = (locator: string): CallAdapterLocator | undefined => {
  if (isTeamsMeetingLink(locator)) {
    return { meetingLink: locator };
  } else if (isGroupID(locator)) {
    return { groupId: locator };
  } else if (isRoomID(locator)) {
    return { roomId: locator };
  }
  return undefined;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoib3JnaWQ6YTI3NDVkZDUtMDM3Ni00Njk4LWJkN2YtZWZmNmZjYzZlMjllIiwic2NwIjoxMDI0LCJjc2kiOiIxNjY0NDg5ODE5IiwiZXhwIjoxNjY0NDk0MDc5LCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJhY3NTY29wZSI6InZvaXAsY2hhdCIsInJlc291cmNlSWQiOiJiNmFhZGExZi0wYjFkLTQ3YWMtODY2Zi05MWFhZTAwYTFkMDEiLCJpYXQiOjE2NjQ0OTAxMjB9.jGsZs9KP1s5pOQPDgfOQw2Mgw7Gtn6S5qqq2bGAC2x_oH3QOiqOS0SPlg_rWWbOesCl0u7N1wLPwzmj_Fv1DMc1N3WxbyHnmxHyO3CUtLTEAvZtGnp7Q4H9A8dPHsn4sD0ghWivXfeRTZBXzvD_dQDSwD1O7B47W9dIHwr5nN3zh4ROO3NjQGEMaKmG6kPlfi7ZYtO7wredim-rvRhtkxy2vQLKJCQKkzKq1X7yv9bJ2zvZeXaX96Xn22y5SU0vQiAs29Ft867Q-5HlzMcXayJroY5AGEHNEF-fF46Z6HpPDGSm7jrBXb4-arvCqTE_qQQHuAen-PAu1uZj28Viq8A'
      );
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, []);

  const locator = useMemo(() => createCallAdapterLocator(props.locator), [props.locator]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      userId: props.userId,
      displayName: props.displayName, // Max 256 Characters
      credential,
      locator
    },
    undefined,
    leaveCall,
    'Teams'
  );

  if (!locator) {
    return <>Provided call locator '{props.locator}' is not recognized.</>;
  }

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          callInvitationUrl={props?.callInvitationURL}
          locale={props?.locale}
          options={props?.options}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};

const leaveCall = async (adapter: CallAdapter<TeamsCall>): Promise<void> => {
  await adapter.leaveCall().catch((e) => {
    console.error('Failed to leave call', e);
  });
};
