import styles from '../styles/Home.module.css';
import React, { useState, useRef } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container } from 'react-bootstrap'

const DropZone = () => {
    const [files, setfiles] = useState(null)
    const inputRef = useRef();

    const handleDragOver = (event) => {
        event.preventDefault();
    }
    const handleDrop = (event) => {
        event.preventDefault();
        console.log(event.dataTransfer.files)

    };

  return (
        <>
            {!files && (
                <Container fluid>
                <Row>
                    <Col md={{span: 2, offset: 5}} >
                        <h1 className={styles.webTitle}>reversegif.com</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={{span: 10, offset: 1}}>
                    <div className={styles.dropToUpload} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => inputRef.current.click()}>
                        <h1>drop your gif/click here</h1>
                        <input type="files" onChange={(event) => setfiles(event.target.files)} hidden ref={inputRef}/>
                    </div>
                    </Col>
                </Row>
                <div className={styles.footerText}>
                    <p>reversegif.com by <a href="abevalle.com">AbeValle</a></p>
                </div>
                </Container>
            )}
        </>
  )
}

export default DropZone;