import React from 'react'

import CircularProgress from '@mui/material/CircularProgress';

const container = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
}

function LoadingComponent() {
	return (
		<div style={container}>
			<CircularProgress size={150} />
		</div>
	)
}

export default LoadingComponent