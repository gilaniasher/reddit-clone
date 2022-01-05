import { ReactiveVar } from '@apollo/client'
import { LocalState } from './cache'

export const useLocalState = (localStateVar: ReactiveVar<LocalState>) => {
	const setModal = (modal: 'login' | 'signup' | '') => {
		localStateVar({ ...localStateVar(), modal })
	}

	return {
		setModal
	}
}
