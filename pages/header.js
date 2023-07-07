import styles from '../styles/Home.module.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
import React, { useState, useRef, useEffect } from 'react'
import DropZone from './DropZone.js';
import ReactGA from 'react-ga4'
const gaCode = process.env.TRACKING_ID
ReactGA.initialize("G-MHJ39LXW6P");


export default function Header() {

  const gaEvent = (cat, act) => {
    ReactGA.event({
        category: cat,
        action: act,
        nonInteraction: false
    })
} 

  return (
    <Row>
        <Col md={{span: 12}} >
            <h1 className={styles.webTitle}><a href="/" onClick={gaEvent('header-click', 'header-click')}>reversegif.com</a></h1>
        </Col>
    </Row>
  )
}
