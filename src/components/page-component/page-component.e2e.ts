import { newE2EPage } from '@stencil/core/testing';

describe('page-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<page-component></page-component>');

    const element = await page.find('page-component');
    expect(element).toHaveClass('hydrated');
  });
});
