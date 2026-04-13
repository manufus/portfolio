import { useEffect, useState } from "preact/hooks";
import { Sun, Moon } from "lucide-preact";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync with DOM on mount
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    const newState = !isDark;
    setIsDark(newState);

    // Update DOM
    if (newState) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Persist to localStorage
    localStorage.setItem("dark_mode", newState ? "true" : "false");

    // Dispatch event for other components to react (optional)
    window.dispatchEvent(
      new CustomEvent("theme-toggle:change", { detail: { isDark: newState } })
    );
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-checked={isDark}
      role="switch"
      class={`relative items-center h-9 px-2 gap-1.5 font-medium cursor-pointer rounded-full bg-surface-subtle border-[0.5px] border-border-subtle transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 mx-1 flex ${className}`}
    >
      <div class="flex justify-center items-center shrink-0 w-6 h-6 relative overflow-hidden rounded-full bg-brand border-[0.5px] border-border-strong shadow-soft">
        <Sun
          size={16}
          class={`absolute text-white dark:text-gray-900 transition-discrete duration-200 ${
            isDark ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
          }`}
        />
        <Moon
          size={16}
          class={`absolute text-white dark:text-gray-900 transition-discrete duration-200 ${
            isDark ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
        />
      </div>
      <span class="hidden sm:inline-block whitespace-nowrap">
        <span
          class={`shrink-0 text-sm text-left text-content-secondary transition-all duration-200 ${
            isDark ? "hidden" : "flex"
          }`}
        >
          Light
        </span>
        <span
          class={`shrink-0 text-sm text-left text-content-secondary transition-all duration-200 ${
            isDark ? "flex" : "hidden"
          }`}
        >
          Dark
        </span>
      </span>
    </button>
  );
}

export default ThemeToggle;
