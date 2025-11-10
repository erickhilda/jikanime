import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';

interface NSFWWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function NSFWWarningDialog({
  open,
  onOpenChange,
  onConfirm,
}: NSFWWarningDialogProps) {
  const [confirmed, setConfirmed] = useState(false);

  // Reset confirmed state when dialog closes
  useEffect(() => {
    if (!open) {
      setConfirmed(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
      onOpenChange(false);
      setConfirmed(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setConfirmed(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Content Warning</DialogTitle>
          <DialogDescription>
            The content you are about to view may contain NSFW (Not Safe For
            Work) or adult content, including but not limited to:
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <ul className='list-disc list-inside space-y-2 text-sm text-foreground/80 mb-4'>
            <li>Violence and profanity (R-17+)</li>
            <li>Mild nudity (R+)</li>
            <li>Explicit sexual content (Rx)</li>
          </ul>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='nsfw-consent'
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
            />
            <label
              htmlFor='nsfw-consent'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
            >
              I understand and confirm that I am 18 years or older
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant='neutral' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!confirmed}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
