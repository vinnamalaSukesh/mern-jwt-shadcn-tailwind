import { createContext, useContext, useEffect, useState } from "react";

// Create Theme Context
const ThemeContext = createContext();

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "theme" }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(storageKey) || defaultTheme;
    });

    // Function to toggle theme
    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        localStorage.setItem(storageKey, theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to use theme
export function useTheme() {
    return useContext(ThemeContext);
}
