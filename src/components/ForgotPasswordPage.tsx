import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, CheckCircle, Shield, Lock, Key, ArrowLeft } from 'lucide-react';

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

export function ForgotPasswordPage() {
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-emerald-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Check your email
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              If an account exists with <strong>{formData.email}</strong>, we've sent password reset instructions to your inbox.
            </p>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 mb-2">What's next?</h3>
                  <ul className="text-slate-600 space-y-1 text-sm">
                    <li>• Check your email inbox (and spam folder)</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Create a new secure password</li>
                    <li>• The link expires in 24 hours for security</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Return to Login
              </Link>
              <button 
                onClick={() => setIsSuccess(false)}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Key className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Forgot your password?
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            No worries — enter your email and we'll send you a reset link.
          </p>
        </div>
      </section>

      {/* Password Reset Form */}
      <section className="bg-white py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Reset Link
                </>
              )}
            </button>

            {/* Return to Login */}
            <div className="text-center">
              <Link 
                to="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Return to Login
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Security Matters</h2>
            <p className="text-lg text-slate-600">We take password security seriously</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Your account is protected</h3>
              <p className="text-slate-600">We use industry-standard security measures to protect your account and personal information.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Secure reset link only</h3>
              <p className="text-slate-600">Reset links are encrypted, unique to your account, and expire after 24 hours for maximum security.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No sensitive data shared</h3>
              <p className="text-slate-600">We never include passwords or sensitive information in reset emails - only secure reset links.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-amber-100 rounded-full p-2 mr-3">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Security Notice</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              For your security, password reset links expire in 24 hours. If you don't receive an email within a few minutes, 
              please check your spam folder or try again with a different email address.
            </p>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Need Additional Help?</h2>
          <p className="text-lg text-slate-600 mb-8">
            If you're having trouble resetting your password, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Contact Support
            </Link>
            <Link 
              to="/faq"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}