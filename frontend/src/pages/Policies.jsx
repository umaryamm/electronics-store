import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const TABS = {
  privacy: {
    label: 'Privacy Policy',
    body: (
      <>
        <h3>Information We Collect</h3>
        <p>We collect the information you provide when placing an order — name, address, phone number, and email — plus basic usage data needed to keep the store running smoothly.</p>
        <h3>How We Use Your Information</h3>
        <p>Your details are used to process orders, provide support, and occasionally share relevant offers. We never sell your information to third parties.</p>
        <h3>Data Security</h3>
        <p>We use industry-standard safeguards to protect your data, and access is limited to staff who need it to fulfill your order.</p>
        <h3>Your Rights</h3>
        <p>You may request a copy of your data or ask us to delete it at any time by contacting our support team.</p>
      </>
    ),
  },
  terms: {
    label: 'Terms of Service',
    body: (
      <>
        <h3>Use License</h3>
        <p>Content on this site is provided for personal, non-commercial browsing and shopping use only.</p>
        <h3>Disclaimer</h3>
        <p>Products are described as accurately as possible; minor variations in color or packaging may occur.</p>
        <h3>Limitations</h3>
        <p>Vision Giants is not liable for indirect or incidental damages arising from the use of purchased products.</p>
        <h3>Governing Law</h3>
        <p>These terms are governed by the laws of Pakistan.</p>
      </>
    ),
  },
  returns: {
    label: 'Returns & Refunds',
    body: (
      <>
        <h3>Return Eligibility</h3>
        <p>Items may be returned within 30 days of delivery, provided they're unused and in original packaging.</p>
        <h3>Return Process</h3>
        <p>Contact support with your order number to receive a return authorization and pickup instructions.</p>
        <h3>Refund Timeline</h3>
        <p>Approved refunds are processed within 5–7 business days to your original payment method.</p>
        <h3>Non-Refundable Items</h3>
        <p>Custom project kits and clearance items marked "final sale" are not eligible for return.</p>
      </>
    ),
  },
  shipping: {
    label: 'Shipping Info',
    body: (
      <>
        <h3>Shipping Rates</h3>
        <p>Free delivery on orders above Rs 25,000; a flat Rs 350 fee applies below that threshold.</p>
        <h3>Delivery Timeline</h3>
        <p>Most orders arrive within 2–5 business days depending on your city.</p>
        <h3>Order Tracking</h3>
        <p>You'll receive a tracking link by SMS and email once your order ships.</p>
        <h3>Remote Areas</h3>
        <p>Delivery to remote areas may take an additional 2–3 days.</p>
      </>
    ),
  },
  warranty: {
    label: 'Authenticity & Warranty',
    body: (
      <>
        <h3>Manufacturer Warranty</h3>
        <p>All electronics come with a full manufacturer's warranty of up to 2 years, honored through our service centers.</p>
        <h3>Our Commitment</h3>
        <p>We source directly from certified distributors — every device sold is 100% authentic.</p>
        <h3>Suspect a Counterfeit?</h3>
        <p>Contact our authenticity team immediately and we'll investigate and make it right.</p>
      </>
    ),
  },
};

export default function Policies() {
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState(params.get('tab') && TABS[params.get('tab')] ? params.get('tab') : 'privacy');

  const select = (key) => {
    setActive(key);
    setParams({ tab: key });
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>Policies</h1>
        <p>Everything you need to know about shopping with Vision Giants.</p>
      </div>

      <div className="policy-tabs">
        {Object.entries(TABS).map(([key, tab]) => (
          <button key={key} className={`policy-tab${active === key ? ' active' : ''}`} onClick={() => select(key)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="policy-content">
        <h2>{TABS[active].label}</h2>
        {TABS[active].body}
      </div>
    </div>
  );
}
