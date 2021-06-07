// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Icon, Panel, PrimaryButton, Stack, TextField } from '@fluentui/react';
import {
  settingsGroupNameInputBoxStyle,
  settingsGroupNameInputBoxWarningStyle,
  settingsGroupNameStyle,
  settingsListStyle,
  settingsManagementContentStyle,
  settingsManagementPanelStyle,
  settingsSaveButtonTextStyle,
  settingsSaveChatNameButtonStyle,
  settingsTextFieldIconStyle,
  settingsTopicWarningStyle
} from './styles/SettingsManagement.styles';
import { inputBoxTextStyle } from './styles/SidePanel.styles';
import { ThemeSelector } from 'app/theming/ThemeSelector';
import { ENTER_KEY, MAXIMUM_LENGTH_OF_TOPIC } from './utils/constants';

export type SettingsManagementProps = {
  updateThreadTopicName: (topicName: string) => Promise<void>;
  topicName?: string;
  visible?: boolean;
  parentId?: string;
  onClose?: () => void;
  onRenderFooter?: () => JSX.Element;
};

export const SettingsManagementComponent = (props: SettingsManagementProps): JSX.Element => {
  const { updateThreadTopicName, topicName, visible, parentId, onClose, onRenderFooter } = props;
  const [editedTopicName, setEditedTopicName] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(visible ? visible : false);
  const [isSavingTopicName, setIsSavingTopicName] = useState(false);
  const [topicValidationError, setTopicValidationError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (topicName && editedTopicName.length === 0 && topicName?.length > 0) {
      setEditedTopicName(topicName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicName]);

  const validateTopic = (input: string): void => {
    if (input.length > MAXIMUM_LENGTH_OF_TOPIC) {
      setTopicValidationError(`Topic cannot be over ${MAXIMUM_LENGTH_OF_TOPIC} characters`);
    } else if (input.length <= 0) {
      setTopicValidationError('Topic cannot be blank');
    } else {
      setTopicValidationError(undefined);
    }
  };

  const onChangeTopicName = (event: any): void => {
    setEditedTopicName(event.target.value);
    validateTopic(event.target.value);
  };

  const onSubmitTopicName = async (): Promise<void> => {
    if (topicValidationError || editedTopicName.length === 0) return;
    setIsSavingTopicName(true);
    await updateThreadTopicName(editedTopicName);
    setIsSavingTopicName(false);
    setTimeout(() => {
      document.getElementById('focusButton')?.focus();
    }, 100);
  };

  /**
   * Having isOpen controlled internally means we don't have to rely on a parent component to set visible which allows
   * customers to use the close panel button in Storybook. But then to support allowing the use case of having a parent
   * specify the visibility we have this useEffect to update the component's isOpen to match the visible passed by
   * parent.
   */
  useEffect(() => {
    if (visible && visible !== isOpen) {
      setIsOpen(visible);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Panel
      layerProps={{
        hostId: parentId
      }}
      headerText={'Settings'}
      isOpen={isOpen}
      closeButtonAriaLabel={'close'}
      isBlocking={false}
      isHiddenOnDismiss={true}
      isFooterAtBottom={true}
      onDismiss={onClose ? onClose : () => setIsOpen(false)}
      onRenderFooterContent={onRenderFooter}
      styles={{ main: settingsManagementPanelStyle, content: settingsManagementContentStyle }}
    >
      <Stack className={settingsListStyle} tokens={{ childrenGap: '1.5rem' }}>
        {/* Change Chat Name */}
        <div>
          <div className={settingsGroupNameStyle}>Group Name</div>
          <TextField
            key={topicName}
            className={topicValidationError ? settingsGroupNameInputBoxWarningStyle : settingsGroupNameInputBoxStyle}
            inputClassName={inputBoxTextStyle}
            borderless={true}
            value={editedTopicName}
            placeholder={editedTopicName.length > 0 ? undefined : 'Type a group name'}
            autoComplete="off"
            onSubmit={onSubmitTopicName}
            onChange={onChangeTopicName}
            onKeyUp={(ev) => {
              if (ev.which === ENTER_KEY) {
                onSubmitTopicName();
              }
            }}
          />
          <div className={settingsTopicWarningStyle}> {topicValidationError} </div>
          <PrimaryButton
            id="editThreadTopicButton"
            className={settingsSaveChatNameButtonStyle}
            onClick={onSubmitTopicName}
            disabled={isSavingTopicName || !!topicValidationError}
          >
            <Icon iconName="Save" className={settingsTextFieldIconStyle} />
            <div className={settingsSaveButtonTextStyle}>{isSavingTopicName ? 'Saving...' : 'Save'}</div>
          </PrimaryButton>
        </div>
        <div className={settingsGroupNameStyle}>
          <ThemeSelector label="Theme" />
        </div>
      </Stack>
    </Panel>
  );
};
