// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTheme } from '../theming/FluentThemeProvider';
import React, { useCallback, useState } from 'react';
import { Icon, mergeStyles } from '@fluentui/react';

import { editBoxStyle, inputBoxIcon, editingButtonStyle, editBoxStyleSet } from './styles/EditBox.styles';
import { InputBoxButton, InputBoxComponent } from './InputBoxComponent';

const MAXIMUM_LENGTH_OF_MESSAGE = 8000;
const TEXT_EXCEEDS_LIMIT = `Your message is over the limit of ${MAXIMUM_LENGTH_OF_MESSAGE} characters`;

const onRenderCancelIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxCancel'} className={className} />;
};

const onRenderSubmitIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxSubmit'} className={className} />;
};

type EditBoxProps = {
  onCancel?: () => void;
  onSubmit: (text: string) => void;
  initialValue: string;
};

export const EditBox = (props: EditBoxProps): JSX.Element => {
  const { onCancel, onSubmit, initialValue } = props;
  const [textValue, setTextValue] = useState<string>(initialValue);
  const [textValueOverflow, setTextValueOverflow] = useState(false);
  const theme = useTheme();

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

  const textTooLongMessage = textValueOverflow ? TEXT_EXCEEDS_LIMIT : undefined;

  const onRenderThemedCancelIcon = useCallback(
    () => onRenderCancelIcon(theme.palette.themePrimary),
    [theme.palette.themePrimary]
  );

  const onRenderThemedSubmitIcon = useCallback(
    () => onRenderSubmitIcon(theme.palette.themePrimary),
    [theme.palette.themePrimary]
  );

  return (
    <InputBoxComponent
      inputClassName={editBoxStyle}
      textValue={textValue}
      onChange={setText}
      onEnterKeyDown={() => {
        onSubmit(textValue);
      }}
      supportNewline={false}
      maxLength={MAXIMUM_LENGTH_OF_MESSAGE}
      errorMessage={textTooLongMessage}
      styles={editBoxStyleSet}
    >
      <InputBoxButton
        className={editingButtonStyle}
        onRenderIcon={onRenderThemedCancelIcon}
        onClick={() => {
          onCancel && onCancel();
        }}
        id={'dismissIconWrapper'}
      />
      <InputBoxButton
        className={editingButtonStyle}
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
