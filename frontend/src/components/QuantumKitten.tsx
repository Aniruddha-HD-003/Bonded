import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';

interface QuantumKittenProps {
  isMobile?: boolean;
}

const QuantumKitten: React.FC<QuantumKittenProps> = ({ isMobile = false }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const kittenRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mouse tracking for desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const kittenX = useSpring(mouseX, springConfig);
  const kittenY = useSpring(mouseY, springConfig);

  // Transform for smooth following
  const rotateX = useTransform(kittenY, [-100, 100], [15, -15]);
  const rotateY = useTransform(kittenX, [-100, 100], [-15, 15]);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  // Idle animation
  useEffect(() => {
    const idleTimer = setTimeout(() => setIsIdle(true), 5000);
    return () => clearTimeout(idleTimer);
  }, []);

  const handleClick = () => {
    setIsClicked(true);
    
    // Create quantum particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);

    // Play meow sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Fallback: create audio context for meow
        createMeowSound();
      });
    } else {
      createMeowSound();
    }

    // Reset click state
    setTimeout(() => setIsClicked(false), 600);
    
    // Clear particles
    setTimeout(() => setParticles([]), 2000);
  };

  const createMeowSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsIdle(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // GSAP animations for idle state
  useEffect(() => {
    if (isIdle && kittenRef.current) {
      gsap.to(kittenRef.current, {
        y: -5,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }, [isIdle]);

  if (isMobile) {
    return (
      <motion.div
        className="quantum-kitten"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      >
        <div className="relative">
          {/* Quantum Assistant Bubble */}
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full quantum-glow flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Energy Rings */}
          <motion.div
            className="absolute inset-0 border-2 border-cyan-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 border border-cyan-300 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src="/meow.mp3" type="audio/mpeg" />
      </audio>
      
      <motion.div
        ref={kittenRef}
        className="quantum-kitten"
        style={{
          x: kittenX,
          y: kittenY,
          rotateX,
          rotateY,
        }}
        animate={{
          scale: isClicked ? [1, 1.2, 1] : isHovered ? 1.1 : 1,
          rotate: isClicked ? [0, 360] : 0,
        }}
        transition={{
          scale: { duration: 0.2 },
          rotate: { duration: 0.6, ease: "easeInOut" }
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          {/* Quantum Kitten Body */}
          <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-100 rounded-full quantum-glow relative overflow-hidden">
            {/* Kitten Face */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Eyes */}
              <div className="flex space-x-2">
                <motion.div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{
                    scale: isHovered ? [1, 1.2, 1] : 1,
                    opacity: isHovered ? [1, 0.5, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{
                    scale: isHovered ? [1, 1.2, 1] : 1,
                    opacity: isHovered ? [1, 0.5, 1] : 1
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </div>
            </div>
            
            {/* Nose */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2">
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
            </div>
            
            {/* Ears */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-300 rounded-t-full transform rotate-45"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-300 rounded-t-full transform -rotate-45"></div>
          </div>
          
          {/* Energy Field */}
          <motion.div
            className="absolute inset-0 border-2 border-green-400 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Quantum Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="quantum-particle"
              style={{
                left: `${50 + particle.x}%`,
                top: `${50 + particle.y}%`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1, 0], opacity: [1, 0.8, 0] }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          ))}
          
          {/* Idle Animation - Sleeping */}
          {isIdle && (
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="text-2xl">💤</div>
            </motion.div>
          )}
          
          {/* Hover Effect - Winking */}
          {isHovered && (
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <div className="text-2xl">😉</div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default QuantumKitten; 