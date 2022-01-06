import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

const AccountPanel: React.FC = () => {
	const { loggedInUser } = useReactiveVar(localStateVar)
	const { setModal } = useLocalState(localStateVar)

	return (
		<div className="grid grid-cols-3 w-full h-16 px-5 bg-zinc-900 drop-shadow-lg">
			<h1 className="flex justify-start items-center text-2xl">
				Reddit Clone
			</h1>
			<span className="flex justify-center items-center">
				{ (loggedInUser !== undefined) && 'Welcome u/' + loggedInUser.username }
			</span>
			<div className="flex justify-end items-center">
				<button onClick={() => setModal('login')} className="rounded-lg w-24 h-10 bg-cyan-300 text-black">
					Login
				</button>
				<button onClick={() => setModal('signup')} className="rounded-lg w-24 h-10 mx-4 bg-cyan-300 text-black">
					Sign Up
				</button>
			</div>
		</div>
	)
}

export default AccountPanel
