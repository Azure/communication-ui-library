import { mergeStyles } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { BackToTop, TableOfContents } from 'storybook-docs-toc';

const TABLET_WIDTH = '(max-width: 900px)';

/**
 * Table Of Contents component used for displaying a floating table of content
 * inside Storybook Docs.
 * @param props 
 * @returns 
 */
export const TOC = (props: {children: React.ReactNode}): JSX.Element => {
  const [hideToc, setHideToc] = useState(window.matchMedia(TABLET_WIDTH).matches);

  useEffect(() => {
    const setHideTocHandler = (e: MediaQueryListEvent) => setHideToc(e.matches);

    window.matchMedia(TABLET_WIDTH).addEventListener('change', setHideTocHandler);

    return () => {
      window.matchMedia(TABLET_WIDTH).removeEventListener('change', setHideTocHandler);
    }
  });

  const tocStyles = mergeStyles({
    display: hideToc ? 'none' : 'block',
    fontFamily: 'Segoe UI',
    fontSize: '12px',
    '& nav': { 
      top: 0,
      width: '10rem',
      left: 'calc(100% - 11.25rem)', 
      'div > ol > li.toc-list-item': {
        padding: '0 0.5rem',
      },
      'div > ol > li > a.toc-link': {
        whiteSpace: 'break-spaces !important',
        marginBottom: '0.25rem',
        marginTop: '0.25rem',
      },
      'a.toc-link': {
        whiteSpace: 'break-spaces !important',
        marginBottom: '0.125rem',
        marginTop: '0.125rem',
      }
    },
  });

  return (
    <React.Fragment>
        <div className={tocStyles}>
          <TableOfContents />
        </div>
        <div style={hideToc ? { maxWidth: '48rem' } : { maxWidth: 'calc(100% - 11.25rem)' }} >
          {props.children}
        </div>
        <div className={mergeStyles({'> button': { right: 16 }})}>
          <BackToTop />
        </div>
      </React.Fragment>
  );
} 