import 'dotenv/config';
import { Before, After, Status } from '@cucumber/cucumber';
import { chromium, request as playwrightRequest } from '@playwright/test';
import { CustomWorld } from './world';
import { LoginPage } from '../../pages/LoginPage';
import { AuthApi } from '../../api/AuthApi';
import { AuthenticatedApiClient } from '../../api/AuthenticatedApiClient';
import { PostsApi } from '../../api/PostsApi';

Before('@ui', async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: process.env.PW_HEADLESS !== 'false' });
  this.context = await this.browser.newContext({ baseURL: 'https://www.saucedemo.com' });
  this.page = await this.context.newPage();
});

Before('@authenticated', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.uiPage);
  await this.uiPage.goto('/');
  await loginPage.login('standard_user', 'secret_sauce');
  await this.uiPage.waitForURL(/inventory/);
});

Before('@posts-api', async function (this: CustomWorld) {
  const apiRequest = await playwrightRequest.newContext({
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: { Accept: 'application/json' },
  });
  this.apiRequest = apiRequest;
  this.postsApi = new PostsApi(apiRequest);
});

Before('@auth-api', async function (this: CustomWorld) {
  const apiRequest = await playwrightRequest.newContext({
    baseURL: 'https://dummyjson.com',
    extraHTTPHeaders: { Accept: 'application/json' },
  });
  this.apiRequest = apiRequest;
  this.authApi = new AuthApi(apiRequest);

  const username = process.env.AUTH_API_USERNAME;
  const password = process.env.AUTH_API_PASSWORD;
  if (username && password) {
    this.authenticatedClient = new AuthenticatedApiClient(
      apiRequest,
      this.authApi,
      username,
      password,
    );
  }
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true }).catch(() => undefined);
    if (screenshot) {
      await this.attach(screenshot, 'image/png');
    }
  }
  await this.apiRequest?.dispose().catch(() => undefined);
  await this.context?.close().catch(() => undefined);
  await this.browser?.close().catch(() => undefined);
});
