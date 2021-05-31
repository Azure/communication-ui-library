import { mergeStyles } from '@fluentui/react';
import React, { useState } from 'react';
import { BackToTop, TableOfContents } from 'storybook-docs-toc';

export const TOC = (props: {children: React.ReactNode}): JSX.Element => {

  const [hideToc, setHideToc] = useState(false);

  window.matchMedia('(max-width: 1200px)').addEventListener('change', (e) => {
    setHideToc(e.matches);
  })

  const tocStyles = mergeStyles({
    display: hideToc ? 'none' : 'block',
    fontFamily: 'Segoe UI Regular',
    fontSize: '12px',
    '& nav': { 
      top: 0,
      maxWidth: '10rem',
      right: 0, 
      'div > ol > li.toc-list-item': {
        padding: '0 0.5rem',
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
        <div>
          {props.children}
        </div>
        <div className={mergeStyles({'> button': { right: 16 }})}>
          <BackToTop />
        </div>
      </React.Fragment>
  );
} 