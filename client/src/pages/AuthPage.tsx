import { RegistrationForm } from '../components/RegistrationForm';
import { LoginForm } from '../components/LoginForm';

type Props = {
  mode: 'sign-up' | 'sign-in';
};
export function AuthPage({ mode }: Props) {
  return (
    <div className="container m-4">
      {mode === 'sign-up' && <RegistrationForm />}
      {mode === 'sign-in' && <LoginForm />}
    </div>
  );
}
