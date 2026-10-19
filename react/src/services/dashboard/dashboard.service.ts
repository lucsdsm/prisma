import { apiFetch } from '../api'

import type { DashboardData } from '../../types/dashboard'

export async function carregarDashboard(
  signal?: AbortSignal,
): Promise<DashboardData> {
  return apiFetch<DashboardData>('/dashboard/', {
    method: 'GET',
    signal,
  })
}