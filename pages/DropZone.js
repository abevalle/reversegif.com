import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga4';

const ffmpeg = createFFmpeg({ log: true, corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js" });
const gaCode = process.env.TRACKING_ID;
ReactGA.initialize("G-MHJ39LXW6P");

const DropZone = () => {
    const [files, setFiles] = useState(null);
    const inputRef = useRef();
    const [ready, setReady] = useState(false);
    const [reversed, setReversed] = useState(null);
    const [reversedName, setReversedName] = useState('');
    const [reversedSize, setReversedSize] = useState(0);
    const [tooManyFiles, setTooManyFiles] = useState(false);
    const [fileType, setFileType] = useState('');
    const [loading, setLoading] = useState(false);

    const load = async () => {
        await ffmpeg.load();
        setReady(true);
        gaEvent('app-load', 'App Loaded');
    };

    useEffect(() => {
        load();
    }, []);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const deleteFiles = () => {
        setFiles(null);
        setReversed(null);
        setReversedName('');
        setReversedSize(0);
        gaEvent('files-delete', 'Files Deleted');
    };

    const gaEvent = (cat, act) => {
        ReactGA.event({
            category: cat,
            action: act,
            nonInteraction: false
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        gaEvent('file-upload', 'File Uploaded via Drag and Drop');
        if (event.dataTransfer.files.length === 1) {
            const file = event.dataTransfer.files?.item(0);
            setFiles(file);
            const fileExtension = file.name.split('.').pop();
            setFileType(fileExtension);
            console.log(fileExtension);
        } else {
            setTooManyFiles(true);
            gaEvent('file-upload-error', 'Too Many Files Uploaded');
            console.log('too many files');
        }
    };

    const reverseGif = async () => {
        setLoading(true);
        gaEvent("gif-reverse", "Gif Reversing Started");
        ffmpeg.FS('writeFile', 'font.woff', await fetchFile('https://assets.nflxext.com/ffe/siteui/fonts/netflix-sans/v3/NetflixSans_W_Lt.woff'));
        ffmpeg.FS('writeFile', 'test.gif', await fetchFile(files));
        await ffmpeg.run('-i', 'test.gif', '-vf', 'drawtext=fontfile=/font.woff:text=\'reversegif.com\':fontcolor=white:fontsize=20:bordercolor=black:borderw=1:x=w-tw-2:y=h-th-2:alpha=0.5,reverse', `reversed-${files.name}`);
        const data = ffmpeg.FS('readFile', `reversed-${files.name}`);

        const blob = new Blob([data.buffer], { type: 'image/gif' });
        const url = URL.createObjectURL(blob);
        setReversed(url);
        setReversedName(`reversed-${files.name}`);
        setReversedSize((data.byteLength / 1024 / 1024).toFixed(2));
        setLoading(false);
        gaEvent("gif-reverse-complete", "Gif Reversing Completed");
    };

    return ready ? (
        <div className="p-4">
            {!files ? (
                <div className="bg-gray-800 p-4 rounded-lg mx-auto max-w-xl text-center border-dashed border-2" onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => { inputRef.current.click(); gaEvent('file-select', 'File Select Click'); }}>
                    <input type="file" onChange={(event) => { setFiles(event.target.files?.item(0)); gaEvent('file-upload', 'File Uploaded via Click'); }} hidden ref={inputRef} accept=".gif" />
                    <FontAwesomeIcon icon="fa-solid fa-gif" className="text-white text-6xl mb-4" />
                    <h1 className="text-white text-2xl mb-2">Drop a File</h1>
                    <h1 className="text-white text-xl mb-4">or</h1>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Select a File</button>
                    {tooManyFiles && <h1 className="text-red-500 mt-4">You added too many files. Please upload one at a time.</h1>}
                </div>
            ) : (
                <div className="mx-auto max-w-xl">
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                        <div className="flex items-center">
                            <img src={URL.createObjectURL(files)} className="w-32 h-32 object-cover rounded-lg mr-4" alt="Uploaded file" />
                            <div>
                                <h3 className="text-xl text-white">{files.name}</h3>
                                <p className="text-gray-400">{(files.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>
                    {reversed && (
                        <div className="bg-gray-800 p-4 rounded-lg mb-4">
                            <div className="flex items-center">
                                <img src={reversed} className="w-32 h-32 object-cover rounded-lg mr-4" alt="Reversed file" />
                                <div>
                                    <h3 className="text-xl text-white">{reversedName}</h3>
                                    <p className="text-gray-400">{reversedSize} MB</p>
                                    <a href={reversed} download={reversedName} className="text-blue-400">Download</a>
                                </div>
                            </div>
                        </div>
                    )}
                    {loading && (
                        <h1 className="text-white text-center my-8">Reversing Gif...</h1>
                    )}
                    <div className="text-center">
                        <button onClick={reverseGif} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Reverse Gif(s)</button>
                        <button onClick={deleteFiles} className="bg-red-500 text-white px-4 py-2 rounded-lg">Convert more</button>
                    </div>
                </div>
            )}
        </div>
    ) : (
        <p className="text-white text-4xl text-center mt-40">loading</p>
    );
};

export default DropZone;
