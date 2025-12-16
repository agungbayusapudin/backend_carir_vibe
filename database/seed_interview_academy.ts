
import { sql } from 'drizzle-orm';

export const gamificationSeeds = sql`
-- Challenge Updates for 'Interview Academy'

-- 1. Insert Module 'Module 1: Ceritakan Tentang Dirimu'
INSERT INTO dim_modules (module_id, module_name, description, hr_partner_name, hr_partner_company, module_order, total_challenges)
VALUES ('mod_int_01', 'Ceritakan Tentang Dirimu', 'Cara menjawab pertanyaan pembuka yang menentukan kesan pertama', 'Budi Santoso', 'Gojek', 1, 1)
ON CONFLICT (module_id) DO NOTHING;

-- 2. Insert Challenge for Module 1
INSERT INTO dim_challenges (challenge_id, module_id, challenge_question, hr_bot_dialog, challenge_type, xp_reward)
VALUES ('ch_int_01', 'mod_int_01', 'Bagaimana struktur jawaban terbaik untuk pertanyaan "Ceritakan tentang dirimu"?', 'HR ingin tahu ringkasan profesionalmu, bukan riwayat hidup dari lahir.', 'multiple_choice', 150)
ON CONFLICT DO NOTHING;

-- 3. Insert Challenge Options for Module 1
INSERT INTO challenge_options (challenge_id, option_text, is_correct, feedback_text, xp_reward)
VALUES 
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_01' LIMIT 1), 'Menceritakan hobi dan keluarga secara detail', false, 'Terlalu personal dan tidak relevan.', 0),
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_01' LIMIT 1), 'Rumus Past-Present-Future: Pengalaman relevan, peran saat ini, dan tujuan karir.', true, 'Tepat! Ini struktur yang profesional.', 150),
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_01' LIMIT 1), 'Membacakan ulang isi CV kata per kata', false, 'Membosankan dan redundan.', 0);


-- 4. Insert Module 'Module 2: Kenapa Kami Harus Memilihmu?'
INSERT INTO dim_modules (module_id, module_name, description, hr_partner_name, hr_partner_company, module_order, total_challenges)
VALUES ('mod_int_02', 'Kenapa Kami Harus Memilihmu?', 'Strategi menjual diri tanpa terkesan sombong', 'Sari Dewi', 'Tokopedia', 2, 1)
ON CONFLICT (module_id) DO NOTHING;

-- 5. Insert Challenge for Module 2
INSERT INTO dim_challenges (challenge_id, module_id, challenge_question, hr_bot_dialog, challenge_type, xp_reward)
VALUES ('ch_int_02', 'mod_int_02', 'Dari sekian banyak kandidat, kenapa kami harus pilih kamu?', 'Fokus pada Value Proposition yang unik (USP).', 'multiple_choice', 150)
ON CONFLICT DO NOTHING;

-- 6. Insert Challenge Options for Module 2
INSERT INTO challenge_options (challenge_id, option_text, is_correct, feedback_text, xp_reward)
VALUES 
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_02' LIMIT 1), 'Karena saya butuh pekerjaan ini untuk bayar cicilan.', false, 'Hindari alasan finansial sebagai motivasi utama.', 0),
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_02' LIMIT 1), 'Saya punya skill React 2 tahun dan pernah naikin conversion rate 25% di project sebelumnya.', true, 'Kerja bagus! Kamu fokus pada bukti nyata dan relevansi.', 150),
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_02' LIMIT 1), 'Saya yang paling pintar dari semua kandidat.', false, 'Terkesan arogan.', 0);


-- 7. Insert Module 'Module 3: Negosiasi Gaji'
INSERT INTO dim_modules (module_id, module_name, description, hr_partner_name, hr_partner_company, module_order, total_challenges)
VALUES ('mod_int_03', 'Negosiasi Gaji', 'Tips negosiasi gaji yang profesional dan efektif', 'Andi Wijaya', 'Shopee', 3, 1)
ON CONFLICT (module_id) DO NOTHING;

-- 8. Insert Challenge for Module 3
INSERT INTO dim_challenges (challenge_id, module_id, challenge_question, hr_bot_dialog, challenge_type, xp_reward)
VALUES ('ch_int_03', 'mod_int_03', 'Kapan waktu yang tepat untuk negosiasi gaji?', 'Timing is everything.', 'multiple_choice', 200)
ON CONFLICT DO NOTHING;

-- 9. Insert Challenge Options for Module 3
INSERT INTO challenge_options (challenge_id, option_text, is_correct, feedback_text, xp_reward)
VALUES 
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_03' LIMIT 1), 'Di awal wawancara pertama.', false, 'Terlalu cepat, fokus dulu pada value.', 0),
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_03' LIMIT 1), 'Setelah mendapatkan offering letter resmi atau sinyal kuat diterima.', true, 'Tepat! Posisi tawarmu paling kuat di sini.', 200),
((SELECT challenge_id FROM dim_challenges WHERE module_id = 'mod_int_03' LIMIT 1), 'Saat menanyakan fasilitas kantor.', false, 'Kurang tepat konteksnya.', 0);

`;
