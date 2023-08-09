import React from 'react'

import RegisterPageLeftComponent from './RegisterPageLeftComponent'
import RegisterPageRightComponent from './RegisterPageRightComponent';
import TopBarComponent from '../TopBar/TopBarComponent';

const container = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	textAlign: "center",
}

function Register({ token, setToken }) {
	return (
		<>
			<TopBarComponent token={token} setToken={setToken} />
			<div style={container}>
				<RegisterPageLeftComponent />
				<RegisterPageRightComponent token={token} setToken={setToken} />
			</div>
		</>
	)
}

export default Register