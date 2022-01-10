import React, { useEffect, useState } from 'react'

import { useMutation, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

import { CREATE_POST } from '../apollo/mutations'
import { CreatePostInput, CreatePostOutput } from '../apollo/apiTypes'

const CreatePost: React.FC = () => {
	const { loggedInUser } = useReactiveVar(localStateVar)
	const { showCreatePost, triggerReload } = useLocalState(localStateVar)
	const [createPost, { data, error }] = useMutation<CreatePostOutput, CreatePostInput>(CREATE_POST)

	const [subreddit, setSubreddit] = useState('')
	const [headerText, setHeaderText] = useState('')
	const [subText, setSubText] = useState('')
	const [createError, setCreateError] = useState('')

	const create = () => {
		if (loggedInUser === undefined) {
			setCreateError('You need to be logged in to post!')
			return
		}
		
		createPost({ variables: { subreddit, headerText, subText, poster: loggedInUser.username } })
	}

	const cancel = () => {
		setSubreddit('')
		setHeaderText('')
		setSubText('')
		setCreateError('')
		showCreatePost(false)
	}

	useEffect(() => {
		if (error)
			setCreateError(error.message)
	}, [error])

	useEffect(() => {
		if (!data)
			return

		triggerReload(true)
		showCreatePost(false)
	}, [data])

	return (
		<div className="flex flex-col justify-between w-3/4 h-80 rounded-md border-4 border-gray-400 m-4 p-4">
			<div className="flex flex-row">
				<input
					className="p-3 rounded-lg bg-gray-800 border-2 border-gray-400 mb-2 mr-5"
					placeholder="Title"
					value={headerText}
					onChange={e => setHeaderText(e.target.value)}
				/>
				<p className="self-center text-2xl mr-1 mb-2">r/</p>	
				<input
					className="p-3 rounded-lg bg-gray-800 border-2 border-gray-400 mb-2"
					placeholder="Subreddit"
					value={subreddit}
					onChange={e => setSubreddit(e.target.value)}
				/>
			</div>
			<textarea
				className="p-4 h-40 rounded-md bg-gray-800 border-2 border-gray-400"
				placeholder="Post Content"
				value={subText}
				onChange={e => setSubText(e.target.value)}
			/>
			<div className="flex flex-row justify-center">
				<button onClick={create} className="rounded-lg w-28 h-10 bg-cyan-300 text-black self-center mt-4 mr-4">Create Post!</button>
				<button onClick={cancel} className="rounded-lg w-28 h-10 bg-red-400 text-black self-center mt-4">Cancel</button>
			</div>
			<p className="text-red-600 mt-4 self-center">{createError}</p>
		</div>
	)
}

export default CreatePost
