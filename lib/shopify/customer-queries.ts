// ─── Customer Account API GraphQL queries ───────────────────────────────────
//
// These target Shopify's Customer Account API (NOT the Storefront API).
// The schema is different — types like Customer, Order use the customer API schema.

// ─── Customer profile ───────────────────────────────────────────────────────

export const CUSTOMER_QUERY = `
  query CustomerQuery {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      metafield(namespace: "custom", key: "birthday") {
        value
      }
      defaultAddress {
        id
        formatted
        firstName
        lastName
        address1
        address2
        city
        zoneCode
        zip
        territoryCode
        phoneNumber
      }
      addresses(first: 10) {
        nodes {
          id
          formatted
          firstName
          lastName
          address1
          address2
          city
          zoneCode
          zip
          territoryCode
          phoneNumber
        }
      }
    }
  }
`;

// ─── Orders ─────────────────────────────────────────────────────────────────

export const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillments(first: 5) {
            nodes {
              status
              trackingInformation {
                number
                url
              }
            }
          }
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              id
              title
              quantity
              image {
                url
                altText
                width
                height
              }
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const CUSTOMER_ORDER_QUERY = `
  query CustomerOrder($orderId: ID!) {
    order(id: $orderId) {
      id
      name
      processedAt
      financialStatus
      fulfillments(first: 10) {
        nodes {
          status
          trackingInformation {
            number
            url
          }
        }
      }
      totalPrice {
        amount
        currencyCode
      }
      subtotal {
        amount
        currencyCode
      }
      totalShipping {
        amount
        currencyCode
      }
      totalTax {
        amount
        currencyCode
      }
      shippingAddress {
        formatted
        firstName
        lastName
        address1
        address2
        city
        zoneCode
        zip
        territoryCode
      }
      lineItems(first: 100) {
        nodes {
          id
          title
          quantity
          variantTitle
          image {
            url
            altText
            width
            height
          }
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

// ─── Address mutations ──────────────────────────────────────────────────────

export const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation CustomerAddressCreate($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation CustomerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!) {
    customerAddressUpdate(addressId: $addressId, address: $address) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_SET_DEFAULT_ADDRESS_MUTATION = `
  mutation SetDefaultAddress($addressId: ID!) {
    customerAddressUpdate(addressId: $addressId, address: {}, defaultAddress: true) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ─── Customer update ────────────────────────────────────────────────────────

export const CUSTOMER_UPDATE_MUTATION = `
  mutation CustomerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        metafield(namespace: "custom", key: "birthday") {
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
