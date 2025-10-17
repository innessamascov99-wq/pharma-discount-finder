/*
  # Insert Sample Drug Data

  1. Data
    - Insert 40+ popular pharmaceutical drugs
    - Cover major therapeutic areas
    - Include brand and generic names
*/

INSERT INTO drugs (medication_name, generic_name, manufacturer, drug_class, indication, dosage_forms, common_dosages, typical_retail_price, description, side_effects, warnings) VALUES
('Ozempic', 'semaglutide', 'Novo Nordisk', 'GLP-1 Receptor Agonist', 'Type 2 diabetes, weight management', 'Pre-filled injection pen', '0.25mg, 0.5mg, 1mg, 2mg weekly', '$800-$1000/month', 'Once-weekly injection that helps control blood sugar and promotes weight loss by mimicking the GLP-1 hormone.', 'Nausea, vomiting, diarrhea, abdominal pain, constipation', 'Risk of thyroid tumors, pancreatitis, kidney problems. Not for type 1 diabetes.'),

('Mounjaro', 'tirzepatide', 'Eli Lilly', 'GLP-1/GIP Receptor Agonist', 'Type 2 diabetes', 'Pre-filled injection pen', '2.5mg, 5mg, 7.5mg, 10mg, 12.5mg, 15mg weekly', '$900-$1100/month', 'Dual-action injectable medication for type 2 diabetes that activates both GLP-1 and GIP receptors.', 'Nausea, diarrhea, decreased appetite, vomiting, constipation', 'Risk of thyroid tumors, pancreatitis, gallbladder problems. Not for type 1 diabetes.'),

('Trulicity', 'dulaglutide', 'Eli Lilly', 'GLP-1 Receptor Agonist', 'Type 2 diabetes', 'Pre-filled injection pen', '0.75mg, 1.5mg, 3mg, 4.5mg weekly', '$750-$900/month', 'Once-weekly GLP-1 injection for type 2 diabetes that helps lower blood sugar and reduce cardiovascular risk.', 'Nausea, diarrhea, vomiting, abdominal pain, decreased appetite', 'Risk of thyroid tumors, pancreatitis. Not for type 1 diabetes or diabetic ketoacidosis.'),

('Jardiance', 'empagliflozin', 'Boehringer Ingelheim', 'SGLT2 Inhibitor', 'Type 2 diabetes, heart failure', 'Tablet', '10mg, 25mg daily', '$500-$650/month', 'Oral medication that lowers blood sugar by helping kidneys remove glucose through urine. Also reduces heart failure risk.', 'Urinary tract infections, increased urination, dehydration, yeast infections', 'Risk of ketoacidosis, kidney problems, low blood pressure, amputations.'),

('Farxiga', 'dapagliflozin', 'AstraZeneca', 'SGLT2 Inhibitor', 'Type 2 diabetes, heart failure, chronic kidney disease', 'Tablet', '5mg, 10mg daily', '$500-$650/month', 'SGLT2 inhibitor that helps remove excess sugar through urine. Approved for diabetes, heart failure, and kidney disease.', 'Genital yeast infections, urinary tract infections, increased urination', 'Risk of ketoacidosis, kidney problems, dehydration, low blood pressure.'),

('Invokana', 'canagliflozin', 'Janssen', 'SGLT2 Inhibitor', 'Type 2 diabetes', 'Tablet', '100mg, 300mg daily', '$500-$650/month', 'SGLT2 inhibitor that helps control blood sugar by increasing glucose excretion through urine.', 'Yeast infections, urinary tract infections, increased urination, thirst', 'Risk of ketoacidosis, amputations, kidney problems, bone fractures.'),

('Lantus', 'insulin glargine', 'Sanofi', 'Long-acting Insulin', 'Type 1 and Type 2 diabetes', 'Vial, pre-filled pen', 'Individualized dosing', '$250-$400/month', 'Long-acting basal insulin that provides steady glucose control for up to 24 hours.', 'Low blood sugar, weight gain, injection site reactions, swelling', 'Risk of severe hypoglycemia. Monitor blood sugar carefully.'),

