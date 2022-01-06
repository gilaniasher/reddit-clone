import React from 'react'

const LoadingPost: React.FC = () => {
	return (
		<div className="animate-pulse flex flex-row w-3/4 h-40 rounded-md border-4 border-gray-400 m-4 p-4">
			<div className="bg-gray-400 h-20 w-20 rounded-full" />
			<div className="ml-4 w-11/12">
				<div className="bg-gray-400 w-11/12 h-1/6 rounded-lg mb-10" />
				<div className="flex flex-row h-1/6 mb-4">
					<div className="bg-gray-400 w-6/12 rounded-lg mr-16" />
					<div className="bg-gray-400 w-4/12 rounded-lg" />
				</div>
				<div className="bg-gray-400 w-11/12 h-1/6 rounded-lg mb-4" />
			</div>
		</div>
	)
}

const LoadingShortPosts: React.FC = () => {
	return (
		<>
			<LoadingPost />
			<LoadingPost />
			<LoadingPost />
		</>
	)
}

export default LoadingShortPosts
