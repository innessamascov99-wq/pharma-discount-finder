import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';
import { Button, Input } from '../components/ui';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signup with:', email);
  };

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)' }}>
              <Pill className="w-7 h-7 text-white drop-shadow-md" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold tracking-tight">
                Pharma Discount Finder
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Medication Made Affordable
              </div>
            </div>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Create an account
          </h1>
          <p className="text-lg text-muted-foreground">
            Start saving on your medications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-14 text-base"
              required
            />
          </div>

          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-14 text-base"
              required
            />
          </div>

          <div>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="h-14 text-base"
              required
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full h-14 text-lg font-semibold"
          >
            Create Account
          </Button>

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleGoogleSignUp}
            className="w-full h-14 text-lg font-medium border-2 hover:bg-accent"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
          <Link
            to="/"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
