import { mergeStyles } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { BackToTop, TableOfContents } from 'storybook-docs-toc';

const LAPTOP_WIDTH = '(max-width: 1200px)';
const TABLET_WIDTH = '(max-width: 900px)';

/**
 * Table Of Contents component used for displaying a floating table of content
 * inside Storybook Docs.
 * @param props 
 * @returns 
 */
export const TOC = (props: {children: React.ReactNode}): JSX.Element => {

  const [narrowDocs, setNarrowDocs] = useState(window.matchMedia(LAPTOP_WIDTH).matches);
  const [hideToc, setHideToc] = useState(window.matchMedia(TABLET_WIDTH).matches);

  useEffect(() => {
    const setNarrowDocsHandler = (e: MediaQueryListEvent) => setNarrowDocs(e.matches);
    const setHideTocHandler = (e: MediaQueryListEvent) => setHideToc(e.matches);

    window.matchMedia(LAPTOP_WIDTH).addEventListener('change', setNarrowDocsHandler);
    window.matchMedia(TABLET_WIDTH).addEventListener('change', setHideTocHandler);

    return () => {
      window.matchMedia(LAPTOP_WIDTH).removeEventListener('change', setNarrowDocsHandler);
      window.matchMedia(TABLET_WIDTH).removeEventListener('change', setHideTocHandler);
    }
  })


  const tocStyles = mergeStyles({
    display: hideToc ? 'none' : 'block',
    fontFamily: 'Segoe UI Regular',
    fontSize: '12px',
    '& nav': { 
      top: 0,
      maxWidth: '10em',
      right: 0, 
      'div > ol > li.toc-list-item': {
        padding: '0 0.5em',
      },
      'div > ol > li > a.toc-link': {
        whiteSpace: 'break-spaces !important',
        marginBottom: '4px',
        marginTop: '4px',
      },
      'a.toc-link': {
        whiteSpace: 'break-spaces !important',
        marginBottom: '2px',
        marginTop: '2px',
      }
    },
  });

  return (
    <React.Fragment>
        <div className={tocStyles}>
          <TableOfContents />
        </div>
        <div style={narrowDocs ? { maxWidth: '768px' } : {}}>
          {props.children}
        </div>
        <div className={mergeStyles({'> button': { right: 16 }})}>
          <BackToTop />
        </div>
      </React.Fragment>
  );
} 