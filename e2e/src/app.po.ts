import {$, browser, by, element, protractor} from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

 /* getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }*/

  /*getLoginForm() {
    return element.all(by.css('app-root app-login')).getText();
  }*/

  login(title, t2) {
    const input = element(by.name('username'));
    input.sendKeys(title);
    const input2 = element(by.name('password'));
    input2.sendKeys(t2);
    browser.sleep(2000);
    element(by.tagName('button')).click();
    browser.sleep(2000);
    return element(by.tagName('h1'));
  }

  getLoginForm() {
    return element.all(by.css('.login__wrapper'));
  }

  getRegButton() {
    return element.all(by.css('.login__register-link'));
  }

  send() {
  }
 /* getTodoListContent() { return element.all(by.css('app-root app-login')); }
  getNthTodoTitle(index: number) {
    const list = this.getTodoListContent();
    return list.get(index).element(by.css('.title'));
  }*/
}
