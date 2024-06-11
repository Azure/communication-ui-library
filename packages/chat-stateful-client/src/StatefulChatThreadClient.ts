// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatAttachment, ChatThreadClient, SendChatMessageResult } from '@azure/communication-chat';
import { getIdentifierKind } from '@azure/communication-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { ChatContext } from './ChatContext';
import { nanoid } from 'nanoid';
import { createDecoratedListMessages } from './iterators/createDecoratedListMessages';
import { createDecoratedListReadReceipts } from './iterators/createDecoratedListReadReceipts';
import { createDecoratedListParticipants } from './iterators/createDecoratedListParticipants';
import { convertChatMessage } from './convertChatMessage';
import DOMPurify from 'dompurify';

class ProxyChatThreadClient implements ProxyHandler<ChatThreadClient> {
  private _context: ChatContext;

  constructor(context: ChatContext) {
    this._context = context;
  }

  public get<P extends keyof ChatThreadClient>(chatThreadClient: ChatThreadClient, prop: P): any {
    switch (prop) {
      case 'listMessages': {
        return createDecoratedListMessages(chatThreadClient, this._context);
      }
      case 'getMessage': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<ChatThreadClient['getMessage']>) => {
          const message = await chatThreadClient.getMessage(...args);
          this._context.setChatMessage(chatThreadClient.threadId, convertChatMessage(message));
          return message;
        }, 'ChatThreadClient.getMessage');
      }
      case 'sendMessage': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<ChatThreadClient['sendMessage']>) => {
          // Retry logic?
          const [request, options] = args;
          const { content } = request;
          const clientMessageId = nanoid(); // Generate a local short uuid for message
          const newMessage: ChatMessageWithStatus = {
            content: { message: content },
            clientMessageId,
            id: '',
            type: options?.type ?? 'text',
            sequenceId: '',
            version: '',
            createdOn: new Date(),
            status: 'sending',
            senderDisplayName: this._context.getState().displayName,
            sender: this._context.getState().userId,
            metadata: options?.metadata
          };
          // local state that display the message in the MessageThread
          this._context.setChatMessage(chatThreadClient.threadId, newMessage);

          // Queueing callback (in stateful client)

          // this._context.getState().threads[chatThreadClient.threadId].

          const uploadResult = await uploadInlineImages(chatThreadClient, content);
          //  update the local message with setChatMessage
          // (await chatThreadClient.getProperties()).createdBy
          console.log((await chatThreadClient.getProperties()).createdBy);
          console.log('6. Leah: ::: cotent', content);

          const newArgs = args;

          newArgs[0].content = uploadResult.content;
          // newArgs[1]?.attachments = uploadResult.attachments;

          let result: SendChatMessageResult | undefined = undefined;
          try {
            // Send the message to the server
            result = await chatThreadClient.sendMessage(...newArgs);
            console.log('7. Leah: ::: result', result);
          } catch (e) {
            this._context.setChatMessage(chatThreadClient.threadId, { ...newMessage, status: 'failed' });
            throw e;
          }

          if (result?.id) {
            this._context.batch(() => {
              if (!result) {
                return;
              }
              this._context.setChatMessage(chatThreadClient.threadId, {
                ...newMessage,
                clientMessageId: undefined,
                status: 'delivered',
                id: result.id
              });
              this._context.deleteLocalMessage(chatThreadClient.threadId, clientMessageId);
            });
          }
          return result;
        }, 'ChatThreadClient.sendMessage');
      }
      case 'addParticipants': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['addParticipants']>) => {
            const result = await chatThreadClient.addParticipants(...args);
            const [addRequest] = args;
            const participantsToAdd = addRequest.participants;
            this._context.setParticipants(chatThreadClient.threadId, participantsToAdd);
            return result;
          },
          'ChatThreadClient.addParticipants'
        );
      }
      case 'deleteMessage': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['deleteMessage']>) => {
            // DeleteMessage is able to either delete local one(for failed message) or synced message
            const [messageId] = args;
            if (this._context.deleteLocalMessage(chatThreadClient.threadId, messageId)) {
              return {};
            }
            const result = await chatThreadClient.deleteMessage(...args);
            this._context.deleteMessage(chatThreadClient.threadId, messageId);
            return result;
          },
          'ChatThreadClient.deleteMessage'
        );
      }
      case 'listParticipants': {
        return createDecoratedListParticipants(chatThreadClient, this._context);
      }
      case 'listReadReceipts': {
        return createDecoratedListReadReceipts(chatThreadClient, this._context);
      }
      case 'sendTypingNotification': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['sendTypingNotification']>) => {
            return await chatThreadClient.sendTypingNotification(...args);
          },
          'ChatThreadClient.sendTypingNotification'
        );
      }
      case 'removeParticipant': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['removeParticipant']>) => {
            const result = await chatThreadClient.removeParticipant(...args);
            const [removeIdentifier] = args;
            this._context.deleteParticipant(chatThreadClient.threadId, getIdentifierKind(removeIdentifier));
            return result;
          },
          'ChatThreadClient.removeParticipant'
        );
      }
      case 'updateMessage': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['updateMessage']>) => {
            const result = await chatThreadClient.updateMessage(...args);
            const [messageId, updateOption] = args;

            this._context.updateChatMessageContent(chatThreadClient.threadId, messageId, updateOption?.content);
            return result;
          },
          'ChatThreadClient.updateMessage'
        );
      }
      case 'updateTopic': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<ChatThreadClient['updateTopic']>) => {
          const result = await chatThreadClient.updateTopic(...args);
          const [topic] = args;
          this._context.updateThreadTopic(chatThreadClient.threadId, topic);
          return result;
        }, 'ChatThreadClient.updateTopic');
      }
      case 'getProperties': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<ChatThreadClient['getProperties']>) => {
            const result = await chatThreadClient.getProperties(...args);
            console.log('getProperties', result);
            this._context.updateThread(chatThreadClient.threadId, result);
            return result;
          },
          'ChatThreadClient.getProperties'
        );
      }
      default:
        return Reflect.get(chatThreadClient, prop);
    }
  }
}

