import { getLeadsCollection, checkMongoHealth, closeMongoClient } from '../server/mongo.js';

const INITIAL_DEMO_LEADS = [
  {
    id: 'lead_enterprise_01',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    full_name: 'Rajesh Sharma',
    business_email: 'rajesh.sharma@techcorp.in',
    company_name: 'TechCorp Solutions India',
    phone_number: '+91 98200 12345',
    employee_count: '51-200 employees',
    interested_plan: 'Professional',
    inquiry_type: 'Book a Demo',
    message: 'We want to migrate from manual punch cards to FlowPeople Biometric and GPS attendance across 3 branch offices in Mumbai.',
    status: 'new',
    admin_notes: 'High priority lead. Requested callback for Friday morning.',
    source: 'website_contact_form'
  },
  {
    id: 'lead_enterprise_02',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    full_name: 'Priya Nair',
    business_email: 'priya@zenithhr.com',
    company_name: 'Zenith HR Consultancy',
    phone_number: '+91 99887 65432',
    employee_count: '21-50 employees',
    interested_plan: 'Starter',
    inquiry_type: 'Pricing Enquiry',
    message: 'Interested in the one-time license model. Does it include multiple admin seats for our HR managers?',
    status: 'contacted',
    admin_notes: 'Sent pricing sheet and license breakdown via email.',
    source: 'website_contact_form'
  },
  {
    id: 'lead_enterprise_03',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    full_name: 'Vikram Mehta',
    business_email: 'vmehta@logixglobal.com',
    company_name: 'Logix Global Logistics',
    phone_number: '+91 98111 22334',
    employee_count: '201-500 employees',
    interested_plan: 'Enterprise',
    inquiry_type: 'Book a Demo',
    message: 'We have 250+ field delivery personnel who need 100m geofenced mobile GPS attendance. Please schedule a live demonstration.',
    status: 'qualified',
    admin_notes: 'Enterprise contract discussion scheduled for next week.',
    source: 'website_contact_form'
  },
  {
    id: 'lead_enterprise_04',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    full_name: 'Aakash Patel',
    business_email: 'aakash@omnicreative.co',
    company_name: 'Omni Creative Studios',
    phone_number: '+91 97766 55443',
    employee_count: '1-20 employees',
    interested_plan: 'Starter',
    inquiry_type: 'Product Enquiry',
    message: 'Looking for a simple biometric kiosk setup for our design studio in Ahmedabad.',
    status: 'closed',
    admin_notes: 'Onboarded on Starter tier.',
    source: 'website_contact_form'
  }
];

async function seed() {
  console.log('Seeding initial enterprise leads into MongoDB Atlas...');
  const health = await checkMongoHealth();
  if (!health.connected) {
    console.error('Failed to connect:', health.error);
    process.exit(1);
  }

  const col = await getLeadsCollection();
  for (const lead of INITIAL_DEMO_LEADS) {
    await col.updateOne({ id: lead.id }, { $set: lead }, { upsert: true });
    console.log(`✓ Seeded lead: ${lead.full_name} (${lead.company_name})`);
  }

  const count = await col.countDocuments();
  console.log(`\nTotal leads in Atlas 'leads' collection: ${count}`);
  await closeMongoClient();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

