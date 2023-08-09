import React from 'react'

const container = {
	padding: "10px",
}

const pictureStyle = {
	width: "200px",
	height: "200px",
	padding: "10px",
	borderRadius: "50%",
	overflow: "hidden",
	border: "1px solid black"
}

function ProfilePictureComponent({ profilePicture }) {
	return (
		<div style={container}>
			<img src={profilePicture} style={pictureStyle} alt={"ProfilePicture"} />
		</div>
	)
}

export default ProfilePictureComponent 