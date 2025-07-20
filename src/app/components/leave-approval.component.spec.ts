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

  // Test setup helpers
  const createMockLeaveRequest = (overrides: Partial<LeaveRequest> = {}): LeaveRequest => {
    return {
      requestId: 'LR-TEST-001',
      employeeId: 'EMP-TEST',
      employeeName: 'Test Employee',
      leaveType: 'vacation',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),   // 12 days from now
      reason: 'Test vacation',
      ...overrides
    };
  };

  describe('executeApprovalOutcome', () => {
    it('should set approval message when leave is approved', () => {
      const approvedLeave: ProcessedLeave = {
        requestId: 'LR-TEST-001',
        employeeId: 'EMP-TEST',
        employeeName: 'John Doe',
        leaveType: 'vacation',
        startDate: new Date(),
        endDate: new Date(),
        reason: 'Test vacation',
        status: 'approved',
        daysRequested: 5
      };

      component.executeApprovalOutcome(approvedLeave);

      expect(component.leaveMessage).toBe('Leave approved for John Doe (5 days)');
    });

    it('should set rejection message when leave is rejected', () => {
      const rejectedLeave: ProcessedLeave = {
        requestId: 'LR-TEST-002',
        employeeId: 'EMP-TEST',
        employeeName: 'Jane Smith',
        leaveType: 'vacation',
        startDate: new Date(),
        endDate: new Date(),
        reason: 'Test vacation',
        status: 'rejected',
        rejectionReason: 'Exceeds 14-day limit',
        daysRequested: 20
      };

      component.executeApprovalOutcome(rejectedLeave);

      expect(component.leaveMessage).toBe('Leave rejected: Exceeds 14-day limit');
    });
  });

  // TODO: Add test cases for:
  // - onLeaveRequested method
  // - processLeaveRequest with various scenarios
  // - calculateDays method
  // - calculateNotice method
  // - createRejection method
  // - simulateLeaveRequest method
  // - Edge cases for date calculations
  // - Boundary conditions for MAX_CONSECUTIVE_DAYS and MIN_NOTICE_DAYS
});
