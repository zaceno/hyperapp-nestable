export default function (state, actions, view, tagname) {
  tagname = tagname || 'x-'
  actions._$ = function (x) { return x }
  return function (props) {
      return h('x-', {
          oncreate: function (el) {
              var _actions = app(state, actions, view, el)
              el._$ = _actions._$
              el._$(props)
              if (_actions.init) _actions.init()
              el._$$ = _actions.uninit
          },
          onupdate: function (el) {
              el._$(props)
          },
          onremove: function (el) {
              if (el._$$) el._$$()
          }
      })
  }
}