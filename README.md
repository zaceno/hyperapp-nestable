# hyperap-nestable

This function lets you define components you can use in your views, which are
stateful, i e, they embed their own hyperapp app. 

The idea is to let you build apps according to what I, for lack of better terms,
call the "Vue architecture" -- where your app is built up of a tree of stateful
components. Parent components communicate with children by the props passed in
the view. Children may communicate back to parents via events the parents listen
to.

Fair warning: It is not yet clear to me, that there is any real benefit to
the "Vue architecture" over the Elm-architecture. If there are any cases where
this approach is advisable, it may be when creating small, reusable ui elements
which need to manage state related to interactions (like for instance, a radio
knob, a vertical slider, a datepicker, et c)

... I was just curious if this was possible, without too much trouble.
Apparently it is :)

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

## Define Stateful COmponents (nestable apps)

Define a component, by passing hyperapp's `app` as first argument into `nestable`,
and as the second argument an app-definition function.

The function is similar to how mixins defined in hyperapp, in that it recieves an
emit and returns the definition. Unlike mixins, however, you can use all the
regular app options (mixins, view, et c)

```jsx
    const {h, app} = hyperapp
    const nestable = require('hyperapp-nestable')

    const Counter = nestable(app, emit => ({
      state: {...},
      actions: {...},
      events: {...},
      mixins: [...],
      view: (state, actions) => ...
    }))
```

## Embed components

In the view of the main app, or a parent component, render the previously
defined component:
    
```jsx
    app({
      ...
      view: (state, actions) => <main>
        <Counter key="mycounter" value={state.counterValue} />
      </main>
    })
```

Note: it is important that stateful components are keyed (unique keys for siblings!)

## Communication between apps ##


### Parent-to-child ###

Parents communicate with children via setting the component props. Every time
the parent is rendered (including the first time), the child component app will
recieve the `parent:update` event, with the current props as third argument to
the event handler. The child should implement some sort of handling of these props in that event.

```jsx
    const Counter = nestable(app, emit =>({
        ...
        actions: {
            setMin: ...,
            setMax: ...,
        },
        events: {
            ...,
            'parent:props': (state, actions, props) => {
                actions.setMax(props.max)
                actions.setMin(props.min)
            }
        }
    }))
```

### Child-to-parent communication ###

Props passed to the child beginning with `on` are special. If, in the parent
view, there is a function bound to `onfoo`, then this function will be called when the child emits `emit('self:foo', data)`.

```jsx
    const Counter = nestable(app, emit => ({
        actions: {
            increment: (state, actions) => update => {
                update({value: state.value + 1})
                emit('self:changed', state.value)
            }
        }
    }))

    ...

    app({
        ...
        actions: {
            ...,
            counterChanged: (state, actions, newVal) => ...
        }
        view: (state, actions) => <main>
            <Counter key="counter" onchange={val => actions.counterChanged(val)} />
        </main>
    })

```

**Caution!** When syncing copies of a value between parent and child, be *very careful*
you don't accidentally create an infinte loop! It's a good idea to use
hyperapp's `update` event to cancel updare & render if the state hasn't
changed.

### Beyond parent-child communication ###

Communication between separate nestable apps, can be achieved by setting up a global event hub, and passing this hub to all children via props. It is up to you to implement such a hub though.