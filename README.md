# MUT Shuttle Bus — ระบบบริการรถรับส่ง MUT

Web application สำหรับจัดการข้อมูล **พนักงาน (Employee)**, **ลูกค้า (Customer)** และ **สินค้า/บริการ (Product)**
พร้อมระบบล็อกอินและระบบสิทธิ์ตามเมนู (Permission)

| | |
| --- | --- |
| **Frontend** | React 19 + Vite 8 + React Router 7 + Bootstrap 5 + SweetAlert2 + Axios |
| **Backend** | Node.js + Express 5 + oracledb 7 + Multer + bcryptjs |
| **Database** | Oracle Database (Thin mode — ไม่ต้องติดตั้ง Oracle Instant Client) |
| **โครงสร้าง** | Monorepo แบบ 2 โฟลเดอร์: `client/` (หน้าเว็บ) และ `server/` (REST API) |

---

## 1. โครงสร้างโปรเจกต์

```
react-oracle-new/
├── README.md          ← ไฟล์นี้
├── client/            ── Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── main.jsx            ตั้งค่า Router และ ProtectedRoute
│   │   ├── App.css             CSS หลักของหน้า Table / Form
│   │   ├── Navbar.jsx / .css   เมนูบาร์ + การซ่อนเมนูตาม Permission
│   │   ├── ProtectedRoute.jsx  ตัวกันเข้าหน้าที่ไม่มีสิทธิ์
│   │   ├── Home.jsx            หน้าแรก
│   │   ├── Login.jsx           หน้า Login (2 panel)
│   │   ├── Employee.jsx        CRUD พนักงาน
│   │   ├── Customer.jsx        CRUD ลูกค้า
│   │   ├── Product.jsx         CRUD สินค้า (อัปโหลดรูป)
│   │   ├── login/              Branding, LoginForm, DemoAccounts, SystemStats
│   │   └── assets/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── server/            ── Backend (Express + Oracle)
    ├── server.js             ทุก API Route
    ├── db.js                 ตัวช่วยเชื่อมต่อ Oracle
    ├── .env                  ⚠️ ถูก .gitignore ไว้ (ต้องสร้างเอง)
    ├── img/                  โฟลเดอร์เก็บรูปสินค้า (สร้างอัตโนมัติ)
    └── package.json
```

---

## 2. สิ่งที่ต้องเตรียมก่อนใช้งาน (Prerequisites)

| สิ่งที่ต้องมี | เวอร์ชัน / หมายเหตุ |
| --- | --- |
| **Node.js** | 18 ขึ้นไป (แนะนำ 20+) |
| **npm** | มาพร้อม Node.js |
| **Oracle Database** | Oracle Database 12c+ (หรือ Oracle XE ในเครื่อง) |
| **Oracle Instant Client** | **ไม่จำเป็น** เพราะ `oracledb` v7 ใช้ Thin mode เป็นค่าเริ่มต้น |

> Thin mode รองรับการเชื่อมต่อแบบ TCP ตรง ๆ ได้ เหมาะกับงาน CRUD ทั่วไป

---

## 3. ติดตั้งและรันโปรแกรม

ต้องเปิด **2 Terminal** เพราะมีทั้ง Server และ Client

### Terminal 1 — Backend (Server)

```bash
cd server
npm install
npm start            # = nodemon server.js
```

Server จะรันที่ **http://localhost:5000** (หรือค่า `PORT` ใน `.env`)

### Terminal 2 — Frontend (Client)

```bash
cd client
npm install
npm run dev
```

Client จะรันที่ **http://localhost:5173** เปิดเบราว์เซอร์ที่ลิงก์นี้

### ⚠️ หมายเหตุสำคัญเรื่อง URL

Client มีการ **hardcode URL ของ API ไว้ในไฟล์** และยังไม่ได้ตั้ง proxy ใน `vite.config.js` ดังนั้น:

- ถ้าเปลี่ยน `PORT` ของ server ต้องแก้ URL ให้ตรงกันด้วย
- ไฟล์ที่ต้องแก้:
  - `client/src/Employee.jsx` → `http://localhost:5000/api/mutemp`
  - `client/src/Customer.jsx` → `http://localhost:5000/api/mutcus`
  - `client/src/Product.jsx` → `http://localhost:5000/api/mutproduct` และ `http://localhost:5000/img/`
  - `client/src/Login.jsx` → `http://localhost:5000/api/login`

> ถ้าจะ deploy ขึ้น server จริง แนะนำให้ย้าย URL ไปไว้ใน `.env` ของ client (เช่น `VITE_API_URL`) แล้วใช้ `import.meta.env` อ่านค่าเดียวทั้งโปรเจกต์

