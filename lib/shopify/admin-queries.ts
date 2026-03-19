// ─── Shopify Admin API GraphQL queries ────────────────────────────────────────
//
// These target the Shopify Admin API (NOT Storefront or Customer Account API).
// Used for operations that require admin-level access: writing metafields,
// updating marketing consent, etc.

// ─── Metafields ──────────────────────────────────────────────────────────────

export const ADMIN_SET_METAFIELDS_MUTATION = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ─── Marketing consent ──────────────────────────────────────────────────────

export const ADMIN_CUSTOMER_MARKETING_CONSENT_QUERY = `
  query CustomerMarketingConsent($id: ID!) {
    customer(id: $id) {
      emailMarketingConsent {
        marketingState
      }
    }
  }
`;

export const ADMIN_CUSTOMER_EMAIL_MARKETING_CONSENT_UPDATE_MUTATION = `
  mutation CustomerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          marketingState
          consentUpdatedAt
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
