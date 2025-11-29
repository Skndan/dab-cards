import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/contacts/oauth`
);

export function getAuthUrl(userId: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/contacts'],
    state: userId,
  });
}

export async function getContacts(accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const people = google.people({ version: 'v1', auth: oauth2Client });
  
  try {
    const response = await people.people.connections.list({
      resourceName: 'people/me',
      pageSize: 1000,
      personFields: 'names,emailAddresses,phoneNumbers,organizations',
    });

    return response.data.connections || [];
  } catch (error) {
    console.error('Google Contacts fetch error:', error);
    return [];
  }
}

export async function syncContactToGoogle(
  accessToken: string,
  contact: {
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
  }
) {
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const people = google.people({ version: 'v1', auth: oauth2Client });

  try {
    await people.people.createContact({
      requestBody: {
        names: [{ givenName: contact.name }],
        emailAddresses: contact.email ? [{ value: contact.email }] : undefined,
        phoneNumbers: contact.phone ? [{ value: contact.phone }] : undefined,
        organizations: contact.company ? [{ name: contact.company }] : undefined,
      },
    });

    return true;
  } catch (error) {
    console.error('Google Contacts sync error:', error);
    return false;
  }
}

