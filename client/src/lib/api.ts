import { Contract, User, Comment, ContractStats } from '@shared/types';

const API_BASE = '/api';

export async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Contract API functions
export const contractApi = {
  getAll: () => apiRequest<Contract[]>('GET', '/contracts'),
  getById: (id: string) => apiRequest<Contract>('GET', `/contracts/${id}`),
  create: (data: Partial<Contract>) => apiRequest<Contract>('POST', '/contracts', data),
  update: (id: string, data: Partial<Contract>) => apiRequest<Contract>('PUT', `/contracts/${id}`, data),
  delete: (id: string) => apiRequest<void>('DELETE', `/contracts/${id}`),
};

// User API functions
export const userApi = {
  getAll: () => apiRequest<User[]>('GET', '/users'),
  getById: (id: string) => apiRequest<User>('GET', `/users/${id}`),
  updateProfile: (id: string, data: Partial<User>) => apiRequest<User>('PUT', `/users/${id}/profile`, data),
};

// Comment API functions
export const commentApi = {
  getByContractId: (contractId: string) => apiRequest<Comment[]>('GET', `/contracts/${contractId}/comments`),
  create: (contractId: string, data: Partial<Comment>) => apiRequest<Comment>('POST', `/contracts/${contractId}/comments`, data),
  update: (id: string, data: Partial<Comment>) => apiRequest<Comment>('PUT', `/comments/${id}`, data),
  delete: (id: string) => apiRequest<void>('DELETE', `/comments/${id}`),
};

// Stats API functions
export const statsApi = {
  getContractStats: () => apiRequest<ContractStats>('GET', '/stats/contracts'),
}; 