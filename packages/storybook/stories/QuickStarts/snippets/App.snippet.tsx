import { FluentThemeProvider, defaultIcons } from '@azure/communication-react';
import { registerIcons } from '@fluentui/react';
import React from 'react';

function App(): JSX.Element {
  // If you don't want to provide custom icons, you can register the default ones included with the library.
  // This will ensure that all the icons are rendered correctly.
  registerIcons({ icons: defaultIcons });

  return (
    <FluentThemeProvider>
      <h1>Hooray! You set up Fluent Theme Provider 🎉🎉🎉</h1>
    </FluentThemeProvider>
  );
}

export default App;
