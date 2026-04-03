import { test, expect } from '../../fixtures/fixtures';
import { TestDataGenerator } from '../../utils/TestDataGenerator';
import { Logger } from '../../utils/Logger';

/**
 * API Test Suite — User CRUD Operations
 * Target: https://reqres.in/api (public mock API, no auth needed)
 * Tests: GET, POST, PUT, PATCH, DELETE with schema validation
 *
 * Tags: @smoke @regression @api
 */

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

test.describe('User API — CRUD Operations @api', () => {

  test.describe('GET /users — List Users @smoke', () => {

    test('should return paginated list of users with valid schema', async ({ apiClient }) => {
      Logger.step('GET /users?page=1');
      const response = await apiClient.get<UserListResponse>('/users', { page: '1' });

      Logger.apiResponse(response.status, response.body);

      // Status assertion
      apiClient.assertStatus(response, 200);

      // Schema validation
      const body = response.body;
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('total');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);

      // Field-level validation
      const firstUser = body.data[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('email');
      expect(firstUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      Logger.success(`Returned ${body.data.length} users on page ${body.page}`);
    });

    test('should return correct page size for page 2', async ({ apiClient }) => {
      Logger.step('GET /users?page=2');
      const response = await apiClient.get<UserListResponse>('/users', { page: '2' });

      apiClient.assertStatus(response, 200);
      expect(response.body.page).toBe(2);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should return 404 for non-existent user @smoke', async ({ apiClient }) => {
      Logger.step('GET /users/9999 — expect 404');
      const response = await apiClient.get('/users/9999');

      apiClient.assertStatus(response, 404);
      Logger.success('404 received as expected for unknown user');
    });

    test('should return single user with valid schema', async ({ apiClient }) => {
      Logger.step('GET /users/2 — single user');
      const response = await apiClient.get<{ data: User }>('/users/2');

      apiClient.assertStatus(response, 200);

      const user = response.body.data;
      expect(user.id).toBe(2);
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('avatar');

      Logger.success(`Single user retrieved: ${user.first_name} ${user.last_name}`);
    });
  });

  test.describe('POST /users — Create User @regression', () => {

    test('should create a new user and return 201 with ID', async ({ apiClient }) => {
      const payload = TestDataGenerator.createUser();
      Logger.step(`POST /users — creating user: ${payload.name}`);
      Logger.apiRequest('POST', '/users', payload);

      const response = await apiClient.post<CreateUserResponse>('/users', payload);

      Logger.apiResponse(response.status, response.body);

      apiClient.assertStatus(response, 201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body.name).toBe(payload.name);
      expect(response.body.job).toBe(payload.job);

      Logger.success(`User created with ID: ${response.body.id}`);
    });

    test('should handle missing fields gracefully', async ({ apiClient }) => {
      Logger.step('POST /users — empty body');
      const response = await apiClient.post('/users', {});

      // reqres.in returns 201 even for empty — we test it doesn't crash
      expect([200, 201, 400]).toContain(response.status);
      Logger.success('Empty body handled without 500');
    });
  });

  test.describe('PUT /users — Full Update @regression', () => {

    test('should fully update user and return 200', async ({ apiClient }) => {
      const payload = TestDataGenerator.createUser({ job: 'Senior SDET' });
      Logger.step('PUT /users/2 — full update');

      const response = await apiClient.put<CreateUserResponse>('/users/2', payload);

      apiClient.assertStatus(response, 200);
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.name).toBe(payload.name);

      Logger.success('User fully updated');
    });
  });

  test.describe('PATCH /users — Partial Update @regression', () => {

    test('should partially update user job title', async ({ apiClient }) => {
      const payload = { job: 'QA Automation Lead' };
      Logger.step('PATCH /users/2 — update job only');

      const response = await apiClient.patch<{ job: string; updatedAt: string }>('/users/2', payload);

      apiClient.assertStatus(response, 200);
      expect(response.body.job).toBe('QA Automation Lead');
      expect(response.body).toHaveProperty('updatedAt');

      Logger.success(`Job updated to: ${response.body.job}`);
    });
  });

  test.describe('DELETE /users @regression', () => {

    test('should delete user and return 204 No Content', async ({ apiClient }) => {
      Logger.step('DELETE /users/2');

      const response = await apiClient.delete('/users/2');

      apiClient.assertStatus(response, 204);
      Logger.success('User deleted successfully — 204 received');
    });
  });

  test.describe('Authentication — Login/Register @smoke', () => {

    test('should register a user successfully', async ({ apiClient }) => {
      const payload = { email: 'eve.holt@reqres.in', password: 'pistol' };
      Logger.step('POST /register');

      const response = await apiClient.post<{ id: number; token: string }>('/register', payload);

      apiClient.assertStatus(response, 200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token.length).toBeGreaterThan(0);

      Logger.success(`Registered. Token: ${response.body.token}`);
    });

    test('should fail login with missing password and return 400', async ({ apiClient }) => {
      Logger.step('POST /login — missing password');

      const response = await apiClient.post<{ error: string }>('/login', {
        email: 'peter@klaven.com',
      });

      apiClient.assertStatus(response, 400);
      expect(response.body.error).toBe('Missing password');

      Logger.success('400 returned with correct error message');
    });
  });
});
