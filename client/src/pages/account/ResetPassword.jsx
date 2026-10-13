import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900">Choose a new password</h1>
      <p className="mt-2 text-sm text-gray-600">Use at least eight characters with upper- and lowercase letters, a number and a symbol.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          New password
          <input type="password" autoComplete="new-password" minLength="8" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Confirm new password
          <input type="password" autoComplete="new-password" minLength="8" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? "Updating…" : "Reset password"}
        </button>
      </form>
      <Link to="/login" className="mt-4 inline-block text-sm font-medium text-green-700">Return to sign in</Link>
    </main>
  );
}
