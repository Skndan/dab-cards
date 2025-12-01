"use client";

import { CardData } from "@/types/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface CardEditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

export function CardEditor({ data, onChange }: CardEditorProps) {
  const handleChange = (field: keyof CardData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSocialLinkChange = (id: string, field: string, value: any) => {
    const newLinks = data.socialLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    handleChange("socialLinks", newLinks);
  };

  const addSocialLink = () => {
    const newLink = {
      id: crypto.randomUUID(),
      platform: "Instagram",
      url: "",
      active: true,
    };
    handleChange("socialLinks", [...data.socialLinks, newLink]);
  };

  const removeSocialLink = (id: string) => {
    handleChange(
      "socialLinks",
      data.socialLinks.filter((link) => link.id !== id)
    );
  };

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Details</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Product Designer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={data.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Contact Info</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={data.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Links</h2>
          <Button onClick={addSocialLink} size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {data.socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-3 rounded-lg border p-3 bg-card">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <div className="grid gap-2 flex-1">
                <Input
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(link.id, "platform", e.target.value)}
                  placeholder="Platform (e.g. Instagram)"
                  className="h-8"
                />
                <Input
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(link.id, "url", e.target.value)}
                  placeholder="URL"
                  className="h-8"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSocialLink(link.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              {['#000000', '#2563eb', '#dc2626', '#16a34a', '#9333ea'].map(color => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-full border-2 ${data.theme.primaryColor === color ? 'border-primary' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ ...data, theme: { ...data.theme, primaryColor: color } })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
