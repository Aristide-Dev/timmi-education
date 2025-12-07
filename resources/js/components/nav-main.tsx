import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { isSameUrl } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Link as InertiaLink } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (title: string) => {
        setOpenItems((prev) =>
            prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
        );
    };

    const isItemActive = (item: NavItem): boolean => {
        if (isSameUrl(page.url, item.href)) {
            return true;
        }
        if (item.items) {
            return item.items.some((subItem) => isSameUrl(page.url, subItem.href));
        }
        return false;
    };

    const isSubItemActive = (subItem: NavItem): boolean => {
        return isSameUrl(page.url, subItem.href);
    };

    // Auto-open items with active sub-items
    useEffect(() => {
        items.forEach((item) => {
            if (item.items && item.items.length > 0) {
                const hasActiveSubItem = item.items.some((subItem) =>
                    isSameUrl(page.url, subItem.href)
                );
                if (hasActiveSubItem && !openItems.includes(item.title)) {
                    setOpenItems((prev) => [...prev, item.title]);
                }
            }
        });
    }, [page.url, items, openItems]);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>MENU</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    const isActive = isItemActive(item);
                    const isOpen = openItems.includes(item.title);

                    if (hasSubItems) {
                        return (
                            <Collapsible
                                key={item.title}
                                open={isOpen}
                                onOpenChange={() => toggleItem(item.title)}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            tooltip={{ children: item.title }}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight
                                                className={`ml-auto size-4 transition-transform ${
                                                    isOpen ? 'rotate-90' : ''
                                                }`}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isSubItemActive(subItem)}
                                                    >
                                                        <InertiaLink href={subItem.href} prefetch>
                                                            {subItem.icon && <subItem.icon />}
                                                            <span>{subItem.title}</span>
                                                        </InertiaLink>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                            >
                                <InertiaLink href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </InertiaLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
