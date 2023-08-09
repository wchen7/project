import React from 'react'
import { Outlet, useOutletContext, useNavigate, useParams } from 'react-router-dom'
import makeRequest from '../../APIHelper';
import HomePageGridItem from './HomePageGridItem';
import HomeMiddleComponent from './HomeMiddleComponent';
import YellowText from '../../Components/Huddle/YellowText';
import LoadingComponent from '../../Components/LoadingComponent';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import InfiniteScroll from "react-infinite-scroll-component";
import LiveHelpSharpIcon from '@mui/icons-material/LiveHelpSharp';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltSharpIcon from '@mui/icons-material/FilterAltSharp';
import Tooltip from '@mui/material/Tooltip';

import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';

import config from '../../Chatbot/config';
import MessageParser from '../../Chatbot/MessageParser';
import ActionProvider from '../../Chatbot/ActionProvider';

const outer_container = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	textAlign: "center",
}

const event_container = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	margin: "30px"
}

const container1Header = {
	fontWeight: "bolder",
	fontSize: "larger",
	position: "center",
}

const flexRowSpaceBetween = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between"
}

const container2 = {
	alignSelf: "center",
	padding: "20px",
}

const flexRowSpaceEvenly = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-evenly",
	paddingBottom: '30px'
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tagNames = [
	'music',
	'sport',
	'business',
];

function getStyles(name, tags, theme) {
	return {
	  fontWeight:
		tags.indexOf(name) === -1
		  ? theme.typography.fontWeightRegular
		  : theme.typography.fontWeightMedium,
	};
}

const marks = [
	{
	  value: 0,
	  label: 'Free',
	},
	{
	  value: 200,
	  label: '$200',
	},
	{
	  value: 400,
	  label: '$400',
	},
	{
		value: 600,
		label: '$600',
	},
	{
		value: 800,
		label: '$800',
	},
	{
	  value: 1000,
	  label: '$1000',
	},
  ];

function valuetext(value) {
	return `${value}°C`;
}

