const NSFW_CONSENT_KEY = 'nsfw_consent_given';

export function hasNSFWConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem(NSFW_CONSENT_KEY);
  return consent === 'true';
}

export function setNSFWConsent(consent: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NSFW_CONSENT_KEY, String(consent));
}

export function isNSFWRating(rating: string): boolean {
  return rating === 'r17' || rating === 'r' || rating === 'rx';
}
