import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center border gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--primary-600)] text-white shadow-xs hover:bg-[color:var(--primary-700)] border-[color:var(--primary-700)]",
        outline:
          "border border-[color:var(--primary-300)] bg-transparent shadow-xs hover:bg-[color:var(--primary-100)] hover:text-[color:var(--primary-800)] dark:border-[color:var(--primary-700)] dark:hover:bg-[color:var(--primary-800)]/20 dark:hover:text-white",
        secondary:
          "bg-[color:var(--primary-200)] text-[color:var(--primary-800)] shadow-xs hover:bg-[color:var(--primary-300)] dark:bg-[color:var(--primary-800)] dark:text-white dark:hover:bg-[color:var(--primary-700)]",
        ghost: "hover:bg-[color:var(--primary-100)] hover:text-[color:var(--primary-800)] dark:hover:bg-[color:var(--primary-800)]/20 dark:hover:text-white",
        link: "text-[color:var(--primary-600)] underline-offset-4 hover:underline dark:text-[color:var(--primary-400)]",
        accent: "bg-[color:var(--accent-500)] text-white shadow-xs hover:bg-[color:var(--accent-600)] border-[color:var(--accent-600)]",
        danger: "bg-red-500 text-white shadow-xs hover:bg-red-600 border-red-600",
        warning: "bg-yellow-500 text-white shadow-xs hover:bg-yellow-600 border-yellow-600",
        primary: "bg-[color:var(--primary-500)] text-white shadow-xs hover:bg-[color:var(--primary-600)] border-[color:var(--primary-600)]",
        "primary-outline": "bg-transparent text-[color:var(--primary-600)] border-[color:var(--primary-500)] shadow-xs hover:bg-[color:var(--primary-50)] dark:text-[color:var(--primary-400)] dark:border-[color:var(--primary-500)] dark:hover:bg-[color:var(--primary-900)]/30",
        "accent-outline": "bg-transparent text-[color:var(--accent-600)] border-[color:var(--accent-500)] shadow-xs hover:bg-[color:var(--accent-50)] dark:text-[color:var(--accent-400)] dark:border-[color:var(--accent-500)] dark:hover:bg-[color:var(--accent-900)]/30",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        shimmer: "relative overflow-hidden",
        bounce: "",
        grow: "",
        heartbeat: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

// Types pour les props du bouton
interface AnimatedButtonProps extends 
  React.ComponentProps<"button">, 
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  animationIntensity?: number;
  animationDuration?: number;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation = "none",
    asChild = false, 
    icon,
    iconPosition = "left",
    animationIntensity = 1.05,
    animationDuration = 2,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Effet de brillance pour l'animation "shimmer"
    const ShimmerEffect = () => (
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
    );

    // Rendu du contenu du bouton avec l'icône
    const renderContent = () => {
      const iconElement = icon ? (
        <span className="flex items-center justify-center">{icon}</span>
      ) : null;

      return (
        <>
          {iconPosition === "left" && iconElement}
          {children}
          {iconPosition === "right" && iconElement}
          {animation === "shimmer" && <ShimmerEffect />}
        </>
      );
    };

    // Appliquer les animations en fonction du type sélectionné
    const getAnimationProps = () => {
      switch (animation) {
        case "pulse":
          return {
            animate: { 
              scale: [1, animationIntensity, 1],
            },
            transition: { 
              duration: animationDuration,
              repeat: Infinity,
              ease: "easeInOut"
            }
          };
        case "bounce":
          return {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 10 
            }
          };
        case "grow":
          return {
            whileHover: { scale: animationIntensity },
            transition: { duration: 0.2 }
          };
        case "heartbeat":
          return {
            animate: { 
              scale: [1, animationIntensity, 1, animationIntensity * 0.98, 1],
            },
            transition: { 
              duration: animationDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.14, 0.28, 0.42, 0.70]
            }
          };
        default:
          return {};
      }
    };

    return (
      <motion.div {...getAnimationProps()}>
        <Comp
          data-slot="button"
          className={cn(buttonVariants({ variant, size, animation, className }))}
          ref={ref}
          {...props}
        >
          {renderContent()}
        </Comp>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, buttonVariants };