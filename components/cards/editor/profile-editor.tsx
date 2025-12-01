"use client";

import { CardData } from "@/types/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Building2 } from "lucide-react";

interface ProfileEditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

export function ProfileEditor({ data, onChange }: ProfileEditorProps) {
  const handleChange = (field: keyof CardData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Mock upload function
  const handleUpload = (field: keyof CardData) => {
    // In a real app, this would open a file picker
    const mockUrls: Record<string, string> = {
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      companyLogo: "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
    };
    handleChange(field, mockUrls[field as string] || "");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Profile Image */}
          <div className="space-y-2">
            <Label>Profile</Label>
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 hover:border-primary/50"
              onClick={() => handleUpload('profileImage')}
            >
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="h-full w-full rounded-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover</Label>
            <div
              className="relative flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50"
              onClick={() => handleUpload('coverImage')}
            >
              {data.coverImage ? (
                <img src={data.coverImage} alt="Cover" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Company Logo */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50"
              onClick={() => handleUpload('companyLogo')}
            >
              {data.companyLogo ? (
                <img src={data.companyLogo} alt="Logo" className="h-full w-full rounded-lg object-contain p-2" />
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
