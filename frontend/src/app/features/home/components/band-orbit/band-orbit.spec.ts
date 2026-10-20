import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BRAND_ICONS, BrandIcon } from '../../../../shared/ui/brand-icons';
import { BandOrbit } from './band-orbit';

const ICONS: BrandIcon[] = [
  BRAND_ICONS.docker,
  BRAND_ICONS.git,
  BRAND_ICONS.angular,
  BRAND_ICONS.linux,
];

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return { left, top, width, height, right: left + width, bottom: top + height } as DOMRect;
}

@Component({
  imports: [BandOrbit],
  template: `
    <div #band></div>
    <div #ring></div>
    <app-band-orbit [icons]="icons()" [band]="band" [ring]="ring" />
  `,
})
class Host {
  readonly icons = signal(ICONS);
}

describe('BandOrbit', () => {
  let fixture: ComponentFixture<Host>;
  let orbit: HTMLElement;
  let resize: () => void;

  function stubBrowser(options: { offsetPath: boolean; reducedMotion: boolean }): void {
    vi.stubGlobal('CSS', { supports: () => options.offsetPath });
    vi.stubGlobal('matchMedia', () => ({ matches: options.reducedMotion }));
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
  }

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const [band, ring] = Array.from(host.querySelectorAll('div'));
    orbit = host.querySelector('app-band-orbit')!;
    // Zone de 1000 px, bande de 8 px à y = 96, anneau de 100 px centré sur la bande.
    vi.spyOn(orbit, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 1000, 300));
    vi.spyOn(band, 'getBoundingClientRect').mockReturnValue(rect(0, 96, 1000, 8));
    vi.spyOn(ring, 'getBoundingClientRect').mockReturnValue(rect(450, 50, 100, 100));
    resize?.();
    await fixture.whenStable();
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should be hidden from assistive technologies', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });

    await render();

    expect(orbit.getAttribute('aria-hidden')).toBe('true');
  });

  it('should send half of the logos along each stream, without any text', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });

    await render();

    const left = orbit.querySelectorAll('.orbit__stream--left .orbit__logo');
    const right = orbit.querySelectorAll('.orbit__stream--right .orbit__logo');
    expect(left.length).toBe(2);
    expect(right.length).toBe(2);
    expect(orbit.textContent!.trim()).toBe('');
  });

  it('should build the paths from the measured band and ring', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });

    await render();

    // Rayon suivi : 50 (anneau) + 3 (écart) + 11 (demi-logo) = 64.
    const left = orbit.querySelector<HTMLElement>('.orbit__stream--left')!;
    expect(left.style.getPropertyValue('--orbit-path')).toBe(
      "path('M -22 100 L 436 100 A 64 64 0 0 1 564 100')",
    );
  });

  it('should spread the logos along the track with negative delays', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });

    await render();

    const delays = Array.from(
      orbit.querySelectorAll<HTMLElement>('.orbit__stream--left .orbit__logo'),
    ).map((logo) => parseFloat(logo.style.animationDelay));
    expect(delays[0]).toBe(0);
    expect(delays[1]).toBeLessThan(0);
  });

  it('should not display any moving logo when the user prefers reduced motion', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: true });

    await render();

    expect(orbit.querySelector('.orbit__logo')).toBeNull();
  });

  it('should not display any moving logo when offset-path is not supported', async () => {
    stubBrowser({ offsetPath: false, reducedMotion: false });

    await render();

    expect(orbit.querySelector('.orbit__logo')).toBeNull();
  });
});
