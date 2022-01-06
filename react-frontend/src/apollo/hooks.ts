import { ReactiveVar } from '@apollo/client'
import { LocalState, LocalUser } from './cache'

export const useLocalState = (localStateVar: ReactiveVar<LocalState>) => {
	const setModal = (modal: 'login' | 'signup' | '') => localStateVar({ ...localStateVar(), modal })
	const setUser = (loggedInUser?: LocalUser) => localStateVar({ ...localStateVar(), loggedInUser })

	return {
		setModal,
		setUser
	}
}
