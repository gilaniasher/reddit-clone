import React from 'react'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

const AccountPanel: React.FC = () => {
	const { setModal } = useLocalState(localStateVar)

	return (
		<div className="flex flex-row-reverse items-center w-full h-16 bg-zinc-900 drop-shadow-lg">
			<button onClick={() => setModal('signup')} className="rounded-lg w-24 h-10 mx-4 bg-cyan-300 text-black">
				Sign Up
			</button>
			<button onClick={() => setModal('login')} className="rounded-lg w-24 h-10 bg-cyan-300 text-black">
				Login
			</button>
		</div>
	)
}

export default AccountPanel
