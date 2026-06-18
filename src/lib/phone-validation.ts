import { COUNTRY_CODES } from '@/lib/country-codes';

export interface PhoneLimits {
  minLength: number;
  maxLength: number;
}

export function getPhoneLimits(countryCode: string): PhoneLimits | null {
  const entry = COUNTRY_CODES.find((c) => c.code === countryCode);
  if (!entry) return null;
  return { minLength: entry.minLength, maxLength: entry.maxLength };
}

export interface PhoneValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePhone(
  phoneNumber: string,
  countryCode: string,
): PhoneValidationResult {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { valid: false, error: 'Phone number is required' };
  }

  if (!/^\d+$/.test(phoneNumber)) {
    return { valid: false, error: 'Phone number must contain only digits' };
  }

  const limits = getPhoneLimits(countryCode);
  if (!limits) {
    return { valid: false, error: 'Invalid country code' };
  }

  if (phoneNumber.length < limits.minLength) {
    return {
      valid: false,
      error: `Phone number must be at least ${limits.minLength} digits (currently ${phoneNumber.length})`,
    };
  }

  if (phoneNumber.length > limits.maxLength) {
    return {
      valid: false,
      error: `Phone number must be at most ${limits.maxLength} digits (currently ${phoneNumber.length})`,
    };
  }

  return { valid: true };
}
