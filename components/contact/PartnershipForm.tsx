'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import TextHeading from '@/components/ui/TextHeading';

type Industry =
  | 'Healthcare'
  | 'Financial Services'
  | 'Manufacturing'
  | 'Education'
  | 'Professional Services'
  | 'Other';

type Framework =
  | 'HIPAA'
  | 'CMMC / NIST 800-171'
  | 'SOC 2'
  | 'PCI-DSS'
  | 'GLBA'
  | 'FERPA'
  | 'Other / Not sure';

interface PartnershipFormState {
  organization: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  industry: Industry | '';
  users: string;
  locations: string;
  frameworks: Framework[];
  timeline: string;
  notes: string;
}

const industries: Industry[] = [
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Education',
  'Professional Services',
  'Other',
];

const frameworks: Framework[] = [
  'HIPAA',
  'CMMC / NIST 800-171',
  'SOC 2',
  'PCI-DSS',
  'GLBA',
  'FERPA',
  'Other / Not sure',
];

export default function PartnershipForm() {
  const [form, setForm] = useState<PartnershipFormState>({
    organization: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    industry: '',
    users: '',
    locations: '',
    frameworks: [],
    timeline: '',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      const checkboxValue = target.value as Framework;
      setForm((prev) => {
        const prevArr = prev.frameworks || [];
        if (target.checked) {
          return { ...prev, frameworks: [...prevArr, checkboxValue] };
        } else {
          return { ...prev, frameworks: prevArr.filter((v) => v !== checkboxValue) };
        }
      });
    } else {
      const { name, value } = target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ type: 'partnership', ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({
        organization: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        industry: '',
        users: '',
        locations: '',
        frameworks: [],
        timeline: '',
        notes: '',
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error.');
      setStatus('error');
    }
  };

  const inputClass =
    'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nugreen-500';

  return (
    <div className="shadow-xs max-w-2xl rounded-2xl border border-gray-100 bg-white p-8">
      <TextHeading level="h2">New Partnership</TextHeading>
      <p className="mb-6 text-gray-600">
        Share a few details so we can route your inquiry correctly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          name="organization"
          placeholder="Organization Name*"
          value={form.organization}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          required
          name="firstName"
          placeholder="First Name*"
          value={form.firstName}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          required
          name="lastName"
          placeholder="Last Name*"
          value={form.lastName}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          required
          name="email"
          type="email"
          placeholder="Work Email*"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          required
          name="role"
          placeholder="Role*"
          value={form.role}
          onChange={handleChange}
          className={inputClass}
        />
        <select
          required
          name="industry"
          value={form.industry}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Industry*</option>
          {industries.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <input
          required
          name="users"
          type="number"
          placeholder="Estimated # of users*"
          value={form.users}
          onChange={handleChange}
          className={inputClass}
        />
        <select
          required
          name="locations"
          value={form.locations}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Locations*</option>
          <option>Single</option>
          <option>Multi-site</option>
          <option>Remote / Hybrid</option>
        </select>

        <div>
          <p className="mb-2 font-semibold">Compliance Frameworks</p>
          <div className="grid grid-cols-2 gap-2">
            {frameworks.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="frameworks"
                  value={f}
                  checked={form.frameworks.includes(f)}
                  onChange={handleChange}
                />
                {f}
              </label>
            ))}
          </div>
        </div>

        <select
          name="timeline"
          value={form.timeline}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">When would you like to get started?</option>
          <option>ASAP</option>
          <option>30–60 days</option>
          <option>60–90 days</option>
          <option>Exploring</option>
        </select>

        <textarea
          name="notes"
          rows={4}
          placeholder="Anything else we should know?"
          value={form.notes}
          onChange={handleChange}
          className={inputClass + ' resize-none'}
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-nugreen-500 hover:bg-nugreen-600 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition"
        >
          {status === 'sending' ? 'Sending...' : 'Submit Partnership Request'}
          {status === 'sending' && <FiSend className="animate-spin" />}
        </button>

        {status === 'success' && (
          <p className="text-nugreen-500 mt-2 flex items-center gap-2">
            <FiCheckCircle /> Request sent successfully!
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
