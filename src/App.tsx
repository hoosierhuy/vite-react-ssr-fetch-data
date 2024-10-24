import { useState } from 'react'

// Local imports
import { postOneToApi } from './api'
import { Product, PostResponse } from './interfaces'
// Styles
import './App.css'

interface AppProps {
  data: Product[]
}

const App = ({ data }: AppProps) => {
  // Ensure hydration is complete before rendering
  const [jsonData, setJsonData] = useState<PostResponse | null>(null)
  const [isError, setIsError] = useState<boolean>(false)

  return (
    <div>
      <h1>React SSR App</h1>
      <div className="responsive-two-column-grid">
        <section>
          <h2>Fetching Products from API</h2>
          {data.map((product: Product) => (
            <div className="product-card" key={product.id}>
              <p>Product Name: {product.title}</p>
              <p>Brand: {product.brand}</p>
              <p data-cat>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>
                <img
                  src={product.thumbnail}
                  alt="Not an image of taylor swift"
                />
              </p>
            </div>
          ))}
        </section>
        <section>
          <h2>Post to API</h2>
          <div className="post-to-api-card">
            <p>
              You can also view the network response in the Browser's Console.
            </p>
            <button
              type="submit"
              data-tooltip="Click to test POST request"
              className="submit-btn"
              onClick={async () => {
                try {
                  await postOneToApi(setJsonData)
                } catch (err) {
                  console.error('Error rendering data in component:', err)
                  setIsError(true)
                }
              }}
            >
              Post Data Test
            </button>
          </div>
          <div>
            {jsonData && (
              <div>
                <h3>Response Data</h3>
                <p>Post ID: {jsonData.id}</p>
                <p>Title: {jsonData.title}</p>
                <p>Body: {jsonData.body}</p>
                <p>User ID: {jsonData.userId}</p>
              </div>
            )}
            {isError && (
              <div>
                <h3>Error</h3>
                <p>There was an error posting data to API.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
