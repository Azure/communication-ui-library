import React from 'react';
import { ControlBarLayout } from './screens/ControlBarLayout';
import { VideoGalleryLayout } from './screens/VideoGalleryLayout';

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
              setScreen('AdditionalButtons');
            }}
          />
        );
      default:
        break;
    }
  };

  return <div>{getScreen()}</div>;
}

export default App;
