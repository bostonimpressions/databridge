'use client';
import { useState } from 'react';
import ContactForm from './ContactForm';
import PartnershipForm from './PartnershipForm';

export default function ContactTabs() {
  const [active, setActive] = useState<'general' | 'partnership'>('general');

  return (
    <div className="mx-auto max-w-2xl">
      {/* Tabs */}
      <div className="mb-8 flex border-b">
        <button
          onClick={() => setActive('general')}
          className={`px-6 py-3 font-semibold transition ${
            active === 'general'
              ? 'border-nugreen-500 text-nugreen-600 border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          General Contact
        </button>
        <button
          onClick={() => setActive('partnership')}
          className={`px-6 py-3 font-semibold transition ${
            active === 'partnership'
              ? 'border-nugreen-500 text-nugreen-600 border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          New Partnership
        </button>
      </div>

      {active === 'general' && <ContactForm />}
      {active === 'partnership' && <PartnershipForm />}
    </div>
  );
}
