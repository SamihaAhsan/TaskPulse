INSERT INTO teams (team_id, name, department, total_headcount, specializations) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Alpha Squad', 'Fraud & Risk', 5, ARRAY['fraud_detection','aml','transaction_monitoring']),
  ('11111111-0000-0000-0000-000000000002', 'Beta Squad', 'Customer Ops', 4, ARRAY['kyc','onboarding','account_management']),
  ('11111111-0000-0000-0000-000000000003', 'Gamma Squad', 'Infrastructure', 6, ARRAY['network_ops','incident_response','cloud_infra']),
  ('11111111-0000-0000-0000-000000000004', 'Delta Squad', 'Compliance', 3, ARRAY['regulatory_reporting','audit','risk_assessment']);

INSERT INTO team_members (member_id, team_id, name, role, skills, is_active) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Alice Chen', 'Senior Analyst', ARRAY['fraud_detection','aml'], TRUE),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Bob Smith', 'Analyst', ARRAY['transaction_monitoring'], TRUE),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'Carol Davis', 'KYC Specialist', ARRAY['kyc','onboarding'], TRUE),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Dan Lee', 'Ops Analyst', ARRAY['account_management'], TRUE),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003', 'Eva Kim', 'DevOps Engineer', ARRAY['network_ops','cloud_infra'], TRUE),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000004', 'Frank Wu', 'Compliance Officer', ARRAY['regulatory_reporting','audit'], TRUE);

INSERT INTO leave_calendar (member_id, start_date, end_date, leave_type, approved) VALUES
  ('22222222-0000-0000-0000-000000000001', '2026-05-26', '2026-06-06', 'vacation', TRUE),
  ('22222222-0000-0000-0000-000000000003', '2026-05-27', '2026-06-03', 'vacation', TRUE);

INSERT INTO tasks (title, task_type, priority, estimated_effort_hrs, deadline, status) VALUES
  ('Investigate suspicious transaction #8821', 'fraud_detection', 'P1', 2.0, NOW() + INTERVAL '4 hours', 'pending'),
  ('Complete KYC verification for new corporate client', 'kyc', 'P2', 4.0, NOW() + INTERVAL '24 hours', 'pending'),
  ('Respond to network latency alert in prod cluster', 'incident_response', 'P1', 1.5, NOW() + INTERVAL '2 hours', 'pending'),
  ('Prepare Q2 regulatory report', 'regulatory_reporting', 'P3', 8.0, NOW() + INTERVAL '72 hours', 'pending'),
  ('Onboard new retail banking client batch', 'onboarding', 'P2', 3.0, NOW() + INTERVAL '48 hours', 'pending');