"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavigationBar() {
  return (
    <NavigationMenu className="fixed inset-x-0 top-0 z-50 w-full max-w-none justify-center border-b bg-background/95 py-2 backdrop-blur supports-backdrop-filter:bg-background/60">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/">Home</Link>} />
        </NavigationMenuItem>
         <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/login">Login</Link>} />
        </NavigationMenuItem>
         <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/signup">Sign up</Link>} />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
