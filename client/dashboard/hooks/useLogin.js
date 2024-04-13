import { useState } from 'react'
export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:5000/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      console.log("> ",JSON.stringify(json.userId).toString());
      
      localStorage.setItem('email', JSON.stringify(json.email));
      localStorage.setItem('role', JSON.stringify(json.role));
      localStorage.setItem('token', JSON.stringify(json.token));
      localStorage.setItem('userId', JSON.stringify(json.userId).toString());

      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}