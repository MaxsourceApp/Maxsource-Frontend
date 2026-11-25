import { NextResponse } from "next/server";

const ghlCreateContactUrl = "https://services.leadconnectorhq.com/contacts/";
const ghlCustomFieldIds = {
  serviceAreas: "oy1NKNIhHa7UL0vJb607",
  engagements: "851GVosWT2sQ1mnsJMq5",
  company: "O6PGENoT22ExkzCg6G1F",
  referralSource: "0B4AW8emqF6ott77DjyO",
  projectDetails: "R12pmQol2pFhFcVd9Nez",
};
const allowedServiceAreas = new Set([
  "AI & Business Automation",
  "Custom Software Development",
  "Dedicated Development Teams",
  "Healthcare Technology & Operations",
  "Ecommerce Development",
  "Digital Marketing & Automation",
]);
const allowedEngagements = new Set([
  "Individual specialists",
  "Dedicated team",
  "Managed service",
  "Fixed-scope project",
]);
const allowedReferralSources = new Set([
  "Google Search",
  "Referral",
  "LinkedIn",
  "Social Media",
  "Existing Client",
  "Other",
]);

interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  referralSource: string;
  projectDetails: string;
  website: string;
  serviceAreas: string[];
  engagements: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isContactSubmission(value: unknown): value is ContactSubmission {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.firstName === "string" &&
    typeof value.lastName === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string" &&
    typeof value.company === "string" &&
    typeof value.referralSource === "string" &&
    typeof value.projectDetails === "string" &&
    typeof value.website === "string" &&
    isStringArray(value.serviceAreas) &&
    isStringArray(value.engagements)
  );
}

function isValidSubmission(submission: ContactSubmission) {
  return (
    submission.firstName.trim().length > 0 &&
    submission.firstName.length <= 100 &&
    submission.lastName.trim().length > 0 &&
    submission.lastName.length <= 100 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email) &&
    submission.email.length <= 254 &&
    /^[+()\d.\-\s]{7,30}$/.test(submission.phone) &&
    submission.company.trim().length > 0 &&
    submission.company.length <= 200 &&
    (submission.referralSource === "" ||
      allowedReferralSources.has(submission.referralSource)) &&
    submission.projectDetails.length <= 5000 &&
    submission.serviceAreas.length > 0 &&
    submission.serviceAreas.every((area) => allowedServiceAreas.has(area)) &&
    submission.engagements.length > 0 &&
    submission.engagements.every((engagement) =>
      allowedEngagements.has(engagement),
    )
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The enquiry could not be read. Please try again." },
      { status: 400 },
    );
  }

  if (!isContactSubmission(payload)) {
    return NextResponse.json(
      { error: "Please complete the enquiry form and try again." },
      { status: 400 },
    );
  }

  if (payload.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidSubmission(payload)) {
    return NextResponse.json(
      { error: "Please check your details and selections, then try again." },
      { status: 400 },
    );
  }

  const config = {
    token: process.env.GHL_API_TOKEN,
    locationId: process.env.GHL_LOCATION_ID,
  };
  const missingConfig = Object.entries(config)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => key);

  if (missingConfig.length > 0) {
    console.error("GHL contact form is missing server configuration:", missingConfig);
    return NextResponse.json(
      { error: "The enquiry form is not fully configured. Please contact us by email." },
      { status: 503 },
    );
  }

  const ghlPayload = {
    locationId: config.locationId,
    tags: ["contact-us"],
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    companyName: payload.company.trim(),
    customFields: [
      {
        id: ghlCustomFieldIds.serviceAreas,
        value: payload.serviceAreas.join(", "),
      },
      {
        id: ghlCustomFieldIds.engagements,
        value: payload.engagements.join(", "),
      },
      {
        id: ghlCustomFieldIds.company,
        value: payload.company.trim(),
      },
      {
        id: ghlCustomFieldIds.referralSource,
        value: payload.referralSource,
      },
      {
        id: ghlCustomFieldIds.projectDetails,
        value: payload.projectDetails.trim(),
      },
    ],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response: Response;

  try {
    response = await fetch(ghlCreateContactUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(ghlPayload),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    console.error(
      "GHL contact upsert request failed:",
      error instanceof Error ? error.message : "Unknown network error",
    );
    return NextResponse.json(
      { error: "We could not send your enquiry right now. Please try again." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    console.error("GHL contact upsert returned status:", response.status);
    return NextResponse.json(
      { error: "We could not send your enquiry right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
