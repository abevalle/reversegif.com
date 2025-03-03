import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import React, { useState, useRef, useEffect } from 'react';
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
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
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
        <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-lg">
            {!files ? (
                <div 
                    className="p-4 md:p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-none md:rounded-xl transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer min-h-[200px] flex items-center justify-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => { inputRef.current.click(); gaEvent('file-select', 'File Select Click'); }}
                >
                    <input type="file" onChange={(event) => { setFiles(event.target.files?.item(0)); gaEvent('file-upload', 'File Uploaded via Click'); }} hidden ref={inputRef} accept=".gif" />
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                        <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Drop your GIF here
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">or</p>
                        <button className="w-full md:w-auto px-6 py-4 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 touch-target-size">
                            Select a File
                        </button>
                        {tooManyFiles && (
                            <p className="mt-4 text-red-500 dark:text-red-400 text-sm md:text-base">
                                Please upload one file at a time
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <img src={URL.createObjectURL(files)} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md" alt="Uploaded file" />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{files.name}</h3>
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{(files.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>

                    {reversed && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
                            <div className="flex items-center space-x-3 md:space-x-4">
                                <img src={reversed} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md" alt="Reversed file" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{reversedName}</h3>
                                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{reversedSize} MB</p>
                                    <a 
                                        href={reversed}
                                        download={reversedName}
                                        className="inline-flex items-center mt-2 text-blue-600 dark:text-blue-400 hover:underline touch-target-size"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span className="text-sm md:text-base">Download</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            <span className="ml-3 text-sm md:text-base text-gray-600 dark:text-gray-400">Reversing GIF...</span>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
                        <button 
                            onClick={reverseGif}
                            className="w-full md:w-auto px-6 py-4 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 touch-target-size"
                        >
                            Reverse GIF
                        </button>
                        <button 
                            onClick={deleteFiles}
                            className="w-full md:w-auto px-6 py-4 md:py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 touch-target-size"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            )}
        </div>
    ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
        </div>
    );
};

export default DropZone;