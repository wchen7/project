import React from 'react'

// General
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import HuddleBlackComponent from '../../Components/Huddle/HuddleBlackComponent';
import HuddleTextComponent from '../../Components/Huddle/HuddleTextComponent';

// For Form
import Form from 'react-bootstrap/Form';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

// For Date
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import makeRequest from '../../APIHelper';

// Styles ----------------------------------------------------------------
const container = {
	width: "60%",
	padding: "20px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	textAlign: "center"
}
const signUpText = {
	fontSize: "30px",
	fontWeight: "bold",
	position: "relative"
}

const formContainer = {
	alignSelf: "center",
}

const formInputStyle = {
	padding: "10px",
	width: "500px",
}
const buttonStyle = {
	color: "white",
	backgroundColor: "rgb(255,198,0)",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
}

function RegisterPageRightComponent({ token, setToken }) {
	const navigate = useNavigate();

	const [registerBusiness, setRegisterBusiness] = React.useState(false)

	const [fname, setFName] = React.useState('')
	const [lname, setLName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [confirmPass, setConfirmPass] = React.useState('')
	const [birthday, setBirthday] = React.useState('')
	const [companyName, setCompanyName] = React.useState('')
	const [companyNum, setCompanyNum] = React.useState('')

	const [errorFname, setErrorFname] = React.useState(false);
	const [errorLname, setErrorLname] = React.useState(false);
	const [errorEmail, setErrorEmail] = React.useState(false);
	const [errorPassword, setErrorPassword] = React.useState(false);
	const [errorConfirmPassword, setErrorConfirmPassword] = React.useState(false);

	const [errorCompanyName, setErrorCompanyName] = React.useState(false);
	const [errorCompanyNum, setErrorCompanyNum] = React.useState(false);
	const emailFormat = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

	const handleSubmit = (e) => {
		e.preventDefault();

		let hasError = false;

		if (registerBusiness === true) {
			// Register for Business

			if (companyName.trim() === "") {
				setErrorCompanyName(true);
				hasError = true;
			}

			if (!/^\d+$/.test(companyNum) || companyNum.length !== 10) {
				setErrorCompanyNum(true);
				hasError = true;
			}


			if (!emailFormat.test(email)) {
				setErrorEmail(true);
				hasError = true;
			}

			if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
				setErrorPassword(true);
				hasError = true;
			}

			if (confirmPass !== password) {
				setErrorConfirmPassword(true);
				hasError = true;
			}

			// If it fails any validation checks
			if (hasError) {
				return;
			}

			// Otherwise Should clear all the input fields, navigate and register

			registerHost();
		}
		else {
			// Register for Customer

			// First Name not Empty
			if (fname.trim() === "") {
				setErrorFname(true);
				hasError = true;
			}

			// Last Name not Empty
			if (lname.trim() === "") {
				setErrorLname(true);
				hasError = true;
			}

			if (!emailFormat.test(email)) {
				setErrorEmail(true);
				hasError = true;
			}

			if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
				setErrorPassword(true);
				hasError = true;
			}

			if (confirmPass !== password) {
				setErrorConfirmPassword(true);
				hasError = true;
			}

			// If it fails any validation checks
			if (hasError) {
				return;
			}

			registerCustomer();
		}
	};


	function toggleRegisterBusiness() {
		setRegisterBusiness(!registerBusiness);
	}

	async function registerCustomer() {
		const response = await makeRequest('POST', '/customer/register', {
			email: email,
			first_name: fname,
			last_name: lname,
			password: password,
			birthday: birthday,
		});

		if (response === 403 || response === 500) {
			navigate(`/error/${response}`);
		}
		else {
			setToken(response.token)
			navigate(`/home/customer/${response.customer_id}`)
		}
	}

	async function registerHost() {
		const response = await makeRequest('POST', '/host/register', {
			abn: companyNum,
			name: companyName,
			email: email,
			password: password,
		});

		if (response === 403 || response === 500) {
			navigate(`/error/${response}`);
		}
		else {
			setToken(response.token)
			navigate(`/home/host/${response.host_id}`)
		}
	}

	const handleFirstNameChange = (e) => {
		setFName(e.target.value);
		setErrorFname(false);
	};

	const handleLastNameChange = (e) => {
		setLName(e.target.value);
		setErrorLname(false);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		setErrorEmail(false);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		setErrorPassword(false);
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPass(e.target.value);
		setErrorConfirmPassword(false);
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
	
			setBirthday(`${year}-${month}-${day}`);
		}
	}

	const handleCompanyNameChange = (e) => {
		setCompanyName(e.target.value);
		setErrorCompanyName(false);
	};

	const handleCompanyNumChange = (e) => {
		setCompanyNum(e.target.value);
		setErrorCompanyNum(false);
	};

	return (
		<div style={container}>
			<div style={signUpText}>
				<HuddleBlackComponent />
				Sign Up to <HuddleTextComponent />
			</div>

			<Form className="mb-3" style={formContainer}>
				{!registerBusiness ?
					<>
						<Form.Group style={formInputStyle}>
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

						<Form.Group style={formInputStyle}>
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
					</>
					:
					<>
						<Form.Group style={formInputStyle}>
							<TextField
								id="company_name_input"
								type='textField'
								label="Company Name"
								size="small"
								fullWidth
								onChange={handleCompanyNameChange}
								value={companyName}
								placeholder='Enter Company Name'
								error={errorCompanyName}
								helperText={errorCompanyName ? "Invalid Company Name" : ""}
							/>
						</Form.Group>
						<Form.Group style={formInputStyle}>
							<TextField
								id="company_number_input"
								type='textField'
								label="Australian Company Number (ACN)"
								size="small"
								fullWidth
								onChange={handleCompanyNumChange}
								value={companyNum}
								placeholder='Enter ACN'
								error={errorCompanyNum}
								helperText={errorCompanyNum ? "Invalid Company Number" : ""}
							/>
						</Form.Group>
					</>
				}

				<Form.Group style={formInputStyle}>
					<TextField
						id="email_input"
						type='textField'
						label="Email"
						size="small"
						fullWidth
						value={email}
						onChange={handleEmailChange}
						placeholder='Enter Email'
						error={errorEmail}
						helperText={errorEmail ? "Email Must include an `@` and a `.com`" : ""}
					/>
				</Form.Group>

				<Form.Group style={formInputStyle}>
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

				<Form.Group style={formInputStyle}>
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

				{
					registerBusiness ? <></> :
						<Form.Group style={formInputStyle}>
							<LocalizationProvider dateAdapter={AdapterDayjs} components={['DatePicker']} >
									<DatePicker label="Birthday"
										maxDate={dayjs()}
										onChange={handleDateChange}
									/>
							</LocalizationProvider>
						</Form.Group>
				}

				<div>
					Create Host Account?
					<Switch onClick={() => toggleRegisterBusiness()} />
				</div>

				<Button style={buttonStyle} type="submit" 
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = 'rgb(255, 215, 51)';
						}}
						onMouseLeave={(e) => {
							e.target.style.backgroundColor = 'rgb(255,198,0)';
						}}
						onClick={handleSubmit}>
					Register Account!
				</Button>

			</Form>
		</div>
	)
}

export default RegisterPageRightComponent