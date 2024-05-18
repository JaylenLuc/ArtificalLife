import { FC, ReactNode } from 'react';

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => console.log('login with google');

  return (
    <button onClick={loginWithGoogle} className='w-full'>
      {children}
    </button>
  );
};

export default GoogleSignInButton;