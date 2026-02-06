'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Reservation } from '@/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/reservations');
      setReservations(data?.reservations || []);
    } catch (err) {
      setError('Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/reservations/${id}`, { status });
      loadReservations();
    } catch (error) {
      setError('Unable to update reservation.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-neutral-900">Manage Reservations</h1>
        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p>{error}</p>
            <Button onClick={loadReservations} className="mt-4">
              Retry
            </Button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
            <p>No reservations found.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-neutral-900">{reservation.name}</p>
                    <p className="text-sm text-neutral-600">Party {reservation.partySize}</p>
                    <p className="text-sm text-neutral-600">
                      {new Date(reservation.datetime || '').toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['confirmed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(reservation.id, status)}
                        className={`rounded-full border px-3 py-1 text-xs ${
                          reservation.status === status
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
