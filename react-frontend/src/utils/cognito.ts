import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { userPoolId, appClientId } from './cognitoDetails'

/* Putting Cognito calls in frontend so that the password doesn't go to backend over internet */

const userPool = new CognitoUserPool({
	UserPoolId: userPoolId,
	ClientId: appClientId
})

export const cognitoSignup = (username: string, password: string, email: string, callback: (user: CognitoUser) => void) => {
	const attrs = [new CognitoUserAttribute({ Name: 'email', Value: email })]

	userPool.signUp(username, password, attrs, [], (err, result) => {
		if (err || !result)
			alert(err?.message || JSON.stringify(err))
		else
			callback(result.user)
	})
}

export const cognitoLogin = (username: string, password: string, callback: (user: CognitoUser) => void) => {
	const cognitoUser = new CognitoUser({ Username: username, Pool: userPool })
	const authDetails = new AuthenticationDetails({ Username: username, Password: password })

	cognitoUser.authenticateUser(authDetails, {
		onSuccess: () => callback(cognitoUser),
		onFailure: (err) => alert(err.message || JSON.stringify(err))
	})
}

export const cognitoVerify = (username: string, code: string, callback: () => void) => {
	const cognitoUser = new CognitoUser({ Username: username, Pool: userPool })

	cognitoUser.confirmRegistration(code, false, (err, result) => {
		if (err)
			alert(err.message || JSON.stringify(err))
		else
			callback()
	})
}
