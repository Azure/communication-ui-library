import { VideoTile } from '@azure/communication-react';
import { mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';

export const ScreenShareLayoutExample: () => JSX.Element = () => {
  const defaultParticipants = ['Michael', 'Jim', 'Pam', 'Dwight', 'Kelly', 'Ryan', 'Andy'];

  const aspectRatioBoxStyle = mergeStyles({
    borderWidth: '.063rem .063rem .025rem .063rem',
    borderStyle: 'solid',
    width: '100\u0025',
    height: 0,
    position: 'relative',
    paddingTop: '56.25\u0025'
  });

  const aspectRatioBoxContentStyle = mergeStyles({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100\u0025',
    height: '100\u0025'
  });

  const videoStreamStyle = mergeStyles({
    border: '1',
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '.25rem',
    right: '.25rem',
    height: '20\u0025',
    width: '30\u0025'
  });

  const screenShareLayoutStyle = {
    height: `31.25rem`,
    width: `53.125rem`,
    border: '.063rem'
  };

  const participantsComponents = defaultParticipants.map((participant, index) => {
    return (
      <Stack className={aspectRatioBoxStyle} key={index}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            isVideoReady={false}
            displayName={participant}
            placeholder={
              <Persona
                styles={{ root: { margin: 'auto' } }}
                size={PersonaSize.size56}
                hidePersonaDetails={true}
                text={participant}
                initialsTextColor="white"
              />
            }
          />
        </Stack>
      </Stack>
    );
  });

  return (
    <Stack style={screenShareLayoutStyle} horizontal>
      {/* Side panel component in this layout */}
      <Stack.Item className={mergeStyles({ height: '100\u0025', width: '30\u0025' })}>
        <Stack grow className={mergeStyles({ height: '100\u0025', overflow: 'auto' })}>
          {participantsComponents}
        </Stack>
      </Stack.Item>
      {/* Screen share stream component in this layout */}
      <Stack.Item grow className={mergeStyles({ height: '100\u0025' })}>
        {/* The screen share component that will display the screen share stream and sharer's video */}
        <VideoTile
          isVideoReady={false}
          styles={{
            overlayContainer: videoStreamStyle
          }}
          // A placeholder element for the screen share stream
          placeholder={
            <Stack className={mergeStyles({ height: '100\u0025' })}>
              <Stack verticalAlign="center" horizontalAlign="center" className={mergeStyles({ height: '100\u0025' })}>
                Your Screen Share Stream
              </Stack>
            </Stack>
          }
        >
          {/* We want to render another overlay videoTile inside the parent videoTile for screen sharer's video */}
          <VideoTile
            isVideoReady={false}
            // A placeholder element for screen sharer's video stream
            placeholder={
              <Persona
                styles={{ root: { margin: 'auto' } }}
                size={PersonaSize.size56}
                hidePersonaDetails={true}
                text={'Toby'}
                initialsTextColor="white"
              />
            }
          >
            {/* We do not want to add any overlay component for this videoTile, so we do not add children for this videoTile. */}
          </VideoTile>
        </VideoTile>
      </Stack.Item>
    </Stack>
  );
};
