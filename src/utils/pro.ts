import { auth } from './firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export function isProActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const status = localStorage.getItem('carecalculus_pro_status');
    const expires = localStorage.getItem('carecalculus_pro_expires');

    if (status !== 'active') return false;
    
    if (expires) {
      const expTime = parseInt(expires, 10);
      if (!isNaN(expTime) && Date.now() > expTime) {
        purgeProPass();
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export async function activateProPass(
  planType: 'monthly' | 'annual' | 'lifetime' = 'monthly',
  token?: string
) {
  if (typeof window === 'undefined') return;
  const durationDays = planType === 'lifetime' ? 36500 : (planType === 'annual' ? 365 : 30);
  const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
  localStorage.setItem('carecalculus_pro_status', 'active');
  localStorage.setItem('carecalculus_pro_expires', expiresAt.toString());
  if (token) {
    localStorage.setItem('carecalculus_pro_token', token);
  }

  // Sync to Firestore if logged in
  const user = auth.currentUser;
  if (user) {
    try {
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        proStatus: 'active',
        proExpires: expiresAt,
        planType
      }, { merge: true });
    } catch (e) {
      console.error('Failed to sync Pro status to Firestore', e);
    }
  }
}

export function purgeProPass() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('carecalculus_pro_status');
  localStorage.removeItem('carecalculus_pro_expires');
  localStorage.removeItem('carecalculus_pro_token');
}

/**
 * Asynchronously verifies the client entitlement with the server backend.
 * If the server invalidates or revokes the session token (or if no valid token exists),
 * local Pro state is immediately revoked. Fails open gracefully if network is offline.
 */
export async function verifyProWithServer(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  // If user doesn't claim to have Pro locally, no need to verify
  if (!isProActive()) return false;

  const token = localStorage.getItem('carecalculus_pro_token');

  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/verify-pro', {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      // If server returns error, do not revoke immediately in case of transient 5xx
      // Let's also check Firestore as a fallback
      return await checkFirestoreProStatus();
    }

    const data = await res.json() as { active: boolean; expiresAt?: number };
    if (!data.active) {
      // Check firestore before giving up
      const firestoreActive = await checkFirestoreProStatus();
      if (firestoreActive) return true;

      console.warn('Server invalidated Pro entitlement. Revoking local pass.');
      purgeProPass();
      return false;
    }

    // Sync expiry date from server if present
    if (data.expiresAt) {
      localStorage.setItem('carecalculus_pro_expires', data.expiresAt.toString());
    }

    return true;
  } catch (e) {
    // Network offline or fetch error — fail open to preserve offline access for legitimate clinicians
    return await checkFirestoreProStatus() || isProActive();
  }
}

async function checkFirestoreProStatus(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const db = getFirestore();
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.proStatus === 'active' && (!data.proExpires || Date.now() < data.proExpires)) {
        return true;
      }
    }
  } catch (e) {
    console.error('Firestore check failed', e);
  }
  return false;
}

// Auto-run non-blocking server verification on module load in browser
if (typeof window !== 'undefined' && isProActive()) {
  verifyProWithServer().catch(() => {});
}
