import Link from "next/link";
import { signOutAction } from "@/actions/user";
import { auth } from "@/lib/auth";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { headers } from "next/headers";
import { LogOutIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export async function NavigationBar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <NavigationMenu
      className="
        fixed inset-x-0 top-0 z-50
        w-full max-w-none
        border-b bg-background
        px-2 py-2
        backdrop-blur
        supports-backdrop-filter:bg-background/60
      "
    >
      <NavigationMenuList
        className="
          w-full
          justify-center
          gap-1
          sm:gap-2
        "
      >
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/">Home</Link>}
          />
        </NavigationMenuItem>
        {!session && (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href="/sign-in">Sign-in</Link>}
              />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href="/sign-up">Sign-up</Link>}
              />
            </NavigationMenuItem>
          </>
        )}

        {session && (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href="/dashboard">Dashboard</Link>}
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>User</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-auto">
                  <li>
                    <form
                      className="flex-row items-center gap-2"
                      action={signOutAction}
                    >
                      {" "}
                      <Button variant="destructive" type="submit">
                        <LogOutIcon />
                        Logout
                      </Button>
                    </form>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        )}

          <ThemeToggle />
          
      </NavigationMenuList>
    </NavigationMenu>
  );
}