/**
 * @private
 */
export const chatThreadClientDeclaratify = async (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): Promise<ChatThreadClient> => {
  // const createdBy = await chatThreadClient.getProperties().createdBy;
  const properties = await chatThreadClient.getProperties();
  const createdBy = properties.createdBy;
  console.log('Leah stateful client chatThreadClientDeclaratify', properties);
  console.log(
    'Leah stateful client chatThreadClientDeclaratify topic',
    (await chatThreadClient.getProperties()).createdBy,
    'createdBy',
    createdBy
  );

  context.createThreadIfNotExist(chatThreadClient.threadId, { createdBy });
  return new Proxy(chatThreadClient, new ProxyChatThreadClient(context)) as ChatThreadClient;
};

// /**
//  * @private
//  */
// const uploadInlineImages = async (
//   chatThreadClient: ChatThreadClient,
//   content: string,
//   attachments: ChatAttachment[]
// ): Promise<{ content: string; attachments: ChatAttachment[] }> => {
//   const imageAttachments: ChatAttachment[] | undefined = [];

//   for await (const attachment of attachments) {
//     // if (attachment.attachmentType === 'image') {
//     // const blobUrl = attachment.url as
//     // const blob = await attachment.url?.text();
//     const blob = await fetch(attachment.url).then(r => r.blob());

//     const imageResult = await uploadInlineImage(chatThreadClient, , attachment.name || '');
//     if (imageResult) {
//       imageAttachments.push(imageResult);
//     }
//     console.log('after upload');

//     const imageElement = document.getElementById(attachment.id);
//     console.log('1-----. Leah: ::: imageElement', imageElement);
//     // }
//   }

//   return { content: content, attachments: imageAttachments };
// };

/**
 * @private
 */
const uploadInlineImages = async (
  chatThreadClient: ChatThreadClient,
  content: string
): Promise<{ content: string; attachments: ChatAttachment[] }> => {
  // For each inline image
  const parsedContent = DOMPurify.sanitize(content ?? '', {
    ALLOWED_TAGS: ['img'],
    RETURN_DOM_FRAGMENT: true
  });

  const imageAttachments: ChatAttachment[] | undefined = [];

  for await (const child of parsedContent.childNodes) {
    if (child.nodeName.toLowerCase() === 'img') {
      console.log('1. image found in content', child);
      // const imageElement = child as HTMLImageElement;
      // const image = imageElement.src;
      const fileName = 'image.png';

      const base64 =
        'data:image/png;base64,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';

      const blob = base64ToBlob(base64);
      const imageResult = await uploadInlineImage(chatThreadClient, blob, fileName);
      const imageNode = child as HTMLImageElement;
      imageNode.id = imageResult.id;
      imageNode.src = '';
      const attachment: ChatAttachment = {
        id: imageResult.id,
        attachmentType: 'image',
        name: fileName,
        url: ''
      };
      parsedContent.replaceChild(imageNode, child);

      // child.replaceChild(imageNode, child);

      console.log('3.2 Leah: ::: after replace child', child);

      // const imageNode = document.createElement('span');
      // imageNode.innerHTML = 'image ';
      // parsedContent.replaceChild(imageNode, child);

      imageAttachments.push(attachment);
    }
  }

  const div = document.createElement('div');
  div.appendChild(parsedContent.cloneNode(true));
  const newContent = div.innerHTML;
  console.log(div.innerHTML); //output should be '<p>test</p>'
  console.log('5. Leah: ::: content after upload', newContent);

  //     insert the result into the <img> tag and attachments
  // if all images uploaded, send the message with the image attachment
  return { content: newContent, attachments: imageAttachments };
};

const uploadInlineImage = async (chatThreadClient: ChatThreadClient, blob: Blob, fileName: string) => {
  const result = await chatThreadClient.uploadImage(blob, fileName);
  return result;
};

const base64ToBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: 'image/jpeg' });
};
