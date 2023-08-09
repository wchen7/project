import React from 'react'

import { useParams, Outlet, useOutletContext, useNavigate } from 'react-router-dom';
import LoadingComponent from '../../Components/LoadingComponent';

import makeRequest from '../../APIHelper';
import Box from '@mui/material/Box';
import Card from 'react-bootstrap/Card'
import moment from 'moment-timezone';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Filter from "bad-words";
import ReplyIcon from '@mui/icons-material/Reply';
import InfiniteScroll from "react-infinite-scroll-component";
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  

const reviewTextStyle = {
	display: 'flex',
	flexDirection: 'row',
	border: '1px solid #ccc',
	padding: '8px 10px',
	borderRadius: '8px',
	marginBottom: '10px',
	outline: 'none'
}

const inputStyle = {
	flexGrow: '2',
	border: 'none',
	fontSize: '16px',
}

const postButton = {
	border: '0',
	borderRadius: '8px',
	backgroundColor: '#ffd733',
	width: '100px',
	height: '40px',
	cursor: 'pointer',
}

const reviewHeader = {
	height: '70px',
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	marginBottom: '30px',
	backgroundColor: '#ffd733',
	justifyContent: "center",
	borderRadius: "10px",
	color: "black",
	fontWeight: "bolder",
	fontSize: "larger",
}

const container = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	textAlign: "center",
	padding: "20px",
	height: "fit-content",
}

const containerLeft = {
	width: "45%",
	height: "100%",
	backgroundColor: 'rgba(128, 128, 128, 0.3)',
	padding: "25px",
	borderRadius: "30px",
	color: "white",
}

const contentLeft = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	textAlign: "center",
}

const titleStyle = {
	borderRadius: "10px",
	backgroundColor: 'rgba(128, 128, 128, 0.7)',
	padding: "5px 20px 5px 20px",
	textAlign: "start",
	justifyContent: "center",
}

const cardBody = {
	borderRadius: "10px",
	backgroundColor: 'rgba(128, 128, 128, 0.7)',
	textAlign: "start",
	fontSize: "fit-content",
	padding: "5px 20px 5px 20px",
	height: "100%",
}

const cardHostStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	borderRadius: "10px",
	backgroundColor: 'rgba(128, 128, 128, 0.7)',
	padding: "5px 20px 5px 20px",
	fontSize: "smaller",
	fontWeight: "bold",
	width: "fit-content",
}

const cardTextStyle = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignSelf: "center",
	margin: "10px",
	padding: "5px 10px 5px 10px",
	borderRadius: "10px",
	backgroundColor: 'rgba(128, 128, 128, 0.7)',
	fontSize: "20px",
}

const containerRight = {
	backgroundColor: 'rgba(230,179,1, 0.7)',
	padding: "20px",
	color: "white",
	alignSelf: "center",
}

const cardFooter = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-around",
	textAlign: "center",
}

const reviewCustomerContainer = {
	backgroundColor: 'rgba(173,174,176, 0.5)',
	borderRadius: "10px",
	padding: "5px",
	margin: "10px 0",
	width: "800px",

}

const reviewContentHeader = {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	padding: "0 20px 0 20px",
	alignItems: 'center'
}

const reviewHostContainer = {
	alignSelf: 'safe center',
	backgroundColor: 'rgba(255,193,7, 0.4)',
	borderRadius: "10px",
	padding: "5px",
	width: "670px",
}