('Humalog', 'insulin lispro', 'Eli Lilly', 'Rapid-acting Insulin', 'Type 1 and Type 2 diabetes', 'Vial, pen, pump', 'Individualized with meals', '$250-$400/month', 'Fast-acting mealtime insulin that starts working within 15 minutes.', 'Low blood sugar, weight gain, injection site reactions, allergic reactions', 'Risk of severe hypoglycemia. Take with meals as directed.'),

('Novolog', 'insulin aspart', 'Novo Nordisk', 'Rapid-acting Insulin', 'Type 1 and Type 2 diabetes', 'Vial, pen, pump', 'Individualized with meals', '$250-$400/month', 'Rapid-acting insulin for mealtime glucose control, starts working in 10-20 minutes.', 'Low blood sugar, weight gain, injection site reactions', 'Risk of severe hypoglycemia. Coordinate with meal timing.'),

('Tresiba', 'insulin degludec', 'Novo Nordisk', 'Ultra-long-acting Insulin', 'Type 1 and Type 2 diabetes', 'Pre-filled pen', 'Individualized dosing', '$300-$450/month', 'Ultra-long-acting basal insulin providing glucose control for up to 42 hours with flexible dosing.', 'Low blood sugar, weight gain, injection site reactions, allergic reactions', 'Risk of severe hypoglycemia. Can be taken at varying times of day.'),

('Basaglar', 'insulin glargine', 'Eli Lilly', 'Long-acting Insulin', 'Type 1 and Type 2 diabetes', 'Pre-filled pen', 'Individualized dosing', '$200-$350/month', 'Long-acting basal insulin similar to Lantus, providing 24-hour glucose control.', 'Low blood sugar, weight gain, injection site reactions', 'Risk of severe hypoglycemia. Monitor blood sugar regularly.'),

('Levemir', 'insulin detemir', 'Novo Nordisk', 'Long-acting Insulin', 'Type 1 and Type 2 diabetes', 'Vial, pre-filled pen', 'Individualized dosing', '$250-$400/month', 'Long-acting basal insulin typically dosed once or twice daily.', 'Low blood sugar, weight gain, injection site reactions', 'Risk of severe hypoglycemia. May need twice daily dosing.'),

('Humira', 'adalimumab', 'AbbVie', 'TNF Blocker', 'Rheumatoid arthritis, psoriasis, Crohns disease, ulcerative colitis', 'Pre-filled injection', '40mg every 2 weeks', '$5000-$6000/month', 'Biologic medication that blocks TNF to reduce inflammation in autoimmune conditions.', 'Injection site reactions, infections, headache, rash', 'Risk of serious infections, lymphoma, heart failure. Screen for tuberculosis.'),

('Enbrel', 'etanercept', 'Amgen', 'TNF Blocker', 'Rheumatoid arthritis, psoriatic arthritis, ankylosing spondylitis', 'Pre-filled injection', '50mg weekly or 25mg twice weekly', '$5000-$6000/month', 'TNF blocker that reduces inflammation and slows joint damage in autoimmune diseases.', 'Injection site reactions, infections, headache', 'Risk of serious infections, malignancies, blood disorders. Screen for TB.'),

('Stelara', 'ustekinumab', 'Janssen', 'IL-12/23 Blocker', 'Psoriasis, psoriatic arthritis, Crohns disease, ulcerative colitis', 'Injection, IV infusion', '45mg, 90mg every 12 weeks', '$20000-$25000/year', 'Biologic that blocks interleukins IL-12 and IL-23 to treat inflammatory conditions.', 'Infections, headache, fatigue, injection site reactions', 'Risk of serious infections, malignancy, reversible posterior leukoencephalopathy syndrome.'),

('Cosentyx', 'secukinumab', 'Novartis', 'IL-17A Blocker', 'Psoriasis, psoriatic arthritis, ankylosing spondylitis', 'Pre-filled injection', '150mg, 300mg monthly', '$4500-$5500/month', 'IL-17A inhibitor that treats moderate to severe plaque psoriasis and related conditions.', 'Upper respiratory infections, diarrhea, cold sores', 'Risk of infections, inflammatory bowel disease, hypersensitivity reactions.'),

