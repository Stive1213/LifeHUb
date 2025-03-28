import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-red-500 text-white p-4 text-center">
        Hello World
      </div>
    </>
  )
}

export default App

