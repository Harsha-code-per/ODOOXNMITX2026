import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    res = await client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_login_and_auth_flow(client: AsyncClient):
    # 1. Login as Alex Rivera (Employee)
    res = await client.post("/api/v1/auth/login", json={
        "email": "alex.rivera@dayflow.io",
        "password": "password123",
    })
    assert res.status_code == 200
    alex_data = res.json()
    assert "access_token" in alex_data
    assert alex_data["user"]["role"] == "EMPLOYEE"
    assert alex_data["user"]["employee"]["employee_id"] == "EMP-003"

    alex_token = alex_data["access_token"]
    headers = {"Authorization": f"Bearer {alex_token}"}

    # 2. Get Employee Me Profile
    me_res = await client.get("/api/v1/employees/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "alex.rivera@dayflow.io"
    assert me_data["department"] == "Engineering"

    # 3. Login as Sarah (HR)
    hr_res = await client.post("/api/v1/auth/login", json={
        "email": "sarah.hr@dayflow.io",
        "password": "password123",
    })
    assert hr_res.status_code == 200
    hr_data = hr_res.json()
    assert hr_data["user"]["role"] == "HR"

    # 4. Invalid Password Rejection
    bad_res = await client.post("/api/v1/auth/login", json={
        "email": "alex.rivera@dayflow.io",
        "password": "wrongpassword",
    })
    assert bad_res.status_code == 401


@pytest.mark.asyncio
async def test_payroll_dynamic_recalculation_endpoint(client: AsyncClient):
    # Login as Sarah (HR)
    hr_res = await client.post("/api/v1/auth/login", json={
        "email": "sarah.hr@dayflow.io",
        "password": "password123",
    })
    hr_token = hr_res.json()["access_token"]
    hr_headers = {"Authorization": f"Bearer {hr_token}"}

    # Update Wage for Alex (EMP-003): ₹75,000 -> ₹90,000
    update_res = await client.put(
        "/api/v1/admin/payroll/EMP-003/salary",
        json={"wage": 90000.0},
        headers=hr_headers,
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["wage"] == 90000.0
    assert data["basic"] == 45000.0
    assert data["hra"] == 22500.0
    assert data["pf"] == 5400.0
    assert data["professional_tax"] == 200.0
    assert data["gross_salary"] == 90000.0
    assert data["total_deductions"] == 5600.0
    assert data["net_salary"] == 84400.0


@pytest.mark.asyncio
async def test_leaves_workflow_and_approval(client: AsyncClient):
    # Alex (Employee) Login
    alex_res = await client.post("/api/v1/auth/login", json={
        "email": "alex.rivera@dayflow.io",
        "password": "password123",
    })
    alex_token = alex_res.json()["access_token"]
    alex_headers = {"Authorization": f"Bearer {alex_token}"}

    # Apply for 2-day Sick Leave
    apply_res = await client.post(
        "/api/v1/leaves",
        json={
            "leave_type": "SICK",
            "start_date": "2026-09-01",
            "end_date": "2026-09-02",
            "total_days": 2,
            "reason": "Doctor appointment & recovery",
        },
        headers=alex_headers,
    )
    assert apply_res.status_code == 201
    leave_data = apply_res.json()
    assert leave_data["status"] == "PENDING"
    leave_id = leave_data["id"]

    # HR Login
    hr_res = await client.post("/api/v1/auth/login", json={
        "email": "sarah.hr@dayflow.io",
        "password": "password123",
    })
    hr_token = hr_res.json()["access_token"]
    hr_headers = {"Authorization": f"Bearer {hr_token}"}

    # Approve Leave
    appr_res = await client.patch(
        f"/api/v1/leaves/{leave_id}/approve",
        json={"hr_comments": "Approved. Get well soon!"},
        headers=hr_headers,
    )
    assert appr_res.status_code == 200
    appr_data = appr_res.json()
    assert appr_data["status"] == "APPROVED"
    assert appr_data["hr_comments"] == "Approved. Get well soon!"


@pytest.mark.asyncio
async def test_executive_analytics_dashboard(client: AsyncClient):
    # HR Login
    hr_res = await client.post("/api/v1/auth/login", json={
        "email": "sarah.hr@dayflow.io",
        "password": "password123",
    })
    hr_token = hr_res.json()["access_token"]
    hr_headers = {"Authorization": f"Bearer {hr_token}"}

    dash_res = await client.get("/api/v1/analytics/dashboard", headers=hr_headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()

    assert "metrics" in dash_data
    assert dash_data["metrics"]["total_employees"] >= 11
    assert "department_distribution" in dash_data
    assert len(dash_data["department_distribution"]) > 0
    assert "attendance_trends" in dash_data
