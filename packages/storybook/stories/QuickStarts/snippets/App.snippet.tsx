import { FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

function App(): JSX.Element {
  return (
    <FluentThemeProvider>
      <div></div>
    </FluentThemeProvider>
  );
}

export default App;
