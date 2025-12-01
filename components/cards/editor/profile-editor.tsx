"use client";

import { CardData, ImageConfig, ProfileLayout } from "@/types/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Building2, LayoutTemplate } from "lucide-react";
import { ImageUploadDialog } from "./image-upload-dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileEditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

export function ProfileEditor({ data, onChange }: ProfileEditorProps) {
  const [activeUploadField, setActiveUploadField] = useState<keyof CardData | null>(null);

  const handleChange = (field: keyof CardData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleThemeChange = (field: string, value: any) => {
    onChange({ ...data, theme: { ...data.theme, [field]: value } });
  };

  const handleImageSave = (config: ImageConfig) => {
    if (activeUploadField) {
      handleChange(activeUploadField, config);
    }
  };

  const getImageSrc = (field: keyof CardData) => {
    const val = data[field];
    if (!val) return null;
    return typeof val === 'string' ? val : (val as ImageConfig).url;
  };

  return (
    <div className="space-y-6">
      <ImageUploadDialog
        open={!!activeUploadField}
        onOpenChange={(open) => !open && setActiveUploadField(null)}
        title={activeUploadField === 'coverImage' ? 'Edit Cover Image' : 'Edit Profile Image'}
        currentImage={activeUploadField ? data[activeUploadField] as string | ImageConfig : undefined}
        onSave={handleImageSave}
        aspectRatio={activeUploadField === 'coverImage' ? 16 / 9 : 1}
      />

      {/* Layout Selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Layout</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'classic', label: 'Classic', icon: 'Layout 1' },
            { id: 'left', label: 'Left Aligned', icon: 'Layout 2' },
            { id: 'modern', label: 'Modern', icon: 'Layout 3' }
          ].map((layout) => (
            <button
              key={layout.id}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${data.theme.profileLayout === layout.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
              onClick={() => handleThemeChange('profileLayout', layout.id)}
            >
              <div className="h-12 w-full rounded bg-muted/50 flex items-center justify-center">
                {/* Placeholder for layout visual */}
                <LayoutTemplate className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">{layout.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Profile Image */}
          <div className="space-y-2">
            <Label>Profile</Label>
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 overflow-hidden"
              onClick={() => setActiveUploadField('profileImage')}
            >
              {getImageSrc('profileImage') ? (
                <img src={getImageSrc('profileImage')!} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover</Label>
            <div
              className="relative flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 overflow-hidden"
              onClick={() => setActiveUploadField('coverImage')}
            >
              {getImageSrc('coverImage') ? (
                <img src={getImageSrc('coverImage')!} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Company Logo */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 overflow-hidden"
              onClick={() => setActiveUploadField('companyLogo')}
            >
              {getImageSrc('companyLogo') ? (
                <img src={getImageSrc('companyLogo')!} alt="Logo" className="h-full w-full object-contain p-2" />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Info</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Senior Product Designer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={data.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell your story..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={data.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="e.g. Acme Inc."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={data.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="e.g. Engineering"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Details</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="jane@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={data.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://janedoe.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
