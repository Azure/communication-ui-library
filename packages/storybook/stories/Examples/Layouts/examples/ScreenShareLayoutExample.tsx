import { VideoTile } from '@azure/communication-ui';
import { mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';

export const ScreenShareLayoutExample: () => JSX.Element = () => {
  const defaultParticipants = ['Michael', 'Jim', 'Pam', 'Dwight', 'Kelly', 'Ryan', 'Andy'];

  const aspectRatioBoxStyle = mergeStyles({
    border: '1',
    borderStyle: 'solid',
    width: '100%',
    height: 0,
    position: 'relative',
    paddingTop: '56.25%'
  });

  const aspectRatioBoxContentStyle = mergeStyles({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  });

  const videoStreamStyle = mergeStyles({
    border: '1',
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '.25rem',
    right: '.25rem',
    height: '20%',
    width: '30%'
  });

  const participantsComponents = defaultParticipants.map((participant, index) => {
    return (
      <Stack className={aspectRatioBoxStyle} key={index}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            isVideoReady={false}
            placeholderProvider={
              <Persona
                styles={{ root: { margin: 'auto' } }}
                size={PersonaSize.size56}
                hidePersonaDetails={true}
                text={participant}
                initialsTextColor="white"
              />
            }
          >
            <label>{participant}</label>
          </VideoTile>
        </Stack>
      </Stack>
    );
  });

  return (
    <Stack style={{ height: `500px`, width: `850px`, border: '1px' }} horizontal>
      {/* Side panel component in this layout */}
      <Stack.Item className={mergeStyles({ height: '100%', width: '30%' })}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          {participantsComponents}
        </Stack>
      </Stack.Item>
      {/* Screen share stream component in this layout */}
      <Stack.Item grow className={mergeStyles({ height: '100%' })}>
        {/* The screen share component that will display the screen share stream and sharer's video */}
        <VideoTile
          isVideoReady={false}
          styles={{
            overlayContainer: videoStreamStyle
          }}
          // A placeholder element for the screen share stream
          placeholderProvider={
            <Stack className={mergeStyles({ height: '100%' })}>
              <Stack verticalAlign="center" horizontalAlign="center" className={mergeStyles({ height: '100%' })}>
                Your Screen Share Stream
              </Stack>
            </Stack>
          }
        >
          {/* Video component for screen sharer's stream */}
          <VideoTile
            isVideoReady={false}
            // A placeholder element for screen sharer's video stream
            placeholderProvider={
              <Persona
                styles={{ root: { margin: 'auto' } }}
                size={PersonaSize.size56}
                hidePersonaDetails={true}
                text={'Toby'}
                initialsTextColor="white"
              />
            }
          />
        </VideoTile>
      </Stack.Item>
    </Stack>
  );
};
