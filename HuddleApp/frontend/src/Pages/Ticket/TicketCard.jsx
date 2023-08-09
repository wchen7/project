import React from 'react'

import { Box } from '@mui/material'

import QRCode from "react-qr-code";

import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

// Cancel
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


import { Button } from 'react-bootstrap';
import makeRequest from '../../APIHelper';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const container = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	width: "900px",
	borderRadius: "10px",
	backgroundColor: "rgb(255,198,0)",
	padding: "15px",
}

const qrStyle = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	padding: "10px",
	backgroundColor: "white",
	borderRadius: "10px",
	width: "150px",
	height: "150px",
}

const seatStyle = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	alignItems: "center",
	color: "white",
	fontWeight: "bolder",
	fontSize: "22px",
	margin: "10px 15px 10px 15px",
}

const infoStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-evenly",
	color: "black",
	fontSize: "20px",
	padding: "10px",
	backgroundColor: "white",
	borderRadius: "10px",
	width: "100%"
}

const infoStyle1 = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "10px",
}

const cancelButtonStyle = {
	padding: "10px",
	margin: "10px",
	backgroundColor: "lightcoral",
	border: 'none',
}

function TicketCard({ token, ticketId, ticketSeat, eventData, children }) {
	const navigate = useNavigate();
	const params = useParams();

	// Snackbar
	const [open, setOpen] = React.useState(false);

	const handleClick = (ticketId) => {
	  setOpen(true);
	  handleTicketCancellation(ticketId, ticketSeat)
	};
  
	const handleClose = (event, reason) => {
	  if (reason === 'clickaway') {
		return;
	  }
  
	  setOpen(false);
	};
  
	async function handleTicketCancellation(ticketId) {
		const response = await makeRequest('DELETE', `/booking/?booking_id=${ticketId}`, {}, {
			Authorization: `Bearer ${token}`,
		})

		if (response === 403 || response === 500) {
			navigate(`/error/${response}`);
		}
		else {
			navigate(`/home/${params.userType}/${params.id}`)
		}

	}
	return (
		<Box sx={container}>
			<QRCode
				style={qrStyle}
				fgColor='rgb(255,198,0)'
				value={ticketId}
			/>

			<Box style={seatStyle}>
				<Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", fontWeight: "bold" }}>
					{eventData.title}
				</Box>
				<Box>
					SEAT: {ticketSeat}
				</Box>

			</Box>

			<Box style={infoStyle}>
				<Box style={infoStyle1}>
					<Box>
						<DateRangeRoundedIcon /> Date
					</Box>
					<Box>
						<LocationOnRoundedIcon /> Venue
					</Box>
					<Box>
						<AccessTimeRoundedIcon /> Time
					</Box>
				</Box>

				<Box style={infoStyle1}>
					<Box>
						{
							new Date((new Date(eventData.start_date)).getTime() + ((new Date(eventData.start_date)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
								timeZone: "Australia/Sydney"
							})
						}
					</Box>
					<Box>
						{eventData.venue}
					</Box>
					<Box>
						{
							new Date((new Date(eventData.start_date)).getTime() + ((new Date(eventData.start_date)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
								hour: '2-digit',
								minute: '2-digit',
								timeZone: "Australia/Sydney"
							})
						}
					</Box>
				</Box>
				<Box>
					{children}
				</Box>
				<Box style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
					<Button style={cancelButtonStyle} onClick={() => handleClick(ticketId)}> Cancel Ticket </Button>
					<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
						<Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
							Your Ticket Has Been Cancelled, Look out for a Refund Email!
						</Alert>
					</Snackbar>
				</Box>
			</Box>
		</Box>
	)
}

export default TicketCard