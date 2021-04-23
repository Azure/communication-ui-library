# Writing selectors/handlers

Selectors/handlers are what we provide to our customer to connect our communication ui library with our declarative client(Calling and chat).

There are several principles for writing selectors/handlers we exporting from our library, either for perf or code styles:

## Selectors package is tailored for what we have in our component package

*In order to provide a smooth experience for bridging stateful client to our component library, each feature component we provide in our component library need to be able to find the right selector to power itself.*

Feature components is defined as a component which can handled a specific part of our chat, calling function without any other component involved, it requires data from ACS and calls functions in client. 

For example,

MessageThread, SendBox are considered as feature components.

Basic, atomic, non-feature components like CommonButton or ReadReceipt not included, it's more like a UI element instead of something can work independently

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

### 1. Calculate all props as much as possible, get rid of extra data

Return props object, as a contract between selector and components, must have minimum required data and changes.
Imagine there is a selector to list item names when item count less than 10:

Don't:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { items });

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

In 'better' version, selector generates string inside, which will keep the same when items counts grows more than 10. Under this case, perf is not an issue any more.

### 2. Returning basic types is preferred 

Similar to point 1, try not to put object in props when possible, the implementation of compare function for React.memo to determine whether to re-render is comparing the reference(similar to ===), so basic types are preffered because they are always equal when in the same value:

```typescript
const obj1 = {foo: 'bar'};
const obj2 = {foo: 'bar'};
obj1 === obj2; // return false
const foo1 = 'bar';
const foo2 = 'bar';
foo1 === foo2; // return true because if it is basic type
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

When you pass return props to a pure component, whether itemCount or itemName is changed or not, re-render will happen, because you are creating a new object every time

Do:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { 
    itemCount: items.size,
    itemName: items.join(',')
});
```

return basic type directly so the compare function will always consider there is no change when values are identical.

### 3. Return same object references in array when possible 

Stateful client guarantee its immutability of state, when a single item in an array changes, it create a new instance for itself and create a new array reference, but keep all the other elements the same reference.

Reselect provides a nice memoize feature for selectors, but when an array is passed as a parameter, every element will be iterated again in the function:

Don't:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { 
    reshapedItems: items.map(item => ({
        itemType: item === 'book' ? ItemType.BOOK : ItemType.FOOD
    }))
});
```

This will generate every reshapedItem every even just one element is changed in items array, which is not perf friendly, what might be a better design is:

Do:
```typescript
const items = ['book', 'food'];
const itemSelector = createSelector([getItems], (items) => { 
    bookItems: items.filter(item => item === 'book'),
    foodItems: items.filter(item => item === 'food')
});
```
By not generating new objects, we will be able to enjoy the immutablity from state provided by stateful client, and keep the rest of unchanged element ref the same.

*What if I do need a reshape?*

In a lot of case, reshaping or generating new object is not avoidable, so don't break your own design by bothering generating new object. And under most situation, array size is limited, we don't need to worry too much about perf when we handle it properly. There might be some extreme cases like chatMessages, which could grow into a size like 10k, when this happens, doing a memoize item by item will help. Check *memoizeFnAll.ts* util function for more details
