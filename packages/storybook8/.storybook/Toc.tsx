// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IRawStyle, mergeStyles } from '@fluentui/react';
import { NAVIGATE_URL } from '@storybook/core-events';
import { addons } from '@storybook/manager-api';
import * as React from 'react';
import { useRef } from 'react';

const tocStyles: Record<string, IRawStyle> = {
  root: {
    top: '64px',
    position: 'sticky',
    marginLeft: '40px',
    alignSelf: 'flex-start',
    width: '200px',
  },
  heading: {
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '20px'
  },
  ol: {
    position: 'relative',
    listStyleType: 'none',
    marginLeft: 0,
    marginTop: 0,
    paddingInlineStart: '20px',
    '& li': {
      marginBottom: '15px',
      lineHeight: '16px'
    },
    '& a': {
      textDecorationLine: 'none',
      color: '#201F1E',
      fontSize: '14px',
      ':hover': {
        color: '#201F1E'
      }
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      height: '100%',
      width: '3px',
      backgroundColor: '#EDEBE9',
      borderRadius: '4px'
    }
  },
  selected: {
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      left: '-20px',
      top: 0,
      bottom: 0,
      width: '3px',
      backgroundColor: '#436DCD',
      borderRadius: '4px'
    }
  }
};

type TocItem = { name: string; id: string; selected?: boolean };

const navigate = (url: string): void => {
  addons.getChannel().emit(NAVIGATE_URL, url);
};

export const nameToHash = (id: string): string => id.toLowerCase().replace(/[^a-z0-9]/gi, '-');

export const Toc = ({ stories }: { stories: TocItem[] }): JSX.Element => {
  const [selected, setSelected] = React.useState('');
  const isNavigating = useRef<boolean>(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (isNavigating.current) {
          isNavigating.current = false;
          return;
        }
        for (const entry of entries) {
          const { intersectionRatio, target } = entry;
          if (intersectionRatio > 0.5) {
            setSelected(target.id);
            return;
          }
        }
      },
      {
        threshold: [0.5]
      }
    );

    stories.forEach((link) => {
      const element = document.getElementById(nameToHash(link.name));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [stories]);

  const tocItems = stories.map((item) => {
    return { ...item, selected: nameToHash(item.name) === selected };
  });
  return (
    <nav className={mergeStyles(tocStyles.root)}>
      <h3 className={mergeStyles(tocStyles.heading)}>On this page</h3>
      <ol className={mergeStyles(tocStyles.ol)}>
        {tocItems.map((s) => {
          const name = nameToHash(s.name);
          return (
            <li className={s.selected ? mergeStyles(tocStyles.selected) : ''} key={s.id}>
              <a
                href={`#${name}`}
                target="_self"
                onClick={() => {
                  isNavigating.current = true;
                  navigate(`#${name}`);
                  setSelected(name);
                }}
              >
                {s.name}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
