import React from 'react'

import { useNavigate } from 'react-router-dom';

import rightBackground from '../../images/login-right-image.jpeg';

const container = {
	width: "40%",
	height: "calc(100vh - 100px)",
	borderRadius: "20px",
	marginRight: "10px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	backgroundImage: `url(${rightBackground})`,
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundOrigin: "content-box"
}

const content = {
	width: "300px",
	height: "200px",
	backdropFilter: "blur(5px)",
	borderRadius: "20px",
	display: "block",
	marginTop: "auto",
	marginBottom: "auto",
}

const header1 = {
	fontSize: "40px",
	fontWeight: "bolder",
	color: "white",
}

const header2 = {
	fontSize: "15px",
	fontWeight: "bold",
	color: "white",
}


const buttonStyle = {
	color: "white",
	backgroundColor: "rgb(255,198,0)",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
}

function LoginPageRightComponent() {
	const navigate = useNavigate();

	return (
		<div style={container}>
			<div style={content}>
				<div style={header1}>
					Join Us!
				</div>
				<div style={header2}>
					Embark on your journey of unforgettable events!
				</div>
				<br />
				<button style={buttonStyle} 
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = 'rgb(255, 215, 51)';
						}}
						onMouseLeave={(e) => {
							e.target.style.backgroundColor = 'rgb(255,198,0)';
						}}
						onClick={() => navigate('/register')}>
					Sign Up!
				</button>
			</div>
		</div>
	)
}

export default LoginPageRightComponent