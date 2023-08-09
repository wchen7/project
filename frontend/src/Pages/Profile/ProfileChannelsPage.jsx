import React from 'react'

import { useParams } from 'react-router-dom'
import makeRequest from '../../APIHelper'

import Button from 'react-bootstrap/Button';
import PermanentDrawerLeft from './Sidebar/PermSideBar';

import ownMessage from './Channels/ownMessage';
import otherMessage from './Channels/otherMessage';
import { TextField } from '@mui/material';
import moment from 'moment-timezone';

import Filter from "bad-words"

import InfiniteScroll from "react-infinite-scroll-component";
import LinearProgress from '@mui/material/LinearProgress';
import LoadingComponent from '../../Components/LoadingComponent';

const container = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-evenly",
	height: "100vh",
	borderRadius: "10px",
	padding: "20px",
}

const channelContainer = {
	border: "1px solid",
	padding: "10px",
	width: "80vw",
	borderRadius: "10px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
}

const messageContainer = {
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
	height: "100vh",
	padding: "20px",
	margin: "20px",
	borderRadius: "10px",
	border: "1px solid",
}

const ownMessageContainer = {
	display: "flex",
	justifyContent: "flex-end",
	padding: "5px",
}

const otherMessageContainer = {
	display: "flex",
	justifyContent: "flex-start",
	padding: "5px",

}

const textboxContent = {
	width: "100%",
	height: "100%",
	borderRadius: "10px",
	border: "none",
	padding: "5px"
}

const textboxContainer = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	marginTop: "10px",
	height: "10vh",
	borderRadius: "10px",
	margin: "10px",
	padding: "5px",
}

const channelHeader = {
	backgroundColor: "rgb(230,179,1)",
	padding: "10px",
	fontSize: "x-large",
	fontWeight: "bolder",
	color: "white",
	borderRadius: "10px",
	margin: "10px",
	textAlign: "center"
}

const buttonStyle = {
	color: "white",
	backgroundColor: "rgb(255,198,0)",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
}

function ProfileChannelsPage({ token }) {

	const params = useParams();
	const channelName = params.channelName;
	const [badgeData, setBadgeData] = React.useState([]);
	const [loadingState, setLoadingState] = React.useState(true);
	const [muteTimer, setMuteTimer] = React.useState(0);

	const displayChannelName = channelName.split('_').map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}).join(' ');


	//Infinite Scroll
	const [page, setPage] = React.useState(1);
	const [isEnd, setIsEnd] = React.useState(true)

	// Getting Messages
	const [allMessages, setAllMessages] = React.useState([]);

	async function getMoreMessages() {
		const response = await makeRequest('GET', `/channel/message/get?badge_channel=${channelName}&search=${page}`, {}, {
			Authorization: `Bearer ${token}`
		})
		if (response.length === 0) {
			setIsEnd(false)
		} else {
			setTimeout(() => {
				setAllMessages([...allMessages, ...response])
			}, 500)
			setPage(page => page + 1)
		}
	}
 
	async function loadInitalMessages() {
		const response = await makeRequest('GET', `/channel/message/get?badge_channel=${channelName}&search=${1}`, {}, {
			Authorization: `Bearer ${token}`
		})
		setAllMessages(response)
		setPage(2)
		setIsEnd(true)
	}

	// Sending Messages

	const filter = new Filter();

	const [senderMessage, setSenderMessage] = React.useState('')
	const [errorMessage, setErrorMessage] = React.useState(false)

	const [senderDisabled, setSenderDisabled] = React.useState(false)

	const handleSenderMessageChange = (e) => {
		setSenderMessage(e.target.value)
		setErrorMessage(false)
	}


	const sendMessageButton = (e) => {
		let hasError = false;

		if (senderMessage.trim() === "") {
			setErrorMessage(true)
			hasError = true
		}

		if (filter.isProfane(senderMessage)) {
			setErrorMessage(true)
			hasError = true
		}

		if (hasError) {
			return;
		}

		sendMessage()
		// Disable Sending Privileges
		setSenderDisabled(true)

		if (badgeData[channelName] === 3) {
			// Gold arent Timed Out
			setSenderDisabled(false);
		}
		else if (badgeData[channelName] === 2) {
			// Silver Timed Out for 30 Sec
			setMuteTimer(30)
			setTimeout(() => { setSenderDisabled(false); }, 30000);
		}
		else {
			// Bronze Timed Out for 1 Min
			setMuteTimer(60)
			setTimeout(() => { setSenderDisabled(false); }, 60000);

		}
	}

	async function sendMessage() {
		const now = moment().tz('Australia/Sydney');
		const nowISOString = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

		await makeRequest('POST', `/channel/message/send`, {
			token: token,
			message: senderMessage,
			timestamp: nowISOString,
			badge_channel: channelName,
		})
		setSenderMessage("")
		loadInitalMessages();
	}

	async function getChannelsAccess() {
		const response = await makeRequest('GET', `/customer/badge/?customer_id=${params.id}`, {}, {
			Authorization: `Bearer ${token}`
		})
		setBadgeData(response)
		setLoadingState(false)
	}


	React.useEffect(() => {
		setLoadingState(true);
		getChannelsAccess();
		loadInitalMessages();
		// eslint-disable-next-line
	}, [params.channelName])

	React.useEffect(() => {
		const interval = setInterval(() => {
			if (muteTimer > 0) {
				setMuteTimer(muteTimer => muteTimer - 1);
			}
		}, 930)
		if (muteTimer === 0) {
			clearInterval(interval)
		}
		return () => clearInterval(interval);
	}, [muteTimer])

	return (
		<div style={container}>
			<PermanentDrawerLeft token={token} />
			<div style={channelContainer}>
				<div style={channelHeader}>{displayChannelName}</div>
				{
					loadingState ? <LoadingComponent />
					:
					<div
						id="scrollableDiv"
						style={messageContainer}
					>
						<InfiniteScroll
							style={{display: "flex", flexDirection: "column-reverse"}}
							dataLength={allMessages.length}
							next={getMoreMessages}
							inverse={true}
							hasMore={isEnd}
							hasChildren={true}
							loader={<LinearProgress />}
							scrollableTarget="scrollableDiv"
							endMessage={
								<p style={{ textAlign: 'center' }}>
									<br />
									<b>Yay! This is the end! You have been caught up in the channel! </b>
								</p>
							}
						>
							{
								allMessages.map((item) => (
									<div key={item.id}>
										{
											item.customer === params.id &&
											<div style={ownMessageContainer}>
												{ownMessage(item.full_name, item.profile_picture, item.message, item.timestamp, badgeData[channelName])}
											</div>
										}

										{
											item.customer !== params.id &&
											<div style={otherMessageContainer}>
												{otherMessage(item.full_name, item.profile_picture, item.message, item.timestamp, item[channelName])}
											</div>
										}
									</div>
								))
							}
						</InfiniteScroll>
					</div>
				}

				<div style={textboxContainer}>
					<TextField
						style={textboxContent}
						onChange={handleSenderMessageChange}
						value={senderMessage}
						placeholder={muteTimer === 0 ? 'Your Message Here' : `You still have ${muteTimer} seconds until you can message again!`}
						error={errorMessage}
						helperText={errorMessage ? "You can't send an empty message or have inappropraite words" : ""}
						disabled={senderDisabled}
					/>
					<Button onClick={sendMessageButton}
						style={buttonStyle}
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = 'rgb(255, 215, 51)';
						}}
						onMouseLeave={(e) => {
							e.target.style.backgroundColor = 'rgb(255,198,0)';
						}}
						disabled={senderDisabled}
					>
						Send Message! 
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ProfileChannelsPage