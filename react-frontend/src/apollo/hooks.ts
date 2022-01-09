import { ReactiveVar } from '@apollo/client'
import { LocalState, LocalUser } from './cache'

export const useLocalState = (localStateVar: ReactiveVar<LocalState>) => {
	const setModal = (modal: 'login' | 'signup' | '') => localStateVar({ ...localStateVar(), modal })
	const setUser = (loggedInUser?: LocalUser) => localStateVar({ ...localStateVar(), loggedInUser })
	const showCreatePost = (visible: boolean) => localStateVar({ ...localStateVar(), showCreatePost: visible })
	const triggerReload = (reloadPosts: boolean) => localStateVar({ ...localStateVar(), reloadPosts })
	const setActivePost = (activePostId?: string) => localStateVar({ ...localStateVar(), activePostId })

	return {
		setModal,
		setUser,
		showCreatePost,
		triggerReload,
		setActivePost
	}
}
