import React from 'react';
import { FiMail, FiPhone, FiClock, FiLifeBuoy } from 'react-icons/fi';
import TextHeading from '@/components/ui/TextHeading';

export default function ContactDetails() {
  return (
    <aside className="rounded-2xl bg-slate-50 p-6 md:p-8">
      <header className="mb-8">
        <TextHeading level="h2">Contact Us</TextHeading>
        <p className="mt-2">
          For general questions, email is the fastest way to reach us.
          Existing clients should use the support options below.
        </p>
      </header>

      <div className="space-y-8">
        {/* Existing Client Support */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Existing Clients
          </h3>

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="mt-1 rounded-lg bg-slate-200 p-2 text-slate-700">
                <FiLifeBuoy size={26} />
              </span>
              <div>
                <p className="mb-1 font-medium text-slate-800">
                  Get Support
                </p>
                <a
                  href="#"
                  className="text-sapphire-600 hover:underline"
                >
                  Open a Support Ticket
                </a>
                <p className="mt-1 text-sm text-slate-600">
                  HaloPSA Client Portal
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="mt-1 rounded-lg bg-slate-200 p-2 text-slate-700">
                <FiPhone size={26} />
              </span>
              <div>
                <p className="mb-1 font-medium text-slate-800">
                  Call Support
                </p>
                <a
                  href="tel:+18001234567"
                  className="text-sapphire-600 hover:underline"
                >
                  (800) 123-4567
                </a>
                <p className="mt-1 text-sm text-slate-600">
                  24/7 for critical incidents
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* General Inquiries */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            General Inquiries
          </h3>

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="mt-1 rounded-lg bg-slate-200 p-2 text-slate-700">
                <FiMail size={26} />
              </span>
              <div>
                <p className="mb-1 font-medium text-slate-800">
                  Email
                </p>
                <a
                  href="mailto:hello@example.com"
                  className="text-sapphire-600 hover:underline"
                >
                  hello@example.com
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="mt-1 rounded-lg bg-slate-200 p-2 text-slate-700">
                <FiPhone size={26} />
              </span>
              <div>
                <p className="mb-1 font-medium text-slate-800">
                  Main Phone
                </p>
                <a
                  href="tel:+18001234567"
                  className="text-sapphire-600 hover:underline"
                >
                  (800) 123-4567
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="mt-1 rounded-lg bg-slate-200 p-2 text-slate-700">
                <FiClock size={26} />
              </span>
              <div>
                <p className="mb-1 font-medium text-slate-800">
                  Business Hours
                </p>
                <p>
                  Monday to Friday, 9am to 5pm EST
                </p>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-8 rounded-xl bg-white p-4 text-sm text-slate-600">
        We typically respond within one business day for non-support inquiries.
      </div>
    </aside>
  );
}
