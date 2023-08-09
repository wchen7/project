import React from 'react'

import fileToDataUrl from '../../../ImageProcesser';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import defaultProfilePic from '../../../images/Profile_Icon.png';
import makeRequest from '../../../APIHelper';

import LoadingComponent from '../../../Components/LoadingComponent';

import ProfilePictureComponent from '../ProfileComponents/ProfilePictureComponent';

import { useNavigate, useParams } from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const container = {
	width: "100%",
	height: "100vh",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "30px",
	alignItems: "center"
}

const BtnStyle = {
	width: "25%",
	justifyContent: 'space-evenly'
}

const rowStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-evenly",
}

const inputBox = {
	padding: "10px",

	
}

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  

function CustomerProfileEdit({ token, setToken }) {
	const navigate = useNavigate();
	const params = useParams();

	const userType = params.userType;
	const id = params.id;

	const [loadingState, setLoadingState] = React.useState(true);

	// GENERAL INFORMATION ol for onload
	const [ol_fname, set_ol_fname] = React.useState("");
	const [ol_lname, set_ol_lname] = React.useState("");
	const [ol_profile_pic, set_ol_profile_pic] = React.useState('');

	// FORM
	const [fname, setFName] = React.useState("");
	const [lname, setLName] = React.useState("");
	const [password, setPassword] = React.useState("")
	const [confirmPass, setConfirmPass] = React.useState("")
	const [profilePicture, setProfilePicture] = React.useState(null);

	const [notifications, setNotifications] = React.useState(true);
	const [saveInfo, setSaveInfo] = React.useState(true);

	const [errorFname, setErrorFname] = React.useState(false);
	const [errorLname, setErrorLname] = React.useState(false);
	const [errorPassword, setErrorPassword] = React.useState(false);
	const [errorConfirmPassword, setErrorConfirmPassword] = React.useState(false);

	//SnackBar
	const [open, setOpen] = React.useState(false);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	async function getPageInfo() {
		const userString = `/${userType}/profile/?${userType}_id=${id}`
		if (userString) {
			const response = await makeRequest(`GET`, `/${userType}/profile/?${userType}_id=${id}`, {}, {
				Authorization: `Bearer ${token}`
			});

			if (response === 400 || response === 403 || response === 500) {
				navigate(`/error/${response}`);
			}
			else {
				set_ol_fname(response.first_name);
				set_ol_lname(response.last_name);
				if (response.profile_pic === null) {
					set_ol_profile_pic(defaultProfilePic)
				} else {
					if (response.profile_pic.includes('base64')) {
						set_ol_profile_pic(response.profile_pic);
					} else {
						set_ol_profile_pic(defaultProfilePic)
					}
				}
				setFName(response.first_name)
				setLName(response.last_name)

			}
		}
		setLoadingState(false)
	}

	// Handling Changes ----------------------------------------------------------------

	const handleFirstNameChange = (e) => {
		setFName(e.target.value);
		setErrorFname(false);
	};

	const handleLastNameChange = (e) => {
		setLName(e.target.value);
		setErrorLname(false);
	};

	const handleProfilePicture = (e) => {
		e.preventDefault();
		const imageString = fileToDataUrl(e.target.files[0])
		imageString.then((data) => {
			setProfilePicture(data);
		})
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		setErrorPassword(false);
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPass(e.target.value);
		setErrorConfirmPassword(false);
	}

	const handleToggleNotifications = () => {
		setNotifications(!notifications);
	}

	const handleToggleSaveInfo = () => {
		setSaveInfo(!saveInfo);
	}

	async function deleteProfile() {
		const response = await makeRequest('DELETE', `/customer/delete`, {}, {
			Authorization: `Bearer ${token}`,
		})

		if (response === 403 || response === 500) {
			navigate(`/error/${response}`);
		}
		else {
			setToken(null);
			navigate("/")
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		let hasError = false;
		
		if (fname !== null) {
			// First Name not Empty
			if (fname.trim() === "") {
				setErrorFname(true);
				hasError = true;
			}
		}
		
		if (lname !== null) {
			// Last Name not Empty
			if (lname.trim() === "") {
				setErrorLname(true);
				hasError = true;
			}
		}
		
		// if (password !== null && confirmPass !== null) {
		if (password !== "" || confirmPass !== ""){
			if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
				setErrorPassword(true);
				hasError = true;
			}
			
			if (confirmPass !== password) {
				setErrorConfirmPassword(true);
				hasError = true;
			}
		}
		
		if (hasError) {
			return;
		}
		
		updateCustomerInfo();
	}
	
	async function updateCustomerInfo() {
		let tempPassword = password;
		if (password === "" && confirmPass === "") {
			tempPassword = null;
		}

		const response = await makeRequest('PUT', '/customer/update', {
			token: token,
			first_name: fname,
			last_name: lname,
			email: null,
			password: tempPassword,
			profile_picture: profilePicture,
			card_details: null,
			points: null,
		})

		if (response === 403 || response === 500) {
			navigate(`/error/${response}`);
		}
		else {
			setOpen(true);
			getPageInfo();
		}
	}


	// API GET
	React.useEffect(() => {
		getPageInfo();
		// eslint-disable-next-line
	}, []);

	return (
		<div style={container}>
			{
				loadingState ?
					<LoadingComponent />
					:
					<div style={container}>
						<h1> Edit Profile </h1>
						<ProfilePictureComponent profilePicture={ol_profile_pic} />
						<h3> Welcome {ol_fname} {ol_lname} </h3>
						
						<Form className="mb-3">
							<Form.Group
								style={inputBox}
								controlId="formFile"
								className="mb-3"
							>
								<Form.Label> Upload New Profile Picture </Form.Label>
								<Form.Control type="file" onChange={handleProfilePicture} />
							</Form.Group>

							<Form.Group
								style={inputBox}
							>
								<TextField
									id="fname_input"
									type='textField'
									label="First Name"
									size="small"
									fullWidth
									value={fname}
									onChange={handleFirstNameChange}
									placeholder='Enter First Name'
									error={errorFname}
									helperText={errorFname ? "Invalid First Name" : ""}
								/>
							</Form.Group>

							<Form.Group
								style={inputBox}
							>
								<TextField
									id="lname_input"
									type='textField'
									label="Last Name"
									size="small"
									fullWidth
									value={lname}
									onChange={handleLastNameChange}
									placeholder='Enter Last Name'
									error={errorLname}
									helperText={errorLname ? "Invalid Last Name" : ""}
								/>
							</Form.Group>

							<div style={rowStyle}>
								<Form.Group
									style={inputBox}
								>
									<TextField
										id="password_input"
										type='password'
										label="Password"
										size="small"
										fullWidth
										value={password}
										onChange={handlePasswordChange}
										placeholder='Enter Password'
										error={errorPassword}
										helperText={errorPassword ? "Please Enter Password with more than 6 Characters, 1 Capital and 1 Number" : ""}
									/>
									

								</Form.Group></div>	<br/>
							<div>
								<Form.Group
									style={inputBox}
								>
									<TextField
										id="confirm_password_input"
										type='password'
										label="Confirm Password"
										size="small"
										fullWidth
										onChange={handleConfirmPasswordChange}
										value={confirmPass}
										placeholder='Retype Password'
										error={errorConfirmPassword}
										helperText={errorConfirmPassword ? "Your Passwords do not match" : ""}
									/>
								</Form.Group>
							</div>
							
							<div>
								Receive Notifications?
								<Switch onClick={() => handleToggleNotifications()} />
							</div>
							<div>
								Remember your payment information?
								<Switch onClick={() => handleToggleSaveInfo()} />
							</div>

							<Button variant="warning" type="submit" onClick={handleSubmit}>
								Save Changes!
							</Button>
						</Form>
						<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
							<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
								You Have successfully edited your profile!
							</Alert>
						</Snackbar>
						
						<Button style={BtnStyle} variant="danger" onClick={() => deleteProfile()}> Delete Profile</Button>
						
					</div>
			}
		</div>
	)
}

export default CustomerProfileEdit