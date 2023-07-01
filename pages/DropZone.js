import {createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
const ffmpeg = createFFmpeg({log: true, corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js"})
import styles from '../styles/Home.module.css';
import React, { useState, useRef, useEffect } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faGif, faLight } from '@fortawesome/pro-solid-svg-icons'


const DropZone = () => {
    const [files, setFiles, setSelectedImage, selectedImage] = useState()
    const inputRef = useRef();
    const [ready, setReady] = useState(false)
    const [reversed, setReversed] = useState()
    const [reversedName, setReversedName] = useState()
    const [reversedSize, setReversedSize] = useState()

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

    const reverseGif = async () => {
        ffmpeg.FS('writeFile', 'test.gif', await fetchFile(files))
        await ffmpeg.run('-i', 'test.gif', '-vf', 'reverse', `reversed-${files.name}`)
        const data = ffmpeg.FS('readFile', `reversed-${files.name}`)

        const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}))
        setReversed(url)
        setReversedName(`reversed-${files.name}`)
        setReversedSize(data.size/1024/1024)
    }

if (files) return (
    <div className={styles.uploads}>
        <Container fluid style={{'margin-top':'50px'}}>
            <Row>
                <Col md={{span: 4, offset: 4}}>
                    {/* {Array.from(files).map((file, idx) => <div className={styles.upload}><Row><Col md={{span: 3}}><img src={URL.createObjectURL(file)} className={styles.uploadImg}/></Col><Col md={9}><h3>{file.name}</h3><p>{Math.round((file.size/1024/1024)*100)/100} MB</p></Col></Row></div>)} */}
                    <div className={styles.upload}><Row><Col md={{span: 3}}><img src={URL.createObjectURL(files)} className={styles.uploadImg}/></Col><Col md={9}><h3>{files.name}</h3><p>{Math.round((files.size/1024/1024)*100)/100} MB</p></Col></Row></div>
                    {reversed && <div className={styles.upload}><Row><Col md={{span: 3}}><img src={reversed} className={styles.uploadImg}></img></Col><Col md={9}><h3>{reversedName}</h3><p>{Math.round((files.size/1024/1024)*100)/100} MB</p></Col></Row></div>}
                </Col>

            </Row>
            <Row>
                <Col md={{span: 4, offset: 4}}>
                    <div className="text-center">
                        <Button onClick={reverseGif} size="lg" variant="outline-light" style={{"font-family": "quicksand"}}>Reverse Gif(s)</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
)

return ready ? (
        <>
            {!files && (
                <Container fluid>
                <Row>
                    <Col md={{span: 10, offset: 1}}>
                    <div className={styles.dropToUpload} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => {inputRef.current.click();}}>
                        <input type="file" onChange={(event) => {setFiles(event.target.files?.item(0))}} hidden ref={inputRef} accept=".gif"/>
                        <h1>drop your gif/click here.</h1>
                        {/* <FontAwesomeIcon icon={faGif} className={styles.centerGif}/> */}
                    </div>
                    </Col>
                </Row>
                </Container>
            )}
        </>
  ) : (<p>loading</p>)
}

export default DropZone;
