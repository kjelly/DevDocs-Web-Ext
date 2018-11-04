import '@babel/polyfill'
import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://d2ddb64170f34a2ca621de47235480bc@sentry.io/1196839').install()
}

const {width, height, theme} = localStorage

if (theme === 'dark') {
  document.documentElement.classList.remove('_theme-default')
  document.documentElement.classList.add('_theme-dark')
}

document.documentElement.style.width = `${width}px`
document.documentElement.style.height = `${height}px`
document.body.style.width = `${width}px`
document.body.style.height = `${height}px`


ReactDOM.render(
  <App />,
  document.querySelector('._app')
)
