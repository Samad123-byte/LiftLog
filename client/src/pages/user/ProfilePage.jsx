import { useEffect, useState } from "react";
import { Camera, Save, ShieldCheck, UserRound } from "lucide-react";
import { userApi } from "../../api/userApi";
import { getErrorMessage } from "../../api/http";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const initial = {
  name: "",
  email: "",
  age: "",
  gender: "",
  height: "",
  currentWeight: "",
  targetWeight: "",
  goal: "",
  activityLevel: "Beginner",
};

export default function ProfilePage() {
  const { user, setUser, refreshUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    userApi
      .getProfile()
      .then(({ data }) => {
        setForm({
          name: data.user.name || "",
          email: data.user.email || "",
          age: data.user.age || "",
          gender: data.user.gender || "",
          height: data.user.height || "",
          currentWeight: data.user.currentWeight || "",
          targetWeight: data.user.targetWeight || "",
          goal: data.user.goal || "",
          activityLevel: data.user.activityLevel || "Beginner",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        height: form.height ? Number(form.height) : undefined,
        currentWeight: form.currentWeight ? Number(form.currentWeight) : undefined,
        targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined,
        goal: form.goal || undefined,
        activityLevel: form.activityLevel || undefined,
      };
      const { data } = await userApi.updateProfile(payload);
      setUser(data.user);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile."));
    } finally {
      setSaving(false);
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    try {
      await userApi.uploadProfileImage(file);
      await refreshUser();
      toast.success("Profile image updated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to upload image."));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  if (loading) return <Loader label="Loading profile" />;

  const isAdmin = user?.role === "admin";

  return (
    <div>
      <PageHeader
        kicker={isAdmin ? "Administrator account" : "Fitness identity"}
        title="Profile"
        copy="Keep your account and training details current."
      />

      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.09] to-transparent p-6 shadow-chrome sm:p-8">
        <div className="absolute right-[-5rem] top-[-7rem] h-72 w-72 rounded-full border border-white/[.05]" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative w-fit">
            <Avatar user={user} size="lg" />
            <label className="focus-ring absolute -bottom-2 -right-2 grid h-11 w-11 cursor-pointer place-items-center rounded-2xl border-4 border-carbon bg-platinum text-void">
              <Camera size={18} />
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={upload} />
            </label>
          </div>
          <div>
            <p className="section-kicker">{isAdmin ? "Admin" : form.activityLevel}</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-.05em]">{user?.name}</h2>
            <p className="mt-1 text-sm text-muted">{user?.email}</p>
            {uploading && <span className="mt-2 block text-xs text-silver">Uploading image…</span>}
          </div>
          <span className="sm:ml-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-3 py-1.5 text-xs capitalize text-silver">
            <ShieldCheck size={15} />
            {user?.role}
          </span>
        </div>
      </section>

      <form onSubmit={submit} className="glass-card mt-6 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <UserRound className="text-silver" size={21} />
          <h2 className="font-display text-xl font-bold">Account details</h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label>
            <span className="label">Name</span>
            <input className="field" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label>
            <span className="label">Email</span>
            <input className="field opacity-65" value={form.email} disabled />
          </label>

          {!isAdmin && (
            <>
              <label>
                <span className="label">Age</span>
                <input className="field" type="number" min="13" max="100" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} />
              </label>
              <label>
                <span className="label">Gender</span>
                <select className="select-field" value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </label>
              <label>
                <span className="label">Height (cm)</span>
                <input className="field" type="number" min="100" max="250" value={form.height} onChange={(event) => setForm({ ...form, height: event.target.value })} />
              </label>
              <label>
                <span className="label">Current weight (kg)</span>
                <input className="field" type="number" min="30" max="350" step="0.1" value={form.currentWeight} onChange={(event) => setForm({ ...form, currentWeight: event.target.value })} />
              </label>
              <label>
                <span className="label">Target weight (kg)</span>
                <input className="field" type="number" min="30" max="350" step="0.1" value={form.targetWeight} onChange={(event) => setForm({ ...form, targetWeight: event.target.value })} />
              </label>
              <label>
                <span className="label">Goal</span>
                <select className="select-field" value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })}>
                  <option value="">Select goal</option>
                  <option>Gain Muscle</option><option>Lose Fat</option><option>Maintain Weight</option>
                </select>
              </label>
              <label>
                <span className="label">Activity level</span>
                <select className="select-field" value={form.activityLevel} onChange={(event) => setForm({ ...form, activityLevel: event.target.value })}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </label>
            </>
          )}
        </div>

        <Button type="submit" loading={saving} className="mt-6 sm:w-auto">
          <Save size={17} />
          Save profile
        </Button>
      </form>
    </div>
  );
}
