import { RichTextSendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

const removeImageTags = (event: { content: DocumentFragment }): void => {
  event.content.querySelectorAll('img').forEach((image) => {
    // If the image is the only child of its parent, remove all the parents of this img element.
    let parentNode: HTMLElement | null = image.parentElement;
    let currentNode: HTMLElement = image;
    while (parentNode?.childNodes.length === 1) {
      currentNode = parentNode;
      parentNode = parentNode.parentElement;
    }
    currentNode?.remove();
  });
};

export const RichTextSendBoxOnPasteCallbackExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        onPaste={removeImageTags}
      />
    </div>
  </FluentThemeProvider>
);
