import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';

import { TagComponent } from '../../feedback/tag/tag.component';
import type { TagColor } from '../../feedback/tag/tag.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { IconComponent } from '../icon/icon.component';
import type { IconNameType } from '../icon/icon.component';

/**
 * Card Notice — card compacto para fluxos de trabalho (propostas, tarefas, pipelines).
 * Figma: Solaris.ds / Terra.ds › Layout & Structure › Card Notice.
 *
 * Estados: Default, Hovering (`:hover`) e Focus (`:focus-visible`, quando `interactive`).
 * A área de mídia aceita `imageSrc` ou conteúdo projetado com `[cardNoticeMedia]`.
 */
@Component({
  selector: 'lib-card-notice',
  standalone: true,
  imports: [TagComponent, AvatarComponent, IconComponent],
  templateUrl: './card-notice.component.html',
  styleUrls: ['./card-notice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-terra-ds': '' },
})
export class CardNoticeComponent {
  title = input('Title');
  description = input('Description');
  showDescription = input(true);

  imageSrc = input('');
  imageAlt = input('');
  showMedia = input(true);

  showTag = input(true);
  tagLabel = input('Tag Text');
  tagIcon = input<IconNameType>('Tag');
  tagColor = input<TagColor>('neutral');

  showPublication = input(true);
  authorName = input('Name');
  authorImageSrc = input('');
  date = input('00 de Jan. de 0000');

  /** Quando `true`, o card é focável e emite `cardClick` por clique, Enter ou Espaço. */
  interactive = input(true);

  cardClick = output<MouseEvent | KeyboardEvent>();

  @HostBinding('class')
  get hostClass(): string {
    return this.interactive() ? 'lib-card-notice lib-card-notice--interactive' : 'lib-card-notice';
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): number | null {
    return this.interactive() ? 0 : null;
  }

  @HostBinding('attr.role')
  get role(): string | null {
    return this.interactive() ? 'button' : null;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.interactive()) this.cardClick.emit(event);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.interactive() || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    this.cardClick.emit(event);
  }
}
