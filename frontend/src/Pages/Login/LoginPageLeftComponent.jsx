import React from 'react'
import HuddleBlackComponent from '../../Components/Huddle/HuddleBlackComponent'
import HuddleTextComponent from '../../Components/Huddle/HuddleTextComponent'
import ModeToggleButton from './ModeSwitcher'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ResetPopUp from './PasswordResetter';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../../APIHelper';
import TextField from '@mui/material/TextField';

// Styling ----------------------------------------------------------------
const container = {
	width: "60%",
	padding: "20px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	textAlign: "center",
	marginTop: "-5px",
}

const signInText = {
	fontSize: "30px",
	fontWeight: "bold",
	padding: "20px",
}

const formContainer = {
	textAlign: "center",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	alignSelf: "center",
	padding: "20px",
	width: "400px",
}

const forgotPasswordButton = {
	fontSize: "smaller",
	backgroundColor: "white",
	border: "none",
}

const buttonStyle = {
	color: "white",
	backgroundColor: "rgb(255,198,0)",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
}

function LoginPageLeftComponent({ token, setToken }) {
	const navigate = useNavigate();
	const [alignment, setAlignment] = React.useState('customer');
	const [modalShow, setModalShow] = React.useState(false);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState(false);
	const [emailText, setEmailText] = React.useState('');
	const [passwordText, setPasswordText] = React.useState('');

	const handleSubmit = () => {
		if (alignment === 'customer') {
			customer()
		} else if (alignment === 'host') {
			host()
		} else {
			admin()
		}
	};

	async function customer() {
		const response = await makeRequest('POST', '/customer/login', {
			email: email,
			password: password,
		})
		if (response === 400 || response === 403 || response === 500) {
			setError(true)
			setEmailText(`Your email is not correct. Try making a new ${alignment} account`)
			setPasswordText(`Your password is not correct. Try making a new ${alignment} account or resetting the password.`)
		} else {
			setToken(response.token)
			navigate(`/home/customer/${response.customer_id}`)
		}
	}

	async function host() {
		const response = await makeRequest('POST', '/host/login', {
			email: email,
			password: password,
		})
		if (response === 400 || response === 403 || response === 500) {
			setError(true)
			setEmailText(`Your email is not correct. Try making a new ${alignment} account`)
			setPasswordText(`Your password is not correct. Try making a new ${alignment} account or resetting the password.`)
		} else {
			setToken(response.token)
			navigate(`/home/host/${response.host_id}`)
		}
	}

	async function admin() {
		const response = await makeRequest('POST', '/admin/login', {
			email: email,
			password: password,
		})
		if (response === 400 || response === 403 || response === 500) {
			setError(true)
			setEmailText(`Your email is not correct. Try making a new ${alignment} account`)
			setPasswordText(`Your password is not correct. Try making a new ${alignment} account or resetting the password.`)
		} else {
			setToken(response.token)
			// Goto control page
			navigate(`/admin/${response.admin_id}`)
		}
	}


	return (
		<div style={container}>
			<ModeToggleButton alignment={alignment} setAlignment={setAlignment} />
			<div>
				<HuddleBlackComponent />
				<div style={signInText}>
					Sign In to <HuddleTextComponent />
				</div>
			</div>
			<Form style={formContainer}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<TextField
						error={error}
						id="Email_input"
						type='email'
						label="Email"
						size="small"
						fullWidth
						onChange={e => setEmail(e.target.value)}
						value={email}
						placeholder='Enter email'
						helperText={emailText}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicPassword">
					<TextField
						error={error}
						id="Password_input"
						type='password'
						label="Password"
						size="small"
						fullWidth
						onChange={e => setPassword(e.target.value)}
						value={password}
						placeholder='Enter password'
						helperText={passwordText}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicForgotPassword">
					<Button style={forgotPasswordButton} variant="link" onClick={() => setModalShow(true)}>
						Forgot your Password?
					</Button>
					<ResetPopUp
						show={modalShow}
						onHide={() => setModalShow(false)}
					/>
				</Form.Group>
				<Button style={buttonStyle} 
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = 'rgb(255, 215, 51)';
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = 'rgb(255,198,0)';
					}}
					onClick={handleSubmit}
				>
					Log In!
				</Button>
			</Form>
		</div>
	)
}

export default LoginPageLeftComponent