---

## 4. ตั้งค่าไฟล์ `.env` (สำคัญมาก)

ไฟล์ `server/.env` ถูก `.gitignore` ไว้ **ต้องสร้างเอง** ในเครื่อง ใช้ข้อมูลการเชื่อมต่อ Oracle ของตัวเอง

```env
# ===== Database =====
DB_USER=your_oracle_user
DB_PASSWORD=your_oracle_password
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=XEPDB1

# ===== Server =====
PORT=5000
```

| ตัวแปร | ความหมาย | ตัวอย่าง |
| --- | --- | --- |
| `DB_USER` | ชื่อผู้ใช้ (schema) ของ Oracle | `MUT` |
| `DB_PASSWORD` | รหัสผ่านของผู้ใช้ | `1234` |
| `DB_HOST` | โฮสต์ของ Oracle | `localhost` |
| `DB_PORT` | พอร์ต listener ของ Oracle | `1521` |
| `DB_SERVICE` | ชื่อ service name | `ORCL` หรือ `XEPDB1` |
| `PORT` | พอร์ตของ Express server | `5000` |

> ค่า `connectString` จะถูกประกอบเป็น `DB_HOST:DB_PORT/DB_SERVICE` โดยอัตโนมัติ (ดูที่ `server/server.js`)

---

## 5. โครงสร้างฐานข้อมูล (Oracle)

ตารางที่โปรแกรมใช้งานมี **3 ตาราง** (ชื่อ column ต้องตรงตามนี้)

### 5.1 `MUTEMP` — พนักงาน / ผู้ใช้งานระบบ

| Column | ชนิดข้อมูล | หมายเหตุ |
| --- | --- | --- |
| `EMPID` | `VARCHAR2(20)` | Primary Key — รูปแบบ `EMP` + ปี พ.ศ. 2 หลัก + running number 3 หลัก เช่น `EMP69001` |
| `EMPNAME` | `VARCHAR2(100)` | ชื่อ-นามสกุล |
| `EMPADDRESS` | `VARCHAR2(200)` | ที่อยู่ |
| `EMPEMAIL` | `VARCHAR2(100)` | ใช้เป็น **ชื่อผู้ใช้** ตอน Login |
| `EMPPASSWORD` | `VARCHAR2(200)` | **เก็บเป็น bcrypt hash** เท่านั้น |
| `SALARY` | `NUMBER(12,2)` | เงินเดือน |
| `PERMISSION` | `CHAR(4)` | สิทธิ์ 4 หลัก ดูหัวข้อถัดไป |

### 5.2 `MUTCUSTOMER` — ลูกค้า

| Column | ชนิดข้อมูล | หมายเหตุ |
| --- | --- | --- |
| `CUSID` | `VARCHAR2(20)` | Primary Key |
| `CUSNAME` | `VARCHAR2(100)` | ชื่อลูกค้า |
| `CUSADDRESS` | `VARCHAR2(200)` | ที่อยู่ |
| `CUSTEL` | `VARCHAR2(30)` | เบอร์โทรศัพท์ |
| `CUSEMAIL` | `VARCHAR2(100)` | อีเมล |

> ⚠️ API ของลูกค้าใช้ `SELECT *` แล้วอ่านค่าตาม **ลำดับ column** (index 0–4) ดังนั้น **ต้องสร้าง column ตามลำดับนี้เป๊ะ** ไม่งั้นข้อมูลจะผิดคอลัมน์

### 5.3 `MUTPRODUCT` — สินค้า / บริการ

| Column | ชนิดข้อมูล | หมายเหตุ |
| --- | --- | --- |
| `PROID` | `VARCHAR2(20)` | Primary Key — รูปแบบ `P0001`, `P0002`, ... |
| `PRONAME` | `VARCHAR2(100)` | ชื่อสินค้า |
| `IMG` | `VARCHAR2(200)` | **ชื่อไฟล์รูป** เท่านั้น (เก็บใน `server/img/`) |
| `DETAIL` | `VARCHAR2(200)` | รายละเอียด |
| `PRICE` | `NUMBER(12,2)` | ราคา |

### ตัวอย่าง DDL (ปรับชนิดข้อมูลตามจริงได้)

