import { createHashHistory } from 'history'

const history = createHashHistory()
history.listen((location) => {
  localStorage.lastPopupPath = `${location.pathname}${location.search}${location.hash}`
})

if (localStorage.lastPopupPath) {
  history.replace(localStorage.lastPopupPath)
}

export default history