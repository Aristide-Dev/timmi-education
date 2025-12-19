import React from "react"
import { MenuItem, MenuContainer } from "@/components/ui/fluid-menu"
import { Menu as MenuIcon, X, LayoutDashboard, LogIn, Home, GraduationCap } from "lucide-react"
import { usePage } from '@inertiajs/react'
import { type SharedData } from '@/types'
import { dashboard, home as welcomeHome } from '@/routes'
import { login } from "@/routes"
import { search as searchTeachers } from '@/routes/teachers';

// A fluid circular menu that elegantly expands to reveal navigation items with smooth icon transitions
export function WelcomeMobileNavigation() {
  const { auth } = usePage<SharedData>().props
  const { url } = usePage().props



  const navigationLinks = [
    { href: welcomeHome().url, label: 'Accueil', icon: Home },
    { href: searchTeachers().url, label: 'Rechercher un professeur', icon: GraduationCap },
];

  const isActiveLink = (href: string) => {
    const currentPath = url || window.location.pathname
    const linkPath = href.replace(/^https?:\/\/[^/]+/, '') || '/'
    if (linkPath === '/') {
      return currentPath === '/'
    }
    return currentPath.toString().startsWith(linkPath)
  }

  // Créer un nouveau tableau avec les éléments d'authentification sans muter l'original
  const allMenuItems = React.useMemo(() => {
    const authItems = auth?.user
      ? [{ href: dashboard().url, label: 'Dashboard', icon: LayoutDashboard }]
      : [
        //   { href: register().url, label: 'Inscription', icon: UserPlus },
          { href: login().url, label: 'Connexion', icon: LogIn }
        ]

    return [...navigationLinks, ...authItems]
  }, [auth?.user])

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--primary-900)]/80 via-[color:var(--primary-800)]/60 to-[color:var(--primary-700)]/70 blur-3xl -z-10 rounded-full" />
      <MenuContainer>
        <MenuItem
          icon={
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
                <MenuIcon size={24} strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
                <X size={24} strokeWidth={1.5} />
              </div>
            </div>
          }
        />
        {allMenuItems.map(({ href, label, icon: Icon }) => {
        return (
          <MenuItem
            key={href.toString()}
            href={href.toString()}
            icon={<Icon size={24} strokeWidth={1.5} />}
            label={label}
            isActive={isActiveLink(href.toString())}
          />
        );
      })}
      </MenuContainer>
    </div>
  )
}
