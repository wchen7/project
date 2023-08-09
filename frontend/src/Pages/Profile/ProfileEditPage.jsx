import React from 'react'

import CustomerProfileEdit from './Customer/CustomerProfileEdit';
import HostProfileEdit from './Host/HostProfileEdit';

import { useParams } from 'react-router-dom';
import PermanentDrawerLeft from './Sidebar/PermSideBar';

const container = {
	display: "flex",
	flexDirection: "row",
	textAlign: "center",
}


function ProfileEditPage({ token, setToken }) {
	const params = useParams();
	return (
		<div style={container}>
			<PermanentDrawerLeft token={token} />

			{
				params.userType === "customer" && <CustomerProfileEdit token={token} setToken={setToken} />
			}
			{
				params.userType === "host" && <HostProfileEdit token={token} setToken={setToken} />
			}
		</div>
	)
}

export default ProfileEditPage