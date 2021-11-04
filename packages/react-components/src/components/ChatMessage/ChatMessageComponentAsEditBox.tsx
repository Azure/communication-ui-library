// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, Icon, ITextField, mergeStyles } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import { useTheme } from '../../theming/FluentThemeProvider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { editBoxStyle, inputBoxIcon, editingButtonStyle, editBoxStyleSet } from '../styles/EditBox.styles';
import { InputBoxButton, InputBoxComponent } from '../InputBoxComponent';
import { MessageThreadStrings } from '../MessageThread';

const MAXIMUM_LENGTH_OF_MESSAGE = 8000;

const onRenderCancelIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxCancel'} className={className} />;
};

const onRenderSubmitIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxSubmit'} className={className} />;
};

/** @private */
export type ChatMessageComponentAsEditBoxProps = {
  onCancel?: () => void;
  onSubmit: (text: string) => void;
  initialValue: string;
  strings: MessageThreadStrings;
  /**
   * Inline the accept and reject edit buttons when editing a message.
   * Setting to false will mean they are on a new line inside the editable chat message.
   */
  inlineEditButtons: boolean;
};

/**
 * @private
 */
export const ChatMessageComponentAsEditBox = (props: ChatMessageComponentAsEditBoxProps): JSX.Element => {
  const { onCancel, onSubmit, initialValue, strings } = props;
  const [textValue, setTextValue] = useState<string>(initialValue);
  const [textValueOverflow, setTextValueOverflow] = useState(false);
  const editTextFieldRef = React.useRef<ITextField>(null);
  const theme = useTheme();

  useEffect(() => {
    editTextFieldRef.current?.focus();
  }, []);

  const setText = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    if (newValue === undefined) return;

    if (newValue.length > MAXIMUM_LENGTH_OF_MESSAGE) {
      setTextValueOverflow(true);
    } else {
      setTextValueOverflow(false);
    }
    setTextValue(newValue);
  };

  const textTooLongMessage = textValueOverflow
    ? _formatString(strings.editBoxTextLimit, { limitNumber: `${MAXIMUM_LENGTH_OF_MESSAGE}` })
    : undefined;

  const onRenderThemedCancelIcon = useCallback(
    () => onRenderCancelIcon(theme.palette.neutralSecondary),
    [theme.palette.neutralSecondary]
  );

  const onRenderThemedSubmitIcon = useCallback(
    () => onRenderSubmitIcon(theme.palette.neutralSecondary),
    [theme.palette.neutralSecondary]
  );

  const editBoxStyles = useMemo(() => {
    return concatStyleSets(editBoxStyleSet, { textField: { borderColor: theme.palette.themePrimary } });
  }, [theme.palette.themePrimary]);

  return (
    <InputBoxComponent
      inlineChildren={props.inlineEditButtons}
      id={'editbox'}
      textFieldRef={editTextFieldRef}
      inputClassName={editBoxStyle(props.inlineEditButtons)}
      placeholderText={strings.editBoxPlaceholderText}
      textValue={textValue}
      onChange={setText}
      onEnterKeyDown={() => {
        onSubmit(textValue);
      }}
      supportNewline={false}
      maxLength={MAXIMUM_LENGTH_OF_MESSAGE}
      errorMessage={textTooLongMessage}
      styles={editBoxStyles}
    >
      <InputBoxButton
        className={editingButtonStyle}
        ariaLabel={strings.editBoxCancelButton}
        onRenderIcon={onRenderThemedCancelIcon}
        onClick={() => {
          onCancel && onCancel();
        }}
        id={'dismissIconWrapper'}
      />
      <InputBoxButton
        className={editingButtonStyle}
        ariaLabel={strings.editBoxSubmitButton}
        onRenderIcon={onRenderThemedSubmitIcon}
        onClick={(e) => {
          if (!textValueOverflow && textValue !== '') {
            onSubmit(textValue);
          }
          e.stopPropagation();
        }}
        id={'submitIconWrapper'}
      />
    </InputBoxComponent>
  );
};
