import { Injectable, signal } from '@angular/core';

export type AvisoTipo = 'success' | 'error' | 'warning' | 'informative';
export interface Aviso { id: number; state: AvisoTipo; label: string; }

/** Toasts do protótipo (sempre no canto inferior direito da tela). */
@Injectable({ providedIn: 'root' })
export class AvisosService {
  readonly lista = signal<Aviso[]>([]);
  private seq = 0;

  mostrar(label: string, state: AvisoTipo = 'informative', duracao = 5000): void {
    const id = ++this.seq;
    this.lista.update((l) => [...l, { id, state, label }].slice(-3));
    setTimeout(() => this.fechar(id), duracao);
  }
  fechar(id: number): void { this.lista.update((l) => l.filter((a) => a.id !== id)); }
  limpar(): void { this.lista.set([]); }
}
