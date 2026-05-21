/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Prediction } from './types';

export default function App() {
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [onlineCount, setOnlineCount] = useState(521);
  const [lastPredictedMinute, setLastPredictedMinute] = useState<string | null>(null);
  const [waitMessage, setWaitMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitCountdown, setWaitCountdown] = useState(0);

  // Update online count randomly to feel "live"
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const delta = Math.floor(Math.random() * 15) - 7;
        // Range 370 to 721 as requested
        return Math.max(370, Math.min(721, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAdClick = () => {
    window.open('https://tpi.li/1000', '_blank', 'noopener,noreferrer');
  };

  const handlePredict = useCallback(() => {
    const now = new Date();
    const currentMinuteValue = now.getMinutes();
    const targetMinuteValue = (currentMinuteValue + 4) % 60;
    const targetMinuteStr = targetMinuteValue.toString().padStart(2, '0');

    if (lastPredictedMinute === targetMinuteStr) {
      setWaitMessage("Veuillez attendre quelques secondes...");
      setIsWaiting(true);
      setWaitCountdown(10);
      
      const waitTimer = setInterval(() => {
        setWaitCountdown(prev => {
          if (prev <= 1) {
            clearInterval(waitTimer);
            setIsWaiting(false);
            setWaitMessage(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setIsPredicting(true);
    setCountdown(30);
    
    // Countdown timer for 30s analysis
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate a "secure algorithm" calculation delay of 30s
    setTimeout(() => {
      const finalNow = new Date();
      
      // Realistic Multiplier Logic (Weighted Distribution)
      let multiplier: number;
      const rand = Math.random();
      
      if (rand < 0.6) {
        // 60% chance: 1.1x to 2.0x
        multiplier = Number((Math.random() * 0.9 + 1.1).toFixed(2));
      } else if (rand < 0.85) {
        // 25% chance: 2.0x to 4.0x
        multiplier = Number((Math.random() * 2.0 + 2.0).toFixed(2));
      } else if (rand < 0.95) {
        // 10% chance: 4.0x to 6.0x
        multiplier = Number((Math.random() * 2.0 + 4.0).toFixed(2));
      } else {
        // 5% chance: 6.0x to 12.0x
        multiplier = Number((Math.random() * 6.0 + 6.0).toFixed(2));
      }
      
      setCurrentPrediction({
        hourMinute: targetMinuteStr,
        multiplier,
        timestamp: finalNow.getTime()
      });
      setLastPredictedMinute(targetMinuteStr);
      setIsPredicting(false);
    }, 30000);
  }, [lastPredictedMinute]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#0d0d0d] font-sans text-white p-6 justify-between max-w-md mx-auto">
      {/* Header Status */}
      <div className="w-full flex items-center justify-start mb-8 text-sm">
        <div className="flex items-center gap-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-green-500" 
          />
          <span className="text-green-500 font-medium">{onlineCount} enligne</span>
        </div>
      </div>

      {/* Aviator Logo Area */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <div className="relative">
          <img 
            src="https://i.postimg.cc/QN9c18dv/images-2-removebg-preview.png" 
            alt="Aviator Logo" 
            className="w-48 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Main Prediction Display */}
      <div className="w-full flex flex-col items-center gap-8">
        <motion.div 
          initial={false}
          animate={{ scale: isPredicting ? 0.95 : 1 }}
          className="prediction-card w-full max-w-[280px] min-h-[160px] relative overflow-hidden"
        >
          {isPredicting ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-aviator-red border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-aviator-red">
                  {countdown}s
                </div>
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse text-center px-4">Analyse de l'algorithme...</p>
            </div>
          ) : currentPrediction ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPrediction.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="text-[rgb(156,255,0)] font-mono text-3xl font-bold">H{currentPrediction.hourMinute}</div>
                <div className="text-[rgb(156,255,0)] font-mono text-5xl font-black">{currentPrediction.multiplier.toFixed(2)}+</div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center opacity-30 text-gray-400">
               <TrendingUp size={48} className="mb-4" />
               <p className="font-mono text-sm">PRÊT À ANALYSER</p>
            </div>
          )}
          
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgb(156,255,0)]/5 to-transparent pointer-events-none" />
        </motion.div>

        {/* Predict Button */}
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={handlePredict}
            disabled={isPredicting || isWaiting}
            className="btn-predict uppercase disabled:opacity-50 disabled:grayscale min-w-[220px]"
          >
            {isPredicting ? `Analyse (${countdown}s)` : isWaiting ? `Attendre (${waitCountdown}s)` : "Prédire"}
          </button>
          
          <AnimatePresence>
            {waitMessage && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-xs text-orange-500 font-mono font-medium text-center"
              >
                {waitMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Advertisement Banner (Bottom Mirror of the image) */}
        <div className="w-full relative group cursor-pointer" onClick={handleAdClick}>
          {/* Glowing Background for Ad */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-500 rounded-3xl blur-[2px] opacity-20 group-hover:opacity-40 transition-opacity" />
          
          <div className="relative w-full h-20 glass-panel flex items-center justify-between px-6 bg-[#222] border-orange-500/20 rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <div className="flex items-center gap-3">
              <span className="text-[#f59e0b] font-mono font-black text-2xl tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                x174.31+
              </span>
              <span className="text-white/80 font-mono text-2xl font-bold">H</span>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-orange-400"
              >
                <ArrowRight size={24} />
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 p-2 rounded-2xl border border-white/20 shadow-lg px-4 flex items-center hover:bg-white/20 transition-colors"
              >
                 <Eye className="text-white drop-shadow-md" size={36} />
              </motion.div>
            </div>
            
            {/* Animated Light Sweep Effect */}
            <motion.div 
              animate={{ x: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Trusted Badges */}
      <div className="w-full flex items-center justify-center gap-8 mt-12 py-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-tighter">
          <ShieldCheck size={14} className="text-green-500" />
          Algorithme Sécurisé v2.4
        </div>
      </div>

      {/* BetPawa Logo */}
      <div className="mt-4 mb-8">
        <img 
          src="https://i.postimg.cc/BZrHCr8P/images-1-removebg-preview.png" 
          alt="BetPawa Logo" 
          className="h-10 object-contain opacity-90"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