('Taltz', 'ixekizumab', 'Eli Lilly', 'IL-17A Blocker', 'Psoriasis, psoriatic arthritis, ankylosing spondylitis', 'Pre-filled injection', '80mg every 2-4 weeks', '$4500-$5500/month', 'IL-17A inhibitor for moderate to severe plaque psoriasis and inflammatory arthritis.', 'Injection site reactions, upper respiratory infections, nausea', 'Risk of infections, inflammatory bowel disease, hypersensitivity reactions.'),

('Skyrizi', 'risankizumab', 'AbbVie', 'IL-23 Blocker', 'Psoriasis, psoriatic arthritis, Crohns disease', 'Pre-filled injection', '150mg at weeks 0, 4, then every 12 weeks', '$60000-$70000/year', 'IL-23 inhibitor with convenient dosing schedule for psoriasis and related conditions.', 'Upper respiratory infections, headache, fatigue, injection site reactions', 'Risk of infections, hypersensitivity reactions. Screen for tuberculosis.'),

('Dupixent', 'dupilumab', 'Sanofi/Regeneron', 'IL-4/IL-13 Blocker', 'Atopic dermatitis, asthma, chronic rhinosinusitis', 'Pre-filled injection', '300mg every 2 weeks', '$3000-$3500/month', 'Biologic that blocks IL-4 and IL-13 to treat moderate-to-severe eczema, asthma, and nasal polyps.', 'Injection site reactions, eye/eyelid inflammation, cold sores', 'Risk of eye problems, parasitic infections, hypersensitivity reactions.'),

('Rinvoq', 'upadacitinib', 'AbbVie', 'JAK Inhibitor', 'Rheumatoid arthritis, psoriatic arthritis, ankylosing spondylitis, atopic dermatitis', 'Tablet', '15mg, 30mg, 45mg daily', '$4500-$5500/month', 'Oral JAK1 inhibitor that reduces inflammation in various autoimmune conditions.', 'Upper respiratory infections, nausea, cough, fever', 'Risk of serious infections, blood clots, cancer, cardiovascular events.'),

('Xeljanz', 'tofacitinib', 'Pfizer', 'JAK Inhibitor', 'Rheumatoid arthritis, psoriatic arthritis, ulcerative colitis', 'Tablet', '5mg, 10mg twice daily or 11mg extended-release once daily', '$4000-$5000/month', 'JAK inhibitor that blocks multiple inflammatory pathways in autoimmune diseases.', 'Upper respiratory infections, headache, diarrhea, nasopharyngitis', 'Risk of serious infections, blood clots, cancer, perforations in GI tract.'),

('Orencia', 'abatacept', 'Bristol Myers Squibb', 'T-cell Inhibitor', 'Rheumatoid arthritis, psoriatic arthritis, polyarticular juvenile idiopathic arthritis', 'Injection, IV infusion', '125mg weekly injection or monthly IV', '$3500-$4500/month', 'T-cell co-stimulation modulator that helps prevent immune system from attacking joints.', 'Headache, upper respiratory infections, nausea, back pain', 'Risk of serious infections, COPD exacerbations, hypersensitivity reactions.'),

('Eliquis', 'apixaban', 'Bristol Myers Squibb', 'Factor Xa Inhibitor', 'Stroke prevention in AFib, DVT, PE treatment and prevention', 'Tablet', '2.5mg, 5mg twice daily', '$450-$550/month', 'Direct oral anticoagulant that prevents blood clots in atrial fibrillation and venous thromboembolism.', 'Bleeding, bruising, nausea, anemia', 'Risk of serious bleeding. Do not stop suddenly. Inform all healthcare providers.'),

