import { IStyle, mergeStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import React from 'react';

export type Choices = 'BOTTOM' | 'TOP' | 'LEFT' | 'RIGHT';

export const ControlBarLayout = (props: { onContinue: () => void }) => {
  const theme = useTheme();
  const [choice, setChoice] = React.useState<Choices>('BOTTOM');

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
      background: theme.palette.neutralLighter
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
          <Stack className={mergeStyles(optionTabStyles('BOTTOM'))} onClick={() => setChoice('BOTTOM')}>
            Bottom
          </Stack>
          <Stack className={mergeStyles(optionTabStyles('TOP'))} onClick={() => setChoice('TOP')}>
            Top
          </Stack>
          <Stack className={mergeStyles(optionTabStyles('LEFT'))} onClick={() => setChoice('LEFT')}>
            Left
          </Stack>
          <Stack className={mergeStyles(optionTabStyles('RIGHT'))} onClick={() => setChoice('RIGHT')}>
            Right
          </Stack>
        </Stack>
        <Stack style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Stack className={mergeStyles(previewAreaStyles)}>
            <Stack
              style={{
                width: '100%',
                height: '64px',
                borderRadius: theme.effects.roundedCorner6,
                background: theme.palette.neutralTertiaryAlt,
                position: 'absolute',
                bottom: 0
              }}
            ></Stack>
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
