import React, { useState, useRef, useEffect } from 'react';

const VideoTrimmer = ({ videoFile, onTrimComplete, onCancel }) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartValues, setDragStartValues] = useState({ start: 0, end: 0 });
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const timelineRef = useRef(null);
  const videoUrl = videoFile ? URL.createObjectURL(videoFile) : null;
  const maxDuration = 10; // Maximum trim duration in seconds

  // Load video metadata and set initial trim values
  useEffect(() => {
    if (!videoUrl) return;
    
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      if (isNaN(video.duration) || !isFinite(video.duration) || video.duration <= 0) {
        // If duration is invalid, we'll retry after the loadeddata event
        console.log("Video metadata loaded but duration is invalid, waiting for full data");
        return;
      }
      
      setDuration(video.duration);
      setEndTime(Math.min(video.duration, maxDuration));
      setMetadataLoaded(true);
    };
    
    const handleLoadedData = () => {
      // Double-check duration after full data is loaded
      if (isNaN(video.duration) || !isFinite(video.duration) || video.duration <= 0) {
        console.error("Video fully loaded but duration is still invalid:", video.duration);
        return;
      }
      
      // Update duration again to be extra safe
      setDuration(video.duration);
      setEndTime(Math.min(video.duration, maxDuration));
      setMetadataLoaded(true);
      setIsVideoReady(true);
      
      // Capture initial preview frame
      captureCurrentFrame();
    };
    
    const handleDurationChange = () => {
      // Some browsers update duration after initial metadata load
      if (isNaN(video.duration) || !isFinite(video.duration) || video.duration <= 0) return;
      
      setDuration(video.duration);
      setEndTime(Math.min(video.duration, maxDuration));
      setMetadataLoaded(true);
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('durationchange', handleDurationChange);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('durationchange', handleDurationChange);
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl, maxDuration]);

  // Generate thumbnails after video is ready and metadata is valid
  useEffect(() => {
    if (isVideoReady && metadataLoaded && duration > 0 && thumbnails.length === 0) {
      console.log("Video ready with valid duration, generating thumbnails:", duration);
      generateThumbnails();
    }
  }, [isVideoReady, metadataLoaded, duration]);

  // Capture current frame for preview
  const captureCurrentFrame = () => {
    if (!videoRef.current || !previewCanvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions based on video aspect ratio
    const videoAspect = video.videoWidth / video.videoHeight;
    canvas.width = 320; // Fixed preview width
    canvas.height = canvas.width / videoAspect;
    
    // Draw the current frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the preview data
    try {
      const previewDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewImage(previewDataUrl);
    } catch (err) {
      console.error('Error generating preview image:', err);
    }
  };

  // Update preview on time change
  useEffect(() => {
    if (videoRef.current && isVideoReady) {
      // Capture a new preview frame whenever the current time changes
      captureCurrentFrame();
    }
  }, [currentTime, isVideoReady]);
  
  // Generate thumbnails using the main video element
  const generateThumbnails = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    
    // Final validation check before proceeding
    if (isNaN(video.duration) || !isFinite(video.duration) || video.duration <= 0) {
      console.error('Cannot generate thumbnails - Invalid video duration:', video.duration);
      return;
    }
    
    setIsLoadingThumbnails(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Calculate number of thumbnails based on duration
    // Create more thumbnails for better visualization (1 every 0.5 seconds, up to 20)
    const thumbCount = Math.min(20, Math.max(5, Math.ceil(video.duration * 2)));
    const interval = video.duration / thumbCount;
    
    // Create thumbnails array with empty placeholders
    const thumbs = Array(thumbCount).fill().map((_, i) => ({
      time: i * interval,
      url: null
    }));
    
    // Set initial state with empty thumbnails
    setThumbnails(thumbs);
    
    // Use a hidden video element for thumbnail generation
    // to avoid disrupting main video playback
    const hiddenVideo = document.createElement('video');
    hiddenVideo.src = videoUrl;
    hiddenVideo.muted = true;
    hiddenVideo.preload = 'auto';
    
    // Generate thumbnails when hidden video is ready
    hiddenVideo.onloadeddata = () => {
      // Final check on hidden video
      if (isNaN(hiddenVideo.duration) || !isFinite(hiddenVideo.duration) || hiddenVideo.duration <= 0) {
        console.error('Hidden video has invalid duration:', hiddenVideo.duration);
        setIsLoadingThumbnails(false);
        return;
      }
      
      // Set canvas size based on video aspect ratio for better thumbnail quality
      const videoAspect = hiddenVideo.videoWidth / hiddenVideo.videoHeight;
      canvas.width = 200; // Higher resolution for thumbnails
      canvas.height = canvas.width / videoAspect;
      
      let currentIndex = 0;
      
      const captureNextThumbnail = () => {
        if (currentIndex >= thumbCount) {
          // Done capturing - clean up
          setIsLoadingThumbnails(false);
          hiddenVideo.pause();
          hiddenVideo.src = '';
          return;
        }
        
        const targetTime = thumbs[currentIndex].time;
        
        // Seek to the time
        hiddenVideo.currentTime = targetTime;
        
        // Capture once seeking is done
        const handleSeeked = () => {
          // Draw the current frame to canvas
          ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
          
          // Get the thumbnail data
          try {
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7); // Better quality
            
            // Update thumbnails state with new thumbnail
            setThumbnails(prevThumbs => {
              const newThumbs = [...prevThumbs];
              newThumbs[currentIndex] = {
                time: targetTime,
                url: thumbnailUrl
              };
              return newThumbs;
            });
          } catch (err) {
            console.error('Error generating thumbnail:', err);
          }
          
          // Remove event listener
          hiddenVideo.removeEventListener('seeked', handleSeeked);
          
          // Move to next thumbnail
          currentIndex++;
          setTimeout(captureNextThumbnail, 10);
        };
        
        hiddenVideo.addEventListener('seeked', handleSeeked);
      };
      
      // Start capturing thumbnails
      captureNextThumbnail();
    };
    
    // Handle errors
    hiddenVideo.onerror = () => {
      console.error('Error loading video for thumbnails');
      setIsLoadingThumbnails(false);
    };
  };

  // Handle timeline interaction
  const handleTimelineClick = (e) => {
    if (!timelineRef.current || !duration) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const clickedTime = (offsetX / rect.width) * duration;
    
    // Check if click is closer to start or end marker
    if (Math.abs(clickedTime - startTime) < Math.abs(clickedTime - endTime)) {
      setStartTime(Math.max(0, Math.min(clickedTime, endTime - 0.1)));
    } else {
      setEndTime(Math.min(duration, Math.max(clickedTime, startTime + 0.1)));
    }
    
    if (videoRef.current) {
      videoRef.current.currentTime = clickedTime;
      setCurrentTime(clickedTime);
    }
  };

  const handleStartDrag = (e) => {
    e.preventDefault();
    setIsDraggingStart(true);
  };

  const handleEndDrag = (e) => {
    e.preventDefault();
    setIsDraggingEnd(true);
  };

  const handleSelectionDrag = (e) => {
    e.preventDefault();
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    setDragStartX(e.clientX - rect.left);
    setDragStartValues({ start: startTime, end: endTime });
    setIsDraggingSelection(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingStart && !isDraggingEnd && !isDraggingSelection) return;
    if (!timelineRef.current || !duration || !videoRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newTime = (offsetX / rect.width) * duration;
    
    if (isDraggingStart) {
      const updatedStartTime = Math.max(0, Math.min(newTime, endTime - 0.1));
      setStartTime(updatedStartTime);
      setCurrentTime(updatedStartTime);
      videoRef.current.currentTime = updatedStartTime;
    } else if (isDraggingEnd) {
      const updatedEndTime = Math.min(duration, Math.max(newTime, startTime + 0.1));
      setEndTime(updatedEndTime);
      setCurrentTime(updatedEndTime);
      videoRef.current.currentTime = updatedEndTime;
    } else if (isDraggingSelection) {
      // Calculate the drag distance in time
      const dragDistance = ((offsetX - dragStartX) / rect.width) * duration;
      
      // Apply the drag to both start and end times, preserving the selection width
      const selectionWidth = dragStartValues.end - dragStartValues.start;
      let newStart = Math.max(0, dragStartValues.start + dragDistance);
      let newEnd = newStart + selectionWidth;
      
      // If we hit the right edge, adjust both markers to maintain selection width
      if (newEnd > duration) {
        newEnd = duration;
        newStart = Math.max(0, newEnd - selectionWidth);
      }
      
      setStartTime(newStart);
      setEndTime(newEnd);
      setCurrentTime(newStart);
      videoRef.current.currentTime = newStart;
    }
  };

  const handleMouseUp = () => {
    // Update video position on release
    if (videoRef.current) {
      if (isDraggingStart) {
        videoRef.current.currentTime = startTime;
      } else if (isDraggingEnd) {
        videoRef.current.currentTime = endTime;
      } else if (isDraggingSelection) {
        videoRef.current.currentTime = startTime;
      }
    }
    
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
    setIsDraggingSelection(false);
  };

  // Format time as mm:ss.ms
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Calculate trim duration
  const trimDuration = endTime - startTime;

  // Handle applying trim
  const handleApplyTrim = () => {
    onTrimComplete({
      startTime,
      endTime,
      duration: trimDuration
    });
  };

  // Preview playback within trim range
  const handlePreviewPlayback = () => {
    if (!videoRef.current) return;
    
    // Reset to start position
    videoRef.current.currentTime = startTime;
    videoRef.current.play();
    
    // Create a function to check if we've reached the end time
    const checkTimeUpdate = () => {
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.pause();
        videoRef.current.removeEventListener('timeupdate', checkTimeUpdate);
      }
    };
    
    // Add listener to stop at end time
    videoRef.current.addEventListener('timeupdate', checkTimeUpdate);
  };

  useEffect(() => {
    // Add global mouse move and up handlers
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingStart, isDraggingEnd, isDraggingSelection, startTime, endTime, dragStartX, dragStartValues]);

  return (
    <div className="video-trimmer bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full rounded-lg shadow-md max-h-72 object-contain bg-black"
            onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
            controls
            preload="auto"
          />
          {!isVideoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-white"></div>
              <span className="ml-3 text-white">Loading video...</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Frame Preview</span>
          </div>
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Current frame preview" 
              className="rounded-lg shadow-md max-h-72 object-contain bg-black w-full" 
            />
          ) : (
            <div className="w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No preview available</span>
            </div>
          )}
          <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
        </div>
      </div>
      
      {/* Hidden canvas for thumbnails */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Start: {formatTime(startTime)}</span>
          <span>Duration: {formatTime(trimDuration)}</span>
          <span>End: {formatTime(endTime)}</span>
        </div>
        
        <div 
          className="relative h-20 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer overflow-hidden"
          ref={timelineRef}
          onClick={handleTimelineClick}
        >
          {isLoadingThumbnails || !metadataLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading frames...</span>
            </div>
          ) : (
            <>
              {/* Thumbnails */}
              <div className="absolute top-0 left-0 w-full h-full flex">
                {thumbnails.map((thumb, index) => (
                  <div 
                    key={index}
                    className="h-full flex-grow"
                    style={{ 
                      backgroundImage: thumb.url ? `url(${thumb.url})` : 'none',
                      backgroundColor: !thumb.url ? 'rgba(0,0,0,0.2)' : 'transparent',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: `${100 / thumbnails.length}%`
                    }}
                  />
                ))}
              </div>
              
              {/* Selected area */}
              <div 
                className="absolute top-0 h-full bg-blue-500 bg-opacity-30 border-2 border-blue-500 cursor-move z-10"
                style={{
                  left: `${(startTime / duration) * 100}%`,
                  width: `${((endTime - startTime) / duration) * 100}%`
                }}
                onMouseDown={handleSelectionDrag}
                onTouchStart={handleSelectionDrag}
              />
              
              {/* Start handle */}
              <div 
                className="absolute top-0 h-full w-6 bg-blue-600 cursor-ew-resize touch-target-size z-20"
                style={{ left: `${(startTime / duration) * 100}%`, marginLeft: '-3px' }}
                onMouseDown={handleStartDrag}
                onTouchStart={handleStartDrag}
              />
              
              {/* End handle */}
              <div 
                className="absolute top-0 h-full w-6 bg-blue-600 cursor-ew-resize touch-target-size z-20"
                style={{ left: `${(endTime / duration) * 100}%`, marginLeft: '-3px' }}
                onMouseDown={handleEndDrag}
                onTouchStart={handleEndDrag}
              />
              
              {/* Current time indicator */}
              <div 
                className="absolute top-0 h-full w-px bg-red-500"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-between">
        <button 
          onClick={handlePreviewPlayback}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          disabled={!isVideoReady}
        >
          Preview Trim
        </button>
        
        <div className="flex space-x-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleApplyTrim}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Apply Trim
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoTrimmer; 