# React Component Design

## Declarative, pure, unidirectional rendering

React in principle embodies the paradigm of **declarative** UI, that is instead of saying *how* UI should be constructed it defines *what* the final UI state will be. The React framework then figures out to get to that state on its own. In React, this declarative paradigm is accomplished via props that populate a JSX template and view reconciliation via a virtual DOM.

**Pure** means side-effect free: a component can be reasoned about by only looking at its input properties. If the input is the same, the next render will produce the exact same output. Pure rendering is essential to reliable and deterministic rendering behavior, without it debuggability is close to impossible.

The principle of **unidirectional** data flow is a hard-learned lesson in decades of building variants of MVC and MVVM architectures and the realization that two-way data binding is "bad". Angular 1 as the most prominent example offered two-way data binding for developer convenience but then in Angular 2 rewrote everything to use one-way data binding. The main issues with two-way data binding are high performance cost through unnecessary re-renderings and unwanted data flow loops that result in UI flicker or inconsistent state. In two-way data binding the model updates the view, but the view also updates the model. That makes it easy to introduce a loop that needs a circuit breaker in order to terminate, imagine a UI element raising a change event triggered by a user action, then updating the model, then the model writing the changed value back to the view, which for poor reasons decides to raise a change event again...

Following all three principles of declarative, pure, and unidirectional design guarantees that components are **reusable** in pretty much any existing code architecture as they stay completely decoupled from any app-level state management.

## A well-designed component

Here is a very simple React component that we will use to explain the basic component design.

```typescript
import React, { useState } from 'react';

export interface CounterProps {
  onCountChanged: (newCount: number) => void;
  initialCount: number;
}

export const Counter = (props: CounterProps): JSX.Element => {
  const { initialCount, onCountChanged } = props;
  const [ count, setCount ] = useState(initialCount);

  const changeCount = (newCount: number) => {
    if (count === newCount) return;
    setCount(newCount);
    onCountChanged(newCount);
  };

  return (
    <div>
      <button
        aria-label="Increment count"
        onClick={() => changeCount(count + 1)}
      >
        +
      </button>
      <span>{count}</span>
      <button
        aria-label="Decrement count"
        onClick={() => changeCount(count - 1)}
      >
        -
      </button>
    </div>
  );
};
```

The `Counter` React component is quite simple, it accepts an `initialValue` as a prop and renders a button for incrementing, the current count value itself, and a button for decrementing. In addition one can subscribe to value changes by supplying a function to the `onCountChanged` property.

We model all events as props where its name starts with `on*` and its type is a function of `(newValue) => void`, or if there is no value to observe `() => void`. Events only get raised when the underlying value has actually changed. A common pattern for this is shown in `changeCount`: first we check for equality with the current value and return if the new value is equal, then we commit the new value and finally we call the event handler passing the new value. Technically this isn't needed for the Counter component because we never try to set the same value, but hey this is demonstration code.

In our example, the Counter has **local state**, i.e. the `count`. Admittingly, it's awkward to not expose the count direcly and only expose it via an event. But this is only an example for the purpose of demonstration. In general, counter to some popular beliefs, local state is okay. Just make sure that it truly is local to the component and doesn't need to be exposed to the component user. If local state gets too complicated, it's a sign that the component itself does too many things and should be broken up into smaller components.

This example uses a *function component* and the `useState` hook. This produces shorter code and is functionally equivalent to a *class component* in most cases. For a comparison around these two types of component styles, see the [React documentation on hooks](https://reactjs.org/docs/hooks-state.html).

To summarize, a properly designed component takes **all** of its input data as props, renders, and raises events to handlers that are passed via `on*` props. Following this simple recipe, a component satisfies all constraints: it is **declarative**, **pure** because all data flow channels are either inbound props for rendering or outbound event props, and it is **unidirectional** because it only notifies about changes without modifying any data store directly. A perfect candidate for reusability!

## Don't use Context

## Don't use useEffect hooks

## Study on current code and refactoring
