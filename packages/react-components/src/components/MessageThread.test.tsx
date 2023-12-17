// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(mention) */
import { v1 as generateGUID } from 'uuid';
import { MessageThread } from './MessageThread';
import { ChatMessage } from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../types';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { AttachmentDownloadResult, AttachmentMetadata } from './FileDownloadCards';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
/* @conditional-compile-remove(date-time-customization) @conditional-compile-remove(data-loss-prevention) */
import { COMPONENT_LOCALE_EN_US } from '../localization/locales';
/* @conditional-compile-remove(date-time-customization) */
import { screen } from '@testing-library/react';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { render, waitFor } from '@testing-library/react';
/* @conditional-compile-remove(data-loss-prevention) */ /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { registerIcons } from '@fluentui/react';
/* @conditional-compile-remove(mention) */
import { MessageStatus } from '@internal/acs-ui-common';
/* @conditional-compile-remove(mention) */
import { fireEvent } from '@testing-library/react';
/* @conditional-compile-remove(mention) */
import userEvent from '@testing-library/user-event';
/* @conditional-compile-remove(mention) */
import { Mention } from './MentionPopover';
import renderer from 'react-test-renderer';

const twentyFourHoursAgo = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

/* @conditional-compile-remove(date-time-customization) */
const onDisplayDateTimeStringLocale = (messageDate: Date): string => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return '24 hours ago';
  } else {
    return ' ';
  }
};

/* @conditional-compile-remove(date-time-customization) */
const onDisplayDateTimeString = (messageDate: Date): string => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return 'Yesterday';
  } else {
    return ' ';
  }
};

