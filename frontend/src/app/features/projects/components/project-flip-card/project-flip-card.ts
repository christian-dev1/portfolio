import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProjectCard } from '../../../../shared/projects/components/project-card/project-card';
import { Project, projectInitials } from '../../../../shared/projects/models/project.model';
import { CardToggle } from '../../../../shared/ui/card-toggle/card-toggle';

/** Folder cover with a shared project card on the back and a fade-only return. */
@Component({
  selector: 'app-project-flip-card',
  imports: [NgTemplateOutlet, TranslocoPipe, CardToggle, ProjectCard],
  templateUrl: './project-flip-card.html',
  styleUrl: './project-flip-card.scss',
})
export class ProjectFlipCard {
  readonly project = input.required<Project>();
  private readonly toggle = viewChild.required(CardToggle);
  protected readonly returning = signal(false);

  constructor() {
    let wasActive = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
    effect(() => {
      const active = this.toggle().active();
      clearTimeout(timer);
      if (wasActive && !active) {
        this.returning.set(true);
        timer = setTimeout(() => this.returning.set(false), 900);
      } else if (active) {
        this.returning.set(false);
      }
      wasActive = active;
    });
  }

  protected readonly initials = computed(() => projectInitials(this.project().name));

  protected readonly tabKey = computed(() => `projects.tab.${this.project().context}`);
}
