import styles from '../styles/Home.module.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
import DropZone from './DropZone.js';
import Reverse from './reverse.js'

export default function Home() {
  return (
    <div className={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap" rel="stylesheet"/> 
        <Container fluid>
          <Row>
              <Col md={{span: 2, offset: 5}} >
                  <h1 className={styles.webTitle}><a href="/">reversegif.com</a></h1>
              </Col>
          </Row>
          <DropZone></DropZone>
          {/* <Reverse/> */}
        </Container>
        <Row>
          <Col md={{span: 1, offset: 5}}>
              <div className={styles.footerText}>
                <Col>
                  {/* <p>reversegif.com by <a href="abevalle.com">AbeValle</a></p> */}
                </Col>
              </div>
          </Col>
        </Row>
    </div>
  )
}