import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { injectReducedMotion } from '../motion/reduced-motion';

/**
 * État « actif » d'une carte animée (inversion des blocs, retournement) :
 * - souris : actif pendant le survol ;
 * - clavier : actif tant que le focus est dans la carte ;
 * - toucher (ou Entrée / Espace sur un bouton de la carte) : chaque appui bascule l'état.
 * Les clics sur un lien de la carte ne basculent jamais : le lien reste cliquable.
 * Avec les animations réduites, la carte n'est jamais active (affichage fixe).
 */
@Directive({
  selector: '[appCardToggle]',
  exportAs: 'cardToggle',
  host: {
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'onPointerLeave($event)',
    '(pointerdown)': 'onPointerDown($event)',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)',
    '(click)': 'onClick($event)',
  },
})
export class CardToggle {
  /** `false` désactive la bascule (la carte reste dans son état normal). */
  readonly enabled = input(true, { alias: 'appCardToggle', transform: booleanAttribute });

  readonly reducedMotion = injectReducedMotion();

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly hovered = signal(false);
  private readonly focused = signal(false);
  /** Choix explicite (appui) qui prime sur le survol et le focus ; `null` = aucun. */
  private readonly forced = signal<boolean | null>(null);
  /** Type du dernier pointeur enfoncé ; `null` = action clavier. */
  private lastPointerType: string | null = null;

  readonly active = computed(
    () =>
      this.enabled() &&
      !this.reducedMotion() &&
      (this.forced() ?? (this.hovered() || this.focused())),
  );

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovered.set(true);
    }
  }

  protected onPointerLeave(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovered.set(false);
      this.forced.set(null);
      this.lastPointerType = null;
    }
  }

  protected onPointerDown(event: PointerEvent): void {
    this.lastPointerType = event.pointerType;
  }

  /** Seul le focus clavier active la carte : un appui ou un clic gère déjà l'état lui-même. */
  protected onFocusIn(): void {
    if (this.lastPointerType === null) {
      this.focused.set(true);
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.contains(event.relatedTarget as Node | null)) {
      this.focused.set(false);
      // A tap on the back can blur the cover before its click toggles the card.
      if (this.lastPointerType === null) {
        this.forced.set(null);
      }
    }
  }

  protected onClick(event: MouseEvent): void {
    const pointerType = this.lastPointerType;
    this.lastPointerType = null;

    if (pointerType === 'mouse' || (event.target as Element).closest('a')) {
      return;
    }
    this.forced.set(!this.active());
  }
}
