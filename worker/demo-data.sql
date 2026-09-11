-- Hero
INSERT INTO settings (key, value) VALUES
('hero_title', 'Welcome to MAA JIVACH ENTERPRISES'),
('hero_subtitle', 'Your Trusted Partner in Civil Construction, Housekeeping, Cleaning, and Medical Equipment Supplies'),
('hero_cta', 'Explore Services');

-- Stats
INSERT INTO settings (key, value) VALUES
('stats_projects', '150'),
('stats_customers', '1023'),
('stats_branches', '8'),
('stats_manpower', '5000');

-- Contact
INSERT INTO settings (key, value) VALUES
('contact_email', 'ranadarbhanga@gmail.com'),
('contact_phone', '8409193489'),
('contact_whatsapp', '7717702255'),
('contact_address', 'MAA JIVACH ENTERPRISES, Benta Road, Laheriasarai, Darbhanga (Bihar) 846001'),
('contact_iso', 'ISO No-9001-2015');

-- About Intro
INSERT INTO settings (key, value) VALUES
('about_intro_title', 'About MAA JIVACH ENTERPRISES'),
('about_intro_desc', 'We are a leading provider of integrated facility management, construction, and manpower services. With over a decade of experience, we deliver reliable and quality solutions across Bihar.'),
('about_intro_image', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800');

-- About Page
INSERT INTO settings (key, value) VALUES
('about_company', 'MAA JIVACH ENTERPRISES'),
('about_corporate_office', 'Benta Road, Laheriasarai, Darbhanga (Bihar) 846001'),
('about_founder', 'Rana Pratap Singh'),
('about_founder_title', 'Founder & Managing Director'),
('about_mission', 'To provide world-class services that empower businesses and communities through reliability, innovation, and integrity.'),
('about_mission_points', '["Quality Assurance","Timely Delivery","Customer Satisfaction","Skilled Workforce","Safety First"]');

-- Services (15)
INSERT INTO settings (key, value) VALUES
('services_list', '[
  {"icon":"👷","title":"Manpower Supply Services","description":"Skilled and unskilled manpower for all industries.","image":""},
  {"icon":"🏗️","title":"Construction Work","description":"Civil construction, renovation, and infrastructure projects.","image":""},
  {"icon":"💊","title":"Drug Supply","description":"Pharmaceutical and medical drug supply to hospitals.","image":""},
  {"icon":"⚡","title":"Electrical Work & Maintenance","description":"Electrical installation, repair, and maintenance.","image":""},
  {"icon":"🧴","title":"Sanitization & Fogging","description":"Deep sanitization and fogging services for offices and public spaces.","image":""},
  {"icon":"🩺","title":"Medical Equipments Supply","description":"Supply of hospital equipment, instruments, and consumables.","image":""},
  {"icon":"🌿","title":"Gardening & Horticulture","description":"Landscaping, gardening, and horticulture maintenance.","image":""},
  {"icon":"🔥","title":"Firefighting Services","description":"Fire safety equipment and trained firefighting personnel.","image":""},
  {"icon":"🚔","title":"Beat Patrolling","description":"24/7 beat patrolling for residential and commercial areas.","image":""},
  {"icon":"👶","title":"Child Safety System","description":"GPS tracking and safety solutions for schools and children.","image":""},
  {"icon":"📹","title":"Room (CCTV) Surveillance","description":"CCTV installation and monitoring for complete security.","image":""},
  {"icon":"🖥️","title":"Central Monitoring System","description":"Centralized monitoring of security and safety systems.","image":""},
  {"icon":"🏢","title":"Office Support Management","description":"Front office, back office, and administrative support.","image":""},
  {"icon":"🛡️","title":"Security Services","description":"Trained security guards for corporate and residential premises.","image":""},
  {"icon":"🚑","title":"E-Ambulance","description":"Emergency ambulance services with advanced life support.","image":""}
]');

-- Why Choose Us
INSERT INTO settings (key, value) VALUES
('why_choose_us', '[
  {"icon":"🏆","title":"Experienced Team","description":"Highly trained professionals with years of experience."},
  {"icon":"⏱️","title":"24/7 Support","description":"Round-the-clock customer support and emergency services."},
  {"icon":"✅","title":"Quality Assurance","description":"ISO 9001:2015 certified processes for consistent quality."},
  {"icon":"💰","title":"Cost Effective","description":"Competitive pricing without compromising on quality."},
  {"icon":"🤝","title":"Trusted Partner","description":"Trusted by 1000+ customers across Bihar."}
]');

-- Page Images
INSERT INTO settings (key, value) VALUES
('page_image_home_hero', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600'),
('page_image_about', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200'),
('page_image_services_banner', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600'),
('page_image_gallery_banner', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600'),
('page_image_join_banner', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600'),
('page_image_contact', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600');

-- Photos
INSERT INTO photos (title, image_url, category) VALUES
('Construction Site', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 'construction'),
('Housekeeping Team', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', 'housekeeping'),
('Security Guards', 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800', 'security'),
('Medical Equipment', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800', 'medical');

-- Jobs
INSERT INTO jobs (title, department, location, description) VALUES
('Security Guard', 'Security', 'Darbhanga, Bihar', '<p>We are looking for experienced Security Guards. <strong>Responsibilities:</strong> Monitor premises, control access, report incidents.</p>'),
('Housekeeping Staff', 'Housekeeping', 'Laheriasarai, Darbhanga', '<p>Housekeeping staff required for commercial buildings. <strong>Requirements:</strong> Experience in cleaning, attention to detail.</p>'),
('Civil Engineer', 'Construction', 'Darbhanga, Bihar', '<p>Civil Engineer with 2+ years experience in construction projects. <strong>Skills:</strong> AutoCAD, project management.</p>'),
('Driver (Ambulance)', 'Medical', 'Darbhanga, Bihar', '<p>Ambulance driver with valid driving license and experience. <strong>Must be available for emergency calls.</strong></p>'),
('Office Assistant', 'Administration', 'Darbhanga, Bihar', '<p>Office Assistant for daily administrative tasks. <strong>Skills:</strong> MS Office, communication.</p>');
