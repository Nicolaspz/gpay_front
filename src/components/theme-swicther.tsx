"use client"
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      
      className="cursor-pointer" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant={"outline"}>
      {theme === 'light' ?
        (<Moon className="bg-white" />):(<Sun/>)}
     
    </Button>
  )
}
export default ThemeSwitcher;