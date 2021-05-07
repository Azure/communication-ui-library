// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { renderHook } from '@testing-library/react-hooks';
import { createContext, useContext } from 'react';
import { useValidContext } from './ValidContext';

type MockContextType = {
  mockKey: string;
};

const mockDefaultContext = {
  mockKey: 'mockval'
};

describe('useValidContext tests', () => {
  test('useValidContext returns a valid context when a valid context exists', () => {
    // Arrange
    const MockContext = createContext<MockContextType | undefined>(mockDefaultContext);
    const useContextResult = renderHook(() => useContext(MockContext));

    // Act
    const useValidContextResult = renderHook(() => useValidContext(MockContext));

    // Assert
    expect(useValidContextResult.result).toEqual(useContextResult.result);
  });

  test('useValidContext throws an error if the context retrieved was undefined', () => {
    // Arrange
    const MockContext = createContext<MockContextType | undefined>(undefined);

    // Act
    const useValidContextResult = renderHook(() => useValidContext(MockContext));

    // Assert
    expect(useValidContextResult.result.error).toBeTruthy();
    expect(useValidContextResult.result.error.message).toEqual('Context is undefined');
  });
});
