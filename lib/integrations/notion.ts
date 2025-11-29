import { Client } from '@notionhq/client';

export function createNotionClient(accessToken: string) {
  return new Client({ auth: accessToken });
}

export async function createContactDatabase(accessToken: string) {
  const notion = createNotionClient(accessToken);

  try {
    // Create a new database in Notion
    const response = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: process.env.NOTION_PARENT_PAGE_ID || '',
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Contacts',
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Email: {
          email: {},
        },
        Phone: {
          phone_number: {},
        },
        Company: {
          rich_text: {},
        },
        'Job Title': {
          rich_text: {},
        },
        'Lead Score': {
          number: {},
        },
        Category: {
          select: {
            options: [
              { name: 'Lead', color: 'blue' },
              { name: 'Client', color: 'green' },
              { name: 'Recruiter', color: 'purple' },
              { name: 'Investor', color: 'red' },
              { name: 'Vendor', color: 'yellow' },
              { name: 'Partner', color: 'pink' },
            ],
          },
        },
        'Created Date': {
          date: {},
        },
      },
    });

    return response.id;
  } catch (error) {
    console.error('Notion database creation error:', error);
    return null;
  }
}

export async function syncContactToNotion(
  accessToken: string,
  databaseId: string,
  contact: {
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    leadScore?: number;
    category?: string;
  }
) {
  const notion = createNotionClient(accessToken);

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: contact.name,
              },
            },
          ],
        },
        Email: contact.email ? { email: contact.email } : undefined,
        Phone: contact.phone ? { phone_number: contact.phone } : undefined,
        Company: contact.company
          ? {
              rich_text: [
                {
                  text: {
                    content: contact.company,
                  },
                },
              ],
            }
          : undefined,
        'Job Title': contact.jobTitle
          ? {
              rich_text: [
                {
                  text: {
                    content: contact.jobTitle,
                  },
                },
              ],
            }
          : undefined,
        'Lead Score': contact.leadScore ? { number: contact.leadScore } : undefined,
        Category: contact.category ? { select: { name: contact.category } } : undefined,
        'Created Date': {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    return true;
  } catch (error) {
    console.error('Notion sync error:', error);
    return false;
  }
}

