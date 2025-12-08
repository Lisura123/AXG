// Lightweight client-side wishlist storage using localStorage
// Keyed per user to avoid cross-account leakage

const WISHLIST_KEY_PREFIX = "axg_wishlist_";

function getKey(userId: string) {
  return `${WISHLIST_KEY_PREFIX}${userId}`;
}

export function getWishlist(userId: string): string[] {
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(userId: string, productId: string): boolean {
  const list = getWishlist(userId);
  return list.includes(productId);
}

export function addToWishlist(userId: string, productId: string): boolean {
  const list = getWishlist(userId);
  if (!list.includes(productId)) {
    const updated = [...list, productId];
    localStorage.setItem(getKey(userId), JSON.stringify(updated));
    return true; // Item was added
  }
  return false; // Item was already in wishlist
}

export function removeFromWishlist(userId: string, productId: string): boolean {
  const list = getWishlist(userId);
  const wasInList = list.includes(productId);
  const updated = list.filter((id) => id !== productId);
  localStorage.setItem(getKey(userId), JSON.stringify(updated));
  return wasInList; // True if item was removed, false if it wasn't in the list
}

export function toggleWishlist(
  userId: string,
  productId: string
): { isNowInWishlist: boolean; wasAdded: boolean; wasRemoved: boolean } {
  const list = getWishlist(userId);
  const exists = list.includes(productId);
  if (exists) {
    const wasRemoved = removeFromWishlist(userId, productId);
    return { isNowInWishlist: false, wasAdded: false, wasRemoved };
  }
  const wasAdded = addToWishlist(userId, productId);
  return { isNowInWishlist: true, wasAdded, wasRemoved: false };
}
