import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TextField } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Points(props) {
	const [open, setOpen] = React.useState(false);
	const [tempPoints, setTempPoints] = React.useState(0);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function handleRedeem() {
		if (tempPoints <= props.points) {
			props.setPoints(tempPoints);
		}
		setOpen(false);
	}

	function handleChange(e) {
		if (e.target.value <= props.points) {
			setTempPoints(e.target.value)
		}
	}

	return (
		<div>
			<Button variant="outlined" onClick={handleClickOpen}>
				Learn more about points
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"How Points Work In Huddle"}</DialogTitle>
				<DialogContent>
					<>
						<DialogContentText style={{ marginBottom: '15px' }}>
							Congratulations, you will earn {Math.floor(Number(props.cost))} points after this booking!
						</DialogContentText>
						<DialogContentText id="alert-dialog-slide-description" style={{ marginBottom: '5px' }}>
							You currently have {props.points === 0 ? props.points + ' points.' : props.points + ' points to redeem. Do you want to redeem it?'}
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="points"
							label="Points to Redeem"
							type="number"
							fullWidth
							variant="standard"
							value={tempPoints}
							onChange={handleChange}
						/>
						{tempPoints > 0 &&
							<DialogContentText style={{ marginTop: '25px' }}>
								By redeeming {tempPoints} points, you are saving ${tempPoints * 0.01} from the final booking price!
								Congratulations!
							</DialogContentText>
						}
					</>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
					<Button onClick={handleRedeem}>Redeem</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}