import React from 'react'

const AccountPanel: React.FC = () => {
	return (
		<div className="flex flex-row-reverse items-center w-full h-16 bg-zinc-900 drop-shadow-lg">
			<button className="rounded-lg w-24 h-10 mx-4 bg-cyan-300 text-black">
				Sign Up
			</button>
			<button className="rounded-lg w-24 h-10 bg-cyan-300 text-black">
				Login
			</button>
		</div>
	)
}

export default AccountPanel
