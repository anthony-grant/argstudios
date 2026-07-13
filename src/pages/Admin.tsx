import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CORAL, DARK } from "@/app/data";

type Metric = { value: string; label: string } | null;

type AdminProject = {
  clientId: string;
  slug: string;
  title: string;
  category: string;
  tags: string; // comma-separated in the UI
  protected: boolean;
  hasPassword?: boolean;
  newPassword: string;
  description: string;
  role: string;
  approach: string;
  outcome: string;
  metricValue: string;
  metricLabel: string;
  img: string;
  video: string;
  overlayColor: string;
  overlayOpacity: number;
  backgroundColor: string;
  gallery: string; // newline-separated in the UI
  demoUrl: string;
  demoLabel: string;
  collapsed: boolean; // client-only UI state, not sent to the API
};

type AdminGalleryImage = {
  clientId: string;
  slug: string;
  src: string;
  label: string;
  tags: string; // comma-separated in the UI
  description: string;
  linkUrl: string;
  linkLabel: string;
};

type AdminAdditional = {
  title: string;
  category: string;
  description: string;
  img: string;
  video: string;
  overlayColor: string;
  overlayOpacity: number;
  backgroundColor: string;
  tags: string; // comma-separated in the UI
  images: AdminGalleryImage[];
};

type AdminNavLink = { id: string; label: string };

type AdminHomeHero = {
  introText: string;
  backgroundColor: string;
  navLinks: AdminNavLink[];
  profileImage: string;
  profileTooltip: string;
};

