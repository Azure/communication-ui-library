// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTheme } from '../theming/FluentThemeProvider';
import React, { useCallback, useMemo, useState } from 'react';
import { concatStyleSets, Icon, mergeStyles } from '@fluentui/react';

import { editBoxStyle, inputBoxIcon, editingButtonStyle, editBoxStyleSet } from './styles/EditBox.styles';
import { InputBoxButton, InputBoxComponent } from './InputBoxComponent';
import { MessageThreadStrings } from './MessageThread';
import { formatString } from '../localization/localizationUtils';

const MAXIMUM_LENGTH_OF_MESSAGE = 8000;

const onRenderCancelIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxCancel'} className={className} />;
};

const onRenderSubmitIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxSubmit'} className={className} />;
};

/**
 * @private
 */
export type EditBoxProps = {
  onCancel?: () => void;
  onSubmit: (text: string) => void;
  initialValue: string;
  strings: MessageThreadStrings;
};

/**
 * @private
 */
export const EditBox = (props: EditBoxProps): JSX.Element => {
  const { onCancel, onSubmit, initialValue, strings } = props;
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

  const textTooLongMessage = textValueOverflow
    ? formatString(strings.editBoxTextLimit, { limitNumber: `${MAXIMUM_LENGTH_OF_MESSAGE}` })
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
      inputClassName={editBoxStyle}
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
