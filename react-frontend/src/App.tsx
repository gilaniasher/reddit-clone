import React from 'react'
import PostContainer from './components/PostContainer'
import AccountPanel from './components/AccountPanel'
import Modal from './components/Modal'

import { ApolloProvider } from '@apollo/client'
import { client } from './apollo/apollo'

const App: React.FC = () => {
  return (
		<ApolloProvider client={client}>
			<div className="flex flex-col w-screen h-screen bg-white dark:bg-gray-800 dark:text-white">
				<AccountPanel />
				<PostContainer />
				<Modal />
			</div>
		</ApolloProvider>
  )
}

export default App
