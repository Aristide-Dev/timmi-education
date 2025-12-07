import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Link } from "@inertiajs/react"
import { type InertiaLinkProps } from "@inertiajs/react"

interface MenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  showChevron?: boolean
}

export function Menu({ trigger, children, align = "left", showChevron = true }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer inline-flex items-center"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        {showChevron && (
          <ChevronDown className="ml-2 -mr-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-56 rounded-md bg-background shadow-lg ring-1 ring-border ring-opacity-9 focus:outline-none z-50`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  children?: React.ReactNode
  onClick?: () => void
  href?: NonNullable<InertiaLinkProps['href']>
  disabled?: boolean
  icon?: React.ReactNode
  label?: string
  isActive?: boolean
}

export function MenuItem({ children, onClick, href, disabled = false, icon, label, isActive = false }: MenuItemProps) {
  const content = (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      {icon && (
        <span className="h-6 w-6 transition-all duration-200 group-hover:[&_svg]:stroke-[2.5] flex items-center justify-center">
          {icon}
        </span>
      )}
      {label && (
        <span className="text-[10px] font-medium leading-tight text-center px-1">
          {label}
        </span>
      )}
      {children}
    </div>
  )

  const className = `relative block w-full h-16 text-center group rounded-full shadow-2xl shadow-[color:var(--primary-500)]/20
    ${disabled ? "text-muted-foreground cursor-not-allowed" : ""}
    ${isActive ? "bg-[color:var(--primary-500)] text-primary-foreground hover:bg-[color:var(--primary-700)]" : "text-[color:var(--primary-600)] dark:text-[color:var(--primary-300)] hover:bg-[color:var(--primary-500)]/20"}
  `

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        role="menuitem"
        onClick={onClick}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className={className}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  )
}

interface MenuContainerProps {
  children: React.ReactNode
  onItemClick?: () => void
}

export function MenuContainer({ children, onItemClick }: MenuContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const childrenArray = React.Children.toArray(children)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false)
    } else {
      setIsExpanded(true)
    }
  }

  const handleItemClick = () => {
    setIsExpanded(false)
    onItemClick?.()
  }

  // Fermer le menu si on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  const totalItems = childrenArray.length - 1
  const spacing = 48 // Espacement entre les éléments
  const maxVisibleItems = 6 // Nombre maximum d'éléments visibles avant scroll
  const needsScroll = totalItems > maxVisibleItems
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(undefined)

  // Calculer la hauteur maximale de manière sécurisée
  React.useEffect(() => {
    if (needsScroll && isExpanded && typeof window !== 'undefined') {
      const calculatedHeight = Math.min(totalItems * spacing + 64, window.innerHeight * 0.6)
      setMaxHeight(calculatedHeight)
    } else {
      setMaxHeight(undefined)
    }
  }, [needsScroll, isExpanded, totalItems, spacing])

  return (
    <div
      ref={containerRef}
      className="relative w-[64px] z-[9999]"
      data-expanded={isExpanded}
      style={{
        height: maxHeight ? `${maxHeight}px` : 'auto',
        overflowY: needsScroll && isExpanded ? 'auto' : 'visible',
        overflowX: 'visible',
        maxHeight: maxHeight ? `${maxHeight}px` : 'none'
      }}
    >
      {/* Container for all items */}
      <div className="relative">
        {/* First item - always visible */}
        <div
          className="relative w-16 h-16 bg-background border border-border cursor-pointer rounded-full group will-change-transform z-[9999]"
          onClick={handleToggle}
        >
          {childrenArray[0]}
        </div>

        {/* Other items */}
        {childrenArray.slice(1).map((child, index) => {
          const isLastItem = index === totalItems - 1

          // Clone l'enfant et ajoute onClick pour fermer le menu
          const childWithClick = React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<MenuItemProps>, {
                onClick: () => {
                  handleItemClick()
                  const originalOnClick = (child as React.ReactElement<MenuItemProps>).props.onClick
                  if (originalOnClick) {
                    originalOnClick()
                  }
                }
              })
            : child

          return (
            <div
              key={index}
              className="absolute top-0 left-0 w-16 h-16 bg-background border border-border will-change-transform cursor-pointer rounded-full"
              onClick={() => {
                // Fermer le menu si on clique sur le conteneur (pas seulement le lien)
                if (isExpanded) {
                  handleItemClick()
                }
              }}
              style={{
                transform: `translateY(${isExpanded ? -(index + 1) * spacing : 0}px)`,
                opacity: isExpanded ? 1 : 0,
                pointerEvents: isExpanded ? 'auto' : 'none',
                zIndex: 9999 - index, // z-index élevé et décroissant pour l'ordre d'empilement
                clipPath: isLastItem
                  ? "circle(50% at 50% 50%)"
                  : "circle(50% at 50% 55%)",
                transition: `transform ${isExpanded ? '300ms' : '300ms'} cubic-bezier(0.4, 0, 0.2, 1),
                           opacity ${isExpanded ? '300ms' : '350ms'}`,
                backfaceVisibility: 'hidden',
                perspective: 1000,
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              {childWithClick}
            </div>
          )
        })}
      </div>
    </div>
  )
}
