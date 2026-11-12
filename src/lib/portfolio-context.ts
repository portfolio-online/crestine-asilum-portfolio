import { createContext } from "react";
import { z } from "zod";
import type { PortfolioData } from "./portfolio-data";

export const MAX_PROFILE_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
export const PROFILE_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
} as const;

export const MAX_WORK_SAMPLE_FILE_SIZE_BYTES = 2 * 1024 * 1024;
export const WORK_SAMPLE_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
} as const;

const profileImageSchema = z
  .string()
  .max(2_800_000)
  .refine(isSupportedProfileImageData, "Profile photo must be a supported image file.")
  .default("")
  .refine(
    (image) => getBase64DataSize(image) <= MAX_PROFILE_IMAGE_SIZE_BYTES,
    "Profile photos must be 2 MB or smaller.",
  );

function isSupportedProfileImageData(value: string) {
  if (!value) return true;
  const match =
    /^data:([^;]+);base64,((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/.exec(
      value,
    );
  return Boolean(match?.[1] && Object.hasOwn(PROFILE_IMAGE_TYPES, match[1]));
}

function getBase64DataSize(dataUrl: string) {
  if (!dataUrl) return 0;
  const encoded = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const padding = encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0;
  return (encoded.length / 4) * 3 - padding;
}

const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  subtitle: z.string(),
  headline: z.string(),
  summary: z.string(),
  email: z.string(),
  phone: z.string(),
  phoneHref: z.string(),
  location: z.string(),
  sidebarImage: profileImageSchema,
  heroImage: profileImageSchema,
  contactImage: profileImageSchema,
});

const workSampleAttachmentSchema = z
  .object({
    name: z.string().max(255).default(""),
    dataUrl: z
      .string()
      .max(2_800_000)
      .refine(isSupportedAttachmentData, "Work sample attachment is not a supported file.")
      .default(""),
  })
  .default({ name: "", dataUrl: "" })
  .superRefine((attachment, context) => {
    if (Boolean(attachment.name) !== Boolean(attachment.dataUrl)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Work sample attachment name and file must be provided together.",
      });
    }
    if (getAttachmentSize(attachment.dataUrl) > MAX_WORK_SAMPLE_FILE_SIZE_BYTES) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Work sample attachments must be 2 MB or smaller.",
      });
    }
  });

function isSupportedAttachmentData(value: string) {
  if (!value) return true;
  if (/^\/(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9%._/-]+\.xlsx$/i.test(value)) {
    return true;
  }
  const match =
    /^data:([^;]+);base64,((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/.exec(
      value,
    );
  return Boolean(match?.[1] && Object.hasOwn(WORK_SAMPLE_FILE_TYPES, match[1]));
}

function getAttachmentSize(dataUrl: string) {
  if (!dataUrl) return 0;
  const encoded = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const padding = encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0;
  return (encoded.length / 4) * 3 - padding;
}

const workSampleSchema = z.preprocess(
  (value: unknown) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return value;

    const sample = value as Record<string, unknown>;
    if (typeof sample["attachment"] === "object" && sample["attachment"] !== null) return value;
    return {
      ...sample,
      attachment: { name: "", dataUrl: "" },
    };
  },
  z.object({
    title: z.string(),
    description: z.string(),
    attachment: workSampleAttachmentSchema,
  }),
);

export const portfolioSchema = z.object({
  profile: profileSchema,
  capabilities: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      period: z.string(),
      details: z.array(z.string()),
    }),
  ),
  services: z.array(z.object({ title: z.string(), description: z.string() })),
  toolCategories: z.array(z.object({ label: z.string(), items: z.array(z.string()) })),
  workSamples: z.array(workSampleSchema),
  education: z.object({
    school: z.string(),
    degree: z.string(),
    major: z.string(),
    period: z.string(),
  }),
  trainings: z.array(z.object({ name: z.string(), year: z.string() })),
  strengths: z.array(z.object({ title: z.string(), note: z.string() })),
});

export type PortfolioStore = {
  data: PortfolioData;
  saveData: (data: PortfolioData, credentials: AdminCredentials) => Promise<void>;
  loadError: string | null;
};

export type AdminCredentials = {
  username: string;
  password: string;
};

export const PortfolioContext = createContext<PortfolioStore | null>(null);
