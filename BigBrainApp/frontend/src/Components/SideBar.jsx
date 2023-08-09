import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { grey } from '@mui/material/colors';

export default function SideBar (props) {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: grey[100], height: '100vh', position: 'sticky' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <div>
              {props.children}
            </div>
          </ListItem>
        </List>
      </nav>
      <Divider />
    </Box>
  );
}
