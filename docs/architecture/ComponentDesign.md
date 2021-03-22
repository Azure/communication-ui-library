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

In our example, the Counter has **local state**, i.e. the `count`. Admittedly, it's awkward to not expose the count directly and only expose it via an event. But this is only an example for the purpose of demonstration. In general, contrary to some popular beliefs, local state is okay. Just make sure that it truly is local to the component and doesn't need to be exposed to the component user. If local state gets too complicated, it's a sign that the component itself does too many things and should be broken up into smaller components.

This example uses a *function component* and the `useState` hook. This produces shorter code and is functionally equivalent to a *class component* in most cases. For a comparison around these two types of component styles, see the [React documentation on hooks](https://reactjs.org/docs/hooks-state.html).

To summarize, a properly designed component takes **all** of its input data as props, renders, and raises events to handlers that are passed via `on*` props. Following this simple recipe, a component satisfies all constraints: it is **declarative**, **pure** because all data flow channels are either inbound props for rendering or outbound event props, and it is **unidirectional** because it only notifies about changes without modifying any data store directly. A perfect candidate for reusability!

## Be deliberate in naming

In this declarative, pure, unidirectional world it is very important how we name properties. And their name exposes how we think about data flow and if we really grasped the different responsibilities of the architecture.

A UI component *receives* data and *notifies* about changes. It never tells any other part of the system what to do. It's only a meek informant about its own local state changes.

A good example that we encountered was a component with a `sendReadReceipt` property.

The component demands that whoever supplies a lambda to that prop must do exactly as it's told, which is to send a read receipt. But what if the component user doesn't want to send a read receipt but instead implementing something completely different? Of course, they could just pass a lambda that doesn't care and does something different. But that's highly confusing and `sendReadReceipt` makes it sound like there is no flexibility and the only lambda allowed is the one that will do as the name says.

A much better way is to remind ourselves that components are meek informants and don't demand but only notify.

We don't have to change code logic to fix the component to fit into our declarative, pure, unidirectional world. It's enough to rename the property. Naming it `onReadHorizonChanged` makes it clear what happened: the user has scrolled and has read new messages. Now the subscriber to `onReadHorizonChanged` has the information they need to determine what action they want to take. For example, they can choose to send a read receipt.

See how nothing really changed in the logic? All we did is rename a property but it changed everything to how we think about the role of a component and how it fits into the larger system that it is a part of. A component can only reason about itself, it knows nothing about anything outside of itself and it doesn't make demands, it only informs and obeys.

## Don't use React Context

[Context](https://reactjs.org/docs/context.html) is a mechanism to allow components access to state without having to rely on props passing. It is primarily a convenience to avoid multi-layer *"prop drilling"*.

While context can be a powerful tool in an *application* it goes against many of the principles for a reusable *library*.

Example:

```html
<MyContext.Provider value={contextValue}>
  <A>
    <B>
       <MyComponent />
    <B>
    <B>
      <C/>
    <B>
  </A>
</MyContext.Provider>
```

* It is not clear what the contract of `MyComponent` is, all props are hidden away.
* The data flow direction is inverted, instead of pushing data to the `MyComponent`, the component is actively pulling data.
* `MyComponent` has a dependency on `MyContext` appearing somewhere as a parent in the visual tree. By definition `MyComponent` is not reusable then, because it makes assumptions about the visual layout of the app that uses it and it cannot be used without `MyContext`.
* Usually multiple components share the same context. If `MyContext` holds state not only for `MyComponent` but also for `C`, then `MyContext` is indirectly coupled to `C`.

In summary, `MyComponent` cannot be used without `MyContext`, and `MyContext` is the god class for other components that have nothing to do with `MyComponent` and will keep growing bigger as more wanna-be independent components get added.

By the way, the React documentation isn't shy about [calling out the same problems](https://reactjs.org/docs/context.html#before-you-use-context):

> **Before You Use Context**
>
> Context is primarily used when some data needs to be accessible by many components at different nesting levels. Apply it sparingly because it makes component reuse more difficult.

There are few notable exceptions where Context is okay:

* As a provider for cross-cutting concerns such as Theming or Localization
* For *composites* where the Context is entirely internal and only used as a mechanism to avoid prop drilling for deeper nested components.

In the *composite* case, the composite user would not instantiate their own context but context is entirely hidden from them and just an implementation detail.

Even then, context should not be the first approach. There are multiple more basic techniques that solve prop drilling and even lead to overall better decoupled component design. The most prominent is to pass React components as props or children directly. The passed component does not change when state changes, which avoids unnecessary re-renderings. On top, it makes it explicit that other components are merely containers and don't even need to know about how to render their children.

There are great articles explaining this principle of component passing aka lifting content up.

[React docs on component composition](https://reactjs.org/docs/composition-vs-inheritance.html)

[Kent C. Dodd's "One simple trick to optimize React re-renders"](https://kentcdodds.com/blog/optimize-react-re-renders)

[Dan Abramov's  "Before you memo()"](https://overreacted.io/before-you-memo/#solution-2-lift-content-up)

## Don't use hooks for side-effects or access to global state

The [`useEffect`](https://reactjs.org/docs/hooks-effect.html) hook is a natural replacement for `componentDidMount`, `componentDidUpdate` and `componentWillUnmount` in React class components. As such it can be very useful to hook into the component lifecycle with function components.

However, `useEffect` is tempting to use it so that a component can pull state from other places instead of receiving it via props or to directly issue a command that changes the surrounding system.

Both, polling global state and side effects, are direct violations of pure, declarative and unidirectional principles. Don't do it, they make components no longer reusable.
