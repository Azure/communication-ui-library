# Writing selectors/handlers

Selectors/handlers are what we provide to our customers to connect our communication UI library with our declarative client(Calling and Chat).

There are several principles for writing selectors/handlers that we are exporting from our library, either for perf or code styles:

## Selectors package is tailored for what we have in our component package

*In order to provide a smooth experience for bridging stateful client to our component library, each feature component we provide in our component library needs to be able to find the right selector to power itself.*

A Feature components is defined as a component which can handle a specific part of our chat and calling function without any other component involved, it requires data from ACS and calls functions in client. 

For example,

MessageThread, SendBox are considered as feature components.

Basic, atomic, non-feature components like CommonButton or ReadReceipt are not included, it's more like a UI element instead of something that can work independently.

## One selector/handlers props are able to drive one component - no multiple selectors

To align all the usages of selector, it is recommended that always use one selector for one component, here is a bad example:

Don't:
```typescript
const userProps = userSelector(state);
const messagesProps = messagesSelector(state);

<MessageThread {...userProps} {...messagesProps}>
```

This method makes userProps and messagesProps more reusable, but if this pattern is followed, it will become normal that 2 or more selectors are required for each components. That requires devs to find all these matched selectors for just one component, which is not an excellent dev experience.

Instead of doing this, we need to design a selector for MessageThread, which returns both userInfo and messages:

Do:
```typescript
const messageThreadProps = messageThreadSelector(state);

<MessageThread {...messageThreadProps}>
```

## Selector/Handlers return props name must match function type props name of component

To make code style cleaner and simple, we use Object spread operator to pass props and handlers to a component whenever it is possible, which requires all selector/handlers return type, name must matched component props. 

Do:
```typescript
const messageThreadProps = messageThreadSelector(state);

<MessageThread {...messageThreadProps}>
```

Don't:
```typescript
const messageThreadProps = messageThreadSelector(state);

// props could explode when there is 
<MessageThread user={messageThreadProps.userInfo} messages={messagesProps.chatMessages}>
```

## Selector naming convention

To make finding selector from component easier, and writing component selector easier, there are 2 naming conventions we can follow:

Base selector name: get[PropertyNameFromState]

Component Selector name: [ComponentName]Selector

## Selector implementation

A selector is a function built on top of reselect, it takes a list of functions as parameter and memoize their return value to decide if the second function provided in parameter need to be re-calculated, there are several principal we can follow when writing a selector for getting better perf:

### 1. Parameters for select must be as minimun as possible

The first array parameter of createSelector() defines an parameters array for memoizing the return value of selector. No extra data in parameters should be memoize when designing what parameters to be memoized,

Don't:
```typescript
// state = {call:{ callId: UserId, displayname: string, callParticipants: Participants }}
const getCall = (state) = > state.call;
const callInfoSelector = createSelector([getCall], (call) => ({id: call.id, name: call.displayname }));
```

In this _Don't_ example, the memoize dependencies array includes the whole call object, which will trigger a lot of undesired re-rendering when new participant join(which will update whole call object), and this is causing a perf regression.

Do:
```typescript
// state = {call:{ callId: UserId, displayname: string, callParticipants: Participants }}
const getCallId = (state) = > state.call.id;
const getDisplayName = (state) = > state.call.displayname;
const callInfoSelector = createSelector([getCallId, getDisplayName], (call) => ({id: call.id, name: call.displayname }));
```

In 'Do' code snippet, the memoize dependencies array only depends on callId and displayname, which will be only triggered by these 2 value changes. 

### 1. Calculate all props as much as possible, get rid of extra data

Return props object, as a contract between selector and components, must have minimum required data and changes.
Imagine there is a selector to list item names when item count less than 10:

Don't:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => items);

const ItemsDisplay = React.memo((items) => {
    const displayStr = items.length > 10 ? 'There are more than 10 items in the page...' : items.join(',');
    return <div class='ItemNames'> displayStr </div>;
});

```
The code snippet above will work without problem, but it will still trigger unnecessary re-render whenever items are updated, even more than 10 items, whcih could be a perf regression when the array grows huge and calculation is heavier.

Do:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { displayStrs: items.length > 10 ? 'There are more than 10 items in the page...' : items.join(',') });


const ItemsDisplay = React.memo((displayStr) => {
    return <div class='ItemNames'> displayStr </div>;
});
```

In 'Do' version, selector generates string inside, which will keep the same when items count grows more than 10. Under this case, perf is not an issue any more.

### 2. Returning basic types is preferred 

Similar to point 1, try not to put object in props when possible, the implementation of compare function for React.memo to determine whether to re-render is comparing the reference(similar to ===), so basic types are preferred because they are always equal when in the same value:

```typescript
const obj1 = {foo: 'bar'};
const obj2 = {foo: 'bar'};
obj1 === obj2; // returns false
const foo1 = 'bar';
const foo2 = 'bar';
foo1 === foo2; // returns true because comparison is between basic types
```

Here is a bad example of selector:

Don't:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { itemsInfo: {
    itemCount: items.size,
    itemName: items.join(',')
}});
```

When we pass return props to a pure component, whether itemCount or itemName is changed or not, re-render will happen, because a new object prop is created every time

Do:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { 
    itemCount: items.size,
    itemName: items.join(',')
});
```

Return only basic types directly so the compare function will always consider there is no change when values are identical.

### 3. Return same object references in array when possible 

Stateful client guarantees its immutability of state: When a single item in an array changes, it creates a new instance for itself and creates a new array reference, but keeps all the other elements the same reference.

Reselect provides a nice memoize feature for selectors, but when an array is passed as a parameter, every element will be iterated again in the function, and all elements in newly generated array will be a new instance:

Don't:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { 
    reshapedItems: items.map(item => ({
        itemType: item === 'book' ? ItemType.BOOK : ItemType.FOOD
    }))
});
```

This will generate every eshapedItem every time even just one element is changed in items array, which is not perf friendly. A better design would look like:

Do:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { 
    bookItems: items.filter(item => item === 'book'),
    foodItems: items.filter(item => item === 'food')
});
```
By not generating new objects, we will be able to enjoy the immutability from state provided by stateful client, and keep the rest of unchanged element refs the same.

*What if I do need a reshape?*

In a lot of cases, reshaping or generating new object is not avoidable, so don't break your own design by avoiding generating new objects. And under most situations, array sizes are limited, we don't need to worry too much about perf when we handle it properly later in components. There might be some extreme cases like chatMessages, which could grow into a size like 10k, when this happens, doing a memoize element by element will help. Check *memoizeFnAll.ts* util function for more details.
