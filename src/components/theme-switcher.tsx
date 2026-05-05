"use client"
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" className="cursor-pointer" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      </Button>
    );
  }

  return (
    <Button
      className="cursor-pointer" 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
      variant={"outline"}
    >
      {theme === 'light' ? (
        <Moon className="bg-white" />
      ) : (
        <Sun />
      )}
    </Button>
  )
}

export default ThemeSwitcher;