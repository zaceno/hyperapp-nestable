module.exports = (app, appDefFn) => props => ({
    tag: 'x-',
    children: [],
    data: {
      key: props.key,
      onupdate: el => { el.emit('parent:update', props) },
      oncreate: el => {
        var emit, appEl
        const fakeRoot = document.createElement('div')
        const appOpts = appDefFn((msg, data) => (emit && emit(msg, data)))
        appOpts.root = fakeRoot
        appOpts.events = appOpts.events || {}
        for (let n in props) {
          if (n.substr(0,2) !== 'on') continue
          appOpts.events['self:' + n.substr(2)] = (s, a, data) => props[n](data)
        }
        appOpts.events.render = [].concat(
          (appOpts.events.render || []),
          (state, actions, view) => {
            if (appEl) return
            setTimeout(_ => {
              appEl = fakeRoot.childNodes[0]
              el.parentNode.replaceChild(appEl, el)
              appEl.emit = emit
            },0)
          }
        )
        emit = app(appOpts)
        emit('parent:update', props)
      }
    }
  })