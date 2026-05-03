/**
 * SEO utilities for dynamic meta tag management
 */

export const updateMetaTags = (config) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
  } = config

  // Update title
  if (title) {
    document.title = title
    updateMetaTag('og:title', title)
    updateMetaTag('twitter:title', title)
  }

  // Update description
  if (description) {
    updateMetaTag('description', description)
    updateMetaTag('og:description', description)
    updateMetaTag('twitter:description', description)
  }

  // Update image
  if (image) {
    updateMetaTag('og:image', image)
    updateMetaTag('og:image:alt', title || 'Prateek Portfolio')
    updateMetaTag('twitter:image', image)
  }

  // Update URL
  if (url) {
    updateMetaTag('og:url', url)
    updateMetaTag('twitter:url', url)
  }

  // Update type
  if (type) {
    updateMetaTag('og:type', type)
  }
}

export const updateMetaTag = (property, content) => {
  let element = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`)

  if (!element) {
    element = document.createElement('meta')
    const isProperty = property.includes(':')
    if (isProperty) {
      element.setAttribute('property', property)
    } else {
      element.setAttribute('name', property)
    }
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export const getPageMetaTags = (pageId) => {
  const config = {
    home: {
      title: 'Prateek · Full Stack Developer & ML Engineer',
      description: 'Full Stack Developer, Builder & ML Systems Engineer from Chennai.',
      image: 'https://prateek.dev/og-image.png',
    },
    work: {
      title: 'Work - Prateek · Portfolio',
      description: 'Check out my latest projects and work experience.',
      image: 'https://prateek.dev/og-work.png',
    },
    about: {
      title: 'About - Prateek · Portfolio',
      description: 'Learn more about my background, skills, and expertise.',
      image: 'https://prateek.dev/og-about.png',
    },
    blog: {
      title: 'Blog - Prateek · Portfolio',
      description: 'Read my latest articles and insights on web development and ML.',
      image: 'https://prateek.dev/og-blog.png',
    },
    contact: {
      title: 'Contact - Prateek · Portfolio',
      description: 'Get in touch with me for collaborations or opportunities.',
      image: 'https://prateek.dev/og-contact.png',
    },
  }

  return config[pageId] || config.home
}

/**
 * Structured data for SEO (JSON-LD)
 */
export const injectStructuredData = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Prateek',
    jobTitle: ['Full Stack Developer', 'ML Engineer', 'Software Developer'],
    url: 'https://prateek.dev',
    image: 'https://prateek.dev/og-image.png',
    location: {
      '@type': 'City',
      name: 'Chennai',
      country: 'India',
    },
    sameAs: [
      'https://github.com/prateek',
      'https://twitter.com/prateek',
      'https://linkedin.com/in/prateek',
    ],
    description: 'Full Stack Developer, Builder & ML Systems Engineer specialized in React, FastAPI, Python, and Machine Learning.',
    knowsAbout: ['React', 'FastAPI', 'Python', 'Machine Learning', 'TypeScript', 'Web Development'],
  }

  let script = document.querySelector('script[type="application/ld+json"]')
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(schema)
}
