import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChangeThemeUseCase } from './ChangeThemeUseCase.js';

describe('ChangeThemeUseCase', () => {
  let changeThemeUseCase;
  let mockThemeRepository;

  beforeEach(() => {
    mockThemeRepository = {
      getTheme: vi.fn(),
      saveTheme: vi.fn()
    };

    changeThemeUseCase = new ChangeThemeUseCase(mockThemeRepository);
  });

  describe('execute', () => {
    it('should cycle from LIGHT to DARK', () => {
      mockThemeRepository.getTheme.mockReturnValue('LIGHT');

      const result = changeThemeUseCase.execute();

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledWith('DARK');
      expect(result).toBe('DARK');
    });

    it('should cycle from DARK to SYSTEM', () => {
      mockThemeRepository.getTheme.mockReturnValue('DARK');

      const result = changeThemeUseCase.execute();

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledWith('SYSTEM');
      expect(result).toBe('SYSTEM');
    });

    it('should cycle from SYSTEM to LIGHT', () => {
      mockThemeRepository.getTheme.mockReturnValue('SYSTEM');

      const result = changeThemeUseCase.execute();

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledWith('LIGHT');
      expect(result).toBe('LIGHT');
    });

    it('should default to LIGHT for invalid theme', () => {
      mockThemeRepository.getTheme.mockReturnValue('INVALID');

      const result = changeThemeUseCase.execute();

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledWith('LIGHT');
      expect(result).toBe('LIGHT');
    });

    it('should retrieve current theme from repository', () => {
      mockThemeRepository.getTheme.mockReturnValue('DARK');

      changeThemeUseCase.execute();

      expect(mockThemeRepository.getTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('setTheme', () => {
    it('should set LIGHT theme', () => {
      const result = changeThemeUseCase.setTheme('LIGHT');

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledWith('LIGHT');
      expect(result).toBe('LIGHT');
    });

    it('should set DARK theme', () => {
      const result = changeThemeUseCase.setTheme('DARK');

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledWith('DARK');
      expect(result).toBe('DARK');
    });

    it('should set SYSTEM theme', () => {
      const result = changeThemeUseCase.setTheme('SYSTEM');

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledWith('SYSTEM');
      expect(result).toBe('SYSTEM');
    });

    it('should save theme to repository', () => {
      changeThemeUseCase.setTheme('DARK');

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentTheme', () => {
    it('should return current theme from repository', () => {
      mockThemeRepository.getTheme.mockReturnValue('DARK');

      const result = changeThemeUseCase.getCurrentTheme();

      expect(mockThemeRepository.getTheme).toHaveBeenCalledTimes(1);
      expect(result).toBe('DARK');
    });

    it('should work for all theme values', () => {
      const themes = ['LIGHT', 'DARK', 'SYSTEM'];

      themes.forEach(theme => {
        mockThemeRepository.getTheme.mockReturnValue(theme);

        const result = changeThemeUseCase.getCurrentTheme();

        expect(result).toBe(theme);
      });
    });
  });

  describe('getNextTheme', () => {
    it('should return DARK for LIGHT', () => {
      expect(changeThemeUseCase.getNextTheme('LIGHT')).toBe('DARK');
    });

    it('should return SYSTEM for DARK', () => {
      expect(changeThemeUseCase.getNextTheme('DARK')).toBe('SYSTEM');
    });

    it('should return LIGHT for SYSTEM', () => {
      expect(changeThemeUseCase.getNextTheme('SYSTEM')).toBe('LIGHT');
    });

    it('should return LIGHT for invalid theme', () => {
      expect(changeThemeUseCase.getNextTheme('INVALID')).toBe('LIGHT');
    });

    it('should return LIGHT for undefined', () => {
      expect(changeThemeUseCase.getNextTheme(undefined)).toBe('LIGHT');
    });

    it('should return LIGHT for null', () => {
      expect(changeThemeUseCase.getNextTheme(null)).toBe('LIGHT');
    });
  });

  describe('theme cycling integration', () => {
    it('should complete full cycle: LIGHT → DARK → SYSTEM → LIGHT', () => {
      mockThemeRepository.getTheme
        .mockReturnValueOnce('LIGHT')
        .mockReturnValueOnce('DARK')
        .mockReturnValueOnce('SYSTEM');

      const theme1 = changeThemeUseCase.execute();
      expect(theme1).toBe('DARK');

      const theme2 = changeThemeUseCase.execute();
      expect(theme2).toBe('SYSTEM');

      const theme3 = changeThemeUseCase.execute();
      expect(theme3).toBe('LIGHT');
    });

    it('should persist each theme change', () => {
      mockThemeRepository.getTheme.mockReturnValue('LIGHT');

      changeThemeUseCase.execute();
      changeThemeUseCase.execute();
      changeThemeUseCase.execute();

      expect(mockThemeRepository.saveTheme).toHaveBeenCalledTimes(3);
    });
  });
});
