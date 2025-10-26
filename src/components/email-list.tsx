'use client';

import type { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from './ui/separator';

type EmailListProps = {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
};

export function EmailList({
  emails,
  selectedEmailId,
  onSelectEmail,
}: EmailListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <h2 className="p-4 text-lg font-semibold tracking-tight">Inbox</h2>
        <Separator />
        {emails.length > 0 ? (
          <div className="flex flex-col gap-1 py-2">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                className={cn(
                  'w-full text-left p-4 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  selectedEmailId === email.id
                    ? 'bg-primary/20'
                    : 'hover:bg-secondary'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {!email.read && (
                      <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    )}
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        !email.read && 'font-bold'
                      )}
                    >
                      {email.fromName}
                    </p>
                  </div>
                  <time
                    className={cn(
                      'text-xs text-muted-foreground',
                      !email.read && 'text-foreground font-medium'
                    )}
                  >
                    {email.date}
                  </time>
                </div>
                <h3
                  className={cn(
                    'mt-1 text-sm truncate',
                    !email.read ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {email.subject}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {email.body.replace(/\n/g, ' ')}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No emails in this category.
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