('Xarelto', 'rivaroxaban', 'Janssen', 'Factor Xa Inhibitor', 'Stroke prevention in AFib, DVT, PE treatment and prevention', 'Tablet', '10mg, 15mg, 20mg daily', '$450-$550/month', 'Factor Xa inhibitor that prevents and treats blood clots. Once-daily dosing.', 'Bleeding, back pain, muscle spasm, dizziness', 'Risk of serious bleeding, spinal hematoma. Take with food.'),

('Entresto', 'sacubitril/valsartan', 'Novartis', 'ARNI', 'Heart failure with reduced ejection fraction', 'Tablet', '24/26mg, 49/51mg, 97/103mg twice daily', '$500-$650/month', 'Combination medication that relaxes blood vessels and helps the heart pump more efficiently.', 'Low blood pressure, elevated potassium, cough, dizziness', 'Risk of angioedema, hypotension, kidney problems. Not for pregnancy.'),

('Repatha', 'evolocumab', 'Amgen', 'PCSK9 Inhibitor', 'High cholesterol, cardiovascular disease', 'Pre-filled injection', '140mg every 2 weeks or 420mg monthly', '$500-$600/month', 'Injectable medication that dramatically lowers LDL cholesterol by blocking PCSK9.', 'Injection site reactions, flu-like symptoms, back pain', 'Risk of allergic reactions. Monitor liver enzymes.'),

('Praluent', 'alirocumab', 'Sanofi/Regeneron', 'PCSK9 Inhibitor', 'High cholesterol, cardiovascular disease', 'Pre-filled injection', '75mg, 150mg every 2 weeks', '$500-$600/month', 'PCSK9 inhibitor injection that significantly reduces LDL cholesterol levels.', 'Injection site reactions, flu-like symptoms, muscle pain', 'Risk of allergic reactions. Monitor for liver problems.'),

('Spiriva', 'tiotropium', 'Boehringer Ingelheim', 'Anticholinergic Bronchodilator', 'COPD, asthma', 'HandiHaler inhaler, Respimat inhaler', '18mcg once daily (HandiHaler), 2.5mcg once daily (Respimat)', '$350-$450/month', 'Long-acting bronchodilator that helps open airways in COPD and asthma patients.', 'Dry mouth, constipation, upper respiratory infection, cough', 'Risk of narrow-angle glaucoma, urinary retention, hypersensitivity.'),

('Symbicort', 'budesonide/formoterol', 'AstraZeneca', 'ICS/LABA Combination', 'Asthma, COPD', 'Metered dose inhaler', '80/4.5mcg, 160/4.5mcg twice daily', '$250-$350/month', 'Combination inhaler with a corticosteroid and long-acting bronchodilator for asthma and COPD.', 'Upper respiratory infection, thrush, headache, back pain', 'Risk of pneumonia, thrush, bone density loss, paradoxical bronchospasm.'),

('Advair', 'fluticasone/salmeterol', 'GSK', 'ICS/LABA Combination', 'Asthma, COPD', 'Diskus inhaler, HFA inhaler', '100/50, 250/50, 500/50 twice daily', '$250-$350/month', 'Popular combination inhaler containing a steroid and long-acting beta-agonist.', 'Upper respiratory infection, thrush, hoarseness, headache', 'Risk of pneumonia, thrush, decreased bone density, cardiovascular effects.'),

('Trelegy', 'fluticasone/umeclidinium/vilanterol', 'GSK', 'ICS/LAMA/LABA Triple Therapy', 'COPD', 'Ellipta inhaler', '100/62.5/25 once daily', '$400-$500/month', 'Triple-combination inhaler for COPD with steroid, anticholinergic, and long-acting bronchodilator.', 'Upper respiratory infection, pneumonia, thrush, headache', 'Risk of pneumonia, cardiovascular effects, glaucoma, bone density loss.'),

('Fasenra', 'benralizumab', 'AstraZeneca', 'IL-5 Receptor Blocker', 'Severe eosinophilic asthma', 'Pre-filled injection', '30mg every 4 weeks for 3 doses, then every 8 weeks', '$3000-$3500/month', 'Biologic injection that reduces eosinophils to treat severe asthma with an eosinophilic phenotype.', 'Headache, sore throat, injection site reactions, fever', 'Risk of hypersensitivity reactions, infections, parasitic infections.'),

