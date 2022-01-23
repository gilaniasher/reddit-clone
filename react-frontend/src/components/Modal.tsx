import React, { useState } from 'react'
import { XIcon } from '@heroicons/react/outline'

import { cognitoLogin, cognitoSignup, cognitoVerify } from '../utils/cognito'

import { useMutation, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

import { CREATE_USER } from '../apollo/mutations'
import { CreateUserInput, CreateUserOutput } from '../apollo/apiTypes'

const LoginForm: React.FC = () =>  {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { setUser, setModal } = useLocalState(localStateVar)

	const initLogin = () => {
		cognitoLogin(username, password, user => {
			user.getUserAttributes((err, result) => {
				if (err || !result) {
					alert(err?.message || JSON.stringify(err))
					return
				}

				const email = result.find(x => x.Name === 'email')?.Value || ''
				setUser({ username, email, cognitoUser: user })
				setModal('')
			})
		})
	}

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl my-5">Login</h1>
			<input
				className="p-3 border-2 rounded-lg mb-4"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				className="p-3 border-2 rounded-lg"
				placeholder="Password"
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button onClick={initLogin} className="rounded-lg w-24 h-10 bg-cyan-300 text-black my-5 flex items-center justify-center">
				Log In!
			</button>
		</div>
	)
}

const SignupForm: React.FC = () => {
	const { setModal } = useLocalState(localStateVar)

	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [createUser, { error, loading, called }] = useMutation<CreateUserOutput, CreateUserInput>(CREATE_USER)

	const initSignup = () => {
		cognitoSignup(username, password, email, () => {
			// Create user in backend since cognito signup was successful
			createUser({ variables: { username, email } })

			// Clear inputs
			setUsername('')
			setEmail('')
			setPassword('')

			// Navigate to verify user page
			setModal('verify')
		})
	}

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl mb-5">Sign Up</h1>
			<p className="mb-5 text-gray-500">
				Already signed up? Click
				<button onClick={() => setModal('verify')} className="mx-1 text-blue-500">here</button>
				to verify your account.
			</p>
			<input
				className="p-3 border-2 rounded-lg mb-4"
				placeholder="Unique Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				className="p-3 border-2 rounded-lg mb-4"
				placeholder="Email"
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			<input
				className="p-3 border-2 rounded-lg"
				placeholder="Password"
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
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

const VerifyUser: React.FC = () => {
	const [username, setUsername] = useState('')
	const [code, setCode] = useState('')
	const [success, setSuccess] = useState(false)

	const initVerify = () => {
		cognitoVerify(username, code, () => setSuccess(true))
	}

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl mb-5">Verify User</h1>
			<p className="mx-7 text-gray-500">
				You should have received an email with a security code.
				Please enter your username and security code.
			</p>
			<input
				className="p-3 border-2 rounded-lg my-4"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				className="p-3 border-2 rounded-lg mb-1"
				placeholder="Security Code"
				value={code}
				onChange={e => setCode(e.target.value)}
			/>		
			<button onClick={initVerify} className="rounded-lg w-36 h-12 bg-cyan-300 text-black my-5 flex flex-row items-center justify-center">
				Verify
			</button>
			{ success && <p className="text-green-600 mb-3">Success! Now please login</p> }
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
			<div className="flex justify-center items-center w-3/5 h-max bg-white text-black pt-10 pb-4 z-20">
				<XIcon onClick={() => setModal('')} className="fixed w-10 h-10 left-3/4 top-1/3" />
				{ modal === 'login' && <LoginForm /> }
				{ modal === 'signup' && <SignupForm /> }
				{ modal === 'verify' && <VerifyUser /> }
			</div>
		</div>
	)
}

export default LoginModal
