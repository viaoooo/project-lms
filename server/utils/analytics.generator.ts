import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

// generate last 12 months analytics
export async function generateLast12MonthsData<T extends Document>(model: Model<T>): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = []; // looping start -12 month dari bulan sekarang
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); //tomorrow we setting this current date value

  // 12 month data
  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28); //this will go back to 28 days previous month
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);

    const monthYear = endDate.toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" });
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });
    last12Months.push({ month: monthYear, count });
  }
  return { last12Months };
}
