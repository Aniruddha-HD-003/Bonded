import React from 'react';

interface BondedLogoProps {
  size?: number;
  className?: string;
  src?: string; // Add src prop for custom image
}

const BondedLogo: React.FC<BondedLogoProps> = ({ size = 40, className = '', src }) => {
  // If custom image is provided, use it
  if (src) {
    return (
      <img 
        src={src}
        alt="Bonded Logo" 
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      />
    );
  }

  // Default logo (fallback)
  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.6,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        border: '2px solid rgba(255,255,255,0.3)'
      }}
    >
      B
    </div>
  );
};

export default BondedLogo; 