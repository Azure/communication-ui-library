import { FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

function App(): JSX.Element {
  return (
    <FluentThemeProvider>
      <h1>Hooray! You set up Fluent Theme Provider 🎉🎉🎉</h1>
    </FluentThemeProvider>
  );
}

export default App;
