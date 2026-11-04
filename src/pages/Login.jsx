
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store authentication details
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect after successful login
      navigate("/");

    } catch (err) {
      setError(err.message || "Something went wrong");
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
            Welcome back
          </span>

          <h1 className="mt-8 text-4xl xl:text-6xl font-bold leading-tight tracking-tight">
            Keep building.
            <span className="block text-violet-400">
              Keep growing.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300 max-w-md">
            Your next idea could become something extraordinary.
            Sign in and continue learning, creating, and building
            with YouthForge.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Continue learning at your own pace",
              "Work on practical coding projects",
              "Connect with fellow young innovators",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center text-violet-400 text-sm">
                  ✓
                </div>
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          Empowering the next generation of builders.
        </p>
      </aside>

      {/* Login panel */}
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
                Your workspace awaits
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#101329]">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to pick up where you left off and keep
                moving toward your goals.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">

              <div>
                <label className="block text-sm font-semibold text-[#101329] mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input input-bordered w-full rounded-xl bg-gray"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#101329] mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="input input-bordered w-full rounded-xl bg-gray"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full bg-violet-600 hover:bg-violet-700 text-white border-none rounded-xl normal-case shadow-lg shadow-violet-600/20 disabled:opacity-60"
                >
                  {loading ? "Signing you in..." : "Sign in to YouthForge"}
                </button>
              </div>

              <button
                type="button"
                className="btn w-full bg-white hover:bg-violet-50 text-[#101329] border border-slate-200 hover:border-violet-300 rounded-xl normal-case shadow-none"
              >
                Continue as guest
              </button>

            </form>

            <div className="divider my-6 text-slate-300 text-xs">
              NEW TO YOUTHFORGE?
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account yet?
              <Link
                to="/register"
                className="ml-2 font-bold text-violet-600 hover:text-violet-800 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Learn. Build. Innovate.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