describe('Component is shown correctly', () => {
  test('One user case', async () => {
    const sampleMessage: ChatMessage = {
      messageType: 'chat',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    const tree = renderer
      .create(
        <MessageThread
          userId="user1"
          messages={[sampleMessage]}
          onDisplayDateTimeString={() => {
            return 'Timestamp';
          }}
        />
        // {
        //   createNodeMock: (element) => {
        //     console.log(element);
        //     if (element.type === 'span' && element.props['data-ui-id'] === 'message-timestamp') {
        // element.this.props.value = 'Timestamp';
        //     }
        //     return element;
        //   }
        // }
      )
      .toJSON();
    expect(tree).toMatchInlineSnapshot(`
      <div
        className="css-111"
      >
        <div
          className="fui-FluentProvider fui-FluentProviderr0 ___1bg6ih0_1q4sksb f19n0e5 fxugw4r f1o700av fk6fouc fkhj508 figsok6 f1i3iumi f1l02sjl f1hu3pq6 f11qmguv f19f4twv f1tyq0we f1p9o1ba f1sil6mw f1g0x7ka fhxju0i f1qch9an f1cnd47f fly5x3f"
          dir="ltr"
        >
          <div
            className="css-112"
          >
            <div
              className="fui-FluentProvider fui-FluentProviderr1 ___1bg6ih0_1q4sksb f19n0e5 fxugw4r f1o700av fk6fouc fkhj508 figsok6 f1i3iumi f1l02sjl f1hu3pq6 f11qmguv f19f4twv f1tyq0we f1p9o1ba f1sil6mw f1g0x7ka fhxju0i f1qch9an f1cnd47f fly5x3f"
              dir="ltr"
            >
              <div
                aria-live="assertive"
                className="ms-Stack css-143"
              />
              <div
                className="fui-Chat ___7v22vn0_1qhxi98 f22iagw f1vx9l62 ftrb29c fly5x3f f1oy3dpc f5zp4f f5ublx3 f2mnhzf fgr6219 f1ujusj6 f10jk5vf fcgxt0o f1u4y9u9 f1aszuxk f1doa1ug f1ern45e f1n71otn f1h8hb77 f1deefiw f1l02sjl f1ildqnq f5wtxwc fpfzlst"
                data-tabster="{"mover":{"cyclic":false,"direction":1,"hasDefault":true}}"
                style={{}}
              >
                <div>
                  <div
                    className="fui-ChatMessage ___x2pur10_8nfaps0 f22iagw f4px1ci f1g0x7ka fhxju0i f1qch9an f1cnd47f f1hu3pq6 f11qmguv f19f4twv f1tyq0we f6dzj5z fh0h8b7 f1e2ae29"
                  >
                    <div
                      className="fui-ChatMessage__avatar ___1qar6e0_o4jn4j0 fwbmr0d"
                    >
                      <div
                        className="css-145"
                      >
                        <div
                          className="ms-Persona ms-Persona--size32 root-146"
                        >
                          <div
                            className="ms-Persona-coin ms-Persona--size32 coin-153"
                            role="presentation"
                          >
                            <div
                              className="ms-Persona-imageArea imageArea-155"
                              role="presentation"
                            >
                              <div
                                aria-hidden="true"
                                className="ms-Persona-initials initials-158"
                              >
                                <span>
                                  SF
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="fui-ChatMessage__body ___mekeox0_1iymccz f10pi13n ftqa4ok f2hkw1w f8hki3x f1d2448m f1bjia2o ffh67wi f15bsgw9 f14e48fq f18yb2kv fd6o370 fh1cnn4 fy7oxxb fpukqih f184ne2d frrh606 f1v5zibi ful5kiu fo2hd23 f1jqcqds ftffrms f2e7qr6 fsr1zz6 f1dvezut fd0oaoj fjvm52t f1cwg4i8 f57olzd f4stah7 f480a47 fs1por5 fk6fouc figsok6 fkhj508 f1i3iumi f19n0e5 f9ijwd5 fff7au0 f1bjk9e1 fwsfkhu f8wkphi f1g0x7ka fhxju0i f1qch9an f1cnd47f f6dzj5z f3rmtva f11qmguv f19f4twv fh0h8b7 f1tyq0we f1pe6x04 f18xc7ee"
                      data-tabster="{"groupper":{"tabbability":2},"focusable":{}}"
                      onMouseEnter={[Function]}
                      onMouseLeave={[Function]}
                      role="none"
                      style={{}}
                      tabIndex={-1}
                    >
                      <div
                        className="___n0qxz70_0000000 f22iagw f4akndk f1ugzwwg f104wqfl f11d4kpn f122n59"
                      />
                      <div>
                        <div
                          className="fui-ChatMessage ___exgpue0_jm0kqy0 f22iagw f4px1ci f1g0x7ka f38x3r3 f1e2ae29"
                          role="none"
                          tabIndex={-1}
                        >
                          <div
                            className="fui-ChatMessage__body ___15yx0ki_1poe6pc f10pi13n ftqa4ok f2hkw1w f8hki3x f1d2448m f1bjia2o ffh67wi f15bsgw9 f14e48fq f18yb2kv fd6o370 fh1cnn4 fy7oxxb fpukqih f184ne2d frrh606 f1v5zibi ful5kiu fo2hd23 f1jqcqds ftffrms f2e7qr6 fsr1zz6 f1dvezut fd0oaoj fjvm52t f1cwg4i8 f57olzd f4stah7 f480a47 fs1por5 fk6fouc figsok6 fkhj508 f1i3iumi f19n0e5 f9ijwd5 fff7au0 f1bjk9e1 fwsfkhu f8wkphi fp9bwmr f1gbmcue f1fow5ox f1rh9g5y f6dzj5z f16xq7d1 fh0h8b7 frdrv4j f19g0ac f5ogflp f1hqa2wf f1f09k3d finvdd3 fzkkow9 fcdblym fg706s2 fjik90z f1p3nwhy f11589ue f1q5o8ev f1pdflbu f7scgs1 f1nxyauu fkxd2qb fvf8iow f6tsq6u fpyqgh4 f1p0w8e0 f1agfj95 f1x2rkqv flvn62s fyl1vau f1n4zj0u flq5vdr f1h726rq fommez fu82bjs f1dafprv f1vwp8i5 f1xp186h feyps7n f2qtxeu fyhlx6i fgoz3dl f1vbfobf f6e0e65 f1sjmu34 fa9an96 fbrvnvw f1w6aheg fhdq93o f1equ8jp fi1mqd9 fezso71 f8447en f15373qv fhh847g f1m17j8g frqzv44 f881ije f1jmtuus f79epyk f1lr4nfy f5zfpvi f1biw00e fgu8x5g fexf3cn fg02k11 f1pkr665 ftvnkt2 fvirl94 f1vuhjv6 ftv2ff6 fmp557l f1aw43al f9wff0k f7epl8d fzropca f10c1wva f13cjinm f176sqit f1u7keeb f1yom5gn f1v9amb fzv3gja f182z69d f12ngtd f1ysiqfm fu0lzf8 f1p41ht8 fbn0nte f13uvz14 fe5fyn f1yywaza fqn1ibi"
                            data-tabster="{"groupper":{"tabbability":2},"focusable":{}}"
                            data-ui-id="chat-composite-message"
                            onMouseEnter={[Function]}
                            onMouseLeave={[Function]}
                            style={{}}
                            tabIndex={0}
                          >
                            <div
                              className="___n0qxz70_0000000 f22iagw f4akndk f1ugzwwg f104wqfl f11d4kpn f122n59"
                            >
                              <div
                                className="fui-ChatMessage__author"
                              >
                                <span
                                  className="css-161"
                                >
                                  Sam Fisher
                                </span>
                              </div>
                              <span
                                className="fui-ChatMessage__timestamp"
                              >
                                <span
                                  className="css-162"
                                  data-ui-id="message-timestamp"
                                >
                                  Timestamp
                                </span>
                              </span>
                            </div>
                            <div
                              className="ui-chat__message__content"
                              tabIndex={0}
                            >
                              <div
                                aria-label="Sam Fisher said Thanks for making my job easier."
                                role="text"
                              >
                                Thanks for making my job easier.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                aria-live="assertive"
                role="log"
                style={
                  {
                    "border": 0,
                    "clip": "rect(0 0 0 0)",
                    "height": "1px",
                    "margin": "-1px",
                    "overflow": "hidden",
                    "padding": 0,
                    "position": "absolute",
                    "whiteSpace": "nowrap",
                    "width": "1px",
                  }
                }
              />
              <div
                aria-live="assertive"
                role="log"
                style={
                  {
                    "border": 0,
                    "clip": "rect(0 0 0 0)",
                    "height": "1px",
                    "margin": "-1px",
                    "overflow": "hidden",
                    "padding": 0,
                    "position": "absolute",
                    "whiteSpace": "nowrap",
                    "width": "1px",
                  }
                }
              />
              <div
                aria-live="polite"
                role="log"
                style={
                  {
                    "border": 0,
                    "clip": "rect(0 0 0 0)",
                    "height": "1px",
                    "margin": "-1px",
                    "overflow": "hidden",
                    "padding": 0,
                    "position": "absolute",
                    "whiteSpace": "nowrap",
                    "width": "1px",
                  }
                }
              />
              <div
                aria-live="polite"
                role="log"
                style={
                  {
                    "border": 0,
                    "clip": "rect(0 0 0 0)",
                    "height": "1px",
                    "margin": "-1px",
                    "overflow": "hidden",
                    "padding": 0,
                    "position": "absolute",
                    "whiteSpace": "nowrap",
                    "width": "1px",
                  }
                }
              />
            </div>
          </div>
        </div>
      </div>
    `);
  });
});

describe('Message date should be formatted correctly', () => {
  test('Should locale string for "Yesterday"', async () => {
    const testLocale = createTestLocale({ messageThread: { yesterday: 'MOCK YESTERDAY' } });
    const sampleMessage: ChatMessage = {
      messageType: 'chat',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    const { container } = renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(container.textContent).toContain(testLocale.strings.messageThread.yesterday);
  });
});

/* @conditional-compile-remove(date-time-customization) */
describe('Message date should be customized by onDisplayDateTimeString passed through locale', () => {
  test('Message date should be localized to "24 hours ago"', async () => {
    const testLocale = {
      strings: COMPONENT_LOCALE_EN_US.strings,
      onDisplayDateTimeString: onDisplayDateTimeStringLocale
    };
    const sampleMessage: ChatMessage = {
      messageType: 'chat',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(screen.getByText('24 hours ago')).toBeTruthy();
  });
});

/* @conditional-compile-remove(date-time-customization) */
describe('onDisplayDateTimeString passed through messagethread should overwrite onDisplayDateTimeString from locale', () => {
  test('Message date should be localized to "yesterday"', async () => {
    const testLocale = {
      strings: COMPONENT_LOCALE_EN_US.strings,
      onDisplayDateTimeString: onDisplayDateTimeStringLocale
    };
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    renderWithLocalization(
      <MessageThread
        userId="user1"
        messages={[sampleMessage]}
        showMessageDate={true}
        onDisplayDateTimeString={onDisplayDateTimeString}
      />,
      testLocale
    );
    expect(screen.getByText('Yesterday')).toBeTruthy();
  });
});

/* @conditional-compile-remove(data-loss-prevention) */
describe('Message blocked should display default blocked text correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        datalosspreventionprohibited: <></>
      }
    });
  });

  test('Should locale string for default message blocked by policy"', async () => {
    const testLocale = createTestLocale({ messageThread: { yesterday: Math.random().toString() } });
    const sampleMessage: BlockedMessage = {
      messageType: 'blocked',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false
    };
    renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(screen.getByText(testLocale.strings.messageThread.blockedWarningText)).toBeTruthy();
  });
});

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
describe('Message should display image and attachment correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        datalosspreventionprohibited: <></>,
        downloadfile: <></>
      }
    });
  });

  test('Message richtext/html img src should be correct', async () => {
    const imgId1 = 'SomeImageId1';
    const imgId2 = 'SomeImageId2';
    const expectedImgSrc1 = 'http://localhost/someImgSrcUrl1';
    const expectedImgSrc2 = 'http://localhost/someImgSrcUrl2';
    const expectedOnFetchAttachmentsCount = 1;
    let onFetchAttachmentsCount = 0;
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content: `<p>Test</p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId1}" style="vertical-align:bottom"></p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId2}" style="vertical-align:bottom"></p><p>&nbsp;</p>`,
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      inlineImages: [
        {
          id: imgId1,
          attachmentType: 'inlineImage',
          url: expectedImgSrc1,
          previewUrl: expectedImgSrc1
        },
        {
          id: imgId2,
          attachmentType: 'inlineImage',
          url: expectedImgSrc2,
          previewUrl: expectedImgSrc2
        }
      ]
    };
    const onFetchAttachments = async (attachments: AttachmentMetadata[]): Promise<AttachmentDownloadResult[]> => {
      onFetchAttachmentsCount++;
      return attachments.map((attachment): AttachmentDownloadResult => {
        const url = attachment.attachmentType === 'inlineImage' ? attachment.previewUrl ?? '' : '';
        return {
          attachmentId: attachment.id,
          blobUrl: url
        };
      });
    };

    const { container } = render(
      <MessageThread userId="user1" messages={[sampleMessage]} onFetchAttachments={onFetchAttachments} />
    );

    await waitFor(async () => {
      expect(container.querySelector(`#${imgId1}`)?.getAttribute('src')).toEqual(expectedImgSrc1);
      expect(container.querySelector(`#${imgId2}`)?.getAttribute('src')).toEqual(expectedImgSrc2);
      expect(onFetchAttachmentsCount).toEqual(expectedOnFetchAttachmentsCount);
    });
  });

  test('Message richtext/html fileSharing and inline image attachment should display correctly', async () => {
    const fildId1 = 'SomeFileId1';
    const fildName1 = 'SomeFileId1.txt';
    const fildId2 = 'SomeFileId2';
    const fildName2 = 'SomeFileId2.pdf';
    const expectedFileSrc1 = 'http://localhost/someFileSrcUrl1';
    const expectedFileSrc2 = 'http://localhost/someFileSrcUrl2';
    const expectedFilePreviewSrc1 = 'http://localhost/someFilePreviewSrcUrl1';

    const imgId1 = 'SomeImageId1';
    const expectedImgSrc1 = 'http://localhost/someImgSrcUrl1';
    const expectedOnFetchInlineImageAttachmentCount = 1;
    let onFetchAttachmentCount = 0;
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content: `<p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId1}" style="vertical-align:bottom"></p>`,
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      files: [
        {
          id: fildId1,
          name: fildName1,
          attachmentType: 'file',
          extension: 'txt',
          url: expectedFileSrc1,
          payload: { teamsFileAttachment: 'true' }
        },
        {
          id: fildId2,
          name: fildName2,
          attachmentType: 'file',
          extension: 'pdf',
          url: expectedFileSrc2
        }
      ],
      inlineImages: [
        {
          id: imgId1,
          attachmentType: 'inlineImage',
          url: expectedImgSrc1,
          previewUrl: expectedFilePreviewSrc1
        }
      ]
    };
    const onFetchAttachments = async (attachments: AttachmentMetadata[]): Promise<AttachmentDownloadResult[]> => {
      onFetchAttachmentCount++;
      const url = attachments[0].attachmentType === 'inlineImage' ? attachments[0].previewUrl ?? '' : '';
      return [
        {
          attachmentId: attachments[0].id,
          blobUrl: url
        }
      ];
    };

    const { container } = render(
      <MessageThread userId="user1" messages={[sampleMessage]} onFetchAttachments={onFetchAttachments} />
    );

    await waitFor(async () => {
      const DownloadFileIconName = 'DownloadFile';
      const fileDownloadCards = container.querySelector('[data-ui-id="file-download-card-group"]')?.firstElementChild;

      // First attachment: previewUrl !== undefined, will not show DownloadFile Icon
      expect(fileDownloadCards?.children[0].innerHTML).not.toContain(DownloadFileIconName);
      expect(fileDownloadCards?.children[0].children[0].textContent).toEqual(fildName1);

      // Second attachment: id === undefined, will show DownloadFile Icon
      expect(fileDownloadCards?.children[1].innerHTML).toContain(DownloadFileIconName);
      expect(fileDownloadCards?.children[1].children[0].textContent).toEqual(fildName2);

      // Inline Image attachment
      expect(container.querySelector(`#${imgId1}`)?.getAttribute('src')).toEqual(expectedFilePreviewSrc1);
      expect(onFetchAttachmentCount).toEqual(expectedOnFetchInlineImageAttachmentCount);
    });
  });

  /* @conditional-compile-remove(image-gallery) */
  test('onInlineImageClicked handler should be called when an inline image is clicked', async () => {
    const fildId1 = 'SomeFileId1';
    const fildName1 = 'SomeFileId1.txt';
    const fildId2 = 'SomeFileId2';
    const fildName2 = 'SomeFileId2.pdf';
    const expectedFileSrc1 = 'http://localhost/someFileSrcUrl1';
    const expectedFileSrc2 = 'http://localhost/someFileSrcUrl2';
    const expectedFilePreviewSrc1 = 'http://localhost/someFilePreviewSrcUrl1';

    const imgId1 = 'SomeImageId1';
    const expectedImgSrc1 = 'http://localhost/someImgSrcUrl1';
    const messageId = Math.random().toString();
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content: `<p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId1}" style="vertical-align:bottom"></p>`,
      senderDisplayName: 'Miguel Garcia',
      messageId,
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      inlineImages: [
        {
          id: imgId1,
          attachmentType: 'inlineImage',
          url: expectedImgSrc1,
          previewUrl: expectedFilePreviewSrc1
        }
      ],
      files: [
        {
          id: fildId1,
          name: fildName1,
          attachmentType: 'file',
          extension: 'txt',
          url: expectedFileSrc1,
          payload: { teamsFileAttachment: 'true' }
        },
        {
          id: fildId2,
          name: fildName2,
          attachmentType: 'file',
          extension: 'pdf',
          url: expectedFileSrc2
        }
      ]
    };

    const onInlineImageClickedHandler = jest.fn();

    const { container } = render(
      <MessageThread userId="user1" messages={[sampleMessage]} onInlineImageClicked={onInlineImageClickedHandler} />
    );

    await waitFor(async () => {
      const inlineImage: HTMLElement | null = container.querySelector(`#${imgId1}`);
      inlineImage?.click();
      expect(onInlineImageClickedHandler).toBeCalledTimes(1);
      expect(onInlineImageClickedHandler).toBeCalledWith(imgId1, messageId);
    });
  });
});

