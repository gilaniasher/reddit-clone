import React from 'react'
import PostContainer from './components/PostContainer'

import { ApolloProvider } from '@apollo/client'
import { client } from './apollo/apollo'

const App: React.FC = () => {
  return (
		<ApolloProvider client={client}>
			<div className="flex justify-center w-screen h-screen bg-white dark:bg-gray-800 dark:text-white">
				<PostContainer />
			</div>
		</ApolloProvider>
  )
}

export default App
