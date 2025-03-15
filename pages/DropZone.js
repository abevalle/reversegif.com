import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import React, { useState, useRef, useEffect } from 'react';
import ReactGA from 'react-ga4';

const ffmpeg = createFFmpeg({ log: true, corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js" });
const gaCode = process.env.TRACKING_ID;
ReactGA.initialize("G-MHJ39LXW6P");

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, altText, mediaFile }) => {
    if (!isOpen) return null;

    const isVideo = mediaFile?.type.startsWith('video/');
    const objectUrl = mediaFile ? URL.createObjectURL(mediaFile) : imageUrl;

    useEffect(() => {
        return () => {
            if (objectUrl && objectUrl.startsWith('blob:')) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={onClose}>
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
                <button 
                    className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {isVideo ? (
                    <video 
                        src={objectUrl}
                        className="max-h-full max-w-full"
                        controls
                        autoPlay
                        loop
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <img 
                        src={objectUrl} 
                        alt={altText}
                        className="max-h-full max-w-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>
        </div>
    );
};

const MediaPreview = ({ file, className, onClick }) => {
    const [thumbnail, setThumbnail] = useState('');
    const isVideo = file.type.startsWith('video/');

    useEffect(() => {
        if (isVideo) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.addEventListener('loadeddata', () => {
                video.currentTime = 0;
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL());
                URL.revokeObjectURL(video.src);
            });
        }
    }, [file]);

    if (isVideo) {
        return (
            <div className={`relative ${className}`} onClick={onClick}>
                <img 
                    src={thumbnail || ''} 
                    className="w-full h-full object-cover rounded-lg"
                    alt="Video thumbnail"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <img 
            src={URL.createObjectURL(file)} 
            className={`${className} object-cover rounded-lg`}
            alt="Media preview"
            onClick={onClick}
        />
    );
};

const DropZone = () => {
    const [files, setFiles] = useState(null);
    const inputRef = useRef();
    const [ready, setReady] = useState(false);
    const [reversed, setReversed] = useState(null);
    const [reversedFile, setReversedFile] = useState(null);
    const [reversedName, setReversedName] = useState('');
    const [reversedSize, setReversedSize] = useState(0);
    const [tooManyFiles, setTooManyFiles] = useState(false);
    const [fileType, setFileType] = useState('');
    const [loading, setLoading] = useState(false);
    const [showWatermark, setShowWatermark] = useState(true);
    const [convertToGif, setConvertToGif] = useState(true);
    const [showSizeWarning, setShowSizeWarning] = useState(false);
    const [previewModal, setPreviewModal] = useState({ 
        isOpen: false, 
        imageUrl: '', 
        altText: '',
        mediaFile: null 
    });

    // Load FFmpeg
    useEffect(() => {
        const load = async () => {
            if (!ffmpeg.isLoaded()) {
                await ffmpeg.load();
            }
            setReady(true);
            gaEvent('app-load', 'App Loaded');
        };
        load();
    }, []);

    // Handle reversed blob
    useEffect(() => {
        if (reversed) {
            fetch(reversed)
                .then(r => r.blob())
                .then(blob => {
                    setReversedFile(new File([blob], reversedName, { type: convertToGif ? 'image/gif' : files.type }));
                });
        } else {
            setReversedFile(null);
        }
    }, [reversed, reversedName, files, convertToGif]);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const deleteFiles = () => {
        setFiles(null);
        setReversed(null);
        setReversedFile(null);
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
            // Check if it's a video and larger than 3MB
            if (file.type.startsWith('video/') && file.size > 3 * 1024 * 1024) {
                setShowSizeWarning(true);
            } else {
                setShowSizeWarning(false);
            }
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
        const inputFileName = 'input' + (files.type.includes('gif') ? '.gif' : files.name.substring(files.name.lastIndexOf('.')));
        ffmpeg.FS('writeFile', inputFileName, await fetchFile(files));
        
        let filterCommand = 'reverse';
        if (showWatermark) {
            ffmpeg.FS('writeFile', 'font.woff', await fetchFile('https://assets.nflxext.com/ffe/siteui/fonts/netflix-sans/v3/NetflixSans_W_Lt.woff'));
            filterCommand = 'drawtext=fontfile=/font.woff:text=\'reversegif.com\':fontcolor=white:fontsize=20:bordercolor=black:borderw=1:x=w-tw-2:y=h-th-2:alpha=0.5,reverse';
        }

        const outputFileName = convertToGif ? 'reversed.gif' : `reversed${files.name.substring(files.name.lastIndexOf('.'))}`;
        const outputFormat = convertToGif ? ['-f', 'gif'] : [];
        
        await ffmpeg.run('-i', inputFileName, '-vf', filterCommand, ...outputFormat, outputFileName);
        const data = ffmpeg.FS('readFile', outputFileName);

        const mimeType = convertToGif ? 'image/gif' : files.type;
        const blob = new Blob([data.buffer], { type: mimeType });
        const url = URL.createObjectURL(blob);
        setReversed(url);
        setReversedName(outputFileName);
        setReversedSize((data.byteLength / 1024 / 1024).toFixed(2));
        setLoading(false);
        gaEvent("gif-reverse-complete", "Gif Reversing Completed");
    };

    return ready ? (
        <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-lg">
            <ImagePreviewModal 
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal({ isOpen: false, imageUrl: '', altText: '', mediaFile: null })}
                imageUrl={previewModal.imageUrl}
                altText={previewModal.altText}
                mediaFile={previewModal.mediaFile}
            />
            {!files ? (
                <div 
                    className="p-4 md:p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-none md:rounded-xl transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer min-h-[200px] flex items-center justify-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => { inputRef.current.click(); gaEvent('file-select', 'File Select Click'); }}
                >
                    <input type="file" onChange={(event) => { 
                        const file = event.target.files?.item(0);
                        setFiles(file);
                        gaEvent('file-upload', 'File Uploaded via Click');
                        // Check if it's a video and larger than 3MB
                        if (file && file.type.startsWith('video/') && file.size > 3 * 1024 * 1024) {
                            setShowSizeWarning(true);
                        } else {
                            setShowSizeWarning(false);
                        }
                    }} hidden ref={inputRef} accept="image/*,video/*" />
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
                            <MediaPreview 
                                file={files}
                                className="w-20 h-20 md:w-24 md:h-24 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                onClick={() => setPreviewModal({ 
                                    isOpen: true, 
                                    imageUrl: URL.createObjectURL(files),
                                    altText: "Original media",
                                    mediaFile: files
                                })}
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{files.name}</h3>
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{(files.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>

                    {reversed && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
                            <div className="flex items-center space-x-3 md:space-x-4">
                                {reversedFile && (
                                    <MediaPreview 
                                        file={reversedFile}
                                        className="w-20 h-20 md:w-24 md:h-24 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                        onClick={() => setPreviewModal({ 
                                            isOpen: true, 
                                            imageUrl: reversed,
                                            altText: "Reversed media",
                                            mediaFile: reversedFile
                                        })}
                                    />
                                )}
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

                    {showSizeWarning && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                        Warning: Processing videos larger than 3MB in the browser may affect system performance. Server-side processing feature will be available in a future update.
                                    </p>
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

                    <div className="flex flex-col space-y-4">
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
                        <div className="flex items-center justify-center pt-2">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showWatermark}
                                        onChange={(e) => setShowWatermark(e.target.checked)}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${showWatermark ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${showWatermark ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </div>
                                <span className="ml-3 text-sm md:text-base text-gray-700 dark:text-gray-300">Show Watermark</span>
                            </label>
                            <label className="flex items-center cursor-pointer ml-6">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={convertToGif}
                                        onChange={(e) => setConvertToGif(e.target.checked)}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${convertToGif ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${convertToGif ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </div>
                                <span className="ml-3 text-sm md:text-base text-gray-700 dark:text-gray-300">Convert to GIF</span>
                            </label>
                        </div>
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