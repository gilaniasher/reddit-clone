import React from 'react'
import PostContainer from './components/PostContainer'

const App: React.FC = () => {
  return (
    <div className="flex justify-center w-screen h-screen bg-white dark:bg-gray-800 dark:text-white">
			<PostContainer />
    </div>
  )
}

export default App
