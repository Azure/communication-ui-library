//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { FunctionComponent, useEffect, useState } from 'react';
import { Panel } from '@fluentui/react';
import { panelContentStyle, panelNoAnimationMainStyle } from './styles/Panel.styles';

export type StaticPanelProps = {
  title: string;
  /** Hides or shows the Panel */
  visible?: boolean;
  /** The HTML element id of the parent that Panel renders within. If not provided Panel is absolute positioned. */
  parentId?: string;
  onClose?: () => void;
  /** Used to render a footer at the bottom of the panel. */
  onRenderFooter?: () => JSX.Element;
};

export const StaticPanelComponent: FunctionComponent<StaticPanelProps> = (
  props: React.PropsWithChildren<StaticPanelProps>
): JSX.Element => {
  const { title, children, visible, parentId, onClose, onRenderFooter } = props;
  const [isOpen, setIsOpen] = useState<boolean>(visible ? visible : false);

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
      headerText={title}
      isOpen={isOpen}
      closeButtonAriaLabel={'close'}
      isBlocking={false}
      isHiddenOnDismiss={true}
      isFooterAtBottom={true}
      onDismiss={onClose ? onClose : () => setIsOpen(false)}
      onRenderFooterContent={onRenderFooter}
      styles={{ main: panelNoAnimationMainStyle, content: panelContentStyle }}
    >
      {children}
    </Panel>
  );
};
