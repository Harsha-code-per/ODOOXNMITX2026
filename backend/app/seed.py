import asyncio
from datetime import date, datetime, timedelta, timezone
from sqlalchemy import select
from app.database import engine, async_session_factory, Base
from app.models.profile import Profile, UserRole
from app.models.employee import Employee, EmployeeStatus
from app.models.attendance import Attendance, AttendanceStatus
from app.models.leave import LeaveType, LeaveRequest, LeaveTypeEnum, LeaveStatus
from app.models.payroll import SalaryStructure
from app.models.notification import Notification
from app.core.security import get_password_hash
from app.services.payroll_service import calculate_salary_structure

DEFAULT_PASSWORD = "password123"

PERSONAS = [
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
        "employee_id": "EMP-001",
        "first_name": "Arthur",
        "last_name": "Morgan",
        "email": "admin@dayflow.io",
        "phone": "+1 555-0101",
        "department": "Management",
        "designation": "Chief Executive Officer",
        "joining_date": date(2022, 1, 15),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        "address": "100 Silicon Ave, San Francisco, CA",
        "emergency_contact": {"name": "Mary Morgan", "relationship": "Spouse", "phone": "+1 555-0102"},
        "wage": 120000.0,
        "role": UserRole.ADMIN,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
        "employee_id": "EMP-002",
        "first_name": "Sarah",
        "last_name": "Jenkins",
        "email": "sarah.hr@dayflow.io",
        "phone": "+1 555-0201",
        "department": "Human Resources",
        "designation": "HR Director",
        "joining_date": date(2022, 3, 1),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        "address": "250 Market St, San Francisco, CA",
        "emergency_contact": {"name": "Tom Jenkins", "relationship": "Spouse", "phone": "+1 555-0202"},
        "wage": 90000.0,
        "role": UserRole.HR,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
        "employee_id": "EMP-003",
        "first_name": "Alex",
        "last_name": "Rivera",
        "email": "alex.rivera@dayflow.io",
        "phone": "+1 555-0301",
        "department": "Engineering",
        "designation": "Senior Full Stack Engineer",
        "joining_date": date(2023, 2, 10),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "address": "450 Pine Street, Berkeley, CA",
        "emergency_contact": {"name": "Maria Rivera", "relationship": "Sister", "phone": "+1 555-0302"},
        "wage": 75000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
        "employee_id": "EMP-004",
        "first_name": "Elena",
        "last_name": "Rostova",
        "email": "elena.rostova@dayflow.io",
        "phone": "+1 555-0401",
        "department": "Engineering",
        "designation": "Staff Frontend Architect",
        "joining_date": date(2023, 4, 15),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
        "address": "88 Valencia St, San Francisco, CA",
        "emergency_contact": {"name": "Dmitri Rostov", "relationship": "Brother", "phone": "+1 555-0402"},
        "wage": 85000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
        "employee_id": "EMP-005",
        "first_name": "David",
        "last_name": "Chen",
        "email": "david.chen@dayflow.io",
        "phone": "+1 555-0501",
        "department": "Engineering",
        "designation": "DevOps & Cloud Lead",
        "joining_date": date(2023, 6, 1),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        "address": "12 Folsom St, San Francisco, CA",
        "emergency_contact": {"name": "Grace Chen", "relationship": "Mother", "phone": "+1 555-0502"},
        "wage": 70000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6",
        "employee_id": "EMP-006",
        "first_name": "Priya",
        "last_name": "Sharma",
        "email": "priya.sharma@dayflow.io",
        "phone": "+1 555-0601",
        "department": "Engineering",
        "designation": "Backend Engineer",
        "joining_date": date(2023, 9, 1),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1534751516642-a171edd29974?w=150",
        "address": "310 Bryant St, Palo Alto, CA",
        "emergency_contact": {"name": "Raj Sharma", "relationship": "Father", "phone": "+1 555-0602"},
        "wage": 55000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7",
        "employee_id": "EMP-007",
        "first_name": "Marcus",
        "last_name": "Vance",
        "email": "marcus.vance@dayflow.io",
        "phone": "+1 555-0701",
        "department": "Product",
        "designation": "Principal Product Manager",
        "joining_date": date(2022, 11, 15),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
        "address": "520 Howard St, San Francisco, CA",
        "emergency_contact": {"name": "Lisa Vance", "relationship": "Spouse", "phone": "+1 555-0702"},
        "wage": 80000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8",
        "employee_id": "EMP-008",
        "first_name": "Chloe",
        "last_name": "Dupont",
        "email": "chloe.dupont@dayflow.io",
        "phone": "+1 555-0801",
        "department": "Product",
        "designation": "Lead UI/UX Designer",
        "joining_date": date(2023, 1, 10),
        "status": EmployeeStatus.ON_LEAVE,
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        "address": "710 Mission St, San Francisco, CA",
        "emergency_contact": {"name": "Jean Dupont", "relationship": "Brother", "phone": "+1 555-0802"},
        "wage": 65000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9",
        "employee_id": "EMP-009",
        "first_name": "Jordan",
        "last_name": "Bell",
        "email": "jordan.bell@dayflow.io",
        "phone": "+1 555-0901",
        "department": "Sales",
        "designation": "VP of Enterprise Sales",
        "joining_date": date(2022, 8, 1),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
        "address": "900 Sutter St, San Francisco, CA",
        "emergency_contact": {"name": "Karen Bell", "relationship": "Spouse", "phone": "+1 555-0902"},
        "wage": 95000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10",
        "employee_id": "EMP-010",
        "first_name": "Aisha",
        "last_name": "Khan",
        "email": "aisha.khan@dayflow.io",
        "phone": "+1 555-1001",
        "department": "Marketing",
        "designation": "Growth & Brand Specialist",
        "joining_date": date(2023, 11, 1),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
        "address": "1400 Post St, San Francisco, CA",
        "emergency_contact": {"name": "Farhan Khan", "relationship": "Brother", "phone": "+1 555-1002"},
        "wage": 50000.0,
        "role": UserRole.EMPLOYEE,
    },
    {
        "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11",
        "emp_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11",
        "employee_id": "EMP-011",
        "first_name": "Liam",
        "last_name": "Nelson",
        "email": "liam.nelson@dayflow.io",
        "phone": "+1 555-1101",
        "department": "Finance",
        "designation": "Financial Controller",
        "joining_date": date(2022, 5, 15),
        "status": EmployeeStatus.ACTIVE,
        "avatar_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
        "address": "320 Bush St, San Francisco, CA",
        "emergency_contact": {"name": "Anna Nelson", "relationship": "Spouse", "phone": "+1 555-1102"},
        "wage": 82000.0,
        "role": UserRole.EMPLOYEE,
    },
]


