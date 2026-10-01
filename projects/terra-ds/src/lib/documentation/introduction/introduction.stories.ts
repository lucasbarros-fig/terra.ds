import type { Meta, StoryObj } from '@storybook/angular';

import { IntroductionComponent } from './introduction.component';

/**
 * Doc-only page — sem Canvas, sem Controls, sem argTypes.
 *
 * O prefixo `!` no title identifica a seção na sidebar; a ordem é definida em
 * `.storybook/preview.ts` (`storySort`: Primeiros Passos → Fundamentos → Terra-DS).
 *
 * Toda cor/espaçamento usa tokens semânticos do Terra DS definidos em
 * `.storybook/styles.css` para adaptar automaticamente aos temas claro e escuro.
 */
const meta: Meta = {
  title: '!Primeiros Passos/Introdução',
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
};

export default meta;

export const Introducao: StoryObj = {
  name: 'Introdução',
  render: () => ({
    moduleMetadata: {
      imports: [IntroductionComponent],
    },
    template: '<lib-introduction />',
  }),
};
