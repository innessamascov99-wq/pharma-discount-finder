/*
  # Insert Pharmaceutical Discount Program Data
  
  1. Data Insertion
     - Comprehensive pharmaceutical assistance program data
     - 38 major manufacturer programs across multiple therapeutic areas
     - Includes brand name medications, generic names, and complete program details
  
  2. Categories Covered
     - Diabetes medications (Mounjaro, Ozempic, Trulicity, Januvia, etc.)
     - Cardiovascular drugs (Eliquis, Xarelto, Entresto, etc.)
     - Respiratory medications (Symbicort, Trelegy, Spiriva, etc.)
     - Immunology/Rheumatology (Humira, Enbrel, Stelara, etc.)
     - Oncology treatments (Ibrance, Keytruda, Imbruvica)
     - Neurology drugs (Gilenya, Tecfidera, Ocrevus)
     - Dermatology (Dupixent, Taltz, Tremfya)
     - GI/Hepatology (Rinvoq, Vyvgart)
     - Insulin products (Humalog, Lantus)
  
  3. Data Fields
     - Each program includes medication details, eligibility, savings info, contact details
     - All programs set to active=true for immediate searchability
*/

INSERT INTO pharma_programs (
  medication_name,
  generic_name,
  manufacturer,
  program_name,
  program_description,
  eligibility_criteria,
  discount_amount,
  program_url,
  phone_number,
  enrollment_process,
  required_documents,
  active
) VALUES
('Mounjaro', 'tirzepatide', 'Eli Lilly', 'Mounjaro Savings Card', 'Save on your monthly Mounjaro prescription with the Mounjaro Savings Card', 'Must have commercial insurance. Not eligible for government insurance.', 'As low as $25 per month', 'https://www.mounjaro.com/savings-resources', '1-800-545-5979', 'Download card online or call to enroll. Present card at pharmacy.', 'Insurance card', true),

('Ozempic', 'semaglutide', 'Novo Nordisk', 'Ozempic Savings Card', 'Pay as little as $25 for a 1-month, 2-month, or 3-month prescription', 'Must have commercial insurance', 'As low as $25 per prescription', 'https://www.ozempic.com/savings-and-resources/savings-card.html', '1-866-310-7549', 'Activate savings card online, print or save to phone, present at pharmacy', 'Valid prescription, commercial insurance', true),

('Trulicity', 'dulaglutide', 'Eli Lilly', 'Trulicity Savings Card', 'Save on your Trulicity prescription', 'Commercial insurance required', 'As low as $25 per month', 'https://www.trulicity.com/savings-and-support', '1-800-545-5979', 'Register online, receive savings card, use at pharmacy', 'Insurance information', true),

('Januvia', 'sitagliptin', 'Merck', 'Merck Access Program', 'Financial assistance for eligible patients', 'Uninsured or underinsured patients', 'Free or reduced cost', 'https://www.merckhelps.com', '1-800-727-5400', 'Apply online or by phone, provide financial and medical information', 'Income verification, prescription', true),

('Jardiance', 'empagliflozin', 'Boehringer Ingelheim', 'Jardiance Savings Card', 'Eligible patients may pay as little as $10', 'Commercial insurance required', 'As low as $10 per month', 'https://www.jardiance.com/savings-and-support', '1-866-279-3652', 'Download card, activate online, present at pharmacy', 'Insurance card', true),

('Victoza', 'liraglutide', 'Novo Nordisk', 'Victoza Savings Card', 'Save on your Victoza prescription', 'Must have commercial insurance', 'As low as $25 per month', 'https://www.victoza.com/savings-and-support/savings-card.html', '1-877-484-2869', 'Register for savings card online, present at pharmacy', 'Valid prescription', true),

('Farxiga', 'dapagliflozin', 'AstraZeneca', 'AZ&Me Prescription Savings Program', 'Free medication for eligible patients', 'Income limits apply, uninsured or underinsured', 'Free medication', 'https://www.azandmeapp.com', '1-800-292-6363', 'Complete application with healthcare provider', 'Income documentation, prescription', true),

('Eliquis', 'apixaban', 'Bristol Myers Squibb', 'Eliquis Co-Pay Program', 'Eligible patients may pay as little as $10 per month', 'Commercial insurance required', '$10 per month', 'https://www.eliquis.com/savings-and-support', '1-855-354-7847', 'Enroll online or by phone, receive co-pay card', 'Insurance information', true),

('Xarelto', 'rivaroxaban', 'Janssen', 'Janssen CarePath Savings Program', 'Save on out-of-pocket costs', 'Commercial insurance required', 'Pay as little as $0 per month', 'https://www.xarelto-us.com/shared/patient-resources/janssen-carepath-savings-program', '1-888-927-3586', 'Download savings card, present at pharmacy', 'Valid prescription', true),

