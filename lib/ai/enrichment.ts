import OpenAI from 'openai';
import Groq from 'groq';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface EnrichmentData {
  linkedinUrl?: string;
  linkedinSummary?: string;
  skills?: string[];
  seniority?: string;
  companySize?: string;
  companyFunding?: string;
  industry?: string;
  leadScore: number;
  aiSummary: string;
}

export async function enrichContact(contact: {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  jobTitle?: string | null;
}): Promise<EnrichmentData> {
  try {
    // Generate AI summary and enrichment data
    const prompt = `
You are a professional contact enrichment AI. Given the following contact information, provide enrichment data.

Contact Information:
- Name: ${contact.name}
- Email: ${contact.email || 'Not provided'}
- Phone: ${contact.phone || 'Not provided'}
- Company: ${contact.company || 'Not provided'}
- Job Title: ${contact.jobTitle || 'Not provided'}

Please provide:
1. Estimated seniority level (Junior, Mid-level, Senior, Executive, C-Level)
2. Likely industry based on available information
3. A brief professional summary (2-3 sentences)
4. Lead score (0-100) based on seniority and completeness of information
5. Likely skills based on job title
6. Estimated company size if company is known

Response format (JSON):
{
  "seniority": "...",
  "industry": "...",
  "aiSummary": "...",
  "leadScore": 0-100,
  "skills": ["skill1", "skill2"],
  "companySize": "...",
  "companyFunding": "..."
}
`;

    const completion = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: 'You are a professional contact enrichment AI. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      seniority: result.seniority || 'Unknown',
      industry: result.industry || 'Unknown',
      aiSummary: result.aiSummary || 'No summary available',
      leadScore: result.leadScore || 50,
      skills: result.skills || [],
      companySize: result.companySize,
      companyFunding: result.companyFunding,
    };
  } catch (error) {
    console.error('Enrichment error:', error);
    
    // Return default enrichment if AI fails
    return {
      seniority: 'Unknown',
      industry: 'Unknown',
      aiSummary: 'Unable to generate summary',
      leadScore: 50,
      skills: [],
    };
  }
}

// Search for LinkedIn profile (placeholder - would use real API)
export async function searchLinkedIn(name: string, company?: string): Promise<{
  url?: string;
  summary?: string;
}> {
  // TODO: Implement real LinkedIn search using API or service
  // For now, return placeholder
  return {
    url: undefined,
    summary: undefined,
  };
}

// Calculate lead score based on multiple factors
export function calculateLeadScore(factors: {
  hasEmail: boolean;
  hasPhone: boolean;
  hasCompany: boolean;
  hasJobTitle: boolean;
  seniority?: string;
  industry?: string;
}): number {
  let score = 0;

  // Contact information completeness
  if (factors.hasEmail) score += 20;
  if (factors.hasPhone) score += 15;
  if (factors.hasCompany) score += 15;
  if (factors.hasJobTitle) score += 10;

  // Seniority weight
  const seniorityScores: Record<string, number> = {
    'C-Level': 40,
    'Executive': 35,
    'Senior': 25,
    'Mid-level': 15,
    'Junior': 10,
  };
  score += seniorityScores[factors.seniority || ''] || 10;

  // Cap at 100
  return Math.min(score, 100);
}

