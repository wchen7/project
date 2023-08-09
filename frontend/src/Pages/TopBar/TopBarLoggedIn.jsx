import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';

import Logout from '@mui/icons-material/Logout';

// Badges
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EditNoteIcon from '@mui/icons-material/EditNote';

const container = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
}

const contents = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
    alignItems: "center",
    width: "fit-content",
    height: "50px",
	backgroundColor: "white",
    alignSelf: "center",
    borderRadius: "10px",
    border: "none",
	fontWeight: "bold",
	fontSize: "larger",
	padding: "15px 30px"
  }


function TopBarLoggedIn ({ token, setToken, profImage, name, badgesData}) {
    const navigate = useNavigate();
    const params = useParams();

	// Badges
	const [bigSpender, setBigSpender] = React.useState(0);
	const [musicMaestro, setMusicMaestro] = React.useState(0);
	const [conferenceConnoisseur, setConferenceConnoisseur] = React.useState(0);
	const [helpfulCritic, setHelpfulCritic] = React.useState(0);
	const [sportsFanatic, setSportsFanatic] = React.useState(0);

	// Dropdown
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
	  setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
	  setAnchorEl(null);
	};

    async function logout () {
      await axios.post('/logout', {
        token: token,
      }, {
          headers: {
              'Content-type': 'application/json',
          }
      })
	  handleClose()
      setToken(null)
      navigate('/')
    }

	React.useEffect(() => {
		if (params.userType === 'customer' && badgesData.length !== 0) {
			setBigSpender(badgesData.big_spender)
			setConferenceConnoisseur(badgesData.conference_connoisseur)
			setMusicMaestro(badgesData.music_maestro)
			setHelpfulCritic(badgesData.helpful_critic)
			setSportsFanatic(badgesData.sports_fanatic)
		}
		// eslint-disable-next-line
	}, [badgesData])

  return (
    <div style={container}>
		<Tooltip title="Profile" style={contents}>
			<Button 
				onClick={handleClick}>
				<Avatar alt='profile_pic' src={profImage} style={{marginRight: "20px"}}/>
				<div style={{color: "black"}}>
					{name}
				</div>
			</Button>
		</Tooltip>
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			onClick={handleClose}
			transformOrigin={{ horizontal: 'center', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
		>
		<MenuItem>
			<ListItemButton
				onClick={() => {
					navigate(`/${params.userType}/profile/${params.id}/`, token={token})
				}}>

			<ListItemIcon>
				<AssignmentIndIcon />
			</ListItemIcon>
			<ListItemText primary="Profile Page" />
			</ListItemButton>
		</MenuItem>

		{badgesData.length > 0 && <Divider/>}
		{ bigSpender !== 0 &&
			<MenuItem>
				<ListItemButton
					onClick={() => {
						navigate(`/${params.userType}/profile/${params.id}/channels/big_spender`, token={token})
					}}>

					<ListItemIcon>
						<AttachMoneyIcon />
					</ListItemIcon>
					<ListItemText primary="Big Spender" />
				</ListItemButton>	
			</MenuItem>
		}
		{ musicMaestro !== 0 &&
			<MenuItem>
				<ListItemButton
					onClick={() => {
						navigate(`/${params.userType}/profile/${params.id}/channels/music_maestro`, token={token})
				}}>
					<ListItemIcon>
						<MusicNoteIcon />
					</ListItemIcon>
					<ListItemText primary="Music Maestro" />
				</ListItemButton>
			</MenuItem>
		}
		{ sportsFanatic !== 0 &&
			<MenuItem>
				<ListItemButton onClick={() => {
				navigate(`/${params.userType}/profile/${params.id}/channels/sports_fanatic`, token={token})
			}}>
					<ListItemIcon>
						<SportsFootballIcon />
					</ListItemIcon>
					<ListItemText primary="Sport Fanatic" />
				</ListItemButton>
			</MenuItem>
		}
		{ conferenceConnoisseur !== 0 &&
			<MenuItem>
				<ListItemButton onClick={() => {
					navigate(`/${params.userType}/profile/${params.id}/channels/conference_connoisseur`, token={token})
				}}>
					<ListItemIcon>
						<BusinessCenterIcon />
					</ListItemIcon>
					<ListItemText primary="Conference Connoisseur" />
				</ListItemButton>
			</MenuItem>
		}
		{ helpfulCritic !== 0 &&
			<MenuItem>
				<ListItemButton onClick={() => {
					navigate(`/${params.userType}/profile/${params.id}/channels/helpful_critic`, token={token})
				}}
				>
					<ListItemIcon>
						<EditNoteIcon />
					</ListItemIcon>
					<ListItemText primary="Helpful Critic" />
				</ListItemButton>
			</MenuItem>
		}

		<Divider />
        <MenuItem>
			<ListItemButton  onClick={() => {
				navigate(`/${params.userType}/profile/${params.id}/edit`, token={token}, setToken={setToken})
			}}>
				<ListItemIcon>
					<EditIcon fontSize="small"/>
				</ListItemIcon>
				Edit Profile
			</ListItemButton>
        </MenuItem>
		<Divider />
        <MenuItem>
			<ListItemButton onClick={logout}>
				<ListItemIcon>
					<Logout fontSize="small" />
				</ListItemIcon>
				Logout
			</ListItemButton>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default TopBarLoggedIn