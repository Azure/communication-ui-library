import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  AvatarPersonaDataCallback,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  OnFetchProfileCallback,
  Profile,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
  // Teams user ids need to be in format '8:orgid:<UUID>'. For example, '8:orgid:87d349ed-44d7-43e1-9a83-5f2406dee5bd'
  // Teams resource account ids linked to a call queue need to be in format '28:orgid:<UUID>'. For example,
  // '28:orgid:87d349ed-44d7-43e1-9a83-5f2406dee5bd'
  microsoftTeamsUserId?: string;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const callAdapterArgs = useMemo(
    () => ({
      userId: props.userId,
      credential,
      locator: props.microsoftTeamsUserId
        ? {
            participantIds: [props.microsoftTeamsUserId]
          }
        : undefined,
      // To provide a display name for call queues
      options: { onFetchProfile }
    }),
    [props.userId, credential, props.microsoftTeamsUserId]
  );

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  if (!props.microsoftTeamsUserId) {
    return <>Microsoft Teams user id is not provided.</>;
  }

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          locale={props?.locale}
          options={props?.options}
          // To provide a custom avatar for call queues
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};

// Using an OnFetchProfileCallback to give our call queue a display name. By default, call queues don't have one.
const onFetchProfile: OnFetchProfileCallback = async (
  userId: string,
  defaultProfile?: Profile
): Promise<Profile | undefined> => {
  if (userId === '<Some Teams resource account id linked to a call queue>') {
    return { displayName: 'Custom call queue display name' };
  }
  return defaultProfile;
};

