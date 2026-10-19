import { Component, input } from '@angular/core';
import { BrandIcon as BrandIconData } from '../brand-icons';

/** Logo de marque en SVG inline, décoratif : le nom accessible est porté par le parent. */
@Component({
  selector: 'app-brand-icon',
  template: `
    <svg
      aria-hidden="true"
      focusable="false"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path [attr.d]="icon().path" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class BrandIcon {
  readonly icon = input.required<BrandIconData>();
  readonly size = input(20);
}
