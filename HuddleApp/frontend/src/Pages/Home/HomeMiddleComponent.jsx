import React from 'react'
import HuddleTextComponent from '../../Components/Huddle/HuddleTextComponent'
import pika from '../../images/pikachu.png'

const container = {
	margin: "20px"
}

const container1 = {
	backgroundColor: "#ffc600",
	borderRadius: "5px",
	margin: "20px",
	padding: "20px",
	color: "white",
	width: "400px"
}

const flexRow = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-evenly",
}

const flexCol = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
}

const flexRowStart = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "flex-start",
}

const imagestyle = {
	width: '400px',
	height: '400px'
}

function HomeMiddleComponent() {
	return (
		<div style={container}>
			<div style={flexRow}>
				<div style={flexCol}>
					<div style={flexRowStart}>
						<h4>Experience More Together:</h4>
					</div>
					<h1>
						Get into the <HuddleTextComponent />, <br />
						where every event is a touchdown!
					</h1>
					<div style={flexRow}>
						<div style={container1}>
							<h2> Log in to get personalised Recommendations! </h2>
							Huddle smart recommendation finds what your vibe is!
						</div>
					</div>
				</div>
				<img src={pika} style={imagestyle} alt="EventSlideShow"></img>
			</div>
		</div>
	)
}

export default HomeMiddleComponent