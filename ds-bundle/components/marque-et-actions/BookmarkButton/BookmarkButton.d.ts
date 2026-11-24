import * as React from 'react';

/**
 * BookmarkButton — from @vcpx/design-system@0.1.0.
 */
export interface BookmarkButtonProps {
item: {
    id?: string;
    itemType: string;
    itemId: string;
    title: string;
    href: string;
    createdAt?: string;
  };
  variant?: "icon" | "labelled";
  className?: string;
}

export declare const BookmarkButton: React.ComponentType<BookmarkButtonProps>;
