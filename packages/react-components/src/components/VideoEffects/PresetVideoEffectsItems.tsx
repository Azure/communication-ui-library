// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _VideoEffectsItem, _VideoEffectsItemProps } from './VideoEffectsItem';

/**
 * 'None' Video Effects Item.
 *
 * @internal
 */
export const _VideoEffectsItemNoBackground = (props: _VideoEffectsItemProps): JSX.Element => {
  const derivedProps = deriveProps(props, {
    iconName: 'VideoEffectsNone',
    title: 'None',
    tooltipContent: 'Remove Background',
    ariaLabel: 'Remove Background'
  });

  return <_VideoEffectsItem {...derivedProps} />;
};

/**
 * 'Blur' Video Effects Item.
 *
 * @internal
 */
export const _VideoEffectsItemBlur = (props: _VideoEffectsItemProps): JSX.Element => {
  const derivedProps = deriveProps(props, {
    iconName: 'VideoEffectsBlur',
    title: 'Blurred',
    tooltipContent: 'Blur Background',
    ariaLabel: 'Blur Background'
  });

  return <_VideoEffectsItem {...derivedProps} />;
};

/**
 * 'Add Image' Video Effects Item.
 *
 * @internal
 */
export const _VideoEffectsItemAddImage = (props: _VideoEffectsItemProps): JSX.Element => {
  const derivedProps = deriveProps(props, {
    iconName: 'VideoEffectsAddImage',
    title: 'Image',
    tooltipContent: 'Upload Background Image',
    ariaLabel: 'Upload Background Image'
  });

  return <_VideoEffectsItem {...derivedProps} />;
};

/** Applies fallbacks if props were not specified */
const deriveProps = (
  props: _VideoEffectsItemProps,
  fallbacks: {
    iconName: string;
    title: string;
    tooltipContent: string;
    ariaLabel: string;
  }
): _VideoEffectsItemProps => {
  const iconProps = props.iconProps ?? {
    iconName: fallbacks.iconName
  };
  const title = props.title ?? fallbacks.title;
  const tooltipProps = props.tooltipProps ?? {
    content: props.title ?? fallbacks.tooltipContent
  };
  const ariaLabel =
    props.ariaLabel ?? typeof props.tooltipProps?.content === 'string'
      ? typeof props.tooltipProps?.content
      : props.title ?? fallbacks.ariaLabel;

  return {
    ...props,
    iconProps,
    title,
    tooltipProps,
    ariaLabel
  };
};
