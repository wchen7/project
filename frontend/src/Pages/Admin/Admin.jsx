import React from 'react'

import makeRequest from '../../APIHelper'

import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import axios from 'axios';


// Tabs
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// SnackBar
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Loading
import LoadingComponent from '../../Components/LoadingComponent';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const container = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: "20px",
    margin: "20px",
}

const tabStyle ={
	padding: "20px",
}

const tableHeaders = {
	fontSize: "x-large",
	fontWeight: "bolder",
	padding: "10px 0 10px 0",
	width: 'calc(25% - 10px)'
}

const customerContainer = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "20px",
	margin: "10px",
}

const customerStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	padding: "5px",
	margin: "5px",

}

const hostContainer = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "20px",
	margin: "10px",
}

const hostStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	padding: "5px",
	margin: "5px",
}

const eventContainer = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-evenly",
	padding: "20px",
	margin: "10px",
}

const eventStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	padding: "5px",
	margin: "5px",
}

const buttonStyle = {
	backgroundColor: "rgba(203, 41, 41, 0.8)",
	margin: "0px calc(25% - 260px)",
	width: '200px',
	height: "50px",
	border: "none",
	cursor: 'pointer',
	transition: 'background-color 0.3s ease', 
}

const logOutButtonStyle = {
	color: "white",
	backgroundColor: "rgba(203, 41, 41, 0.8)",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
}

