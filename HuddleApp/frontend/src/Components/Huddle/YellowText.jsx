import React from 'react'

const textStyle = {
	color: "#ffc600",
}

function YellowText({ text }) {
	return (
		<span style={textStyle}>
			{text}
		</span>
	)
}

export default YellowText