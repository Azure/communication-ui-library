import { VideoTile } from '@azure/communication-ui';
import { mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';

export const OneToOneCallLayoutExample: () => JSX.Element = () => {
  const videoStreamStyle = mergeStyles({
    border: '1',
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '.25rem',
    right: '.25rem',
    height: '25%',
    width: '30%'
  });

  return (
    <Stack style={{ height: '500px', width: '600px', border: '1px' }} horizontal>
      {/* Video component for the other person's video stream */}
      <VideoTile
        isVideoReady={false}
        styles={{
          overlayContainer: videoStreamStyle
        }}
        avatarName={'Holly'}
      >
        {/* Video component for my video stream stream */}
        <VideoTile
          isVideoReady={false}
          // A placeholder element for my video stream
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
    </Stack>
  );
};
