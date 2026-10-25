import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page, APIRequestContext, APIResponse } from '@playwright/test';
import { PostsApi } from '../../api/PostsApi';
import { AuthApi } from '../../api/AuthApi';
import { AuthenticatedApiClient } from '../../api/AuthenticatedApiClient';

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiRequest?: APIRequestContext;
  postsApi?: PostsApi;
  authApi?: AuthApi;
  authenticatedClient?: AuthenticatedApiClient;
  apiResponse?: APIResponse;
  responseBody?: any;
  submittedPayload?: any;
  firstAccessToken?: string;
  refreshedTokens?: { accessToken: string; refreshToken: string; expiresAt: number };

  constructor(options: IWorldOptions) {
    super(options);
  }

  get uiPage(): Page {
    if (!this.page) throw new Error('Browser page is not initialized for this scenario.');
    return this.page;
  }

  get requestContext(): APIRequestContext {
    if (!this.apiRequest) throw new Error('API request context is not initialized for this scenario.');
    return this.apiRequest;
  }

  get postsClient(): PostsApi {
    if (!this.postsApi) throw new Error('Posts API client is not initialized.');
    return this.postsApi;
  }

  get authClient(): AuthApi {
    if (!this.authApi) throw new Error('Authentication API client is not initialized.');
    return this.authApi;
  }

  get authenticatedApiClient(): AuthenticatedApiClient {
    if (!this.authenticatedClient) throw new Error('Authenticated API client is not initialized. Check AUTH_API_USERNAME and AUTH_API_PASSWORD.');
    return this.authenticatedClient;
  }
}

setWorldConstructor(CustomWorld);
