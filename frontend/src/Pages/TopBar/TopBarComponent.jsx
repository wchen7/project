import React from 'react'

import TopBarRegisterComponent from './TopBarRegisterComponent';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

import TopBarLoggedIn from './TopBarLoggedIn';
import huddleLogoBlack from '../../images/huddle-logo-black.png';
import defaultProfilePic from '../../images/Profile_Icon.png';
import makeRequest from '../../APIHelper';

const container = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	textAlign: "center",
	height: "100px",
	width: "100vw",
}

const content = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	padding: "0 60px 0 30px"
}

const huddleButton = {
	border: "none",
	backgroundColor: "transparent",
	padding: "10px",
}

const huddleLogo = {
	width: "200px",
	height: "50px",
}

function TopBarComponent({ token, setToken }) {
	const navigate = useNavigate();
	const params = useParams();

	const [profilePic, setProfilePic] = React.useState('')
	const [name, setName] = React.useState('')
	const [badgesData, setBadgeData] = React.useState([])

	function tokenNavigation() {
		if (token) {
			navigate(`/home/${params.userType}/${params.id}`)
		} else {
			navigate('/')
		}
	}

	async function getUserInfo() {
		if (params.userType === 'customer') {
			const response = await makeRequest('GET', `/${params.userType}/profile/?${params.userType}_id=${params.id}`, {}, {
				Authorization: `Bearer ${token}`,
			});
			if (response === 400 || response === 403 || response === 500) {
				navigate(`/error/${response}`)
			}
			if (response !== undefined) {
				setName(`${response.first_name} ${response.last_name}`)
				if (response.profile_pic === null) {
					setProfilePic(defaultProfilePic)
				} else {
					if (response.profile_pic.includes('base64')) {
						setProfilePic(response.profile_pic)
					} else {
						setProfilePic(defaultProfilePic)
					}
				}
			}

			const badgeResponse = await makeRequest('GET', `/customer/badge/?customer_id=${params.id}`, {}, {
				Authorization: `Bearer ${token}`,
			});
			if (badgeResponse === 400 || badgeResponse === 403 || badgeResponse === 500) {
				navigate(`/error/${badgeResponse}`)
			}
			if (badgeResponse !== undefined) {
				setBadgeData(badgeResponse)
			}


		} else if (params.userType === 'host') {
			const response = await makeRequest('GET', `/${params.userType}/profile/?${params.userType}_id=${params.id}`, {}, {
				Authorization: `Bearer ${token}`,
			});
			if (response === 400 || response === 403 || response === 500) {
				navigate(`/error/${response}`)
			}
			if (response !== undefined) {
				setName(response.company_name)
				if (response.company_pic === null) {
					setProfilePic(defaultProfilePic)
				} else {
					if (response.company_pic.includes('base64')) {
						setProfilePic(response.company_pic)
					} else {
						setProfilePic(defaultProfilePic)
					}
				}
			}
		}
	}

	React.useEffect(() => {
		if (token) {
			getUserInfo()
		}
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<div style={container}>
				<div style={content}>
					<button type='button' style={huddleButton} onClick={() => tokenNavigation()}>
						<img src={huddleLogoBlack} style={huddleLogo} alt='huddle_image' />
					</button>
					{token ?
						<TopBarLoggedIn token={token} setToken={setToken} profImage={profilePic} name={name} badgesData={badgesData}/> :
						<TopBarRegisterComponent />
					}
				</div>
			</div>
			<Outlet context={token} />
		</>

	)
}

export default TopBarComponent