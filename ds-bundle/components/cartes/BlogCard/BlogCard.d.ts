import * as React from 'react';

/**
 * BlogCard — from @vcpx/design-system@0.1.0.
 */
export interface BlogCardProps {
post: {
    id: string;
    slug: string;
    status: "draft" | "published";
    title: string;
    subtitle: string;
    author: string;
    date: string;
    readMin: number;
    category: string;
    excerpt: string;
    tags: string[];
    body: string;
    books?: { title: string; author: string; year?: number }[];
  };
  /** Agrandit le titre et le résumé pour une mise en avant d'index. */
  featured?: boolean;
}

export declare const BlogCard: React.ComponentType<BlogCardProps>;
