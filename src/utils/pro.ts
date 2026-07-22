export function isProActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const status = localStorage.getItem('carecalculus_pro_status');
    const expires = localStorage.getItem('carecalculus_pro_expires');

    if (status !== 'active') return false;
    
    if (expires) {
      const expTime = parseInt(expires, 10);
      if (!isNaN(expTime) && Date.now() > expTime) {
        localStorage.removeItem('carecalculus_pro_status');
        localStorage.removeItem('carecalculus_pro_expires');
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function activateProPass(planType: 'monthly' | 'annual' = 'monthly') {
  if (typeof window === 'undefined') return;
  const durationDays = planType === 'annual' ? 365 : 30;
  const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
  localStorage.setItem('carecalculus_pro_status', 'active');
  localStorage.setItem('carecalculus_pro_expires', expiresAt.toString());
}
