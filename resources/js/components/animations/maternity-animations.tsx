import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation de battement de cœur pour représenter la vie
export const HeartbeatAnimation = ({ 
  children, 
  className = "",
  intensity = 1.08,
  duration = 1.5,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      animate={{ 
        scale: [1, intensity, 1, intensity * 0.98, 1],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.14, 0.28, 0.42, 0.70],
        repeatDelay: 0.5
      }}
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation de croissance progressive pour symboliser le développement
export const GrowthAnimation = ({ 
  children, 
  className = "",
  duration = 20,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ 
        scale: [0.8, 0.85, 0.9, 0.95, 1],
      }}
      transition={{ 
        duration,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: 0
      }}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation de bercement doux pour évoquer le confort maternel
export const GentleRockingAnimation = ({ 
  children, 
  className = "",
  intensity = 3,
  duration = 4,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      animate={{ 
        rotate: [-intensity, intensity, -intensity],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={cn("inline-block origin-bottom", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation de vagues pour représenter la fluidité et le liquide amniotique
export const AmniotiqueWaveAnimation = ({ 
  children, 
  className = "",
  height = 8,
  color = "var(--accent-300)",
  opacity = 0.3,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  height?: number;
  color?: string;
  opacity?: number;
  [key: string]: unknown;
}) => {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 rounded-b-lg overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${color} ${opacity * 100}%), transparent)`,
          }}
          animate={{ 
            x: ["-100%", "100%"]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${color} ${opacity * 100}%), transparent)`,
          }}
          animate={{ 
            x: ["-100%", "100%"]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
    </div>
  );
};

// Animation de calendrier pour le suivi de grossesse
export const PregnancyCalendarAnimation = ({ 
  currentWeek = 1,
  totalWeeks = 40,
  className = "",
  ...props 
}: {
  currentWeek?: number;
  totalWeeks?: number;
  className?: string;
  [key: string]: unknown;
}) => {
  // Assurer que currentWeek est dans les limites
  const week = Math.max(1, Math.min(currentWeek, totalWeeks));
  const progress = (week / totalWeeks) * 100;
  
  return (
    <div className={cn("relative w-full h-3 bg-[color:var(--primary-100)] dark:bg-[color:var(--primary-800)] rounded-full overflow-hidden", className)} {...props}>
      <motion.div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[color:var(--accent-300)] to-[color:var(--accent-500)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute top-0 left-0 h-full bg-white/30"
        style={{ width: `${progress}%` }}
        animate={{ 
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Illustration animée d'une plante qui pousse (symbolisant la croissance)
export const GrowingPlantAnimation = ({ 
  className = "",
  stemColor = "var(--accent-600)",
  leafColor = "var(--primary-300)",
  flowerColor = "var(--accent-400)",
  flowerCenterColor = "var(--accent-200)",
  ...props 
}: {
  className?: string;
  stemColor?: string;
  leafColor?: string;
  flowerColor?: string;
  flowerCenterColor?: string;
  [key: string]: unknown;
}) => {
  return (
    <div className={cn("relative w-20 h-32", className)} {...props}>
      {/* Tige */}
      <motion.div 
        className="absolute bottom-0 left-1/2 w-1.5 -translate-x-1/2"
        style={{ backgroundColor: `color-mix(in srgb, ${stemColor} 100%, transparent)` }}
        initial={{ height: 0 }}
        animate={{ height: "80%" }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      {/* Feuilles */}
      <motion.div 
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <div className="relative">
          <motion.div 
            className="absolute w-8 h-4 rounded-full -left-10 top-0"
            style={{ backgroundColor: `color-mix(in srgb, ${leafColor} 100%, transparent)` }}
            initial={{ rotate: -20, scale: 0.5 }}
            animate={{ rotate: -30, scale: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
          />
          <motion.div 
            className="absolute w-8 h-4 rounded-full -right-10 top-0"
            style={{ backgroundColor: `color-mix(in srgb, ${leafColor} 100%, transparent)` }}
            initial={{ rotate: 20, scale: 0.5 }}
            animate={{ rotate: 30, scale: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
          />
        </div>
      </motion.div>
      
      {/* Fleur */}
      <motion.div 
        className="absolute top-2 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        <div className="relative">
          <motion.div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: `color-mix(in srgb, ${flowerColor} 100%, transparent)` }}
            animate={{ 
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `color-mix(in srgb, ${flowerCenterColor} 100%, transparent)` }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Animation d'un bébé qui bouge doucement
export const BabyMovementAnimation = ({ 
  className = "",
  bodyColor = "var(--primary-300)",
  headColor = "var(--primary-200)",
  ...props 
}: {
  className?: string;
  bodyColor?: string;
  headColor?: string;
  [key: string]: unknown;
}) => {
  return (
    <div className={cn("relative w-16 h-16", className)} {...props}>
      {/* Corps du bébé stylisé */}
      <motion.div 
        className="w-10 h-10 rounded-full mx-auto"
        style={{ backgroundColor: `color-mix(in srgb, ${bodyColor} 100%, transparent)` }}
        animate={{ 
          y: [0, -3, 0, -2, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Tête stylisée */}
        <motion.div 
          className="w-8 h-8 rounded-full relative -top-5 mx-auto"
          style={{ backgroundColor: `color-mix(in srgb, ${headColor} 100%, transparent)` }}
          animate={{ 
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
    </div>
  );
};

// Animation de cercle de protection pour symboliser les soins et l'accompagnement
export const ProtectionCircleAnimation = ({ 
  children, 
  className = "",
  circleColor = "var(--accent-400)",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  circleColor?: string;
  [key: string]: unknown;
}) => {
  return (
    <div className={cn("relative inline-flex", className)} {...props}>
      {children}
      <motion.div 
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `color-mix(in srgb, ${circleColor} 100%, transparent)` }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Animation de soleil levant pour symboliser l'espoir
export const SunriseAnimation = ({ 
  className = "",
  sunColor1 = "var(--accent-300)",
  sunColor2 = "var(--accent-500)",
  rayColor = "var(--accent-300)",
  ...props 
}: {
  className?: string;
  sunColor1?: string;
  sunColor2?: string;
  rayColor?: string;
  [key: string]: unknown;
}) => {
  return (
    <div className={cn("relative w-20 h-20", className)} {...props}>
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full"
        style={{ 
          background: `linear-gradient(to right, color-mix(in srgb, ${sunColor1} 100%, transparent), color-mix(in srgb, ${sunColor2} 100%, transparent))` 
        }}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Rayons du soleil */}
      {[...Array(8)].map((_, i) => (
        <motion.div 
          key={i}
          className="absolute top-1/2 left-1/2 w-1 h-5"
          style={{ 
            backgroundColor: `color-mix(in srgb, ${rayColor} 100%, transparent)`,
            transformOrigin: "bottom center",
            rotate: `${i * 45}deg`,
            translateX: "-50%"
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 0.7, height: 5 }}
          transition={{ 
            delay: 2 + (i * 0.1),
            duration: 1
          }}
        />
      ))}
    </div>
  );
};

// Animation d'un stéthoscope pour symboliser le suivi médical
export const StethoscopeAnimation = ({ 
  className = "",
  color = "var(--primary-600)",
  pulseColor = "var(--accent-500)",
  ...props 
}: {
  className?: string;
  color?: string;
  pulseColor?: string;
  [key: string]: unknown;
}) => {
  return (
    <div className={cn("relative w-16 h-16", className)} {...props}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.path 
          d="M4.5 12.5L4.5 15C4.5 18.5 7.5 20 10 20C12.5 20 15.5 18.5 15.5 15L15.5 12.5" 
          stroke={`color-mix(in srgb, ${color} 100%, transparent)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path 
          d="M4.5 9.5V4.5C4.5 3.67157 5.17157 3 6 3H7.5C8.32843 3 9 3.67157 9 4.5V9.5C9 10.3284 8.32843 11 7.5 11H6C5.17157 11 4.5 10.3284 4.5 9.5Z" 
          stroke={`color-mix(in srgb, ${color} 100%, transparent)`}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.path 
          d="M15.5 9.5V4.5C15.5 3.67157 16.1716 3 17 3H18.5C19.3284 3 20 3.67157 20 4.5V9.5C20 10.3284 19.3284 11 18.5 11H17C16.1716 11 15.5 10.3284 15.5 9.5Z" 
          stroke={`color-mix(in srgb, ${color} 100%, transparent)`}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.circle 
          cx="10" 
          cy="15" 
          r="2" 
          stroke={`color-mix(in srgb, ${color} 100%, transparent)`}
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
        />
        <motion.path 
          d="M9 11V9.5H15.5V11" 
          stroke={`color-mix(in srgb, ${color} 100%, transparent)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
        />
      </svg>
      
      {/* Pulsation du stéthoscope */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
        style={{ backgroundColor: `color-mix(in srgb, ${pulseColor} 100%, transparent)` }}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};