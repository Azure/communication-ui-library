import { VideoTile } from '@azure/communication-ui';
import { Label, mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';

export const ScreenShareLayoutExample: () => JSX.Element = () => {
  const defaultParticipants = ['Michael', 'Jim', 'Pam', 'Dwight', 'Kelly', 'Ryan', 'Andy'];

  const aspectRatioBoxStyle = mergeStyles({
    borderWidth: '.063rem .063rem .025rem .063rem',
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

  const screenShareLayoutStyle = {
    height: `31.25rem`,
    width: `53.125rem`,
    border: '.063rem'
  };

  const videoLabelStyle = mergeStyles({
    bottom: '5%',
    left: '2%',
    overflow: 'hidden',
    position: 'absolute',
    maxWidth: '95%'
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
            {/* The overlay component we want to render in a videoTile, in this case, we want to render a label. */}
            <Label className={videoLabelStyle}>{participant}</Label>
          </VideoTile>
        </Stack>
      </Stack>
    );
  });

  return (
    <Stack style={screenShareLayoutStyle} horizontal>
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
          {/* We want to render another overlay videoTile inside the parent videoTile for screen sharer's video */}
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
          >
            {/* We do not want to add any overlay component for this videoTile, so we do not add children for this videoTile. */}
          </VideoTile>
        </VideoTile>
      </Stack.Item>
    </Stack>
  );
};
