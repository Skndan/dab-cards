import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/src/db/client';
import { users, teams, teamMembers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, industry, websiteUrl } = body;

    if (!name || !industry) {
      return NextResponse.json(
        { error: 'Organization name and industry are required' },
        { status: 400 }
      );
    }

    // Get current user
    const user = await db.query.users.findFirst({
      where: eq(users.keycloakId, session.user.sub),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has an organization
    const existingMembership = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, user.id),
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User already belongs to an organization' },
        { status: 400 }
      );
    }

    // Generate slug from organization name
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (true) {
      const existingTeam = await db.query.teams.findFirst({
        where: eq(teams.slug, slug),
      });

      if (!existingTeam) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Normalize website URL
    let normalizedWebsiteUrl: string | null = null;
    if (websiteUrl && websiteUrl.trim() !== '') {
      const url = websiteUrl.trim();
      normalizedWebsiteUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
    }

    // Create organization (team)
    const [newTeam] = await db
      .insert(teams)
      .values({
        name,
        slug,
        ownerId: user.id,
        industry,
        websiteUrl: normalizedWebsiteUrl,
      })
      .returning();

    // Add user as owner (admin)
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: user.id,
      role: 'owner',
    });

    return NextResponse.json({ organization: newTeam }, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}



