// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(isConformant-v9) */
import { isConformant as baseIsConformant } from '@fluentui/react-conformance';
import type { IsConformantOptions } from '@fluentui/react-conformance';

/**
 * Wrapper around isConformant that adds/disables some tests that are specific to our usage.
 *
 * @private
 */
export function isConformant<TProps = Record<string, unknown>>(
  testInfo: Omit<IsConformantOptions<TProps>, 'componentPath' | 'displayName'> & {
    componentPath?: string;
    displayName?: string;
  }
): void {
  /* @conditional-compile-remove(isConformant-v9) */
  {
    const testFilename = require.main?.filename;

    // Assume component path is <componentName>.test.tsx
    // This may not apply to every component, if not they can override this value
    const defaultComponentPath = testFilename?.replace('.test', '');

    // Assume displayName is the same as the filename , i.e. displayName == componentName where filename = <componentName>.test.tsx
    // This may not apply to every component, if not they can override this value
    const defaultDisplayName = testFilename?.match(/\/([^/]+)\.test.tsx$/)?.[1];

    const defaultOptions: Partial<IsConformantOptions<TProps>> = {
      componentPath: testInfo.componentPath ?? defaultComponentPath,
      displayName: testInfo.displayName ?? defaultDisplayName,
      disabledTests: testInfo.disabledTests ?? defaultFluentDisabledTests
    };

    return baseIsConformant(defaultOptions, testInfo);
  }

  // Test is currently broken in stable builds.
  // isConformant complains that /preprocessed/.../<testfile> is not referenced by the source index file.
  // Applying the test only to beta until this is fixed.
  it('placeholder stable build test', async () => {
    expect(true).toBeTruthy();
  });
}

/** @private */
export const defaultFluentDisabledTests = [
  'component-has-static-classnames-object',
  'exported-top-level',
  'exports-component',
  'has-top-level-file'
];