('Entresto', 'sacubitril/valsartan', 'Novartis', 'Entresto Co-pay Card', 'Eligible patients pay as little as $10', 'Commercial insurance required', '$10 per month', 'https://www.entresto.com/heart-failure/savings-support', '1-844-368-7378', 'Register for co-pay card online', 'Insurance card', true),

('Repatha', 'evolocumab', 'Amgen', 'Repatha Co-pay Program', 'Reduce your out-of-pocket costs', 'Commercial insurance with coverage', 'As low as $0 per month', 'https://www.repatha.com/cost-support', '1-844-737-2842', 'Enroll online, receive co-pay card', 'Insurance information', true),

('Praluent', 'alirocumab', 'Sanofi', 'Sanofi Patient Connection', 'Free medication for eligible patients', 'Uninsured or inadequate coverage', 'Free medication', 'https://www.sanofipatientconnection.com', '1-888-847-4877', 'Apply with healthcare provider', 'Financial documentation', true),

('Symbicort', 'budesonide/formoterol', 'AstraZeneca', 'Symbicort Savings Card', 'Save on your prescription', 'Commercial insurance required', 'As low as $15 per month', 'https://www.mysymbicort.com/savings', '1-800-236-9933', 'Download savings card, use at pharmacy', 'Prescription', true),

('Trelegy Ellipta', 'fluticasone/umeclidinium/vilanterol', 'GSK', 'GSK For You Savings Program', 'Eligible patients pay no more than $25', 'Commercial insurance', '$25 maximum per prescription', 'https://www.trelegy.com/copd/paying-for-trelegy/', '1-866-475-3678', 'Register online for savings card', 'Insurance card', true),

('Spiriva', 'tiotropium', 'Boehringer Ingelheim', 'Boehringer Ingelheim Cares Foundation', 'Free medication for eligible patients', 'Uninsured, income limits', 'Free medication', 'https://www.bipatientassistance.com', '1-800-556-8317', 'Complete application with provider', 'Income proof, prescription', true),

('Advair Diskus', 'fluticasone/salmeterol', 'GSK', 'GSK For You Patient Assistance', 'Free medication for those who qualify', 'Uninsured, meet income requirements', 'Free medication', 'https://www.gskforyou.com', '1-866-728-4368', 'Apply through healthcare provider', 'Financial documents', true),

('Humira', 'adalimumab', 'AbbVie', 'Humira Complete Savings Card', 'Pay as little as $5 per month', 'Commercial insurance required', '$5 per month', 'https://www.humira.com/humira-complete/cost-and-copay', '1-800-448-6472', 'Enroll online, receive savings card', 'Insurance information', true),

('Enbrel', 'etanercept', 'Amgen', 'Enbrel Support Savings Card', 'Most patients pay $0 per month', 'Commercial insurance', '$0-$25 per month', 'https://www.enbrel.com/support/insurance-coverage', '1-888-436-2735', 'Register for support program online', 'Prescription, insurance', true),

('Stelara', 'ustekinumab', 'Janssen', 'Janssen CarePath Stelara Savings Program', 'Eligible patients pay $5 per dose', 'Commercial insurance', '$5 per dose', 'https://www.stelarainfo.com/plaque-psoriasis/patient-support', '1-877-227-3728', 'Enroll through healthcare provider or online', 'Insurance card', true),

('Cosentyx', 'secukinumab', 'Novartis', 'Cosentyx Co-pay Program', 'Pay as little as $0 per month', 'Commercial insurance', '$0 per month', 'https://www.cosentyx.com/plaque-psoriasis/support-and-savings', '1-844-267-3689', 'Register online for co-pay card', 'Prescription', true),

('Otezla', 'apremilast', 'Amgen', 'Otezla Co-pay Card', 'Eligible patients pay $0 per month', 'Commercial insurance', '$0 per month', 'https://www.otezla.com/plaque-psoriasis-savings-and-support', '1-844-468-3952', 'Activate co-pay card online', 'Insurance information', true),

('Ibrance', 'palbociclib', 'Pfizer', 'Pfizer Oncology Together Co-Pay Savings Card', 'Eligible patients pay $0 per month', 'Commercial insurance', '$0 per month', 'https://www.ibrance.com/metastatic-breast-cancer/patient-support', '1-877-744-5675', 'Enroll with healthcare provider', 'Insurance card', true),

('Keytruda', 'pembrolizumab', 'Merck', 'Merck Access Program for Keytruda', 'Financial assistance for eligible patients', 'Uninsured or financial hardship', 'Free or reduced cost', 'https://www.merckhelps.com', '1-855-257-3932', 'Apply through provider', 'Financial documentation', true),

('Imbruvica', 'ibrutinib', 'Janssen', 'Janssen CarePath Savings Program', 'Eligible patients may pay $0', 'Commercial insurance', '$0 per month', 'https://www.imbruvica.com/patient-support-and-resources', '1-877-227-3728', 'Enroll online or through provider', 'Insurance details', true),

