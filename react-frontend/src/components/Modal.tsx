import React, { useState } from 'react'
import { XIcon } from '@heroicons/react/outline'

import { useMutation, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'
import { CREATE_USER } from '../apollo/mutations'

const LoginForm: React.FC = () =>  {
	const [username, setUsername] = useState('')

	const initLogin = () => {
		console.log('Logging in')
	}

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl mb-5">Login</h1>
			<input
				className="p-3 border-2 rounded-lg"
				placeholder="Username"
				onChange={e => setUsername(e.target.value)}
			/>
			<button onClick={initLogin} className="rounded-lg w-24 h-10 bg-cyan-300 text-black my-5">
				Log In!
			</button>
		</div>
	)
}

const SignupForm: React.FC = () => {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [createUser, { data, error, loading }] = useMutation(CREATE_USER)

	const initSignup = () => {
		createUser({ variables: { input: { username, email } } })
		console.log('Signup data: ', data)
	}

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl mb-5">Sign Up</h1>
			<input
				className="p-3 border-2 rounded-lg mb-4"
				placeholder="Unique Username"
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				className="p-3 border-2 rounded-lg"
				placeholder="Email"
				onChange={e => setEmail(e.target.value)}
			/>
			<button onClick={initSignup} className="rounded-lg w-36 h-12 bg-cyan-300 text-black my-5 flex flex-row items-center justify-center">
				{ loading && <div className="animate-spin h-5 w-5 rounded-full border-b-2 border-gray-900 mr-3" /> }
				Sign Up!
			</button>
			<p className="text-red-600">{JSON.stringify(error)}</p>
		</div>
	)
}

const LoginModal: React.FC = () => {
	const { modal } = useReactiveVar(localStateVar)
	const { setModal } = useLocalState(localStateVar)

	if (modal === '')
		return <></>

	return (
		<div className="flex justify-center items-center bg-gray-300 bg-opacity-40 w-full h-full z-10 fixed">
			<div className="flex justify-center items-center w-3/5 h-2/5 bg-white text-black py-10 z-20">
				<XIcon onClick={() => setModal('')} className="fixed w-10 h-10 left-3/4 top-1/3" />
				{ modal === 'login' && <LoginForm /> }
				{ modal === 'signup' && <SignupForm /> }
			</div>
		</div>
	)
}

export default LoginModal
