import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ModeToggleButton({ alignment, setAlignment }) {

	const handleChange = (event, newAlignment) => {
		if (newAlignment !== null) {
			setAlignment(newAlignment);
		}
	};

	return (
		<ToggleButtonGroup
			color="info"
			size='large'
			fullWidth
			value={alignment}
			exclusive
			onChange={handleChange}
			aria-label="Platform"
		>
			<ToggleButton value="customer">Customer</ToggleButton>
			<ToggleButton value="host">Host</ToggleButton>
			<ToggleButton value="admin">Admin</ToggleButton>
		</ToggleButtonGroup>
	);
}