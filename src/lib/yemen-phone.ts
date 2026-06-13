// Yemeni phone number validation utilities

export interface PhoneProvider {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  prefixes: string[];
}

// Yemeni telecom providers with their prefixes
export const yemenProviders: PhoneProvider[] = [
  {
    id: 'yemen-mobile',
    name: 'يمن موبايل',
    nameEn: 'Yemen Mobile',
    color: '#C41E3A',
    prefixes: ['770', '771', '772', '773', '777', '778', '780', '781', '782', '783', '784', '785', '786', '787', '788', '789', '730', '731', '732', '733', '734', '735', '736', '737', '738', '739', '700', '701', '702', '703', '704', '705', '706', '707', '708', '709'],
  },
  {
    id: 'yo',
    name: 'يو',
    nameEn: 'YO',
    color: '#FF6B00',
    prefixes: ['710', '711', '712', '713', '714', '715', '716', '717', '718', '719', '750', '751', '752', '753', '754', '755', '756', '757', '758', '759'],
  },
  {
    id: 'sabafon',
    name: 'سبأفون',
    nameEn: 'Sabafon',
    color: '#2563EB',
    prefixes: ['740', '741', '742', '743', '744', '745', '746', '747', '748', '749', '760', '761', '762', '763', '764', '765', '766', '767', '768', '769'],
  },
  {
    id: 'y',
    name: 'واي',
    nameEn: 'Y',
    color: '#059669',
    prefixes: ['720', '721', '722', '723', '724', '725', '726', '727', '728', '729', '790', '791', '792', '793', '794', '795', '796', '797', '798', '799'],
  },
];

/**
 * Validates a Yemeni phone number in +967XXXXXXXXX format
 * Accepts formats:
 * - +9677XXXXXXXX (13 digits with +967)
 * - 9677XXXXXXXX (12 digits with 967)
 * - 7XXXXXXXX (9 digits, local format)
 */
export function isValidYemeniPhone(phone: string): boolean {
  if (!phone) return false;
  
  // Clean the phone number
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check various formats
  let localNumber = '';
  
  if (cleaned.startsWith('+967')) {
    localNumber = cleaned.slice(4);
  } else if (cleaned.startsWith('967')) {
    localNumber = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    localNumber = cleaned.slice(1);
  } else {
    localNumber = cleaned;
  }
  
  // Must be exactly 9 digits starting with 7
  if (!/^7\d{8}$/.test(localNumber)) return false;
  
  // Must start with valid prefix (7X)
  const prefix = localNumber.slice(0, 2);
  if (!['70', '71', '72', '73', '74', '75', '76', '77', '78', '79'].includes(prefix)) return false;
  
  return true;
}

/**
 * Formats a Yemeni phone number to +967 XXX XXX XXX format
 */
export function formatYemeniPhone(phone: string): string {
  if (!phone) return '';
  
  const cleaned = cleanYemeniPhone(phone);
  if (!cleaned) return phone;
  
  // Extract the 9-digit local number
  let localNumber = '';
  if (cleaned.startsWith('+967')) {
    localNumber = cleaned.slice(4);
  } else if (cleaned.startsWith('967')) {
    localNumber = cleaned.slice(3);
  } else {
    localNumber = cleaned;
  }
  
  if (localNumber.length !== 9) return phone;
  
  // Format as +967 XXX XXX XXX
  return `+967 ${localNumber.slice(0, 3)} ${localNumber.slice(3, 6)} ${localNumber.slice(6, 9)}`;
}

/**
 * Detects the telecom provider from a Yemeni phone number
 * Returns provider ID or empty string if unknown
 */
