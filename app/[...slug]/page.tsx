import React from 'react';

export default function DynamicPage() {
  return (
    <div className="container mx-auto p-12 text-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Content Not Found</h1>
      <p className="text-xl text-gray-700">
        The route you are trying to access does not have a defined page component.
      </p>
      <p className="text-gray-500 mt-2">Path: /[...slug]</p>
    </div>
  );
}