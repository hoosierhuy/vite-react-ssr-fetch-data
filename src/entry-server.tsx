import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
// Local imports
import App from './App'
import { Product } from './interfaces'

export const render = (data: Product[]) => {
  return renderToString(
    <StrictMode>
      <App data={data} />
    </StrictMode>
  )
}