function Admin({ token, setToken }) {
	const [allCustomerData, setAllCustomerData]= React.useState([])
	const [allHostData, setAllHostData]= React.useState([])

	//Events
	const [allEventsData, setAllEventsData]= React.useState([])

	const navigate = useNavigate();

	// Snackbar
	const [open, setOpen] = React.useState(false);
	const [snackBarMessage, setSnackBarMessage] = React.useState("")

	// Loading
	const [isLoading, setIsLoading] = React.useState(false)

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		return;
		}
		setOpen(false);
	};

	// Tabs
	const [value, setValue] = React.useState('1');

	const handleChange = (event, newValue) => {
	  setValue(newValue);
	};

	// API Calls
	async function logout() {
		await axios.post('/logout', {
			token: token,
		  }, {
			  headers: {
				  'Content-type': 'application/json',
			  }
		  })
			setToken(null)
			navigate('/')
		
	}

	async function getAllCustomerData () {
		const response = await makeRequest(`GET`, `/admin/customer_list`, {}, {
			Authorization: `Bearer ${token}`,
		});

		Promise.resolve(response).then(data => {
			if (data !== undefined && !data.error) {
				setAllCustomerData(data)
			}
		})
	}

	async function deleteCustomer (id, first_name, last_name) {
		const response = await makeRequest(`DELETE`, `/admin/customer/delete/?customer_id=${id}`, {}, {
			Authorization: `Bearer ${token}`,
		});

		Promise.resolve(response).then(data => {
			if (data !== undefined && !data.error) {
				getAllCustomerData()
				setSnackBarMessage(`The Customer Account ${first_name} ${last_name} has been deleted!`)
				setOpen(true)
			}
		})
	}

	async function getAllHostData () {
		const response = await makeRequest(`GET`, `/admin/host_list`, {}, {
			Authorization: `Bearer ${token}`,
		});

		Promise.resolve(response).then(data => {
			if (data !== undefined && !data.error) {
				setAllHostData(data)
			}
		})
	}

	async function deleteHost (id, company_name) {
		const response = await makeRequest(`DELETE`, `/admin/host/delete/?host_id=${id}`, {}, {
			Authorization: `Bearer ${token}`,
		});

		Promise.resolve(response).then(data => {
			if (data !== undefined && !data.error) {
				getAllHostData()
				getAllEventsData()
				setSnackBarMessage(`The Host Account ${company_name} has been deleted!`)
				setOpen(true)
			}
		})
	}

	async function getAllEventsData () {
		const response = await makeRequest(`GET`, `/event/all`, {}, {
			Authorization: `Bearer ${token}`,
		});

		Promise.resolve(response).then(data => {
			if (data !== undefined && !data.error) {
				setAllEventsData(data)
				setIsLoading(false);
			}
		})
	}

	async function deleteEvent (id, title) {
		const response = await makeRequest(`DELETE`, `/admin/event/delete/?event_id=${id}`, {}, {
			Authorization: `Bearer ${token}`,
		});

		Promise.resolve(response).then(data => {
			if (data !== undefined && !data.error) {
				getAllEventsData()
				setSnackBarMessage(`The Event ${title} has been deleted!`)
				setOpen(true)
			}
		})
	}

	React.useEffect(() => {
		setIsLoading(true);
		getAllCustomerData()
		getAllHostData()
		getAllEventsData()
		// eslint-disable-next-line
	}, [])

  return (
	<>
		{
			isLoading ? <LoadingComponent/>
		:
		<div style={container}>
			<div style={{display: "flex", flexDirection:"row", justifyContent:"space-between", borderRadius: "10px", backgroundColor: "rgb(230,179,1)", fontSize: "xx-large", fontWeight:"bolder", color: "white", padding:"10px"}}>
				<div style={{display: "flex", flexDirection:"column", justifyContent:"center", width: "100vw"}}>
					Admin
				</div>
				<div>

					<Button 
						style={logOutButtonStyle} 
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = 'rgb(242,81,57)';
						}}
						onMouseLeave={(e) => {
							e.target.style.backgroundColor = 'rgba(203, 41, 41, 0.8)';
						}}
						onClick={logout}
					>
						Logout!
					</Button>
				</div>
			</div>


			<div style={{ width: '100%' }}>
			<TabContext value={value} >
				<TabList onChange={handleChange} style={tabStyle} centered>
					<Tab label="Manage Customers" value="1" />
					<Tab label="Manage Hosts" value="2" />
					<Tab label="Manage Events" value="3" />
				</TabList>

				<TabPanel value="1">
					<div style={customerContainer}>
						<div style={customerStyle}>
							<div style={tableHeaders}>
								Full Name
							</div>
							<div style={tableHeaders}>
								Customer Id
							</div>
							<div style={tableHeaders}>
								Delete Customer Account
							</div>
						</div>
						{
							allCustomerData.map(customer => (
								<div style={customerStyle} key={customer.id}>
									<p style={{	width: 'calc(25% - 10px)',}}> {customer.first_name} {customer.last_name}</p>
									<p style={{	width: 'calc(25% - 10px)',}}> {customer.id}</p>
									<Button style={buttonStyle} 
											onMouseEnter={(e) => {
												e.target.style.backgroundColor = 'rgb(242,81,57)';
											}}
											onMouseLeave={(e) => {
												e.target.style.backgroundColor = 'rgba(203, 41, 41, 0.8)';
											}}
											onClick={() => deleteCustomer(customer.id, customer.first_name, customer.last_name)}>
										Delete this Customer!
									</Button>
								</div>
							))
						}
					</div>
				</TabPanel>
				<TabPanel value="2">
					<div style={hostContainer}>
						<div style={hostStyle}>
							<div style={tableHeaders}>
								Company Name
							</div>
							<div style={tableHeaders}>
								Company Number
							</div>
							<div style={tableHeaders}>
								Host Id
							</div>
							<div style={tableHeaders}>
								Delete Host Account
							</div>
						</div>
						{
							allHostData.map(host => (
								<div style={hostStyle} key={host.id}>
									<p style={{	width: 'calc(25% - 10px)',}}>
										{host.company_name}
									</p>
									<p style={{	width: 'calc(25% - 10px)',}}>
										{host.company_number}
									</p>
									<p style={{	width: 'calc(25% - 10px)'}}>
										{host.id}
									</p>
									<Button style={buttonStyle}
										onMouseEnter={(e) => {
											e.target.style.backgroundColor = 'rgb(242,81,57)';
										}}
										onMouseLeave={(e) => {
											e.target.style.backgroundColor = 'rgba(203, 41, 41, 0.8)';
										}}
										onClick={() => deleteHost(host.id, host.company_name)}>
										Delete this Host!
									</Button>
								</div>
							))
						}
					</div>
				</TabPanel>
				<TabPanel value="3">
					<div style={eventContainer}>
						<div style={eventStyle}>
							<div style={tableHeaders}>
								Event Image
							</div>
							<div style={tableHeaders}>
								Event Name
							</div>
							<div style={tableHeaders}>
								Delete Event
							</div>
						</div>
						{
							allEventsData.map(event => (
								<div style={eventStyle} key={event.id}>
									<p style={{	width: 'calc(25% - 10px)', alignSelf: "center"}}>
										<img style={{height: "100px", width: "200px"}} alt="Event" src={event.event_image}/>
									</p>
									<p style={{	width: 'calc(25% - 10px)'}}>
										{event.title}
									</p>
									<Button style={buttonStyle}
										onMouseEnter={(e) => {
											e.target.style.backgroundColor = 'rgb(242,81,57)';
										}}
										onMouseLeave={(e) => {
											e.target.style.backgroundColor = 'rgba(203, 41, 41, 0.8)';
										}}
										onClick={() => deleteEvent(event.id, event.title)}>
										Delete this Event!
									</Button>
								</div>
							))
						}
					</div>
				</TabPanel>
			</TabContext>
			</div>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
					{snackBarMessage}
				</Alert>
			</Snackbar>
		</div>
		}
	</>
    
  )
}

export default Admin