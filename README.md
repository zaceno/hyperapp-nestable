
# hyperapp-nestable

A tiny wrapper around your app, that lets you embed it within other hyperapp apps, *as it were a component*. Effectively answering the age-old question: "How do I make components with local state, like React's Object components, in Hyperapp?"

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


## Component properties

You can pass props to a component (just like any other). When you do, these values are set on the state of your component, like this:

```jsx
<AvatarEditor
  userid={state.currentUser.id}
  ondone={actions.currentUser.refresh}
/>
```

This means, that when the parent app (re)renders, it will set/update state properties of the component app, causing it to rerender as well (which is exactly what you want). However, actions in the component can only touch the component's own state, and will only cause the components tree to rerender (benefits performance, although it's not likely noticable).

### Default values for props
If you need some props to have default values when no value is given, simply declare those defaults in the components initial state.

### Special properties

#### `key`

They key property is set on the component's tag (not the top node of the component's `view`). This can be very important when you have components as siblings to eachother in the virtual dom.

#### `class` & `id`

These are set on the component's tag. Mainly useful for css purposes. 

#### `oncreate`, `onupdate`, `ondestroy`

These lifecycle events are first use for managing the component, but afterward, will be called just as usual, for the component's node.

## Nestable component lifecycle

### The special action called `init`

If you add an action called `init` to your component, this action will be called when the component is first rendered. You may need this to set something up with browser API's. Another reason might be to copy "initial" values (passed as props) to "running" values.

Such as if you want your `Counter` component to accept a starting value as a prop, you don't want the actual value to change when whatever was the basis for the starting value changes. So you could implement the counter this way:

```js

const Counter = nestable(
  
  //INITIAL STATE
  {
    start: 0 // default start value
  },
  
  //ACTIONS
  {
    init: _ => state => ({value: state.start}),
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

Here is a more complex, while  somewhat contrived demonstrating many of the features mentioned here:

- passing props
- custom tag name (for styling)
- setting keys for using transitions
- initializing/uninitializing components


https://codepen.io/zaceno/pen/bajpvO?editors=0011

