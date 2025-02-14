import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export function LoginForm() {
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const response = await fetch('/api/auth/sign-in', req);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `fetch error ${response.status}`);
      }
      const { user, token } = await response.json();
      handleSignIn(user, token);
      navigate('/trips', { replace: true });
    } catch (error) {
      alert(`Error signing in ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/30 p-8 rounded-lg shadow-md w-full max-w-sm backdrop-blur-md">
        <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Username
            <input
              required
              name="username"
              type="text"
              className="block border border-gray-600 rounded p-2 w-full"
            />
          </label>
          <label className="block">
            Password
            <input
              required
              name="password"
              type="password"
              className="block border border-gray-600 rounded p-2 w-full"
            />
          </label>
          <button
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
