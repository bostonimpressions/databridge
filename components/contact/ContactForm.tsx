'use client';
import React, { useState } from 'react';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import TextHeading from '@/components/ui/TextHeading';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error.');
      setStatus('error');
    }
  };

  return (
    <div className="shadow-xs border-1 max-w-2xl rounded-2xl border-gray-100 bg-white p-8">
      <TextHeading level="h2">Send us a message</TextHeading>
      <p className="mb-6 text-gray-600">
        For any questions or inquiries, fill out the form below and we’ll get back to you promptly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="focus:ring-apple-500 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="focus:ring-apple-500 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="focus:ring-apple-500 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-apple-500 hover:bg-apple-600 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
          {status === 'sending' && <FiSend className="animate-spin" />}
        </button>

        {status === 'success' && (
          <p className="text-apple-500 mt-2 flex items-center gap-2">
            <FiCheckCircle /> Message sent successfully!
          </p>
        )}

        {status === 'error' && (
          <p className="mt-2 flex items-center gap-2 text-magenta-500">
            <FiAlertCircle /> {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}
