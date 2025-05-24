"use client"

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const MAX_ITEMS_COLLAPSED = 3;

interface ExpandableBadgesProps {
  items: string[];
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  title?: string;
  itemVariant?: "default" | "secondary" | "destructive" | "outline";
  expandButtonVariant?: "default" | "secondary" | "destructive" | "outline";
}

export const ExpandableBadges: React.FC<ExpandableBadgesProps> = ({
  items,
  expanded,
  setExpanded,
  title,
  itemVariant = "secondary",
  expandButtonVariant = "outline",
}) => {
  if (!items || items.length === 0) return null;

  const displayedItems = expanded ? items : items.slice(0, MAX_ITEMS_COLLAPSED);

  return (
    <div className="mb-4">
      {title && <h4 className="text-sm font-semibold mb-1 text-muted-foreground">{title}</h4>}
      <div className="flex flex-wrap gap-2 items-center">
        {displayedItems.map((item) => (
          <Badge key={item} variant={itemVariant} className="font-normal">
            {item}
          </Badge>
        ))}
        {items.length > MAX_ITEMS_COLLAPSED && (
          <Badge
            variant={expandButtonVariant}
            className="font-normal cursor-pointer hover:bg-accent active:bg-accent/80"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              setExpanded(!expanded);
            }}
          >
            {expanded ? "Show less" : `+${items.length - MAX_ITEMS_COLLAPSED}`}
          </Badge>
        )}
      </div>
    </div>
  );
}; 