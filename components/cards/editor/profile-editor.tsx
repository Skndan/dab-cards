"use client";

import { CardData, ImageConfig } from "@/types/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Building2, LayoutTemplate, Wallpaper, X } from "lucide-react";
import { ImageUploadDialog } from "./image-upload-dialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileEditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
  userId: string;
  cardId: string;
}

export function ProfileEditor({ data, onChange, userId, cardId }: ProfileEditorProps) {
  const [activeUploadField, setActiveUploadField] = useState<keyof CardData | 'backgroundImageUrl' | null>(null);
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);

  const handleChange = (field: keyof CardData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleThemeChange = (field: string, value: any) => {
    onChange({ ...data, theme: { ...data.theme, [field]: value } });
  };

  const handleImageSave = (config: ImageConfig) => {
    if (activeUploadField) {
      if (activeUploadField === 'backgroundImageUrl') {
        handleThemeChange('backgroundImageUrl', config.url ? config.url : undefined);
      } else {
        handleChange(activeUploadField as keyof CardData, config.url ? config : undefined);
      }
      setActiveUploadField(null);
    }
  };

  const getImageSrc = (field: keyof CardData | 'backgroundImageUrl') => {
    if (field === 'backgroundImageUrl') {
      return data.theme.backgroundImageUrl || null;
    }
    const val = data[field as keyof CardData];
    if (!val) return null;
    return typeof val === 'string' ? val : (val as ImageConfig).url;
  };

  const getAspectRatio = () => {
    if (activeUploadField === 'coverImage') return 16 / 9;
    if (activeUploadField === 'backgroundImageUrl') return 9 / 16;
    return 1;
  };

  const getImageType = (): 'profile' | 'banner' | 'logo' | 'background' => {
    if (activeUploadField === 'profileImage') return 'profile';
    if (activeUploadField === 'coverImage') return 'banner';
    if (activeUploadField === 'companyLogo') return 'logo';
    if (activeUploadField === 'backgroundImageUrl') return 'background';
    return 'profile'; // default
  };

  return (
    <div className="space-y-6">
      <ImageUploadDialog
        open={!!activeUploadField}
        onOpenChange={(open) => !open && setActiveUploadField(null)}
        title={
          activeUploadField === 'coverImage' ? 'Edit Cover Image' :
            activeUploadField === 'backgroundImageUrl' ? 'Edit Background Image' :
              activeUploadField === 'companyLogo' ? 'Edit Company Logo' :
                'Edit Profile Image'
        }
        currentImage={activeUploadField ? (
          activeUploadField === 'backgroundImageUrl' ?
            data.theme.backgroundImageUrl :
            data[activeUploadField as keyof CardData]
        ) as string | ImageConfig : undefined}
        onSave={handleImageSave}
        aspectRatio={getAspectRatio()}
        type={getImageType()}
        userId={userId}
        cardId={cardId}
      />

      {/* Card Label */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Label this card</h3>
        <Input
          value={data.cardName || ''}
          onChange={(e) => handleChange("cardName", e.target.value)}
          placeholder="Card 01"
          className="text-base"
        />
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Add images</h3>

          <Dialog open={layoutDialogOpen} onOpenChange={setLayoutDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Change Layout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Layout</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 py-4">
                {[
                  { id: 'classic', label: 'Classic' },
                  { id: 'modern', label: 'Modern' },
                  { id: 'minimal', label: 'Minimal' },
                  { id: 'left', label: 'Left Aligned' },
                  { id: 'compact', label: 'Compact' },
                  { id: 'centered', label: 'Centered' }
                ].map((layout) => (
                  <button
                    key={layout.id}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${data.theme.profileLayout === layout.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                      }`}
                    onClick={() => {
                      handleThemeChange('profileLayout', layout.id);
                      setLayoutDialogOpen(false);
                    }}
                  >
                    <div className="h-10 w-full rounded bg-muted/50 flex items-center justify-center">
                      <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium">{layout.label}</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Image Upload Boxes */}
        <div className="grid grid-cols-4 gap-4">
          {/* Company Logo */}
          <div className="space-y-2">
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/10 overflow-hidden group"
              onClick={() => setActiveUploadField('companyLogo')}
            >
              {getImageSrc('companyLogo') ? (
                <>
                  <img src={getImageSrc('companyLogo')!} alt="Logo" className="h-full w-full object-contain p-3" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange('companyLogo', undefined);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
              )}
            </div>
            <p className="text-sm text-center text-muted-foreground">Company Logo</p>
          </div>

          {/* Profile Picture */}
          <div className="space-y-2">
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/10 overflow-hidden group"
              onClick={() => setActiveUploadField('profileImage')}
            >
              {getImageSrc('profileImage') ? (
                <>
                  <img src={getImageSrc('profileImage')!} alt="Profile" className="h-full w-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange('profileImage', undefined);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
              )}
            </div>
            <p className="text-sm text-center text-muted-foreground">Profile Picture</p>
          </div>

          {/* Cover Photo */}
          <div className="space-y-2">
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/10 overflow-hidden group"
              onClick={() => setActiveUploadField('coverImage')}
            >
              {getImageSrc('coverImage') ? (
                <>
                  <img src={getImageSrc('coverImage')!} alt="Cover" className="h-full w-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange('coverImage', undefined);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
              )}
            </div>
            <p className="text-sm text-center text-muted-foreground">Cover Photo</p>
          </div>

          {/* Cover Photo */}
          <div className="space-y-2">
            <div
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/10 overflow-hidden group"
              onClick={() => setActiveUploadField('backgroundImageUrl')}
            >
              {getImageSrc('backgroundImageUrl') ? (
                <>
                  <img src={getImageSrc('backgroundImageUrl')!} alt="Cover" className="h-full w-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThemeChange('backgroundImageUrl', undefined);
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
              )}
            </div>
            <p className="text-sm text-center text-muted-foreground">Background Image (Optional)</p>
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


