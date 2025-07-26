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

  onLeaveRequested(request: LeaveRequest): void {
    console.log('Leave request submitted:', request.requestId);
    this.currentLeave = this.processLeaveRequest(request);
    this.executeApprovalOutcome(this.currentLeave);
  }

  private processLeaveRequest(request: LeaveRequest): ProcessedLeave {
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

  private executeApprovalOutcome(leave: ProcessedLeave): void {
    if (leave.status === 'approved') {
      this.leaveMessage = `Leave approved for ${leave.employeeName} (${leave.daysRequested} days)`;
    } else {
      this.leaveMessage = `Leave rejected: ${leave.rejectionReason}`;
    }
  }

  private calculateDays(start: Date, end: Date): number {
    if(start === null) {
      // Highest possible date in JavaScript
      return new Date(8640000000000000).getTime();
    }
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  private calculateNotice(startDate: Date): number {
    return Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  private createRejection(request: LeaveRequest, days: number, reason: string): ProcessedLeave {
    return { ...request, status: 'rejected', rejectionReason: reason, daysRequested: days };
  }

}
