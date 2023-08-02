// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(version-2) */
export * from './public.index';

// Internal only exports
/* @conditional-compile-remove(version-2) */
export * from './ExampleComponent';
/* @conditional-compile-remove(version-2) */
export * from './SendBox';

/** Stable build must export something for rollup. Putting in a placeholder. @internal */
export const _stable_build_placeholder = 0;
