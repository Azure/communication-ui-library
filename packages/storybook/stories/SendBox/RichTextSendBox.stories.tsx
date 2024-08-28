// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AttachmentMetadataInProgress, RichTextSendBox as RichTextSendBoxComponent } from '@azure/communication-react';
import { Title, Description, Props, Heading, Canvas, Source } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { getImageFileNameFromAttributes } from '../../../react-composites/src/composites/ChatComposite/ImageUpload/ImageUploadUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { DetailedBetaBanner } from '../BetaBanners/DetailedBetaBanner';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { hiddenControl, controlsToAdd } from '../controlsUtils';
import { RichTextSendBoxExample } from './snippets/RichTextSendBox.snippet';
import { RichTextSendBoxAttachmentUploadsExample } from './snippets/RichTextSendBoxAttachmentUploads.snippet';
import { RichTextSendBoxOnPasteCallbackExample } from './snippets/RichTextSendBoxOnPasteCallback.snippet';
import { RichTextSendBoxWithInlineImagesExample } from './snippets/RichTextSendBoxWithInlineImages.snippet';
import { RichTextSendBoxWithSystemMessageExample } from './snippets/RichTextSendBoxWithSystemMessage.snippet';

const RichTextSendBoxExampleText = require('!!raw-loader!./snippets/RichTextSendBox.snippet.tsx').default;
const RichTextSendBoxAttachmentUploadsExampleText =
  require('!!raw-loader!./snippets/RichTextSendBoxAttachmentUploads.snippet.tsx').default;
const RichTextSendBoxOnPasteCallbackExampleText =
  require('!!raw-loader!./snippets/RichTextSendBoxOnPasteCallback.snippet.tsx').default;
const RichTextSendBoxWithInlineImagesExampleText =
  require('!!raw-loader!./snippets/RichTextSendBoxWithInlineImages.snippet.tsx').default;
const RichTextSendBoxWithSystemMessageExampleText =
  require('!!raw-loader!./snippets/RichTextSendBoxWithSystemMessage.snippet.tsx').default;

