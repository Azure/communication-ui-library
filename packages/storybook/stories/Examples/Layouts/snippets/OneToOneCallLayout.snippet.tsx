import { VideoTile } from '@azure/communication-react';
import { mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';

const renderPersona = (): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={'Toby'}
    initialsTextColor="white"
  />
);

export const OneToOneCallLayoutExample: () => JSX.Element = () => {
  const videoStreamStyle = mergeStyles({
    border: '1',
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '.25em',
    right: '.25em',
    height: '25\u0025',
    width: '30\u0025'
  });

  return (
    <Stack style={{ height: '500px', width: '600px', border: '1px' }} horizontal>
      {/* Video component for the other person's video stream */}
      <VideoTile
        styles={{
          overlayContainer: videoStreamStyle
        }}
        displayName={'Holly'}
      >
        {/* Video component for my video stream stream */}
        <VideoTile
          // A render placeholder function for my video stream
          onRenderPlaceholder={renderPersona}
        />
      </VideoTile>
    </Stack>
  );
};
