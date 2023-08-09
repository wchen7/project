import React from 'react'


import huddleLogoBlack from '../../images/huddle-logo-black.png';

const content = {
	width: "200px",
	height: "40px",
	margin: "10px",
}

function HuddleBlackComponent() {
	return (
		<div>
			<img src={huddleLogoBlack} style={content} alt="Huddle Logo" />
		</div>
	)
}

export default HuddleBlackComponent