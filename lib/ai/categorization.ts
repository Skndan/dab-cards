import Groq from 'groq';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type ContactCategory = 
  | 'Lead'
  | 'Client'
  | 'Recruiter'
  | 'Investor'
  | 'Vendor'
  | 'Partner'
  | 'Event Networking'
  | 'Casual Connection'
  | 'Other';

export interface CategorizationResult {
  category: ContactCategory;
  confidence: number; // 0.00 to 1.00
  reasoning: string;
}

export async function categorizeContact(contact: {
  name: string;
  email?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  notes?: string | null;
  industry?: string;
}): Promise<CategorizationResult> {
  try {
    const prompt = `
Categorize this contact into one of the following categories:
- Lead: Potential customer or client
- Client: Existing customer or client
- Recruiter: HR professional or recruiter
- Investor: Potential investor or VC
- Vendor: Service provider or supplier
- Partner: Business partner or collaborator
- Event Networking: Met at an event or conference
- Casual Connection: Personal or informal connection
- Other: Doesn't fit other categories

Contact Information:
- Name: ${contact.name}
- Email: ${contact.email || 'Not provided'}
- Company: ${contact.company || 'Not provided'}
- Job Title: ${contact.jobTitle || 'Not provided'}
- Notes: ${contact.notes || 'None'}
- Industry: ${contact.industry || 'Unknown'}

Provide your response as JSON with:
{
  "category": "...",
  "confidence": 0.00-1.00,
  "reasoning": "Brief explanation"
}
`;

    const completion = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: 'You are an AI that categorizes professional contacts. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      category: (result.category || 'Other') as ContactCategory,
      confidence: result.confidence || 0.5,
      reasoning: result.reasoning || 'Unable to determine category',
    };
  } catch (error) {
    console.error('Categorization error:', error);
    return {
      category: 'Other',
      confidence: 0.5,
      reasoning: 'Error during categorization',
    };
  }
}

// Batch categorize multiple contacts
export async function batchCategorize(
  contacts: Array<{
    id: string;
    name: string;
    email?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    notes?: string | null;
  }>
): Promise<Map<string, CategorizationResult>> {
  const results = new Map<string, CategorizationResult>();

  // Process in batches of 5 to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);
    const promises = batch.map(async (contact) => {
      const result = await categorizeContact(contact);
      return { id: contact.id, result };
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ id, result }) => {
      results.set(id, result);
    });

    // Small delay between batches
    if (i + batchSize < contacts.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