async def seed_database(target_engine=None, target_session_factory=None):
    eng = target_engine or engine
    factory = target_session_factory or async_session_factory

    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with factory() as session:
        leave_types = [
            ("11111111-1111-1111-1111-111111111101", LeaveTypeEnum.PAID, True, 18, "Annual paid vacation leave"),
            ("11111111-1111-1111-1111-111111111102", LeaveTypeEnum.SICK, True, 10, "Medical and sickness leave"),
            ("11111111-1111-1111-1111-111111111103", LeaveTypeEnum.CASUAL, True, 6, "Short personal time off"),
            ("11111111-1111-1111-1111-111111111104", LeaveTypeEnum.UNPAID, False, 0, "Leave without pay"),
        ]

        lt_objs = {}
        for lt_id, name, is_paid, alloc, desc in leave_types:
            stmt = select(LeaveType).where(LeaveType.name == name)
            res = await session.execute(stmt)
            obj = res.scalar_one_or_none()
            if not obj:
                obj = LeaveType(
                    id=lt_id,
                    name=name,
                    is_paid=is_paid,
                    default_allocation=alloc,
                    description=desc,
                )
                session.add(obj)
            lt_objs[name.value] = obj

        await session.flush()

        print("👤 Seeding Profiles and Employees...")
        password_hash = get_password_hash(DEFAULT_PASSWORD)

        for p in PERSONAS:
            # Profile
            stmt = select(Profile).where(Profile.email == p["email"])
            res = await session.execute(stmt)
            profile = res.scalar_one_or_none()
            if not profile:
                profile = Profile(
                    id=p["user_id"],
                    email=p["email"],
                    password_hash=password_hash,
                    role=p["role"],
                )
                session.add(profile)
                await session.flush()

            # Employee
            emp_stmt = select(Employee).where(Employee.employee_id == p["employee_id"])
            emp_res = await session.execute(emp_stmt)
            emp = emp_res.scalar_one_or_none()
            if not emp:
                emp = Employee(
                    id=p["emp_id"],
                    user_id=profile.id,
                    employee_id=p["employee_id"],
                    first_name=p["first_name"],
                    last_name=p["last_name"],
                    email=p["email"],
                    phone=p["phone"],
                    department=p["department"],
                    designation=p["designation"],
                    joining_date=p["joining_date"],
                    status=p["status"],
                    avatar_url=p["avatar_url"],
                    address=p["address"],
                    emergency_contact=p["emergency_contact"],
                )
                session.add(emp)
                await session.flush()

            # Salary Structure
            sal_stmt = select(SalaryStructure).where(SalaryStructure.employee_id == emp.id)
            sal_res = await session.execute(sal_stmt)
            sal = sal_res.scalar_one_or_none()
            if not sal:
                calc = calculate_salary_structure(p["wage"])
                sal = SalaryStructure(
                    employee_id=emp.id,
                    effective_from=date(2026, 1, 1),
                    **calc,
                )
                session.add(sal)

        await session.flush()

        print("⏰ Seeding Attendance History...")
        today = date.today()
        alex_emp_id = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3"
        elena_emp_id = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4"
        chloe_emp_id = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8"

        sample_attendances = [
            (alex_emp_id, today - timedelta(days=4), datetime.now(timezone.utc).replace(hour=9, minute=2), datetime.now(timezone.utc).replace(hour=17, minute=35), 8.55, AttendanceStatus.PRESENT, "Sprint kickoff"),
            (alex_emp_id, today - timedelta(days=3), datetime.now(timezone.utc).replace(hour=9, minute=15), datetime.now(timezone.utc).replace(hour=18, minute=0), 8.75, AttendanceStatus.PRESENT, "Backend integration"),
            (alex_emp_id, today - timedelta(days=2), datetime.now(timezone.utc).replace(hour=8, minute=55), datetime.now(timezone.utc).replace(hour=17, minute=30), 8.58, AttendanceStatus.PRESENT, "Feature testing"),
            (alex_emp_id, today - timedelta(days=1), datetime.now(timezone.utc).replace(hour=9, minute=0), datetime.now(timezone.utc).replace(hour=13, minute=15), 4.25, AttendanceStatus.HALF_DAY, "Dentist appointment"),
            (alex_emp_id, today, datetime.now(timezone.utc).replace(hour=9, minute=0), None, 0.0, AttendanceStatus.PRESENT, "Checked in for demo"),
            (elena_emp_id, today - timedelta(days=1), datetime.now(timezone.utc).replace(hour=9, minute=10), datetime.now(timezone.utc).replace(hour=17, minute=40), 8.50, AttendanceStatus.PRESENT, "Design review"),
            (elena_emp_id, today, datetime.now(timezone.utc).replace(hour=8, minute=45), None, 0.0, AttendanceStatus.PRESENT, "UI polish"),
            (chloe_emp_id, today, None, None, 0.0, AttendanceStatus.ON_LEAVE, "Approved Vacation"),
        ]

        for emp_id, wdate, cin, cout, thours, st, notes in sample_attendances:
            att_stmt = select(Attendance).where(Attendance.employee_id == emp_id, Attendance.work_date == wdate)
            att_res = await session.execute(att_stmt)
            if not att_res.scalar_one_or_none():
                att = Attendance(
                    employee_id=emp_id,
                    work_date=wdate,
                    check_in=cin,
                    check_out=cout,
                    total_hours=thours,
                    status=st,
                    notes=notes,
                )
                session.add(att)

        print("📝 Seeding Sample Leave Requests...")
        sample_leaves = [
            (alex_emp_id, lt_objs["SICK"].id, today - timedelta(days=10), today - timedelta(days=9), 2, "Flu recovery", LeaveStatus.APPROVED, "Approved by Sarah", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
            (chloe_emp_id, lt_objs["PAID"].id, today - timedelta(days=1), today + timedelta(days=2), 4, "Annual family vacation", LeaveStatus.APPROVED, "Have fun!", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
            (elena_emp_id, lt_objs["CASUAL"].id, today + timedelta(days=5), today + timedelta(days=5), 1, "Personal errand", LeaveStatus.PENDING, None, None),
        ]

        for emp_id, ltid, sdate, edate, tdays, reason, st, comments, rev_by in sample_leaves:
            l_stmt = select(LeaveRequest).where(
                LeaveRequest.employee_id == emp_id,
                LeaveRequest.start_date == sdate,
            )
            l_res = await session.execute(l_stmt)
            if not l_res.scalar_one_or_none():
                lr = LeaveRequest(
                    employee_id=emp_id,
                    leave_type_id=ltid,
                    start_date=sdate,
                    end_date=edate,
                    total_days=tdays,
                    reason=reason,
                    status=st,
                    hr_comments=comments,
                    reviewed_by=rev_by,
                    reviewed_at=datetime.now(timezone.utc) if rev_by else None,
                )
                session.add(lr)

        await session.commit()
        print("✅ Database successfully seeded with 11 demo personas, salary structures, and attendance records!")


if __name__ == "__main__":
    asyncio.run(seed_database())
