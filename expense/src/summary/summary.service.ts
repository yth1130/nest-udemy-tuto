import { Injectable } from '@nestjs/common';
import { ReportType } from 'src/data';
import { ReportService } from 'src/report/report.service';

@Injectable()
export class SummaryService {

    constructor(private readonly reportService: ReportService) {}
    
    calculateSummary() {
        const totalExpense = this.reportService.getAllReports(ReportType.Expense).reduce((sum, report) => sum + report.amount, 0);
        const totalIncome = this.reportService.getAllReports(ReportType.Income).reduce((sum, report) => sum + report.amount, 0);
        return {
            totalIncome,
            totalExpense,
            netIncome: totalIncome - totalExpense,
        }
    }
}
