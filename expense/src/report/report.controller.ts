import { Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { data, ReportType } from '../data'
import { v4 as uuid } from 'uuid'
import { ReportService } from "./report.service"
import { CreateReportDto, ReportResponseDto, UpdateReportDto } from '../dtos/report.dto'

@Controller("/report/:type")
export class ReportController {

  constructor(private readonly reportService: ReportService) { }
  
  @Get()
  getAllReports(@Param('type', new ParseEnumPipe(ReportType)) type: string): ReportResponseDto[] {
    console.log(type);
    const reportType = type === 'income' ? ReportType.Income : ReportType.Expense;
    // return data.report.filter((report) => report.type === reportType);
    return this.reportService.getAllReports(reportType);
  }
  
  @Get("/:id")
  getReportById(@Param('type', new ParseEnumPipe(ReportType)) type: string, @Param('id', ParseUUIDPipe) id: string): ReportResponseDto {
    const reportType = type === 'income' ? ReportType.Income : ReportType.Expense;
    // return data.report.filter((report) => report.type === reportType).find((report) => report.id === id);
    return this.reportService.getReportById(reportType, id);
  }

  @Post()
  createReport(@Body() { amount, source }: CreateReportDto, @Param('type', new ParseEnumPipe(ReportType)) type: string): ReportResponseDto {
    // const newReport = {
    //   id: uuid(),
    //   source,
    //   amount,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   type: type === 'income' ? ReportType.Income : ReportType.Expense,
    // }
    // data.report.push(newReport);

    // return newReport;
    const reportType = type === 'income' ? ReportType.Income : ReportType.Expense;
    return this.reportService.createReport(reportType, { source, amount });
  }

  @Put("/:id")
  updateReportById(@Body() body: UpdateReportDto, @Param('type') type: string, @Param('id', ParseUUIDPipe) id: string): ReportResponseDto {
    // const reportType = type === 'income' ? ReportType.Income : ReportType.Expense;
    // const report = data.report.filter((report) => report.type === reportType).find((report) => report.id === id);
    // if (!report)
    //   return;

    // report.amount = amount;
    // report.source = source;
    // report.updatedAt = new Date();
    // return report;


    // const reportIndex = data.report.findIndex((report) => report.id === id);
    // if (reportIndex === -1)
    //   return;

    // data.report[reportIndex] = {
    //   ...data.report[reportIndex],
    //   ...body,
    // }

    // return data.report[reportIndex]

    return this.reportService.updateReport(id, body);
  }

  @HttpCode(204)
  @Delete("/:id")
  deleteReportById(@Param('id', ParseUUIDPipe) id: string) {
    // const reportType = type === 'income' ? ReportType.Income : ReportType.Expense;
    // data.report.find((report, index) => )

    // const reportIndex = data.report.findIndex((report) => report.id === id);
    // if (reportIndex === -1)
    //   return;

    // data.report.splice(reportIndex, 1);

    // return "deleted";

    return this.reportService.deleteReport(id);
  }
}