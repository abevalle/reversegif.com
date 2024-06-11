// components/Hero.js
import React from 'react';

const Hero = ({ title, description }) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{description}</p>
      </div>
    </div>
  </section>
);

export default Hero;
