import React from 'react'

import Avatar from '@mui/material/Avatar';
const container = {
    padding: "10px",
    width: "500px",
    borderRadius: "10px",
    backgroundColor: "rgb(252,196,196)",
}

const bottomContainer = {
    textAlign: "start",
    padding: "5px",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
    backgroundColor: "rgba(252,196,196, 8)",
}

function otherMessage(name, profilepic, message, time, tier) {

    const showTime = new Date((new Date(time)).getTime() + ((new Date(time)).getTimezoneOffset() * 60000)).toLocaleString('en-AU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: "Australia/Sydney"
	})
    const getStyle = () => {
        switch (tier) {
            case 1:
                return {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "5px 10px 5px 10px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(205, 127, 50, 1)"
                }
            case 2:
                return {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "5px 10px 5px 10px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(192, 192, 192, 1)"
                }
            case 3:
                return {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "5px 10px 5px 10px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 215, 0, 1)"
                }
            default:
                return {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "5px 10px 5px 10px",
                    borderRadius: "10px",
                }
        }
    }

    const topContainer = getStyle();
    return (
        <div style={container}>
                <div style={topContainer}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                        <div style={{margin: "0 5px 0 5px"}}>
                            <Avatar alt='profile_pic' src={profilepic} style={{width: "25px", height: "25px"}} />
                        </div>
                        <div style={{color: "white", fontWeight: "bolder"}}>
                            {name}
                        </div>
                    </div>
                    <div>
                        {showTime}
                    </div>
                </div>
                <div style={bottomContainer}>
                    {message}
                </div>
        </div>
    )
}

export default otherMessage