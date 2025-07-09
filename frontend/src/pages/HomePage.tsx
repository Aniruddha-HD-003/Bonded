import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BondedLogo from '../components/BondedLogo';
import QuantumKitten from '../components/QuantumKitten';
import QuantumParticles from '../components/QuantumParticles';
import { 
  LayoutDashboard as DashboardIcon,
  Rocket as RocketIcon,
  Shield as ShieldIcon,
  Sparkles as SparklesIcon,
  Zap as ZapIcon
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { scrollYProgress } = useScroll();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { setIsLoaded(true); }, []);

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
    hover: { scale: 1.07, y: -12, boxShadow: '0 0 40px #00ff88', transition: { duration: 0.3, ease: easeOut } }
  };

  return (
    <Box className="quantum-bg min-h-screen relative overflow-hidden">
      <QuantumParticles />
      <QuantumKitten isMobile={isMobile} />
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div variants={containerVariants} initial="hidden" animate={isLoaded ? "visible" : "hidden"}>
          {/* HERO SECTION */}
          <motion.div style={{ y: heroY }} variants={itemVariants} className="flex flex-col items-center justify-center text-center py-20">
            <motion.div variants={itemVariants} className="mb-8 relative">
              <div className="relative inline-block animate-quantum-float">
                <BondedLogo size={isMobile ? 80 : 140} src="/Bonded.png" />
                {/* Quantum Energy Rings */}
                <motion.div className="absolute inset-0 border-2 border-green-400 rounded-full" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute inset-0 border border-blue-400 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, -360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
              </div>
            </motion.div>
            <motion.h1 variants={itemVariants} className="font-orbitron font-black text-5xl md:text-7xl quantum-text-glow bg-gradient-to-r from-quantum-green via-quantum-blue to-quantum-purple bg-clip-text text-transparent animate-gradient mb-4">
              Welcome to Bonded
            </motion.h1>
            <motion.h2 variants={itemVariants} className="font-orbitron text-2xl md:text-4xl text-green-400 mb-4 tracking-widest animate-quantum-pulse">
              Quantum Social Network
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg md:text-xl animate-quantum-float">
              Experience the future of social connection in a quantum-powered, private, and playful space.
            </motion.p>
            <motion.p variants={itemVariants} className="text-gray-400 max-w-xl mx-auto mb-8">
              Create exclusive groups, share moments, and stay connected with your closest friends in a secure, holographic environment powered by quantum technology.
            </motion.p>
          </motion.div>

          {/* QUANTUM FEATURES */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
            {[
              { icon: ShieldIcon, title: "Quantum Security", desc: "Advanced encryption protocols" },
              { icon: SparklesIcon, title: "Holographic UI", desc: "Next-gen interface design" },
              { icon: ZapIcon, title: "Real-time Sync", desc: "Instant quantum communication" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="quantum-glass rounded-2xl p-8 text-center shadow-lg border border-quantum-green/30 hover:border-quantum-green quantum-glow transition-all duration-300"
                whileHover={{ scale: 1.08, y: -8, boxShadow: '0 0 40px #00ff88' }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="w-14 h-14 text-green-400 mx-auto mb-4 animate-quantum-pulse" />
                <Typography variant="h6" className="text-white font-semibold mb-2 font-orbitron">
                  {feature.title}
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  {feature.desc}
                </Typography>
              </motion.div>
            ))}
          </motion.div>

          {/* ACTION CARDS */}
          <motion.div style={{ y: cardsY }} variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto pb-20">
            {/* CREATE GROUP CARD */}
            <motion.div variants={cardVariants} whileHover="hover" className="quantum-card cursor-pointer group" onClick={() => navigate('/onboarding')}>
              <div className="text-center relative">
                <motion.div className="w-28 h-28 mx-auto mb-8 relative animate-quantum-float" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full quantum-glow flex items-center justify-center">
                    <RocketIcon className="w-14 h-14 text-white" />
                  </div>
                  <motion.div className="absolute inset-0 border-2 border-green-400 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                </motion.div>
                <Typography variant="h4" className="font-orbitron font-bold text-white mb-4 tracking-widest">
                  Initialize Group
                </Typography>
                <Typography variant="body1" className="text-gray-300 mb-6 leading-relaxed">
                  Launch a new quantum social space for your friends, family, or team. Set up secure credentials and invite members to your private network.
                </Typography>
                <motion.div className="quantum-button" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
                  <RocketIcon className="w-5 h-5 mr-2" />
                  Quantum Launch
                </motion.div>
              </div>
            </motion.div>
            {/* SIGN IN CARD */}
            <motion.div variants={cardVariants} whileHover="hover" className="quantum-card cursor-pointer group" onClick={() => navigate('/login')}>
              <div className="text-center relative">
                <motion.div className="w-28 h-28 mx-auto mb-8 relative animate-quantum-float" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full quantum-glow flex items-center justify-center">
                    <DashboardIcon className="w-14 h-14 text-white" />
                  </div>
                  <motion.div className="absolute inset-0 border-2 border-blue-400 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                </motion.div>
                <Typography variant="h4" className="font-orbitron font-bold text-white mb-4 tracking-widest">
                  Quantum Access
                </Typography>
                <Typography variant="body1" className="text-gray-300 mb-6 leading-relaxed">
                  Already have a quantum group? Authenticate with your credentials to access your secure social space and continue your journey.
                </Typography>
                <motion.div className="quantum-button" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
                  <DashboardIcon className="w-5 h-5 mr-2" />
                  Quantum Login
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
      {/* Quantum Footer is handled in App.tsx */}
    </Box>
  );
};

export default HomePage; 