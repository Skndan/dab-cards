"use client";

import { CardContentItem, CardData, LinkItem, LinkCollection, SocialPlatform } from "@/types/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, GripVertical, Trash2, Edit2, FolderPlus, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reorder } from "framer-motion";
import { Switch } from "@/components/ui/switch";

interface LinksEditorProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

const PRESETS: { platform: SocialPlatform; label: string; icon: string; placeholder: string }[] = [
  { platform: 'instagram', label: 'Instagram', icon: '📸', placeholder: '@username or URL' },
  { platform: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'Profile URL' },
  { platform: 'twitter', label: 'Twitter', icon: '🐦', placeholder: '@username or URL' },
  { platform: 'youtube', label: 'YouTube', icon: '📺', placeholder: 'Channel URL' },
  { platform: 'github', label: 'GitHub', icon: '🐙', placeholder: '@username' },
  { platform: 'website', label: 'Website', icon: '🌐', placeholder: 'https://...' },
  { platform: 'email', label: 'Email', icon: '📧', placeholder: 'name@example.com' },
  { platform: 'phone', label: 'Phone', icon: '📞', placeholder: '+1...' },
  { platform: 'custom', label: 'Custom Link', icon: '🔗', placeholder: 'https://...' },
];

const ICONS = ['🔗', '📸', '💼', '🐦', '📺', '🐙', '🌐', '📧', '📞', '🎵', '🛒', '📅', '📍', '📝', '🎨', '⭐', '🔥', '💡', '🚀'];

