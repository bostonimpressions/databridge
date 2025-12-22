'use client';

import TextHeading from '@/components/ui/TextHeading';
import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';


export default function SectionContact() {

  return (
    <AnimatedSection
      animation="fade"
      className={`relative overflow-hidden py-12 bg-white`}
    >

      <div className="container mx-auto px-4">

        <TextHeading level="h2">Contact</TextHeading>
        <div
          className={`grid md:grid-cols-[3fr_2fr] items-center gap-10 '}`}
        >

          <div className="">
            <div className="relative">
             form
            </div>
          </div>


          <div className="flex flex-col gap-4">
            <h3>Contact Details:</h3>
            <div className="contact-details flex flex-col gap-4">
              <div className="text-lg">
                <span className="font-semibold mr-2">Phone:</span>
                <p className="inline-block"><a href="112345">(###) ###-####</a></p>
              </div>
              <div className="text-lg">
                <span className="font-semibold mr-2">Email:</span>
                <p className="inline-block"><a href="mailto">hello@nuviewit.com</a></p>
              </div>
            </div>
          </div>

        </div>


      </div>
    </AnimatedSection>
  );
}
