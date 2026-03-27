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

// ── Types ────────────────────────────────────────────────────────────────────

export interface OpportunityNotificationProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentShop: string;
  experience: string;
  experienceLabel: string;
  availability: string[];
  nashvilleArea: string;
  additionalInfo?: string;
}

// ── Styles ───────────────────────────────────────────────────────────────────

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
  backgroundColor: "#7B6838",
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
  color: "#7B6838",
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

// ── Component ────────────────────────────────────────────────────────────────

export function OpportunityNotification({
  firstName,
  lastName,
  email,
  phone,
  currentShop,
  experienceLabel,
  availability,
  nashvilleArea,
  additionalInfo,
}: OpportunityNotificationProps) {
  const fullName = `${firstName} ${lastName}`;
  const subject = `New Application — ${fullName}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>El Gato Negro — New Application</Text>
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
              {fullName} wants to join the team.
            </Heading>

            {/* Contact */}
            <Text style={label}>Name</Text>
            <Text style={value}>{fullName}</Text>

            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>

            <Text style={label}>Phone</Text>
            <Text style={value}>{phone}</Text>

            <Hr style={divider} />

            {/* Experience */}
            <Text style={label}>Current / Most Recent Coffee Shop</Text>
            <Text style={value}>{currentShop}</Text>

            <Text style={label}>Years of Coffee Experience</Text>
            <Text style={value}>{experienceLabel}</Text>

            <Text style={label}>Availability</Text>
            <Text style={value}>{availability.join(", ")}</Text>

            <Text style={label}>Based in Nashville Area?</Text>
            <Text style={value}>{nashvilleArea === "yes" ? "Yes" : "No"}</Text>

            {additionalInfo && (
              <>
                <Hr style={divider} />
                <Text style={label}>Additional Notes</Text>
                <Text style={messageValue}>{additionalInfo}</Text>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sent from elgatonegro.coffee · Reply directly to {email} to
              respond.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