```sql
CREATE TABLE MUTEMP (
  EMPID        VARCHAR2(20)  PRIMARY KEY,
  EMPNAME      VARCHAR2(100),
  EMPADDRESS   VARCHAR2(200),
  EMPEMAIL     VARCHAR2(100),
  EMPPASSWORD  VARCHAR2(200),
  SALARY       NUMBER(12,2),
  PERMISSION   CHAR(4) DEFAULT '0000'
);

-- ลำดับ column สำคัญมาก เพราะ API ใช้ SELECT *
CREATE TABLE MUTCUSTOMER (
  CUSID      VARCHAR2(20)  PRIMARY KEY,
  CUSNAME    VARCHAR2(100),
  CUSADDRESS VARCHAR2(200),
  CUSTEL     VARCHAR2(30),
  CUSEMAIL   VARCHAR2(100)
);

CREATE TABLE MUTPRODUCT (
  PROID   VARCHAR2(20)  PRIMARY KEY,
  PRONAME VARCHAR2(100),
  IMG     VARCHAR2(200),
  DETAIL  VARCHAR2(200),
  PRICE   NUMBER(12,2)
);
```

### ข้อมูลผู้ใช้งานรายแรก (Admin)

ต้อง Insert ผู้ใช้แรกเข้า `MUTEMP` เอง โดย `EMPPASSWORD` ต้องเป็น **bcrypt hash**

1. สร้าง hash ด้วย Node (ต้องอยู่ในโฟลเดอร์ `server/` ที่ติดตั้ง `bcryptjs` แล้ว):

```bash
cd server
node -e "console.log(require('bcryptjs').hashSync('1234', 10))"
```

2. Copy ค่าที่ได้ไปใส่ใน SQL:

```sql
INSERT INTO MUTEMP (EMPID, EMPNAME, EMPADDRESS, EMPEMAIL, EMPPASSWORD, SALARY, PERMISSION)
VALUES ('EMP69001', 'ผู้ดูแลระบบ', 'กรุงเทพฯ', 'admin@mut.ac.th', '<วาง bcrypt hash ตรงนี้>', 0, '1111');

COMMIT;
```

> `PERMISSION = '1111'` = ผู้ดูแลที่เข้าถึงได้ทุกเมนู

---

## 6. ระบบสิทธิ์ (Permission)

สิทธิ์เก็บเป็น **String 4 หลัก** ในคอลัมน์ `PERMISSION` ตัวละ 1 หมายถึง "เข้าถึงได้" ตัวละ 0 หมายถึง "ไม่ได้"

| ตำแหน่ง | เมนู | ตัวอย่าง |
| --- | --- | --- |
| 0 | Employee | `1111` = ทุกเมนู · `0111` = ไม่เข้า Employee |
| 1 | Customer | |
| 2 | Product | |
| 3 | Report | |

- การซ่อน/แสดงเมนูใน Navbar → `client/src/Navbar.jsx`
- การป้องกันเข้าหน้าโดยตรง (URL) → `client/src/ProtectedRoute.jsx`
- ตารางแปลง Permission ↔ Checkbox ในหน้า Employee → `getPermissionString()` / `setPermissionFromString()`

> ⚠️ ระบบตรวจสิทธิ์ **ฝั่ง Client เท่านั้น** (เก็บ user ไว้ใน `localStorage`) ไม่มีการตรวจสิทธิ์ซ้ำที่ฝั่ง API — เหมาะกับงานตัวอย่าง/ส่งอาจารย์ แต่ไม่ควรใช้กับระบบจริง

---

## 7. REST API ทั้งหมด

Base URL: `http://localhost:5000`

### Authentication

| Method | Endpoint | รายละเอียด |
| --- | --- | --- |
| `POST` | `/api/login` | Body: `{ empemail, emppassword }` → ตรวจด้วย bcrypt แล้วคืนค่า `user` |

### Employee — `/api/mutemp`

| Method | Endpoint | รายละเอียด |
| --- | --- | --- |
| `GET` | `/api/mutemp` | ดึงข้อมูลพนักงานทั้งหมด (เรียงตาม `EMPID`) |
| `POST` | `/api/mutemp` | เพิ่มพนักงาน — **สร้าง `EMPID` ให้อัตโนมัติ**, hash password ด้วย bcrypt |
| `PUT` | `/api/mutemp/:id` | แก้ไขข้อมูล — ถ้าไม่ส่ง `emppassword` มา จะ**ไม่เปลี่ยน**รหัสเดิม |
| `DELETE` | `/api/mutemp/:id` | ลบพนักงาน |

### Customer — `/api/mutcus`

| Method | Endpoint | รายละเอียด |
| --- | --- | --- |
| `GET` | `/api/mutcus` | ดึงข้อมูลลูกค้าทั้งหมด (Read-only) |

### Product — `/api/mutproduct`

