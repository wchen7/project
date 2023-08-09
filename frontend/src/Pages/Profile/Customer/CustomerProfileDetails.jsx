import React from 'react'

import { useParams, useNavigate } from 'react-router-dom'

import makeRequest from '../../../APIHelper';

import BadgeComponent from '../../../Components/Badges/BadgeComponent';
import defaultProfilePic from '../../../images/Profile_Icon.png';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrapPlugin from '@fullcalendar/bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'

import ProfilePictureComponent from '../ProfileComponents/ProfilePictureComponent';
import UComponent from '../../../Components/Huddle/UComponent';
import LoadingComponent from '../../../Components/LoadingComponent';

import ShowBadgeInfo from '../../../Components/Badges/BadgeInfo';
import { Button } from 'react-bootstrap';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const profileContents = {
	width: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "30px"
}

const pointsContainer = {
	width: "200px",
	height: "50px",
	backgroundColor: "rgb(228, 228, 49)",
	borderRadius: "10px",
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
	alignSelf: "center",
	padding: "10px"

}

const circularButton = {
	width: "95px",
	height: "95px",
	borderRadius: "50%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	marginLeft: '10%'
}

const pointsStyle = {
	color: "white",
	fontSize: "larger",
	fontWeight: "bold",
}

const badgesContainer = {
	display: "flex",
	flexDirection: "row",
	alignSelf: "center",
}

function CustomerProfileDetails({ token }) {
	const params = useParams();
	const navigate = useNavigate();
	const todayDate = new Date();
	const userType = params.userType;
	const id = params.id;

	const [loadingState, setLoadingState] = React.useState(true);
	const [modalShow, setModalShow] = React.useState(false);


	// Customer --------------------------------------------------------
	const [fname, setFname] = React.useState('');
	const [lname, setLname] = React.useState('');
	const [points, setPoints] = React.useState(-111);
	const [profilePicture, setProfilePicture] = React.useState("");

	// Past & Upcoming Events
	const [dateData, setDateData] = React.useState([])

	const handleEventClick = (info) => {
		navigate(`/event/${info.event._def.publicId}/${params.userType}/${params.id}`)
	};

	async function handleCalenderChanges (info) {
		const month = info.view.currentStart.getMonth() + 1;
		const year = info.view.currentStart.getFullYear();
		if (info.view.type === 'dayGridMonth') {
			getPlannedEvents(year, month)
		}
	}

	const [badgesData, setBadgesData] = React.useState(null)
	async function getBadges() {
		const response = await makeRequest('GET', `/channel/customer`, {}, {
			Authorization: `Bearer ${token}`
		})
		setBadgesData(response)
	}

	async function getPageInfo() {
		if (userType !== null && id !== null) {
			const userString = `/${userType}/profile/?${userType}_id=${id}`
			if (userString) {
				const response = await makeRequest(`GET`, `/${userType}/profile/?${userType}_id=${id}`, {}, {
					Authorization: `Bearer ${token}`,
				});

				if (response === 400 || response === 403 || response === 500) {
					navigate(`/error/${response}`);
				}
				else {
					await Promise.all(response.events.map(async (counter) => {
						const counterData = await makeRequest('GET', `/event/?event_id=${counter}`, {}, {});
						return { ...counter, ...counterData }
					}))
					setFname(response.first_name);
					setLname(response.last_name);
					setPoints(response.points);
					if (response.profile_pic === null) {
						setProfilePicture(defaultProfilePic)
					} else {
						if (response.profile_pic.includes('base64')) {
							setProfilePicture(response.profile_pic)
						} else {
							setProfilePicture(defaultProfilePic)
						}
					}
				}
			}
		}
		setLoadingState(false)
	}

	async function getPlannedEvents (year, month) {
		const response = await makeRequest('GET', `/customer/events/?date=${year}-${String(month).padStart(2, '0')}`, {}, {
			Authorization: `Bearer ${token}`,
		})
		if (response.length !== 0) {
			const uniqueEvents = new Set();
			const newData = []
			response.forEach((data) => {
				if (!uniqueEvents.has(data.event)) {
					uniqueEvents.add(data.event);
					newData.push({
						id: data.event,
						title: data.title,
						start: data.start_date,
						end: data.end_date,
					})
				}
			})
			setDateData(newData)
		} else {
			setDateData(response)
		}
	}

	React.useEffect(() => {
		getPageInfo();
		getBadges();
		const month = todayDate.getMonth() + 1;
		const year = todayDate.getFullYear()
		getPlannedEvents(year, month)
		// eslint-disable-next-line
	}, []);

	return (
		<div style={profileContents}>
			{
				loadingState ? <LoadingComponent />
					:
					<div style={profileContents}>
						<ProfilePictureComponent profilePicture={profilePicture} />

						<h1> {fname} {lname} </h1>

						<div style={pointsContainer}>
							<div style={pointsStyle}>
								{points} <UComponent /> Points
							</div>
						</div>

						<div style={badgesContainer}>
							<BadgeComponent badge={"big_spender"} tier={badgesData.big_spender} />
							<BadgeComponent badge={"conference_connoisseur"} tier={badgesData.conference_connoisseur} />
							<BadgeComponent badge={"helpful_critic"} tier={badgesData.helpful_critic} />
							<BadgeComponent badge={"music_maestro"} tier={badgesData.music_maestro} />
							<BadgeComponent badge={"sports_fanatic"} tier={badgesData.sports_fanatic} />
							<div style={badgesContainer}>
								<Button variant="outline-info" size='lg' onClick={() => setModalShow(true)} style={circularButton}>
									<QuestionMarkIcon style={{ fontSize: '70px' }} />
								</Button>
							</div>
						</div>

						<ShowBadgeInfo
							show={modalShow}
							onHide={() => setModalShow(false)}
						/>

						<FullCalendar
							plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin, timeGridPlugin]}
							initialView="dayGridMonth"
							timeZone='Australia/Sydney'
							events={dateData}
							eventClick={handleEventClick}
							datesSet={handleCalenderChanges}
							themeSystem={"bootstrap"}
							headerToolbar={{ left: "prev,next today", center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
							dayHeaderFormat={{ weekday: "long" }}
							height={870}
						/>

					</div>
			}
		</div>

	)
}

export default CustomerProfileDetails