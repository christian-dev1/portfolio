import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NAV_ITEMS } from '../navigation';
import { ThemeService } from '../../theme/theme.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslocoPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  protected readonly navItems = NAV_ITEMS;
  protected readonly isDark = computed(() => this.themeService.theme() === 'dark');
  protected readonly themeLabelKey = computed(() =>
    this.isDark() ? 'theme.toLight' : 'theme.toDark',
  );

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected toggleLanguage(): void {
    this.languageService.toggle();
  }
}