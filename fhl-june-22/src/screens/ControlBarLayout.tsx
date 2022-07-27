import {
  CameraButton,
  ControlBar,
  DevicesButton,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import { Checkbox, IStyle, mergeStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import React from 'react';
import { GLOBAL } from '../dataStore';

export type Choices = 'Bottom' | 'Top' | 'Left' | 'Right';

export const ControlBarLayout = (props: { onContinue: () => void }) => {
  const theme = useTheme();
  const [choice, setChoice] = React.useState<Choices>('Bottom');
  const [isFloating, setIsFloating] = React.useState(true);

  React.useEffect(() => {
    GLOBAL.controlBarLayout = `${isFloating ? 'floating' : 'docked'}${choice}`;
  }, [choice, isFloating]);

  const isActive = (value: Choices) => value === choice;

  const optionTabStyles = (choice: Choices) => ({
    border: `1px solid ${isActive(choice) ? theme.palette.themePrimary : theme.palette.neutralLight}`,
    borderRadius: theme.effects.roundedCorner6,
    padding: '1rem',
    background: theme.palette.white,
    marginBottom: '1rem',
    cursor: 'pointer',
    fontWeight: isActive(choice) ? '600' : '400',
    ':hover': {
      background: theme.palette.neutralLighter,
      overflow: 'hidden'
    }
  });

  const previewAreaStyles: IStyle = {
    minWidth: '50%',
    minHeight: '500px',
    height: 'auto',
    border: `1px solid ${theme.palette.neutralLight}`,
    background: theme.palette.white,
    borderRadius: theme.effects.roundedCorner6,
    position: 'relative'
  };

  return (
    <Stack
      style={{
        textAlign: 'left',
        padding: '4rem'
      }}
    >
      <h1 style={{ fontWeight: 400, fontSize: '2rem', margin: 0, padding: 0 }}>Choose a Video Gallery Layout</h1>
      <Stack horizontal style={{ marginTop: '2rem' }}>
        <Stack style={{ width: '30%', marginRight: '1rem' }}>
          <Checkbox label="Floating" checked={isFloating} onChange={() => setIsFloating(!isFloating)} />
          <br />
          <Stack className={mergeStyles(optionTabStyles('Bottom'))} onClick={() => setChoice('Bottom')}>
            Bottom
          </Stack>
          <Stack className={mergeStyles(optionTabStyles('Top'))} onClick={() => setChoice('Top')}>
            Top
          </Stack>
          <Stack className={mergeStyles(optionTabStyles('Left'))} onClick={() => setChoice('Left')}>
            Left
          </Stack>
          <Stack className={mergeStyles(optionTabStyles('Right'))} onClick={() => setChoice('Right')}>
            Right
          </Stack>
        </Stack>
        <Stack style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Stack className={mergeStyles(previewAreaStyles)}>
            <ControlBar layout={`${isFloating ? 'floating' : 'docked'}${choice}`}>
              <MicrophoneButton />
              <CameraButton />
              <ScreenShareButton />
              <DevicesButton />
              <EndCallButton />
            </ControlBar>
          </Stack>
          <br />
          <Stack style={{ width: '100%', alignItems: 'end' }}>
            <PrimaryButton style={{ width: '300px' }} onClick={() => props.onContinue()}>
              Continue
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
