import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InquiryConfirmationProps {
  firstName: string;
  serviceLabel: string;
  eventDate: string;
  venue: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const main = {
  backgroundColor: "#FAF5F4",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: "1px solid #e5e0df",
};

const header = {
  backgroundColor: "#2A201D",
  padding: "24px 32px",
};

const headerText = {
  color: "#FAF5F4",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  margin: "0",
};

const body = {
  padding: "32px",
};

const divider = {
  borderTop: "1px solid #e5e0df",
  margin: "24px 0",
};

const label = {
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#B43620",
  margin: "0 0 4px 0",
};

const value = {
  fontSize: "14px",
  color: "#2A201D",
  margin: "0 0 16px 0",
  lineHeight: "1.5",
};

const footer = {
  padding: "16px 32px",
  backgroundColor: "#FAF5F4",
  borderTop: "1px solid #e5e0df",
};

const footerText = {
  fontSize: "11px",
  color: "#2A201D",
  opacity: 0.4,
  margin: "0",
  lineHeight: "1.6",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function InquiryConfirmation({
  firstName,
  serviceLabel,
  eventDate,
  venue,
}: InquiryConfirmationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>We got your inquiry, {firstName}. We'll be in touch within 1–2 business days.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>El Gato Negro</Text>
          </Section>

          {/* Body */}
          <Section style={body}>
            <Heading
              as="h1"
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#2A201D",
                margin: "0 0 16px 0",
                lineHeight: "1.2",
              }}
            >
              Got it, {firstName}.
            </Heading>

            <Text
              style={{
                fontSize: "15px",
                color: "#2A201D",
                lineHeight: "1.7",
                margin: "0 0 24px 0",
              }}
            >
              Your inquiry landed. We review every request personally and
              we'll be in touch within 1–2 business days with availability
              and next steps.
            </Text>

            <Hr style={divider} />

            {/* Summary */}
            <Text
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#2A201D",
                opacity: 0.4,
                margin: "0 0 16px 0",
              }}
            >
              Your inquiry
            </Text>

            <Text style={label}>Service</Text>
            <Text style={value}>{serviceLabel}</Text>

            <Text style={label}>Event Date</Text>
            <Text style={value}>{eventDate}</Text>

            <Text style={label}>Venue / Location</Text>
            <Text style={value}>{venue}</Text>

            <Hr style={divider} />

            <Text
              style={{
                fontSize: "14px",
                color: "#2A201D",
                lineHeight: "1.7",
                margin: "0",
                opacity: 0.6,
              }}
            >
              Questions before then? Reply to this email — it goes straight to
              us.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              El Gato Negro · ElGatoNegro.Coffee
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
