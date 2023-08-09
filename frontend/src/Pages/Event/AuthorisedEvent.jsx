import React from 'react'

import { useParams, useNavigate, useOutletContext } from 'react-router-dom';

import makeRequest from '../../APIHelper';

// Payments
import SuccessTicket from '../../images/Asset_1.png';
import FailureTicket from '../../images/Asset_2.png';

// Booking Seats
import './Seats/SeatsLayout.css';
import Seats from './Seats/Seats';
import MusicStage from './Seats/MusicStage';
import Business from './Seats/Business';
import FootballStadium from './Seats/FootballStadium';
import { SeatLegend } from "@kiwicom/orbit-components/lib/Seat";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from 'react-bootstrap/Card';

import useForm from './Payment/paymentForm';
import { Button, Form, Alert, Row, Col } from "react-bootstrap";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

import Points from './Payment/PointsModal';

const steps = ['Select up to 5 seats', 'Finalise Payment Details', 'Confirm Booking'];

const container = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItem: 'center',
	textAlign: "center",
	padding: "0 50px 0 50px",
}

const paymentStyle = {
	alignSelf: "center",
	padding: "20px",
}

// Booking Seats ------------------ 
const createSeats = (rows, startIndex) => {
	let i = 0;
	let j = startIndex;
	let k = 'A';
	const section = [];
	while (i < 11 && j <= rows) {
		if (k > 'K') {
			k = 'A';
			j++;
		}
		if (j < rows + 1) {
			section.push(j + k);
			k = String.fromCharCode(k.charCodeAt(0) + 1);
		}
	}
	return section;
}