function Event() {
	const params = useParams();
	const navigate = useNavigate();
	const eventId = params.eventid;
	const token = useOutletContext();

	const filter = new Filter();
	const [text, setText] = React.useState('');
	const [errorText, setErrorText] = React.useState(false);
	
	const [rating, setRating] = React.useState(3);

	const [madeReview, setMadeReview] = React.useState(false);
	const [allReviewsData, setAllReviewsData] = React.useState([])

	const [page, setPage] = React.useState(1);
	const [isEnd, setIsEnd] = React.useState(true)

	// Snackbar
	const [open, setOpen] = React.useState(false);
	const [snackBarMessage, setSnackBarMessage] = React.useState("")
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};


	const handleTextChange = e => {
		setText(e.target.value);
		setErrorText(false);
	};

	const handlePostReview = (e) => {
		let hasError = false;

		if (text.trim() === "") {
			setErrorText(true);
			hasError = true
		}

		if (filter.isProfane(text)) {
			setErrorText(true);
			hasError = true
		}

		if (hasError) {
			return;
		}
		setSnackBarMessage("review")
		postReview()
	}

	async function postReview() {
		const now = moment().tz('Australia/Sydney');
		const nowISOString = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

		let newRating = rating

		if (rating === null) {
			newRating = 0
		}

		await makeRequest('POST', '/event/review', {
			token: token,
			message: text,
			timestamp: nowISOString,
			event_id: eventId,
			rating: newRating,
		}, {})
		setMadeReview(true)
		setOpen(true)
		setText('');
		getReviews();
	}

	async function getReviews() {
		const response = await makeRequest('GET', `/event/review/?event_id=${eventId}&search=${1}`, {}, {})
		setAllReviewsData(response);
		if (!token || params.userType === 'host') {
			setMadeReview(true)
		} else {
			response.forEach((review) => {
				if (review.customer === params.id) {
					setMadeReview(true)
				}
			})
		}
		setPage(2)
	}

	async function loadMore() {
		const response = await makeRequest('GET', `/event/review/?event_id=${eventId}&search=${page}`, {}, {})
		if (response.length === 0) {
			setIsEnd(false)
		} else {
			setTimeout(() => {
				setAllReviewsData([...allReviewsData, ...response])
			}, 500)
			setPage(page => page + 1)
		}
	}

	const [loadingState, setLoadingState] = React.useState(true);
	const [eventData, setEventData] = React.useState([]);
	const [isActive, setIsActive] = React.useState(null);

	const startTime = new Date((new Date(eventData.start_date)).getTime() + ((new Date(eventData.start_date)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: "Australia/Sydney"
	})

	const endTime = new Date((new Date(eventData.end_date)).getTime() + ((new Date(eventData.end_date)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: "Australia/Sydney"
	})


	// Reviews --------------------------------

	// Reply
	const [hostReply, setHostReply] = React.useState([]);

	const handleReplyChange = (index, e) => {
		const updatedReplies = [...hostReply];
		updatedReplies[index] = e.target.value;
		setHostReply(updatedReplies);
	}

	const handleReplySubmit = (index, review_id, event_id) => {
		setSnackBarMessage("reply")
		postReply(index, review_id, event_id)
	}

	async function postReply(index, review_id) {
		const now = moment().tz('Australia/Sydney');
		const nowISOString = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

		await makeRequest('POST', '/event/reply', {
			token: token,
			review_id: review_id,
			message: hostReply[index],
			timestamp: nowISOString,
			event_id: eventId,
		});
		setOpen(true)
		setMadeReview(true)
		getReviews()
	}

	async function getPageInfo() {
		const response = await makeRequest('GET', `/event/?event_id=${params.eventid}`, {}, {})
		Promise.resolve(response).then(data => {
			if (data !== undefined && !data.error) {
				setEventData(data)
				setIsActive(data.is_active)
				setLoadingState(false);
			}
		})
	}

	React.useEffect(() => {
		if (params.userType === 'undefined') {
			navigate(`/event/${eventId}`)
		}
		setLoadingState(true);
		getPageInfo();
		getReviews();
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<div style={container}>
				{loadingState ? <LoadingComponent />
					: <div>
						<Box
							sx={{
								backgroundImage: `url(${eventData.event_image})`,
								margin: '0 2% 2% 2%',
								padding: '20px',
								width: '95%',
								height: '100vh',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								backgroundSize: 'cover',
								borderRadius: '2%',
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Card style={containerLeft}>
								<Card.ImgOverlay className='custom-card-overlay' style={contentLeft}>
									<Card.Title style={titleStyle}><h2>{eventData.title}</h2></Card.Title>
									<Card.Text style={cardHostStyle}> Event Organiser: <Avatar alt="Host Picture" src={eventData.host_picture} style={{width: "25px", height: "25px", margin: "0 10px"}}/> {eventData.hostname}</Card.Text>
									<Card.Body>
										<Card.Text style={cardBody}>{eventData.description}</Card.Text>
									</Card.Body>
									<Card.Footer style={cardFooter}>
										<Card.Text style={cardTextStyle}>Tags: {eventData.tags}</Card.Text>
										<Card.Text style={cardTextStyle}>Venue: {eventData.venue}</Card.Text>
										<Card.Text style={cardTextStyle}>Price Per Ticket ${eventData.price}</Card.Text>
									</Card.Footer>
								</Card.ImgOverlay>
							</Card>
							<Card style={containerRight}>
								<Card.Title><h2>Date and Time</h2></Card.Title>
								<Card.Text>This starts on the {startTime}</Card.Text>
								<Card.Text>This ends on the {endTime}</Card.Text>

								<Card.Text>This is a {eventData.age_restriction}+ event</Card.Text>
							</Card>
						</Box>

						{/* Reviews */}
						{!isActive ?
							<>
								<header style={reviewHeader}>
									<h2>Event Reviews</h2>
								</header>
								<div style={{padding: "0 20% 0 20%"}}>
									{
										allReviewsData.length === 0 && madeReview &&
										<div>
											No reviews yet!
										</div>
									}

									{/* Checks whether or not the user has already made a review */}
									{
										!madeReview &&
										<div>
											<h3>Leave a review for this Event</h3>
											<div style={reviewTextStyle}>
												<input style={inputStyle}
													onChange={handleTextChange}
													type="text"
													value={text}
													disabled={madeReview}
													placeholder="Write a review"
													error={errorText}
													helperText={errorText ? "You can't send an empty message or have inappropraite words" : ""}
												/>
												<div style={{display:"flex", flexDirection:"column", justifyContent: "center", padding: "0px 10px 0px 10px"}}>
													<Rating
														value={rating}
														onChange={(e, rating) => {
															setRating(rating);
														}}
													/>
												</div>
												<button type="submit" disabled={madeReview} style={postButton} onClick={() => {handlePostReview()}}>
													Post
												</button>
											</div>
										</div>
									}


									{/* Shows All the Reviews and Replies */}	
									<InfiniteScroll
										dataLength={allReviewsData.length}
										next={loadMore}
										hasMore={isEnd}
										hasChildren={true}
										loader={<LinearProgress />}
										endMessage={
											<p style={{ textAlign: 'center' }}>
												<br />
												<b>Yay! This is the end! You have finally seen all the reviews. </b>
											</p>
										}
									>
								
										{
											allReviewsData.map((item, index) => (
												<div style={{display: "flex", flexDirection: "column", justifyContent: "center"}} key={item.id}>
													<div style={reviewCustomerContainer}>
														<Card style={{backgroundColor: 'rgba(173,174,176, 0.5)', borderRadius: '10px'}}>
															<Card.Header style={reviewContentHeader}>
																<div style={{fontWeight: "bold", display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
																	<Avatar alt="Host Picture" src={item.profile_pic} style={{width: 33, height: 30}}/> 
																	<div style={{marginLeft: '5%', marginRight: '-10%'}}>{item.sender}</div>
																</div>
																<div style={reviewContentHeader}>
																	<div style={{paddingTop: "2%", marginLeft: '-5%'}}>
																		<Rating
																			value={item.rating}
																			readOnly
																		/>
																	</div>
																	<div>
																		{
																			new Date((new Date(item.timestamp)).getTime() + ((new Date(item.timestamp)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
																				day: '2-digit',
																				month: '2-digit',
																				year: 'numeric',
																				hour: '2-digit',
																				minute: '2-digit',
																				timeZone: "Australia/Sydney"
																			})
																		}
																	</div>
																</div>
															</Card.Header>
																<Card.Body>
																	<Card.Text style={{ textAlign: 'left'}}>
																		<blockquote className="blockquote mb-0">
																			{item.message}
																		</blockquote>
																	</Card.Text>
																</Card.Body>
															<Card.Footer className="text-muted">
																{/* Host Owns the Event & there is no reply for the message  */}
																{
																	params.id === eventData.host && Object.keys(item.reply).length === 0 &&
																		<Paper
																			component="form"
																			sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%", borderRadius: "10px", alignSelf:"center" }}
																		>
																			<InputBase
																				sx={{ ml: 1, flex: 1 }}
																				key={index}
																				onChange={(e) => handleReplyChange(index, e)}
																				type="text"
																				value={hostReply[index]}
																				placeholder="Write a Reply"
																				style={{margin: "5px"}}
																			/>
																			<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
																			<IconButton color="primary" sx={{ p: '10px' }} aria-label="send-reply" onClick={() => handleReplySubmit(index, item.id, item.event)}>
																				<ReplyIcon />
																			</IconButton>
																		</Paper>
																}
															</Card.Footer>
														</Card>
													</div>

													{item.reply === undefined &&
														<div>
															No Replies!
														</div>
													}

													{/* Shows replies */}
													{Object.keys(item.reply).length !== 0 &&
														<Card style={reviewHostContainer}>
															<Card.Header style={reviewContentHeader}>
																<div style={{fontWeight: "bold", display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
																	Response From: {eventData.hostname}
																</div>
																<div>
																	{
																		new Date((new Date(item.reply.timestamp)).getTime() + ((new Date(item.reply.timestamp)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
																			day: '2-digit',
																			month: '2-digit',
																			year: 'numeric',
																			hour: '2-digit',
																			minute: '2-digit',
																			timeZone: "Australia/Sydney"
																		})
																	}
																</div>
															</Card.Header>
														
															<Card.Body  style={{ textAlign: 'left'}}> 
																<blockquote className="blockquote mb-0">
																	<footer className="blockquote-footer">
																		{item.message}
																	</footer>
																	<p key={item.reply.id}>
																		{item.reply.message}
																	</p>
																</blockquote>
															</Card.Body>
														</Card>
													}

												</div>
											))
										}

									</InfiniteScroll>

								</div>
							</>
							: <Outlet context={[eventData]} />
						}
					</div>
				}
				<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
						You have succesfully left a {snackBarMessage}!
					</Alert>
				</Snackbar>
			</div>
		</>
	)
}

export default Event