import React from 'react'

import { useParams, useNavigate } from 'react-router-dom'
import makeRequest from '../../../APIHelper';

import ProfilePictureComponent from '../ProfileComponents/ProfilePictureComponent';

import defaultProfilePic from '../../../images/Profile_Icon.png';

import LoadingComponent from '../../../Components/LoadingComponent';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrapPlugin from '@fullcalendar/bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'

const profileContents = {
	width: "100%",
	height: "100vh",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "30px"
}

function HostProfileDetails({ token }) {
	const navigate = useNavigate();
	const params = useParams();
	const todayDate = new Date();

	const userType = params.userType;
	const id = params.id;

	const [loadingState, setLoadingState] = React.useState(false);
	const [allData, setAllData] = React.useState([]);
	const [profilePicture, setProfilePicture] = React.useState(null);
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

	async function getPlannedEvents (year, month) {
		const response = await makeRequest('GET', `/host/events/?date=${year}-${String(month).padStart(2, '0')}&host_id=${id}`, {}, {
			Authorization: `Bearer ${token}`,
		})
		if (response.length !== 0) {
			const uniqueEvents = new Set();
			const newData = []
			response.forEach((data) => {
				if (!uniqueEvents.has(data.id)) {
					uniqueEvents.add(data.id);
					newData.push({
						id: data.id,
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

	async function getPageInfo() {
		const userString = `/${userType}/profile/?${userType}_id=${id}`
		if (userString) {
			const response = await makeRequest(`GET`, `/${userType}/profile/?${userType}_id=${id}`, {}, {
				Authorization: `Bearer ${token}`,
			});

			if (response === 400 || response === 403 || response === 500) {
				navigate(`/error/${response}`);
			}
			else {
				setAllData(response)
				setLoadingState(false)
				if (response.company_pic === null) {
					setProfilePicture(defaultProfilePic)
				} else {
					if (response.company_pic.includes('base64')) {
						setProfilePicture(response.company_pic)
					} else {
						setProfilePicture(defaultProfilePic)
					}
				}
			}
		}
	}

	// API GET
	React.useEffect(() => {
		setLoadingState(true)
		getPageInfo();
		const month = todayDate.getMonth() + 1;
		const year = todayDate.getFullYear()
		getPlannedEvents(year, month)
		// eslint-disable-next-line
	}, []);

	return (
		<div style={profileContents}>
			{
				loadingState ?
					<LoadingComponent />
					:
					<div style={profileContents}>
						<ProfilePictureComponent profilePicture={profilePicture} />
						<h1>{allData.company_name}</h1>
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

export default HostProfileDetails;