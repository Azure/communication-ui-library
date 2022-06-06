# Do not manipulate data in base selectors

We write our selectors in a way where we clearly distinguish "base selectors" -- leaf selectors that directly manipulate `state` from the stateful clients.

Examples:
* [Calling selectors](../../packages/calling-component-bindings/src/baseSelectors.ts)
* [Chat selectors](../../packages/chat-component-bindings/src/baseSelectors.ts)

Base selectors should stay simple. They only figure out what part of `state` to return and then return it.
No modifications.

Reasons:

* Creates a clear distinction between a base selector vs more complex selector.
* Base selectors run on every React render pass. This means that any functions you call here are called on every render pass (even if they memoize their returned values, they will be called each time)
* The most insidious: You have to be very careful to memoize the returned values yourself. If you fail to memoize return values, it means that they have a snowball effect on what gets updated upstream. Other selectors don't run if their inputs don't change, but base selectors run on every single render pass. The cost of failure to memoize is much higher.

Originally discussed on [this PR](https://github.com/Azure/communication-ui-library/pull/1929#discussion_r886133010).
