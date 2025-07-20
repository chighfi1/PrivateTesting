export interface LeaveRequest {
  requestId: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'vacation' | 'sick' | 'personal';
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface ProcessedLeave extends LeaveRequest {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  daysRequested: number;
}
