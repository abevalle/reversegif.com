import React, { useState, useRef, useEffect } from 'react';
import * as gtm from '../lib/gtm';
import JSZip from 'jszip';

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
    const [imageUrl, setImageUrl] = useState('');
    const isVideo = file.type.startsWith('video/');

    useEffect(() => {
        let objectUrl = '';
        
        if (isVideo) {
            const video = document.createElement('video');
            objectUrl = URL.createObjectURL(file);
            video.src = objectUrl;
            video.addEventListener('loadeddata', () => {
                video.currentTime = 0;
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL());
                URL.revokeObjectURL(objectUrl);
            });
        } else {
            objectUrl = URL.createObjectURL(file);
            setImageUrl(objectUrl);
        }

        return () => {
            if (objectUrl && !isVideo) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file, isVideo]);

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
            src={imageUrl} 
            className={`${className} object-cover rounded-lg`}
            alt="Media preview"
            onClick={onClick}
        />
    );
};

const DropZone = ({ defaultConvertToGif = false, forceConvertToGif = false, videoOnly = false, gifToMp4Mode = false, videoToPngMode = false, videoToJpgMode = false }) => {
    const [files, setFiles] = useState(null);
    const inputRef = useRef();
    const [ready, setReady] = useState(true); // Dropzone is ready to accept files immediately
    const [reversed, setReversed] = useState(null);
    const [reversedFile, setReversedFile] = useState(null);
    const [reversedName, setReversedName] = useState('');
    const [reversedSize, setReversedSize] = useState(0);
    const [extractedFrames, setExtractedFrames] = useState([]);
    const [excludedFrames, setExcludedFrames] = useState(new Set());
    const [framesPaths, setFramesPaths] = useState([]);
    const [tooManyFiles, setTooManyFiles] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showWatermark, setShowWatermark] = useState(true);
    const [convertToGif, setConvertToGif] = useState(defaultConvertToGif);
    const [showSizeWarning, setShowSizeWarning] = useState(false);
    const [shouldReverse, setShouldReverse] = useState(false);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);
    const [previewModal, setPreviewModal] = useState({ 
        isOpen: false, 
        imageUrl: '', 
        altText: '',
        mediaFile: null 
    });

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

    // Cleanup blob URLs on unmount or when files change
    useEffect(() => {
        return () => {
            if (reversed) {
                URL.revokeObjectURL(reversed);
            }
        };
    }, [reversed]);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const deleteFiles = () => {
        // Revoke blob URL before clearing
        if (reversed) {
            URL.revokeObjectURL(reversed);
        }
        
        // Revoke frame preview URLs
        extractedFrames.forEach(frame => {
            if (frame.url) {
                URL.revokeObjectURL(frame.url);
            }
        });
        
        setFiles(null);
        setReversed(null);
        setReversedFile(null);
        setReversedName('');
        setReversedSize(0);
        setExtractedFrames([]);
        setExcludedFrames(new Set());
        setFramesPaths([]);
        setError(null);
        setErrorDetails(null);
        gaEvent('files-delete', 'Files Deleted');
    };

    const gaEvent = (cat, act) => {
        gtm.event({
            category: cat,
            action: act
        });
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        
        // Don't load FFmpeg yet - wait until user clicks process button
        // This prevents COEP header conflicts and allows ads to work properly
        
        if (event.dataTransfer.files.length === 1) {
            const file = event.dataTransfer.files?.item(0);
            const fileType = file.type;
            let isValidType = fileType === 'image/gif' || fileType === 'image/webp' || fileType === 'video/mp4';
            
            // If videoOnly is true, only accept video files
            if (videoOnly && !fileType.startsWith('video/')) {
                alert('Please upload only video files.');
                return;
            }
            
            // If gifToMp4Mode is true, only accept GIF files
            if (gifToMp4Mode && fileType !== 'image/gif') {
                alert('Please upload only GIF files.');
                return;
            }
            
            // If videoToPngMode or videoToJpgMode is true, only accept video files
            if ((videoToPngMode || videoToJpgMode) && !fileType.startsWith('video/')) {
                alert('Please upload only video files.');
                return;
            }
            
            
            if (!isValidType) {
                alert('Please upload only GIF, WebP, or MP4 files.');
                return;
            }

            gaEvent('file-upload', 'File Uploaded via Drag and Drop');
            setFiles(file);
            // Set convertToGif based on file type and forceConvertToGif prop
            setConvertToGif(forceConvertToGif || !file.type.includes('gif'));
            // Check if it's a video and larger than 3MB
            if (file.type.startsWith('video/') && file.size > 3 * 1024 * 1024) {
                setShowSizeWarning(true);
            } else {
                setShowSizeWarning(false);
            }
        } else {
            setTooManyFiles(true);
            gaEvent('file-upload-error', 'Too Many Files Uploaded');
            console.log('too many files');
        }
    };

    const reverseGif = async () => {
        setLoading(true);
        
        // Update event tracking
        let actionType = "Gif-Reverse";
        let apiEndpoint = 'https://api.reversegif.com/reverse-gif';
        
        if (gifToMp4Mode) {
            actionType = "Gif-To-Mp4-Convert";
            apiEndpoint = 'https://api.reversegif.com/gif-to-mp4';
        } else if (videoToPngMode) {
            actionType = "Video-To-Png-Convert";
            apiEndpoint = 'https://api.reversegif.com/video-to-png';
        } else if (videoToJpgMode) {
            actionType = "Video-To-Jpg-Convert";
            apiEndpoint = 'https://api.reversegif.com/video-to-jpg';
        } else if (videoOnly) {
            actionType = "Video-Convert-Only";
            if (convertToGif) {
                apiEndpoint = 'https://api.reversegif.com/video-to-gif';
            }
        } else if (convertToGif && !files.type.includes('gif')) {
            apiEndpoint = 'https://api.reversegif.com/video-to-gif';
        }
        
        gaEvent("media-processing", actionType + " Started");
        
        try {
            const formData = new FormData();
            formData.append('file', files);
            if (showWatermark) {
                formData.append('watermark', 'reversegif.com');
            }
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                // Try to get detailed error from API response
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { error: 'Processing failed', details: response.statusText };
                }
                const error = new Error(errorData.error || 'Processing failed');
                error.details = errorData.details;
                error.status = response.status;
                throw error;
            }
            
            // Determine output filename and handle response
            let outputFileName = '';
            let blob, url;
            
            if (videoToPngMode || videoToJpgMode) {
                // For frame extraction, expect ZIP response
                blob = await response.blob();
                url = URL.createObjectURL(blob);
                
                // The frames are in a ZIP, store for download
                outputFileName = `frames_${videoToPngMode ? 'png' : 'jpg'}.zip`;
                
                // Fetch frame previews using the preview endpoint
                try {
                    const previewFormData = new FormData();
                    previewFormData.append('file', files);
                    
                    const previewResponse = await fetch(`https://api.reversegif.com/video-to-${videoToPngMode ? 'png' : 'jpg'}-preview`, {
                        method: 'POST',
                        body: previewFormData,
                    });
                    
                    if (previewResponse.ok) {
                        const previewData = await previewResponse.json();
                        
                        // Check if we got actual frame data
                        if (previewData.frames && previewData.frames.length > 0) {
                            console.log(`Received ${previewData.frames.length} frame previews out of ${previewData.totalFrames} total`);
                            
                            // Store frame paths for filtering
                            setFramesPaths(previewData.paths);
                            
                            // Convert base64 data to blob URLs for display
                            const framePreviews = previewData.frames.map(frame => {
                                // Convert base64 to blob
                                const base64Data = frame.data.split(',')[1];
                                const byteCharacters = atob(base64Data);
                                const byteNumbers = new Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                const byteArray = new Uint8Array(byteNumbers);
                                const blob = new Blob([byteArray], { type: videoToPngMode ? 'image/png' : 'image/jpeg' });
                                const blobUrl = URL.createObjectURL(blob);
                                
                                return {
                                    url: blobUrl,
                                    path: frame.path,
                                    index: frame.index
                                };
                            });
                            
                            setExtractedFrames(framePreviews);
                            // Store the main ZIP URL separately
                            setReversedFile({ url, size: blob.size });
                        } else {
                            // No previews available (API returned ZIP), just show the ZIP
                            console.log('No frame previews available:', previewData.error || 'Unknown reason');
                            setExtractedFrames([{ name: outputFileName, url, size: blob.size }]);
                        }
                    } else {
                        // Preview failed, just show the ZIP
                        setExtractedFrames([{ name: outputFileName, url, size: blob.size }]);
                    }
                } catch (err) {
                    console.error('Error fetching frame previews:', err);
                    // Fall back to just showing the ZIP file
                    setExtractedFrames([{ name: outputFileName, url, size: blob.size }]);
                }
            } else {
                blob = await response.blob();
                url = URL.createObjectURL(blob);
                
                if (gifToMp4Mode) {
                    outputFileName = 'converted.mp4';
                } else {
                    outputFileName = 'converted';
                    outputFileName += convertToGif ? '.gif' : files.name.substring(files.name.lastIndexOf('.')); 
                }
            }
            
            setReversed(url);
            setReversedName(outputFileName);
            setReversedSize((blob.size / 1024 / 1024).toFixed(2));
            
            gaEvent("media-processing", actionType + " Completed");
        } catch (error) {
            console.error('Error processing file:', error);
            
            // Use error details from API if available, otherwise determine from error
            let errorMessage = error.message || 'Unable to process file';
            let errorDetail = error.details || error.message;
            
            // Override with more specific messages for network errors
            if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage = 'Connection failed';
                errorDetail = 'Unable to connect to the processing server. The server may be temporarily unavailable.';
            } else if (error.status === 504 || error.message.includes('timeout')) {
                errorMessage = 'Request timed out';
                errorDetail = error.details || 'The processing is taking longer than expected. Please try again with a smaller file.';
            } else if (error.status === 413) {
                errorMessage = 'File too large';
                errorDetail = error.details || 'The file exceeds the maximum size limit. Please try a smaller file.';
            } else if (error.status === 503) {
                errorMessage = 'Service unavailable';
                errorDetail = error.details || 'The processing service is temporarily unavailable. Please try again later.';
            }
            
            setError(errorMessage);
            setErrorDetails(errorDetail);
            gaEvent("media-processing", actionType + " Failed - " + errorMessage);
        } finally {
            setLoading(false);
        }
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
                        
                        if (file) {
                            // If videoOnly is true, only accept video files
                            if (videoOnly && !file.type.startsWith('video/')) {
                                alert('Please upload only video files.');
                                return;
                            }
                            
                            // If gifToMp4Mode is true, only accept GIF files
                            if (gifToMp4Mode && file.type !== 'image/gif') {
                                alert('Please upload only GIF files.');
                                return;
                            }
                            
                            // If videoToPngMode or videoToJpgMode is true, only accept video files
                            if ((videoToPngMode || videoToJpgMode) && !file.type.startsWith('video/')) {
                                alert('Please upload only video files.');
                                return;
                            }
                            
                            
                            setFiles(file);
                            gaEvent('file-upload', 'File Uploaded via Click');
                            // Set convertToGif based on file type and forceConvertToGif prop
                            setConvertToGif(forceConvertToGif || !file.type.includes('gif'));
                            // Check if it's a video and larger than 3MB
                            if (file.type.startsWith('video/') && file.size > 3 * 1024 * 1024) {
                                setShowSizeWarning(true);
                            } else {
                                setShowSizeWarning(false);
                            }
                        }
                    }} hidden ref={inputRef} accept={gifToMp4Mode ? ".gif" : (videoOnly || videoToPngMode || videoToJpgMode) ? "video/*" : ".gif,.webp,video/mp4"} />
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                        <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {gifToMp4Mode ? 'Drop your GIF here' : 
                             (videoOnly || videoToPngMode || videoToJpgMode) ? 'Drop your Video here' : 
                             'Drop your GIF here'}
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
                                    imageUrl: '',
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
                                {reversedFile && !extractedFrames.length && (
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
                                    {framesPaths && framesPaths.length > 0 ? (
                                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                            {framesPaths.length} total frames • {extractedFrames.length} previews shown
                                        </p>
                                    ) : extractedFrames.length > 0 && (
                                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                            {extractedFrames.length} frames extracted
                                        </p>
                                    )}
                                    <a 
                                        href={reversed}
                                        download={reversedName}
                                        className="inline-flex items-center mt-2 text-blue-600 dark:text-blue-400 hover:underline touch-target-size"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span className="text-sm md:text-base">Download All Frames (ZIP)</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {extractedFrames.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
                            <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                                Extracted Frames Preview
                            </h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3 max-h-48 md:max-h-64 overflow-y-auto">
                                {extractedFrames.map((frame, idx) => {
                                    const frameIndex = frame.index !== undefined ? frame.index : idx;
                                    const isExcluded = excludedFrames.has(frameIndex);
                                    return (
                                        <div key={frameIndex} className="relative group">
                                            <img
                                                src={frame.url}
                                                alt={`Frame ${frameIndex + 1}`}
                                                className={`w-full aspect-square object-cover rounded cursor-pointer transition-all duration-200 ${
                                                    isExcluded ? 'opacity-30 grayscale' : 'hover:opacity-80'
                                                }`}
                                                onClick={() => !isExcluded && setPreviewModal({
                                                    isOpen: true,
                                                    imageUrl: frame.url,
                                                    altText: `Frame ${frameIndex + 1}`,
                                                    mediaFile: null
                                                })}
                                            />
                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newExcluded = new Set(excludedFrames);
                                                    if (isExcluded) {
                                                        newExcluded.delete(frameIndex);
                                                    } else {
                                                        newExcluded.add(frameIndex);
                                                    }
                                                    setExcludedFrames(newExcluded);
                                                }}
                                                className={`absolute top-1 right-1 p-1 rounded-full transition-all duration-200 ${
                                                    isExcluded 
                                                        ? 'bg-green-500 hover:bg-green-600' 
                                                        : 'bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100'
                                                }`}
                                                title={isExcluded ? 'Include frame' : 'Exclude frame'}
                                            >
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {isExcluded ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    )}
                                                </svg>
                                            </button>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded flex items-center justify-center pointer-events-none">
                                                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    {frameIndex + 1}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Click frame to view • Hover and click × to exclude
                                </p>
                                {excludedFrames.size > 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {extractedFrames.length - excludedFrames.size} of {extractedFrames.length} frames selected
                                    </p>
                                )}
                            </div>
                            {framesPaths.length > 0 && (
                                <button
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            // Create a new ZIP file using JSZip
                                            const zip = new JSZip();
                                            
                                            // Create array of excluded frame indices
                                            const excludedArray = Array.from(excludedFrames);
                                            
                                            // Fetch each non-excluded frame and add to ZIP
                                            let frameNumber = 1;
                                            for (let i = 0; i < framesPaths.length; i++) {
                                                if (excludedArray.includes(i)) {
                                                    continue; // Skip excluded frames
                                                }
                                                
                                                const framePath = framesPaths[i];
                                                const frameResponse = await fetch(`http://sacramento.valle.us:6221${framePath}`);
                                                
                                                if (frameResponse.ok) {
                                                    const frameBlob = await frameResponse.blob();
                                                    const extension = videoToPngMode ? 'png' : 'jpg';
                                                    const filename = `frame_${String(frameNumber).padStart(3, '0')}.${extension}`;
                                                    zip.file(filename, frameBlob);
                                                    frameNumber++;
                                                }
                                            }
                                            
                                            // Generate the ZIP file
                                            const zipBlob = await zip.generateAsync({ type: 'blob' });
                                            
                                            // Trigger download
                                            const url = URL.createObjectURL(zipBlob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `frames_selected.zip`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                        } catch (error) {
                                            console.error('Error creating filtered ZIP:', error);
                                            alert('Error creating filtered ZIP');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading || extractedFrames.length - excludedFrames.size === 0}
                                    className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                                >
                                    {loading ? 'Creating ZIP...' : `Download ${extractedFrames.length - excludedFrames.size} Selected Frames`}
                                </button>
                            )}
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
                            <span className="ml-3 text-sm md:text-base text-gray-600 dark:text-gray-400">
                                {gifToMp4Mode
                                    ? 'Converting to MP4...'
                                    : videoToPngMode
                                    ? 'Extracting all PNG frames...'
                                    : videoToJpgMode
                                    ? 'Extracting all JPG frames...'
                                    : videoOnly 
                                    ? 'Converting to GIF...' 
                                    : 'Reversing GIF...'}
                            </span>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                        {error}
                                    </h3>
                                    {errorDetails && (
                                        <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                                            {errorDetails}
                                        </p>
                                    )}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => {
                                                setError(null);
                                                setErrorDetails(null);
                                                reverseGif();
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-medium rounded-md transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
                            <button 
                                onClick={reverseGif}
                                disabled={loading}
                                className={`w-full md:w-auto px-6 py-4 md:py-3 ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                                } text-white font-medium rounded-lg shadow-md transition-all duration-200 touch-target-size`}
                            >
                                {loading
                                    ? 'Processing...'
                                    : gifToMp4Mode
                                    ? 'Convert to MP4'
                                    : videoToPngMode
                                    ? 'Extract All PNG Frames'
                                    : videoToJpgMode
                                    ? 'Extract All JPG Frames'
                                    : videoOnly 
                                    ? 'Convert to GIF' 
                                    : 'Reverse GIF'}
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
                            {!files?.type.includes('gif') && !forceConvertToGif && !gifToMp4Mode && !videoToPngMode && !videoToJpgMode && (
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
                            )}
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