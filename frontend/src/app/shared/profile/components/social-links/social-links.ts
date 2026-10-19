import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Profile } from '../../models/profile.model';

/** Icônes rondes GitLab, GitHub et e-mail, posées sur un aplat de marque (zone bleue, footer). */
@Component({
  selector: 'app-social-links',
  imports: [TranslocoPipe],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  readonly profile = input.required<Profile>();
}
