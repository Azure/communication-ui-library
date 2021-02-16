// © Microsoft Corporation. All rights reserved.
import { useContext } from 'react';

/**
 * Generic function to ensure the retreived context is valid.
 * Returns the context or throws an error if the context is undefined.
 */
export const useValidContext = <T extends unknown>(ReactContext: React.Context<T | undefined>): T => {
  const context = useContext<T | undefined>(ReactContext);
  if (context === undefined) {
    throw new Error('context is undefined');
  }
  return context;
};
