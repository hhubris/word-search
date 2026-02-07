/**
 * ChangeThemeUseCase
 * Use case for changing and persisting theme
 */
export class ChangeThemeUseCase {
  constructor(themeRepository) {
    this.themeRepository = themeRepository;
  }

  /**
   * Execute the use case - cycle to next theme
   * @returns {string} New theme value
   */
  execute() {
    const currentTheme = this.themeRepository.getTheme();
    const nextTheme = this.getNextTheme(currentTheme);
    this.themeRepository.saveTheme(nextTheme);
    return nextTheme;
  }

  /**
   * Set a specific theme
   * @param {string} theme - Theme to set (LIGHT, DARK, SYSTEM)
   * @returns {string} The theme that was set
   */
  setTheme(theme) {
    this.themeRepository.saveTheme(theme);
    return theme;
  }

  /**
   * Get current theme
   * @returns {string} Current theme value
   */
  getCurrentTheme() {
    return this.themeRepository.getTheme();
  }

  /**
   * Get next theme in cycle: LIGHT → DARK → SYSTEM → LIGHT
   * @param {string} currentTheme - Current theme
   * @returns {string} Next theme
   */
  getNextTheme(currentTheme) {
    switch (currentTheme) {
      case 'LIGHT':
        return 'DARK';
      case 'DARK':
        return 'SYSTEM';
      case 'SYSTEM':
        return 'LIGHT';
      default:
        return 'LIGHT';
    }
  }
}
