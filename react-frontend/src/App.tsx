import React from 'react'

import PostContainer from './components/PostContainer'
import AccountPanel from './components/AccountPanel'
import Modal from './components/Modal'
import LongPost from './components/LongPost'

import { ApolloProvider, useReactiveVar } from '@apollo/client'
import { client } from './apollo/apollo'
import { useLocalState } from './apollo/hooks'
import { localStateVar } from './apollo/cache'

const App: React.FC = () => {
	const { activePostId } = useReactiveVar(localStateVar)
	const { showCreatePost } = useLocalState(localStateVar)

  return (
		<ApolloProvider client={client}>
			<div className="flex flex-col w-screen h-screen bg-white dark:bg-gray-800 dark:text-white">
				<Modal />
				<AccountPanel />
				{ (activePostId === undefined)
					? <>
							<button onClick={() => showCreatePost(true)} className="rounded-lg w-32 h-10 bg-cyan-300 text-black mt-4 ml-4">
								Create Post!
							</button>
							<PostContainer />
						</>
					: <LongPost postId={activePostId} />
				}
				
			</div>
		</ApolloProvider>
  )
}

export default App
