import { newSpecPage } from '@stencil/core/testing';
import { PageComponent } from './page-component';

describe('page-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PageComponent],
      html: `<page-component></page-component>`,
    });
    expect(page.root).toEqualHtml(`
      <page-component>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </page-component>
    `);
  });
});
