import React from 'react'
import { useParams } from 'react-router-dom';

import errorGif from '../images/error.gif';

const container = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100vh',
	width: '100vw',
	textAlign: "center",
}

const errorText = {
	fontSize: "xx-large",
	fontWeight: "800",
	color: "#f25139"
}

function Error() {
	const params = useParams();
	const errorCode = params.errorCode
	const [errorMessage, setErrorMessage] = React.useState('');

	React.useEffect(() => {
		if (errorCode === "400") {
			// Input Error
			setErrorMessage("There has been an Input Error (400)")
		}
		else if (errorCode === "403") {
			// Access Error
			setErrorMessage("There has been an Access Error (403)")
		}
		else if (errorCode === "404") {
			// File Not Found Error
			setErrorMessage("There has been a File Not Found Error (404)")
		}
		else if (errorCode === "500") {
			// Internal Server Error
			setErrorMessage("There has been an Internal Server Error (500)")
		}
		else if (errorCode === "503") {
			// Database Error
			setErrorMessage("There has been a Database Error (503)")
		}
		else {
			// Uncaught Errors
			setErrorMessage(`Uncaught Error (${errorCode})`)
		}
	}, [errorCode])


	return (
		<>
			<div style={container}>
				<span style={errorText}>
					{errorMessage}
				</span>
				<img src={errorGif} alt="error" />
			</div>
		</>

	)
}

export default Error