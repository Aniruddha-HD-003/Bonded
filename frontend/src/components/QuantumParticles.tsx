import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const QuantumParticles: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const particles: Particle[] = [];

  // Generate random particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    });
  }

  return (
    <div
      ref={particlesRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, -200, -300],
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25],
            opacity: [0, 0.8, 0.4, 0],
            scale: [0, 1, 1.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Quantum Energy Streams */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-px h-32 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-20"
          style={{
            left: `${(i * 12.5) + Math.random() * 10}%`,
            top: '-32px',
          }}
          animate={{
            y: [0, window.innerHeight + 32],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Quantum Grid Lines */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`grid-h-${i}`}
            className="absolute w-full h-px bg-green-400"
            style={{ top: `${i * 5}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`grid-v-${i}`}
            className="absolute h-full w-px bg-green-400"
            style={{ left: `${i * 5}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1 + 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default QuantumParticles; 