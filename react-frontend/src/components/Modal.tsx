import React, { useEffect, useState } from 'react'
import { XIcon } from '@heroicons/react/outline'

import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

import { CREATE_USER } from '../apollo/mutations'
import { GET_USER } from '../apollo/queries'
import { CreateUserInput, CreateUserOutput, UserInput, UserOutput } from '../apollo/apiTypes'

const LoginForm: React.FC = () =>  {
	const [username, setUsername] = useState('')
	const [getUser, { called, loading, data, error }] = useLazyQuery<UserOutput, UserInput>(GET_USER)
	const { setUser, setModal } = useLocalState(localStateVar)

	const initLogin = () => {
		getUser({ variables: { username } })
		setUsername('')
	}

	useEffect(() => {
		if (data?.user) {
			setUser(data.user)
			setModal('')
		}
	}, [data, setModal, setUser])

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl mb-5">Login</h1>
			<input
				className="p-3 border-2 rounded-lg"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<button onClick={initLogin} className="rounded-lg w-24 h-10 bg-cyan-300 text-black my-5 flex items-center justify-center">
				{ loading && <div className="animate-spin h-5 w-5 rounded-full border-b-2 border-gray-900 mr-3" /> }
				Log In!
			</button>
			{ (error !== undefined) &&
					<p className="text-red-600 mt-4">{error.message[0].toUpperCase() + error.message.slice(1)}</p>
			}
			{ (called && !loading && error === undefined) &&
					<p className="text-green-600 mt-4">Success! Logging you in...</p>
			}
		</div>
	)
}

const SignupForm: React.FC = () => {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [createUser, { error, loading, called }] = useMutation<CreateUserOutput, CreateUserInput>(CREATE_USER)

	const initSignup = () => {
		createUser({ variables: { username, email } })
		setUsername('')
		setEmail('')
	}

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl mb-5">Sign Up</h1>
			<input
				className="p-3 border-2 rounded-lg mb-4"
				placeholder="Unique Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				className="p-3 border-2 rounded-lg"
				placeholder="Email"
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			<button onClick={initSignup} className="rounded-lg w-36 h-12 bg-cyan-300 text-black my-5 flex flex-row items-center justify-center">
				{ loading && <div className="animate-spin h-5 w-5 rounded-full border-b-2 border-gray-900 mr-3" /> }
				Sign Up!
			</button>
			{ (error !== undefined) &&
					<p className="text-red-600 mt-4 capitalize">{error.message}</p>
			}
			{ (called && !loading && error === undefined) &&
					<p className="text-green-600 mt-4">User created succesfully</p>
			}
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
			<div className="flex justify-center items-center w-3/5 h-2/5 bg-white text-black pt-10 pb-4 z-20">
				<XIcon onClick={() => setModal('')} className="fixed w-10 h-10 left-3/4 top-1/3" />
				{ modal === 'login' && <LoginForm /> }
				{ modal === 'signup' && <SignupForm /> }
			</div>
		</div>
	)
}

export default LoginModal