export function LinksEditor({ data, onChange }: LinksEditorProps) {
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CardContentItem | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());

  const handleAddLink = (platform: SocialPlatform, collectionId?: string) => {
    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      type: 'link',
      platform,
      title: platform === 'custom' ? 'My Link' : PRESETS.find(p => p.platform === platform)?.label || 'Link',
      url: '',
      active: true,
      displayMode: 'default',
      icon: PRESETS.find(p => p.platform === platform)?.icon || '🔗',
      useCustomIcon: false,
    };

    if (collectionId) {
      const newContent = data.content.map(item => {
        if (item.id === collectionId && item.type === 'collection') {
          return { ...item, links: [...item.links, newLink] };
        }
        return item;
      });
      onChange({ ...data, content: newContent });
    } else {
      onChange({ ...data, content: [...data.content, newLink] });
    }

    setIsAddLinkOpen(false);
    setEditingItem(newLink);
  };

  const handleAddCollection = () => {
    const newCollection: LinkCollection = {
      id: crypto.randomUUID(),
      type: 'collection',
      title: 'New Collection',
      layout: 'list',
      links: [],
      active: true,
    };
    onChange({ ...data, content: [...data.content, newCollection] });
    setEditingItem(newCollection);
  };

  const updateItem = (id: string, updates: Partial<CardContentItem>) => {
    const updateInList = (list: CardContentItem[]): CardContentItem[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, ...updates } as CardContentItem;
        }
        if (item.type === 'collection') {
          return { ...item, links: updateInList(item.links as any) } as any;
        }
        return item;
      });
    };

    const newContent = updateInList(data.content);
    onChange({ ...data, content: newContent });

    if (editingItem?.id === id) {
      setEditingItem({ ...editingItem, ...updates } as CardContentItem);
    }
  };

  const removeItem = (id: string) => {
    const removeInList = (list: CardContentItem[]): CardContentItem[] => {
      return list.filter(item => item.id !== id).map(item => {
        if (item.type === 'collection') {
          return { ...item, links: removeInList(item.links as any) } as any;
        }
        return item;
      });
    };

    const newContent = removeInList(data.content);
    onChange({ ...data, content: newContent });
    if (editingItem?.id === id) setEditingItem(null);
  };

  const handleReorder = (newOrder: CardContentItem[]) => {
    onChange({ ...data, content: newOrder });
  };

  const toggleCollection = (id: string) => {
    const newSet = new Set(expandedCollections);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCollections(newSet);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Links & Content</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAddCollection}>
            <FolderPlus className="mr-2 h-4 w-4" /> Group
          </Button>
          <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Content</DialogTitle>
                <DialogDescription>
                  Choose a link type or preset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 py-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.platform}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleAddLink(preset.platform)}
                  >
                    <span className="text-2xl">{preset.icon}</span>
                    <span className="text-xs font-medium">{preset.label}</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Reorder.Group axis="y" values={data.content} onReorder={handleReorder} className="space-y-3">
        {data.content.map((item) => (
          <Reorder.Item key={item.id} value={item}>
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="flex items-center gap-3 p-3">
                <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {item.type === 'collection' ? (
                      <button onClick={() => toggleCollection(item.id)} className="flex items-center gap-1 hover:text-primary">
                        {expandedCollections.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <FolderPlus className="h-4 w-4 text-blue-500" />
                      </button>
                    ) : (
                      <span className="text-lg">{(item as LinkItem).useCustomIcon ? item.icon : (PRESETS.find(p => p.platform === (item as LinkItem).platform)?.icon || '🔗')}</span>
                    )}
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.type === 'link' && (
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.url || 'No URL set'}</p>
                  )}
                  {item.type === 'collection' && (
                    <p className="text-xs text-muted-foreground">{item.links.length} links inside</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {item.type === 'collection' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add to {item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-4 py-4">
                          {PRESETS.map((preset) => (
                            <button
                              key={preset.platform}
                              className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground"
                              onClick={() => handleAddLink(preset.platform, item.id)}
                            >
                              <span className="text-2xl">{preset.icon}</span>
                              <span className="text-xs font-medium">{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Nested Links for Collection */}
              {item.type === 'collection' && expandedCollections.has(item.id) && (
                <div className="border-t bg-muted/30 p-3 pl-8 space-y-2">
                  {item.links.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Empty collection</p>}
                  {item.links.map((link) => (
                    <div key={link.id} className="flex items-center gap-3 rounded-md border bg-background p-2">
                      <span className="text-lg">{link.useCustomIcon ? link.icon : (PRESETS.find(p => p.platform === link.platform)?.icon || '🔗')}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{link.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingItem(link)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(link.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {editingItem?.type === 'collection' ? 'Collection' : 'Link'}</DialogTitle>
          </DialogHeader>

          {editingItem?.type === 'link' && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => updateItem(editingItem.id, { title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>URL or Username</Label>
                <Input
                  value={editingItem.url}
                  onChange={(e) => updateItem(editingItem.id, { url: e.target.value })}
                  placeholder={PRESETS.find(p => p.platform === editingItem.platform)?.placeholder || "https://..."}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label>Use Custom Icon</Label>
                  <p className="text-xs text-muted-foreground">Override the default platform logo</p>
                </div>
                <Switch
                  checked={editingItem.useCustomIcon}
                  onCheckedChange={(checked: boolean) => updateItem(editingItem.id, { useCustomIcon: checked })}
                />
              </div>

              {editingItem.useCustomIcon && (
                <div className="grid gap-2">
                  <Label>Select Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(icon => (
                      <button
                        key={icon}
                        className={`flex h-8 w-8 items-center justify-center rounded-md border ${editingItem.icon === icon ? 'border-primary bg-primary/10' : 'hover:bg-muted'}`}
                        onClick={() => updateItem(editingItem.id, { icon })}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label>Display Mode</Label>
                <Select
                  value={editingItem.displayMode}
                  onValueChange={(val: any) => updateItem(editingItem.id, { displayMode: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Bar)</SelectItem>
                    <SelectItem value="featured">Featured (Large)</SelectItem>
                    <SelectItem value="thumbnail">Thumbnail Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {editingItem?.type === 'collection' && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Collection Title</Label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => updateItem(editingItem.id, { title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Layout</Label>
                <Select
                  value={editingItem.layout}
                  onValueChange={(val: any) => updateItem(editingItem.id, { layout: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List (Vertical)</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="carousel">Carousel (Horizontal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setEditingItem(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
