import React from 'react'
import { useNavigate } from 'react-router-dom';

import "./topBarStyling.css"

const container = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-evenly",
}

function TopBarRegisterComponent() {
	const navigate = useNavigate();
	return (
		<div style={container}>
			<button className="loginButton" onClick={() => navigate('/login')}>
				Login
			</button>
			<button className="signUpButton" onClick={() => navigate('/register')}>
				Sign Up!
			</button>
		</div>
	)
}

export default TopBarRegisterComponent