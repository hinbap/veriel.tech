export const THEME_STORAGE_KEY = "veriel-theme";

/** Runs before paint (see app/layout.tsx) so a saved light theme does not flash dark first. */
export const themeScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")document.documentElement.classList.add("light")}catch(e){}`;
