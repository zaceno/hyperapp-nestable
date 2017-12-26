
# hyperapp-nestable

The answer to the question: "How do I make components with local state, like React's Object components, in Hyperapp?"

Docs are a work in progress...

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
    <p class="counter">
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

The above example will do exactly what you expect, and render a functioning counter after the heading.

## Component's tagName
...TBW

## Example

See here for a (somewhat contrived) example of how it could be used:

https://codepen.io/zaceno/pen/goYOML?editors=0010
