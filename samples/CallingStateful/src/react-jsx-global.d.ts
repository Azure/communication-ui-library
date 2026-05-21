// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// React 19's @types/react scopes the JSX namespace under `React.JSX` and no longer
// declares a global `JSX` namespace. This restores the global namespace so existing
// `JSX.Element` references throughout the codebase continue to resolve.
import 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type ElementType = React.JSX.ElementType;
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
    type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
    type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}
