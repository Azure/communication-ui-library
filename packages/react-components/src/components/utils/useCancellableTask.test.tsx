// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { act, render } from '@testing-library/react';
import { Cancellable, useCancellableTask } from './useCancellableTask';
import React, { useEffect, useRef, useState } from 'react';

describe('cancellable task', () => {
  it('completes triggered action if not cancelled', async () => {
    const marker = new Marker();

    function Component(): JSX.Element {
      const [trigger] = useCancellableTask();
      trigger(async (cancellable: Cancellable) => {
        await blockMomentarily();
        if (!cancellable.cancelled) {
          marker.set();
        }
      });
      // Non-trivial return so React runtime keeps us mounted.
      return <h1>Hello World</h1>;
    }

    render(<Component />);
    await expect(marker.waitForSet(1000)).resolves.toBeTruthy();
  });

  it('aborts triggered action if cancelled', async () => {
    const marker = new Marker();

    function Component(): JSX.Element {
      const [trigger, cancel] = useCancellableTask();
      trigger(async (cancellable: Cancellable) => {
        await blockMomentarily();
        if (cancellable.cancelled) {
          marker.set();
        }
      });

      // Cancel immediately. You'd never do this in a real component.
      cancel();

      // Non-trivial return so React runtime keeps us mounted.
      return <h1>Hello World</h1>;
    }

    render(<Component />);
    await expect(marker.waitForSet(1000)).resolves.toBeTruthy();
  });

  it('aborts triggered action if retriggered', async () => {
    const marker = new Marker();

    function Component(): JSX.Element {
      const [trigger] = useCancellableTask();
      trigger(async (cancellable: Cancellable) => {
        await blockMomentarily();
        if (cancellable.cancelled) {
          marker.set();
        }
      });

      // Trigger again immediately. You'd never do this in a real component.
      trigger(async () => {
        // This one does not set the marker.
      });

      // Non-trivial return so React runtime keeps us mounted.
      return <h1>Hello World</h1>;
    }

    render(<Component />);
    await expect(marker.waitForSet(1000)).resolves.toBeTruthy();
  });

  it('aborts triggered action on component unmount', async () => {
    const marker = new Marker();

    function Component(): JSX.Element {
      const [trigger] = useCancellableTask();
      trigger(async (cancellable: Cancellable) => {
        await blockMomentarily();
        if (cancellable.cancelled) {
          marker.set();
        }
      });
      // Non-trivial return so React runtime keeps us mounted.
      return <h1>Hello World</h1>;
    }

    function Wrapper(): JSX.Element {
      const [showComponent, setShowComponent] = useState(true);
      // This useEffect runs immediately after the first render.
      // Component is unmounted in the subsequent render pass.
      useEffect(() => {
        setShowComponent(false);
      }, []);
      return showComponent ? <Component /> : <h1>Bye bye!</h1>;
    }

    render(<Wrapper />);
    await expect(marker.waitForSet(1000)).resolves.toBeTruthy();
  });

  it('returns referentially stable objects', async () => {
    const marker = new Marker();

    function Component(): JSX.Element {
      const [secondRender, setSecondRender] = useState(false);
      const [trigger, cancel] = useCancellableTask();
      const cachedTrigger = useRef(trigger);
      const cachedCancel = useRef(cancel);

      trigger(async () => {
        await blockMomentarily();
        // Causes a second render pass.
        setSecondRender(true);
      });

      if (secondRender && trigger === cachedTrigger.current && cancel === cachedCancel.current) {
        marker.set();
      }

      // Non-trivial return so React runtime keeps us mounted.
      return <h1>Hello World</h1>;
    }

    render(<Component />);

    await act(async () => {
      // Wait within the `act` block so second render pass can complete.
      await marker.waitForSet(1000);
    });

    // We already waited in the `act` block above, so check quickly.
    await expect(marker.waitForSet(1)).resolves.toBeTruthy();
  });
});

/**
 * A helper for testing async code paths.
 *
 * Call {@link Marker.set} in the code path you want to make sure is hit.
 *
 * Wait for the code path to be hit in the test by calling
 * {@link Marker.waitForSet} with an appropriately large timeout.
 *
 * @private
 */
class Marker {
  private _marked = false;
  set(): void {
    this._marked = true;
  }
  async waitForSet(timeoutMillisecond: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this._marked) {
        resolve(true);
        return;
      }

      const deadline = Date.now() + timeoutMillisecond;
      // The setInterval runs in a very tight loop (1ms delay).
      // This ensures that tests finish fast when they succeed.
      // The drawback is that the tests will eat up a lot of CPU when they fail.
      const handle = setInterval(() => {
        if (this._marked) {
          resolve(true);
          clearInterval(handle);
          return;
        }
        if (Date.now() > deadline) {
          resolve(false);
          clearInterval(handle);
          return;
        }
      }, 1);
    });
  }
}

async function blockMomentarily(): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    });
  });
}
