# Why Immutability Is Important In React

https://reactjs.org/tutorial/tutorial.html#why-immutability-is-important

## Two Ways To Change Data

### Change Data With Mutation

mutate data directly

```js
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}

```

### Change Data Without Mutation

replace data with a new copy

```js
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax, you can write:
// var newPlayer = {...player, score: 2};
```

## Same Result But Immutability Has Benefits

### Complex Features Become Simple

time travel feature and undo redo feature can be done by reusing the previous state.

### Detecting Changes

Detecting changes in immutable objects is considerably easier.
If the immutable object that is being referenced is different than the previous one,
then the object has changed. Mutable object needs to be compared with its copies.

```js
if (this.props.color !== nextProps.color) {
    return true;
}
if (this.state.count !== nextState.count) {
    return true;
}
return false;
```

### Determining When to Re-Render in React

Immutable object can help React to optimize performance
by only re-rendering components when changes have been detected.

for example, `shouldComponentUpdate()` or `React.PureComponet`

```js
shouldComponentUpdate(nextProps, nextState) {
if (this.props.color !== nextProps.color) {
    return true;
}
if (this.state.count !== nextState.count) {
    return true;
}
return false;
}
```

#sampleblog #goodwriting #thinking #english
