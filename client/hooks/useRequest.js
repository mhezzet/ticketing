import React, { useState } from 'react'
import axios from 'axios'

export default function useRequest({ url, methode, body, onSuccess }) {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    setErrors(null)
    try {
      const response = await axios[methode](url, { ...body, ...props })
      if (onSuccess) onSuccess(response.data)
      return response.data
    } catch (error) {
      console.log('error', error.message)
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((err) => (
              <li key={err.message}> {err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return [doRequest, errors]
}
