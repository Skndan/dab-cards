"use client";

import { CardData } from "@/types/card";
import { ProfileEditor } from "./editor/profile-editor";
import { LinksEditor } from "./editor/links-editor";
import { AppearanceEditor } from "./editor/appearance-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Link, Palette } from "lucide-react";

interface CardEditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

export function CardEditor({ data, onChange }: CardEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="profile" className="flex-1 flex flex-col">
        {/* Sticky Tabs Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-2">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="links">
              <Link className="mr-2 h-4 w-4" /> Links
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" /> Appearance
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <TabsContent value="profile" className="mt-0 space-y-6">
            <ProfileEditor data={data} onChange={onChange} />
          </TabsContent>

          <TabsContent value="links" className="mt-0 space-y-6">
            <LinksEditor data={data} onChange={onChange} />
          </TabsContent>

          <TabsContent value="appearance" className="mt-0 space-y-6">
            <AppearanceEditor data={data} onChange={onChange} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
