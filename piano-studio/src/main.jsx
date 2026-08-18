import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

// GitHub Pages 将站点部署在 /piano-studio/ 子路径下，
// 本地开发时路径没有该前缀；动态 basename 让两种环境共用一套路由。
const basename = window.location.pathname.match(/^\/piano-studio(?=\/|$)/) ? '/piano-studio' : ''

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
