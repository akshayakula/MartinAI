import React from 'react';
import { motion } from 'framer-motion';

const DefenseLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-20 h-20">
        {/* Outer hexagon */}
        <motion.div 
          className="absolute inset-0 border-2 border-accent"
          style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
          animate={{ 
            rotate: 360,
            borderColor: ['#14b8a6', '#0ea5e9', '#6366f1', '#14b8a6'] 
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner circle pulse */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-8 bg-highlight rounded-full opacity-70" />
        </motion.div>
        
        {/* Radar scan effect */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            background: 'conic-gradient(from 0deg, transparent, rgba(14, 165, 233, 0.3), transparent)',
            borderRadius: '50%',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default DefenseLoader; 