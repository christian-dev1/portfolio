import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS } from '../navigation';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly themeService = inject(ThemeService);

  protected readonly navItems = NAV_ITEMS;
  protected readonly isDark = computed(() => this.themeService.theme() === 'dark');
  protected readonly themeLabel = computed(() =>
    this.isDark() ? 'Activer le mode clair' : 'Activer le mode sombre',
  );

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}