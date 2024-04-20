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
          <Container fluid>
            <Row>
                <Col md={{span: 6, offset: 3}} className={styles.privacy}>
                    <Container className={styles.privacytext}>
                    <h1>Privacy Policy</h1>
                    <h2>1. Introduction</h2>
                    <p>Welcome to ReverseGif.com. We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy outlines our practices concerning handling your information collected during your visit and interaction with our website.</p>

                    <h2>2. Information Collection and Use</h2>
                    <p>At ReverseGif.com, we do not collect or store personal data on our servers, such as GIFs or other files. All processing is carried out locally within your browser. This means:</p>
                    <ul>
                        <li><strong>Local Processing:</strong> Any data you provide while using our services, such as images or GIFs for reverse processing, is handled directly within your browser. No such data is transmitted to or stored on our servers.</li>
                        <li><strong>Data Sharing for Advertising and Analytics:</strong> While we do not store data on our servers, we may share non-personally identifiable information with Google for advertising and analytics purposes. This data helps us understand user interactions with our site and optimize your experience.</li>
                    </ul>

                    <h2>3. Data Sharing and Disclosure</h2>
                    <p>Since no personal data is stored on our servers, there is no personal data to share or disclose to third parties except for analytics and advertising purposes with Google.</p>

                    <h2>4. Data Security</h2>
                    <p>Data security is implemented through local processing. Your data does not leave your device, ensuring it remains under your control and reducing the risk of unauthorized access.</p>

                    <h2>5. User Rights</h2>
                    <p>As we do not collect or store personal data on our servers, no direct actions are required to manage your data on our site. However, you always maintain complete control over your information when using our services.</p>

                    <h2>6. Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about our privacy practices.</p>

                    <h2>7. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@reversegif.com">hello@reversegif.com</a>.</p>

                    <p>By using ReverseGif.com, you acknowledge that you have read and understand this Privacy Policy. Thank you for choosing to use our services.</p>
                    </Container>
                </Col>
            </Row>
          </Container>
          <Footer></Footer>
        </Container> 
    </div>
  )
}