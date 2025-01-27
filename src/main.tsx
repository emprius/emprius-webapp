import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App'
import './index.css'
import 'leaflet/dist/leaflet.css'
import './i18n'

import {registerServiceWorker} from './registerSW'

// Register service worker
registerServiceWorker()

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
