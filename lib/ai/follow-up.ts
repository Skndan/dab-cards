import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FollowUpMessages {
  email: {
    subject: string;
    body: string;
  };
  linkedin: string;
  whatsapp: string;
  suggestedTiming: '1day' | '3days' | '1week' | '2weeks';
  reasoning: string;
}

export async function generateFollowUp(contact: {
  name: string;
  company?: string | null;
  jobTitle?: string | null;
  industry?: string;
  notes?: string | null;
  category?: string;
  meetingContext?: string;
}): Promise<FollowUpMessages> {
  try {
    const prompt = `
Generate personalized follow-up messages for this contact:

Contact Information:
- Name: ${contact.name}
- Company: ${contact.company || 'Unknown'}
- Job Title: ${contact.jobTitle || 'Unknown'}
- Industry: ${contact.industry || 'Unknown'}
- Category: ${contact.category || 'Unknown'}
- Notes: ${contact.notes || 'None'}
- Meeting Context: ${contact.meetingContext || 'First contact'}

Generate three follow-up message variations:
1. Professional email (subject + body)
2. LinkedIn connection note
3. WhatsApp/Telegram message

Also suggest optimal timing for follow-up (1day, 3days, 1week, or 2weeks) and explain why.

Guidelines:
- Keep messages concise and professional
- Reference any specific context from notes
- Personalize based on their role and industry
- Include clear call-to-action
- Avoid being too salesy

Respond with JSON:
{
  "email": {
    "subject": "...",
    "body": "..."
  },
  "linkedin": "...",
  "whatsapp": "...",
  "suggestedTiming": "1day|3days|1week|2weeks",
  "reasoning": "..."
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional networking AI that generates personalized follow-up messages. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      email: {
        subject: result.email?.subject || `Great meeting you, ${contact.name}!`,
        body: result.email?.body || `Hi ${contact.name},\n\nIt was great connecting with you. I'd love to continue our conversation.\n\nBest regards`,
      },
      linkedin: result.linkedin || `Hi ${contact.name}, great meeting you! Would love to connect here.`,
      whatsapp: result.whatsapp || `Hi ${contact.name}! Great meeting you. Let's stay in touch!`,
      suggestedTiming: result.suggestedTiming || '3days',
      reasoning: result.reasoning || 'Standard follow-up timing',
    };
  } catch (error) {
    console.error('Follow-up generation error:', error);
    
    // Return default messages
    return {
      email: {
        subject: `Great meeting you, ${contact.name}!`,
        body: `Hi ${contact.name},\n\nIt was great connecting with you recently. I wanted to follow up and see if there's any way we can collaborate or if you need any assistance.\n\nLooking forward to staying in touch!\n\nBest regards`,
      },
      linkedin: `Hi ${contact.name}, it was great meeting you! I'd love to connect and stay in touch.`,
      whatsapp: `Hi ${contact.name}! Great meeting you. Let's stay connected!`,
      suggestedTiming: '3days',
      reasoning: 'Standard professional follow-up after 3 days',
    };
  }
}

// Generate multiple follow-up variations
export async function generateFollowUpVariations(
  contact: {
    name: string;
    company?: string | null;
    jobTitle?: string | null;
    notes?: string | null;
  },
  count: number = 3
): Promise<FollowUpMessages[]> {
  const variations: FollowUpMessages[] = [];

  for (let i = 0; i < count; i++) {
    const result = await generateFollowUp(contact);
    variations.push(result);
    
    // Small delay to get varied responses
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return variations;
}

