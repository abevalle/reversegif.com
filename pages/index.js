import styles from '../styles/Home.module.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
import React, { useState, useRef, useEffect } from 'react'
import DropZone from './DropZone.js';
import ReactGA from 'react-ga4'
import Header from './header.js'
import Footer from './footer.js'
import Head from 'next/head'
import Script from 'next/script'
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
      <Head>
        <title>Reversegif.com | Reverse a Gif for FREE!</title>
        <meta name="title" content="Reverse a gif for free | reversegif.com"/>
        <meta name="description" content="reversegif.com: Easily reverse GIFs in 3 steps. Drag, drop, and click to reverse. Local secure video encoding. Try it now!"/>
        <meta name="keywords" content="reversegif, reverse a gif, gif, backwards gif, rewind a gif, gif reverse, gifs reversed, reversing a gif"/>
        <meta name="robots" content="index, follow"/>
        <meta name="language" content="English"/>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7359270153499473" crossorigin="anonymous"/>
        <Script type="text/javascript" src="/static/arial.ttf.js"/>
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap" rel="stylesheet"/> 
        <Container fluid>
          <Header></Header>
          <DropZone></DropZone>
          {/* <Reverse/> */}
          <Footer></Footer>
        </Container> 
    </div>
  )
}
