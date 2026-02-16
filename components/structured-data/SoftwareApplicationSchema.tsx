export default function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'nono',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'macOS, Linux',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://nono.sh',
    downloadUrl: 'https://github.com/always-further/nono',
    description:
      'OS-enforced capability sandbox for running untrusted AI agents. Kernel-level isolation using Seatbelt (macOS) and Landlock (Linux).',
    author: {
      '@type': 'Organization',
      name: 'Always Further',
      url: 'https://alwaysfurther.ai',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
