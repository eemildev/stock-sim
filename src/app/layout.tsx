import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NavigationBar } from "@/components/navigation-bar";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NavigationBar />
           <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
