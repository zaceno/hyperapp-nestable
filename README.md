
# hyperapp-nestable

A tiny wrapper around your app, that lets you embed it within other hyperapp apps, *as if it were a component*. Effectively answering the age-old question: "How do I make components with local state, like React's Object components, in Hyperapp?"

## Install

### ...using npm

```
npm install hyperapp-nestable
```

And `require` (or `import`, if you're using es6 modules) in your project:

```js

const nestable = require('hyperapp-nestable')

```

### ... or include in HTML from CDN

Add this to the `<head>` of your page:

```html

<script src="https://unpkg.com/hyperapp-nestable"></script>

```

this will export `nestable` in the global scope.

## Basic Usage

Use the `nestable` function in the following way:

```
var ComponentName = nestable(initialState, actions, view)
```

... which is to say, just like you start a normal Hyperapp-app. The difference is, you don't provide a container. That is becuase instead of attaching an app to the dom immediately, `nestable` returns a component-function which will start a hyperapp app, attached to the DOM, when and where the component is rendered.

An example:

```jsx

/*
  Define a stateful Counter component
*/
const Counter = nestable(
  //STATE
  {value: 0},
  
  //ACTIONS
  {
    up: _ => state => ({value: state.value + 1}),
    down: _ => state => ({value: state.value - 1}),
  },
  
  //VIEW
  (state, actions) => (
    <p>
      <button onclick={actions.down}>-</button>
      {state.value}
      <button onclick={actions.up}>+</button>
    </p>
  )
)


/*
  Use the Counter-component in an app
*/

app({}, {}, _ => (
  <div class="app">
    <h1>Look, a counter:</h1>
    <Counter />
  </div>
), document.body)

```

([Live example](https://codepen.io/zaceno/pen/eygwdV))

The above example will do exactly what you expect, and render a functioning counter after the heading.

## Component's Tagname

If you look at the html of the app example above, you'll see it looks like:

```html
<div class="app">
  <h1>Look, a counter:</h1>
  <x->
    <p class="counter">
      <button>-</button>
      0
      <button>+</button>
    </p>
  </x->
</div>
```

Notice the `<x->` element in there. That element corresponds to the vnode in the main app's view, where the counter's view is rendered. It's necessary as a means to "connect" the two vtrees. But the tag name `x-` is just the default. If you want it to be something more descriptive, we might call it `counter-` (the dash on the end is just to make it clear it's not a real html element). You would do that by giving it as the fourth argument to the `nestable` function:

```js
const Counter = nestable(
  initialCounterState,
  counterActions,
  counterView,
  'counter-'
)
```

You could make the tag a regular html tag such as `div` or `section` too. You may want that for CSS-reasons.


## Component properties & children

You can pass props and children to a component (just like any other). In order for your view to be aware of them, return a component from your view.

```jsx
const MyComponent = nestable(
  //STATE
  {...},

  //ACTIONS
  {...},

  //VIEW
  (state, actions) => (props, children) => (
    <div class={props.class}>
      <h1>{state.foo}</h1>
      {children}
      <button onclick={actions.bar}>Go</button>
    </
  )
)

```

### Special properties

#### `key`

They key property is set on the component's tag (not the top node of the component's `view`). This can be very important when you have components as siblings to eachother in the virtual dom.

#### `class` & `id`

These are set on the component's tag. Mainly useful for css purposes. 

#### `oncreate`, `onupdate`, `ondestroy`

These lifecycle events are first use for managing the component, but afterward, will be called just as usual, for the component's node.

## Nestable component lifecycle

### The special action called `init`

If you add an action called `init` to your component, this action will be called when the component is first rendered. It will be passed the component's props as its first argument.

Such as if you want your `Counter` component to accept a starting value as a prop, you don't want the actual value to change when whatever was the basis for the starting value changes. So you could implement the counter this way:

```js

const Counter = nestable(
  
  //INITIAL STATE
  { value: 0 },
  
  //ACTIONS
  {
    init: props => ({value: props.initial || 0}),
    up: _ => state => ({value: state.value + 1}),
    down: _ => state => ({value: state.value - 1}),
  },
  
  //VIEW
  ...
)
```

Now, the counter will start at the value it is given the first time it's rendered, but when that value changes, it will not affect the value of the counter.

Here's a [live example](https://codepen.io/zaceno/pen/ypMLPp)

### The special action called `uninit`

Corresponding to `init`, if you need something done when the component is destroyed, you can put in an action named `uninit`

Here is a more complex, while  somewhat contrived demonstrating many of the features mentioned here.

https://codepen.io/zaceno/pen/bajpvO?editors=0011

