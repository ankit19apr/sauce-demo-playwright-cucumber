import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { z } from 'zod';
import type { PostPayload, PatchPostPayload } from '../../api/PostsApi';
import { CustomWorld } from '../support/world';

const PostSchema = z.object({
  userId: z.number().int(),
  id: z.number().int(),
  title: z.string().min(1),
  body: z.string().min(1),
});

const PostsSchema = z.array(PostSchema);

const AuthUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const CreatedPostPayloadSchema = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

const UpdatedPostPayloadSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

function configuredCredentials(): {
  username: string;
  password: string;
} {
  const username = process.env.AUTH_API_USERNAME;
  const password = process.env.AUTH_API_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Set AUTH_API_USERNAME and AUTH_API_PASSWORD in .env or the CI environment to run this authentication scenario.',
    );
  }

  return { username, password };
}

When(
  'I request post {int}',
  async function (this: CustomWorld, postId: number) {
    const result = await this.postsClient.getPost(postId);
    this.apiResponse = result.response;
    this.responseBody = result.body;
  },
);

When(
  'I request posts for user {int}',
  async function (this: CustomWorld, userId: number) {
    const result = await this.postsClient.getPostsByUser(userId);
    this.apiResponse = result.response;
    this.responseBody = result.body;
  },
);

When(
  'I create a post with title {string} and body {string} for user {int}',
  async function (
    this: CustomWorld,
    title: string,
    body: string,
    userId: number,
  ) {
    const payload: PostPayload = { title, body, userId };
    this.submittedPayload = payload;

    const result = await this.postsClient.createPost(payload);
    this.apiResponse = result.response;
    this.responseBody = result.body;
  },
);

When(
  'I replace post {int} with title {string} and body {string} for user {int}',
  async function (
    this: CustomWorld,
    postId: number,
    title: string,
    body: string,
    userId: number,
  ) {
    const payload: PostPayload = {
      id: postId,
      title,
      body,
      userId,
    };

    this.submittedPayload = payload;

    const result = await this.postsClient.updatePost(postId, payload);
    this.apiResponse = result.response;
    this.responseBody = result.body;
  },
);

When(
  'I patch post {int} with title {string}',
  async function (this: CustomWorld, postId: number, title: string) {
    const payload: PatchPostPayload = { title };
    this.submittedPayload = payload;

    const result = await this.postsClient.patchPost(postId, payload);
    this.apiResponse = result.response;
    this.responseBody = result.body;
  },
);

When(
  'I delete post {int}',
  async function (this: CustomWorld, postId: number) {
    const result = await this.postsClient.deletePost(postId);
    this.apiResponse = result.response;
    this.responseBody = result.body;
  },
);

Then(
  'the API status should be {int}',
  async function (this: CustomWorld, status: number) {
    expect(
      this.apiResponse,
      'An API response should have been captured by the preceding step',
    ).toBeDefined();

    expect(this.apiResponse!.status()).toBe(status);
  },
);

Then(
  'the response content type should contain {string}',
  async function (this: CustomWorld, contentType: string) {
    expect(this.apiResponse!.headers()['content-type']).toContain(contentType);
  },
);

Then(
  'the post response should have a valid schema',
  async function (this: CustomWorld) {
    expect(() => PostSchema.parse(this.responseBody)).not.toThrow();
  },
);

Then(
  'the post id should be {int}',
  async function (this: CustomWorld, id: number) {
    expect(PostSchema.parse(this.responseBody).id).toBe(id);
  },
);

Then(
  'all returned posts should belong to user {int}',
  async function (this: CustomWorld, userId: number) {
    const posts = PostsSchema.parse(this.responseBody);

    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.userId === userId)).toBe(true);
  },
);

Then(
  'the posts response should be empty',
  async function (this: CustomWorld) {
    expect(PostsSchema.parse(this.responseBody)).toEqual([]);
  },
);

Then(
  'the created post should match the submitted data',
  async function (this: CustomWorld) {
    const payload = CreatedPostPayloadSchema.parse(this.submittedPayload);
    const post = PostSchema.parse(this.responseBody);

    expect(post.title).toBe(payload.title);
    expect(post.body).toBe(payload.body);
    expect(post.userId).toBe(payload.userId);
    expect(post.id).toEqual(expect.any(Number));
  },
);

Then(
  'the updated post should match the submitted data',
  async function (this: CustomWorld) {
    const payload = UpdatedPostPayloadSchema.parse(this.submittedPayload);
    const post = PostSchema.parse(this.responseBody);

    expect(post.id).toBe(payload.id);
    expect(post.title).toBe(payload.title);
    expect(post.body).toBe(payload.body);
    expect(post.userId).toBe(payload.userId);
  },
);

Then(
  'the returned post title should be {string}',
  async function (this: CustomWorld, title: string) {
    const post = PostSchema.parse(this.responseBody);

    expect(post.title).toBe(title);
    expect(post.id).toBe(1);
  },
);

When(
  'I request my profile using the authenticated API client',
  async function (this: CustomWorld) {
    const response = await this.authenticatedApiClient.get('/auth/me');

    this.apiResponse = response;
    this.responseBody = await response.json();
  },
);

When(
  'I request my profile without a token',
  async function (this: CustomWorld) {
    this.apiResponse = await this.requestContext.get('/auth/me');
  },
);

When(
  'I request my profile with an invalid token',
  async function (this: CustomWorld) {
    this.apiResponse = await this.requestContext.get('/auth/me', {
      headers: {
        Authorization: 'Bearer invalid-token-for-testing',
      },
    });
  },
);

When(
  'I obtain authentication tokens twice',
  async function (this: CustomWorld) {
    const { username, password } = configuredCredentials();

    const first = await this.authClient.getTokens(username, password);
    const second = await this.authClient.getTokens(username, password);

    this.firstAccessToken = first.accessToken;
    this.responseBody = AuthTokensSchema.parse(second);
  },
);

Then(
  'the second access token should match the first access token',
  async function (this: CustomWorld) {
    const tokens = AuthTokensSchema.parse(this.responseBody);

    expect(tokens.accessToken).toBe(this.firstAccessToken);
  },
);

When(
  'I refresh the authentication session',
  async function (this: CustomWorld) {
    const { username, password } = configuredCredentials();

    const current = await this.authClient.getTokens(username, password);

    this.refreshedTokens = await this.authClient.refreshSession(
      username,
      current.refreshToken,
    );
  },
);

Then(
  'the refreshed tokens should be present',
  async function (this: CustomWorld) {
    expect(this.refreshedTokens?.accessToken).toBeTruthy();
    expect(this.refreshedTokens?.refreshToken).toBeTruthy();
  },
);

Then(
  'the refreshed access token should access my profile',
  async function (this: CustomWorld) {
    const { username } = configuredCredentials();

    expect(this.refreshedTokens).toBeDefined();

    const response = await this.requestContext.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${this.refreshedTokens!.accessToken}`,
      },
    });

    this.apiResponse = response;
    expect(response.status()).toBe(200);

    const user = AuthUserSchema.parse(await response.json());
    expect(user.username).toBe(username);
  },
);

Then(
  'the authenticated profile should match the configured username',
  async function (this: CustomWorld) {
    const { username } = configuredCredentials();
    const user = AuthUserSchema.parse(this.responseBody);

    expect(user.username).toBe(username);
    expect(user.id).toEqual(expect.any(Number));
  },
);
