// © Microsoft Corporation. All rights reserved.
import React, { useEffect, useState } from 'react';
import { Icon, Panel, PrimaryButton, TextField } from '@fluentui/react';
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
import { ChatTopicPropsFromContext, MapToChatTopicProps, connectFuncsToContext } from '@azure/communication-ui';
import { ENTER_KEY, MAXIMUM_LENGTH_OF_TOPIC } from '@azure/communication-ui';

export type SettingsManagementProps = {
  updateThreadTopicName: (topicName: string) => Promise<boolean>;
  topicName?: string;
  topicNameExists?: boolean;
  visible?: boolean;
  parentId?: string;
  onClose?: () => void;
  onRenderFooter?: () => JSX.Element;
};

export const SettingsManagementComponent = (
  props: SettingsManagementProps & ChatTopicPropsFromContext
): JSX.Element => {
  const { updateThreadTopicName, topicName, existsTopicName, visible, parentId, onClose, onRenderFooter } = props;
  const [edittedTopicName, setEdittedTopicName] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(visible ? visible : false);
  const [isEditingTopicName, setIsEditingTopicName] = useState(false);
  const [isTopicNameOverflow, setTopicNameOverflow] = useState(false);
  const [isSavingTopicName, setIsSavingTopicName] = useState(false);

  const onTopicNameTextChange = (event: any): void => {
    setIsEditingTopicName(true);
    setEdittedTopicName(event.target.value);
    if (event.target.value.length > MAXIMUM_LENGTH_OF_TOPIC) {
      setTopicNameOverflow(true);
    } else {
      setTopicNameOverflow(false);
    }
  };

  const onTopicNameSubmit = async (): Promise<void> => {
    if (edittedTopicName.length > MAXIMUM_LENGTH_OF_TOPIC) return;
    setIsSavingTopicName(true);
    const res = await updateThreadTopicName(edittedTopicName);
    if (!res) {
      console.error('unable to update thread topic name');
    }
    setIsSavingTopicName(false);
    setIsEditingTopicName(false);
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
      <div className={settingsListStyle}>
        {/* Change Chat Name */}
        <div className={settingsGroupNameStyle}>Group Name</div>
        <TextField
          key={topicName}
          className={isTopicNameOverflow ? settingsGroupNameInputBoxWarningStyle : settingsGroupNameInputBoxStyle}
          inputClassName={inputBoxTextStyle}
          borderless={true}
          defaultValue={isEditingTopicName ? edittedTopicName : existsTopicName ? topicName : ''}
          placeholder={existsTopicName ? undefined : 'Type a group name'}
          autoComplete="off"
          onSubmit={onTopicNameSubmit}
          onChange={onTopicNameTextChange}
          onKeyUp={(ev) => {
            if (ev.which === ENTER_KEY) {
              onTopicNameSubmit();
            }
          }}
        />
        {(isTopicNameOverflow && (
          <div className={settingsTopicWarningStyle}> Topic cannot be over 30 characters </div>
        )) ||
          (!isTopicNameOverflow && <div className={settingsTopicWarningStyle} />)}
        <PrimaryButton
          id="editThreadTopicButton"
          className={settingsSaveChatNameButtonStyle}
          onClick={() => onTopicNameSubmit()}
          disabled={isSavingTopicName}
        >
          <Icon iconName="Save" className={settingsTextFieldIconStyle} />
          <div className={settingsSaveButtonTextStyle}>{isSavingTopicName ? 'Saving...' : 'Save'}</div>
        </PrimaryButton>
      </div>
    </Panel>
  );
};

export default connectFuncsToContext(SettingsManagementComponent, MapToChatTopicProps);
