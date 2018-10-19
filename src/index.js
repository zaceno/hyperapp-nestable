import {h, app} from 'hyperapp'

export default 
function nestable (state, actions, view, tagname) {
    actions._$r = function () {return {}}
    return function (props, children) {
        return h(tagname || 'x-', {
            key: props.key,
            id: props.id,
            class: props.class,
            oncreate: function (el) {
                var wired = app(
                    state,
                    actions,
                    function (s, a) {
                        var v = view(s, a)
                        if (typeof v === 'function') v = v(el._$p, el._$c)
                        return v
                    },
                    el
                )
                el._$p = props
                el._$c = children
                el._$r = wired._$r
                el._$u = wired.uninit
                wired.init && wired.init(props)
                props.oncreate && props.oncreate(el)
            },
            onupdate: function (el) {
                el._$p = props
                el._$c = children
                el._$r()
                props.onupdate && props.onupdate(el)
            },
            ondestroy: function (el) {
                el._$u && el._$u()
            },
            onremove: function (el, done) {
               if (!props.onremove) return done()

               props.onremove(el, done)
            }
        })
    }    
}

