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
    <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-xs border-1 border-gray-100">
      <TextHeading level="h2">Send us a message</TextHeading>
      <p className="text-gray-600 mb-6">
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
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nugreen-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nugreen-500"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nugreen-500 resize-none"
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-nugreen-500 hover:bg-nugreen-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
          {status === 'sending' && <FiSend className="animate-spin" />}
        </button>

        {status === 'success' && (
          <p className="flex items-center text-nugreen-500 gap-2 mt-2">
            <FiCheckCircle /> Message sent successfully!
          </p>
        )}

        {status === 'error' && (
          <p className="flex items-center text-magenta-500 gap-2 mt-2">
            <FiAlertCircle /> {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}
