import React from 'react'
import Tooltip from '@mui/material/Tooltip';

import emptyBadge from '../../images/Badges/EmptyBadge.png';

import BigSpenderT1 from '../../images/Badges/BigSpenderT1.png';
import BigSpenderT2 from '../../images/Badges/BigSpenderT2.png';
import BigSpenderT3 from '../../images/Badges/BigSpenderT3.png';
import ConferenceConnoisseurT1 from '../../images/Badges/ConferenceConnoisseurT1.png';
import ConferenceConnoisseurT2 from '../../images/Badges/ConferenceConnoisseurT2.png';
import ConferenceConnoisseurT3 from '../../images/Badges/ConferenceConnoisseurT3.png';
import HelpfulCriticT1 from '../../images/Badges/HelpfulCriticT1.png';
import HelpfulCriticT2 from '../../images/Badges/HelpfulCriticT2.png';
import HelpfulCriticT3 from '../../images/Badges/HelpfulCriticT3.png';
import MusicMaestroT1 from '../../images/Badges/MusicMaestroT1.png';
import MusicMaestroT2 from '../../images/Badges/MusicMaestroT2.png';
import MusicMaestroT3 from '../../images/Badges/MusicMaestroT3.png';
import SportsFanaticT1 from '../../images/Badges/SportsFanaticT1.png';
import SportsFanaticT2 from '../../images/Badges/SportsFanaticT2.png';
import SportsFanaticT3 from '../../images/Badges/SportsFanaticT3.png';

const badgeStyle = {
	width: "100px",
	height: "100px",
	padding: "10px",
	borderRadius: "50%",
	overflow: "hidden",
	border: "1px solid black",
	margin: "10px"
}

const tooptipStyle = {
	fontSize: "20px",
	fontWeight: "bold",
	textAlign: "center",
}

function BadgeComponent({ badge, tier }) {
	let [displayText, setDisplayText] = React.useState("You Haven't Earned this Badge Yet!")
	let [badgeImage, setBadgeImage] = React.useState(emptyBadge)

	React.useEffect(() => {
		switch (true) {
			case tier === 0:
				break;
			case "big_spender" === badge && tier === 3:
				setBadgeImage(BigSpenderT3)
				setDisplayText("Awarded to customers who has spent at least $500!");
				break;
			case "big_spender" === badge && tier === 2:
				setBadgeImage(BigSpenderT2)
				setDisplayText("Awarded to customers who has spent at least $250!");
				break;
			case "big_spender" === badge && tier === 1:
				setBadgeImage(BigSpenderT1);
				setDisplayText("Awarded to customers who has spent at least $100!");
				break;
			case "music_maestro" === badge && tier === 3:
				setBadgeImage(MusicMaestroT3)
				setDisplayText("Awarded to customers who has attended at least 10 music event!");
				break;
			case "music_maestro" === badge && tier === 2:
				setBadgeImage(MusicMaestroT2)
				setDisplayText("Awarded to customers who has attended at least 5 music event!");
				break;
			case "music_maestro" === badge && tier === 1:
				setBadgeImage(MusicMaestroT1)
				setDisplayText("Awarded to customers who has attended at least 1 music event!");
				break;
			case "conference_connoisseur" === badge && tier === 3:
				setBadgeImage(ConferenceConnoisseurT3)
				setDisplayText("Earned by customers who have attended at least 10 professional or industry conferences!");
				break;
			case "conference_connoisseur" === badge && tier === 2:
				setBadgeImage(ConferenceConnoisseurT2)
				setDisplayText("Earned by customers who have attended at least 5 professional or industry conferences!");
				break;
			case "conference_connoisseur" === badge && tier === 1:
				setBadgeImage(ConferenceConnoisseurT1)
				setDisplayText("Earned by customers who have attended at least 1 professional or industry conferences!");
				break;
			case "helpful_critic" === badge && tier === 3:
				setBadgeImage(HelpfulCriticT3)
				setDisplayText("Given to customers who have left at least 10 review!");
				break;
			case "helpful_critic" === badge && tier === 2:
				setBadgeImage(HelpfulCriticT2)
				setDisplayText("Given to customers who have left at least 5 review!");
				break;
			case "helpful_critic" === badge && tier === 1:
				setBadgeImage(HelpfulCriticT1)
				setDisplayText("Given to customers who have left at least 1 review!");
				break;
			case "sports_fanatic" === badge && tier === 3:
				setBadgeImage(SportsFanaticT3)
				setDisplayText("Awarded to customers who have attended at least 10 sports event!");
				break;
			case "sports_fanatic" === badge && tier === 2:
				setBadgeImage(SportsFanaticT2)
				setDisplayText("Awarded to customers who have attended at least 5 sports event!");
				break;
			case "sports_fanatic" === badge && tier === 1:
				setBadgeImage(SportsFanaticT1)
				setDisplayText("Awarded to customers who have attended at least 1 sports event!");
				break;
		}
	}, [badge, tier])

	return (
		<Tooltip title={
			<div style={tooptipStyle}>
				{displayText}
			</div>
		} arrow>
			<img src={badgeImage} style={badgeStyle} alt="Badge" />
		</Tooltip>
	)
}

export default BadgeComponent 