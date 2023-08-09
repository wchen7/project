import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EditNoteIcon from '@mui/icons-material/EditNote';
import huddleLogoBlack from '../../../images/huddle-logo-black.png';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

import makeRequest from '../../../APIHelper';

const drawerWidth = 280;

const huddleComponent = {
	backgroundColor: '#EDF1F5',
	border: "none",
	height: "100px",
	textAlign: "center",
}

const huddleLogo = {
	width: "200px",
	height: "50px",
}

export default function PermanentDrawerLeft({ token }) {
	const params = useParams();
	const navigate = useNavigate();
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const handleListItemClick = (index) => {
		setSelectedIndex(index);
	};

	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	// Badges
	const [bigSpender, setBigSpender] = React.useState(0);
	const [musicMaestro, setMusicMaestro] = React.useState(0);
	const [conferenceConnoisseur, setConferenceConnoisseur] = React.useState(0);
	const [helpfulCritic, setHelpfulCritic] = React.useState(0);
	const [sportsFanatic, setSportsFanatic] = React.useState(0);


	async function getChannelsAccess () {
		const response = makeRequest('GET', `/customer/badge/?customer_id=${params.id}`, {},  {
			Authorization: `Bearer ${token}`
		})
		Promise.resolve(response).then((data) => {
			if (data !== undefined && !data.error) {
				setBigSpender(data.big_spender);
				setConferenceConnoisseur(data.conference_connoisseur);
				setHelpfulCritic(data.helpful_critic);
				setSportsFanatic(data.sports_fanatic);
				setMusicMaestro(data.music_maestro);
			}
		})
	}

	React.useEffect(() => {
		if (params.userType === 'customer') {
			getChannelsAccess()
		}
		// eslint-disable-next-line
	},[])

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
						backgroundColor: '#EDF1F5',
						boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)'
					},
				}}
				variant="permanent"
				anchor="left"
			>
				<Button style={huddleComponent} onClick={() => navigate(`/home/${params.userType}/${params.id}`)}>
					<img src={huddleLogoBlack} style={huddleLogo} alt='huddle_image' />
				</Button>
				<Divider />
				<List>
					<ListItemButton
						selected={selectedIndex === 0}
						onClick={() => {
							handleListItemClick(0)
							navigate(`/${params.userType}/profile/${params.id}`, token={token})
						}}
					>
						<ListItemIcon>
							<AssignmentIndIcon />
						</ListItemIcon>
						<ListItemText primary="Profile Overview" />
					</ListItemButton>
					{params.userType === 'customer' &&
						<ListItemButton
							selected={selectedIndex === 1}
							onClick={() => {
								handleListItemClick(1)
								handleClick()
							}}
						>
							<ListItemIcon>
								<Diversity3Icon />
							</ListItemIcon>
							<ListItemText primary="Badge Channels" />
							{open ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>
					}
					<Collapse in={open} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							{
								bigSpender !== 0 &&
								<ListItemButton
									sx={{ pl: 4, pt: 2.5 }}
									selected={selectedIndex === 4}
									onClick={() => {
										handleListItemClick(4)
										navigate(`/${params.userType}/profile/${params.id}/channels/big_spender`, token={token})
									}}
								>
									<ListItemIcon>
										<AttachMoneyIcon />
									</ListItemIcon>
									<ListItemText primary="Big Spender" />
								</ListItemButton>
							}
							{
								musicMaestro !== 0 &&
								<ListItemButton
								sx={{ pl: 4 }}
								selected={selectedIndex === 5}
								onClick={() => {
									handleListItemClick(5)
									navigate(`/${params.userType}/profile/${params.id}/channels/music_maestro`, token={token})
								}}
							>
								<ListItemIcon>
									<MusicNoteIcon />
								</ListItemIcon>
								<ListItemText primary="Music Maestro" />
							</ListItemButton>
							}
							{
								sportsFanatic !== 0 &&
								<ListItemButton
									sx={{ pl: 4 }}
									selected={selectedIndex === 6}
									onClick={() => {
										handleListItemClick(6)
										navigate(`/${params.userType}/profile/${params.id}/channels/sports_fanatic`, token={token})
									}}
								>
									<ListItemIcon>
										<SportsFootballIcon />
									</ListItemIcon>
									<ListItemText primary="Sport Fanatic" />
								</ListItemButton>
							}
							{ conferenceConnoisseur !== 0 &&
								<ListItemButton
									sx={{ pl: 4 }}
									selected={selectedIndex === 7}
									onClick={() => {
										handleListItemClick(7)
										navigate(`/${params.userType}/profile/${params.id}/channels/conference_connoisseur`, token={token})
									}}
								>
									<ListItemIcon>
										<BusinessCenterIcon />
									</ListItemIcon>
									<ListItemText primary="Conference Connoisseur" />
								</ListItemButton>
							}
							{ helpfulCritic !== 0 &&
								<ListItemButton
									sx={{ pl: 4, pb: 2.5 }}
									selected={selectedIndex === 8}
									onClick={() => {
										handleListItemClick(8)
										navigate(`/${params.userType}/profile/${params.id}/channels/helpful_critic`, token={token})
									}}
								>
									<ListItemIcon>
										<EditNoteIcon />
									</ListItemIcon>
									<ListItemText primary="Helpful Critic" />
								</ListItemButton>
							}

						</List>
					</Collapse>
					<ListItemButton
						selected={selectedIndex === 2}
						onClick={() => {
							handleListItemClick(2)
							navigate(`/${params.userType}/profile/${params.id}/edit`)
						}}
					>
						<ListItemIcon>
							<EditIcon />
						</ListItemIcon>
						<ListItemText primary="Edit Profile" />
					</ListItemButton>
				</List>
			</Drawer>
		</Box>
	);
}