('Nucala', 'mepolizumab', 'GSK', 'IL-5 Blocker', 'Severe eosinophilic asthma, EGPA, chronic rhinosinusitis', 'Pre-filled injection', '100mg every 4 weeks', '$3000-$3500/month', 'IL-5 inhibitor that reduces eosinophils in blood and lungs to prevent asthma exacerbations.', 'Headache, injection site reactions, back pain, fatigue', 'Risk of hypersensitivity reactions, infections, parasitic infections.'),

('Januvia', 'sitagliptin', 'Merck', 'DPP-4 Inhibitor', 'Type 2 diabetes', 'Tablet', '25mg, 50mg, 100mg daily', '$400-$500/month', 'Oral diabetes medication that helps regulate blood sugar by increasing incretin levels.', 'Upper respiratory infection, stuffy nose, sore throat, headache', 'Risk of pancreatitis, heart failure, joint pain, bullous pemphigoid.'),

('Victoza', 'liraglutide', 'Novo Nordisk', 'GLP-1 Receptor Agonist', 'Type 2 diabetes', 'Pre-filled injection pen', '0.6mg, 1.2mg, 1.8mg daily', '$800-$950/month', 'Daily GLP-1 injection for type 2 diabetes that lowers blood sugar and promotes weight loss.', 'Nausea, diarrhea, vomiting, headache, decreased appetite', 'Risk of thyroid tumors, pancreatitis, kidney problems. Not for type 1 diabetes.'),

('Rybelsus', 'semaglutide', 'Novo Nordisk', 'GLP-1 Receptor Agonist', 'Type 2 diabetes', 'Tablet', '3mg, 7mg, 14mg daily', '$800-$950/month', 'First oral GLP-1 medication for type 2 diabetes. Take on empty stomach.', 'Nausea, abdominal pain, diarrhea, decreased appetite, vomiting', 'Risk of thyroid tumors, pancreatitis. Take 30 minutes before food/drink.'),

('Bydureon', 'exenatide', 'AstraZeneca', 'GLP-1 Receptor Agonist', 'Type 2 diabetes', 'Pre-filled injection', '2mg once weekly', '$600-$750/month', 'Extended-release GLP-1 injection given once weekly for type 2 diabetes management.', 'Nausea, diarrhea, vomiting, injection site nodules, headache', 'Risk of thyroid tumors, pancreatitis, kidney problems, injection site reactions.'),

('Lyrica', 'pregabalin', 'Pfizer', 'Anticonvulsant/Analgesic', 'Neuropathic pain, fibromyalgia, seizures', 'Capsule', '25mg, 50mg, 75mg, 100mg, 150mg, 200mg, 225mg, 300mg', '$200-$400/month', 'Medication for nerve pain, fibromyalgia, and seizures. Works by calming overactive nerves.', 'Dizziness, drowsiness, dry mouth, weight gain, swelling', 'Risk of suicidal thoughts, angioedema, dependency, withdrawal symptoms.'),

('Cymbalta', 'duloxetine', 'Eli Lilly', 'SNRI Antidepressant', 'Depression, anxiety, neuropathic pain, fibromyalgia', 'Capsule', '20mg, 30mg, 40mg, 60mg daily', '$200-$350/month', 'Antidepressant that also treats chronic pain conditions by affecting serotonin and norepinephrine.', 'Nausea, dry mouth, drowsiness, constipation, decreased appetite', 'Risk of suicidal thoughts, serotonin syndrome, liver damage, withdrawal symptoms.'),

('Chantix', 'varenicline', 'Pfizer', 'Smoking Cessation Aid', 'Smoking cessation', 'Tablet', '0.5mg, 1mg twice daily', '$400-$500/month', 'Prescription medication to help quit smoking by reducing cravings and withdrawal symptoms.', 'Nausea, abnormal dreams, constipation, flatulence, vomiting', 'Risk of neuropsychiatric symptoms, cardiovascular events, seizures, sleepwalking.');
