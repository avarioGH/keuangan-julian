import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  // Departments
  async getDepartments(companyId: string) {
    return this.prisma.department.findMany({
      where: { company_id: companyId },
      include: { _count: { select: { employees: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async createDepartment(data: any) {
    return this.prisma.department.create({
      data: {
        company_id: data.companyId,
        name: data.name,
        description: data.description,
      },
    });
  }

  // Employees
  async getEmployees(companyId: string) {
    return this.prisma.employee.findMany({
      where: { company_id: companyId },
      include: { department: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async createEmployee(data: any) {
    return this.prisma.employee.create({
      data: {
        company_id: data.companyId,
        department_id: data.departmentId,
        employee_code: data.employeeCode || `EMP-${Date.now()}`,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        status: 'ACTIVE',
        basic_salary: data.basicSalary || 0,
        join_date: new Date(),
      },
    });
  }

  // Attendance
  async getAttendances(companyId: string) {
    return this.prisma.attendance.findMany({
      where: { employee: { company_id: companyId } },
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }

  async createAttendance(data: any) {
    return this.prisma.attendance.create({
      data: {
        employee_id: data.employeeId,
        date: new Date(data.date),
        status: data.status,
        check_in: data.checkIn ? new Date(data.checkIn) : null,
        check_out: data.checkOut ? new Date(data.checkOut) : null,
        notes: data.notes,
      },
    });
  }

  // Payroll
  async getPayrolls(companyId: string) {
    return this.prisma.payroll.findMany({
      where: { employee: { company_id: companyId } },
      include: { employee: true, items: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async createPayroll(data: any) {
    return this.prisma.$transaction(async (tx) => {
      let totalAllowance = 0;
      let totalDeduction = 0;

      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          if (item.type === 'ALLOWANCE') totalAllowance += Number(item.amount);
          if (item.type === 'DEDUCTION') totalDeduction += Number(item.amount);
        });
      }

      const basicSalary = Number(data.basicSalary || 0);
      const netSalary = basicSalary + totalAllowance - totalDeduction;

      const payroll = await tx.payroll.create({
        data: {
          employee_id: data.employeeId,
          period: data.period,
          basic_salary: basicSalary,
          total_allowance: totalAllowance,
          total_deduction: totalDeduction,
          net_salary: netSalary,
          status: 'DRAFT',
        },
      });

      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await tx.payrollItem.create({
            data: {
              payroll_id: payroll.id,
              type: item.type,
              name: item.name,
              amount: Number(item.amount),
            },
          });
        }
      }

      return payroll;
    });
  }
}