// Using an AvatarPersonaDataCallback to customize the avatar of our call queue
const onFetchAvatarPersonaData: AvatarPersonaDataCallback = async (userId: string): Promise<AvatarPersonaData> => {
  if (userId === '<Some Teams resource account id linked to a call queue>') {
    return {
      imageUrl:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMjkzODRGIi8+CjxwYXRoIGQ9Ik0xMS45OTAyIDMuMjVDMTIuNTgyNyAzLjI1IDEzLjE0OTEgMy4zMjgxMiAxMy42ODk1IDMuNDg0MzhDMTQuMjI5OCAzLjYzNDExIDE0LjczMTEgMy44NDU3IDE1LjE5MzQgNC4xMTkxNEMxNS42NTU2IDQuMzkyNTggMTYuMDcyMyA0LjcyNDYxIDE2LjQ0MzQgNS4xMTUyM0MxNi44MjEgNS41MDU4NiAxNy4xNDMyIDUuOTM1NTUgMTcuNDEwMiA2LjQwNDNDMTcuNjc3MSA2Ljg3MzA1IDE3Ljg4MjIgNy4zODA4NiAxOC4wMjU0IDcuOTI3NzNDMTguMTY4NiA4LjQ2ODEgMTguMjQwMiA5LjAzMTI1IDE4LjI0MDIgOS42MTcxOUMxOC40MjkgOS42ODIyOSAxOC41OTgzIDkuNzczNDQgMTguNzQ4IDkuODkwNjJDMTguOTA0MyAxMC4wMDc4IDE5LjAzNDUgMTAuMTQ0NSAxOS4xMzg3IDEwLjMwMDhDMTkuMjQ5MyAxMC40NTA1IDE5LjMzNCAxMC42MTk4IDE5LjM5MjYgMTAuODA4NkMxOS40NTc3IDEwLjk5MDkgMTkuNDkwMiAxMS4xNzk3IDE5LjQ5MDIgMTEuMzc1VjEzLjg3NUMxOS40OTAyIDE0LjEyODkgMTkuNDQxNCAxNC4zNjk4IDE5LjM0MzggMTQuNTk3N0MxOS4yNDYxIDE0LjgyNTUgMTkuMTA5NCAxNS4wMjczIDE4LjkzMzYgMTUuMjAzMUMxOC43NjQzIDE1LjM3MjQgMTguNTY1OCAxNS41MDU5IDE4LjMzNzkgMTUuNjAzNUMxOC4xMSAxNS43MDEyIDE3Ljg2OTEgMTUuNzUgMTcuNjE1MiAxNS43NUgxNi4zNjUyQzE2LjE5NiAxNS43NSAxNi4wNDk1IDE1LjY4ODIgMTUuOTI1OCAxNS41NjQ1QzE1LjgwMjEgMTUuNDQwOCAxNS43NDAyIDE1LjI5NDMgMTUuNzQwMiAxNS4xMjVWMTAuMTI1QzE1Ljc0MDIgOS45NDkyMiAxNS43ODI2IDkuODE5MDEgMTUuODY3MiA5LjczNDM4QzE1Ljk1MTggOS42NDMyMyAxNi4wNTYgOS41ODEzOCAxNi4xNzk3IDkuNTQ4ODNDMTYuMzAzNCA5LjUwOTc3IDE2LjQzNjggOS40OTM0OSAxNi41ODAxIDkuNUMxNi43Mjk4IDkuNSAxNi44NjY1IDkuNSAxNi45OTAyIDkuNUMxNi45OTAyIDguODA5OSAxNi44NTY4IDguMTYyMTEgMTYuNTg5OCA3LjU1NjY0QzE2LjMyOTQgNi45NTExNyAxNS45NzE0IDYuNDIzODMgMTUuNTE1NiA1Ljk3NDYxQzE1LjA2NjQgNS41MTg4OCAxNC41MzkxIDUuMTYwODEgMTMuOTMzNiA0LjkwMDM5QzEzLjMyODEgNC42MzM0NiAxMi42ODAzIDQuNSAxMS45OTAyIDQuNUMxMS4zMDAxIDQuNSAxMC42NTIzIDQuNjMzNDYgMTAuMDQ2OSA0LjkwMDM5QzkuNDQxNDEgNS4xNjA4MSA4LjkxMDgxIDUuNTE4ODggOC40NTUwOCA1Ljk3NDYxQzguMDA1ODYgNi40MjM4MyA3LjY0Nzc5IDYuOTUxMTcgNy4zODA4NiA3LjU1NjY0QzcuMTIwNDQgOC4xNjIxMSA2Ljk5MDIzIDguODA5OSA2Ljk5MDIzIDkuNUg3LjI3MzQ0QzcuMzg0MTEgOS41IDcuNDk4MDUgOS41MDY1MSA3LjYxNTIzIDkuNTE5NTNDNy43MzI0MiA5LjUyNjA0IDcuODM2NTkgOS41NTIwOCA3LjkyNzczIDkuNTk3NjZDOC4wMTg4OCA5LjYzNjcyIDguMDkzNzUgOS42OTg1NyA4LjE1MjM0IDkuNzgzMkM4LjIxMDk0IDkuODY3ODQgOC4yNDAyMyA5Ljk4MTc3IDguMjQwMjMgMTAuMTI1VjE1LjEyNUM4LjI0MDIzIDE1LjMwMDggOC4xOTc5MiAxNS40MzQyIDguMTEzMjggMTUuNTI1NEM4LjAyODY1IDE1LjYxIDcuOTI0NDggMTUuNjcxOSA3LjgwMDc4IDE1LjcxMDlDNy42NzcwOCAxNS43NDM1IDcuNTQwMzYgMTUuNzU5OCA3LjM5MDYyIDE1Ljc1OThDNy4yNDc0IDE1Ljc1MzMgNy4xMTM5MyAxNS43NSA2Ljk5MDIzIDE1Ljc1VjE3Ljk3NjZDNi45OTAyMyAxOC4xMzI4IDcuMDM5MDYgMTguMjYzIDcuMTM2NzIgMTguMzY3MkM3LjI0MDg5IDE4LjQ2NDggNy4zNzEwOSAxOC41NDYyIDcuNTI3MzQgMTguNjExM0M3LjY5MDEgMTguNjc2NCA3Ljg2OTE0IDE4LjcyNTMgOC4wNjQ0NSAxOC43NTc4QzguMjU5NzcgMTguNzkwNCA4LjQ1NTA4IDE4LjgxNjQgOC42NTAzOSAxOC44MzU5QzguODQ1NyAxOC44NDkgOS4wMjc5OSAxOC44NTg3IDkuMTk3MjcgMTguODY1MkM5LjM2NjU0IDE4Ljg2NTIgOS41MDMyNiAxOC44NjUyIDkuNjA3NDIgMTguODY1MkM5LjY3OTA0IDE4LjY4MjkgOS43NzM0NCAxOC41MTY5IDkuODkwNjIgMTguMzY3MkMxMC4wMDc4IDE4LjIxNzQgMTAuMTQxMyAxOC4wODcyIDEwLjI5MSAxNy45NzY2QzEwLjQ0NzMgMTcuODY1OSAxMC42MTY1IDE3Ljc4MTIgMTAuNzk4OCAxNy43MjI3QzEwLjk4MTEgMTcuNjU3NiAxMS4xNjk5IDE3LjYyNSAxMS4zNjUyIDE3LjYyNUgxMS45OTAyQzEyLjI0NDEgMTcuNjI1IDEyLjQ4NSAxNy42NzM4IDEyLjcxMjkgMTcuNzcxNUMxMi45NDA4IDE3Ljg2OTEgMTMuMTM5MyAxOC4wMDU5IDEzLjMwODYgMTguMTgxNkMxMy40ODQ0IDE4LjM1MDkgMTMuNjIxMSAxOC41NDk1IDEzLjcxODggMTguNzc3M0MxMy44MTY0IDE5LjAwNTIgMTMuODY1MiAxOS4yNDYxIDEzLjg2NTIgMTkuNUMxMy44NjUyIDE5Ljc1MzkgMTMuODE2NCAxOS45OTQ4IDEzLjcxODggMjAuMjIyN0MxMy42MjExIDIwLjQ1MDUgMTMuNDg0NCAyMC42NTIzIDEzLjMwODYgMjAuODI4MUMxMy4xMzkzIDIwLjk5NzQgMTIuOTQwOCAyMS4xMzA5IDEyLjcxMjkgMjEuMjI4NUMxMi40ODUgMjEuMzI2MiAxMi4yNDQxIDIxLjM3NSAxMS45OTAyIDIxLjM3NUgxMS4zNjUyQzEwLjk2MTYgMjEuMzc1IDEwLjYwMDMgMjEuMjYxMSAxMC4yODEyIDIxLjAzMzJDOS45NjIyNCAyMC43OTg4IDkuNzM0MzggMjAuNDkyOCA5LjU5NzY2IDIwLjExNTJDOS4zNTAyNiAyMC4xMDg3IDkuMDgwMDggMjAuMDk5IDguNzg3MTEgMjAuMDg1OUM4LjUwMDY1IDIwLjA3MjkgOC4yMTQxOSAyMC4wNDY5IDcuOTI3NzMgMjAuMDA3OEM3LjY0MTI4IDE5Ljk2MjIgNy4zNjQ1OCAxOS44OTcxIDcuMDk3NjYgMTkuODEyNUM2LjgzNzI0IDE5LjcyMTQgNi42MDYxMiAxOS41OTc3IDYuNDA0MyAxOS40NDE0QzYuMjAyNDcgMTkuMjc4NiA2LjAzOTcxIDE5LjA4MDEgNS45MTYwMiAxOC44NDU3QzUuNzk4ODMgMTguNjA0OCA1Ljc0MDIzIDE4LjMxNTEgNS43NDAyMyAxNy45NzY2VjE1LjYzMjhDNS41NTc5NCAxNS41Njc3IDUuMzg4NjcgMTUuNDc2NiA1LjIzMjQyIDE1LjM1OTRDNS4wNzYxNyAxNS4yNDIyIDQuOTQyNzEgMTUuMTA4NyA0LjgzMjAzIDE0Ljk1OUM0LjcyNzg2IDE0LjgwMjcgNC42NDMyMyAxNC42MzM1IDQuNTc4MTIgMTQuNDUxMkM0LjUxOTUzIDE0LjI2MjQgNC40OTAyMyAxNC4wNzAzIDQuNDkwMjMgMTMuODc1VjExLjM3NUM0LjQ5MDIzIDExLjE3OTcgNC41MTk1MyAxMC45OTA5IDQuNTc4MTIgMTAuODA4NkM0LjY0MzIzIDEwLjYxOTggNC43Mjc4NiAxMC40NTA1IDQuODMyMDMgMTAuMzAwOEM0Ljk0MjcxIDEwLjE0NDUgNS4wNzYxNyAxMC4wMDc4IDUuMjMyNDIgOS44OTA2MkM1LjM4ODY3IDkuNzczNDQgNS41NTc5NCA5LjY4MjI5IDUuNzQwMjMgOS42MTcxOUM1Ljc0MDIzIDkuMDMxMjUgNS44MTE4NSA4LjQ2ODEgNS45NTUwOCA3LjkyNzczQzYuMDk4MzEgNy4zODA4NiA2LjMwMzM5IDYuODczMDUgNi41NzAzMSA2LjQwNDNDNi44MzcyNCA1LjkzNTU1IDcuMTU2MjUgNS41MDU4NiA3LjUyNzM0IDUuMTE1MjNDNy45MDQ5NSA0LjcyNDYxIDguMzI0ODcgNC4zOTI1OCA4Ljc4NzExIDQuMTE5MTRDOS4yNDkzNSAzLjg0NTcgOS43NTA2NSAzLjYzNDExIDEwLjI5MSAzLjQ4NDM4QzEwLjgzMTQgMy4zMjgxMiAxMS4zOTc4IDMuMjUgMTEuOTkwMiAzLjI1Wk0xMS4zNjUyIDE4Ljg3NUMxMS4xOTYgMTguODc1IDExLjA0OTUgMTguOTM2OCAxMC45MjU4IDE5LjA2MDVDMTAuODAyMSAxOS4xODQyIDEwLjc0MDIgMTkuMzMwNyAxMC43NDAyIDE5LjVDMTAuNzQwMiAxOS42NjkzIDEwLjgwMjEgMTkuODE1OCAxMC45MjU4IDE5LjkzOTVDMTEuMDQ5NSAyMC4wNjMyIDExLjE5NiAyMC4xMjUgMTEuMzY1MiAyMC4xMjVIMTEuOTkwMkMxMi4xNTk1IDIwLjEyNSAxMi4zMDYgMjAuMDYzMiAxMi40Mjk3IDE5LjkzOTVDMTIuNTUzNCAxOS44MTU4IDEyLjYxNTIgMTkuNjY5MyAxMi42MTUyIDE5LjVDMTIuNjE1MiAxOS4zMzA3IDEyLjU1MzQgMTkuMTg0MiAxMi40Mjk3IDE5LjA2MDVDMTIuMzA2IDE4LjkzNjggMTIuMTU5NSAxOC44NzUgMTEuOTkwMiAxOC44NzVIMTEuMzY1MlpNNi4zNjUyMyAxMC43NUM2LjE5NTk2IDEwLjc1IDYuMDQ5NDggMTAuODExOCA1LjkyNTc4IDEwLjkzNTVDNS44MDIwOCAxMS4wNTkyIDUuNzQwMjMgMTEuMjA1NyA1Ljc0MDIzIDExLjM3NVYxMy44NzVDNS43NDAyMyAxNC4wNDQzIDUuODAyMDggMTQuMTkwOCA1LjkyNTc4IDE0LjMxNDVDNi4wNDk0OCAxNC40MzgyIDYuMTk1OTYgMTQuNSA2LjM2NTIzIDE0LjVINi45OTAyM1YxMC43NUg2LjM2NTIzWk0xNi45OTAyIDEwLjc1VjE0LjVIMTcuNjE1MkMxNy43ODQ1IDE0LjUgMTcuOTMxIDE0LjQzODIgMTguMDU0NyAxNC4zMTQ1QzE4LjE3ODQgMTQuMTkwOCAxOC4yNDAyIDE0LjA0NDMgMTguMjQwMiAxMy44NzVWMTEuMzc1QzE4LjI0MDIgMTEuMjA1NyAxOC4xNzg0IDExLjA1OTIgMTguMDU0NyAxMC45MzU1QzE3LjkzMSAxMC44MTE4IDE3Ljc4NDUgMTAuNzUgMTcuNjE1MiAxMC43NUgxNi45OTAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=='
    };
  }
  return {};
};
