import 'server-only';

import { cookies } from 'next/headers';

export const authToken = () => {
  console.info('Demo | Getting auth token from cookies');
  
  const token = cookies().get('__session')?.value;
  if (!token) {
    throw new Error('No token found');
  }
  
  console.info('Demo | token found:', token);

  return token;
}
