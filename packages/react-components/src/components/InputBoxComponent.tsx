// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback } from 'react';
import { Stack, TextField, mergeStyles, IStyle, ITextField, concatStyleSets } from '@fluentui/react';
import { BaseCustomStylesProps } from '../types';
import {
  inputBoxStyle,
  inputBoxWrapperStyle,
  inputButtonContainerStyle,
  inputButtonStyle,
  textFieldStyle
} from './styles/InputBoxComponent.style';

import { isDarkThemed } from '../theming/themeUtils';
import { useTheme } from '../theming/FluentThemeProvider';

export interface InputBoxStylesProps extends BaseCustomStylesProps {
  /** Styles for the text field. */
  textField?: IStyle;

  /** Styles for the system message; These styles will be ignored when a custom system message component is provided. */
  systemMessage?: IStyle;
}

type InputBoxComponentProps = {
  children: ReactNode;
  'data-ui-id'?: string;
  id?: string;
  textValue: string;
  onChange: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => void;
  textFieldRef?: React.RefObject<ITextField>;
  inputClassName?: string;
  placeholderText?: string;
  supportNewline?: boolean;
  maxLength: number;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEnterKeyDown?: () => void;
  errorMessage?: string | React.ReactElement;
  disabled?: boolean;
  styles?: InputBoxStylesProps;
};

export const InputBoxComponent = (props: InputBoxComponentProps): JSX.Element => {
  const {
    styles,
    id,
    'data-ui-id': dataUiId,
    textValue,
    onChange,
    textFieldRef,
    placeholderText,
    onKeyDown,
    onEnterKeyDown,
    supportNewline,
    inputClassName,
    errorMessage,
    disabled,
    children
  } = props;

  const theme = useTheme();
  const mergedRootStyle = mergeStyles(inputBoxWrapperStyle, styles?.root);
  const mergedTextFiledStyle = mergeStyles(inputBoxStyle, inputClassName);

  const mergedTextFieldStyle = concatStyleSets(
    textFieldStyle(isDarkThemed(theme) ? '#f1707b' : '#a80000', !!errorMessage, !!disabled),
    {
      fieldGroup: styles?.textField,
      errorMessage: styles?.systemMessage
    }
  );

  const onTexFieldKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline)) {
        ev.preventDefault();
        onEnterKeyDown && onEnterKeyDown();
      }
      onKeyDown && onKeyDown(ev);
    },
    [onEnterKeyDown, onKeyDown, supportNewline]
  );

  return (
    <Stack className={mergedRootStyle}>
      <div style={{ position: 'relative' }}>
        <TextField
          data-ui-id={dataUiId}
          multiline
          autoAdjustHeight
          multiple={false}
          resizable={false}
          componentRef={textFieldRef}
          id={id}
          ariaLabel={'Type'}
          inputClassName={mergedTextFiledStyle}
          placeholder={placeholderText}
          value={textValue}
          onChange={onChange}
          autoComplete="off"
          onKeyDown={onTexFieldKeyDown}
          styles={mergedTextFieldStyle}
          disabled={disabled}
          errorMessage={errorMessage}
        />
        <div className={inputButtonContainerStyle(theme.rtl)}>{children}</div>
      </div>
    </Stack>
  );
};

export type InputBoxButtonProps = {
  onRenderIcon: (props: InputBoxButtonProps, isMouseOverSendIcon: boolean) => JSX.Element;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  id?: string;
};

export const InputBoxButton = (props: InputBoxButtonProps): JSX.Element => {
  const { onRenderIcon, onClick, className, id } = props;
  const [isMouseOverSendIcon, setIsMouseOverSendIcon] = useState(false);
  const mergedButtonStyle = mergeStyles(inputButtonStyle, className);
  return (
    <div
      className={mergedButtonStyle}
      onClick={onClick}
      id={id}
      onMouseEnter={() => {
        setIsMouseOverSendIcon(true);
      }}
      onMouseLeave={() => {
        setIsMouseOverSendIcon(false);
      }}
    >
      {onRenderIcon(props, isMouseOverSendIcon)}
    </div>
  );
};
