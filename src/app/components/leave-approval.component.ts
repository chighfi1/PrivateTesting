import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRequest, ProcessedLeave } from '../models/leave.interface';

@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-approval.component.html',
  styleUrl: './leave-approval.component.scss'
})
export class LeaveApprovalComponent {
  currentLeave: ProcessedLeave | null = null;
  
  private readonly MAX_CONSECUTIVE_DAYS = 14;
  private readonly MIN_NOTICE_DAYS = 7;
  leaveMessage: string = '';

  // EVENT: Leave request submission triggered by user action
  onLeaveRequested(request: LeaveRequest): void {
    console.log('Leave request submitted:', request.requestId);
    this.currentLeave = this.processLeaveRequest(request);
    this.executeApprovalOutcome(this.currentLeave);
  }

    // BUSINESS LOGIC: Core processing with validation and calculations
  processLeaveRequest(request: LeaveRequest): ProcessedLeave {
    const daysRequested = this.calculateDays(request.startDate, request.endDate);
    
    if (daysRequested > this.MAX_CONSECUTIVE_DAYS) {
      return this.createRejection(request, daysRequested, 'Exceeds 14-day limit');
    }
    
    const noticeGiven = this.calculateNotice(request.startDate);
    if (noticeGiven < this.MIN_NOTICE_DAYS) {
      return this.createRejection(request, daysRequested, 'Insufficient advance notice');
    }
    
    return { ...request, status: 'approved', daysRequested };
  }

  // Outcome: Execute the result of the leave request processing
  executeApprovalOutcome(leave: ProcessedLeave): void {
    if (leave.status === 'approved') {
      this.leaveMessage = `Leave approved for ${leave.employeeName} (${leave.daysRequested} days)`;
    } else {
      this.leaveMessage = `Leave rejected: ${leave.rejectionReason}`;
    }
  }

  calculateDays(start: Date, end: Date): number {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  calculateNotice(startDate: Date): number {
    return Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  createRejection(request: LeaveRequest, days: number, reason: string): ProcessedLeave {
    return { ...request, status: 'rejected', rejectionReason: reason, daysRequested: days };
  }

  simulateLeaveRequest(): void {
    const sampleRequest: LeaveRequest = {
      requestId: 'LR-2025-001',
      employeeId: 'EMP-123',
      employeeName: 'John Smith',
      leaveType: 'vacation',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      reason: 'Family vacation'
    };

    this.onLeaveRequested(sampleRequest);
  }
}