| Method | Endpoint | รายละเอียด |
| --- | --- | --- |
| `GET` | `/api/mutproduct` | ดึงข้อมูลสินค้าทั้งหมด |
| `POST` | `/api/mutproduct` | เพิ่มสินค้า — **multipart/form-data** ฟิลด์รูปชื่อ `img` |
| `PUT` | `/api/mutproduct/:id` | แก้ไขสินค้า — ถ้าไม่ได้แนบรูปใหม่ จะ**คงรูปเดิม**ไว้ |
| `DELETE` | `/api/mutproduct/:id` | ลบสินค้า |

### Static — `/img`

| Method | Endpoint | รายละเอียด |
| --- | --- | --- |
| `GET` | `/img/<filename>` | เสิร์ฟรูปสินค้าจากโฟลเดอร์ `server/img/` |

---

## 8. การทำงานของแต่ละหน้า

### Login (`/login`)
- 2 panel: ฝั่งซ้ายเป็น Branding + Hero + SystemStats · ฝั่งขวาเป็นฟอร์ม Login
- **Demo Accounts (สำคัญ):** ถ้ากรอก username เป็น `admin` / `driver` / `user` ระบบจะ **Login ผ่านโดยไม่ต่อ API** (mock ใน `client/src/Login.jsx`) เหมาะสำหรับ demo โดยไม่ต้องต่อฐานข้อมูล
- ถ้าเป็นอีเมลอื่น จะ POST ไป `/api/login` จริง
- เมื่อสำเร็จ จะเก็บ user ลง `localStorage` (key: `user`) แล้ว redirect ไป `/`

### Home (`/`)
หน้าแรก แสดงชื่อโปรแกรม + Navbar

### Employee (`/employee`) — ต้องมีสิทธิ์ตำแหน่ง 0
- ตารางแสดงข้อมูล + **ค้นหา** (ID, ชื่อ, ที่อยู่, อีเมล) + **แบ่งหน้า** (10 รายการ/หน้า)
- Modal ใช้ร่วมกันระหว่าง **Add** และ **Edit**
- Checkbox 4 ตัวสำหรับกำหนด Permission
- ยืนยันการลบด้วย SweetAlert2
- ⚠️ รหัสผ่านถูกเก็บเป็น bcrypt hash ที่ฝั่ง server — **ไม่มีการส่งรหัสผ่านกลับมาให้ client**

### Customer (`/customer`) — ต้องมีสิทธิ์ตำแหน่ง 1
- ตาราง + ค้นหา + แบ่งหน้า + Modal เพิ่ม/แก้ไข (ทำงานฝั่ง UI)
- **Backend มีแค่ `GET`** — ปุ่มบันทึก/ลบจะเรียก API ที่ยังไม่มีอยู่จริง

### Product (`/Product`) — ต้องมีสิทธิ์ตำแหน่ง 2
- แสดงสินค้าเป็น **การ์ดรูป** (8 รายการ/หน้า = 2 แถว × 4 สินค้า)
- อัปโหลดรูปพร้อม **preview** ก่อนบันทึก
- รูปถูกบันทึกลง `server/img/` ด้วยชื่อ `PROD-<timestamp>-<random><ext>` และเสิร์ฟผ่าน `http://localhost:5000/img/`

### การกำหนด Route (`client/src/main.jsx`)

| Path | หน้า | Permission index |
| --- | --- | --- |
| `/` | Home | - |
| `/login` | Login | - |
| `/employee` | Employee | 0 |
| `/customer` | Customer | 1 |
| `/Product` | Product | 2 |
| `*` | redirect ไป `/login` | - |

> สังเกตว่า Path ของหน้า Product คือ **`/Product`** (ตัว P ใหญ่) แต่ Navbar ลิงก์ไป `/product` (ตัว p เล็ก) → ต้องพิมพ์ URL ให้ตรง หรือแก้ให้เป็นตัวพิมพ์เดียวกัน

---

## 9. คำสั่งที่ใช้บ่อย

### Server

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm install` | ติดตั้ง dependency |
| `npm start` | รัน server พร้อม nodemon (auto-restart) |
| `node server.js` | รันแบบปกติ ไม่มี auto-restart |

### Client

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm install` | ติดตั้ง dependency |
| `npm run dev` | รัน dev server (HMR) |
| `npm run build` | build เป็น static files ไปที่ `dist/` |
| `npm run preview` | ทดลองดูผลลัพธ์ build |
| `npm run lint` | ตรวจ code ด้วย ESLint |

---

## 10. แพ็กเกจที่ใช้

### `server/`
`express` · `oracledb` · `bcryptjs` · `cors` · `multer` · `dotenv` · `nodemon` (dev)

