import {createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
const ffmpeg = createFFmpeg({log: true, corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"})
import styles from '../styles/Home.module.css';
import React, { useState, useRef, useEffect } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
// import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGif, faLight } from '@fortawesome/pro-solid-svg-icons'


const DropZone = () => {
    const [files, setFiles, setSelectedImage, selectedImage] = useState(null)
    const inputRef = useRef();
    const [ready, setReady] = useState(false)
    const [video, setVideo] = useState()
    const [reversed, setReversed] = useState()

    const load = async () => {
        await ffmpeg.load();
        setReady(true)
    }

    useEffect(() => {
        load();
    }, [])

    const handleDragOver = (event) => {
        event.preventDefault();
    }
    const handleDrop = (event) => {
        event.preventDefault();
        setFiles(event.dataTransfer.files)
        console.log(event.dataTransfer.files)

    };

    const reverseGif = (files) => {
        Array.from(files).map((file, idx) => {
            ffmpeg.FS('writeFile', file.name, fetchFile(video))
            ffmpeg.run('-i', file, '-vf', 'reverse', `reversed-${file}`)
        })
    }

if (files) return (
    <div className={styles.uploads}>
        <Container fluid style={{'margin-top':'50px'}}>
            <Row>
                <Col md={{span: 4, offset: 4}}>
                    {Array.from(files).map((file, idx) => <div className={styles.upload}><Row><Col md={{span: 3}}><img src={URL.createObjectURL(file)} className={styles.uploadImg}/></Col><Col md={9}><h3>{file.name}</h3><p>{Math.round((file.size/1024/1024)*100)/100} MB</p></Col></Row></div>)}
                </Col>
            </Row>
            <Row>
                <Col md={{span: 1, offset: 5}}>
                    <Button onClick={reverseGif(files)} size="lg" variant="outline-light" style={{"font-family": "quicksand"}}>Reverse Gif(s)</Button>
                </Col>
            </Row>
        </Container>
    </div>
)

  return (
        <>
            {!files && (
                <Container fluid>
                <Row>
                    <Col md={{span: 10, offset: 1}}>
                    <div className={styles.dropToUpload} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => {inputRef.current.click();}}>
                        <input type="file" multiple onChange={(event) => {setFiles(event.target.files)}} hidden ref={inputRef} accept=".gif"/>
                        <h1>drop your gif/click here.</h1>
                        <FontAwesomeIcon icon={faGif} className={styles.centerGif}/>
                    </div>
                    </Col>
                </Row>
                </Container>
            )}
        </>
  )
}

export default DropZone;
