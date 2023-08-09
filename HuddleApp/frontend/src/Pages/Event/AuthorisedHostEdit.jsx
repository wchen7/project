import React from 'react'

import { useNavigate, useParams, useOutletContext } from 'react-router-dom';

import makeRequest from '../../APIHelper';
import fileToDataUrl from '../../ImageProcesser';

// For Form
import Form from 'react-bootstrap/Form';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';

// For Tags
import defaultBusiness from '../../images/business.jpg';
import defaultMusic from '../../images/music.jpg';
import defaultSport from '../../images/sports.jpg';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

function AuthorisedHostEdit({ token }) {
	const navigate = useNavigate();
	const params = useParams();

	const [eventData] = useOutletContext();

	const userType = params.userType;
	const id = params.id;
	const eventid = params.eventid;

	const [title, setTitle] = React.useState(eventData.title)
	const [description, setDescription] = React.useState(eventData.description)
	const [venue, setVenue] = React.useState(eventData.venue)
	const [price, setPrice] = React.useState(eventData.price)
	const [seats, setSeats] = React.useState(eventData.num_tickets);
	const [tags, setTags] = React.useState(eventData.tags)
	const [event_image, setEventImage] = React.useState(eventData.event_image)
	const availableRows = [
		{ value: 1, label: '1 (11 seats)' },
		{ value: 2, label: '2 (22 seats)' },
		{ value: 3, label: '3 (33 seats)' },
		{ value: 4, label: '4 (44 seats)' },
		{ value: 5, label: '5 (55 seats)' },
		{ value: 6, label: '6 (66 seats)' },
		{ value: 7, label: '7 (77 seats)' },
		{ value: 8, label: '8 (88 seats)' },
		{ value: 9, label: '9 (99 seats)' }
	]
	const [newRows, setNewRows] = React.useState([])

	// Form Handling ----------------------------------------------------------------

	const handleEventImage = (e) => {
		e.preventDefault();
		const imageString = fileToDataUrl(e.target.files[0])
		imageString.then((data) => {
			setEventImage(data);
		})
	};

	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
	};

	const handlePriceChange = (e) => {
		setPrice(e.target.value);
	};

	const handleTicketsChange = (e) => {
		setSeats(e.target.value);
	}

	const handleVenueChange = (e) => {
		setVenue(e.target.value);
	}

	function handleGenreChange(event) {
		setTags(event.target.value)
		if (event_image === null) {
			if (event.target.value === 'business') {
				setEventImage(defaultBusiness)
			} else if (event.target.value === 'music') {
				setEventImage(defaultMusic)
			} else if (event.target.value === 'sport') {
				setEventImage(defaultSport)
			}
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		updateEventDetails();
	}

	async function handleDelete() {
		await makeRequest('DELETE', `/event/?event_id=${eventid}`, {}, {
			Authorization: `Bearer ${token}`
		})
		navigate(`/home/${userType}/${id}`);
	}

	async function updateEventDetails() {
		const response = await makeRequest('PUT', '/event/update', {
			token: token,
			event_id: parseInt(eventid),
			title: title,
			description: description,
			venue: venue,
			start_date: null,
			end_date: null,
			price: price,
			num_tickets: seats,
			age_restriction: null,
			tags: tags,
			event_image: event_image,
		})

		if (response === 400 || response === 403 || response === 500) {
			navigate(`/error/${response}`);
		}
		else {
			navigate(`/home/${userType}/${id}`);
		}
	}

	React.useEffect(() => {
		const filteredRows = availableRows.filter(row => row.value >= Number(eventData.num_tickets));
		setNewRows(filteredRows);
		// eslint-disable-next-line
	}, [])

	return (
		<div>
			<h1>Edit Event</h1><br />
			<center>
				<Form style={{ width: '50%', textAlign: "left", }}>
					<Form.Group >
						<TextField
							type='textField'
							label="Title"
							size="small"
							fullWidth
							value={title}
							onChange={handleTitleChange}
							placeholder='Edit Title'
						/>
					</Form.Group>
					<br />
					<Form.Group style={{ textAlign: "left", marginBottom:"10px"}}>
						<TextField
							type='textField'
							label="Description"
							size="small"
							fullWidth
							value={description}
							onChange={handleDescriptionChange}
							placeholder='Edit Description'
						/>
					</Form.Group>
					
					<Form.Group controlId="formFile" className="mb-3">
						<Form.Label style={{textAlign: "left"}}> Upload Event Image </Form.Label>
						<Form.Control style={{ width: '50%', textAlign: "left",marginBottom:"10px" }} placeholder='upload file' type="file" onChange={handleEventImage} />
					</Form.Group>
					
					<Form.Group style={{ width: '50%', textAlign: "left",  }} >
						<TextField
							type='textField'
							label="Price"
							size="small"
							fullWidth
							value={price}
							onChange={handlePriceChange}
							placeholder='Edit Price'
						/>
					</Form.Group>
					
					<Form.Group>
						<InputLabel id="demo-simple-select-label"> Genre </InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={tags}
							fullWidth
							label="Tag"
							size='small'
							onChange={handleGenreChange}
						>
							<MenuItem value={"business"}>Business</MenuItem>
							<MenuItem value={"music"}>Music</MenuItem>
							<MenuItem value={"sport"}>Sport</MenuItem>
						</Select>
					</Form.Group>
					
					<Form.Group>
						<InputLabel id="demo-simple-select-label"> Event Venue </InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={venue}
							label="Venue"
							fullWidth
							size='small'
							onChange={handleVenueChange}
						>
							<MenuItem value={'Amcor'}>Amcor Stadium</MenuItem>
							<MenuItem value={'ICC'}>International Convention Centre</MenuItem>
							<MenuItem value={'Qudos'}>Qudos Bank Arena</MenuItem>
						</Select>
					</Form.Group>
					
					<Form.Group>
						<InputLabel id="demo-simple-select-label">Seat Rows</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={seats ?? ''}
							label="Seats"
							size='small'
							fullWidth
							onChange={handleTicketsChange}
						>
							{newRows.map((rows) => (
								<MenuItem key={rows.value} value={Number(rows.value)}>
									{rows.label}
								</MenuItem>
							))}
						</Select>
					</Form.Group>
					<br />
					<Button variant="warning" type="submit" onClick={handleSubmit}>
						Save Changes!
					</Button>
				</Form>

				<Button style={{ border: "none", padding: "5px", margin: "5px", fontWeight: "450", backgroundColor: "rgb(252,81,56)" }} onClick={() => handleDelete()}>Delete Event </Button>

			</center>
		</div>
	)
}

export default AuthorisedHostEdit