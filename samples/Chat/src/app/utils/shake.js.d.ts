// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

declare module 'shake.js' {
  type ShakeOptions = {
    threshold: number;
    timeout: number;
  };
  export default Shake(ShakeOptions);
}
