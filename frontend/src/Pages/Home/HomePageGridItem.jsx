import React from 'react'

import Card from 'react-bootstrap/Card'

const container = {
	display: "flex",
	flexDirection: "column",
	width: "400px",
	margin: "10px",
	padding: "10px",
	cursor: 'pointer',
	backgroundColor: "rgba(230,179,1,0.3)",
	minHeight: "400px",
	maxHeight: "400px",
	overflow: "hidden"
}

const imageStyle = {
	minHeight: "160px",
	maxHeight: "160px",
	width: "auto",
}

const headerStyle = {
	margin: "0px",
}

const textStyle = {
	padding: "3px",
	margin: "0px",
}

const footerContainer = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
}

function HomePageGridItem(props) {
	const startTime = new Date((new Date(props.start_date)).getTime() + ((new Date(props.start_date)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: "Australia/Sydney"
	})

	const eventDescription = props.description.length > 80 ? props.description.slice(0, 79) + "..." : props.description;

	return (
		<Card style={container} onClick={props.onClick}>
			<Card.Img variant="top" style={imageStyle} src={props.image} />
			<Card.Header>
				<Card.Title style={headerStyle}>{props.name}</Card.Title>
			</Card.Header>
			<Card.Body>
				<Card.Text style={textStyle}>
					{eventDescription}
				</Card.Text>
			</Card.Body>
			<Card.Footer style={footerContainer}>
				<Card.Text style={textStyle}>{props.venue}</Card.Text>
				<Card.Text style={textStyle}>{props.tag.charAt(0).toUpperCase() + props.tag.slice(1)}</Card.Text>
				<Card.Text style={textStyle}>{startTime}</Card.Text>
			</Card.Footer>
		</Card>
	)
}

export default HomePageGridItem