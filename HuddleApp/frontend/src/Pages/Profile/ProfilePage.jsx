import React from 'react'
import { useParams } from 'react-router-dom';

import CustomerProfileDetails from './Customer/CustomerProfileDetails';
import HostProfileDetails from './Host/HostProfileDetails';
import PermanentDrawerLeft from './Sidebar/PermSideBar';

const container = {
	display: "flex",
	flexDirection: "row",
	textAlign: "center",
}

function ProfilePage({ token }) {
	const params = useParams();
	return (
		<div style={container}>
			<PermanentDrawerLeft token={token}/>

			{
				params.userType === "customer" && <CustomerProfileDetails token={token} />
			}
			{
				params.userType === "host" && <HostProfileDetails token={token} />
			}
		</div>
	)
}

export default ProfilePage