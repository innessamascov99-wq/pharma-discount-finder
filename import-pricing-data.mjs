import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nuhfqkhplldontxtoxkg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE'
);

const pricingData = [
  { drug: 'Ozempic', type: 'Brand', pharmacy: 'CVS Pharmacy', price: 825, discount: 'Signup $3 + Member $89.48', url: 'https://www.singlecare.com/prescription/ozempic' },
  { drug: 'Ozempic', type: 'Brand', pharmacy: 'Kroger Pharmacy', price: 825, discount: 'Signup $3 + Member $2.71', url: 'https://www.singlecare.com/prescription/ozempic' },
  { drug: 'Ozempic', type: 'Brand', pharmacy: 'Walmart', price: 825, discount: 'Signup $3 + Member $70.97', url: 'https://www.singlecare.com/prescription/ozempic' },
  { drug: 'Ozempic', type: 'Brand', pharmacy: 'Walgreens', price: 825, discount: 'Signup $3 + Member $52.27', url: 'https://www.singlecare.com/prescription/ozempic' },
  { drug: 'Ozempic', type: 'Brand', pharmacy: 'Harris Teeter', price: 825, discount: 'Signup $3 + Member $2.71', url: 'https://www.singlecare.com/prescription/ozempic' },
  { drug: 'Ozempic', type: 'Brand', pharmacy: 'Costco', price: 499, discount: 'GoodRx - Novo Nordisk $499/month self-pay program', url: 'https://www.goodrx.com/ozempic' },
  { drug: 'Trulicity', type: 'Brand', pharmacy: 'Walgreens', price: 776.81, discount: 'Signup $3 + Member $44', url: 'https://www.singlecare.com/prescription/trulicity' },
  { drug: 'Trulicity', type: 'Brand', pharmacy: 'Walmart', price: 804.42, discount: 'Signup $3 + Member $44', url: 'https://www.singlecare.com/prescription/trulicity' },
  { drug: 'Trulicity', type: 'Brand', pharmacy: 'Kroger Pharmacy', price: 834.09, discount: 'Signup $3 + Member $44', url: 'https://www.singlecare.com/prescription/trulicity' },
  { drug: 'Trulicity', type: 'Brand', pharmacy: 'CVS Pharmacy', price: 866.16, discount: 'Signup $3', url: 'https://www.singlecare.com/prescription/trulicity' },
  { drug: 'Jardiance', type: 'Brand', pharmacy: 'Kroger Pharmacy', price: 528.10, discount: 'Signup $3 + Member $16', url: 'https://www.singlecare.com/prescription/jardiance' },
  { drug: 'Jardiance', type: 'Brand', pharmacy: 'Walmart', price: 573.92, discount: 'Signup $3 + Member $16', url: 'https://www.singlecare.com/prescription/jardiance' },
  { drug: 'Jardiance', type: 'Brand', pharmacy: 'Walgreens', price: 653.79, discount: 'GoodRx coupon', url: 'https://www.goodrx.com/jardiance' },
  { drug: 'Lantus', type: 'Brand', pharmacy: 'All Pharmacies', price: 64.84, discount: 'As low as SingleCare price', url: 'https://www.singlecare.com/prescription/lantus' },
  { drug: 'Lantus', type: 'Brand', pharmacy: 'CVS Pharmacy', price: 35, discount: 'Manufacturer cap $35 for eligible', url: 'https://www.goodrx.com/lantus' },
  { drug: 'Farxiga', type: 'Brand', pharmacy: 'CVS Pharmacy', price: 332.55, discount: 'GoodRx coupon', url: 'https://www.goodrx.com/dapagliflozin' },
  { drug: 'Humalog', type: 'Brand', pharmacy: 'Walgreens', price: 83.27, discount: 'GoodRx coupon (biosimilar)', url: 'https://www.goodrx.com/insulin-glargine' }
];

async function getDrugId(drugName) {
  const normalized = drugName.toLowerCase();
  const { data } = await supabase
    .from('drugs')
    .select('id')
    .ilike('medication_name', `%${normalized}%`)
    .limit(1)
    .maybeSingle();
  
  return data?.id || null;
}

console.log('Importing pricing data...\n');

for (const item of pricingData) {
  const drugId = await getDrugId(item.drug);
  
  const record = {
    drug_id: drugId,
    drug_name: item.drug,
    drug_type: item.type,
    pharmacy_name: item.pharmacy,
    price_usd: item.price,
    discount_description: item.discount,
    source_url: item.url
  };
  
  const { error } = await supabase
    .from('pharmacy_pricing')
    .insert(record);
  
  if (error) {
    console.log(`Error inserting ${item.drug} at ${item.pharmacy}:`, error.message);
  } else {
    console.log(`✓ ${item.drug} at ${item.pharmacy}: $${item.price}`);
  }
}

console.log('\n✅ Pricing import complete!');

const { count } = await supabase
  .from('pharmacy_pricing')
  .select('*', { count: 'exact', head: true });

console.log(`Total pricing records: ${count}`);
