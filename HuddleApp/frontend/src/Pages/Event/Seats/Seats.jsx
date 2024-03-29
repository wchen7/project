import React from 'react';
import './SeatsLayout.css';

const Seats = (props) => {

	return (
		<div className="section">
			{props.values.map(seat => {
				const isAvailable = props.availableSeats.includes(seat);
				const isBooked = props.bookedSeats.includes(seat);
				let seatClass = 'seat';
				if (!isAvailable) {
					seatClass = 'disabled';
				}
				if (isBooked) {
					seatClass = 'booked';
				}
				return (
					<div className={seatClass} onClick={props.addSeat} key={seat}>{seat}</div>
				);
			})}
		</div>
	);
}
export default Seats;