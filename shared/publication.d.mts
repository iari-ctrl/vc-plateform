export interface PublicationRecord {
  status?: string;
}

export function isPublishedContent(value?: PublicationRecord | null): boolean;
