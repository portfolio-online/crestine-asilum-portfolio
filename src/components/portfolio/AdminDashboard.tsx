import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { FileUp, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminCredentials } from "@/lib/portfolio-context";
import type { PortfolioData } from "@/lib/portfolio-data";
import { portfolioSchema } from "@/lib/portfolio-context";
import { readWorkSampleFile, workSampleFileAccept } from "@/lib/work-sample-attachment";
import { profileImageFileAccept, readProfileImageFile } from "@/lib/profile-image";
import { usePortfolioStore } from "@/lib/use-portfolio-data";
import { verifyPortfolioAdmin } from "@/lib/portfolio-server";

const editableSections = [
  { key: "capabilities", label: "Capabilities" },
  { key: "experience", label: "Experience" },
  { key: "services", label: "Services" },
  { key: "toolCategories", label: "Tools & Skills" },
  { key: "workSamples", label: "Work Samples" },
  { key: "education", label: "Education" },
  { key: "trainings", label: "Trainings" },
  { key: "strengths", label: "Strengths" },
] as const;

type EditableSection = (typeof editableSections)[number]["key"];
type ActiveSection = "profile" | EditableSection;
type ProfileField = keyof PortfolioData["profile"];
type UpdateSection = <K extends EditableSection>(key: K, value: PortfolioData[K]) => void;

const profileFields: { key: ProfileField; label: string; multiline?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Professional title" },
  { key: "subtitle", label: "Subtitle" },
  { key: "headline", label: "Headline", multiline: true },
  { key: "summary", label: "Summary", multiline: true },
  { key: "email", label: "Email address" },
  { key: "phone", label: "Phone number" },
  { key: "phoneHref", label: "Phone link" },
  { key: "location", label: "Location" },
];

const profileImageFields = [
  { key: "sidebarImage", label: "Sidebar profile photo" },
  { key: "heroImage", label: "Hero portrait" },
  { key: "contactImage", label: "Contact portrait" },
] as const;

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const className =
    "w-full rounded-lg border border-input bg-card px-3 py-2.5 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

function StringListField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {values.map((value, index) => (
        <div key={index} className="flex items-start gap-2">
          <input
            aria-label={`${label} ${index + 1}`}
            value={value}
            onChange={(event) =>
              onChange(
                values.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
              )
            }
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
            className="rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-muted"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      <AddButton onClick={() => onChange([...values, ""])}>Add {label.toLowerCase()}</AddButton>
    </div>
  );
}

function ProfileImageField({
  label,
  image,
  fallbackImage,
  onChange,
  onError,
  onReadingChange,
}: {
  label: string;
  image: string;
  fallbackImage: string;
  onChange: (image: string) => void;
  onError: (error: string) => void;
  onReadingChange: (reading: boolean) => void;
}) {
  async function handleFileChange(file: File | undefined) {
    if (!file) return;

    onError("");
    onReadingChange(true);
    try {
      onChange(await readProfileImageFile(file));
    } catch (fileError) {
      onError(
        fileError instanceof Error ? fileError.message : "Could not read the selected image.",
      );
    } finally {
      onReadingChange(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <img
        src={image || fallbackImage}
        alt={`${label} preview`}
        className="size-24 rounded-xl border border-border object-cover"
      />
      <label className="block space-y-1.5 text-sm font-medium">
        <span className="sr-only">Choose {label.toLowerCase()} (max 2 MB)</span>
        <input
          type="file"
          accept={profileImageFileAccept}
          aria-label={`Choose ${label.toLowerCase()}`}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            void handleFileChange(file);
          }}
          className="sr-only"
        />
        <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
          <FileUp className="size-4" aria-hidden="true" />
          Choose image (max 2 MB)
        </span>
      </label>
      {image && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="ml-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          Use default
        </button>
      )}
    </div>
  );
}

function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
    >
      <Plus className="size-4" aria-hidden="true" />
      {children}
    </button>
  );
}

function EntryCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-card p-4">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{title}</p>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Remove
        </button>
      </div>
      {children}
    </fieldset>
  );
}

