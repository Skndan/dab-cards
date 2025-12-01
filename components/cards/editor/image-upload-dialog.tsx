"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ImageConfig } from "@/types/card";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currentImage?: string | ImageConfig;
  onSave: (config: ImageConfig) => void;
  aspectRatio?: number; // 1 for square, 16/9 for cover
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  title,
  currentImage,
  onSave,
  aspectRatio = 1,
}: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof currentImage === 'string') {
      setImageUrl(currentImage);
      setZoom(1);
      setPosition({ x: 50, y: 50 });
    } else if (currentImage) {
      setImageUrl(currentImage.url);
      setZoom(currentImage.zoom);
      setPosition({ x: currentImage.x, y: currentImage.y });
    }
  }, [currentImage, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setZoom(1);
      setPosition({ x: 50, y: 50 });
    }
  };

  const handleSave = () => {
    onSave({
      url: imageUrl,
      zoom,
      x: position.x,
      y: position.y,
    });
    onOpenChange(false);
  };

  // Simple drag logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!imageUrl ? (
            <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
              <div className="text-center">
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Upload Image
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-lg bg-black/5 cursor-move"
                style={{
                  aspectRatio: aspectRatio,
                  // Simulate crop view
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover pointer-events-none"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: `${position.x}% ${position.y}%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Move className="h-8 w-8 text-white/50 drop-shadow-md" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Zoom</Label>
                  <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={([val]: number[]) => setZoom(val)}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload-replace')?.click()}>
                  Replace Image
                </Button>
                <input
                  id="file-upload-replace"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!imageUrl}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