const defaultNavLinks: AdminNavLink[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

let idCounter = 0;
const newClientId = () => `new-${Date.now()}-${idCounter++}`;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fromApi(p: any): AdminProject {
  return {
    clientId: newClientId(),
    slug: p.slug || "",
    title: p.title || "",
    category: p.category || "",
    tags: (p.tags || []).join(", "),
    protected: Boolean(p.protected),
    hasPassword: Boolean(p.hasPassword),
    newPassword: "",
    description: p.description || "",
    role: p.role || "",
    approach: p.approach || "",
    outcome: p.outcome || "",
    metricValue: p.metric?.value || "",
    metricLabel: p.metric?.label || "",
    img: p.img || "",
    video: p.video || "",
    overlayColor: p.overlayColor || "",
    overlayOpacity: typeof p.overlayOpacity === "number" ? p.overlayOpacity : 0,
    backgroundColor: p.backgroundColor || "",
    gallery: (p.gallery || []).join("\n"),
    demoUrl: p.demo?.url || "",
    demoLabel: p.demo?.label || "",
    collapsed: false,
  };
}

function toApi(p: AdminProject) {
  const metric: Metric =
    p.metricValue.trim() ? { value: p.metricValue.trim(), label: p.metricLabel.trim() } : null;
  const demo = p.demoUrl.trim() ? { url: p.demoUrl.trim(), label: p.demoLabel.trim() } : null;
  return {
    slug: p.slug.trim(),
    title: p.title.trim(),
    category: p.category.trim(),
    tags: p.tags.split(",").map((t) => t.trim()).filter(Boolean),
    protected: p.protected,
    newPassword: p.newPassword.trim() || undefined,
    description: p.description.trim(),
    role: p.role.trim(),
    approach: p.approach.trim(),
    outcome: p.outcome.trim(),
    metric,
    img: p.img.trim(),
    video: p.video.trim(),
    overlayColor: p.overlayColor.trim(),
    overlayOpacity: p.overlayOpacity,
    backgroundColor: p.backgroundColor.trim(),
    gallery: p.gallery.split("\n").map((g) => g.trim()).filter(Boolean),
    demo,
  };
}

const labelStyle: React.CSSProperties = {
  color: "rgba(246,242,236,0.4)",
  fontFamily: "'DM Mono', monospace",
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(246,242,236,0.04)",
  border: "1px solid rgba(246,242,236,0.15)",
  color: "#F6F2EC",
  padding: "8px 10px",
  fontFamily: "'Epilogue', sans-serif",
  fontSize: "0.9rem",
  outline: "none",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [additional, setAdditional] = useState<AdminAdditional>({
    title: "",
    category: "",
    description: "",
    img: "",
    video: "",
    overlayColor: "",
    overlayOpacity: 0,
    backgroundColor: "",
    tags: "",
    images: [],
  });
  const [homeHero, setHomeHero] = useState<AdminHomeHero>({
    introText: "",
    backgroundColor: "",
    navLinks: defaultNavLinks,
    profileImage: "",
    profileTooltip: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  async function uploadFile(file: File): Promise<string> {
    const dataUrl = await readAsDataUrl(file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, filename: file.name, dataUrl }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function handleCoverUpload(clientId: string, file: File) {
    const key = `${clientId}:img`;
    setUploadingKey(key);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      updateProject(clientId, { img: url });
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleGalleryUpload(clientId: string, files: FileList) {
    const key = `${clientId}:gallery`;
    setUploadingKey(key);
    setUploadError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadFile(file));
      }
      setProjects((prev) =>
        prev.map((p) =>
          p.clientId === clientId
            ? { ...p, gallery: [p.gallery, ...urls].filter(Boolean).join("\n") }
            : p
        )
      );
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleAdditionalCoverUpload(file: File) {
    const key = "additional:img";
    setUploadingKey(key);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      setAdditional((prev) => ({ ...prev, img: url }));
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleHomeHeroImageUpload(file: File) {
    const key = "homeHero:profileImage";
    setUploadingKey(key);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      setHomeHero((prev) => ({ ...prev, profileImage: url }));
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  function updateNavLink(id: string, label: string) {
    setHomeHero((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((l) => (l.id === id ? { ...l, label } : l)),
    }));
  }

  function toggleCollapsed(clientId: string) {
    setProjects((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, collapsed: !p.collapsed } : p)));
  }

  function collapseAll() {
    setProjects((prev) => prev.map((p) => ({ ...p, collapsed: true })));
  }

  function expandAll() {
    setProjects((prev) => prev.map((p) => ({ ...p, collapsed: false })));
  }

  function updateGalleryImage(clientId: string, patch: Partial<AdminGalleryImage>) {
    setAdditional((prev) => ({
      ...prev,
      images: prev.images.map((img) => (img.clientId === clientId ? { ...img, ...patch } : img)),
    }));
  }

  function addGalleryImage() {
    setAdditional((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { clientId: newClientId(), slug: "", src: "", label: "", tags: "", description: "", linkUrl: "", linkLabel: "" },
      ],
    }));
  }

  function removeGalleryImage(clientId: string) {
    setAdditional((prev) => ({ ...prev, images: prev.images.filter((img) => img.clientId !== clientId) }));
  }

  function moveGalleryImage(clientId: string, dir: -1 | 1) {
    setAdditional((prev) => {
      const i = prev.images.findIndex((img) => img.clientId === clientId);
      const j = i + dir;
      if (i === -1 || j < 0 || j >= prev.images.length) return prev;
      const next = [...prev.images];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...prev, images: next };
    });
  }

  async function handleGalleryImageUpload(clientId: string, file: File) {
    const key = `image:${clientId}`;
    setUploadingKey(key);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      updateGalleryImage(clientId, { src: url });
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  useEffect(() => {
    const cached = sessionStorage.getItem("adminPassword");
    if (cached) {
      setPassword(cached);
      void loadData(cached);
    }
  }, []);

  async function loadData(pw: string) {
    setChecking(true);
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || "Incorrect password");
        sessionStorage.removeItem("adminPassword");
        return;
      }
      const data = await res.json();
      setProjects(data.projects.map(fromApi));
      setAdditional({
        title: data.additionalProjects?.title || "",
        category: data.additionalProjects?.category || "",
        description: data.additionalProjects?.description || "",
        img: data.additionalProjects?.img || "",
        video: data.additionalProjects?.video || "",
        overlayColor: data.additionalProjects?.overlayColor || "",
        overlayOpacity: typeof data.additionalProjects?.overlayOpacity === "number" ? data.additionalProjects.overlayOpacity : 0,
        backgroundColor: data.additionalProjects?.backgroundColor || "",
        tags: (data.additionalProjects?.tags || []).join(", "),
        images: (data.additionalImages || []).map((img: any) => ({
          clientId: newClientId(),
          slug: img.slug || "",
          src: img.src || "",
          label: img.label || "",
          tags: (img.tags || []).join(", "),
          description: img.description || "",
          linkUrl: img.linkUrl || "",
          linkLabel: img.linkLabel || "",
        })),
      });
      setHomeHero({
        introText: data.homeHero?.introText || "",
        backgroundColor: data.homeHero?.backgroundColor || "",
        navLinks: Array.isArray(data.homeHero?.navLinks) && data.homeHero.navLinks.length
          ? data.homeHero.navLinks
          : defaultNavLinks,
        profileImage: data.homeHero?.profileImage || "",
        profileTooltip: data.homeHero?.profileTooltip || "",
      });
      setAuthed(true);
      sessionStorage.setItem("adminPassword", pw);
    } catch {
      setAuthError("Something went wrong. Try again.");
    } finally {
      setChecking(false);
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("adminPassword");
    setAuthed(false);
    setPassword("");
    setProjects([]);
    setAuthError("");
    setSaveError("");
    setSaveMessage("");
  }

  function updateProject(clientId: string, patch: Partial<AdminProject>) {
    setProjects((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, ...patch } : p)));
  }

  function addProject() {
    setProjects((prev) => [
      ...prev,
      fromApi({ slug: "", title: "New Project", tags: [] }),
    ]);
  }

  function removeProject(clientId: string) {
    setProjects((prev) => prev.filter((p) => p.clientId !== clientId));
  }

  function moveProject(clientId: string, dir: -1 | 1) {
    setProjects((prev) => {
      const i = prev.findIndex((p) => p.clientId === clientId);
      const j = i + dir;
      if (i === -1 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    // Auto-slug anything left blank, and validate before sending.
    const withSlugs = projects.map((p) => ({
      ...p,
      slug: p.slug.trim() || slugify(p.title),
    }));
    const slugs = withSlugs.map((p) => p.slug);
    const dupe = slugs.find((s, i) => slugs.indexOf(s) !== i);
    if (dupe) {
      setSaveError(`Two projects share the slug "${dupe}" — give them unique slugs.`);
      setSaving(false);
      return;
    }
    const missingPassword = withSlugs.find((p) => p.protected && !p.hasPassword && !p.newPassword.trim());
    if (missingPassword) {
      setSaveError(`"${missingPassword.title}" is marked protected but has no password set.`);
      setSaving(false);
      return;
    }

    const additionalProjects = {
      title: additional.title.trim(),
      category: additional.category.trim(),
      description: additional.description.trim(),
      img: additional.img.trim(),
      video: additional.video.trim(),
      overlayColor: additional.overlayColor.trim(),
      overlayOpacity: additional.overlayOpacity,
      backgroundColor: additional.backgroundColor.trim(),
      tags: additional.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const additionalImagesPayload = additional.images
      .map((img) => ({
        slug: img.slug.trim(),
        src: img.src.trim(),
        label: img.label.trim(),
        tags: img.tags.split(",").map((t) => t.trim()).filter(Boolean),
        description: img.description.trim(),
        linkUrl: img.linkUrl.trim(),
        linkLabel: img.linkLabel.trim(),
      }))
      .filter((img) => img.src);

    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          projects: withSlugs.map(toApi),
          additionalProjects,
          additionalImages: additionalImagesPayload,
          homeHero,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          setSaveError('Incorrect password — if the admin password changed since you logged in, click "Log out" above and log back in with the current one.');
        } else {
          setSaveError(data.error || "Save failed");
        }
        return;
      }
      setSaveMessage("Saved. Vercel is rebuilding — changes go live in about a minute.");
      setProjects(withSlugs.map((p) => ({ ...p, newPassword: "", hasPassword: p.protected || p.hasPassword })));
    } catch {
      setSaveError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: DARK }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void loadData(password);
          }}
          className="w-full max-w-sm"
        >
          <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(246,242,236,0.4)" }}>
            Admin
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="flex-1 bg-transparent border px-3 py-2 font-['Epilogue',sans-serif] text-white outline-none"
              style={{ borderColor: "rgba(246,242,236,0.2)" }}
            />
            <button
              type="submit"
              disabled={checking}
              className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-4 py-2 border transition-colors disabled:opacity-50"
              style={{ color: DARK, backgroundColor: CORAL, borderColor: CORAL }}
            >
              {checking ? "Checking…" : "Enter"}
            </button>
          </div>
          {authError && (
            <p className="font-['DM_Mono',monospace] text-xs mt-3" style={{ color: CORAL }}>
              {authError}
            </p>
          )}
          <Link to="/" className="block mt-8 font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60 transition-opacity" style={{ color: "rgba(246,242,236,0.3)" }}>
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-10 py-10" style={{ backgroundColor: DARK, fontFamily: "'Epilogue', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-3xl mb-1">Admin</h1>
            <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.4)" }}>
              Edit case studies
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleLogout}
              className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
              style={{ color: "rgba(246,242,236,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Log out
            </button>
            <Link to="/" className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60 transition-opacity" style={{ color: "rgba(246,242,236,0.4)" }}>
              ← Site
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="font-['DM_Mono',monospace] text-xs" style={{ color: "rgba(246,242,236,0.4)" }}>Loading…</p>
        ) : (
          <>
            {uploadError && (
              <p className="font-['DM_Mono',monospace] text-xs mb-6" style={{ color: CORAL }}>{uploadError}</p>
            )}
            <div className="flex items-center justify-end gap-4 mb-4">
              <button type="button" onClick={expandAll} className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60" style={{ color: "rgba(246,242,236,0.5)" }}>
                Expand all
              </button>
              <button type="button" onClick={collapseAll} className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60" style={{ color: "rgba(246,242,236,0.5)" }}>
                Collapse all
              </button>
            </div>

            <div className="space-y-6 mb-10">
              {projects.map((p, i) => (
                <div key={p.clientId} className="border p-5" style={{ borderColor: "rgba(246,242,236,0.12)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(p.clientId)}
                      className="flex items-center gap-3"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <span className="font-['DM_Mono',monospace] text-xs tracking-widest" style={{ color: CORAL }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.5)" }}>
                        {p.title || "Untitled"}
                      </span>
                      <span className="font-['DM_Mono',monospace] text-xs" style={{ color: "rgba(246,242,236,0.4)" }}>
                        {p.collapsed ? "▸" : "▾"}
                      </span>
                    </button>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => moveProject(p.clientId, -1)} disabled={i === 0} className="font-['DM_Mono',monospace] text-xs disabled:opacity-20" style={{ color: "rgba(246,242,236,0.5)" }}>↑</button>
                      <button type="button" onClick={() => moveProject(p.clientId, 1)} disabled={i === projects.length - 1} className="font-['DM_Mono',monospace] text-xs disabled:opacity-20" style={{ color: "rgba(246,242,236,0.5)" }}>↓</button>
                      <button type="button" onClick={() => removeProject(p.clientId)} className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: CORAL }}>Delete</button>
                    </div>
                  </div>

                  {!p.collapsed && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Field label="Title">
                          <input style={inputStyle} value={p.title} onChange={(e) => updateProject(p.clientId, { title: e.target.value })} />
                        </Field>
                        <Field label="Slug (used in the URL)">
                          <input style={inputStyle} value={p.slug} placeholder={slugify(p.title)} onChange={(e) => updateProject(p.clientId, { slug: e.target.value })} />
                        </Field>
                        <Field label="Category">
                          <input style={inputStyle} value={p.category} onChange={(e) => updateProject(p.clientId, { category: e.target.value })} />
                        </Field>
                        <Field label="Tags (comma-separated)">
                          <input style={inputStyle} value={p.tags} onChange={(e) => updateProject(p.clientId, { tags: e.target.value })} />
                        </Field>
                      </div>

                      <Field label="Description (hero text)">
                        <textarea style={{ ...inputStyle, minHeight: 60 }} value={p.description} onChange={(e) => updateProject(p.clientId, { description: e.target.value })} />
                      </Field>
                      <Field label="Role">
                        <input style={inputStyle} value={p.role} onChange={(e) => updateProject(p.clientId, { role: e.target.value })} />
                      </Field>
                      <Field label="Approach">
                        <textarea style={{ ...inputStyle, minHeight: 60 }} value={p.approach} onChange={(e) => updateProject(p.clientId, { approach: e.target.value })} />
                      </Field>
                      <Field label="Outcome">
                        <textarea style={{ ...inputStyle, minHeight: 60 }} value={p.outcome} onChange={(e) => updateProject(p.clientId, { outcome: e.target.value })} />
                      </Field>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Field label="Metric value (optional)">
                          <input style={inputStyle} placeholder="e.g. 40%" value={p.metricValue} onChange={(e) => updateProject(p.clientId, { metricValue: e.target.value })} />
                        </Field>
                        <Field label="Metric label">
                          <input style={inputStyle} placeholder="e.g. drop in abandonment" value={p.metricLabel} onChange={(e) => updateProject(p.clientId, { metricLabel: e.target.value })} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Field label="Demo link URL (optional)">
                          <input style={inputStyle} placeholder="e.g. /work/branch/credit-score" value={p.demoUrl} onChange={(e) => updateProject(p.clientId, { demoUrl: e.target.value })} />
                        </Field>
                        <Field label="Demo link label">
                          <input style={inputStyle} placeholder="e.g. Try the interactive prototype" value={p.demoLabel} onChange={(e) => updateProject(p.clientId, { demoLabel: e.target.value })} />
                        </Field>
                      </div>

                      <Field label="Cover image">
                        <div className="flex gap-2 items-start">
                          <input style={inputStyle} placeholder="Image URL, or upload one" value={p.img} onChange={(e) => updateProject(p.clientId, { img: e.target.value })} />
                          <label
                            className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-3 py-2 border cursor-pointer whitespace-nowrap"
                            style={{ color: "rgba(246,242,236,0.7)", borderColor: "rgba(246,242,236,0.2)" }}
                          >
                            {uploadingKey === `${p.clientId}:img` ? "Uploading…" : "Upload"}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                              className="hidden"
                              disabled={uploadingKey === `${p.clientId}:img`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void handleCoverUpload(p.clientId, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                        {p.img && (
                          <img src={p.img} alt="" className="mt-2 h-20 object-cover" style={{ background: "#1A1A18" }} />
                        )}
                      </Field>

                      <Field label="Background video (optional — direct file URL, or a YouTube/Vimeo link)">
                        <input style={inputStyle} placeholder="e.g. https://youtube.com/watch?v=... or a .mp4 URL" value={p.video} onChange={(e) => updateProject(p.clientId, { video: e.target.value })} />
                      </Field>
                      <p className="font-['DM_Mono',monospace] text-xs mb-3" style={{ color: "rgba(246,242,236,0.35)" }}>
                        Intro background priority: video, then cover image, then the solid background color below. If none are set, the page falls back to the default dark background.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                        <Field label="Overlay color (optional)">
                          <input style={{ ...inputStyle, height: 38 }} type="color" value={p.overlayColor || "#000000"} onChange={(e) => updateProject(p.clientId, { overlayColor: e.target.value })} />
                        </Field>
                        <Field label="Overlay opacity (0–1)">
                          <input style={inputStyle} type="number" min={0} max={1} step={0.05} value={p.overlayOpacity} onChange={(e) => updateProject(p.clientId, { overlayOpacity: Number(e.target.value) || 0 })} />
                        </Field>
                        <Field label="Solid background color">
                          <input style={{ ...inputStyle, height: 38 }} type="color" value={p.backgroundColor || "#0C0C0B"} onChange={(e) => updateProject(p.clientId, { backgroundColor: e.target.value })} />
                        </Field>
                      </div>

                      <Field label="Gallery images (one URL per line, optional)">
                        <textarea style={{ ...inputStyle, minHeight: 60 }} value={p.gallery} onChange={(e) => updateProject(p.clientId, { gallery: e.target.value })} />
                        <label
                          className="inline-block mt-2 font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-3 py-2 border cursor-pointer"
                          style={{ color: "rgba(246,242,236,0.7)", borderColor: "rgba(246,242,236,0.2)" }}
                        >
                          {uploadingKey === `${p.clientId}:gallery` ? "Uploading…" : "Upload images"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                            multiple
                            className="hidden"
                            disabled={uploadingKey === `${p.clientId}:gallery`}
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length) void handleGalleryUpload(p.clientId, files);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </Field>

                      <div className="flex items-center gap-2 mb-3 mt-2">
                        <input
                          type="checkbox"
                          id={`protected-${p.clientId}`}
                          checked={p.protected}
                          onChange={(e) => updateProject(p.clientId, { protected: e.target.checked })}
                        />
                        <label htmlFor={`protected-${p.clientId}`} style={{ ...labelStyle, marginBottom: 0 }}>
                          Password protected
                        </label>
                      </div>
                      {p.protected && (
                        <Field label={p.hasPassword ? "New password (leave blank to keep current)" : "Password"}>
                          <input style={inputStyle} type="text" value={p.newPassword} onChange={(e) => updateProject(p.clientId, { newPassword: e.target.value })} />
                        </Field>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addProject}
              className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-4 py-2 border mb-10"
              style={{ color: "rgba(246,242,236,0.7)", borderColor: "rgba(246,242,236,0.2)" }}
            >
              + Add project
            </button>

            <div className="mb-6 pt-10" style={{ borderTop: "1px solid rgba(246,242,236,0.1)" }}>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-2xl mb-1">Additional Projects</h2>
              <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(246,242,236,0.4)" }}>
                The 7th list item and its tagged image gallery
              </p>

              <div className="border p-5 mb-6" style={{ borderColor: "rgba(246,242,236,0.12)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Field label="Title">
                    <input style={inputStyle} value={additional.title} onChange={(e) => setAdditional((prev) => ({ ...prev, title: e.target.value }))} />
                  </Field>
                  <Field label="Category">
                    <input style={inputStyle} value={additional.category} onChange={(e) => setAdditional((prev) => ({ ...prev, category: e.target.value }))} />
                  </Field>
                </div>
                <Field label="Description (hero text)">
                  <textarea style={{ ...inputStyle, minHeight: 60 }} value={additional.description} onChange={(e) => setAdditional((prev) => ({ ...prev, description: e.target.value }))} />
                </Field>
                <Field label="Tags (comma-separated)">
                  <input style={inputStyle} value={additional.tags} onChange={(e) => setAdditional((prev) => ({ ...prev, tags: e.target.value }))} />
                </Field>
                <Field label="Cover image">
                  <div className="flex gap-2 items-start">
                    <input style={inputStyle} placeholder="Image URL, or upload one" value={additional.img} onChange={(e) => setAdditional((prev) => ({ ...prev, img: e.target.value }))} />
                    <label
                      className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-3 py-2 border cursor-pointer whitespace-nowrap"
                      style={{ color: "rgba(246,242,236,0.7)", borderColor: "rgba(246,242,236,0.2)" }}
                    >
                      {uploadingKey === "additional:img" ? "Uploading…" : "Upload"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        disabled={uploadingKey === "additional:img"}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleAdditionalCoverUpload(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {additional.img && (
                    <img src={additional.img} alt="" className="mt-2 h-20 object-cover" style={{ background: "#1A1A18" }} />
                  )}
                </Field>

                <Field label="Background video (optional — direct file URL, or a YouTube/Vimeo link)">
                  <input style={inputStyle} placeholder="e.g. https://youtube.com/watch?v=... or a .mp4 URL" value={additional.video} onChange={(e) => setAdditional((prev) => ({ ...prev, video: e.target.value }))} />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                  <Field label="Overlay color (optional)">
                    <input style={{ ...inputStyle, height: 38 }} type="color" value={additional.overlayColor || "#000000"} onChange={(e) => setAdditional((prev) => ({ ...prev, overlayColor: e.target.value }))} />
                  </Field>
                  <Field label="Overlay opacity (0–1)">
                    <input style={inputStyle} type="number" min={0} max={1} step={0.05} value={additional.overlayOpacity} onChange={(e) => setAdditional((prev) => ({ ...prev, overlayOpacity: Number(e.target.value) || 0 }))} />
                  </Field>
                  <Field label="Solid background color">
                    <input style={{ ...inputStyle, height: 38 }} type="color" value={additional.backgroundColor || "#0C0C0B"} onChange={(e) => setAdditional((prev) => ({ ...prev, backgroundColor: e.target.value }))} />
                  </Field>
                </div>
              </div>

              <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(246,242,236,0.4)" }}>
                Gallery images ({additional.images.length})
              </p>

              <div className="space-y-4 mb-6">
                {additional.images.map((img, i) => (
                  <div key={img.clientId} className="border p-4" style={{ borderColor: "rgba(246,242,236,0.12)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-['DM_Mono',monospace] text-xs" style={{ color: "rgba(246,242,236,0.4)" }}>Image {i + 1}</span>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => moveGalleryImage(img.clientId, -1)} disabled={i === 0} className="font-['DM_Mono',monospace] text-xs disabled:opacity-20" style={{ color: "rgba(246,242,236,0.5)" }}>↑</button>
                        <button type="button" onClick={() => moveGalleryImage(img.clientId, 1)} disabled={i === additional.images.length - 1} className="font-['DM_Mono',monospace] text-xs disabled:opacity-20" style={{ color: "rgba(246,242,236,0.5)" }}>↓</button>
                        <button type="button" onClick={() => removeGalleryImage(img.clientId)} className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: CORAL }}>Delete</button>
                      </div>
                    </div>

                    <Field label="Image">
                      <div className="flex gap-2 items-start">
                        <input style={inputStyle} placeholder="Image URL, or upload one" value={img.src} onChange={(e) => updateGalleryImage(img.clientId, { src: e.target.value })} />
                        <label
                          className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-3 py-2 border cursor-pointer whitespace-nowrap"
                          style={{ color: "rgba(246,242,236,0.7)", borderColor: "rgba(246,242,236,0.2)" }}
                        >
                          {uploadingKey === `image:${img.clientId}` ? "Uploading…" : "Upload"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                            className="hidden"
                            disabled={uploadingKey === `image:${img.clientId}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handleGalleryImageUpload(img.clientId, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                      {img.src && (
                        <img src={img.src} alt="" className="mt-2 h-16 object-cover" style={{ background: "#1A1A18" }} />
                      )}
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <Field label="Label">
                        <input style={inputStyle} value={img.label} onChange={(e) => updateGalleryImage(img.clientId, { label: e.target.value })} />
                      </Field>
                      <Field label="Tags (comma-separated — powers the filter toggles)">
                        <input style={inputStyle} value={img.tags} onChange={(e) => updateGalleryImage(img.clientId, { tags: e.target.value })} />
                      </Field>
                    </div>

                    <Field label="Slug (used in the page URL — auto-generated from the label if left blank)">
                      <input style={inputStyle} placeholder={slugify(img.label)} value={img.slug} onChange={(e) => updateGalleryImage(img.clientId, { slug: e.target.value })} />
                    </Field>

                    <Field label="Description (optional — if set, this image gets a clickable button + its own page. Supports [link text](url) links)">
                      <textarea style={{ ...inputStyle, minHeight: 60 }} value={img.description} onChange={(e) => updateGalleryImage(img.clientId, { description: e.target.value })} />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <Field label="External link URL (optional button on the image's page)">
                        <input style={inputStyle} placeholder="https://..." value={img.linkUrl} onChange={(e) => updateGalleryImage(img.clientId, { linkUrl: e.target.value })} />
                      </Field>
                      <Field label="External link label">
                        <input style={inputStyle} placeholder="e.g. View project" value={img.linkLabel} onChange={(e) => updateGalleryImage(img.clientId, { linkLabel: e.target.value })} />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addGalleryImage}
                className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-4 py-2 border"
                style={{ color: "rgba(246,242,236,0.7)", borderColor: "rgba(246,242,236,0.2)" }}
              >
                + Add image
              </button>
            </div>

            <div className="mb-10 pt-10" style={{ borderTop: "1px solid rgba(246,242,236,0.1)" }}>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-2xl mb-1">Homepage</h2>
              <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(246,242,236,0.4)" }}>
                Hero text, background, navigation and profile photo
              </p>

              <div className="border p-5" style={{ borderColor: "rgba(246,242,236,0.12)" }}>
                <Field label="Hero intro text">
                  <textarea
                    style={{ ...inputStyle, minHeight: 80 }}
                    value={homeHero.introText}
                    onChange={(e) => setHomeHero((prev) => ({ ...prev, introText: e.target.value }))}
                  />
                </Field>

                <Field label="Hero background color">
                  <input
                    style={{ ...inputStyle, height: 38, maxWidth: 160 }}
                    type="color"
                    value={homeHero.backgroundColor || "#FF5A5F"}
                    onChange={(e) => setHomeHero((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                  />
                </Field>

                <p style={labelStyle}>Navigation labels</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-3">
                  {homeHero.navLinks.map((link) => (
                    <Field key={link.id} label={link.id}>
                      <input style={inputStyle} value={link.label} onChange={(e) => updateNavLink(link.id, e.target.value)} />
                    </Field>
                  ))}
                </div>

                <Field label="Profile photo">
                  <div className="flex gap-2 items-start">
                    <input
                      style={inputStyle}
                      placeholder="Image URL, or upload one"
                      value={homeHero.profileImage}
                      onChange={(e) => setHomeHero((prev) => ({ ...prev, profileImage: e.target.value }))}
                    />
                    <label
                      className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-3 py-2 border cursor-pointer whitespace-nowrap"
                      style={{ color: "rgba(246,242,236,0.7)", borderColor: "rgba(246,242,236,0.2)" }}
                    >
                      {uploadingKey === "homeHero:profileImage" ? "Uploading…" : "Upload"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        disabled={uploadingKey === "homeHero:profileImage"}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleHomeHeroImageUpload(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {homeHero.profileImage && (
                    <img src={homeHero.profileImage} alt="" className="mt-2 h-20 w-20 object-cover rounded-full" style={{ background: "#1A1A18" }} />
                  )}
                </Field>

                <Field label="Profile photo tooltip (shown on tap/hover, disappears after 3 seconds — supports [link text](url) links)">
                  <textarea
                    style={{ ...inputStyle, minHeight: 60 }}
                    value={homeHero.profileTooltip}
                    onChange={(e) => setHomeHero((prev) => ({ ...prev, profileTooltip: e.target.value }))}
                  />
                </Field>
              </div>
            </div>

            <div className="sticky bottom-0 py-4" style={{ backgroundColor: DARK, borderTop: "1px solid rgba(246,242,236,0.1)" }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-5 py-2.5 border transition-colors disabled:opacity-50"
                style={{ color: DARK, backgroundColor: CORAL, borderColor: CORAL }}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              {saveMessage && (
                <p className="font-['DM_Mono',monospace] text-xs mt-3" style={{ color: "rgba(246,242,236,0.6)" }}>{saveMessage}</p>
              )}
              {saveError && (
                <p className="font-['DM_Mono',monospace] text-xs mt-3" style={{ color: CORAL }}>{saveError}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