const importStatement = `import { RichTextSendBox } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <SingleLineBetaBanner topOfPage={true} />
      <Title>RichTextSendBox</Title>
      <Description>
        Component for composing messages with rich text formatting. RichTextSendBox has a callback for sending typing
        notification when user starts entering text. It also supports an optional message above the rich text editor.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={RichTextSendBoxExampleText}>
        <RichTextSendBoxExample />
      </Canvas>

      <Heading>Add a system message</Heading>
      <Description>To add a system message, use the systemMessage property like in the example below.</Description>
      <Canvas mdxSource={RichTextSendBoxWithSystemMessageExampleText}>
        <RichTextSendBoxWithSystemMessageExample />
      </Canvas>

      <Heading>Display File Uploads</Heading>
      <DetailedBetaBanner />
      <Description>
        RichTextSendBox component provides UI for displaying AttachmentMetadataInProgress in the RichTextSendBox. This
        allows developers to implement a file sharing feature using the pure UI component with minimal effort.
        Developers can write their own attachment upload logic and utilize the UI provided by RichTextSendBox.
      </Description>
      <Canvas mdxSource={RichTextSendBoxAttachmentUploadsExampleText}>
        <RichTextSendBoxAttachmentUploadsExample />
      </Canvas>

      <Heading>Enable Inserting Inline Images</Heading>
      <Description>
        The RichTextSendBox component provides an `onInsertInlineImage` callback to handle each inline image that is
        inserted into the editor. When not provided, pasting images into the rich text editor will be disabled. This
        callback can be used to manipulate the imageAttributes src URL (which is a local blob URL), and implement any
        other custom logic. After processing each inserted image in the callback, the results should be passed back to
        the component through the `inlineImagesWithProgress` prop. This prop will be used to render the error bar to the
        end user. Note that for the error of content exceeds the maximum length, the `id` and `url` props provided in
        the `inlineImagesWithProgress` will be used in the calculation to achieve a more accurate result. The content
        provided in the `onSendMessage` does not contain any information from the `inlineImagesWithProgress`. To add or
        replace image attributes, manually parse the HTML content and update the image attributes. After an inline image
        is removed from the editor, the `onRemoveInlineImage` callback will be triggered. At this point, the image is
        already removed from the UI and the local blob of the image has already been revoked. This callback can be used
        to implement custom logic such as deleting the image from the server. When inserting images between text, images
        will be on the same line as the text. If you wish to change this behavior so that each image is always on a new
        line, you can set the display property to block for all image tags. For certain Android devices, pasting of a
        single image is only supported by long pressing on the rich text editor and choosing paste. Selecting from the
        clipboard view from keyboard may not be supported.
      </Description>
      <Canvas mdxSource={RichTextSendBoxWithInlineImagesExampleText}>
        <RichTextSendBoxWithInlineImagesExample />
      </Canvas>

      <Heading>Process pasted content</Heading>
      <Description>
        RichTextSendBox provides `onPaste` callback for custom processing of the pasted content before it's inserted
        into the RichTextSendBox. This callback can be used to implement custom paste handling logic tailored to your
        application's needs. The example below shows how to remove images from pasted content.
      </Description>
      <Canvas mdxSource={RichTextSendBoxOnPasteCallbackExampleText}>
        <RichTextSendBoxOnPasteCallbackExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={RichTextSendBoxComponent} />
    </>
  );
};

const RichTextSendBoxStory = (args): JSX.Element => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;
  const [inlineImagesWithProgress, setInlineImagesWithProgress] = useState<
    AttachmentMetadataInProgress[] | undefined
  >();

  return (
    <div style={{ width: '31.25rem', maxWidth: '90%' }}>
      <RichTextSendBoxComponent
        disabled={args.disabled}
        attachments={
          args.hasAttachments
            ? [
                {
                  id: 'f2d1fce73c98',
                  name: 'file1.txt',
                  url: 'https://www.contoso.com/file1.txt',
                  progress: 1
                },
                {
                  id: 'dc3a33ebd321',
                  name: 'file2.docx',
                  url: 'https://www.contoso.com/file2.txt',
                  progress: 1
                }
              ]
            : undefined
        }
        systemMessage={args.hasWarning ? args.warningMessage : undefined}
        onSendMessage={async (message, options) => {
          timeoutRef.current = setTimeout(() => {
            setInlineImagesWithProgress(undefined);
            alert(`sent message: ${message} with options ${JSON.stringify(options)}`);
          }, delayForSendButton);
        }}
        onCancelAttachmentUpload={(attachmentId) => {
          window.alert(`requested to cancel attachment upload for attachment with id: "${attachmentId}"`);
        }}
        onTyping={(): Promise<void> => {
          console.log(`sending typing notifications`);
          return Promise.resolve();
        }}
        onInsertInlineImage={(imageAttributes: Record<string, string>) => {
          const newImage = {
            id: imageAttributes.id,
            name: getImageFileNameFromAttributes(imageAttributes),
            progress: 1,
            url: imageAttributes.src,
            error: undefined
          };
          setInlineImagesWithProgress([...(inlineImagesWithProgress ?? []), newImage]);
        }}
        inlineImagesWithProgress={inlineImagesWithProgress}
        onRemoveInlineImage={(imageAttributes: Record<string, string>) => {
          const filteredInlineImages = inlineImagesWithProgress?.filter((image) => image.id !== imageAttributes.id);
          setInlineImagesWithProgress(filteredInlineImages);
        }}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RichTextSendBox = RichTextSendBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-richtextsendbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Send Box/Rich Text Send Box`,
  component: RichTextSendBoxComponent,
  argTypes: {
    disabled: controlsToAdd.disabled,
    hasWarning: controlsToAdd.isSendBoxWithWarning,
    hasAttachments: controlsToAdd.isSendBoxWithAttachments,
    warningMessage: controlsToAdd.sendBoxWarningMessage,
    strings: hiddenControl,
    onRenderAttachmentUploads: hiddenControl,
    attachments: hiddenControl,
    onCancelAttachmentUpload: hiddenControl,
    onSendMessage: hiddenControl,
    onTyping: hiddenControl,
    onPaste: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
