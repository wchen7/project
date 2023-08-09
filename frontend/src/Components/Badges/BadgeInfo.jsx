import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import BadgeInfoComponent from './BadgeInfoComponent';
import Container from 'react-bootstrap/Container';

const titleStyle = {
	fontWeight: "bold",
	textAlign: "center",
	margin: '0 auto',
	width: '100%',
	fontSize: '35px'
}

export default function ShowBadgeInfo(props) {
	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby="contained-modal-title-vcenter"
			style={{ marginLeft: '10%', textAlign: "center" }}
		>
			<Modal.Header closeButton>
				<Modal.Title style={titleStyle} id="contained-modal-title-vcenter">
					Badge Information
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<BadgeInfoComponent />
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}