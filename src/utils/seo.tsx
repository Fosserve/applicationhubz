
import React from 'react';
import { Helmet } from 'react-helmet';
import { SEOProps } from '../types';

// Default SEO values
const defaults = {
  title: 'JobHub | Find Your Dream Job',
  description: 'JobHub is a modern job listing platform that helps you find your dream job and track your applications.',
  keywords: ['jobs', 'careers', 'job listing', 'hiring', 'employment', 'job board'],
  image: '/og-image.png', // Use the existing OG image
  url: typeof window !== 'undefined' ? window.location.href : '',
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
}) => {
  const seoTitle = title ? `${title} | JobHub` : defaults.title;
  const seoDescription = description || defaults.description;
  const seoKeywords = keywords ? [...defaults.keywords, ...keywords] : defaults.keywords;
  const seoImage = image || defaults.image;
  const seoUrl = url || defaults.url;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
};

<lov-add-dependency>react-helmet@6.1.0</lov-add-dependency>
<lov-add-dependency>@types/react-helmet@6.1.6</lov-add-dependency>
