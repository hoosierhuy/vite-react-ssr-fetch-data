// Libraries imports
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
// local imports
import App from './App'
import { Product } from './interfaces'

interface CustomWindow extends Window {
  __data__?: Product[]
}

declare let window: CustomWindow

let data: Product[] = []

if (typeof window !== 'undefined') {
  // The data variable below will contain the data that was requested server-side, and passed to the client-side as a prop, in the <App data={data} /> component.
  data = window.__data__ || []
}

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <App data={data} />
  </StrictMode>
)
