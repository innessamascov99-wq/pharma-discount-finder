import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Send } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to login</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300"
              style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)' }}
            >
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
            Forgot your password?
          </h1>
          <p className="text-lg text-muted-foreground">
            No worries — enter your email and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">Check your email</p>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Don't forget to check your spam folder if you don't see it.
                </p>
              </div>
            </div>

            <Link to="/login">
              <Button
                variant="default"
                size="lg"
                className="w-full h-14 text-lg font-semibold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Login
              </Button>
            </Link>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the email?
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-primary font-medium hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-14 text-base"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full h-14 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Login
              </Link>
            </div>
          </form>
        )}

        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Security Matters</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We take password security seriously. Your reset link will expire in 1 hour for your protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
