import { useState } from 'react'
import './App.css'
import Side from './components/dashboared/Side'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=" text-white p-4 ">
        Hello World
        <Side />
      </div>
      
    </>
  )
}

export default App

