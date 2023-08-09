import React from 'react'

import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import makeRequest from '../../APIHelper';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import emptyHost from '../../images/emptyHostBanner.jpg'
import emptyCustomer from '../../images/emptyCustomerBanner.jpg'
import Stack from '@mui/material/Stack';

const container = {
	padding: "20px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	textAlign: "center",
	alignSelf: "center",
}

const defaultHostContainer = {
	width: '80vw',
	height: '60vh',
	backgroundImage: `url(${emptyHost})`,
	backgroundPosition: 'center center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'fill',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	borderRadius: '15px',
}

const defaultCustomerContainer = {
	width: '80vw',
	height: '60vh',
	backgroundImage: `url(${emptyCustomer})`,
	backgroundPosition: 'center center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'fill',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	borderRadius: '15px',
}

const defaultButton = {
	color: "white",
	backgroundColor: "rgb(255,198,0)",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
	fontSize: "20px",
	fontWeight: "bolder",
	margin: "10px",
}

const carouselText = {
	position: "absolute",
	left: "10%",
	bottom: "10%",
	margin: "5px",
	backgroundColor: "rgb(61,150,251)",
	borderRadius: "50px",
	fontSize: "20px",
	fontWeight: "bolder",
	color: "white",
	padding: "10px 20px 10px 20px",
	border: "1px solid white",
}

const customerRecommendationText = {
	margin: "5px",
	backgroundColor: "hsl(47,99%,45%)",
	borderRadius: "50px",
	fontSize: "20px",
	fontWeight: "bolder",
	color: "white",
	padding: "10px 20px 10px 20px",
	border: "1px solid white",
}

function AuthorisedHome() {
	const params = useParams();
	const token = useOutletContext();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = React.useState(false)
	const [eventData, setEventData] = React.useState([])

	React.useEffect(() => {
		if (params.userType === 'host') {
			setIsLoading(true)
			async function getHostEvents() {
				const response = makeRequest('GET', `/event/?host_id=${params.id}`, {}, {})
				Promise.resolve(response).then((data) => {
					if (data !== undefined && !data.error) {
						setEventData(data)
						setIsLoading(false)
					}
				})
			}
			getHostEvents()
		}
		if (params.userType === 'customer') {
			setIsLoading(true)
			async function getReccomendedEvents() {
				const response = await makeRequest('GET', `/event/recommend`, {}, {
					Authorization: `Bearer ${token}`
				})
				Promise.resolve(response).then((data) => {
					if (data !== undefined && !data.error) {
						setEventData(data)
						setIsLoading(false)
					}
				})
			}
			getReccomendedEvents();
		}
		// eslint-disable-next-line
	}, [])
	return (
		<>
			<div style={container}>
				{isLoading ?  
						<Box sx={{ width: '100%' }}>
							<Skeleton width="100%" height={60}><Typography>.</Typography></Skeleton>
							<Skeleton
								sx={{paddingTop: '7%'}}
								variant="rectangular"
								width={700}
								height={400}
							/>	
						</Box>
					: 
					<div>
						{
							eventData.length !== 0 && params.userType === 'customer' &&
							<p style={customerRecommendationText}> Personalised Recommendations for you! </p>
						}
						<Carousel pause="hover" controls={true}>
							{eventData.length === 0 && params.userType === 'host' &&
								<Carousel.Item>
									<Box sx={defaultHostContainer}>
										<p style={carouselText}> Start hosting some events! </p>
									</Box>
								</Carousel.Item>
							}

							{eventData.length !== 0 && params.userType === 'host' &&
								eventData.map(event => (
									<Carousel.Item key={event.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/event/${event.id}/${params.userType}/${params.id}`)}>
										<Box sx={{
											backgroundImage: `url(${event.event_image})`,
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
											backgroundSize: 'cover',
											width: '50vw',
											height: '50vh',
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-evenly',
											alignItems: 'center',
											borderRadius: '15px',
											filter: 'brightness(70%)',
										}} />
										<Carousel.Caption>
											<h3>{event.title}</h3>
											<p>
												{new Date((new Date(event.start_date)).getTime() + ((new Date(event.start_date)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
													day: '2-digit',
													month: '2-digit',
													year: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													timeZone: "Australia/Sydney"
												})}
											</p>
											<p>
												{event.venue}
											</p>
										</Carousel.Caption>
									</Carousel.Item>
								))
							}

							{eventData.length === 0 && params.userType === 'customer' &&
								<Carousel.Item>
									<Box sx={defaultCustomerContainer}>
										<p style={carouselText}> Get some Personalised Recommendations by Booking some Events! </p>
									</Box>
								</Carousel.Item>
							}

							{eventData.length !== 0 && params.userType === 'customer' &&
								eventData.map(event => (
									<Carousel.Item key={event.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/event/${event.id}/${params.userType}/${params.id}`)}>
										<Box sx={{
											backgroundImage: `url(${event.event_image})`,
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
											backgroundSize: 'cover',
											width: '50vw',
											height: '50vh',
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-evenly',
											alignItems: 'center',
											borderRadius: '15px',
											filter: 'brightness(70%)',
										}} />
										<Carousel.Caption>
											<Stack direction="column" alignItems="center" justifyContent='flex-end' spacing={-0.2}>
												<h3>{event.title}</h3>
												<p> Begins at: {new Date((new Date(event.start_date)).getTime() + ((new Date(event.start_date)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
														day: '2-digit',
														month: '2-digit',
														year: 'numeric',
														hour: '2-digit',
														minute: '2-digit',
														timeZone: "Australia/Sydney"
													})}
												</p>
												<Stack direction="row" justifyContent='center' spacing={2.5} style={{paddingLeft: '0.2%'}}>
													<p>Venue: {event.venue}</p>
													<p>Category: {event.tags}</p>
												</Stack>
												<p>Number of Seats Still Available: {event.seat_available}</p>
												<p>Per Ticket Price: ${event.price}</p>
											</Stack>
										</Carousel.Caption>
									</Carousel.Item>
								))
							}
						</Carousel>
						{
							params.userType === 'host' &&
							<Button style={defaultButton} 
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = 'rgb(255, 215, 51)';
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = 'rgb(255,198,0)';
								}}
								onClick={() => navigate(`/${params.userType}/${params.id}/create`)
							}
							> 
								Create new Event! 
							</Button>
						}

					</div>
				}
			</div>
		</>
	)
}

export default AuthorisedHome