import { useState } from "react";
import DemoAccounts from "./DemoAccounts";

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit(trimmedUser, password);
    } catch (err) {
      setError(err?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2 className="login-title">เข้าสู่ระบบ</h2>
      <p className="login-subtitle">กรุณาเลือกบทบาทเพื่อใช้งานระบบ</p>

      <div className="field">
        <label className="field-label" htmlFor="login-username">
          ชื่อผู้ใช้
        </label>
        <input
          id="login-username"
          className="field-input"
          type="text"
          placeholder="admin / driver / user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          disabled={submitting}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="login-password">
          รหัสผ่าน
        </label>
        <input
          id="login-password"
          className="field-input"
          type="password"
          placeholder="1234"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={submitting}
        />
      </div>

      <div className={`form-error${error ? " is-visible" : ""}`} role="alert">
        {error || "\u00a0"}
      </div>

      <button className="login-btn" type="submit" disabled={submitting}>
        {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <DemoAccounts />
    </form>
  );
}

export default LoginForm;