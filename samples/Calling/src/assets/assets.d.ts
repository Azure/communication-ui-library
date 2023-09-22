// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
