import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const VALID_TEMPLATES = ['elegance', 'minimal', 'nordic']; // Ajout du template Nordic
const DEFAULT_TEMPLATE = 'elegance';

export function ThemeProvider({ children }) {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);

  // Appliquer la classe CSS sur le body chaque fois que le template change
  useEffect(() => {
    // Retirer toutes les anciennes classes de thème possibles
    ['elegance', 'minimal', 'vitrine', 'modern-red'].forEach((t) => {
      document.body.classList.remove(`theme-${t}`);
    });
    // Appliquer la nouvelle
    document.body.classList.add(`theme-${template}`);

    return () => {
      document.body.classList.remove(`theme-${template}`);
    };
  }, [template]);

  const updateTemplate = (newTemplate) => {
    if (VALID_TEMPLATES.includes(newTemplate)) {
      setTemplate(newTemplate);
    } else {
      console.warn(`Template "${newTemplate}" invalide. Templates valides : ${VALID_TEMPLATES.join(', ')}`);
    }
  };

  return (
    <ThemeContext.Provider value={{ template, setTemplate: updateTemplate, VALID_TEMPLATES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
}
