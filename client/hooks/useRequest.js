import React, { useState } from 'react'
import axios from 'axios'

export default function useRequest({ url, methode, body, onSuccess }) {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    setErrors(null)
    try {
      const response = await axios[methode](url, body)
      if (onSuccess) onSuccess()
      return response.data
    } catch (error) {
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
