# Dayflow HRMS — Official REST API Contract (v1)

> **Protocol**: RESTful HTTP / JSON  
> **Base URL**: `http://localhost:8000/api/v1` (Development) | `https://dayflow-backend.onrender.com/api/v1` (Production)  
> **Auth Header**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`  

---

## 1. Authentication & Authorization (`/api/v1/auth`)

### 1.1 Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
```json
{
  "email": "sarah.hr@dayflow.io",
  "password": "password123"
}
```
- **Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    "email": "sarah.hr@dayflow.io",
    "role": "HR",
    "employee": {
      "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
      "employee_id": "EMP-002",
      "first_name": "Sarah",
      "last_name": "Jenkins",
      "department": "Human Resources",
      "designation": "HR Director",
      "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    }
  }
}
```

### 1.2 Sign Up / Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Request Body**:
```json
{
  "employee_id": "EMP-012",
  "email": "new.dev@dayflow.io",
  "password": "StrongPassword123!",
  "first_name": "Marcus",
  "last_name": "Brody",
  "role": "EMPLOYEE",
  "department": "Engineering",
  "designation": "Software Engineer"
}
```
- **Response `201 Created`**:
```json
{
  "message": "User registered successfully",
  "user_id": "uuid-string",
  "employee_id": "EMP-012"
}
```

### 1.3 Get Current Authenticated User (`/me`)
- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Full User & Employee profile object.

---

## 2. Employee Management (`/api/v1/employees`)

### 2.1 Get Current Employee Profile
- **Endpoint**: `GET /api/v1/employees/me`
- **Response `200 OK`**:
```json
{
  "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
  "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
  "employee_id": "EMP-003",
  "first_name": "Alex",
  "last_name": "Rivera",
  "email": "alex.rivera@dayflow.io",
  "phone": "+1 555-0301",
  "department": "Engineering",
  "designation": "Senior Full Stack Engineer",
  "joining_date": "2023-02-10",
  "status": "ACTIVE",
  "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  "address": "450 Pine Street, Berkeley, CA",
  "emergency_contact": {
    "name": "Maria Rivera",
    "relationship": "Sister",
    "phone": "+1 555-0302"
  }
}
```

### 2.2 List All Employees (HR / Admin)
- **Endpoint**: `GET /api/v1/employees?department=Engineering&status=ACTIVE&search=Alex`
- **Access**: `HR`, `ADMIN`
- **Response `200 OK`**: Array of employee objects + pagination metadata.

### 2.3 Update Employee Details
- **Endpoint**: `PUT /api/v1/employees/{employee_id}`
- **Access**: Employee (can only update `phone`, `address`, `avatar_url`, `emergency_contact`) | Admin/HR (can update all fields including `department`, `designation`, `status`, `wage`)
- **Request Body**:
```json
{
  "phone": "+1 555-9999",
  "address": "Updated Address 123",
  "emergency_contact": {
    "name": "Maria Rivera",
    "relationship": "Sister",
    "phone": "+1 555-0302"
  }
}
```
- **Response `200 OK`**: Updated employee object.

---

## 3. Attendance Management (`/api/v1/attendance`)

### 3.1 Check-In (Employee)
- **Endpoint**: `POST /api/v1/attendance/check-in`
- **Request Body**:
```json
{
  "notes": "Remote from home office"
}
```
- **Response `200 OK`**:
```json
{
  "id": "attendance-uuid",
  "employee_id": "EMP-003",
  "work_date": "2026-08-22",
  "check_in": "2026-08-22T09:00:00Z",
  "check_out": null,
  "total_hours": 0.0,
  "status": "PRESENT",
  "notes": "Remote from home office"
}
```
- **Error `400 Bad Request`**: `"Employee has already checked in today at 09:00:00Z"`

### 3.2 Check-Out (Employee)
- **Endpoint**: `POST /api/v1/attendance/check-out`
- **Response `200 OK`**:
```json
{
  "id": "attendance-uuid",
  "employee_id": "EMP-003",
  "work_date": "2026-08-22",
  "check_in": "2026-08-22T09:00:00Z",
  "check_out": "2026-08-22T17:30:00Z",
  "total_hours": 8.50,
  "status": "PRESENT"
}
```

### 3.3 Get My Attendance History
- **Endpoint**: `GET /api/v1/attendance/me?start_date=2026-08-01&end_date=2026-08-31`
- **Response `200 OK`**:
```json
{
  "today": {
    "checked_in": true,
    "checked_out": false,
    "check_in_time": "2026-08-22T09:00:00Z",
    "status": "PRESENT"
  },
  "summary": {
    "total_working_days": 22,
    "present_days": 19,
    "half_days": 1,
    "leaves_taken": 2,
    "total_hours_worked": 164.5
  },
  "records": [...]
}
```

### 3.4 Company Attendance Grid (HR / Admin)
- **Endpoint**: `GET /api/v1/attendance?date=2026-08-22&department=all`
- **Access**: `HR`, `ADMIN`
- **Response `200 OK`**: Array of all employees with their daily attendance status, check-in timestamps, and hours.

---

## 4. Leave & Time-Off Management (`/api/v1/leaves`)