function Home() {
	const navigate = useNavigate();
	const params = useParams();
	const token = useOutletContext();
	const [tagSelected, SetTagSelected] = React.useState('Current')

	const [allEventsData, setAllEventsData] = React.useState([]);
	const [filteredEvents, setFilteredEvents] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false)
	const [searchInput, setSearchInput] = React.useState("")
	const [searchedEvents, SetSearchedEvents] = React.useState([]);

	const [pageCurrent, setPageCurrent] = React.useState(1);
	const [currentEvents, setCurrentEvents] = React.useState([]);
	const [isEndCurrent, setIsEndCurrent] = React.useState(true)
	const [pagePast, setPagePast] = React.useState(1);
	const [pastEvents, setPastEvents] = React.useState([]);
	const [isEndPast, setIsEndPast] = React.useState(true);
	const [applyFilter, setApplyFilter] = React.useState(false);

	const [description, setDescription] = React.useState("");
	const [ageFilter, setAgeFilter] = React.useState(false);
	const [venue, setVenue] = React.useState('');
	const [trending, setTrending] = React.useState(false);
	const [tags, setTags] = React.useState([]);
	const [price, setPrice] = React.useState(0);
	const [everySetted, setEverySetted] = React.useState(false);

	const theme = useTheme();
	const [openRight, setOpenRight] = React.useState(false);
  
	const handleTagsChange = (event) => {
	  const {
		target: { value },
	  } = event;
	  setTags(
		typeof value === 'string' ? value.split(',') : value,
	  );
	};

	const getTagStyle = (tag) => {
		return {
			backgroundColor: tagSelected === tag ? "black" : "#ffc600",
			color: tagSelected === tag ? "white" : "black",
			width: "fit-content",
			borderRadius: "20px",
			padding: "10px",
			fontWeight: "bold",
		};
	};

	const [open, setOpen] = React.useState(false);

	function handleBotOpen () {
		setOpenRight(true);
	}

	async function handleClickOpen () {
		setOpen(true);
		setApplyFilter(true);
		setSearchInput('');
		SetTagSelected('');
		const response = await makeRequest('GET', '/event/all', {}, {})
		setAllEventsData(response)
		setEverySetted(true)
	}
  
	const handleClose = () => {
	  setOpen(false);
	  setEverySetted(false);
	};

	function handleSearch(e) {
		setSearchInput(e.target.value)
		SetTagSelected('')
	}

	async function goSearch () {
		const response = await makeRequest('GET', `/event/?search=${searchInput}`, {}, {})
		SetSearchedEvents(response)
		SetTagSelected('')
		setApplyFilter(false);
	}

	function handleEventState (newTag) {
		SetTagSelected(newTag);
		setSearchInput('');
		setApplyFilter(false);
	}

	async function handleAdvancedFilter() {
		if (allEventsData.length !== 0) {
			const searchFilterList = allEventsData.filter((event) => {
				let descMatches = true
				if (description.length > 0) {
					descMatches = event.description.toUpperCase().includes(description.toUpperCase());
				}
				let venueMatches = true
				if (venue.length > 0) {
					venueMatches = event.venue.toUpperCase().includes(venue.toUpperCase());
				}
				let isTrending = true
				if (trending) {
					isTrending = Number(event.seat_available) <= 11
				}
				let hasTags = true
				if (tags.length > 0) {
					hasTags = tags.some(tag => event.tags.includes(tag))
				}
				let priceFilter = true
				if (price > 0) {
					priceFilter = Number(event.price) <= price 
				} else {
					priceFilter = Number(event.price) === 0
				}
				let ageRes = true
				if (ageFilter) {
					ageRes = Number(event.age_restriction) < 18
				}
				return descMatches && priceFilter && isTrending && venueMatches && hasTags && ageRes
			});
			setFilteredEvents(searchFilterList)
			handleClose()
		}
	}

	async function getRecentEvents () {
		const response = await makeRequest('GET', `/event/recent/created/?search=${pageCurrent}`, {}, {})
		if (response === 400 || response === 403 || response === 500 || response === 503) {
			navigate(`/error/${response}`)
		}
		if (response !== undefined) {
			setCurrentEvents(response)
			setPageCurrent(pageCurrent => pageCurrent + 1)
			setIsLoading(false)
		}
	}

	async function loadMoreCurrent() {
		const response = await makeRequest('GET', `/event/recent/created/?search=${pageCurrent}`, {}, {})
		if (response.length === 0) {
			setIsEndCurrent(false)
		} else {
			setTimeout(() => {
				setCurrentEvents([...currentEvents, ...response])
			}, 500)
			setPageCurrent(pageCurrent => pageCurrent + 1)
		}
	}

	async function getPastEvents () {
		const response = await makeRequest('GET', `/event/recent/ended/?search=${pagePast}`, {}, {})
		if (response === 400 || response === 403 || response === 500 || response === 503) {
			navigate(`/error/${response}`)
		}
		if (response !== undefined) {
			setPastEvents(response)
			setPagePast(pagePast => pagePast + 1)
			setIsLoading(false)
		}
	}

	async function loadMorePast() {
		const response = await makeRequest('GET', `/event/recent/ended/?search=${pagePast}`, {}, {})
		if (response.length === 0) {
			setIsEndPast(false)
		} else {
			setTimeout(() => {
				setPastEvents([...pastEvents, ...response])
			}, 500)
			setPagePast(pagePast => pagePast + 1)
		}
	}

	React.useEffect(() => {
		setIsLoading(true);
		getRecentEvents();
		getPastEvents();
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<div style={outer_container}>
				{!token ? <HomeMiddleComponent /> : <Outlet context={token} />}
			</div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth={true}
        		maxWidth='lg'
			>
				<DialogTitle id="alert-dialog-title" style={{margin:"10px", padding:"10px", textAlign: "center", fontWeight:"bold", fontSize:"x-large"}}>
					{"Find your next event by narrowing the search!"}
				</DialogTitle>
				<Divider />
				<DialogContent style={{margin:"10px", padding:"10px"}}>
					<Form>
						<TextField
							id="Event-Description-Input"
							label="Event Description"
							multiline
							fullWidth
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							maxRows={4}
							style={{margin:"5px 0 10px 0"}}
						/>
						<Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword"> 
							<Col>
								<FormControl fullWidth>
									<InputLabel id="Venue-Selector-Label">Venue</InputLabel>
									<Select
										labelId="Venue-Selector-Label"
										id="Venue-Selector"
										value={venue}
										label="Venue"
										onChange={(e) => setVenue(e.target.value)}
									>
										<MenuItem value={"ICC"}>ICC</MenuItem>
										<MenuItem value={"Qudos"}>Qudos</MenuItem>
										<MenuItem value={"Amcor"}>Amcor</MenuItem>
									</Select>
								</FormControl>
							</Col>
						</Form.Group>
						
						<FormControl style={{ width: "100%" }}>
							<InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
							<Select
								labelId="demo-multiple-chip-label"
								id="select-tags"
								multiple
								value={tags}
								onChange={handleTagsChange}
								input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
								renderValue={(selected) => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
									</Box>
								)}
								MenuProps={MenuProps}
							>
							{tagNames.map((name) => (
								<MenuItem
									key={name}
									value={name}
									style={getStyles(name, tags, theme)}
								>
									{name}
								</MenuItem>
							))}
							</Select>
						</FormControl>
						
						<div style={{margin: "10px", paddingTop: '7%'}}>
							<Slider
								aria-label="Always visible"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								getAriaValueText={valuetext}
								step={10}
								marks={marks}
								max={1000}
								valueLabelDisplay="on"
								style={{color: "rgba(255,215, 51)"}}
							/>
						</div>

						<div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
							<FormControlLabel 
								control={<Checkbox checked={trending} onChange={(e) => {setTrending(e.target.checked)}} />} 
								label="Get All Trending Events Only" 
							/>
							<FormControlLabel 
								control={<Checkbox checked={ageFilter} onChange={(e) => {setAgeFilter(e.target.checked)}} />} 
								label="Apply Family-Friendly Filter" 
							/>
						</div>
					</Form>
				</DialogContent>
				<DialogActions>
					<Button variant='contained' color='success' disabled={!everySetted ? true : false} onClick={handleAdvancedFilter} autoFocus>
						Confirm Filters
					</Button>
					<Button variant='contained' color='error' onClick={handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
			{isLoading ? <LoadingComponent />
				: <div style={event_container}>
					<div style={flexRowSpaceBetween}>
						<div style={container1Header}>
							<YellowText text="Events" /> popping right now!
						</div>
					</div>
					<div style={container2}>
						<Paper
							component="form"
							sx={{ display: 'flex', alignItems: 'center', width: 900, backgroundColor: '#F0F0F0' }}
						>
							<Tooltip title="Apply Filter" arrow placement="left">
								<IconButton sx={{ p: '10px' }} onClick={handleClickOpen}>
									<FilterAltSharpIcon />
								</IconButton>
							</Tooltip>
							<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
							<InputBase
								sx={{ ml: 1, flex: 1 }}
								placeholder="Search Huddle..."
								onChange={handleSearch}
								value={searchInput}
							/>
							<IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => goSearch()}>
								<SearchIcon />
							</IconButton>
							<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
							<Tooltip title="Ask HuddleBot" arrow placement="right">
								<IconButton sx={{ p: '10px' }} onClick={handleBotOpen}>
									<LiveHelpSharpIcon />
								</IconButton>
							</Tooltip>
						</Paper>
					</div>
					<div style={flexRowSpaceEvenly}>
						<button style={getTagStyle('Current')} onClick={() => {handleEventState('Current')}}>Current/Future Events 📢 </button>
						<button style={getTagStyle('Past')} onClick={() => {handleEventState('Past')}}>Past Events 📢 </button>
					</div>
					{tagSelected === 'Current' &&
						<InfiniteScroll
							dataLength={currentEvents.length}
							next={loadMoreCurrent}
							hasMore={isEndCurrent}
							height={'410px'}
							hasChildren={true}
							loader={<LinearProgress />}
							endMessage={
								<p style={{ textAlign: 'center' }}>
									<br />
									<b>Yay! This is the end! You have finally seen all the current events. </b>
								</p>
							}
						>
							<Grid container wrap='wrap' justifyContent="space-between" alignItems="center" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
								{currentEvents?.map((event) => (
									<Grid container item xs={12} sm={6} md={4} key={event.id}>
										<HomePageGridItem
											key={event.id}
											name={event.title}
											description={event.description}
											start_date={event.start_date}
											venue={event.venue}
											image={event.event_image}
											tag={event.tags}
											onClick={() => { navigate(`/event/${event.id}/${params.userType}/${params.id}`) }}
										/>
									</Grid>
								))}
							</Grid>
						</InfiniteScroll>
					}
					{tagSelected === 'Past' &&
						<InfiniteScroll
							dataLength={pastEvents.length}
							next={loadMorePast}
							hasMore={isEndPast}
							height={'410px'}
							hasChildren={true}
							loader={<LinearProgress />}
							endMessage={
								<p style={{ textAlign: 'center' }}>
									<br />
									<b>Yay! This is the end! You have finally seen all the past events. </b>
								</p>
							}
						>
							<Grid container wrap='wrap' justifyContent="space-between" alignItems="center" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
								{pastEvents?.map((event) => (
									<Grid container item xs={12} sm={6} md={4} key={event.id}>
										<HomePageGridItem
											key={event.id}
											name={event.title}
											description={event.description}
											start_date={event.start_date}
											venue={event.venue}
											image={event.event_image}
											tag={event.tags}
											onClick={() => { navigate(`/event/${event.id}/${params.userType}/${params.id}`) }}
										/>
									</Grid>
								))}
							</Grid>
						</InfiniteScroll>
					}
					{searchInput.length > 0 && 
						<Grid container wrap='wrap' justifyContent="space-between" alignItems="center" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
							{searchedEvents?.map((event) => (
								<Grid container item xs={12} sm={6} md={4} key={event.id}>
									<HomePageGridItem
										key={event.id}
										name={event.title}
										description={event.description}
										start_date={event.start_date}
										venue={event.venue}
										image={event.event_image}
										tag={event.tags}
										onClick={() => { navigate(`/event/${event.id}/${params.userType}/${params.id}`) }}
									/>
								</Grid>
							))}
						</Grid>
					}
					{applyFilter && 
						<Grid container wrap='wrap' justifyContent="space-between" alignItems="center" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
							{filteredEvents?.map((event) => (
								<Grid container item xs={12} sm={6} md={4} key={event.id}>
									<HomePageGridItem
										key={event.id}
										name={event.title}
										description={event.description}
										start_date={event.start_date}
										venue={event.venue}
										image={event.event_image}
										tag={event.tags}
										onClick={() => { navigate(`/event/${event.id}/${params.userType}/${params.id}`) }}
									/>
								</Grid>
							))}
						</Grid>
					}
				</div>
			}
			<Dialog
				open={openRight}
				onClose={() => {setOpenRight(false)}}
				fullWidth={true}
				maxWidth='xs'
			>
				<DialogContent style={{backgroundColor: '#282c34'}}>
					<div style={{justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '6%'}}>
						<Chatbot
							config={config}
							messageParser={MessageParser}
							actionProvider={ActionProvider}
						/>
					</div>
				</DialogContent>
				<DialogActions style={{justifyContent: 'center', backgroundColor: '#A9A9A9'}}>
					<Button variant='contained' color='error' onClick={() => {setOpenRight(false)}}>End Chat</Button>
				</DialogActions>
			</Dialog>
		</>

	)
}

export default Home