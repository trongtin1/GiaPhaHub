declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }
  export class Lunar {
    static fromSolar(solar: Solar): Lunar;
    getDay(): number;
    getMonthInChinese(): string;
    getYearInGanZhi(): string;
  }
}
