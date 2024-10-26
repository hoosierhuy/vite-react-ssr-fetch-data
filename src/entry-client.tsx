// Libraries imports
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
// local imports
import App from './App'
import { Product } from './interfaces'

let data

if (typeof window !== 'undefined') {
  data = window.__data__
  console.info('after', window, data)
}

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <App data={data} />
  </StrictMode>
)
