import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './UserContext';

export function RegistrationForm() {
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
      const response = await fetch('/api/auth/sign-up', req);
      if (!response.ok) {
        throw new Error(`fetch error ${response.status}`);
      }
      const user = (await response.json()) as User; // import user from UserContext
      alert(
        `Successfully registered ${user.username} as userId ${user.userId}`
      );
      navigate('/sign-in');
    } catch (error) {
      alert(`Error registering user: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/30 p-8 rounded-lg shadow-md w-full max-w-sm backdrop-blur-md">
        <h2 className="text-xl font-bold text-center mb-4">Register</h2>
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
