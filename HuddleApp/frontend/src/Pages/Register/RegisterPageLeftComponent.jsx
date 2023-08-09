import React from 'react'

import { useNavigate } from 'react-router-dom';
import leftBackground from '../../images/register-left-image.jpg';

const container = {
	width: "40%",
	height: "calc(100vh - 100px)",
	borderRadius: "7px",
	marginLeft: "10px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	backgroundImage: `url(${leftBackground})`,
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundOrigin: "content-box"
}

const content = {
	width: "300px",
	backdropFilter: "blur(10px)",
	borderRadius: "20px",
	display: "block",
	marginTop: "auto",
	marginBottom: "auto"
}

const header1 = {
	fontSize: "40px",
	fontWeight: "bolder",
	color: "#2C2D2D"
}

const header2 = {
	paddingTop: "5%",
	fontSize: "20px",
	fontWeight: "bold",
	color: "#2C2D2D"
}

const buttonStyle = {
	color: "white",
	backgroundColor: "rgb(255,198,0)",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
}


function RegisterPageLeftComponent() {
	const navigate = useNavigate();

	return (
		<div style={container}>
			<div style={content}>
				<div style={header1}>
					Welcome <br />Back
				</div>
				<div style={header2}>
					Dive into more experiences!
				</div>
				<br />
				<button style={buttonStyle} 
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = 'rgb(255, 215, 51)';
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = 'rgb(255,198,0)';
					}}
					onClick={() => navigate('/login')}>
					Sign In!
				</button>
			</div>
		</div>
	)
}

export default RegisterPageLeftComponent