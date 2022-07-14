import { Injectable } from "@nestjs/common";
import { data, ReportData, ReportType } from "../data";
import { v4 as uuid } from 'uuid'
import { ReportResponseDto } from "../dtos/report.dto";

@Injectable()
export class ReportService {
  getAllReports(type: ReportType): ReportResponseDto[] {
    // return data.report.filter((report) => report.type === type);
    return data.report.filter((report) => report.type === type).map(report => new ReportResponseDto(report));
  }

  getReportById(type: ReportType, id: string): ReportResponseDto {
    // return data.report.filter((report) => report.type === type).find((report) => report.id === id);
    const report = data.report.filter((report) => report.type === type).find((report) => report.id === id);
    if (!report) return;

    return new ReportResponseDto(report);
  }

  createReport(type: ReportType, reportData: ReportData): ReportResponseDto {
    const newReport = {
      id: uuid(),
      source: reportData.source,
      amount: reportData.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
      type,
    }
    data.report.push(newReport);

    return new ReportResponseDto(newReport);
  }

  updateReport(id: string, reportData: ReportData): ReportResponseDto {
    const reportIndex = data.report.findIndex((report) => report.id === id);
    if (reportIndex === -1)
      return;

    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...reportData,
      updatedAt: new Date(),
    }

    return new ReportResponseDto(data.report[reportIndex]);
  }

  deleteReport(id: string) {
    const reportIndex = data.report.findIndex((report) => report.id === id);
    if (reportIndex === -1)
      return;

    data.report.splice(reportIndex, 1);
  }
}