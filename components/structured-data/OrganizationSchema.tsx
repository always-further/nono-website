export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Always Further',
    url: 'https://alwaysfurther.ai',
    logo: 'https://alwaysfurther.ai/logos/teal-af-logo-vert.svg',
    description:
      'OS-level sandboxing and cryptographic provenance for AI agents. Creators of nono and Sigstore.',
    sameAs: [
      'https://github.com/always-further',
      'https://x.com/alwaysfurtherAI',
      'https://bsky.app/profile/alwaysfurther.ai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@alwaysfurther.ai',
      contactType: 'customer support',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
