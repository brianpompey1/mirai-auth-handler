// pages/reset-password.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL"; // Replace
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"; // Replace
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { token_hash, type, next } = router.query;
    if (type !== "recovery") {
      router.push("/"); //If the user isn't trying to recover, send them away
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      router.push("/login"); // Redirect to login page after successful password reset
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>
          Password reset successfully! Redirecting...
        </p>
      )}
      {loading && <p>Loading...</p>}
      {!success && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
