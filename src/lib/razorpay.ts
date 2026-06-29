declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency?: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: { email?: string; contact?: string; name?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

let loadPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (loadPromise) return loadPromise;
  if (typeof window === 'undefined') return Promise.reject(new Error('Razorpay: not in browser'));
  if (window.Razorpay) return Promise.resolve();

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { loadPromise = null; resolve(); };
    script.onerror = () => { loadPromise = null; reject(new Error('Failed to load Razorpay SDK')); };
    document.body.appendChild(script);
  });

  return loadPromise;
}

export async function openRazorpayCheckout(options: {
  key: string;
  amount: number;
  currency?: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: { email?: string; contact?: string; name?: string };
  theme?: { color?: string };
}): Promise<RazorpayResponse> {
  await loadRazorpayScript();

  return new Promise<RazorpayResponse>((resolve, reject) => {
    const rzp = new window.Razorpay({
      ...options,
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    });
    rzp.open();
  });
}