export function getProviderFromPhone(phone: string): string {
  if (!phone) return '';
  
  const cleaned = cleanYemeniPhone(phone);
  if (!cleaned) return '';
  
  let localNumber = '';
  if (cleaned.startsWith('+967')) {
    localNumber = cleaned.slice(4);
  } else if (cleaned.startsWith('967')) {
    localNumber = cleaned.slice(3);
  } else {
    localNumber = cleaned;
  }
  
  if (localNumber.length < 3) return '';
  
  const prefix3 = localNumber.slice(0, 3);
  const prefix2 = localNumber.slice(0, 2);
  
  // واي (Y) - 72X, 79X
  if (prefix2 === '72' || prefix2 === '79') return 'y';
  
  // يو (YO) - 71X, 75X
  if (prefix2 === '71' || prefix2 === '75') return 'yo';
  
  // سبأفون (Sabafon) - 74X, 76X
  if (prefix2 === '74' || prefix2 === '76') return 'sabafon';
  
  // يمن موبايل (Yemen Mobile) - 77X, 78X, 73X, 70X
  if (['77', '78', '73', '70'].includes(prefix2)) return 'yemen-mobile';
  
  return '';
}

/**
 * Gets the provider object from a phone number
 */
export function getProviderInfoFromPhone(phone: string): PhoneProvider | null {
  const providerId = getProviderFromPhone(phone);
  return yemenProviders.find(p => p.id === providerId) || null;
}

/**
 * Removes all formatting from a Yemeni phone number
 * Returns the number in +967XXXXXXXXX format or empty string if invalid
 */
export function cleanYemeniPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters except leading +
  const stripped = phone.replace(/[^\d+]/g, '');
  
  let localNumber = '';
  
  if (stripped.startsWith('+967')) {
    localNumber = stripped.slice(4);
  } else if (stripped.startsWith('967')) {
    localNumber = stripped.slice(3);
  } else if (stripped.startsWith('0')) {
    localNumber = stripped.slice(1);
  } else {
    localNumber = stripped;
  }
  
  // Validate the local number
  if (!/^7\d{0,8}$/.test(localNumber)) {
    // Return what we have if it's partially valid
    if (localNumber.startsWith('7') && localNumber.length <= 9) {
      return `+967${localNumber}`;
    }
    return '';
  }
  
  return `+967${localNumber}`;
}

/**
 * Extracts the 9-digit local number from any format
 */
export function getLocalNumber(phone: string): string {
  if (!phone) return '';
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('+967')) {
    return cleaned.slice(4);
  } else if (cleaned.startsWith('967')) {
    return cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    return cleaned.slice(1);
  }
  
  return cleaned;
}

/**
 * Validates a partial Yemeni phone number (during input)
 */
export function isValidPartialYemeniPhone(partial: string): boolean {
  if (!partial) return true; // Empty is valid (user hasn't typed yet)
  
  const digits = partial.replace(/\D/g, '');
  
  // Must start with 7
  if (digits.length > 0 && !digits.startsWith('7')) return false;
  
  // Must not exceed 9 digits
  if (digits.length > 9) return false;
  
  return true;
}

/**
 * Gets validation message in Arabic for a phone number
 */
export function getPhoneValidationMessage(phone: string): string {
  if (!phone) return '';
  
  const local = getLocalNumber(phone);
  
  if (local.length === 0) return '';
  if (!local.startsWith('7')) return 'يجب أن يبدأ الرقم بـ 7';
  if (local.length < 3) return '';
  
  const prefix = local.slice(0, 2);
  if (!['70', '71', '72', '73', '74', '75', '76', '77', '78', '79'].includes(prefix)) return 'بادئة غير صالحة';
  
  if (local.length < 9) return `أدخل ${9 - local.length} أرقام أخرى`;
  if (local.length > 9) return 'الرقم طويل جداً';
  
  // Full validation
  if (isValidYemeniPhone(phone)) {
    const provider = getProviderInfoFromPhone(phone);
    if (provider) {
      return `رقم ${provider.name} صحيح ✓`;
    }
    return 'رقم صحيح ✓';
  }
  
  return 'رقم غير صالح';
}
