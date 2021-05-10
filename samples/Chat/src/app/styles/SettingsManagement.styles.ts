// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const settingsManagementPanelStyle = mergeStyles({
  boxShadow: '0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.13)'
});

export const settingsManagementContentStyle = mergeStyles({
  paddingTop: '1.125rem',
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  overflow: 'hidden'
});

export const settingsListStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%'
});

export const settingsGroupNameStyle = mergeStyles({
  fontSize: '0.875rem',
  fontWeight: 600,
  marginTop: '0.5rem',
  marginLeft: '1rem'
});

export const settingsGroupNameInputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5rem',
  width: '90%',
  border: '0.125rem solid #CCCCCC',
  borderRadius: '0.188rem',
  backgroundColor: '#FFFFFF',
  marginTop: '0.375rem',
  marginBottom: '0.25rem',
  marginLeft: '1rem',
  fontSize: '1rem'
});

export const settingsGroupNameInputBoxWarningStyle = mergeStyles({
  boxSizing: 'border-box',
  height: '2.5rem',
  width: '90%',
  border: '0.125rem solid #FF0000',
  borderRadius: '0.188rem',
  backgroundColor: '#FFFFFF',
  marginTop: '0.375rem',
  marginBottom: '0.25rem',
  marginLeft: '1rem',
  fontSize: '1rem'
});

export const settingsTopicWarningStyle = mergeStyles({
  height: '1.75rem',
  color: 'red',
  fontSize: '0.75rem',
  paddingLeft: '1rem',
  paddingBottom: '0.5rem'
});

export const settingsEmptyWarningStyle = mergeStyles({
  height: '1.75rem',
  paddingBottom: '1.75rem'
});

export const settingsSaveChatNameButtonStyle = mergeStyles({
  fontWeight: 600,
  height: '2.5rem',
  marginLeft: '1rem',
  paddingRight: '1rem',
  width: '90%'
});

export const settingsTextFieldIconStyle = mergeStyles({
  marginRight: '0.5em',
  fontSize: '0.875rem' // 14px
});

export const settingsSaveButtonTextStyle = mergeStyles({
  fontSize: '0.875rem' // 14px
});