function SectionFields({
  section,
  data,
  update,
  onError,
  onReadingChange,
}: {
  section: EditableSection;
  data: PortfolioData;
  update: UpdateSection;
  onError: (message: string) => void;
  onReadingChange: (reading: boolean) => void;
}) {
  switch (section) {
    case "capabilities":
      return (
        <StringListField
          label="Capability"
          values={data.capabilities}
          onChange={(value) => update("capabilities", value)}
        />
      );
    case "experience":
      return (
        <div className="space-y-4">
          {data.experience.map((entry, index) => (
            <EntryCard
              key={index}
              title={`Position ${index + 1}`}
              onRemove={() =>
                update(
                  "experience",
                  data.experience.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Company"
                  value={entry.company}
                  onChange={(value) =>
                    update(
                      "experience",
                      data.experience.map((item, i) =>
                        i === index ? { ...item, company: value } : item,
                      ),
                    )
                  }
                />
                <Field
                  label="Job title"
                  value={entry.role}
                  onChange={(value) =>
                    update(
                      "experience",
                      data.experience.map((item, i) =>
                        i === index ? { ...item, role: value } : item,
                      ),
                    )
                  }
                />
                <Field
                  label="Dates"
                  value={entry.period}
                  onChange={(value) =>
                    update(
                      "experience",
                      data.experience.map((item, i) =>
                        i === index ? { ...item, period: value } : item,
                      ),
                    )
                  }
                />
                <div className="sm:col-span-2">
                  <StringListField
                    label="Responsibilities and achievements"
                    values={entry.details}
                    onChange={(details) =>
                      update(
                        "experience",
                        data.experience.map((item, i) =>
                          i === index ? { ...item, details } : item,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            </EntryCard>
          ))}
          <AddButton
            onClick={() =>
              update("experience", [
                ...data.experience,
                { company: "", role: "", period: "", details: [] },
              ])
            }
          >
            Add position
          </AddButton>
        </div>
      );
    case "services":
      return (
        <div className="space-y-4">
          {data.services.map((entry, index) => (
            <EntryCard
              key={index}
              title={`Service ${index + 1}`}
              onRemove={() =>
                update(
                  "services",
                  data.services.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <Field
                label="Service name"
                value={entry.title}
                onChange={(value) =>
                  update(
                    "services",
                    data.services.map((item, i) =>
                      i === index ? { ...item, title: value } : item,
                    ),
                  )
                }
              />
              <Field
                label="Description"
                value={entry.description}
                multiline
                onChange={(value) =>
                  update(
                    "services",
                    data.services.map((item, i) =>
                      i === index ? { ...item, description: value } : item,
                    ),
                  )
                }
              />
            </EntryCard>
          ))}
          <AddButton
            onClick={() => update("services", [...data.services, { title: "", description: "" }])}
          >
            Add service
          </AddButton>
        </div>
      );
    case "toolCategories":
      return (
        <div className="space-y-4">
          {data.toolCategories.map((entry, index) => (
            <EntryCard
              key={index}
              title={`Tools group ${index + 1}`}
              onRemove={() =>
                update(
                  "toolCategories",
                  data.toolCategories.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <Field
                label="Group name"
                value={entry.label}
                onChange={(value) =>
                  update(
                    "toolCategories",
                    data.toolCategories.map((item, i) =>
                      i === index ? { ...item, label: value } : item,
                    ),
                  )
                }
              />
              <StringListField
                label="Tool or skill"
                values={entry.items}
                onChange={(items) =>
                  update(
                    "toolCategories",
                    data.toolCategories.map((item, i) => (i === index ? { ...item, items } : item)),
                  )
                }
              />
            </EntryCard>
          ))}
          <AddButton
            onClick={() =>
              update("toolCategories", [...data.toolCategories, { label: "", items: [] }])
            }
          >
            Add tools group
          </AddButton>
        </div>
      );
    case "workSamples":
      return (
        <div className="space-y-4">
          {data.workSamples.map((entry, index) => (
            <EntryCard
              key={index}
              title={`Work sample ${index + 1}`}
              onRemove={() =>
                update(
                  "workSamples",
                  data.workSamples.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <Field
                label="Sample name"
                value={entry.title}
                onChange={(value) =>
                  update(
                    "workSamples",
                    data.workSamples.map((item, i) =>
                      i === index ? { ...item, title: value } : item,
                    ),
                  )
                }
              />
              <Field
                label="Description"
                value={entry.description}
                multiline
                onChange={(value) =>
                  update(
                    "workSamples",
                    data.workSamples.map((item, i) =>
                      i === index ? { ...item, description: value } : item,
                    ),
                  )
                }
              />
              <WorkSampleFileField
                attachment={entry.attachment}
                onChange={(attachment) =>
                  update(
                    "workSamples",
                    data.workSamples.map((item, i) =>
                      i === index ? { ...item, attachment } : item,
                    ),
                  )
                }
                onError={onError}
                onReadingChange={onReadingChange}
              />
            </EntryCard>
          ))}
          <AddButton
            onClick={() =>
              update("workSamples", [
                ...data.workSamples,
                { title: "", description: "", attachment: { name: "", dataUrl: "" } },
              ])
            }
          >
            Add work sample
          </AddButton>
        </div>
      );
    case "education":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="School"
            value={data.education.school}
            onChange={(school) => update("education", { ...data.education, school })}
          />
          <Field
            label="Degree"
            value={data.education.degree}
            onChange={(degree) => update("education", { ...data.education, degree })}
          />
          <Field
            label="Major"
            value={data.education.major}
            onChange={(major) => update("education", { ...data.education, major })}
          />
          <Field
            label="Dates"
            value={data.education.period}
            onChange={(period) => update("education", { ...data.education, period })}
          />
        </div>
      );
    case "trainings":
      return (
        <div className="space-y-4">
          {data.trainings.map((entry, index) => (
            <EntryCard
              key={index}
              title={`Training ${index + 1}`}
              onRemove={() =>
                update(
                  "trainings",
                  data.trainings.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Training or certification"
                  value={entry.name}
                  onChange={(value) =>
                    update(
                      "trainings",
                      data.trainings.map((item, i) =>
                        i === index ? { ...item, name: value } : item,
                      ),
                    )
                  }
                />
                <Field
                  label="Year"
                  value={entry.year}
                  onChange={(value) =>
                    update(
                      "trainings",
                      data.trainings.map((item, i) =>
                        i === index ? { ...item, year: value } : item,
                      ),
                    )
                  }
                />
              </div>
            </EntryCard>
          ))}
          <AddButton
            onClick={() => update("trainings", [...data.trainings, { name: "", year: "" }])}
          >
            Add training
          </AddButton>
        </div>
      );
    case "strengths":
      return (
        <div className="space-y-4">
          {data.strengths.map((entry, index) => (
            <EntryCard
              key={index}
              title={`Strength ${index + 1}`}
              onRemove={() =>
                update(
                  "strengths",
                  data.strengths.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <Field
                label="Strength"
                value={entry.title}
                onChange={(value) =>
                  update(
                    "strengths",
                    data.strengths.map((item, i) =>
                      i === index ? { ...item, title: value } : item,
                    ),
                  )
                }
              />
              <Field
                label="Description"
                value={entry.note}
                multiline
                onChange={(value) =>
                  update(
                    "strengths",
                    data.strengths.map((item, i) =>
                      i === index ? { ...item, note: value } : item,
                    ),
                  )
                }
              />
            </EntryCard>
          ))}
          <AddButton
            onClick={() => update("strengths", [...data.strengths, { title: "", note: "" }])}
          >
            Add strength
          </AddButton>
        </div>
      );
  }
}

function WorkSampleFileField({
  attachment,
  onChange,
  onError,
  onReadingChange,
}: {
  attachment: PortfolioData["workSamples"][number]["attachment"];
  onChange: (attachment: PortfolioData["workSamples"][number]["attachment"]) => void;
  onError: (error: string) => void;
  onReadingChange: (reading: boolean) => void;
}) {
  async function handleFileChange(file: File | undefined) {
    if (!file) return;

    onError("");
    onReadingChange(true);
    try {
      onChange(await readWorkSampleFile(file));
    } catch (fileError) {
      onError(fileError instanceof Error ? fileError.message : "Could not read the selected file.");
    } finally {
      onReadingChange(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block space-y-1.5 text-sm font-medium">
        Attach work sample (max 2 MB)
        <input
          type="file"
          accept={workSampleFileAccept}
          aria-label="Attach work sample file"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            void handleFileChange(file);
          }}
          className="sr-only"
        />
        <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
          <FileUp className="size-4" aria-hidden="true" />
          Choose file
        </span>
      </label>
      {attachment.name && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
          <span className="truncate">{attachment.name}</span>
          <button
            type="button"
            aria-label="Remove work sample attachment"
            onClick={() => onChange({ name: "", dataUrl: "" })}
            className="shrink-0 rounded-lg px-2 py-1 text-muted-foreground hover:bg-muted"
          >
            Remove file
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, saveData, loadError } = usePortfolioStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>("profile");
  const [profileDraft, setProfileDraft] = useState(data.profile);
  const [sectionDraft, setSectionDraft] = useState(data);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [readingFiles, setReadingFiles] = useState(0);
  const loggedIn = credentials !== null;

  useEffect(() => {
    setProfileDraft(data.profile);
    setSectionDraft(data);
  }, [data]);

  if (!open) return null;

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your admin username and password.");
      return;
    }

    const submittedCredentials = { username: username.trim(), password };
    try {
      await verifyPortfolioAdmin({ data: submittedCredentials });
      setCredentials(submittedCredentials);
      setError("");
    } catch (signInError) {
      console.error("Could not verify portfolio admin credentials:", signInError);
      setError(
        signInError instanceof Error ? signInError.message : "Could not verify admin credentials.",
      );
    }
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = portfolioSchema.safeParse({ ...data, profile: profileDraft });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Profile data is invalid.");
      return;
    }
    void persist(result.data);
  }

  function saveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = portfolioSchema.safeParse({
      ...data,
      [activeSection]: sectionDraft[activeSection],
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "The section data is invalid.");
      return;
    }
    void persist(result.data);
  }

  async function persist(next: PortfolioData) {
    if (!credentials) {
      setError("Sign in again before saving changes.");
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      await saveData(next, credentials);
      setError("");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (saveError) {
      console.error("Could not save portfolio data to SQLite:", saveError);
      setError(
        saveError instanceof Error ? saveError.message : "Could not save changes to the database.",
      );
    } finally {
      setSaving(false);
    }
  }

  function updateSection<K extends EditableSection>(key: K, value: PortfolioData[K]) {
    setSectionDraft((previous) => ({ ...previous, [key]: value }));
  }

  function onReadingChange(reading: boolean) {
    setReadingFiles((count) => Math.max(0, count + (reading ? 1 : -1)));
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <DialogHeader className="space-y-0 text-left">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Portfolio manager
            </p>
            <DialogTitle className="mt-1 font-display text-2xl font-semibold">
              {loggedIn ? "Edit portfolio" : "Admin sign in"}
            </DialogTitle>
          </DialogHeader>
        </div>

        {!loggedIn ? (
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <p className="rounded-xl border border-powder/70 bg-powder/30 p-3 text-sm text-muted-foreground">
              Sign in with the admin username and password configured on the server.
            </p>
            <Field label="Username" value={username} onChange={setUsername} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:brightness-95"
            >
              Sign in
            </button>
          </form>
        ) : (
          <div className="mt-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Changes are saved to the SQLite database and shown on the public portfolio.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCredentials(null);
                  setUsername("");
                  setPassword("");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <LogOut className="size-4" aria-hidden="true" /> Sign out
              </button>
            </div>

            {loadError && (
              <p
                role="alert"
                className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              >
                {loadError}
              </p>
            )}

            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setActiveSection("profile")}
                aria-pressed={activeSection === "profile"}
                className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${
                  activeSection === "profile"
                    ? "border-primary bg-sage/20 font-semibold"
                    : "border-border hover:bg-muted"
                }`}
              >
                Profile
              </button>
              {editableSections.map(({ key, label }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveSection(key)}
                  aria-pressed={activeSection === key}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${
                    activeSection === key
                      ? "border-primary bg-sage/20 font-semibold"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form
              onSubmit={activeSection === "profile" ? saveProfile : saveSection}
              className="space-y-4"
            >
              {activeSection === "profile" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profileFields.map(({ key, label, multiline }) => (
                      <div key={key} className={multiline ? "sm:col-span-2" : ""}>
                        <Field
                          label={label}
                          value={profileDraft[key]}
                          multiline={multiline ?? false}
                          onChange={(value) =>
                            setProfileDraft((previous) => ({ ...previous, [key]: value }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    {profileImageFields.map(({ key, label }) => (
                      <ProfileImageField
                        key={key}
                        label={label}
                        image={profileDraft[key]}
                        fallbackImage={key === "heroImage" ? "/profile1.jpg" : "/profile.jpg"}
                        onChange={(image) =>
                          setProfileDraft((previous) => ({ ...previous, [key]: image }))
                        }
                        onError={setError}
                        onReadingChange={onReadingChange}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <SectionFields
                  section={activeSection}
                  data={sectionDraft}
                  update={updateSection}
                  onError={setError}
                  onReadingChange={onReadingChange}
                />
              )}
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {saved && (
                <p role="status" className="text-sm font-medium text-primary">
                  Changes saved to the database.
                </p>
              )}
              <button
                type="submit"
                disabled={saving || readingFiles > 0}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="size-4" aria-hidden="true" />
                {saving ? "Saving..." : readingFiles > 0 ? "Reading file..." : "Save changes"}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
