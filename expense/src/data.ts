interface Data {
    report: {
        id: string;
        source: string;
        amount:number;
        createdAt: Date;
        updatedAt: Date;
        type: ReportType
    }[]
}

export interface ReportData {
    source: string;
    amount: number;
}

export enum ReportType {
    Income = 'income',
    Expense = 'expense',
    // Income,
    // Expense,
}

export const data: Data = {
    report: [{
        id:'uuid1',
        source: "salary",
        amount: 7500,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: ReportType.Income,
    }, {
        id:'uuid2',
        source: "youtube",
        amount: 2500,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: ReportType.Income,
    }, {
        id:'uuid3',
        source: "food",
        amount: 5500,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: ReportType.Expense,
    }]
}