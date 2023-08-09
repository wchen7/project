import React from 'react'
import Form from 'react-bootstrap/Form';
import makeRequest from '../../APIHelper';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import fileToDataUrl from '../../ImageProcesser';
import defaultBusiness from '../../images/business.jpg';
import defaultMusic from '../../images/music.jpg';
import defaultSport from '../../images/sports.jpg';

import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const submitButton = {
	padding: "5px",
	margin: "5px",
	width: "200px",
	height: "50px",
	border: "none",
	borderRadius: "5px",
	backgroundColor: "#ffc600",
	color: "white",
	alignSelf: "center",
}

function changeButtonColor(e) {
	e.target.style.background = '#ffd733';
}

function defaultButtonColor(e) {
	e.target.style.background = '#ffc600';
}

function HostCreateEvent() {

	const token = useOutletContext();
	const eight = { inputProps: { 'aria-label': 'Checkbox demo' } };
	const tomorrow = dayjs().add(1, 'day');
	const fiveAM = dayjs().set('hour', 5).startOf('hour');
	const tenPM = dayjs().set('hour', 22).startOf('hour');

	const [eventTitle, setEventTitle] = React.useState('');
	const [venue, setVenue] = React.useState("");
	const [genre, setGenre] = React.useState('');
	const [eighteen, setEighteen] = React.useState(0);
	const [eventDate, setEventDate] = React.useState('');
	const [seats, setSeats] = React.useState('');
	const [eventImage, setEventImage] = React.useState(null);
	const [eventPrice, setEventPrice] = React.useState('');
	const [eventDescription, setEventDescription] = React.useState('');
	const [start_time, setStartTime] = React.useState('');
	const [end_time, setEndTime] = React.useState('');

	const [trackStartHour, setTrackStartHour] = React.useState(6)
	const startHour = dayjs().set('hour', trackStartHour).startOf('hour');

	const [errorTitle, setErrorTitle] = React.useState(false);
	const [errorVenue, setErrorVenue] = React.useState(false);
	const [errorPrice, setErrorPrice] = React.useState(false);
	const [errorDescription, setErrorDescription] = React.useState(false);

	const navigate = useNavigate();
	const params = useParams();

	const handleCreate = (e) => {
		e.preventDefault();
		let hasError = false;
		
		if (eventTitle.trim() === "" || eventTitle.length > 50) {
			setErrorTitle(true);
			hasError = true;
		}
		
		if (eventPrice.length === 0 || valueOf.eventPrice > 999) {
			setErrorPrice(true);
			hasError = true;
		}

		if (eventDescription.length === 0 || eventDescription.length > 999) {
			setErrorDescription(true);
			hasError = true;
		}
		
		if (hasError) {
			return;
		}

		createEvent();
	}


	async function createEvent() {
		if (start_time.length !== 0 && end_time.length !== 0) {
			const startTimeString = eventDate + 'T' + start_time;
			const start_date_iso = new Date(startTimeString).toISOString();

			const endTimeString = eventDate + 'T' + end_time;
			const end_date_iso = new Date(endTimeString).toISOString();

			const response = await makeRequest('POST', '/event', {
				token: token,
				title: eventTitle,
				description: eventDescription,
				venue: venue,
				start_date: start_date_iso,
				end_date: end_date_iso,
				price: eventPrice,
				num_tickets: seats,
				age_restriction: eighteen.toString(),
				tags: genre,
				event_image: eventImage
			})
			if (response === 400 || response === 500 || response === 503) {
				navigate(`/error/${response}`);
			} else if (response === 403) {
				setErrorTitle(true)
			} else {
				navigate(`/home/${params.userType}/${params.id}`)
			}
		}
	}

	function handleGenreChange(event) {
		setGenre(event.target.value)
		if (eventImage === null) {
			if (event.target.value === 'business') {
				setEventImage(defaultBusiness)
			} else if (event.target.value === 'music') {
				setEventImage(defaultMusic)
			} else if (event.target.value === 'sport') {
				setEventImage(defaultSport)
			}
		}
	}

	const handleStart = (e) => {
		if (e !== null) {
			let hour = e.$H.toString()
			setTrackStartHour(Number(hour) + 1)
			if (hour < 10) {
				hour = '0' + hour
			}
			let minutes = e.$m.toString()
			if (minutes < 10) {
				minutes = '0' + minutes
			}
			setStartTime(`${hour}:${minutes}:00.000Z`)
		}
	}

	const handleEnd = (e) => {
		if (e !== null) {
			let hour = e.$H.toString()
			if (hour < 10) {
				hour = '0' + hour
			}
			let minutes = e.$m.toString()
			if (minutes < 10) {
				minutes = '0' + minutes
			}
			setEndTime(`${hour}:${minutes}:00.000Z`)
		}
	}

	const handleDateChange = (e) => {
		if (e !== null) {
			const year = e.$y.toString()

			let month = (e.$M + 1).toString()
			if (month.length === 1) {
				month = '0' + month
			}
	
			let day = e.$D.toString()
	
			if (day.length === 1) {
				day = '0' + day
			}
	
			setEventDate(`${year}-${month}-${day}`);
		}
	}

	const isEighteen = (event) => {
		if (event.target.checked) {
			setEighteen(18)
		} else {
			setEighteen(0)
		}
	};

	const handlePicture = (e) => {
		e.preventDefault();
		const imageString = fileToDataUrl(e.target.files[0])
		imageString.then((data) => {
			setEventImage(data);
		})
	};

	const handleEventTitleChange = (e) => {
		setEventTitle(e.target.value);
		setErrorTitle(false);
	};

	const handleVenueChange = (e) => {
		setVenue(e.target.value);
		setErrorVenue(false);	
	};

	const handlePriceChange = (e) => {
		setEventPrice(e.target.value);
		setErrorPrice(false);
	}
	
	const handleDescriptionChange = (e) => {
		setEventDescription(e.target.value);
		setErrorDescription(false);
	}
	

	return (
		<center>
			<h1>Create Event</h1><br />
			<div className="host-create-event-page" style={{ width: '50%', textAlign: "left", }} >
				<Form.Group className="Event-title">
					
					<TextField
					 	type='textField'
						label='Event Title'
						
						placeholder="Enter Title"
						fullWidth 
						error={errorTitle}
						helperText={errorTitle ? "Enter a unique title that contains 50 characters or less" : ""}
						onChange={handleEventTitleChange} 
						value={eventTitle} />
				</Form.Group>
				<br />
				<Box sx={{ minWidth: 120 }}>
					<FormControl fullWidth >
						<InputLabel id="demo-simple-select-label">Event Venue</InputLabel>
						<Select
							labelId="event-label"
							
							error={errorVenue}
							helperText={errorVenue ? "Select a venue" : ""}
							value={venue}
							label="Event Venue"
							onChange={handleVenueChange}
							renderInput={(params) => <TextField 
								
								helperText="Select a Venue" 
								{...params} sx={{ width:"100%" }} 
								error
							  />}
						>
							<MenuItem value={'Amcor'}>Amcor Stadium</MenuItem>
							<MenuItem value={'ICC'}>International Convention Centre</MenuItem>
							<MenuItem value={'Qudos'}>Qudos Bank Arena</MenuItem>
						</Select>
						
						
					</FormControl>
					<br/>
				</Box>
				<Form.Group>
					<Form.Label> Upload Cover Image </Form.Label>
					<Form.Control type="file" onChange={handlePicture} />
				</Form.Group>
				<br />
				<LocalizationProvider dateAdapter={AdapterDayjs} >
					<DemoContainer components={['DatePicker']}>
						<DatePicker 
							label="Event Date"
							minDate={tomorrow}
							onChange={handleDateChange}
						/>
					</DemoContainer>
				</LocalizationProvider>
				<br />
				<Box sx={{ minWidth: 120 }}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Genre</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={genre}
							label="Genre"
							onChange={handleGenreChange}
						>
							<MenuItem value={"business"}>Business</MenuItem>
							<MenuItem value={"music"}>Music</MenuItem>
							<MenuItem value={"sport"}>Sport</MenuItem>
						</Select>
					</FormControl>
				</Box>
				18+ event?<Checkbox {...eight} defaultChecked onChange={isEighteen} />

				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DemoContainer components={['TimePicker', 'DateTimePicker']}>
						<TimePicker 
							label="Start Time"
							minTime={fiveAM} 
							maxTime={tenPM} 
							onChange={handleStart} 
							value={start_time} 
						/>
					</DemoContainer>
				</LocalizationProvider>
				<br />
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DemoContainer components={['TimePicker', 'DateTimePicker']}>
						<TimePicker 
							label="End Time"
							minTime={startHour} 
							onChange={handleEnd} 
							value={end_time} 
						/>
					</DemoContainer>
				</LocalizationProvider>
				<br />
				<Form.Group >
					
					<TextField 
						placeholder="Price in AUD" 
						fullWidth
						size='small'
						label='Ticket Price'
						type='textField'
						onChange={handlePriceChange} 
						value={eventPrice}
						error={errorPrice} 
						helperText={errorPrice ? "Please enter a ticket price $999 or less" : ""}
					/>
				</Form.Group>
				<br/>
				<Box sx={{ minWidth: 120 }}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Seat Rows</InputLabel>
						<Select
							value={seats}
							label="Seats"
							onChange={(event) => { setSeats(event.target.value) }}
						>
							<MenuItem value={1}>1 (11 seats)</MenuItem>
							<MenuItem value={2}>2 (22 seats)</MenuItem>
							<MenuItem value={3}>3 (33 seats)</MenuItem>
							<MenuItem value={4}>4 (44 seats)</MenuItem>
							<MenuItem value={5}>5 (55 seats)</MenuItem>
							<MenuItem value={6}>6 (66 seats)</MenuItem>
							<MenuItem value={7}>7 (77 seats)</MenuItem>
							<MenuItem value={8}>8 (88 seats)</MenuItem>
							<MenuItem value={9}>9 (99 seats)</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<br />
				<Form.Group className="mb-3">
					<TextField
						placeholder="Type here.." 
						fullWidth
						size="large"
						className="host-create-textarea"
						label="Event Description"
						error={errorDescription}
						helperText={errorDescription ? "Please enter a description less than 1000 characters" : ""} 
						onChange={handleDescriptionChange} 
						value={eventDescription} 
					/>
				</Form.Group>
				<center>
					<div>
						<button style={submitButton} onMouseEnter={changeButtonColor} onMouseLeave={defaultButtonColor} type="submit" onClick={handleCreate}>Create Event</button>
					</div>
				</center>
			</div>
		</center>
	) 
}

export default HostCreateEvent;