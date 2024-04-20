import {createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
const ffmpeg = createFFmpeg({log: true, corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js"})
import styles from '../styles/Home.module.css';
import React, { useState, useRef, useEffect } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container, Button } from 'react-bootstrap'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faGif, faLight } from '@fortawesome/pro-solid-svg-icons'
import ReactGA from 'react-ga4'
const gaCode = process.env.TRACKING_ID
ReactGA.initialize("G-MHJ39LXW6P");

const DropZone = () => {
    const [files, setFiles, setSelectedImage, selectedImage] = useState()
    const inputRef = useRef();
    const [ready, setReady] = useState(false)
    const [reversed, setReversed] = useState()
    const [reversedName, setReversedName] = useState()
    const [reversedSize, setReversedSize] = useState()
    const [tooManyFiles, setTooManyFiles] = useState()
    const [fileType, setFileType] = useState()
    const [loading, setLoading] = useState(false)



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

    const deleteFiles = () => {
        setFiles(null)
    }

    const gaEvent = (cat, act) => {
        ReactGA.event({
            category: cat,
            action: act,
            nonInteraction: false
        })
    } 

    const handleDrop = (event) => {
        event.preventDefault();
        gaEvent('file-upload', 'file-upload')
        if(event.dataTransfer.files.length == 1) {
            setFiles(event.dataTransfer.files?.item(0))
            let fileExtension = event.dataTransfer.files?.item(0).name.split('.').pop()
            setFileType(fileExtension)
            console.log(event.dataTransfer.files?.item(0).name.split('.').pop())    
        } else {
            setTooManyFiles(true)
            console.log('too many files')
        }
    };

    const reverseGif = async () => {
        setLoading(true)
        gaEvent("gif-Reversed", "gif-reverse")
        ffmpeg.FS('writeFile', 'font.woff', await fetchFile('https://assets.nflxext.com/ffe/siteui/fonts/netflix-sans/v3/NetflixSans_W_Lt.woff'))
        ffmpeg.FS('writeFile', 'test.gif', await fetchFile(files))
        await ffmpeg.run('-i', 'test.gif', '-vf', 'drawtext=fontfile=/font.woff:text=\'reversegif.com\':fontcolor=white:fontsize=20:bordercolor=black:borderw=1:x=w-tw-2:y=h-th-2:alpha=0.5,reverse', `reversed-${files.name}`)
        // await ffmpeg.run('-i', 'test.gif', '-vf', 'reverse', `reversed-${files.name}`)
        const data = ffmpeg.FS('readFile', `reversed-${files.name}`)

        const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}))
        setReversed(url)
        setReversedName(`reversed-${files.name}`)
        setReversedSize(data.size/1024/1024)
        setLoading(false)
    }

if (files) return (
    <div className={styles.uploads}>
        <Container fluid style={{'margin-top':'50px'}}>
            <Row>
                <Col md={{span: 6, offset: 3}}>
                    {/* {Array.from(files).map((file, idx) => <div className={styles.upload}><Row><Col md={{span: 3}}><img src={URL.createObjectURL(file)} className={styles.uploadImg}/></Col><Col md={9}><h3>{file.name}</h3><p>{Math.round((file.size/1024/1024)*100)/100} MB</p></Col></Row></div>)} */}
                    <div className={styles.upload}><Row><Col md={{span: 4}}><img src={URL.createObjectURL(files)} className={styles.uploadImg}/></Col><Col md={8}><h3>{files.name}</h3><p>{Math.round((files.size/1024/1024)*100)/100} MB</p></Col></Row></div>
                    {reversed && <div className={styles.upload}><Row><Col md={{span: 4}}><img src={reversed} className={styles.uploadImg}></img></Col><Col md={8}><h3>{reversedName}</h3><p>{Math.round((files.size/1024/1024)*100)/100} MB</p><a href={reversed} download>Download</a></Col></Row></div>}
                </Col>

            </Row>
            {loading ? (<h1 style={{color: 'white', 'text-align':'center', 'margin-top': '50px','margin-bottom': '50px'}}>Rrversing Gif</h1>) : (<></>)}
            <Row>
                <Col md={{span: 4, offset: 4}}>
                    <div className="text-center">
                        <Button onClick={reverseGif} size="lg" variant="outline-light" style={{"font-family": "quicksand"}}>Reverse Gif(s)</Button>
                        <Button onClick={deleteFiles} size="lg" variant="outline-light" style={{'font-family': "quicksand"}}>Convert more</Button>
                        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7359270153499473"
                            crossorigin="anonymous"></Script>
                        <ins class="adsbygoogle"
                            style="display:block"
                            data-ad-format="autorelaxed"
                            data-ad-client="ca-pub-7359270153499473"
                            data-ad-slot="7296620564"></ins>
                        <Script>
                            (adsbygoogle = window.adsbygoogle || []).push({});
                        </Script>
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
                        {tooManyFiles && <h1 style={{marginTop: '0', color: '#d06a6a'}}>You added to many files. Please upload one at a time</h1>}
                        {/* <FontAwesomeIcon icon={faGif} className={styles.centerGif}/> */}
                    </div>
                    </Col>
                </Row>
                </Container>
            )}
        </>
  ) : (<p style={{color: '#FFF', fontSize: '4em', textAlign: 'center', marginTop: '30vh'}}>loading</p>)
}

export default DropZone;
