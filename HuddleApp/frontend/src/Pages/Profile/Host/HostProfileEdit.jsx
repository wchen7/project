import React from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import TextField from '@mui/material/TextField';
import fileToDataUrl from '../../../ImageProcesser';
import ProfilePictureComponent from '../ProfileComponents/ProfilePictureComponent';
import defaultProfilePic from '../../../images/Profile_Icon.png';
import makeRequest from '../../../APIHelper';

import LoadingComponent from '../../../Components/LoadingComponent';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useNavigate, useParams } from 'react-router-dom';

const container = {
	width: "100%",
	height: "100vh",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "30px",
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
  

function HostProfileEdit({ token, setToken }) {
	const navigate = useNavigate();
	const params = useParams();

	const userType = params.userType;
	const id = params.id;

	const [loadingState, setLoadingState] = React.useState(true);

	// GENERAL INFORMATION ol for onload
	const [ol_companyName, set_ol_companyName] = React.useState("");
	const [ol_profilePic, set_ol_profilePic] = React.useState('');

	// FORM
	const [companyName, setCompanyName] = React.useState('');
	const [profilePicture, setProfilePicture] = React.useState(null);
	const [password, setPassword] = React.useState("")
	const [confirmPass, setConfirmPass] = React.useState("")

	const [errorCompanyName, setErrorCompanyName] = React.useState(false);
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
				Authorization: `Bearer ${token}`,
			});

			if (response === 400 || response === 403 || response === 500) {
				navigate(`/error/${response}`);
			}
			else {
				set_ol_companyName(response.company_name);
				if (response.company_pic === null) {
					set_ol_profilePic(defaultProfilePic)
				} else {
					if (response.company_pic.includes('base64')) {
						set_ol_profilePic(response.company_pic);
					} else {
						set_ol_profilePic(defaultProfilePic)
					}
				}

				setCompanyName(response.company_name)
			}
		}
		setLoadingState(false)

	}

	// Handling Changes ----------------------------------------------------------------

	const handleCompanyNameChange = (e) => {
		setCompanyName(e.target.value);
		setErrorCompanyName(false);
	};

	const handleProfilePicture = (e) => {
		e.preventDefault();
		const imagestring = fileToDataUrl(e.target.files[0])

		imagestring.then((data) => {
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

	async function deleteProfile() {
		const response = await makeRequest('DELETE', `/host/delete`, {}, {
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

		if (companyName !== null) {
			// First Name not Empty
			if (companyName.trim() === "") {
				setErrorCompanyName(true);
				hasError = true;
			}
		}

		if (password !== "" || confirmPass !== "") {
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

		updateHostInfo();
	}
	async function updateHostInfo() {
		let tempPassword = password;
		if (password === "" && confirmPass === "") {
			tempPassword = null;
		}

		const response = await makeRequest('PUT', '/host/update', {
			token: token,
			company_name: companyName,
			company_number: null,
			email: null,
			password: tempPassword,
			company_picture: profilePicture,
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
						<h1> Edit Host Profile </h1>
						<ProfilePictureComponent profilePicture={ol_profilePic} />
						<h3> Welcome {ol_companyName} </h3>

						<Form className="mb-3">
							<Form.Group
								controlId="formFile"
								className="mb-3"
								style={inputBox}
							>
								<Form.Label> Upload New Profile Picture </Form.Label>
								<Form.Control type="file" onChange={handleProfilePicture} />
							</Form.Group>

							<Form.Group
								style={inputBox}
							>
								<TextField
									id="company_name_input"
									type='textField'
									label="Company Name"
									size="small"
									fullWidth
									value={companyName}
									onChange={handleCompanyNameChange}
									placeholder='Enter Company Name'
									error={errorCompanyName}
									helperText={errorCompanyName ? "Invalid Company Name" : ""}
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
								</Form.Group>

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

export default HostProfileEdit