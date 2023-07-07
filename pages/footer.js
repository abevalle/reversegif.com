import styles from '../styles/Home.module.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
import React, { useState, useRef, useEffect } from 'react'
import DropZone from './DropZone.js';
import ReactGA from 'react-ga4'
const gaCode = process.env.TRACKING_ID
ReactGA.initialize("G-MHJ39LXW6P");


export default function Footer() {

  const gaEvent = (cat, act) => {
    ReactGA.event({
        category: cat,
        action: act,
        nonInteraction: false
    })
} 

  return (
    <Row>
    <Col md={{span: 12}}>
        <div className={styles.footerText}>
          <Col className='text-center'>
            <p>reversegif.com by <a style={{color: 'white'}} onClick={gaEvent('abevalle-click', 'abevalle-click')} href="https://abevalle.com">AbeValle</a></p>
          </Col>
        </div>
    </Col>
  </Row>
  )
}
