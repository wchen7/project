import React from 'react';
import Button from 'react-bootstrap/Button';
import TextField from '@mui/material/TextField';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import makeRequest from '../../APIHelper'

export default function ResetPopUp(props) {
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [resetCodeInput, setResetCodeInput] = React.useState('')
	const [dataCode, setDataCode] = React.useState('')
	const [confirmPassword, setConfirmPassword] = React.useState('')
	const [openInputs, setOpenInputs] = React.useState(false)
	const [newStage, setNewStage] = React.useState(false)
	const [selectedOption, setSelectedOption] = React.useState('')
	const [showPasswordInputs, setShowPasswordInputs] = React.useState(false)
	const [error, setError] = React.useState(false)

	const handleOptionChange = (event) => {
		setSelectedOption(event.target.value);
	};

	async function resetCode() {
		const validEmailFormat = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
		if (validEmailFormat.test(email) && selectedOption.length !== 0) {
			const response = await makeRequest('POST', '/reset_code', {
				email: email,
				tablename: selectedOption
			})
			if (response === 400 || response === 403 || response === 500 || response === 503) {
				setError(true)
			} else {
				setDataCode(response.reset_code)
				setOpenInputs(true)
				setNewStage(true)
				setError(false)
			}
		}
	}

	function checkCode() {
		// If inputResetCode matches the API code
		if (resetCodeInput === dataCode) {
			setShowPasswordInputs(true)
			setError(false)
		} else {
			setShowPasswordInputs(false)
			setError(true)
		}
	}

	async function confirmChanges() {
		const validPasswordFormat = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
		if (selectedOption === 'customer') {
			if (validPasswordFormat.test(password) && password === confirmPassword) {
				await makeRequest('PUT', '/customer/password', {
					email: email,
					tablename: selectedOption,
					new_password: password
				})
				props.onHide()
				setError(false)
				setEmail('')
				setPassword('')
				setResetCodeInput('')
				setConfirmPassword('')
				setShowPasswordInputs(false)
				setNewStage(false)
				setOpenInputs(false)
			} else {
				setError(true)
			}
		} else if (selectedOption === 'host') {
			if (validPasswordFormat.test(password) && password === confirmPassword) {
				await makeRequest('PUT', '/customer/password', {
					email: email,
					tablename: selectedOption,
					new_password: password
				})
				props.onHide()
				setError(false)
				setEmail('')
				setPassword('')
				setResetCodeInput('')
				setConfirmPassword('')
				setShowPasswordInputs(false)
				setNewStage(false)
				setOpenInputs(false)
			} else {
				setError(true)
			}
		}
	}

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Reset Password
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{openInputs
					? (showPasswordInputs
						? <>
							<Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
								<Form.Label column sm={3}>
									New Password
								</Form.Label>
								<Col sm={8}>
									<TextField
										error={error}
										id="Password_input"
										type='password'
										size="small"
										fullWidth
										onChange={e => setPassword(e.target.value)}
										value={password}
										placeholder='Enter your new password'
									/>
									<Form.Text id="passwordHelpBlock" muted>
										Your password must be at least 6 characters long, contain letters and numbers,
										and must not contain spaces, special characters, or emoji.
									</Form.Text>
								</Col>
							</Form.Group>

							<Form.Group as={Row} className="mb-3" controlId="formHorizontalConfirmPassword">
								<Form.Label column sm={3}>
									Confirm Password
								</Form.Label>
								<Col sm={8}>
									<TextField
										error={error}
										id="Confirm_Password_input"
										type='password'
										size="small"
										fullWidth
										onChange={e => setConfirmPassword(e.target.value)}
										value={confirmPassword}
										placeholder='Confirm your new password'
									/>
									<Form.Text id="passwordHelpBlock" muted>
										Your password must match the above.
									</Form.Text>
								</Col>
							</Form.Group>
						</>
						: <>
							<Form.Group as={Row} className="mb-3" controlId="formHorizontalCode">
								<Form.Label column sm={3}>
									Reset Code
								</Form.Label>
								<Col sm={5}>
									<TextField
										error={error}
										id="reset_code_input"
										type='code'
										size="small"
										fullWidth
										onChange={e => setResetCodeInput(e.target.value)}
										value={resetCodeInput}
										placeholder='Enter your reset code'
									/>
									<Form.Text id="codetext" muted>
										The reset code should be found in your email. Beware of case sensitivity when inputting!
									</Form.Text>
								</Col>
								<Col>
									<Button onClick={checkCode}>Check Code</Button>
								</Col>
							</Form.Group>
						</>)
					: <>
						<Form.Label>Please enter your email</Form.Label>
						<TextField
							error={error}
							id="Email_input"
							type='email'
							size="small"
							fullWidth
							onChange={e => setEmail(e.target.value)}
							value={email}
							placeholder='name@example.com'
						/>
						<br />
						<br />
						<FloatingLabel controlId="floatingSelect" label="Are you a customer or a host?">
							<Form.Select aria-label="Floating label select example" onChange={handleOptionChange}>
								<option>Open this select menu</option>
								<option value="customer">Customer</option>
								<option value="host">Host</option>
							</Form.Select>
						</FloatingLabel>
					</>
				}
			</Modal.Body>
			<Modal.Footer>
				<Button variant='danger' onClick={() => {
					props.onHide()
					setNewStage(false)
					setOpenInputs(false)
				}}>Close</Button>
				<Button variant='success' onClick={() => {
					if (newStage === false) {
						resetCode()
					} else {
						confirmChanges()
					}
				}}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
}