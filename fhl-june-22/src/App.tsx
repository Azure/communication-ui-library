import { DEFAULT_COMPONENT_ICONS, FluentThemeProvider } from '@azure/communication-react';
import { initializeIcons, registerIcons, Stack } from '@fluentui/react';
import React from 'react';
import { ControlBarButtons } from './screens/ControlBarButtons';
import { ControlBarLayout } from './screens/ControlBarLayout';
import { VideoGalleryLayout } from './screens/VideoGalleryLayout';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App() {
  const [screen, setScreen] = React.useState('ControlBarLayout');

  const getScreen = () => {
    switch (screen) {
      case 'VideoGalleryLayout':
        return (
          <VideoGalleryLayout
            onContinue={() => {
              setScreen('ControlBarLayout');
            }}
          />
        );
      case 'ControlBarLayout':
        return (
          <ControlBarLayout
            onContinue={() => {
              setScreen('ControlBarButtons');
            }}
          />
        );
      case 'ControlBarButtons':
        return (
          <ControlBarButtons
            onContinue={() => {
              setScreen('AdditionalButtons');
            }}
          />
        );
      default:
        break;
    }
  };

  return (
    <FluentThemeProvider>
      <Stack
        styles={{
          root: {
            width: '100%',
            height: '100%',
            background: '#faf9f8'
          }
        }}
      >
        {getScreen()}
      </Stack>
    </FluentThemeProvider>
  );
}

export default App;
