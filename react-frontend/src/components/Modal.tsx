import React, { useState } from 'react'

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

	const initSignup = () => {
		console.log('Signing up')
	}

	return (
		<div className="flex text-center flex-col items-center">
			<h1 className="text-2xl mb-5">Sign Up</h1>
			<input
				className="p-3 border-2 rounded-lg"
				placeholder="Unique Username"
				onChange={e => setUsername(e.target.value)}
			/>
			<button onClick={initSignup} className="rounded-lg w-24 h-10 bg-cyan-300 text-black my-5">
				Sign Up!
			</button>
		</div>
	)
}

const LoginModal: React.FC = () => {
	const [modal, setModal] = useState('login')

	if (!modal)
		return <></>

	return (
		<div className="flex justify-center items-center bg-gray-500 bg-transparent w-full h-full pointer-events-none z-10 fixed">
			<div className="flex justify-center items-center w-3/5 h-2/5 bg-white text-black py-10 pointer-events-auto">
				{ modal === 'login' && <LoginForm /> }
				{ modal === 'signup' && <SignupForm /> }
			</div>
		</div>
	)
}

export default LoginModal
