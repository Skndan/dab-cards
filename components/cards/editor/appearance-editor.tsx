"use client";

import { CardData, CardTheme } from "@/types/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon } from "lucide-react";

interface AppearanceEditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

export function AppearanceEditor({ data, onChange }: AppearanceEditorProps) {
  const handleThemeChange = (field: keyof CardTheme, value: any) => {
    onChange({
      ...data,
      theme: { ...data.theme, [field]: value },
    });
  };

  const fonts = [
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Open Sans", value: "Open Sans" },
  ];

  const buttonStyles = [
    { name: "Rounded", value: "rounded" },
    { name: "Square", value: "square" },
    { name: "Pill", value: "pill" },
    { name: "Outline", value: "outline" },
  ];

  return (
    <div className="space-y-8">
      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={data.theme.primaryColor}
                onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                className="h-10 w-16 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={data.theme.primaryColor}
                onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={data.theme.backgroundColor}
                onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                className="h-10 w-16 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={data.theme.backgroundColor}
                onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Typography</h3>
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={data.theme.font}
            onValueChange={(val) => handleThemeChange("font", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map(font => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Button Style */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Button Style</h3>
        <div className="grid grid-cols-4 gap-2">
          {buttonStyles.map(style => (
            <Button
              key={style.value}
              variant={data.theme.buttonStyle === style.value ? "default" : "outline"}
              className="w-full"
              onClick={() => handleThemeChange("buttonStyle", style.value)}
            >
              {style.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Background Image */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Background Image</h3>
        <div
          className="relative flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/10"
          onClick={() => handleThemeChange('backgroundImageUrl', 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')}
        >
          {data.theme.backgroundImageUrl ? (
            <>
              <img src={data.theme.backgroundImageUrl} alt="Background" className="h-full w-full rounded-lg object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemeChange('backgroundImageUrl', undefined);
                }}
              >
                X
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm">Upload Background</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
