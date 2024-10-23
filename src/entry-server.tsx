import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
// Local imports
import App from './App'
import { Product } from './interfaces'

// Data can be accessed from the data parameter, which is passed to the render function.
export const render = (data: Product[]): string => {
  return renderToString(
    <StrictMode>
      <App data={data} />
    </StrictMode>
  )
}
