import { CAN_MAP, CHI_MAP, MONTH_MAP } from "@/constants/lunar";
import { Solar, Lunar } from "lunar-javascript";

function convertYearToVietnamese(ganzhi: string): string {
  const can = CAN_MAP[ganzhi[0]];
  const chi = CHI_MAP[ganzhi[1]];
  return `${can} ${chi}`;
}
export function getLunarDeathAnniversary(dateString: string | null | undefined): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const solar = Solar.fromDate(date);
    const lunar = Lunar.fromSolar(solar);

    // Format output
    const day = lunar.getDay();
    const dayStr = day < 10 ? `Mùng ${day}` : `${day}`;
    
    // In Lunar dates, sometimes there are leap months
    const monthChinese = lunar.getMonthInChinese(); 
    const month = MONTH_MAP[monthChinese];
    
    const yearChinese = lunar.getYearInGanZhi(); // e.g., Giáp Thìn
    const year = convertYearToVietnamese(yearChinese);

    return `${dayStr} tháng ${month} năm ${year}`;
  } catch (error) {
    console.error("Error parsing Lunar Date:", error);
    return null;
  }
}
