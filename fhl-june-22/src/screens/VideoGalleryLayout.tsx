import React from 'react';
import { Stack, useTheme, mergeStyles, IStyle, Theme, PrimaryButton } from '@fluentui/react';

export type Choices =
  | 'GALLERY_WITH_HORIZONTAL_OVERFLOW'
  | 'GALLERY_WITH_VERITICAL_OVERFLOW'
  | 'GALLERY_WITH_NO_OVERFLOW';

export const VideoGalleryLayout = (props: { onContinue: () => void }) => {
  const theme = useTheme();
  const [choice, setChoice] = React.useState<Choices>('GALLERY_WITH_HORIZONTAL_OVERFLOW');

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
          <Stack
            className={mergeStyles(optionTabStyles('GALLERY_WITH_HORIZONTAL_OVERFLOW'))}
            onClick={() => setChoice('GALLERY_WITH_HORIZONTAL_OVERFLOW')}
          >
            Centered remote participants with horizontal overflow.
          </Stack>
          <Stack
            className={mergeStyles(optionTabStyles('GALLERY_WITH_VERITICAL_OVERFLOW'))}
            onClick={() => setChoice('GALLERY_WITH_VERITICAL_OVERFLOW')}
          >
            Centered remote participants with vertical overflow.
          </Stack>
          <Stack
            className={mergeStyles(optionTabStyles('GALLERY_WITH_NO_OVERFLOW'))}
            onClick={() => setChoice('GALLERY_WITH_NO_OVERFLOW')}
          >
            Remote participants without overflow.
          </Stack>
        </Stack>
        <Stack style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Stack className={mergeStyles(previewAreaStyles)}>
            {choice === 'GALLERY_WITH_HORIZONTAL_OVERFLOW' && <VideoGalleryWithHorizontalOverflow />}
            {choice === 'GALLERY_WITH_VERITICAL_OVERFLOW' && <VideoGalleryWithVerticalOverflow />}
            {choice === 'GALLERY_WITH_NO_OVERFLOW' && <VideoGalleryWithoutOverflow />}
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

const centerGhostTileStyle = (theme: Theme): IStyle => ({
  background: theme.palette.neutralTertiaryAlt,
  width: '33%',
  height: '100%',
  margin: '1rem',
  borderRadius: theme.effects.roundedCorner4
});

const smallGhostTileStyle = (theme: Theme): IStyle => ({
  background: theme.palette.neutralTertiaryAlt,
  minWidth: '100px',
  maxWidth: '150px',
  height: '100px',
  margin: '1rem',
  borderRadius: theme.effects.roundedCorner4
});

const VideoGalleryWithHorizontalOverflow = () => {
  const theme = useTheme();
  return (
    <Stack>
      <Stack horizontal style={{ height: '175px', marginBottom: '1rem' }}>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
      </Stack>
      <Stack horizontal style={{ height: '175px', marginBottom: '1rem' }}>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
      </Stack>
      <Stack horizontal style={{}}>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
      </Stack>
    </Stack>
  );
};

const VideoGalleryWithVerticalOverflow = () => {
  const theme = useTheme();
  return (
    <Stack horizontal>
      <Stack style={{ width: '80%' }}>
        <Stack horizontal style={{ height: '175px', marginBottom: '1rem' }}>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        </Stack>
        <Stack horizontal style={{ height: '175px', marginBottom: '1rem' }}>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        </Stack>
        <Stack horizontal style={{ height: '175px', marginBottom: '1rem' }}>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
          <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        </Stack>
      </Stack>
      <Stack style={{ marginLeft: '-1rem', width: '20%' }}>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(smallGhostTileStyle(theme))}></Stack>
      </Stack>
    </Stack>
  );
};

const VideoGalleryWithoutOverflow = () => {
  const theme = useTheme();
  return (
    <Stack>
      <Stack horizontal style={{ height: '150px', marginBottom: '1rem' }}>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
      </Stack>
      <Stack horizontal style={{ height: '150px', marginBottom: '1rem' }}>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
      </Stack>
      <Stack horizontal style={{ height: '150px' }}>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
        <Stack className={mergeStyles(centerGhostTileStyle(theme))}></Stack>
      </Stack>
      <br />
      <br />
    </Stack>
  );
};
