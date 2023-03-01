// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _VideoEffectsItem, _VideoEffectsItemProps } from './VideoEffectsItem';

/**
 * 'None' Video Effects Item.
 *
 * @internal
 */
export const _VideoEffectsItemNone = (props: _VideoEffectsItemProps): JSX.Element => {
  const iconProps = props.iconProps ?? {
    iconName: 'VideoEffectsNone'
  };
  const title = props.title ?? 'None';
  const tooltipProps = props.tooltipProps ?? {
    content: props.title ?? 'Remove Background'
  };

  return <_VideoEffectsItem {...props} iconProps={iconProps} title={title} tooltipProps={tooltipProps} />;
};

/**
 * 'Blur' Video Effects Item.
 *
 * @internal
 */
export const _VideoEffectsItemBlur = (props: _VideoEffectsItemProps): JSX.Element => {
  const iconProps = props.iconProps ?? {
    iconName: 'VideoEffectsBlur'
  };
  const title = props.title ?? 'Blurred';
  const tooltipProps = props.tooltipProps ?? {
    content: props.title ?? 'Blur Background'
  };

  return <_VideoEffectsItem {...props} iconProps={iconProps} title={title} tooltipProps={tooltipProps} />;
};

/**
 * 'Add Image' Video Effects Item.
 *
 * @internal
 */
export const _VideoEffectsItemAddImage = (props: _VideoEffectsItemProps): JSX.Element => {
  const iconProps = props.iconProps ?? {
    iconName: 'VideoEffectsAddImage'
  };
  const title = props.title ?? 'Image';
  const tooltipProps = props.tooltipProps ?? {
    content: props.title ?? 'Upload Background Image'
  };

  return <_VideoEffectsItem {...props} iconProps={iconProps} title={title} tooltipProps={tooltipProps} />;
};
