import { apiFetch } from './api'
import type { LoginCredentials, LoginResponse } from '../types/auth'

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function logout(): void {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('access_token'))
}