import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format balance with Arabic numerals
export function formatBalance(amount: number, currency: string): string {
  const formatted = amount.toLocaleString('ar-SA');
  return formatted;
}

// Generate userId starting with "10" + 4 random digits
export function generateUserId(): string {
  const random4 = Math.floor(1000 + Math.random() * 9000).toString();
  return '10' + random4;
}

// Generate transaction reference
export function generateReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'FH-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Currency symbols
export const currencySymbols: Record<string, string> = {
  YER: 'ر.ي',
  SAR: 'ر.س',
  USD: '$',
};

export const currencyNames: Record<string, string> = {
  YER: 'الريال اليمني',
  SAR: 'الريال السعودي',
  USD: 'الدولار الأمريكي',
};

// Currency flags - text indicators (NO emojis)
export const currencyFlags: Record<string, string> = {
  YER: 'YER',
  SAR: 'SAR',
  USD: 'USD',
};

// Currency badge background colors
export const currencyBadgeColors: Record<string, string> = {
  YER: '#E60000',
  SAR: '#059669',
  USD: '#2563EB',
};

// Southern Yemen governorates
export const governorates = [
  'عدن',
  'لحج',
  'أبين',
  'شبوة',
  'حضرموت',
  'المهرة',
  'الضالع',
  'سقطرى',
];

// Card types
export const cardTypes = [
  'بطاقة شخصية',
  'جواز سفر',
  'رخصة قيادة',
];
