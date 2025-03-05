// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IButton } from '@fluentui/react';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useEffect } from 'react';

/**
 * Type for reference to the last component used
 * @public
 */
export type AccessibilityComponentRef = IButton | null;

interface AccessibilityContextType {
  /** function to set the reference to the last used control */
  setComponentRef: (ref: AccessibilityComponentRef) => void;
  /** reference to the last used control */
  componentRef: AccessibilityComponentRef;
}

// Create the context with a default value
const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

/**
 * Hook to access the A11yContext content
 * @returns The A11yContext
 * @public
 */
export const useAccessibility = (): AccessibilityContextType | null => useContext(AccessibilityContext);

/**
 * Props for the AccessibilityProvider
 * @public
 */
export type AccessibilityProviderProps = {
  children: ReactNode;
};

/**
 * Provider to access the A11yContext
 * @public
 */
export const AccessibilityProvider = (props: AccessibilityProviderProps): JSX.Element => {
  console.log('AccessibilityProvider');
  const [componentRef, setComponentRef] = useState<AccessibilityComponentRef>(null);

  const handleSetComponentRef = useCallback(
    (ref: AccessibilityComponentRef) => {
      console.log(ref);
      setComponentRef(ref);
    },
    [setComponentRef]
  );

  useEffect(() => {
    console.log('componentRef', componentRef);
  }, [componentRef]);

  return (
    <AccessibilityContext.Provider value={{ setComponentRef: handleSetComponentRef, componentRef }}>
      {props.children}
    </AccessibilityContext.Provider>
  );
};
