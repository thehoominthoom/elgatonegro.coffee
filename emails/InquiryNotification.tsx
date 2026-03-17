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

export interface InquiryNotificationProps {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  serviceLabel: string;
  eventDate: string;
  venue: string;
  headcount: string;
  headcountLabel: string;
  message?: string;
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
  backgroundColor: "#B43620",
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

const label = {
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#B43620",
  margin: "0 0 4px 0",
};

const value = {
  fontSize: "15px",
  color: "#2A201D",
  margin: "0 0 20px 0",
  lineHeight: "1.5",
};

const messageValue = {
  fontSize: "14px",
  color: "#2A201D",
  margin: "0 0 20px 0",
  lineHeight: "1.7",
  whiteSpace: "pre-wrap" as const,
};

const divider = {
  borderTop: "1px solid #e5e0df",
  margin: "24px 0",
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

export function InquiryNotification({
  name,
  email,
  phone,
  serviceLabel,
  eventDate,
  venue,
  headcountLabel,
  message,
}: InquiryNotificationProps) {
  const subject = `New Inquiry — ${name} · ${serviceLabel}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>El Gato Negro — New Inquiry</Text>
          </Section>

          {/* Body */}
          <Section style={body}>
            <Heading
              as="h2"
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#2A201D",
                margin: "0 0 24px 0",
                lineHeight: "1.2",
              }}
            >
              {name} wants to book the cart.
            </Heading>

            {/* Service */}
            <Text style={label}>Service</Text>
            <Text style={value}>{serviceLabel}</Text>

            {/* Event Date */}
            <Text style={label}>Event Date</Text>
            <Text style={value}>{eventDate}</Text>

            {/* Venue */}
            <Text style={label}>Venue / Location</Text>
            <Text style={value}>{venue}</Text>

            {/* Headcount */}
            <Text style={label}>Headcount</Text>
            <Text style={value}>{headcountLabel}</Text>

            <Hr style={divider} />

            {/* Contact */}
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>

            {phone && (
              <>
                <Text style={label}>Phone</Text>
                <Text style={value}>{phone}</Text>
              </>
            )}

            {message && (
              <>
                <Hr style={divider} />
                <Text style={label}>Message</Text>
                <Text style={messageValue}>{message}</Text>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sent from elgatonegro.coffee · Reply directly to {email} to respond.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
