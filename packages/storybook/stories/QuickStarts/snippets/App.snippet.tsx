import { FluentThemeProvider, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';

// If you don't want to provide custom icons, you can register the default ones included with the library.
// This will ensure that all the icons are rendered correctly.
initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  return (
    <FluentThemeProvider>
      <h1>Hooray! You set up Fluent Theme Provider 🎉🎉🎉</h1>
    </FluentThemeProvider>
  );
}

export default App;
