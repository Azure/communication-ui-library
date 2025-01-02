import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  CompositeLocale,
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { Dropdown, IDropdownOption, PartialTheme, PrimaryButton, Theme } from '@fluentui/react';
import React, { useMemo, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  meetingLink: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  // Keep state of the selected participants to toggle audio
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

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
      locator: {
        meetingLink: props.meetingLink
      }
    }),
    [props.userId, credential, props.meetingLink]
  );

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  const participantsOptions = useMemo(
    () =>
      Object.values(adapter?.getState().call?.remoteParticipants ?? {}).map((participant) => ({
        key: toFlatCommunicationIdentifier(participant.identifier),
        text: participant.displayName ?? 'Unnamed participant'
      })),
    [adapter]
  );

  const onChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
    if (item) {
      setSelectedParticipants(
        item.selected
          ? [...selectedParticipants, item.key as string]
          : selectedParticipants.filter((key) => key !== item.key)
      );
    }
  };

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          locale={props?.locale}
        />
        <Dropdown
          placeholder="Select participants to toggle audio"
          label="Select participants"
          selectedKeys={selectedParticipants}
          onChange={onChange}
          multiSelect
          options={participantsOptions}
        />
        <PrimaryButton
          onClick={() => {
            if (selectedParticipants && selectedParticipants.length > 0) {
              adapter.forbidAudio(selectedParticipants);
            }
          }}
          disabled={!selectedParticipants || selectedParticipants.length === 0}
        >
          Disable mic for attendee(s)
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            if (selectedParticipants && selectedParticipants.length > 0) {
              adapter.permitAudio(selectedParticipants);
            }
          }}
          disabled={!selectedParticipants || selectedParticipants.length === 0}
        >
          Enable mic for attendee(s)
        </PrimaryButton>
      </div>
    );
  }
  return <>Initializing...</>;
};