### `client/`
`react` · `react-dom` · `react-router-dom` · `axios` · `bootstrap` · `sweetalert2` · `localforage` · `match-sorter` · `sort-by`
(dev) `vite` · `@vitejs/plugin-react` · `eslint`

---

## 11. ปัญหาที่พบบ่อย (Troubleshooting)

| อาการ | วิธีแก้ |
| --- | --- |
| `Oracle Connection Error` / `ORA-12541` | เช็คว่า Oracle DB ทำงานอยู่ และ `DB_HOST`/`DB_PORT`/`DB_SERVICE` ถูกต้อง |
| `ORA-01017: invalid username/password` | `DB_USER` / `DB_PASSWORD` ไม่ตรงกับ user ในฐานข้อมูล |
| `NJS-044: Could not load the Oracle Node.js Driver` | `npm install` ใน `server/` ใหม่ |
| เปิดหน้าเว็บแล้วแจ้ง `ไม่สามารถโหลดข้อมูลได้` | Server ยังไม่รัน หรือ URL ใน client ไม่ตรงกับ `PORT` |
| รูปสินค้าไม่ขึ้น | ตรวจว่า `server/img/` มีไฟล์ และคอลัมน์ `IMG` เก็บเป็น **ชื่อไฟล์** ไม่ใช่ path เต็ม |
| `ORA-00942: table or view does not exist` | ยังไม่ได้สร้างตาราง `MUTEMP` / `MUTCUSTOMER` / `MUTPRODUCT` — ดูหัวข้อที่ 5 |
| Login แล้วเด้งกลับหน้า Login | ค่า `PERMISSION` ในฐานข้อมูลเป็น `0000` หรือ user ยังไม่มีสิทธิ์เข้าเมนูนั้น |
| ข้อมูลลูกค้าผิดคอลัมน์ | ลำดับ column ใน `MUTCUSTOMER` ไม่ตรงกับที่ API คาดไว้ |

---

## 12. สิ่งที่ยังไม่ได้ทำ (Backlog)

- [ ] เพิ่ม API Create / Update / Delete สำหรับ `MUTCUSTOMER` (ตอนนี้มีแค่ `GET`)
- [ ] เพิ่มหน้า **Report** — Navbar มีเมนูและมี Permission index 3 แล้ว แต่ยังไม่มี route/page
- [ ] ย้าย URL ของ API ไปไว้ใน `.env` ของ client + ตั้ง proxy ใน `vite.config.js`
- [ ] เพิ่ม JWT / session token และตรวจสิทธิ์ที่ฝั่ง server
- [ ] ลบรูปสินค้าออกจาก `server/img/` เมื่อลบสินค้า
- [ ] แก้ Path หน้า Product ให้เป็น `/product` (ตัวพิมพ์เล็ก) ให้ตรงกับ Navbar

---

## 13. ข้อมูล Demo Accounts

บัญชีที่ `client/src/Login.jsx` mock ไว้ (รหัสผ่านทั้งหมดคือ `1234`) — **ไม่ต้องต่อฐานข้อมูลก็ใช้ได้**

| Username | รหัสผ่าน | Permission | บทบาท | เข้าถึงได้ |
| --- | --- | --- | --- | --- |
| `admin` | `1234` | `1111` | ผู้ดูแลระบบ | ทุกเมนู |
| `driver` | `1234` | `0100` | คนขับรถ | Employee, Report |
| `user` | `1234` | `0010` | นักศึกษา/เจ้าหน้าที่ | Employee, Product |

> ใช้ได้เฉพาะตอน dev เท่านั้น ถ้าจะเขียนส่งอาจารย์/ขึ้นระบบจริง ควร**เอา demo account ออก** และใช้ `MUTEMP` + `/api/login` แทน

---

## สรุปขั้นตอน Quick Start

```bash
# 1) เตรียมฐานข้อมูล Oracle (สร้างตารางตามหัวข้อที่ 5 + Insert admin)

# 2) Backend
cd server
# แก้ .env ให้ตรงกับ Oracle ของคุณ
npm install
npm start

# 3) Frontend (เปิด Terminal ใหม่)
cd client
npm install
npm run dev
```

เปิด **http://localhost:5173** → Login ด้วย `admin` / `1234` (demo) หรือใช้อีเมลจริงที่ Insert ใน `MUTEMP`

---

> **หมายเหตุเรื่องความปลอดภัย:** `server/.env` ถูก `.gitignore` ไว้ เพื่อไม่ให้ user/password ของ Oracle หลุดขึ้น GitHub — กรุณา**อย่า commit ไฟล์นี้** และอย่าใส่ credential จริงลงในโค้ด
