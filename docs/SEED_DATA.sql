-- ==============================================================================
-- DAYFLOW HRMS — SEED DATA FOR SUPABASE
-- Odoo × NMIT Hackathon 2026
-- Execute this after DATABASE_SCHEMA.sql
-- Default Password for all demo accounts: password123
-- (Bcrypt hash: $2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. LEAVE TYPES
-- ------------------------------------------------------------------------------
INSERT INTO leave_types (id, name, is_paid, default_allocation, description) VALUES
('11111111-1111-1111-1111-111111111101', 'PAID', true, 18, 'Annual paid vacation leave'),
('11111111-1111-1111-1111-111111111102', 'SICK', true, 10, 'Medical and sickness leave with documentation'),
('11111111-1111-1111-1111-111111111103', 'CASUAL', true, 6, 'Short personal time off'),
('11111111-1111-1111-1111-111111111104', 'UNPAID', false, 0, 'Leave without pay')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES (Auth)
-- ------------------------------------------------------------------------------
-- Passwords: 'password123'
INSERT INTO profiles (id, email, password_hash, role) VALUES
-- Admin / HR
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'admin@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'ADMIN'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'sarah.hr@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'HR'),
-- Engineering
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'alex.rivera@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'elena.rostova@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'david.chen@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'priya.sharma@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
-- Product & Design
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'marcus.vance@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'chloe.dupont@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
-- Sales & Marketing
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'jordan.bell@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', 'aisha.khan@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE'),
-- Finance
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', 'liam.nelson@dayflow.io', '$2b$12$LZlX1X622tE2Vj4D9aB6k.LzC10k7jXp004f/N9VnZsmvEceD7o46', 'EMPLOYEE')
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. EMPLOYEES
-- ------------------------------------------------------------------------------
INSERT INTO employees (id, user_id, employee_id, first_name, last_name, email, phone, department, designation, joining_date, status, avatar_url, address, emergency_contact) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'EMP-001', 'Arthur', 'Morgan', 'admin@dayflow.io', '+1 555-0101', 'Management', 'Chief Executive Officer', '2022-01-15', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '100 Silicon Ave, San Francisco, CA', '{"name": "Mary Morgan", "relationship": "Spouse", "phone": "+1 555-0102"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'EMP-002', 'Sarah', 'Jenkins', 'sarah.hr@dayflow.io', '+1 555-0201', 'Human Resources', 'HR Director', '2022-03-01', 'ACTIVE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', '250 Market St, San Francisco, CA', '{"name": "Tom Jenkins", "relationship": "Spouse", "phone": "+1 555-0202"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'EMP-003', 'Alex', 'Rivera', 'alex.rivera@dayflow.io', '+1 555-0301', 'Engineering', 'Senior Full Stack Engineer', '2023-02-10', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '450 Pine Street, Berkeley, CA', '{"name": "Maria Rivera", "relationship": "Sister", "phone": "+1 555-0302"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'EMP-004', 'Elena', 'Rostova', 'elena.rostova@dayflow.io', '+1 555-0401', 'Engineering', 'Staff Frontend Architect', '2023-04-15', 'ACTIVE', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', '88 Valencia St, San Francisco, CA', '{"name": "Dmitri Rostov", "relationship": "Brother", "phone": "+1 555-0402"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'EMP-005', 'David', 'Chen', 'david.chen@dayflow.io', '+1 555-0501', 'Engineering', 'DevOps & Cloud Lead', '2023-06-01', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '12 Folsom St, San Francisco, CA', '{"name": "Grace Chen", "relationship": "Mother", "phone": "+1 555-0502"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'EMP-006', 'Priya', 'Sharma', 'priya.sharma@dayflow.io', '+1 555-0601', 'Engineering', 'Backend Engineer', '2023-09-01', 'ACTIVE', 'https://images.unsplash.com/photo-1534751516642-a171edd29974?w=150', '310 Bryant St, Palo Alto, CA', '{"name": "Raj Sharma", "relationship": "Father", "phone": "+1 555-0602"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'EMP-007', 'Marcus', 'Vance', 'marcus.vance@dayflow.io', '+1 555-0701', 'Product', 'Principal Product Manager', '2022-11-15', 'ACTIVE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '520 Howard St, San Francisco, CA', '{"name": "Lisa Vance", "relationship": "Spouse", "phone": "+1 555-0702"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'EMP-008', 'Chloe', 'Dupont', 'chloe.dupont@dayflow.io', '+1 555-0801', 'Product', 'Lead UI/UX Designer', '2023-01-10', 'ON_LEAVE', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '710 Mission St, San Francisco, CA', '{"name": "Jean Dupont", "relationship": "Brother", "phone": "+1 555-0802"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'EMP-009', 'Jordan', 'Bell', 'jordan.bell@dayflow.io', '+1 555-0901', 'Sales', 'VP of Enterprise Sales', '2022-08-01', 'ACTIVE', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '900 Sutter St, San Francisco, CA', '{"name": "Karen Bell", "relationship": "Spouse", "phone": "+1 555-0902"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', 'EMP-010', 'Aisha', 'Khan', 'aisha.khan@dayflow.io', '+1 555-1001', 'Marketing', 'Growth & Brand Specialist', '2023-11-01', 'ACTIVE', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '1400 Post St, San Francisco, CA', '{"name": "Farhan Khan", "relationship": "Brother", "phone": "+1 555-1002"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', 'EMP-011', 'Liam', 'Nelson', 'liam.nelson@dayflow.io', '+1 555-1101', 'Finance', 'Financial Controller', '2022-05-15', 'ACTIVE', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', '320 Bush St, San Francisco, CA', '{"name": "Anna Nelson", "relationship": "Spouse", "phone": "+1 555-1102"}')
ON CONFLICT (employee_id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SALARY STRUCTURES (Dynamic calculation matching formula)
-- ------------------------------------------------------------------------------
-- Wage = 75,000 (Alex Rivera EMP-003):
-- Basic: 37500, HRA: 18750, Standard: 4167, Bonus: 3123.75, LTA: 3123.75, Fixed: 8335.50, PF: 4500, PT: 200, Gross: 75000, Total Ded: 4700, Net: 70300
INSERT INTO salary_structures (id, employee_id, effective_from, wage, basic, hra, standard_allowance, performance_bonus, lta, fixed_allowance, pf, professional_tax, gross_salary, total_deductions, net_salary) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '2026-01-01', 120000.00, 60000.00, 30000.00, 4167.00, 4998.00, 4998.00, 15837.00, 7200.00, 200.00, 120000.00, 7400.00, 112600.00),
('cccccccc-cccc-cccc-cccc-cccccccccc02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '2026-01-01', 90000.00, 45000.00, 22500.00, 4167.00, 3748.50, 3748.50, 10836.00, 5400.00, 200.00, 90000.00, 5600.00, 84400.00),
('cccccccc-cccc-cccc-cccc-cccccccccc03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '2026-01-01', 75000.00, 37500.00, 18750.00, 4167.00, 3123.75, 3123.75, 8335.50, 4500.00, 200.00, 75000.00, 4700.00, 70300.00),
('cccccccc-cccc-cccc-cccc-cccccccccc04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', '2026-01-01', 85000.00, 42500.00, 21250.00, 4167.00, 3540.25, 3540.25, 10002.50, 5100.00, 200.00, 85000.00, 5300.00, 79700.00),
('cccccccc-cccc-cccc-cccc-cccccccccc05', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', '2026-01-01', 70000.00, 35000.00, 17500.00, 4167.00, 2915.50, 2915.50, 7502.00, 4200.00, 200.00, 70000.00, 4400.00, 65600.00),
('cccccccc-cccc-cccc-cccc-cccccccccc06', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', '2026-01-01', 55000.00, 27500.00, 13750.00, 4167.00, 2290.75, 2290.75, 5001.50, 3300.00, 200.00, 55000.00, 3500.00, 51500.00),
('cccccccc-cccc-cccc-cccc-cccccccccc07', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7', '2026-01-01', 80000.00, 40000.00, 20000.00, 4167.00, 3332.00, 3332.00, 9169.00, 4800.00, 200.00, 80000.00, 5000.00, 75000.00),
('cccccccc-cccc-cccc-cccc-cccccccccc08', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8', '2026-01-01', 65000.00, 32500.00, 16250.00, 4167.00, 2707.25, 2707.25, 6668.50, 3900.00, 200.00, 65000.00, 4100.00, 60900.00),
('cccccccc-cccc-cccc-cccc-cccccccccc09', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9', '2026-01-01', 95000.00, 47500.00, 23750.00, 4167.00, 3956.75, 3956.75, 11669.50, 5700.00, 200.00, 95000.00, 5900.00, 89100.00),
('cccccccc-cccc-cccc-cccc-cccccccccc10', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10', '2026-01-01', 50000.00, 25000.00, 12500.00, 4167.00, 2082.50, 2082.50, 4168.00, 3000.00, 200.00, 50000.00, 3200.00, 46800.00),
('cccccccc-cccc-cccc-cccc-cccccccccc11', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', '2026-01-01', 82000.00, 41000.00, 20500.00, 4167.00, 3415.30, 3415.30, 9502.40, 4920.00, 200.00, 82000.00, 5120.00, 76880.00)
ON CONFLICT (employee_id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. ATTENDANCE LOGS (Past week)
-- ------------------------------------------------------------------------------
INSERT INTO attendance (employee_id, work_date, check_in, check_out, total_hours, status, notes) VALUES
-- Alex Rivera (EMP-003)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', CURRENT_DATE - INTERVAL '4 day', '2026-08-18 09:02:00+00', '2026-08-18 17:35:00+00', 8.55, 'PRESENT', 'Sprint kickoff'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', CURRENT_DATE - INTERVAL '3 day', '2026-08-19 09:15:00+00', '2026-08-19 18:00:00+00', 8.75, 'PRESENT', 'Backend integration'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', CURRENT_DATE - INTERVAL '2 day', '2026-08-20 08:55:00+00', '2026-08-20 17:30:00+00', 8.58, 'PRESENT', 'Feature testing'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', CURRENT_DATE - INTERVAL '1 day', '2026-08-21 09:00:00+00', '2026-08-21 13:15:00+00', 4.25, 'HALF_DAY', 'Dentist appointment'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', CURRENT_DATE, '2026-08-22 09:00:00+00', NULL, 0.00, 'PRESENT', 'Checked in for hackathon demo'),

-- Elena Rostova (EMP-004)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', CURRENT_DATE - INTERVAL '1 day', '2026-08-21 09:10:00+00', '2026-08-21 17:40:00+00', 8.50, 'PRESENT', 'Design review'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', CURRENT_DATE, '2026-08-22 08:45:00+00', NULL, 0.00, 'PRESENT', 'UI polish'),

-- Chloe Dupont (EMP-008) - On Approved Leave
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8', CURRENT_DATE, NULL, NULL, 0.00, 'ON_LEAVE', 'Approved Vacation')
ON CONFLICT (employee_id, work_date) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. LEAVE REQUESTS
-- ------------------------------------------------------------------------------
INSERT INTO leave_requests (id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, hr_comments, reviewed_by, reviewed_at) VALUES
-- Pending Request from Alex Rivera (EMP-003) for the Demo!
('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '11111111-1111-1111-1111-111111111102', CURRENT_DATE + INTERVAL '2 day', CURRENT_DATE + INTERVAL '3 day', 2, 'Recovery from mild viral fever and doctor consultation', 'PENDING', NULL, NULL, NULL),

-- Approved Request for Chloe Dupont (EMP-008)
('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8', '11111111-1111-1111-1111-111111111101', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '4 day', 5, 'Family vacation in Paris', 'APPROVED', 'Enjoy your holidays, Chloe!', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', CURRENT_DATE - INTERVAL '3 day'),

-- Rejected Request for David Chen (EMP-005)
('dddddddd-dddd-dddd-dddd-ddddddddddd3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', '11111111-1111-1111-1111-111111111103', CURRENT_DATE - INTERVAL '10 day', CURRENT_DATE - INTERVAL '9 day', 2, 'Personal trip during cloud migration window', 'REJECTED', 'Cannot approve time off during major Kubernetes migration. Please reschedule.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', CURRENT_DATE - INTERVAL '12 day');

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- ------------------------------------------------------------------------------
INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'LEAVE_SUBMITTED', 'New Leave Request from Alex Rivera', 'Alex Rivera (Senior Full Stack Engineer) has submitted a 2-day Sick Leave request for review.', false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'PAYROLL_UPDATED', 'Monthly Salary Slip Generated', 'Your salary structure for August 2026 has been computed and is available for download.', true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'LEAVE_APPROVED', 'Leave Request Approved', 'Your Paid Leave from Aug 21 to Aug 26 has been approved by HR Director Sarah Jenkins.', true);
