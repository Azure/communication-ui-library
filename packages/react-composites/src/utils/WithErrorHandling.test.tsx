// © Microsoft Corporation. All rights reserved.
import { CommunicationUiError } from '../types/CommunicationUiError';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { WithErrorHandling } from './WithErrorHandling';
import { ErrorHandlingProps, ErrorProvider } from '../providers/ErrorProvider';

let container: HTMLDivElement;
// These tests intentionally throw errors and the test runtime will automatically log them to console.error which
// generates a lot of noise in the console. So we'll temporarily disable console.error and restore it after.
let consoleError: any | undefined = undefined;
beforeEach(() => {
  consoleError = console.error;
  console.error = () => {
    // Nothing
  };
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (consoleError) {
    console.error = consoleError;
  }

  if (container !== null) {
    unmountComponentAtNode(container);
    container.remove();
  }
});

const testMessage = 'test';
const testId = 'test-id';
const testErrorMessage = 'TestErrorException';

type TestComponentProps = {
  message: string;
  throwError?: boolean;
  throwCommunicationError?: boolean;
};

const TestComponent = (props: TestComponentProps): JSX.Element => {
  if (props.throwError) {
    throw new Error(testErrorMessage);
  }
  if (props.throwCommunicationError) {
    throw new CommunicationUiError({ message: testErrorMessage });
  }

  return <span id={testId}>{props.message}</span>;
};

const WrappedComponent = (props: TestComponentProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(TestComponent, props);

const mockOnErrorCallback = jest.fn();

const mockOnErrorCallbackInProvider = jest.fn();

describe('WithErrorHandling tests', () => {
  test('WithErrorHandling should wrap component properly with props being passed through correctly', () => {
    mockOnErrorCallback.mockClear();
    act(() => {
      render(<WrappedComponent message={testMessage} />, container);
    });

    const renderedTestComponent = container.querySelector('#' + testId);
    expect(renderedTestComponent).toBeDefined();
    expect(renderedTestComponent?.innerHTML).toBe(testMessage);
    expect(mockOnErrorCallback).not.toBeCalled();
  });

  test('WithErrorHandling should catch Error thrown in wrapped component and call handler', () => {
    mockOnErrorCallback.mockClear();
    act(() => {
      render(
        <WrappedComponent message={testMessage} throwError={true} onErrorCallback={mockOnErrorCallback} />,
        container
      );
    });

    expect(mockOnErrorCallback).toBeCalledTimes(1);
    const onErrorCallbackParameter = mockOnErrorCallback.mock.calls[0][0];
    expect(onErrorCallbackParameter).toBeDefined();
    expect(onErrorCallbackParameter instanceof CommunicationUiError).toBe(true);
    expect(onErrorCallbackParameter.originalError).toBeDefined();
    expect(onErrorCallbackParameter.originalError.message).toBe(testErrorMessage);
    expect(onErrorCallbackParameter.errorInfo).toBeDefined;
  });

  test('WithErrorHandling should catch CommunicationUiError thrown in wrapped component and call handler', () => {
    mockOnErrorCallback.mockClear();
    act(() => {
      render(
        <WrappedComponent message={testMessage} throwCommunicationError={true} onErrorCallback={mockOnErrorCallback} />,
        container
      );
    });

    expect(mockOnErrorCallback).toBeCalledTimes(1);
    const onErrorCallbackParameter = mockOnErrorCallback.mock.calls[0][0];
    expect(onErrorCallbackParameter).toBeDefined();
    expect(onErrorCallbackParameter instanceof CommunicationUiError).toBe(true);
    expect(onErrorCallbackParameter.originalError).not.toBeDefined();
    expect(onErrorCallbackParameter.message).toBe(testErrorMessage);
    expect(onErrorCallbackParameter.errorInfo).toBeDefined;
  });

  test('WithErrorHandling should use ErrorProvider onErrorCallback method when ErrorProvider exists', () => {
    mockOnErrorCallback.mockClear();
    //mockOnErrorCallbackInProvider.mockClear();
    act(() => {
      render(
        <ErrorProvider onErrorCallback={mockOnErrorCallbackInProvider}>
          <WrappedComponent
            message={testMessage}
            throwCommunicationError={true}
            onErrorCallback={mockOnErrorCallback}
          />
        </ErrorProvider>,
        container
      );
    });

    expect(mockOnErrorCallback).toBeCalledTimes(0);
    expect(mockOnErrorCallbackInProvider).toBeCalledTimes(1);
    const onErrorCallbackParameter = mockOnErrorCallbackInProvider.mock.calls[0][0];
    expect(onErrorCallbackParameter).toBeDefined();
    expect(onErrorCallbackParameter instanceof CommunicationUiError).toBe(true);
    expect(onErrorCallbackParameter.originalError).not.toBeDefined();
    expect(onErrorCallbackParameter.message).toBe(testErrorMessage);
    expect(onErrorCallbackParameter.errorInfo).toBeDefined;
  });
});
