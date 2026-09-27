import { useNavigate } from "react-router-dom";
import Branding from "./login/Branding";
import SystemStats from "./login/SystemStats";
import LoginForm from "./login/LoginForm";
import "./login/LoginPage.css";

const DEMO_ACCOUNTS = {
  admin: {
    password: "1234",
    user: {
      empId: "MUT-ADMIN",
      empname: "ผู้ดูแลระบบ",
      empemail: "admin@mut.ac.th",
      permission: "1111",
      role: "admin",
    },
  },
  driver: {
    password: "1234",
    user: {
      empId: "MUT-DRIVER",
      empname: "คนขับรถ",
      empemail: "driver@mut.ac.th",
      permission: "0100",
      role: "driver",
    },
  },
  user: {
    password: "1234",
    user: {
      empId: "MUT-USER",
      empname: "นักศึกษา/เจ้าหน้าที่",
      empemail: "user@mut.ac.th",
      permission: "0010",
      role: "user",
    },
  },
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    const demo = DEMO_ACCOUNTS[username.toLowerCase()];

    if (demo) {
      if (demo.password === password) {
        await wait(500);
        localStorage.setItem("user", JSON.stringify(demo.user));
        navigate("/");
        return;
      }
      const err = new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      throw err;
    }

    let response;
    try {
      response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empemail: username, emppassword: password }),
      });
    } catch (error) {
      throw new Error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
        cause: error,
      });
    }

    if (!response.ok) {
      throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/");
  };

  return (
    <main className="login-page">
      <section className="left-panel">
        <div className="decor" aria-hidden="true">
          <span className="decor-rect decor-rect-1" />
          <span className="decor-rect decor-rect-2" />
          <span className="decor-rect decor-rect-3" />
          <span className="decor-line decor-line-1" />
          <span className="decor-line decor-line-2" />
          <span className="decor-dot" />
        </div>

        <div className="left-body">
          <Branding />

          <div className="hero">
            <h1 className="hero-title">
              ระบบบริการ
              <br />
              รถรับส่ง MUT
            </h1>
            <p className="hero-desc">
              มหาวิทยาลัยเทคโนโลยีมหานคร
              <br />
              ให้บริการรับส่งนักศึกษาและเจ้าหน้าที่
              <br />
              ในแถบหนองจอก
            </p>
          </div>
        </div>

        <SystemStats />
      </section>

      <section className="right-panel">
        <LoginForm onSubmit={handleLogin} />
      </section>

      <button
        className="help-btn"
        type="button"
        aria-label="ช่วยเหลือ"
        title="ช่วยเหลือ"
      >
        ?
      </button>
    </main>
  );
}

export default Login;