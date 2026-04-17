import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMicLine, RiMicOffLine, RiVolumeUpLine, RiCloseLine, RiLoader4Line } from 'react-icons/ri';

export default function VoiceTutor({ initialText, questionDetails, solutionSteps, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef(null);
  
  // Refs to avoid closure traps in Web Speech API handlers
  const transcriptRef = useRef(transcript);
  const isListeningRef = useRef(isListening);
  const isProcessingRef = useRef(isProcessing);
  
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      // When the user stops talking or mic is toggled off
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcriptRef.current.trim().length > 0 && !isProcessingRef.current) {
          processVoiceQuery(transcriptRef.current);
        }
      };
    } else {
      setAiResponse("Sorry, Web Speech API is not supported in this browser.");
    }

    if (initialText) {
      speak(initialText);
      setAiResponse(initialText);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = () => {
    if (isListening) {
      // The onend event will handle the processing
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setIsListening(true);
      window.speechSynthesis.cancel();
      recognitionRef.current?.start();
    }
  };

  const speak = (text) => {
    // Strip markdown chars before speaking
    const cleanText = text.replace(/[\*#_]/g, '').replace(/\$[^$]+\$/g, ' equation ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0; 
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const processVoiceQuery = async (queryText) => {
    if (!queryText || !queryText.trim() || isProcessingRef.current) return;
    
    setIsProcessing(true);
    setIsListening(false);
    
    try {
      // Create a massive context block for the Voice Endpoint
      const fullContext = `Original Question: ${questionDetails}\n\nSolution Steps Provided to Student:\n${solutionSteps.map(s => `- Step ${s.number}: ${s.content}`).join('\n')}`;
      
      const response = await fetch('/api/solve/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepIndex: "Voice Overall",
          question: queryText,
          context: { title: "Overall Answer Context", content: fullContext }
        })
      });
      
      const data = await response.json();
      setAiResponse(data.answer);
      speak(data.answer);
      
    } catch(err) {
      setAiResponse("I had trouble understanding that. Please ensure you are connected.");
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-6 right-6 w-80 bg-dark-800 rounded-2xl shadow-xl border border-dark-600 overflow-hidden z-50 flex flex-col"
    >
      <div className="gradient-bg px-4 py-3 flex justify-between items-center text-white">
        <h3 className="font-bold flex items-center gap-2">
          <RiVolumeUpLine /> Voice Tutor
        </h3>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <RiCloseLine />
        </button>
      </div>
      
      <div className="p-5 flex-1 min-h-[150px] max-h-[300px] overflow-y-auto custom-scrollbar">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full text-accent-cyan space-y-3">
             <RiLoader4Line className="animate-spin text-3xl" />
             <p className="text-sm font-medium animate-pulse">Thinking...</p>
          </div>
        ) : (
          <div className="text-sm text-dark-200 leading-relaxed whitespace-pre-wrap">
             {aiResponse || "Hi there! I am your AI Voice Tutor. Click the microphone to ask me a question aloud."}
          </div>
        )}
        
        {transcript && (
          <div className="mt-4 p-3 bg-dark-700 rounded-xl text-xs text-dark-300 italic border-l-2 border-accent-cyan">
            " {transcript} "
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-dark-700 flex justify-center bg-dark-900/50">
        <button 
          onClick={toggleListening}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-lg ${
            isListening 
              ? 'bg-accent-rose text-white animate-pulse shadow-accent-rose/30 border-4 border-accent-rose/20' 
              : 'bg-dark-700 text-dark-300 border border-dark-600 hover:bg-dark-600 hover:text-white'
          }`}
        >
          {isListening ? <RiMicLine /> : <RiMicOffLine />}
        </button>
      </div>
    </motion.div>
  );
}
