import {h, app} from 'hyperapp'

export default function (state, actions, view, tagname) {

    actions._$ = function (x) { return x }

    return function (props) {
        return h(tagname || 'x-', {

            key:    props.key,
            class:  props.class,
            id:     props.id,

            oncreate: function (el) {
                var _actions = app(state, actions, view, el)
                el._$ = _actions._$
                el._$$ = _actions.uninit
                el._$(props)
                if (_actions.init) _actions.init()
                if (props.oncreate) props.oncreate(el)
            },

            onupdate: function (el, oldProps) {
                el._$(props)
                if (props.onupdate) props.onupdate(el, oldProps)
            },

            ondestroy: function (el) {
                if (el._$$) el._$$()
                if (props.ondestroy) props.ondestroy(el)
            }
        })
    }
}