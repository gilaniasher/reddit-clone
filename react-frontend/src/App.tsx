import React from 'react'
import ShortPost from './components/ShortPost'

const App: React.FC = () => {
  return (
    <div className="flex justify-center w-screen h-screen bg-white dark:bg-gray-800 dark:text-white">
			<ShortPost />
    </div>
  )
}

export default App
