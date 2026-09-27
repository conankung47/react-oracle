const ACCOUNTS = [
  { username: "admin", password: "1234", role: "ผู้ดูแลระบบ" },
  { username: "driver", password: "1234", role: "คนขับรถ" },
  { username: "user", password: "1234", role: "นักศึกษา/เจ้าหน้าที่" },
];

function DemoAccounts() {
  return (
    <div className="demo-box">
      <p className="demo-box-title">ข้อมูลทดสอบ</p>
      {ACCOUNTS.map((acc) => (
        <p className="demo-line" key={acc.username}>
          <span className="demo-account">
            {acc.username} <span className="demo-sep">/</span> {acc.password}
          </span>
          <span className="demo-dash"> — </span>
          <span className="demo-role">{acc.role}</span>
        </p>
      ))}
    </div>
  );
}

export default DemoAccounts;