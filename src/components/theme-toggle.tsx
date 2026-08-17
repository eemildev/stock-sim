"use client"

import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { SunIcon, MoonIcon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
    variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
        {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </Button>
  )
}