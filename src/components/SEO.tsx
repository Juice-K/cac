import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

const defaultMeta = {
  title: "Community Advancement Collective",
  description: "Empowering communities through GED preparation, career development, food assistance for veterans, and volunteer opportunities. Get help or join our mission today.",
  image: "/og-image.png",
  siteName: "Community Advancement Collective",
};

const SEO = ({
  title,
  description = defaultMeta.description,
  canonical,
  type = "website",
  image = defaultMeta.image,
}: SEOProps) => {
  const pageTitle = title 
    ? `${title} | ${defaultMeta.siteName}` 
    : `${defaultMeta.siteName} | Orlando, FL`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultMeta.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* JSON-LD Structured Data for Nonprofit */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          "name": "Community Advancement Collective",
          "alternateName": "CAC",
          "description": "Empowering communities through GED preparation, career development, food assistance for veterans, and volunteer opportunities.",
          "url": "https://cacfla.org",
          "logo": "https://cacfla.org/og-image.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1317 Edgewater Dr #3409",
            "addressLocality": "Orlando",
            "addressRegion": "FL",
            "postalCode": "32804",
            "addressCountry": "US"
          },
          "telephone": "+1-407-863-2131",
          "email": "info@cacfla.org",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "17:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Saturday",
              "opens": "10:00",
              "closes": "14:00"
            }
          ],
          "areaServed": {
            "@type": "City",
            "name": "Orlando",
            "containedInPlace": {
              "@type": "State",
              "name": "Florida"
            }
          },
          "serviceType": [
            "GED Preparation",
            "Career Development",
            "Food Assistance for Veterans",
            "Community Support Services"
          ],
          "sameAs": [
            "https://instagram.com/cacfla",
            "https://facebook.com/cacfla",
            "https://linkedin.com/company/cacfla"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
