import { useCallback, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.com';

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signInWithXellar = useCallback(async () => {
    if (!isConnected || !address) return;

    try {
      // 1. Get nonce from backend
      const nonceResponse = await fetch(`${BACKEND_URL}/auth/nonce?address=${address}`);
      const { nonce } = await nonceResponse.json();

      // 2. Sign the message
      const message = `Sign this message to authenticate with our app\n\nNonce: ${nonce}`;
      const signature = await signMessageAsync({ message });

      // 3. Verify signature with backend
      const response = await fetch(`${BACKEND_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          message,
        }),
        credentials: 'include', // This is important for cookies
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setIsAuthenticated(true);
      
      // You might want to store the token in localStorage or handle it according to your needs
      localStorage.setItem('auth_token', data.token);
      
      return data;
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
      throw error;
    }
  }, [address, isConnected, signMessageAsync]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    // You might want to call a logout endpoint on your backend here
  }, []);

  return {
    signInWithXellar,
    logout,
    isAuthenticated,
  };
}; 