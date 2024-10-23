import { SetStateAction, Dispatch } from 'react'

// Local imports
import { Product, PostResponse, ProductsResponse } from './interfaces'

// GET all route. This function is called securely from the server-side to populate the initial data, and get passed to the client-side as a prop, which can be displayed in the browser even if JavaScript is turned off, or before hydration.
export const getMultipleProducts = async (): Promise<Product[]> => {
  // I'm using dummyjson.com because it's free and their images loads quickly & consistently.
  const response = await fetch('https://dummyjson.com/products?limit=5')
  const data: ProductsResponse = await response.json()

  return data.products
}

// POST route
export const postOneToApi = async (
  callBack: Dispatch<SetStateAction<PostResponse | null>>
) => {
  try {
    // I'm using jsonplaceholder because they allow POST requests to their API with appropriate responses.
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        title: 'Who is the Princess of Darkness?',
        body: 'Could it be Taylor Swift?',
        userId: 1,
      }),
    })

    const data: PostResponse = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (response.status === 201) {
      console.info('Data posted successfully!', response)
    }

    callBack(data)
  } catch (error) {
    console.error('Error posting data:', error)
    throw error
  }
}