### 4.1 Apply for Leave (Employee)
- **Endpoint**: `POST /api/v1/leaves`
- **Request Body**:
```json
{
  "leave_type": "SICK",
  "start_date": "2026-08-24",
  "end_date": "2026-08-25",
  "total_days": 2,
  "reason": "Doctor appointment and recovery from seasonal flu"
}
```
- **Response `201 Created`**:
```json
{
  "id": "leave-uuid",
  "employee_id": "EMP-003",
  "leave_type": "SICK",
  "start_date": "2026-08-24",
  "end_date": "2026-08-25",
  "total_days": 2,
  "reason": "Doctor appointment and recovery from seasonal flu",
  "status": "PENDING",
  "created_at": "2026-08-22T10:00:00Z"
}
```

### 4.2 Get My Leaves & Quota Balances
- **Endpoint**: `GET /api/v1/leaves/me`
- **Response `200 OK`**:
```json
{
  "balances": {
    "PAID": { "allocated": 18, "used": 4, "remaining": 14 },
    "SICK": { "allocated": 10, "used": 2, "remaining": 8 },
    "CASUAL": { "allocated": 6, "used": 1, "remaining": 5 },
    "UNPAID": { "allocated": 0, "used": 0, "remaining": 0 }
  },
  "requests": [...]
}
```

### 4.3 Approve / Reject Leave Request (HR / Admin)
- **Approve**: `PATCH /api/v1/leaves/{leave_id}/approve`
- **Reject**: `PATCH /api/v1/leaves/{leave_id}/reject`
- **Request Body**:
```json
{
  "hr_comments": "Approved. Get well soon!"
}
```
- **Response `200 OK`**:
```json
{
  "id": "leave-uuid",
  "status": "APPROVED",
  "hr_comments": "Approved. Get well soon!",
  "reviewed_by": "Sarah Jenkins",
  "reviewed_at": "2026-08-22T10:05:00Z"
}
```

---

## 5. Dynamic Payroll & Salary Engine (`/api/v1/payroll`)

### 5.1 Get My Salary Breakdown (Employee)
- **Endpoint**: `GET /api/v1/payroll/me`
- **Response `200 OK`**:
```json
{
  "employee_id": "EMP-003",
  "employee_name": "Alex Rivera",
  "department": "Engineering",
  "designation": "Senior Full Stack Engineer",
  "effective_from": "2026-01-01",
  "wage": 75000.00,
  "earnings": {
    "basic": 37500.00,
    "hra": 18750.00,
    "standard_allowance": 4167.00,
    "performance_bonus": 3123.75,
    "lta": 3123.75,
    "fixed_allowance": 8335.50
  },
  "deductions": {
    "pf": 4500.00,
    "professional_tax": 200.00
  },
  "gross_salary": 75000.00,
  "total_deductions": 4700.00,
  "net_salary": 70300.00,
  "attendance_summary": {
    "total_working_days": 22,
    "payable_days": 21.5,
    "unpaid_days": 0.5,
    "effective_net_payout": 68702.27
  }
}
```

### 5.2 Update Employee Wage & Auto-Recalculate (HR / Admin)
- **Endpoint**: `PUT /api/v1/admin/payroll/{employee_id}/salary`
- **Access**: `ADMIN`, `HR`
- **Request Body**:
```json
{
  "wage": 90000.00
}
```
- **Response `200 OK`**:
```json
{
  "message": "Salary structure successfully recalculated and saved",
  "employee_id": "EMP-003",
  "wage": 90000.00,
  "basic": 45000.00,
  "hra": 22500.00,
  "standard_allowance": 4167.00,
  "performance_bonus": 3748.50,
  "lta": 3748.50,
  "fixed_allowance": 10836.00,
  "pf": 5400.00,
  "professional_tax": 200.00,
  "gross_salary": 90000.00,
  "total_deductions": 5600.00,
  "net_salary": 84400.00
}
```

---

## 6. Executive HR Analytics (`/api/v1/analytics`)

### 6.1 Get Executive Dashboard Summary
- **Endpoint**: `GET /api/v1/analytics/dashboard`
- **Access**: `HR`, `ADMIN`
- **Response `200 OK`**:
```json
{
  "metrics": {
    "total_employees": 11,
    "present_today": 9,
    "absent_today": 1,
    "on_leave_today": 1,
    "pending_leaves": 1,
    "attendance_rate": 81.8,
    "monthly_payroll_total": 857000.00
  },
  "department_distribution": [
    { "name": "Engineering", "count": 4, "payroll": 285000.00 },
    { "name": "Product", "count": 2, "payroll": 145000.00 },
    { "name": "Human Resources", "count": 1, "payroll": 90000.00 },
    { "name": "Sales", "count": 1, "payroll": 95000.00 },
    { "name": "Marketing", "count": 1, "payroll": 50000.00 },
    { "name": "Finance", "count": 1, "payroll": 82000.00 },
    { "name": "Management", "count": 1, "payroll": 120000.00 }
  ],
  "attendance_trends": [
    { "date": "2026-08-18", "present": 11, "absent": 0, "leave": 0 },
    { "date": "2026-08-19", "present": 10, "absent": 1, "leave": 0 },
    { "date": "2026-08-20", "present": 11, "absent": 0, "leave": 0 },
    { "date": "2026-08-21", "present": 10, "absent": 0, "leave": 1 },
    { "date": "2026-08-22", "present": 9, "absent": 1, "leave": 1 }
  ]
}
```
