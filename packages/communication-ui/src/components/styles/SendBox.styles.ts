// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

export const textFieldStyle = mergeStyles({
  width: '100%',
  minHeight: '0px',
  fontSize: '8.25rem'
});

export const TextFieldStyleProps = {
  wrapper: {},
  fieldGroup: {
    height: 'auto',
    minHeight: '0px'
  }
};

export const sendBoxWrapperStyle = mergeStyles({
  padding: '0.0625rem',
  backgroundColor: '#EEF2F5',
  ':focus-within': {
    outline: '0.0625rem solid #106EBE',
    outlineOffset: '-0.0625rem'
  }
});

export const sendBoxStyle = mergeStyles({
  minHeight: '0',
  maxHeight: '8.25rem',
  outline: 'red 5px',
  color: 'black',
  backgroundColor: '#EEF2F5',
  fontWeight: 400,
  fontSize: '0.875rem',
  width: '100%',
  height: '2.25rem',
  lineHeight: '1.5rem',
  '::-webkit-input-placeholder': {
    fontSize: '0.875rem'
  },
  '::-moz-placeholder': {
    fontSize: '0.875rem'
  },
  ':-moz-placeholder': {
    fontSize: '0.875rem'
  }
});

export const sendIconStyle = mergeStyles({
  backgroundColor: '#EEF2F5',
  width: '2.25rem',
  height: '2.25rem',
  color: 'grey',
  paddingLeft: '0.5rem',
  paddingTop: '0.625rem',
  fontSize: '0.875rem' // 14px
});

export const sendButtonStyle = mergeStyles({
  backgroundColor: '#EEF2F5',
  width: '2.25rem',
  color: 'grey',
  paddingLeft: '0.5rem',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const sendIconDiv = mergeStyles({
  width: '1.0625rem',
  height: '1.0625rem',
  background:
    'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuNzIxMTI2IDAuMDUxNDk0NUwxNi4wNzU2IDcuNjE3NDZDMTYuMzIzMyA3LjczOTUyIDE2LjQyNTIgOC4wMzkyNyAxNi4zMDMxIDguMjg2OTdDMTYuMjU0NCA4LjM4NTggMTYuMTc0NCA4LjQ2NTc4IDE2LjA3NTYgOC41MTQ0OEwwLjcyMTQ0MiAxNi4wODAzQzAuNDczNzM5IDE2LjIwMjMgMC4xNzM5ODkgMTYuMTAwNSAwLjA1MTkzMjggMTUuODUyOEMtMC4wMDE0MzkxNSAxNS43NDQ1IC0wLjAxMzgxMTIgMTUuNjIwNSAwLjAxNzEwMTcgMTUuNTAzOEwxLjk4NTggOC4wNzAxMkwwLjAxNjc1NSAwLjYyNzg4OEMtMC4wNTM4NzU1IDAuMzYwOTMyIDAuMTA1Mjc4IDAuMDg3MjYzIDAuMzcyMjM1IDAuMDE2NjMyNUMwLjQ4ODkyNyAtMC4wMTQyNDE2IDAuNjEyODUgLTAuMDAxODU5IDAuNzIxMTI2IDAuMDUxNDk0NVpNMS4yNjQ0NSAxLjQzNDAzTDIuODczNTcgNy41MTYxMkwyLjkzNTU1IDcuNTA0MTJMMyA3LjVIMTBDMTAuMjc2MSA3LjUgMTAuNSA3LjcyMzg2IDEwLjUgOEMxMC41IDguMjQ1NDYgMTAuMzIzMSA4LjQ0OTYxIDEwLjA4OTkgOC40OTE5NEwxMCA4LjVIM0MyLjk2ODYgOC41IDIuOTM3ODcgOC40OTcxIDIuOTA4MDcgOC40OTE1N0wxLjI2NTA4IDE0LjY5NzZMMTQuNzIzNCA4LjA2NTk3TDEuMjY0NDUgMS40MzQwM1oiIGZpbGw9IiM2RTZFNkUiLz4KPC9zdmc+Cg==")',
  '.sendIconWrapper:hover &': {
    background:
      'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuNzIxMTI2IDAuMDUxNDk0NUwxNi4wNzU2IDcuNjE3NDZDMTYuMzIzMyA3LjczOTUyIDE2LjQyNTIgOC4wMzkyNyAxNi4zMDMxIDguMjg2OTdDMTYuMjU0NCA4LjM4NTggMTYuMTc0NCA4LjQ2NTc4IDE2LjA3NTYgOC41MTQ0OEwwLjcyMTQ0MiAxNi4wODAzQzAuNDczNzM5IDE2LjIwMjMgMC4xNzM5ODkgMTYuMTAwNSAwLjA1MTkzMjggMTUuODUyOEMtMC4wMDE0MzkxNSAxNS43NDQ1IC0wLjAxMzgxMTIgMTUuNjIwNSAwLjAxNzEwMTcgMTUuNTAzOEwxLjUzODM1IDkuNzU5MUMxLjU4ODY2IDkuNTY5MTEgMS43NDU2IDkuNDI2MjIgMS45Mzk0NiA5LjM5MzlMOC44MjA0MSA4LjI0NjZDOC45MDQ3IDguMjMyNTUgOC45NzQ0MSA4LjE3NjkgOS4wMDc5MSA4LjEwMTI1TDkuMDI1OTEgOC4wNDExQzkuMDQ1MzYgNy45MjQzNiA4Ljk4MDU1IDcuODEzMDUgOC44NzU4NyA3Ljc2OTM0TDguODIwNDEgNy43NTM0TDEuOTAwNjEgNi42MDAxQzEuNzA2NjggNi41Njc3OCAxLjU0OTY5IDYuNDI0OCAxLjQ5OTQyIDYuMjM0NzNMMC4wMTY3NTUgMC42Mjc4ODhDLTAuMDUzODc1NSAwLjM2MDkzMiAwLjEwNTI3OCAwLjA4NzI2MyAwLjM3MjIzNSAwLjAxNjYzMjVDMC40ODg5MjcgLTAuMDE0MjQxNiAwLjYxMjg1IC0wLjAwMTg1OSAwLjcyMTEyNiAwLjA1MTQ5NDVaIiBmaWxsPSIjMDA3OEQ0Ii8+Cjwvc3ZnPg==")'
  }
});
