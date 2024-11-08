// Libraries imports
import { hydrateRoot } from 'react-dom/client'
// local imports
import App from './App'
import { Product } from './interfaces'

interface CustomWindow extends Window {
  __data__?: Product[]
}

declare let window: CustomWindow

let data: Product[] = []

console.info('window dunder', window.__data__)
console.info('before', data)
if (typeof window !== 'undefined') {
  // The data variable below will contain the data that was requested server-side, and passed to the client-side as a prop, in the <App data={data} /> component.
  data = window.__data__ || []
  console.info('after', data)
}

hydrateRoot(document.getElementById('root') as HTMLElement, <App data={data} />)
