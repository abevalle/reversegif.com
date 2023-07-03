import styles from '../styles/Home.module.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
import React, { useState, useRef, useEffect } from 'react'
import DropZone from './DropZone.js';
import Reverse from './reverse.js'
import ReactGA from 'react-ga4'
const gaCode = process.env.TRACKING_ID
ReactGA.initialize("G-MHJ39LXW6P");


export default function Home() {

  const gaEvent = (cat, act) => {
    ReactGA.event({
        category: cat,
        action: act,
        nonInteraction: false
    })
} 

  return (
    <div className={styles.container}>
      <head>
        <title>reverse gif for free</title>
        <meta name="description" content="Free reverse gif tool! Alwaysfree and your files never touch our servers, for complete privacy" key="desc "/>
      </head>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap" rel="stylesheet"/> 
        <Container fluid>
          <Row>
              <Col md={{span: 2, offset: 5}} >
                  <h1 className={styles.webTitle}><a href="/" onClick={gaEvent('header-click', 'header-click')}>reversegif.com</a></h1>
              </Col>
          </Row>
          <DropZone></DropZone>
          {/* <Reverse/> */}
        </Container> 
        <Row>
          <Col md={{span: 1, offset: 5}}>
              <div className={styles.footerText}>
                <Col className='text-center'>
                  <p>reversegif.com by <a style={{color: 'white'}} onClick={gaEvent('abevalle-click', 'abevalle-click')} href="https://abevalle.com">AbeValle</a></p>
                </Col>
              </div>
          </Col>
        </Row>
    </div>
  )
}
