
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "../components";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const Register = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const fullName = formData.get("fullName").trim();
      const nameParts = fullName.split(/\s+/);

      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const email = formData.get("email").trim();
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (!lastName) {
        throw new Error("Please enter your first and last name.");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }

      if (password !== confirmPassword) {
        throw new Error("Your passwords do not match.");
      }

      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F7FB] flex">
      {/* Left branding panel */}
      <aside className="hidden lg:flex lg:w-1/2 bg-[#101329] text-white relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-violet-400/10" />
        <div className="absolute top-32 right-12 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full border border-indigo-400/10" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <span className="text-2xl font-black">{"</>"}</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Youth<span className="text-violet-400">Forge</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-300">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Learn. Build. Innovate.
          </span>

          <h1 className="mt-8 text-4xl xl:text-6xl font-bold leading-tight tracking-tight">
            Your ideas.
            <span className="block text-violet-400">Your skills.</span>
            Your future.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300 max-w-md">
            Learn to code, build real-world projects, and connect with a
            community of young people shaping the future through technology.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-2xl font-bold text-violet-400">01</div>
              <p className="mt-2 text-sm text-slate-300">
                Learn practical skills
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-2xl font-bold text-violet-400">02</div>
              <p className="mt-2 text-sm text-slate-300">
                Build real projects
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          Empowering the next generation of builders.
        </p>
      </aside>

      {/* Registration panel */}
      <section className="flex-1 flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <Link
            to="/"
            className="lg:hidden flex items-center justify-center gap-3 mb-10"
          >
            <div className="w-11 h-11 rounded-xl bg-[#101329] text-violet-400 flex items-center justify-center text-xl font-black">
              {"</>"}
            </div>
            <span className="text-2xl font-bold text-[#101329]">
              Youth<span className="text-violet-600">Forge</span>
            </span>
          </Link>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_24px_70px_-25px_rgba(16,19,41,0.18)] p-7 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                Get started for free
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#101329]">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Start your journey into technology. Learn new skills,
                collaborate, and turn your ideas into reality.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-bold text-[#101329]">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tell us a little about yourself.
                </p>
              </div>

              <FormInput
                type="text"
                label="Full name"
                name="fullName"
              />

              <FormInput
                type="text"
                label="Username"
                name="username"
              />

              <FormInput
                type="email"
                label="Email address"
                name="email"
              />

              <FormInput
                type="text"
                label="Country of origin"
                name="countryOfOrigin"
              />

              <FormInput
                type="text"
                label="Country of residence"
                name="countryOfResidence"
              />

              <FormInput
                type="tel"
                label="Phone number"
                name="phoneNumber"
              />

              <FormInput
                type="text"
                label="Residential address"
                name="address"
              />

              {/* Account Security */}
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#101329]">
                  Account Security
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Secure your YouthForge account.
                </p>
              </div>

              <FormInput
                type="password"
                label="Password"
                name="password"
              />

              <FormInput
                type="password"
                label="Confirm password"
                name="confirmPassword"
              />

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full bg-violet-600 hover:bg-violet-700 text-white border-none rounded-xl normal-case shadow-lg shadow-violet-600/20 disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create free account"}
                </button>
              </div>
            </form>

            <div className="divider my-6 text-slate-300 text-xs">
              ALREADY A MEMBER?
            </div>

            <p className="text-center text-sm text-slate-500">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 font-bold text-violet-600 hover:text-violet-800 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Built for the next generation of innovators.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
