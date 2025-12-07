import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Types pour les options d'optimisation
export interface AnimationOptimizationOptions {
  disableOnLowPowerMode?: boolean;
  disableOnReducedMotion?: boolean;
  disableOnLowMemory?: boolean;
  disableOnBatteryLow?: boolean;
  disableOnSlowConnection?: boolean;
  enableLazyLoading?: boolean;
  throttleAnimations?: boolean;
  animationDistance?: number;
  staggerDelay?: number;
  transitionDuration?: number;
}

// Hook pour optimiser les animations en fonction des préférences utilisateur et des capacités de l'appareil
export function useOptimizedAnimations(options: AnimationOptimizationOptions = {}) {
  const {
    disableOnLowPowerMode = true,
    disableOnReducedMotion = true,
    disableOnLowMemory = true,
    disableOnBatteryLow = true,
    disableOnSlowConnection = true,
    enableLazyLoading = true,
    throttleAnimations = true,
    animationDistance = 30,
    staggerDelay = 0.15,
    transitionDuration = 0.6
  } = options;

  // Détection des préférences de réduction de mouvement
  const prefersReducedMotion = useReducedMotion();
  
  // États pour les différentes optimisations
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [isLowMemory, setIsLowMemory] = useState(false);
  const [isBatteryLow, setIsBatteryLow] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Vérifier les capacités du navigateur et les conditions système
  useEffect(() => {
    // Détection de la connexion lente
    if ('connection' in navigator && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      
      const updateConnectionStatus = () => {
        const isSlow = connection.downlink < 1.5 || 
                      connection.effectiveType === 'slow-2g' || 
                      connection.effectiveType === '2g' || 
                      connection.saveData === true;
        setIsSlowConnection(isSlow);
      };
      
      updateConnectionStatus();
      connection.addEventListener('change', updateConnectionStatus);
      return () => connection.removeEventListener('change', updateConnectionStatus);
    }
    
    // Détection de la batterie faible
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          setIsBatteryLow(battery.level < 0.15 && !battery.charging);
        };
        
        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      }).catch(() => {
        // Batterie API non disponible, ne rien faire
      });
    }
    
    // Détection de la mémoire faible
    if ('deviceMemory' in navigator) {
      setIsLowMemory((navigator as unknown).deviceMemory < 4);
    }
    
    // Lazy loading des animations
    if (enableLazyLoading) {
      const timer = setTimeout(() => {
        setIsInView(true);
        setShouldAnimate(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [enableLazyLoading]);
  
  // Déterminer si les animations devraient être désactivées
  const shouldDisableAnimations = useMemo(() => {
    return (disableOnReducedMotion && prefersReducedMotion) ||
           (disableOnLowPowerMode && isLowPowerMode) ||
           (disableOnLowMemory && isLowMemory) ||
           (disableOnBatteryLow && isBatteryLow) ||
           (disableOnSlowConnection && isSlowConnection);
  }, [
    prefersReducedMotion, isLowPowerMode, isLowMemory, isBatteryLow, isSlowConnection,
    disableOnReducedMotion, disableOnLowPowerMode, disableOnLowMemory, disableOnBatteryLow, disableOnSlowConnection
  ]);
  
  // Calculer la durée et le délai optimisés pour les animations
  const getOptimizedDuration = useCallback((baseDuration: number) => {
    if (shouldDisableAnimations) return 0.01;
    if (throttleAnimations && (isLowMemory || isSlowConnection)) return baseDuration * 0.5;
    return baseDuration;
  }, [shouldDisableAnimations, throttleAnimations, isLowMemory, isSlowConnection]);
  
  // Calculer le délai de décalage optimisé pour les animations
  const getOptimizedStaggerDelay = useCallback((baseDelay: number) => {
    if (shouldDisableAnimations) return 0;
    if (throttleAnimations && (isLowMemory || isSlowConnection)) return baseDelay * 0.3;
    return baseDelay;
  }, [shouldDisableAnimations, throttleAnimations, isLowMemory, isSlowConnection]);
  
  // Créer les variantes d'animation optimisées
  const animationVariants = useMemo(() => ({
    // Animations de base respectant les préférences utilisateur
    containerVariants: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          staggerChildren: getOptimizedStaggerDelay(staggerDelay),
          duration: getOptimizedDuration(0.8)
        }
      }
    },
    
    itemVariants: {
      hidden: { 
        opacity: 0, 
        y: shouldDisableAnimations ? 0 : animationDistance
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: getOptimizedDuration(transitionDuration),
          ease: "easeOut"
        }
      }
    },
    
    // Animations subtiles pour les éléments décoratifs
    particleVariants: shouldDisableAnimations ? {} : {
      animate: {
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
        y: [0, -15, 0],
      },
      transition: {
        duration: getOptimizedDuration(4),
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    
    // Animation de fondu simple
    fadeVariants: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: getOptimizedDuration(0.5),
          ease: "easeOut"
        }
      }
    },
    
    // Animation de zoom
    zoomVariants: {
      hidden: { 
        opacity: 0, 
        scale: shouldDisableAnimations ? 1 : 0.9
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: getOptimizedDuration(0.5),
          ease: "easeOut"
        }
      }
    },
    
    // Animation de glissement
    slideVariants: {
      hidden: { 
        opacity: 0, 
        x: shouldDisableAnimations ? 0 : -30
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: getOptimizedDuration(0.6),
          ease: "easeOut"
        }
      }
    }
  }), [
    shouldDisableAnimations, 
    getOptimizedDuration, 
    getOptimizedStaggerDelay,
    staggerDelay,
    transitionDuration,
    animationDistance
  ]);
  
  // Fonction pour créer des variantes d'animation personnalisées
  const createCustomVariants = useCallback((
    hiddenProps: any, 
    visibleProps: any, 
    transitionProps: any = {}
  ) => {
    return {
      hidden: { 
        ...hiddenProps,
        opacity: hiddenProps.opacity ?? 0
      },
      visible: { 
        ...visibleProps,
        opacity: visibleProps.opacity ?? 1,
        transition: {
          duration: getOptimizedDuration(transitionProps.duration ?? transitionDuration),
          ease: transitionProps.ease ?? "easeOut",
          delay: transitionProps.delay ?? 0,
          ...transitionProps
        }
      }
    };
  }, [getOptimizedDuration, transitionDuration]);
  
  return {
    // États d'optimisation
    prefersReducedMotion,
    shouldDisableAnimations,
    isLowPowerMode,
    isLowMemory,
    isBatteryLow,
    isSlowConnection,
    shouldAnimate,
    isInView,
    
    // Variantes d'animation
    animationVariants,
    
    // Fonctions utilitaires
    getOptimizedDuration,
    getOptimizedStaggerDelay,
    createCustomVariants,
    
    // Fonction pour définir manuellement si les animations doivent être affichées
    setShouldAnimate,
    setIsInView
  };
}