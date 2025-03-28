import { useState } from 'react'
import Search from '../Search'

function Side() {
  

  return (
    <>
      <div className="bg-red-500 text-white p-4 absolute top-1 left-1">
        <h1 className='absolute top-2 left-2'>LifeHub</h1>
        <Search/>
      </div>
      
    </>
  )
}

export default Side