/* @conditional-compile-remove(mention) */
describe('Message should display Mention correctly', () => {
  const MSFT_MENTION = 'msft-mention';

  beforeAll(() => {
    registerIcons({
      icons: {
        chatmessageoptions: <></>,
        messageedit: <></>,
        messageremove: <></>,
        messageresend: <></>,
        editboxcancel: <></>,
        editboxsubmit: <></>
      }
    });
  });

  test('Message should include Mention', async () => {
    const user1Id = 'user1';
    const user2Id = 'user2';
    const user2Name = 'Robert Tolbert';

    const messages: ChatMessage[] = [
      {
        messageType: 'chat',
        senderId: user1Id,
        senderDisplayName: 'Kat Larsson',
        messageId: generateGUID(),
        content: `Hey <msft-mention id="${user2Id}">${user2Name}</msft-mention>, can you help me with my internet connection?`,
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: false,
        attached: false,
        status: 'seen' as MessageStatus,
        contentType: 'html'
      },
      {
        messageType: 'chat',
        senderId: user2Id,
        senderDisplayName: 'Robert Tolbert',
        messageId: generateGUID(),
        content: 'Absolutely! What seems to be the problem?',
        createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
        mine: true,
        attached: false,
        contentType: 'html'
      }
    ];

    const { container } = render(<MessageThread userId={user2Id} messages={messages} />);

    expect(container.querySelector(`#${user2Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user2Id}`)?.textContent).toEqual(user2Name);
  });

  test('Edited Message should include two Mentions', async () => {
    const user1Id = 'user1';
    const user2Id = 'user2';
    const user3Id = 'user3';

    const user2Name = 'Robert Tolbert';
    const user3Name = 'Sam Fisher';

    const messages: ChatMessage[] = [
      {
        messageType: 'chat',
        senderId: user1Id,
        senderDisplayName: 'Kat Larsson',
        messageId: generateGUID(),
        content: `Hey <msft-mention id="${user2Id}">${user2Name}</msft-mention>, can you help me with my internet connection?`,
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: false,
        attached: false,
        status: 'seen' as MessageStatus,
        contentType: 'html'
      },
      {
        messageType: 'chat',
        senderId: user2Id,
        senderDisplayName: 'Robert Tolbert',
        messageId: generateGUID(),
        content: 'Absolutely! What seems to be the problem?',
        createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
        mine: true,
        attached: false,
        contentType: 'html'
      }
    ];

    const { container, rerender } = render(<MessageThread userId={user2Id} messages={messages} />);

    expect(container.querySelector(`#${user2Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user2Id}`)?.textContent).toEqual(user2Name);

    // edit message
    const message1ContentAfterEdit = `Hey <msft-mention id="${user2Id}">${user2Name}</msft-mention> and <msft-mention id="${user3Id}">${user3Name}</msft-mention>, can you help me with my internet connection?`;
    messages[0].content = message1ContentAfterEdit;
    messages[0].editedOn = new Date('2019-04-13T00:01:00.000+08:10');
    const expectedOnRenderMentionCount = 2;
    let onRenderMentionCount = 0;
    const processedMentionIds: string[] = [];

    rerender(
      <MessageThread
        userId={user2Id}
        messages={messages}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              onRenderMentionCount++;
              processedMentionIds.push(mention.id);
              return <span key={generateGUID()}>{defaultOnMentionRender(mention)}</span>;
            }
          }
        }}
      />
    );

    expect(onRenderMentionCount).toEqual(expectedOnRenderMentionCount);
    expect(container.querySelector(`#${user2Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user2Id}`)?.textContent).toEqual(user2Name);
    expect(processedMentionIds[0]).toEqual(user2Id);
    expect(container.querySelector(`#${user3Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user3Id}`)?.textContent).toEqual(user3Name);
    expect(processedMentionIds[1]).toEqual(user3Id);
  });

  test('Edit Message with @ will show MentionPopover and mentions in edited message', async () => {
    const user1Id = 'user1';
    const user2Id = 'user2';

    const user1Name = 'Kat Larsson';

    const messages: ChatMessage[] = [
      {
        messageType: 'chat',
        senderId: user2Id,
        senderDisplayName: 'Robert Tolbert',
        messageId: generateGUID(),
        content: 'Absolutely! What seems to be the problem?',
        createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
        mine: true,
        attached: false,
        contentType: 'html'
      }
    ];

    const expectedOnUpdateMessageCount = 1;
    let onUpdateMessageCount = 0;
    const onUpdateMessageCallback = (messageId, content): Promise<void> => {
      const msgIdx = messages.findIndex((m) => m.messageId === messageId);
      const message = messages[msgIdx];
      message.content = content;
      message.editedOn = new Date(Date.now());
      messages[msgIdx] = message;
      onUpdateMessageCount++;
      return Promise.resolve();
    };

    const onQueryUpdated = async (query: string): Promise<Mention[]> => {
      return Promise.resolve(
        [
          {
            id: user1Id,
            displayText: user1Name
          },
          {
            id: 'everyone',
            displayText: 'Everyone'
          }
        ].filter((suggestion) => suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
      );
    };

    const { container, rerender } = render(
      <MessageThread
        userId={user2Id}
        messages={messages}
        onUpdateMessage={onUpdateMessageCallback}
        mentionOptions={{
          lookupOptions: {
            onQueryUpdated: onQueryUpdated
          }
        }}
      />
    );

    // Find message bubble does not contain mention yet
    const messageBubble = container.querySelector('[data-ui-id="chat-composite-message"]');
    if (!messageBubble) {
      fail('Failed to find chat message bubble');
    }
    expect(messageBubble.innerHTML).not.toContain(user1Name);
    expect(messageBubble.innerHTML).not.toContain(MSFT_MENTION);

    // Click on ... button to trigger context menu
    const menuButton = container.querySelector('[data-ui-id="chat-composite-message-action-icon"]');
    if (!menuButton) {
      fail('Failed to find "More" action button');
    }
    fireEvent.click(menuButton);

    // Click on Edit ContextMenuItem
    const editButton = await screen.findByText('Edit');
    fireEvent.click(editButton);

    // Type ' @' in edit box to show mentions popover menu
    const editBox = await screen.getByPlaceholderText('Edit your message');
    await waitFor(async () => {
      await userEvent.keyboard(' @');
    });

    // Check that Everyone is an option
    const everyoneMentionContextMenuItem = await screen.findByText('Everyone');
    expect(everyoneMentionContextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);

    // Check that user1Name is an option
    const user1MentionContextMenuItem = await screen.findByText(user1Name);
    expect(user1MentionContextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);

    // Select mention from popover for user1Name, verify plain text not contain mention html tag
    fireEvent.click(user1MentionContextMenuItem);
    expect(editBox.innerHTML).toContain(user1Name);
    expect(editBox.innerHTML).not.toContain(MSFT_MENTION);

    // Submit edited message
    const submitButton = await screen.findByLabelText('Done');
    fireEvent.click(submitButton);

    // Verify message has new edited content includes mention HTML tag
    await waitFor(async () => {
      expect(onUpdateMessageCount).toEqual(expectedOnUpdateMessageCount);
      const editedMessageContentWithMention = messages[0].content;
      expect(editedMessageContentWithMention).toContain(user1Name);
      expect(editedMessageContentWithMention).toContain(MSFT_MENTION);
    });

    rerender(
      <MessageThread
        userId={user2Id}
        messages={messages}
        onUpdateMessage={onUpdateMessageCallback}
        mentionOptions={{
          lookupOptions: {
            onQueryUpdated: onQueryUpdated
          }
        }}
      />
    );

    // After re-render with edited message, verify content includes mentions html tag
    const messageBubbleAfterRerender = container.querySelector('[data-ui-id="chat-composite-message"]');
    if (!messageBubbleAfterRerender) {
      fail('Failed to find "More" action button after rerender');
    }
    expect(messageBubbleAfterRerender.innerHTML).toContain(user1Name);
    expect(messageBubbleAfterRerender.innerHTML).toContain(MSFT_MENTION);
  });
});
