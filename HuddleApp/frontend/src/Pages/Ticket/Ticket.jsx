import React from 'react'

import LoadingComponent from '../../Components/LoadingComponent';
import makeRequest from '../../APIHelper';
import { useNavigate, useParams } from 'react-router-dom';

import TicketCard from './TicketCard';

const container = {
	padding: '20px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
}

const headerStyle = {	
	textAlign: 'center',
	borderRadius: '10px',
	width: "100%",
	padding: "10px",
	backgroundColor: 'rgb(255,198,0)',
	color: "white",
	fontWeight: "bolder",
	fontSize: "xx-large",
	margin: "20px 0",
}

const ticketCardStyle = {
	padding: '10px',
	margin: '10px',
	alignSelf: 'center',
	display: 'flex',
	flexDirection: "row",
}

function Ticket({ token }) {
	const navigate = useNavigate();
	const params = useParams();

	const [loadingState, setLoadingState] = React.useState(false)

	// Booking Data
	const [bookingData, setBookingData] = React.useState([])
	const [eventData, setEventData] = React.useState([])
	const [isActive, setIsActive] = React.useState(null)

	React.useEffect(() => {
		setLoadingState(true);
		async function getBookings() {
			const response = await makeRequest('GET', '/booking/', {}, {
				Authorization: `Bearer ${token}`,
			})
			Promise.resolve(response).then((data) => {
				if (data !== undefined && !data.error) {
					setBookingData(data.filter(event => Number(event.event) === Number(params.eventid)))
					setLoadingState(false);
				}
				else {
					navigate(`/error/${data.error}`)
				}
			})

		}
		getBookings();
		// eslint-disable-next-line
	}, []);

	React.useEffect(() => {
		async function getEventInfo() {
			const response = await makeRequest('GET', `/event/?event_id=${params.eventid}`, {}, {})
			Promise.resolve(response).then(data => {
				if (data !== undefined && !data.error) {
					setEventData(data)
					setIsActive(data.is_active)
					setLoadingState(false);
				}
			})
		}
		getEventInfo();
		const interval = setInterval(() => {
			getEventInfo()
		}, 60000);
		if (isActive === false) {
			navigate('/');
		}
		return () => {
			clearInterval(interval)
		}
		// eslint-disable-next-line
	}, [isActive])

	return (
		<>
			{
				loadingState ? <LoadingComponent /> :
					<div style={container}>
						<div style={headerStyle}>
							Ticket Page
						</div>

						{
							bookingData.length === 0 &&
							<div style={{padding: "10px"}}>
								You have no tickets yet!
							</div>
						}
						{
							bookingData.map((ticket) => {
								return (
									<div style={ticketCardStyle} key={ticket.id}>
										<TicketCard key={ticket.id} token={token} ticketId={ticket.id} ticketSeat={ticket.seat} eventData={eventData} />
									</div>
								)
							})
						}
					</div>
			}

		</>
	)
}

export default Ticket