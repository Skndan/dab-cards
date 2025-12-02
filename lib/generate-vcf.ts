/**
 * Generate a VCF (vCard) file from card data
 * Supports vCard 3.0 format for maximum compatibility
 */

interface VCFData {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  profilePicture?: string;
}

export function generateVCF(data: VCFData): string {
  const lines: string[] = [];

  // VCF header
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');

  // Name (required)
  // Format: N:LastName;FirstName;MiddleName;Prefix;Suffix
  // For simplicity, we'll put the full name in FirstName field
  const nameParts = data.name.trim().split(' ');
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : data.name;
  lines.push(`N:${lastName};${firstName};;;`);
  lines.push(`FN:${data.name}`);

  // Title and Organization
  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  // Contact information
  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  }

  if (data.phone) {
    // Remove any formatting from phone number for better compatibility
    const cleanPhone = data.phone.replace(/[^\d+]/g, '');
    lines.push(`TEL;TYPE=CELL:${cleanPhone}`);
  }

  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  // Address (location)
  if (data.location) {
    // Format: ADR:;;street;city;state;postal;country
    lines.push(`ADR;TYPE=WORK:;;${data.location};;;;`);
  }

  // Photo (profile picture)
  if (data.profilePicture) {
    lines.push(`PHOTO;VALUE=URI:${data.profilePicture}`);
  }

  // VCF footer
  lines.push('END:VCARD');

  return lines.join('\r\n');
}
