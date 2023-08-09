import React from 'react'

import LoginPageLeftComponent from './LoginPageLeftComponent'
import LoginPageRightComponent from './LoginPageRightComponent';
import TopBarComponent from '../TopBar/TopBarComponent';

const container = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	textAlign: "center",
}

function Login({ token, setToken }) {
	return (
		<>
			<TopBarComponent token={token} setToken={setToken} />
			<div style={container}>
				<LoginPageLeftComponent token={token} setToken={setToken} />
				<LoginPageRightComponent />
			</div>
		</>
	)
}

export default Login