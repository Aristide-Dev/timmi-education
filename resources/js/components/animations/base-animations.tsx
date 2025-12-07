import { motion } from 'framer-motion';
import React from 'react';

// Animations de transition pour les éléments qui apparaissent
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = "",
  direction = "up", // "up", "down", "left", "right", "none"
  distance = 20,
  once = true,
  ...props 
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  [key: string]: unknown;
}) => {
  // Calcul des propriétés d'animation en fonction de la direction
  const getDirectionProps = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...getDirectionProps()
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation de pulsation pour attirer l'attention
export const Pulse = ({ 
  children, 
  className = "",
  intensity = 1.05, // Facteur d'échelle
  duration = 2,
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
        scale: [1, intensity, 1],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation de brillance pour les éléments importants
export const Shimmer = ({ 
  children, 
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {children}
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1
        }}
      />
    </div>
  );
};

// Animation de rebond pour les éléments interactifs
export const Bounce = ({ 
  children, 
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation de flottement pour les éléments décoratifs
export const Float = ({ 
  children, 
  className = "",
  amplitude = 10, // Amplitude du mouvement en pixels
  duration = 4,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      animate={{ 
        y: [-amplitude/2, amplitude/2, -amplitude/2],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation pour les transitions de page
export const PageTransition = ({ 
  children,
  ...props 
}: {
  children: React.ReactNode;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation pour les cartes qui se retournent
export const FlipCard = ({ 
  front, 
  back,
  className = "",
  ...props 
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      {...props}
    >
      <motion.div
        className="absolute inset-0 backface-hidden"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ backfaceVisibility: "hidden" }}
      >
        {front}
      </motion.div>
      <motion.div
        className="absolute inset-0 backface-hidden"
        initial={{ rotateY: 180 }}
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ backfaceVisibility: "hidden" }}
      >
        {back}
      </motion.div>
    </div>
  );
};

// Animation de vague pour représenter le flux et le mouvement
export const WaveEffect = ({ 
  children, 
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      {...props}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-3 bg-[color:var(--accent-300)]/30 rounded-full"
        initial={{ scaleX: 0.8, opacity: 0.5 }}
        animate={{ 
          scaleX: [0.8, 1.1, 0.8],
          opacity: [0.5, 0.8, 0.5],
          x: ["-5%", "5%", "-5%"]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

// Animation de croissance progressive
export const GrowEffect = ({ 
  children, 
  className = "",
  delay = 0,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  [key: string]: unknown;
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Conteneur avec des animations staggered pour les enfants
export const StaggerContainer = ({ 
  children, 
  className = "",
  staggerDelay = 0.1,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  [key: string]: unknown;
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-ignore - We know this is a valid framer-motion prop
            variants: {
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }
          });
        }
        return child;
      })}
    </motion.div>
  );
};
