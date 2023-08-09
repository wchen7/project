import React from 'react'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import BadgeComponent from './BadgeComponent';

const container = {
    borderRadius: "10px",
    alignSelf: "center",
}

const headerStyle = {
    fontSize: "25px",
    fontWeight: "bold",
    alignSelf: "center",
}

function BadgeInfoComponent () {
  return (
    <div style={container}>
        <Container>
            <Row>
                <Col>
                </Col>
                <Col style={headerStyle}>
                    Tier 1
                </Col>
                <Col style={headerStyle}>
                    Tier 2
                </Col>
                <Col style={headerStyle}>
                    Tier 3
                </Col>
            </Row>
            <Row>
                <Col style={headerStyle}>
                    Big Spender
                </Col>
                <Col>
                    <BadgeComponent badge={"big_spender"} tier={1}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"big_spender"} tier={2}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"big_spender"} tier={3}/>
                </Col>
            </Row>
            <Row>
                <Col style={headerStyle}>
                    Music Maestro
                </Col>
                <Col>
                    <BadgeComponent badge={"music_maestro"} tier={1}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"music_maestro"} tier={2}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"music_maestro"} tier={3}/>
                </Col>
            </Row>
            <Row>
                <Col style={headerStyle}>
                    Conference Connoisseur
                </Col>
                <Col>
                    <BadgeComponent badge={"conference_connoisseur"} tier={1}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"conference_connoisseur"} tier={2}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"conference_connoisseur"} tier={3}/>
                </Col>
            </Row>
            <Row>
                <Col style={headerStyle}>
                    Helpful Critic
                </Col>
                <Col>
                    <BadgeComponent badge={"helpful_critic"} tier={1}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"helpful_critic"} tier={2}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"helpful_critic"} tier={3}/>
                </Col>
            </Row>
            <Row>
                <Col style={headerStyle}>
                    Sports Fanatic
                </Col>
                <Col>
                    <BadgeComponent badge={"sports_fanatic"} tier={1}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"sports_fanatic"} tier={2}/>
                </Col>
                <Col>
                    <BadgeComponent badge={"sports_fanatic"} tier={3}/>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default BadgeInfoComponent 