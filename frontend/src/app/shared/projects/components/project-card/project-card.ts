import {
  Component,
  ElementRef,
  computed,
  effect,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalizePipe } from '../../../i18n/localize.pipe';
import { CardToggle } from '../../../ui/card-toggle/card-toggle';
import { Project, projectInitials } from '../../models/project.model';
import { ProjectDetails } from '../project-details/project-details';

@Component({
  selector: 'app-project-card',
  imports: [TranslocoPipe, LocalizePipe, CardToggle, ProjectDetails],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  /** Niveau du titre de la carte : 2 sous le h1 d'une page, 3 sous une section en h2. */
  readonly headingLevel = input<2 | 3>(2);

  /**
   * Inversion des blocs (accueil) : au survol, au focus clavier ou à l'appui, la couverture
   * glisse en bas et le texte remonte, sans changer la hauteur de la carte.
   */
  readonly swappable = input(false);
  readonly linksFocusable = input(true);

  private readonly toggle = viewChild.required(CardToggle);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly visual = viewChild.required<ElementRef<HTMLElement>>('visual');
  private readonly content = viewChild.required('content', { read: ElementRef<HTMLElement> });

  protected readonly initials = computed(() => projectInitials(this.project().name));

  protected readonly tabKey = computed(() => `projects.tab.${this.project().context}`);

  constructor() {
    // Chaque bloc se déplace de la hauteur de l'autre : mesurées au moment de l'inversion.
    effect(() => {
      if (!this.toggle().active()) {
        return;
      }
      untracked(() => {
        const panel = this.panel().nativeElement;
        panel.style.setProperty('--visual-height', `${this.visual().nativeElement.offsetHeight}px`);
        panel.style.setProperty(
          '--content-height',
          `${(this.content().nativeElement as HTMLElement).offsetHeight}px`,
        );
      });
    });
  }
}
