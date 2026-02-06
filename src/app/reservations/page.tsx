'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export default function ReservationsPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [datetime, setDatetime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/reservations', {
        name,
        contact,
        partySize,
        datetime,
      });
      toast({ title: `Reservation ${data?.status || 'submitted'}` });
      setName('');
      setContact('');
      setPartySize(2);
      setDatetime('');
    } catch (error) {
      toast({ title: 'Unable to create reservation.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-neutral-900">Reserve a Table</h1>
        <p className="mt-2 text-sm text-neutral-600">Book your spot in seconds.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-neutral-700">
              Name
            </label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact" className="text-sm font-medium text-neutral-700">
              Contact (email or phone)
            </label>
            <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="party" className="text-sm font-medium text-neutral-700">
                Party Size
              </label>
              <Input
                id="party"
                type="number"
                min={1}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="datetime" className="text-sm font-medium text-neutral-700">
                Date & Time
              </label>
              <Input
                id="datetime"
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm Reservation'}
          </Button>
        </form>
      </main>
    </div>
  );
}
