
import { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signInWithEmail, verifyCode } = useAuth();

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const sendCode = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    const res = await signInWithEmail(email);
    if (res?.success) setStep("code");
    else setError(res?.error || "Failed to send verification code");

    setLoading(false);
  };

  const verify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    const res = await verifyCode(email, code);
    if (!res?.success) setError("Invalid verification code");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-6 py-7">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to RealTime Gallery
            </p>
          </div>

          <div className="flex items-center justify-center mb-6 gap-3">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                step === "email"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-600"
              }`}
            >
              1
            </div>
            <div className="w-10 h-[2px] bg-slate-300" />
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                step === "code"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              2
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending code…
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={verify} className="space-y-4">
              <p className="text-sm text-slate-600">
                We sent a 6-digit code to{" "}
                <span className="font-semibold">{email}</span>
              </p>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Verification code
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={6}
                    placeholder="123456"
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                disabled={loading || code.length !== 6}
                className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify & Sign in"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-center text-slate-500 mt-4">
          © {new Date().getFullYear()} RealTime Gallery
        </p>
      </div>
    </div>
  );
};

export default Login;
