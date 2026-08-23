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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <NavigationMenu className="w-full max-w-none justify-center px-4 py-2">
        <NavigationMenuList
          className="
          w-full
          justify-center
          gap-1
          sm:gap-2
        "
        >
          {!session && (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/">Home</Link>}
                />
              </NavigationMenuItem>
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
                  render={<Link href="/dashboard">Overview</Link>}
                />
              </NavigationMenuItem>
                <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/dashboard/transactions">Transactions</Link>}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/dashboard/stocks">Stocks</Link>}
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
    </header>
  );
}