function AuthorisedEvent({ token }) {
	const navigate = useNavigate();
	const params = useParams();
	const location = window.location.href;
	const userType = params.userType;
	const id = params.id;
	const eventId = params.eventid;
	const [eventData] = useOutletContext();

	const [points, setPoints] = React.useState(0);
	const [redeem, setRedeem] = React.useState(0);

	const half = Math.floor(Number(eventData.num_tickets) / 2);
	const premiumSeats = createSeats(half, '1');
	const normalSeats = createSeats(eventData.num_tickets, (half + 1).toString());

	const [availableSeats, setAvailableSeats] = React.useState([]);
	const [bookedSeats, setBookedSeats] = React.useState([]);
	const [bookedStatus, setBookedStatus] = React.useState('');
	const [savePayment, setSavePayment] = React.useState(false);

	const [activeStep, setActiveStep] = React.useState(0);
	const { handleChange, handleFocus, handleSubmit, values, setValues, errors, validated } = useForm();

	async function handleNext() {
		if (activeStep < steps.length - 1) {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}

		if (activeStep === 1) {
			setBookedStatus(prevState => {
				const updatedStatus = bookedSeats.join(' ');
				if (prevState !== updatedStatus) {
					return updatedStatus;
				}
				return prevState;
			});
		}
		if (activeStep === steps.length - 1 && bookedSeats.length > 0 && validated) {
			if (savePayment) {
				await makeRequest('PUT', '/customer/update', {
					token: token,
					first_name: null,
					last_name: null,
					email: null,
					password: null,
					profile_picture: null,
					card_details: values.cardNumber,
					points: null,
				})
			}
			const points_used = Math.floor(redeem / bookedSeats.length)
			bookedSeats.forEach(async seat => {

				await makeRequest('POST', '/booking', {
					token: token,
					event_id: parseInt(eventId),
					seat: seat,
					ticketurl: `${location}/tickets`,
					payment_num: values.cardNumber,
					points_gained: Math.floor(eventData.price),
					points_used: points_used
				}, {})
			})
			// Blocks the receipt page for now
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	async function handleReset() {
		setBookedSeats([]);
		setActiveStep(0);
		getPageInfo();
		getUserInfo();
		getPastBookingInfo();
	};

	const savePaymentDetails = (event) => {
		setSavePayment(event.target.checked);
	};

	const addSeat = (ev) => {
		if (numberOfSeats && !ev.target.className.includes('disabled')) {
			const seatsToBook = parseInt(numberOfSeats, 10);
			if (bookedSeats.length <= seatsToBook) {
				if (bookedSeats.includes(ev.target.innerText)) {
					const newAvailable = bookedSeats.filter(seat => seat !== ev.target.innerText);
					setBookedSeats(newAvailable);
					setRemainingPicks(remainingPicks => remainingPicks + 1)
				} else if (bookedSeats.length < numberOfSeats) {
					setBookedSeats([...bookedSeats, ev.target.innerText]);
					setRemainingPicks(remainingPicks => remainingPicks - 1)
				} else if (bookedSeats.length === seatsToBook) {
					bookedSeats.shift();
					setBookedSeats([...bookedSeats, ev.target.innerText]);
					setRemainingPicks(0)
				}
			}
		}
	}

	const [numberOfSeats, setNumberOfSeats] = React.useState(5);
	const [remainingPicks, setRemainingPicks] = React.useState(5);

	async function getPageInfo() {
		const response = await makeRequest('GET', `/event/seat/?event_id=${eventId}`, {}, {})
		setAvailableSeats(response)
	}
	async function getUserInfo() {
		const response = await makeRequest('GET', `/${userType}/profile/?${userType}_id=${id}`, {}, {
			Authorization: `Bearer ${token}`,
		});
		if (response === 400 || response === 403 || response === 500) {
			navigate(`/error/${response}`)
		}
		if (response !== undefined) {
			setPoints(response.points)
			if (response.card_details !== null) {
				setValues({
					...values,
					cardNumber: response.card_details
				});
			}
		}
	}

	async function getPastBookingInfo() {
		const response = await makeRequest('GET', '/booking/', {}, {
			Authorization: `Bearer ${token}`,
		})
		const past_bookings = response.filter(event => Number(event.event) === Number(params.eventid))
		if (past_bookings.length >= 0 && past_bookings.length < 5) {
			setNumberOfSeats(5 - past_bookings.length)
			setRemainingPicks(5 - past_bookings.length)
		} else if (past_bookings.length >= 5) {
			setNumberOfSeats(0)
			setRemainingPicks(0)
			setActiveStep(steps.length)
		}
	}

	React.useEffect(() => {
		if (params.userType === 'undefined') {
			navigate(`/event/${eventId}`)
		} else {
			if (eventData.is_active) {
				if (params.userType === 'host' && eventData.host === params.id) {
					// Correct Host can go edit
					navigate(`/event/${eventId}/${params.userType}/${params.id}/edit`)
				} else {
					getPageInfo();
					getUserInfo();
					getPastBookingInfo();
				}
			} else {
				navigate(`/event/${eventId}`)
			}
		}
		// eslint-disable-next-line
	}, [])

	return (
		<>
			{(params.userType === 'customer' && eventData.is_active)
				? <Box sx={{ width: '100%' }}>
					<Stepper activeStep={activeStep}>
						{steps.map((label, index) => {
							const stepProps = {};
							const labelProps = {};
							return (
								<Step key={label} {...stepProps}>
									<StepLabel {...labelProps}>{label}</StepLabel>
								</Step>
							);
						})}
					</Stepper>
					{activeStep === steps.length ? (
						<React.Fragment>
							<Typography sx={{ mt: 2, mb: 1 }}>
								All steps completed - you&apos;re finished with the booking process
							</Typography>
							<Card className="text-center">
								<Card.Header><Card.Title>Confirmation</Card.Title></Card.Header>
								<Card.Body>
									{(numberOfSeats === 0)
										? <>
											<Card.Text>
												YOU'VE EXCEEDED THE 5 TICKET BOOKING LIMIT
											</Card.Text>
											<Card.Img src={FailureTicket} style={{ width: '20vw' }} />
										</>
										: <>
											<Card.Text>
												WE LOOK FORWARD TO SEEING YOU AT {eventData.title}!
											</Card.Text>
											<Card.Img src={SuccessTicket} style={{ width: '20vw' }} />
										</>
									}
									<Card.Text>
										<>
											<br />
											Thanks for choosing to book with Huddle! Please keep an eye out for your e-tickets that will arrive in your email!
											<div />
											Here's everything you need for your ticket:
										</>
									</Card.Text>
									<Stack direction="column" justifyContent='center' spacing={1.5} style={{ paddingRight: '40%', paddingLeft: '40%' }}>
										<Button variant='success' onClick={() => { navigate(`/event/${eventId}/${userType}/${id}/tickets`) }}> Access My Tickets</Button>
										<Button disabled={numberOfSeats === 0 ? true : false} onClick={handleReset}>Re-order</Button>
									</Stack>
								</Card.Body>
								<Card.Footer className="text-muted"></Card.Footer>
							</Card>
						</React.Fragment>
					) : (
						<React.Fragment>
							<Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
							{/* Seat Selection Step */}
							{activeStep === 0 &&
								<Card className="text-center">
									<Card.Header><Card.Title>Seat Selection</Card.Title></Card.Header>
									<Card.Body>
										<Stack direction="row" justifyContent='center' spacing={2}>
											<div>
												<SeatLegend type="legroom" label="Selected Seat" />
											</div>
											<div>
												<SeatLegend type="default" label="Available Seat" />
											</div>
											<div>
												<SeatLegend type="unavailable" label="Reserved Seat" />
											</div>
										</Stack>
										<Box style={container}>
											<div className="container">
												<React.Fragment>
													{eventData.tags === 'music' && <MusicStage />}
													{eventData.tags === 'business' && <Business />}
													<Seats values={premiumSeats}
														availableSeats={availableSeats}
														bookedSeats={bookedSeats}
														addSeat={addSeat} />
													{eventData.tags === 'sport' && <FootballStadium />}
													<Seats values={normalSeats}
														availableSeats={availableSeats}
														bookedSeats={bookedSeats}
														addSeat={addSeat} />
												</React.Fragment>
											</div>
										</Box>
										<Button variant='warning' onClick={() => { navigate(`/event/${eventId}/${userType}/${id}/tickets`) }}> Skip To My Tickets</Button>
									</Card.Body>
									<Card.Footer className="text-muted">You have up to {remainingPicks} seats left to select</Card.Footer>
								</Card>
							}
							{activeStep === 1 &&
								<>
									<div style={container}>
										<div style={paymentStyle}>
											<div className="formDiv">
												<div style={{ marginBottom: '5%' }}>
													<Cards
														cvc={values.cardSecurityCode}
														expiry={values.cardExpiration}
														focused={values.focus}
														name={values.cardName}
														number={values.cardNumber}
														acceptedCards={['visa', 'mastercard']}
													/>
												</div>
												<Form onSubmit={handleSubmit}>
													<Form.Group className="mb-3">
														<Form.Control
															type="text"
															id="cardName"
															data-testid="cardName"
															name="cardName"
															placeholder="Cardholder Name"
															value={values.cardName}
															onChange={handleChange}
															onFocus={handleFocus}
															isValid={errors.cname}
														/>
													</Form.Group>
													<Form.Group className="mb-3">
														<Form.Control
															type="number"
															id="cardNumber"
															data-testid="cardNumber"
															name="cardNumber"
															placeholder="Card Number"
															value={values.cardNumber}
															onChange={handleChange}
															onFocus={handleFocus}
															isValid={errors.cnumber}
														/>
													</Form.Group>
													<Row className="mb-3">
														<Col>
															<Form.Group>
																<Form.Control
																	type="text"
																	name="cardType"
																	id="cardType"
																	data-testid="cardType"
																	placeholder="Card Type"
																	value={values.cardType}
																	onChange={handleChange}
																	onFocus={handleFocus}
																	isValid={errors.ctype}
																/>
															</Form.Group>
														</Col>
														<Col>
															<Form.Group>
																<Form.Control
																	type="text"
																	id="cardExpiration"
																	data-testid="cardExpiration"
																	name="cardExpiration"
																	placeholder="Expiration Date"
																	value={values.cardExpiration}
																	onChange={handleChange}
																	onFocus={handleFocus}
																	isValid={errors.cexp}
																/>
															</Form.Group>
														</Col>
													</Row>
													<Row className="mb-3">
														<Col>
															<Form.Group>
																<Form.Control
																	type="number"
																	id="cardSecurityCode"
																	data-testid="cardSecurityCode"
																	name="cardSecurityCode"
																	placeholder="CVC"
																	value={values.cardSecurityCode}
																	onChange={handleChange}
																	onFocus={handleFocus}
																	isValid={errors.ccvv}
																/>
															</Form.Group>
														</Col>
														<Col>
															<Form.Group>
																<Form.Control
																	type="text"
																	id="cardPostalCode"
																	data-testid="cardPostalCode"
																	name="cardPostalCode"
																	placeholder="Postal Code"
																	value={values.cardPostalCode}
																	onChange={handleChange}
																	onFocus={handleFocus}
																	isValid={errors.cpostal}
																/>
															</Form.Group>
														</Col>
													</Row>
													<Button
														size={"block"}
														data-testid="validateButton"
														id="validateButton"
														type="submit"
													>
														Validate
													</Button>
												</Form>
											</div>
											<Alert
												id="alertMessage"
												data-testid="alertMessage"
												variant={errors.variant}
												show={errors.show}
												style={{ marginTop: '20px', textAlign: 'center' }}
											>
												{errors.message}
											</Alert>{" "}
										</div>
									</div>
								</>
							}
							{activeStep === 2 &&
								<>
									<Box style={container}>
										<Card className="text-center">
											<Card.Header><Card.Title>Booking Summary</Card.Title></Card.Header>
											<Card.Body>
												<Card.Text style={{ fontSize: '18px' }}>
													Seats selected in this booking: {bookedStatus}
												</Card.Text>
												<Card.Text style={{ fontSize: '18px' }}>
													Ticket Price: ${eventData.price}
												</Card.Text>
												<Card.Text>
													GST: ${0.01 * eventData.price}
												</Card.Text>
												<Card.Text>
													You've chosen to redeem {redeem} points for this booking.
												</Card.Text>
												<Card.Text>
													<Points points={points} setPoints={setRedeem} cost={eventData.price * bookedSeats.length} />
												</Card.Text>
												<Card.Text style={{ fontSize: '22px' }}>
													<b>Final Cost: ${((eventData.price * bookedSeats.length) + (0.01 * eventData.price)) - (redeem * 0.01)}</b>
												</Card.Text>
											</Card.Body>
											<Card.Footer className="text-muted">
												<FormControlLabel
													control={<Checkbox checked={savePayment} onChange={savePaymentDetails} />}
													label="Save Payment Details to account details"
												/>
											</Card.Footer>
										</Card>
									</Box>
								</>
							}
							<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
								<Button
									color="inherit"
									disabled={activeStep === 0}
									onClick={handleBack}
									sx={{ mr: 1 }}
								>
									Back
								</Button>
								<Box sx={{ flex: '1 1 auto' }} />
								<Button onClick={handleNext}>
									{activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
								</Button>
							</Box>
						</React.Fragment>
					)}
				</Box>
				: <></>
			}
		</>
	)
}


export default AuthorisedEvent