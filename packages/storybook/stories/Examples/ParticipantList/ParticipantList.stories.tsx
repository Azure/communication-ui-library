import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { ParticipantItem } from '@azure/communication-ui';
import { boolean, text, select } from '@storybook/addon-knobs';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { Stack, PersonaPresence } from '@fluentui/react';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { getDocs } from './ParticipantListDocs';

const onlyUnique = (value: string, index: number, self: string[]): boolean => {
  return self.indexOf(value) === index;
};

const personaPresenceMap = {
  ['None']: PersonaPresence.none,
  ['Offline']: PersonaPresence.offline,
  ['Online']: PersonaPresence.online,
  ['Away']: PersonaPresence.away,
  ['DoNoDisturb']: PersonaPresence.dnd,
  ['Blocked']: PersonaPresence.blocked,
  ['Busy']: PersonaPresence.busy
};

export const ParticipantListComponent: () => JSX.Element = () => {
  const remoteParticipantsKnob = text('Participants (comma separated)', 'Rick, Daryl, Michonne');
  const remoteParticipantsArr = remoteParticipantsKnob
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p)
    .filter(onlyUnique);
  const screenSharer = select('Screensharer', ['None', ...remoteParticipantsArr], 'screensharer');
  const presenceArr: string[] = [];
  const mutedFlags: boolean[] = [];
  remoteParticipantsArr.forEach((p) => {
    presenceArr.push(
      select('Presence of ' + p, ['None', 'Offline', 'Online', 'Away', 'DoNoDisturb', 'Blocked', 'Busy'], 'Online')
    );
    mutedFlags.push(boolean('Is ' + p + ' muted', false));
  });
  const remoteParticipants = remoteParticipantsArr.map((p, i) => {
    return {
      displayName: p,
      presence: personaPresenceMap[presenceArr[i]],
      isMuted: mutedFlags[i]
    };
  });

  const headingStyle = { fontSize: '1.5rem', marginBottom: '1rem' };
  const stackStyle = { width: '12.5rem' };

  return (
    <Stack>
      <h1 style={headingStyle}>Participants</h1>
      <Stack style={stackStyle}>
        {remoteParticipants.map((p) => {
          const menuItems = [
            {
              key: 'mute',
              text: p.isMuted ? 'Unmute' : 'Mute'
            }
          ];
          if (p.displayName === screenSharer) {
            menuItems.push({
              key: 'stopScreenShare',
              text: 'Stop screenshare'
            });
          }

          return (
            // eslint-disable-next-line react/jsx-key
            <ParticipantItem
              name={p.displayName}
              presence={p.presence}
              onRenderIcon={() => (
                <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
                  {p.displayName === screenSharer && <CallControlPresentNewIcon size="small" />}
                  {p.isMuted && <MicOffIcon size="small" />}
                </Stack>
              )}
              menuItems={menuItems}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/ParticipantList`,
  component: ParticipantListComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