('Gilenya', 'fingolimod', 'Novartis', 'Gilenya Go Program', 'Co-pay assistance for eligible patients', 'Commercial insurance', 'As low as $0 per prescription', 'https://www.gilenya.com/cost-and-coverage', '1-800-445-3692', 'Enroll in Go Program', 'Insurance information', true),

('Tecfidera', 'dimethyl fumarate', 'Biogen', 'Biogen Support Services', 'Co-pay assistance program', 'Commercial insurance', 'Reduced out-of-pocket costs', 'https://www.tecfidera.com/en_us/home/taking-tecfidera/support-services.html', '1-800-456-2255', 'Contact support services', 'Prescription', true),

('Ocrevus', 'ocrelizumab', 'Genentech', 'Genentech Co-pay Assistance Program', 'Eligible patients pay $0', 'Commercial insurance', '$0 per infusion', 'https://www.ocrevus.com/patient-resources', '1-844-627-3887', 'Enroll through healthcare provider', 'Insurance card', true),

('Dupixent', 'dupilumab', 'Sanofi/Regeneron', 'Dupixent MyWay Co-pay Card', 'Pay as little as $0 per month', 'Commercial insurance', '$0 per month', 'https://www.dupixent.com/insurance-and-financial-support', '1-844-387-4936', 'Register for MyWay program', 'Insurance information', true),

('Taltz', 'ixekizumab', 'Eli Lilly', 'Taltz Together Savings Card', 'Eligible patients pay as little as $25', 'Commercial insurance', '$25 per month', 'https://www.taltz.com/plaque-psoriasis/taltz-together-support', '1-800-545-5979', 'Sign up online for savings card', 'Prescription', true),

('Tremfya', 'guselkumab', 'Janssen', 'Janssen CarePath Savings Program', 'Pay as little as $5 per dose', 'Commercial insurance', '$5 per dose', 'https://www.tremfya.com/plaque-psoriasis/savings-and-support', '1-877-227-3728', 'Enroll online', 'Insurance card', true),

('Vyvgart', 'efgartigimod alfa', 'Argenx', 'Vyvgart Connect Co-Pay Program', 'Eligible patients pay $0', 'Commercial insurance', '$0 per infusion', 'https://www.vyvgart.com/patient-support', '1-833-898-4278', 'Enroll through provider', 'Insurance information', true),

('Rinvoq', 'upadacitinib', 'AbbVie', 'Complete Savings Card', 'Pay as little as $5 per month', 'Commercial insurance', '$5 per month', 'https://www.rinvoq.com/ulcerative-colitis/cost-support', '1-800-222-6885', 'Activate savings card online', 'Insurance card', true),

('Spinraza', 'nusinersen', 'Biogen', 'Biogen Support Services', 'Financial assistance available', 'All patients regardless of insurance', 'Case-by-case assistance', 'https://www.spinraza.com/en_us/home/support-resources/biogen-support-services.html', '1-844-477-4672', 'Contact support team', 'Medical records', true),

('Evrysdi', 'risdiplam', 'Genentech', 'Evrysdi Co-pay Program', 'Eligible patients pay $0', 'Commercial insurance', '$0 per month', 'https://www.evrysdi.com/patient-support.html', '1-833-387-9734', 'Enroll through healthcare provider', 'Insurance information', true),

('Kalydeco', 'ivacaftor', 'Vertex', 'Vertex GPS Compass', 'Co-pay support and patient assistance', 'Commercial or no insurance', 'Varies based on insurance', 'https://www.kalydeco.com/financial-support', '1-877-752-5933', 'Contact GPS Compass team', 'Financial documents', true),

('Humalog', 'insulin lispro', 'Eli Lilly', 'Lilly Insulin Value Program', 'Get Humalog for $35 per month', 'All patients, regardless of insurance', '$35 per month', 'https://www.lillycares.com', '1-833-808-1234', 'Purchase at participating pharmacies with savings card', 'Prescription', true),

('Lantus', 'insulin glargine', 'Sanofi', 'Sanofi Insulins VALyou Savings Program', 'Pay no more than $35 per month', 'All patients', '$35 per month', 'https://www.lantus.com/savings-resources', '1-866-255-6197', 'Download savings card, use at pharmacy', 'Valid prescription', true),

('Novolog', 'insulin aspart', 'Novo Nordisk', 'Novo Nordisk Patient Assistance Program', 'Free insulin for eligible patients', 'Uninsured, income limits apply', 'Free medication', 'https://www.novocare.com/insulin/my99insulin.html', '1-866-310-7549', 'Apply through healthcare provider', 'Income verification', true),

('Levemir', 'insulin detemir', 'Novo Nordisk', 'My$99Insulin Program', 'Up to 3 vials or 2 packs of pens for $99', 'All patients', '$99 for 30-day supply', 'https://www.novocare.com/insulin/my99insulin.html', '1-866-310-7549', 'Purchase at pharmacy with savings card', 'Prescription', true)
ON CONFLICT DO NOTHING;
