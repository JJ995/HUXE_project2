import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;


  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('GetLoginForm', () => {
    expect(page.getLoginForm().isPresent()).toBe(true);
  });

  it('getRegButton', () => {
    expect(page.getRegButton().getText()).toContain('Register');
  });


  it('type stuff into name field', () => {
    expect(page.login('Tester', 'password').getText()).toContain('MovieDB');
  });


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
