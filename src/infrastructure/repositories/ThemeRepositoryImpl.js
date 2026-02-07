/**
 * Theme enum
 */
export const Theme = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  SYSTEM: 'SYSTEM'
};

/**
 * ThemeRepositoryImpl
 * Implementation of theme repository using localStorage
 */
export class ThemeRepositoryImpl {
  constructor(storageAdapter) {
    this.storage = storageAdapter;
    this.storageKey = 'word-search-theme';
  }

  /**
   * Get the current theme
   * @returns {string} Theme value (LIGHT, DARK, or SYSTEM)
   */
  getTheme() {
    const theme = this.storage.get(this.storageKey);
    
    // Return stored theme or default to SYSTEM
    if (theme && this.isValidTheme(theme)) {
      return theme;
    }
    
    return Theme.SYSTEM;
  }

  /**
   * Save the theme
   * @param {string} theme - Theme value to save
   * @returns {boolean} True if saved successfully
   */
  saveTheme(theme) {
    if (!this.isValidTheme(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return false;
    }

    return this.storage.set(this.storageKey, theme);
  }

  /**
   * Check if a theme value is valid
   * @param {string} theme - Theme to validate
   * @returns {boolean} True if valid
   */
  isValidTheme(theme) {
    return Object.values(Theme).includes(theme);
  }

  /**
   * Get all available themes
   * @returns {Array} Array of theme values
   */
  getAvailableThemes() {
    return Object.values(Theme);
  }

  /**
   * Get the next theme in the cycle (for theme switching)
   * @param {string} currentTheme - Current theme
   * @returns {string} Next theme in cycle
   */
  getNextTheme(currentTheme) {
    const themes = [Theme.LIGHT, Theme.DARK, Theme.SYSTEM];
    const currentIndex = themes.indexOf(currentTheme);
    
    if (currentIndex === -1) {
      return Theme.LIGHT;
    }
    
    return themes[(currentIndex + 1) % themes.length];
  }

  /**
   * Reset theme to default
   * @returns {boolean} True if reset successfully
   */
  resetTheme() {
    return this.storage.remove(this.storageKey);
  }
}
