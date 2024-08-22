// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { MessageBar } from '@fluentui/react';
import React from 'react';

export const Note = (props: { children: React.ReactNode }): JSX.Element => {
  return (
    <MessageBar
      styles={{
        root: {
          minHeight: 'auto',
          padding: '0.5rem'
        }
      }}
    >
      <span
        style={{
          height: '1rem',
          lineHeight: '1rem',
          display: 'inline-block',
          marginLeft: '0.5rem'
        }}
      >
        {props.children}
      </span>
    </MessageBar>
  );
};
