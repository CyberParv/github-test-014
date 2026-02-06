'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/auth/login', { email, password });
      toast({ title: 'Welcome back!' });
    } catch (error) {
      toast({ title: 'Login failed. Check your credentials.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-md px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-neutral-900">Log In</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">
              Email
            </label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700">
              Password
            </label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'}
          </Button>
          <div className="flex justify-between text-sm text-neutral-600">
            <Link href="/auth/forgot-password" className="hover:text-neutral-900">
              Forgot password?
            </Link>
            <Link href="/auth/signup" className="hover:text-neutral-900">
              Create account
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
