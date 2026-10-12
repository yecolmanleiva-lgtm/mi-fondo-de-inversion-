export type Entry={id:string;amount:number;date:string;period:string;note:string};
export type Settings={fundName:string;monthly:number;goal:number;day:number;time:string;advance:number;pending:boolean;enabled:boolean;startMonth:string;theme:'light'|'dark'|'system';valuation:number|null;valuationDate:string|null};
export type Portfolio={version:number;revision:number;entries:Entry[];settings:Settings;snooze:{period:string;until:number}|null};
