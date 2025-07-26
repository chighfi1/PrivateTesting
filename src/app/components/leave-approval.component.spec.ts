import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { LeaveApprovalComponent } from './leave-approval.component';
import { LeaveRequest, ProcessedLeave } from '../models/leave.interface';

describe('LeaveApprovalComponent', () => {
  let component: LeaveApprovalComponent;
  let fixture: ComponentFixture<LeaveApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveApprovalComponent, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should approve leave if 10 days notice is given and leave is 5 days', () => {
    const daysInAdvance = 10;
    const leaveDuration = 5;
    const leaveDay1 = new Date(Date.now() + daysInAdvance * 24 * 60 * 60 * 1000);
    const leaveDay5 = new Date(leaveDay1.getTime() + (leaveDuration - 1) * 24 * 60 * 60 * 1000);

    const leaveRequest: LeaveRequest = {
      requestId: 'LR-TEST-001',
      employeeId: 'EMP-TEST',
      employeeName: 'John Doe',
      leaveType: 'vacation',
      startDate: leaveDay1,
      endDate: leaveDay5,
      reason: 'Test vacation',
    };

    component.onLeaveRequested(leaveRequest);

    expect(component.leaveMessage).toBe('Leave approved for John Doe (5 days)');
  });

  it('should reject leave and explain excess 14 day limit if leave duration exceeds 14 days', () => {
    const daysInAdvance = 10;
    const leaveDuration = 15;
    const leaveDay1 = new Date(Date.now() + daysInAdvance * 24 * 60 * 60 * 1000);
    const leaveDay15 = new Date(leaveDay1.getTime() + (leaveDuration - 1) * 24 * 60 * 60 * 1000);

    const leaveRequest: LeaveRequest = {
      requestId: 'LR-TEST-002',
      employeeId: 'EMP-TEST',
      employeeName: 'Jane Doe',
      leaveType: 'vacation',
      startDate: leaveDay1,
      endDate: leaveDay15,
      reason: 'Long vacation',
    };

    component.onLeaveRequested(leaveRequest);

    expect(component.leaveMessage).toBe('Leave rejected: Exceeds 14-day limit');
  });

  it('should reject leave and explain excess 14 day limit if start time is omitted from request', () => {
    const daysInAdvance = 10;
    const leaveDuration = 15;
    const leaveDay1 = new Date(Date.now() + daysInAdvance * 24 * 60 * 60 * 1000);
    const leaveDay15 = new Date(leaveDay1.getTime() + (leaveDuration - 1) * 24 * 60 * 60 * 1000);

    const leaveRequest: LeaveRequest = {
      requestId: 'LR-TEST-002',
      employeeId: 'EMP-TEST',
      employeeName: 'Jane Doe',
      leaveType: 'vacation',
      startDate: leaveDay1,
      endDate: leaveDay15,
      reason: 'Long vacation',
    };

    component.onLeaveRequested(leaveRequest);

    expect(component.leaveMessage).toBe('Leave rejected: Exceeds 14-day limit');
  });

  it('should reject leave if notice is less than 7 days', () => {
    const daysInAdvance = 3;
    const leaveDuration = 5;
    const leaveDay1 = new Date(Date.now() + daysInAdvance * 24 * 60 * 60 * 1000);
    const leaveDay5 = new Date(leaveDay1.getTime() + (leaveDuration - 1) * 24 * 60 * 60 * 1000);

    const leaveRequest: LeaveRequest = {
      requestId: 'LR-TEST-003',
      employeeId: 'EMP-TEST',
      employeeName: 'Sam Smith',
      leaveType: 'vacation',
      startDate: leaveDay1,
      endDate: leaveDay5,
      reason: 'Short notice vacation',
    };

    component.onLeaveRequested(leaveRequest);

    expect(component.leaveMessage).toBe('Leave rejected: Insufficient advance notice');
  });

  it('should approve leave if notice is exactly 7 days and leave is 1 day', () => {
    const daysInAdvance = 7;
    const leaveDuration = 1;
    const leaveDay1 = new Date(Date.now() + daysInAdvance * 24 * 60 * 60 * 1000);

    const leaveRequest: LeaveRequest = {
      requestId: 'LR-TEST-004',
      employeeId: 'EMP-TEST',
      employeeName: 'Alex Lee',
      leaveType: 'vacation',
      startDate: leaveDay1,
      endDate: leaveDay1,
      reason: 'Single day leave',
    };

    component.onLeaveRequested(leaveRequest);

    expect(component.leaveMessage).toBe('Leave approved for Alex Lee (1 day)');
  });

  // TODO: Add test cases for:
  // - processLeaveRequest with various scenarios
  // - calculateDays method
  // - calculateNotice method
  // - createRejection method
  // - simulateLeaveRequest method
  // - Edge cases for date calculations
  // - Boundary conditions for MAX_CONSECUTIVE_DAYS and MIN_NOTICE_DAYS
});
