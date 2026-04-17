import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiLoader4Line, RiCheckDoubleLine, RiPlayCircleLine } from 'react-icons/ri';

export default function VideoGenerator({ concept }) {
  const [status, setStatus] = useState('idle'); // idle | queued | processing | completed | failed
  const [jobId, setJobId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    let interval;
    if (status === 'queued' || status === 'processing') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/video/status/${jobId}`);
          const data = await res.json();
          
          if (data.status === 'completed') {
            setStatus('completed');
            setVideoUrl(data.videoUrl); // Get contextual video URL from backend
            clearInterval(interval);
          } else if (data.status === 'failed') {
            setStatus('failed');
            clearInterval(interval);
          } else {
            setStatus(data.status); // processing
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status, jobId]);

  const handleGenerate = async () => {
    setStatus('queued');
    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept })
      });
      const data = await res.json();
      setJobId(data.jobId);
    } catch {
      setStatus('failed');
    }
  };

  return (
    <div className="mt-6 border border-accent-cyan/20 bg-dark-800/50 rounded-xl overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-dark-700/50 border-b border-dark-600">
        <h4 className="flex items-center gap-2 text-sm font-bold text-accent-cyan">
          <RiPlayCircleLine className="text-lg" />
          AI Video Explainer
        </h4>
        
        {status === 'idle' && (
          <button onClick={handleGenerate} className="text-xs px-3 py-1.5 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 rounded-lg transition-colors font-medium">
            Generate Video
          </button>
        )}
        
        {(status === 'queued' || status === 'processing') && (
          <span className="flex items-center gap-1.5 text-xs text-accent-amber font-medium">
            <RiLoader4Line className="animate-spin text-sm" /> Rendering...
          </span>
        )}
        
        {status === 'completed' && (
           <span className="flex items-center gap-1.5 text-xs text-accent-emerald font-medium">
            <RiCheckDoubleLine /> Done
          </span>
        )}
      </div>

      {/* Content */}
      <motion.div animate={{ height: 'auto' }} className="p-4 text-xs text-dark-300">
        {status === 'idle' && <p>Visualize this concept! Allow the AI to construct an educational animation for: <strong className="text-dark-100">{concept}</strong></p>}
        {(status === 'queued' || status === 'processing') && <p className="animate-pulse">The AI is currently rendering the frames for this video. Please wait...</p>}
        {status === 'failed' && <p className="text-accent-rose">Job failed. Please try again later.</p>}
        
        {status === 'completed' && (
          <div className="mt-2 rounded-xl border border-dark-600 shadow-xl bg-black relative w-full pt-[56.25%] overflow-hidden">
             {videoUrl ? (
               <iframe 
                src={videoUrl}
                title="AI Explainer Video"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
             ) : (
               <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading Video...</p>
             )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
