// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { ReactNode, FormEvent, useCallback } from 'react';

import { Stack, TextField, mergeStyles, IStyle, ITextField, concatStyleSets, ITextFieldProps } from '@fluentui/react';
import { BaseCustomStyles } from '../types';
import { isEnterKeyEventFromCompositionSession } from './utils';

import {
  inputBoxStyle,
  inputBoxWrapperStyle,
  textFieldStyle,
  textContainerStyle
} from './styles/InputBoxComponent.style';

/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from './MentionPopover';
/* @conditional-compile-remove(mention) */
import { TextFieldWithMention, TextFieldWithMentionProps } from './TextFieldWithMention/TextFieldWithMention';

/**
 * @private
 */
export interface InputBoxStylesProps extends BaseCustomStyles {
  /** Styles for the text field. */
  textField?: IStyle;

  /** Styles for the system message; These styles will be ignored when a custom system message component is provided. */
  systemMessage?: IStyle;

  /** Styles for customizing the container of the text field */
  textFieldContainer?: IStyle;
}

type InputBoxComponentProps = {
  children?: ReactNode;
  'data-ui-id'?: string;
  id?: string;
  textValue: string; // This could be plain text or HTML.
  onChange: (event?: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
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
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
};

/**
 * @private
 */
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
  const mergedRootStyle = mergeStyles(inputBoxWrapperStyle, styles?.root);
  const mergedInputFieldStyle = mergeStyles(inputBoxStyle, inputClassName);

  const mergedTextContainerStyle = mergeStyles(textContainerStyle, styles?.textFieldContainer);
  const mergedTextFieldStyle = concatStyleSets(textFieldStyle, {
    fieldGroup: styles?.textField,
    errorMessage: styles?.systemMessage,
    suffix: {
      backgroundColor: 'transparent',
      padding: '0 0'
    }
  });

  const onTextFieldKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isEnterKeyEventFromCompositionSession(ev.nativeEvent)) {
        return;
      }
      if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline)) {
        ev.preventDefault();
        onEnterKeyDown && onEnterKeyDown();
      }
      onKeyDown && onKeyDown(ev);
    },
    [onEnterKeyDown, onKeyDown, supportNewline]
  );

  const onRenderChildren = (): JSX.Element => {
    return <>{children}</>;
  };

  const renderTextField = (): JSX.Element => {
    const textFieldProps: ITextFieldProps = {
      autoFocus: props.autoFocus === 'sendBoxTextField',
      multiline: true,
      autoAdjustHeight: true,
      multiple: false,
      resizable: false,
      componentRef: textFieldRef,
      id,
      inputClassName: mergedInputFieldStyle,
      placeholder: placeholderText,
      autoComplete: 'off',
      styles: mergedTextFieldStyle,
      disabled,
      errorMessage,
      onRenderSuffix: props.children ? onRenderChildren : undefined
    };

    /* @conditional-compile-remove(mention) */
    const textFieldWithMentionProps: TextFieldWithMentionProps = {
      textFieldProps: textFieldProps,
      dataUiId: dataUiId,
      textValue: textValue,
      onChange: onChange,
      onKeyDown: onKeyDown,
      onEnterKeyDown: onEnterKeyDown,
      textFieldRef: textFieldRef,
      supportNewline: supportNewline,
      mentionLookupOptions: props.mentionLookupOptions
    };
    /* @conditional-compile-remove(mention) */
    if (props.mentionLookupOptions) {
      return <TextFieldWithMention {...textFieldWithMentionProps} />;
    }
    return (
      <div style={textFieldProps.errorMessage ? { padding: '0 0 5px 5px' } : undefined}>
        <TextField
          {...textFieldProps}
          data-ui-id={dataUiId}
          value={textValue}
          onChange={onChange}
          onKeyDown={onTextFieldKeyDown}
          onFocus={(e) => {
            // Fix for setting the cursor to the correct position when multiline is true
            // This approach should be reviewed during migration to FluentUI v9
            e.currentTarget.value = '';
            e.currentTarget.value = textValue;
          }}
        />
      </div>
    );
  };

  return (
    <Stack className={mergedRootStyle}>
      <div className={mergedTextContainerStyle}>{renderTextField()}</div>
    </Stack>
  );
};
