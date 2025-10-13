import httpClient from '@/lib/httpClient';

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(data: LoginPayload) {
  const response = await httpClient.post('/user/login', data);
  return response.data; // depends on your backend
}