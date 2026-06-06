-- ============================================================
--  Refrescaña – Seed de productos
--  Ejecutar después de schema.sql:
--    mysql -u root -p refrescana < backend/sql/seed.sql
-- ============================================================

USE `refrescana`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------
-- CATEGORÍAS
-- -------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
('c0000001-0000-0000-0000-000000000001', 'Curcumiel', 'curcumiel', 'Jarabes a base de cúrcuma y melaza de caña con propiedades antiinflamatorias'),
('c0000002-0000-0000-0000-000000000002', 'Bronquiales', 'bronquiales', 'Productos naturales para aliviar afecciones respiratorias'),
('c0000003-0000-0000-0000-000000000003', 'Miel y Melaza', 'miel-y-melaza', 'Mieles naturales y melaza de caña'),
('c0000004-0000-0000-0000-000000000004', 'Propóleos', 'propoleos', 'Productos elaborados con propóleo de abeja'),
('c0000005-0000-0000-0000-000000000005', 'Ansiedad y Relajantes', 'ansiedad-y-relajantes', 'Jarabes naturales con plantas relajantes para aliviar ansiedad e insomnio'),
('c0000006-0000-0000-0000-000000000006', 'Energizantes', 'energizantes', 'Productos naturales energizantes y vitalizantes'),
('c0000007-0000-0000-0000-000000000007', 'Cápsulas y Polvos', 'capsulas-y-polvos', 'Productos naturales en presentación de cápsulas y polvo'),
('c0000008-0000-0000-0000-000000000008', 'Cacao y Chocolate', 'cacao-y-chocolate', 'Productos derivados del cacao puro'),
('c0000009-0000-0000-0000-000000000009', 'Café', 'cafe', 'Café tostado artesanal de alta calidad'),
('c0000010-0000-0000-0000-000000000010', 'Miel de Abeja', 'miel-de-abeja', 'Miel de abeja artesanal pura'),
('c0000011-0000-0000-0000-000000000011', 'Aceite de Coco', 'aceite-de-coco', 'Aceite de coco natural con múltiples beneficios'),
('c0000012-0000-0000-0000-000000000012', 'Aceite de Oliva', 'aceite-de-oliva', 'Aceite de oliva extra virgen'),
('c0000013-0000-0000-0000-000000000013', 'Vinagres', 'vinagres', 'Vinagres naturales y probióticos'),
('c0000014-0000-0000-0000-000000000014', 'Frotaciones', 'frotaciones', 'Productos tópicos para alivio muscular y articular'),
('c0000015-0000-0000-0000-000000000015', 'Aceites Esenciales', 'aceites-esenciales', 'Aceites esenciales e hidrolatos naturales destilados'),
('c0000016-0000-0000-0000-000000000016', 'Flores y Bienestar', 'flores-y-bienestar', 'Productos destilados para equilibrio emocional'),
('c0000017-0000-0000-0000-000000000017', 'Jabones Naturales', 'jabones-naturales', 'Jabones artesanales hechos con ingredientes naturales'),
('c0000018-0000-0000-0000-000000000018', 'Licores y Macerados', 'licores-y-macerados', 'Aguardientes, macerados y licores artesanales de caña');

-- -------------------------------------------------------
-- PRODUCTOS
-- -------------------------------------------------------

-- ===================== CURCUMIEL =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000001-0000-0000-0000-000000000001', 'Curcumiel Forte 300ml', 'curcumiel-forte-300ml',
 'Con cúrcuma, melaza de caña, kion, pimienta negra y canela. Dado que es un potente antiinflamatorio es útil para tratar el dolor y las enfermedades inflamatorias: artritis, artrosis. Previene el Parkinson y el alzhéimer.',
 35.00, 50, 1, 'c0000001-0000-0000-0000-000000000001'),

('p0000002-0000-0000-0000-000000000002', 'Curcumiel Forte 100ml', 'curcumiel-forte-100ml',
 'Con cúrcuma, melaza de caña, kion, pimienta negra y canela. Dado que es un potente antiinflamatorio es útil para tratar el dolor y las enfermedades inflamatorias: artritis, artrosis. Previene el Parkinson y el alzhéimer.',
 18.00, 50, 1, 'c0000001-0000-0000-0000-000000000001'),

('p0000003-0000-0000-0000-000000000003', 'Curcumiel Refrescaña 300ml', 'curcumiel-refrescana-300ml',
 'Con cúrcuma y melaza de caña. Ayuda a prevenir y complementar el tratamiento del cáncer, mejora la calidad de vida gracias a su efecto antiinflamatorio. Favorece la desinflamación de quistes mamarios y uterinos.',
 30.00, 50, 1, 'c0000001-0000-0000-0000-000000000001'),

('p0000004-0000-0000-0000-000000000004', 'Curcumiel Refrescaña 100ml', 'curcumiel-refrescana-100ml',
 'Con cúrcuma y melaza de caña. Ayuda a prevenir y complementar el tratamiento del cáncer, mejora la calidad de vida gracias a su efecto antiinflamatorio, alivia los síntomas de artritis y artrosis, contribuye a la prevención de alzhéimer. Favorece la desinflamación de quistes mamarios y uterinos.',
 15.00, 50, 1, 'c0000001-0000-0000-0000-000000000001');

-- ===================== BRONQUIALES =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000005-0000-0000-0000-000000000005', 'Bronco Caña 300ml', 'bronco-cana-300ml',
 'Producto natural altamente concentrado, elaborado a base de melaza de caña, kion (jengibre), cebolla y ajo. Gracias a su combinación de ingredientes naturales atribuye a favorecer el sistema inmunológico y brindar apoyo frente a afecciones respiratorias.',
 35.00, 50, 1, 'c0000002-0000-0000-0000-000000000002'),

('p0000006-0000-0000-0000-000000000006', 'Bronco Caña 100ml', 'bronco-cana-100ml',
 'Producto natural altamente concentrado, elaborado a base de melaza de caña, kion (jengibre), cebolla y ajo. Gracias a su combinación de ingredientes naturales atribuye a favorecer el sistema inmunológico y brindar apoyo frente a afecciones respiratorias.',
 18.00, 50, 1, 'c0000002-0000-0000-0000-000000000002'),

('p0000007-0000-0000-0000-000000000007', 'Bronco Kion Tos Refrescaña 300ml', 'bronco-kion-tos-refrescana-300ml',
 'Es un concentrado natural elaborado con ingredientes tradicionales y ricos en minerales que fortalecen el organismo, mejoran la salud digestiva y cardiovascular. Además, ayuda a aliviar la tos, congestión nasal, bronquios, asma, alergias, garraspera y gripe.',
 30.00, 50, 1, 'c0000002-0000-0000-0000-000000000002'),

('p0000008-0000-0000-0000-000000000008', 'Bronco Kion Tos Refrescaña 100ml', 'bronco-kion-tos-refrescana-100ml',
 'Es un concentrado natural elaborado con ingredientes tradicionales y ricos en minerales que fortalecen el organismo, mejoran la salud digestiva y cardiovascular. Además, ayuda a aliviar la tos, congestión nasal, bronquios, asma, alergias, garraspera y gripe.',
 15.00, 50, 1, 'c0000002-0000-0000-0000-000000000002'),

('p0000009-0000-0000-0000-000000000009', 'Bronco Kion Tos Forte 300ml', 'bronco-kion-tos-forte-300ml',
 'Previene enfermedades del corazón, mejora la salud bucal, acelera el metabolismo y alivia malestares digestivos, fortaleciendo el sistema cardiovascular. Además, contribuye al alivio de la tos, congestión nasal, bronquios, asma, alergias y gripe.',
 35.00, 50, 1, 'c0000002-0000-0000-0000-000000000002'),

('p0000010-0000-0000-0000-000000000010', 'Bronco Kion Tos Forte 100ml', 'bronco-kion-tos-forte-100ml',
 'Previene enfermedades del corazón, mejora la salud bucal, acelera el metabolismo y alivia malestares digestivos, fortaleciendo el sistema cardiovascular. Además, contribuye al alivio de la tos, congestión nasal, bronquios, asma, alergias y gripe.',
 18.00, 50, 1, 'c0000002-0000-0000-0000-000000000002'),

('p0000011-0000-0000-0000-000000000011', 'Bronco Pulmonar Forte 300ml', 'bronco-pulmonar-forte-300ml',
 'Este producto natural gracias a sus ingredientes naturales como la sangre de grado, aceite de copaiba, eucalipto y melaza de caña te ayuda a aliviar la tos con flema, bronquios y asma.',
 45.00, 50, 1, 'c0000002-0000-0000-0000-000000000002'),

('p0000012-0000-0000-0000-000000000012', 'Bronco Pulmonar Forte 100ml', 'bronco-pulmonar-forte-100ml',
 'Este producto natural gracias a sus ingredientes naturales como la sangre de grado, aceite de copaiba, eucalipto y melaza de caña te ayuda a aliviar la tos con flema, bronquios y asma.',
 20.00, 50, 1, 'c0000002-0000-0000-0000-000000000002');

-- ===================== MIEL DE CAÑA =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000013-0000-0000-0000-000000000013', 'Miel de Caña 300ml', 'miel-de-cana-300ml',
 'Gracias a su alta concentración de cobre, miel de caña contribuye a tener un cabello fuerte, sano y resistente, siendo especialmente beneficiosa en casos de caída capilar. Además, su rico contenido en hierro lo convierte en una excelente aliada para personas con anemia y mujeres en etapa de gestación.',
 15.00, 50, 1, 'c0000003-0000-0000-0000-000000000003');

-- ===================== ALGARROBINA =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000014-0000-0000-0000-000000000014', 'Algarrobina 300ml', 'algarrobina-300ml',
 'Es una fuente rica en hierro y calcio ideal para prevenir la anemia y fortalecer los huesos. También ayuda a mejorar la digestión y actúa como energizante natural, contribuye a reducir la ansiedad siendo un complemento perfecto para una vida saludable.',
 25.00, 50, 1, 'c0000003-0000-0000-0000-000000000003');

-- ===================== PROPÓLEO =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000015-0000-0000-0000-000000000015', 'Propóleo 300ml', 'propoleo-300ml',
 'Complemento alimenticio natural que contribuye al fortalecimiento del sistema inmunológico y a la protección de las vías respiratorias. Conocido por sus propiedades antibacterianas y antivirales, actúa como un antibiótico natural que ayuda a prevenir gripes, resfriados.',
 35.00, 50, 1, 'c0000004-0000-0000-0000-000000000004');

-- ===================== ANSIEDAD Y RELAJANTES =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000016-0000-0000-0000-000000000016', 'Ansiedad 300ml', 'ansiedad-300ml',
 'Jarabe natural con melaza de caña y diez plantas relajantes entre ellos la valeriana, cedrón, toronjil. Es una fórmula tradicional que ayuda a aliviar síntomas de depresión, ansiedad e insomnio.',
 35.00, 50, 1, 'c0000005-0000-0000-0000-000000000005'),

('p0000017-0000-0000-0000-000000000017', 'Ansiedad Forte 300ml', 'ansiedad-forte-300ml',
 'Jarabe natural con melaza de caña y veinte plantas relajantes entre ellos la valeriana, manzanilla, hierba luisa. Ayuda a aliviar el sistema nervioso y promover la tranquilidad en un sueño profundo.',
 45.00, 50, 1, 'c0000005-0000-0000-0000-000000000005'),

('p0000018-0000-0000-0000-000000000018', 'Ansiedad Forte 100ml', 'ansiedad-forte-100ml',
 'Jarabe natural con melaza de caña y veinte plantas relajantes entre ellos la valeriana, manzanilla, hierba luisa. Ayuda a aliviar el sistema nervioso y promover la tranquilidad en un sueño profundo.',
 20.00, 50, 1, 'c0000005-0000-0000-0000-000000000005');

-- ===================== ENERGIZANTES =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000019-0000-0000-0000-000000000019', 'Power Caña 300ml', 'power-cana-300ml',
 'Energizante natural que ayuda a mantener la vitalidad diaria. Alivia dolores óseos, articulares, contribuye a mejorar la memoria y concentración.',
 35.00, 50, 1, 'c0000006-0000-0000-0000-000000000006'),

('p0000020-0000-0000-0000-000000000020', 'Power Caña 100ml', 'power-cana-100ml',
 'Energizante natural que ayuda a mantener la vitalidad diaria. Alivia dolores óseos, articulares, contribuye a mejorar la memoria y concentración.',
 18.00, 50, 1, 'c0000006-0000-0000-0000-000000000006'),

('p0000021-0000-0000-0000-000000000021', 'Vida Eterna – Resveratrol 300ml', 'vida-eterna-resveratrol-300ml',
 'Jarabe natural que se concentra en una fusión deliciosa y saludable que combina el sabor frutal y antioxidante de los arándanos y las uvas verdes. Aporta energía, dulzura natural de la melaza de caña.',
 45.00, 50, 1, 'c0000006-0000-0000-0000-000000000006');

-- ===================== CÁPSULAS Y POLVOS =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000022-0000-0000-0000-000000000022', 'Cápsulas de Cúrcuma con Pimienta Negra, Kion y Canela (50 unidades)', 'capsulas-curcuma-pimienta-kion-canela-50',
 'Este producto natural comprimido en una cápsula alivia dolores musculares y articulares, facilita la digestión y previene el cáncer de piel. También reduce el colesterol, refuerza el sistema inmunológico y alivia resfriados, gripes, asma, gases, artritis y quistes mamarios o uterinos.',
 30.00, 50, 1, 'c0000007-0000-0000-0000-000000000007'),

('p0000023-0000-0000-0000-000000000023', 'Cápsulas de Cúrcuma con Pimienta Negra, Kion y Canela (100 unidades)', 'capsulas-curcuma-pimienta-kion-canela-100',
 'Este producto natural comprimido en una cápsula alivia dolores musculares y articulares, facilita la digestión y previene el cáncer de piel. También reduce el colesterol, refuerza el sistema inmunológico y alivia resfriados, gripes, asma, gases, artritis y quistes mamarios o uterinos.',
 50.00, 50, 1, 'c0000007-0000-0000-0000-000000000007'),

('p0000024-0000-0000-0000-000000000024', 'Cúrcuma con Pimienta Negra, Kion y Canela en Polvo (100gr)', 'curcuma-pimienta-kion-canela-polvo-100gr',
 'Este producto natural alivia dolores musculares y articulares, facilita la digestión y previene el cáncer de piel. También reduce el colesterol, refuerza el sistema inmunológico y alivia resfriados, gripes, asma, gases, artritis y quistes mamarios o uterinos.',
 20.00, 50, 1, 'c0000007-0000-0000-0000-000000000007'),

('p0000025-0000-0000-0000-000000000025', 'Polvo de Cúrcuma (100gr)', 'polvo-curcuma-100gr',
 'Rico en curcumina, ofrece beneficios antiinflamatorios, antioxidantes y anticancerígenas. Ayuda en la prevención de enfermedades neurodegenerativas y mejora la salud cardiovascular y digestiva.',
 15.00, 50, 1, 'c0000007-0000-0000-0000-000000000007'),

('p0000026-0000-0000-0000-000000000026', 'Polvo de Kion (100gr)', 'polvo-kion-100gr',
 'Es un potente antiinflamatorio que te ayuda a reducir la inflamación en enfermedades como la osteoartritis y la dismenorrea. También es un antioxidante que te ayuda a prevenir enfermedades como el cáncer.',
 15.00, 50, 1, 'c0000007-0000-0000-0000-000000000007'),

('p0000027-0000-0000-0000-000000000027', 'Harina de Sachagerjon (100gr)', 'harina-sachagerjon-100gr',
 'Fortalece el sistema inmunológico y apoya en el tratamiento de la hepatitis, diabetes e infecciones virales. Es un potente antiinflamatorio y antitumoral, ayuda a reducir el cansancio y elimina toxinas del cuerpo.',
 25.00, 50, 1, 'c0000007-0000-0000-0000-000000000007');

-- ===================== CACAO Y CHOCOLATE =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000028-0000-0000-0000-000000000028', 'Pasta de Cacao (170gr)', 'pasta-de-cacao-170gr',
 'Producto 100% puro cacao, que te ayuda a retrasar el envejecimiento celular y protegiendo al cuerpo contra enfermedades crónicas. Fortalece el sistema inmunológico y previene la anemia.',
 20.00, 50, 1, 'c0000008-0000-0000-0000-000000000008'),

('p0000029-0000-0000-0000-000000000029', 'Polvo de Cacao (150gr)', 'polvo-de-cacao-150gr',
 'Producto fácil de disolver, es ideal para tu uso diario con una concentración altísima de fibra y fitonutrientes. Protege las células contra el daño oxidativo y fortalece el sistema inmunológico.',
 20.00, 50, 1, 'c0000008-0000-0000-0000-000000000008'),

('p0000030-0000-0000-0000-000000000030', 'Chocolate Dashita 60% Chocolate (90gr)', 'chocolate-dashita-60-90gr',
 'El grano de cacao conserva una gran cantidad de beneficios como por ejemplo control de la presión arterial, ayuda a la liberación de serotonina y endorfinas que mejoran el estado de ánimo y reducción del estrés.',
 15.00, 50, 1, 'c0000008-0000-0000-0000-000000000008');

-- ===================== CAFÉ =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000031-0000-0000-0000-000000000031', 'Café Tostado 250gr', 'cafe-tostado-250gr',
 'Contiene granos de calidad y un proceso artesanal que contiene una mayor fuente de antioxidantes, ayuda a combatir el estrés oxidativo y la inflamación celular.',
 25.00, 50, 1, 'c0000009-0000-0000-0000-000000000009'),

('p0000032-0000-0000-0000-000000000032', 'Café Tostado 150gr', 'cafe-tostado-150gr',
 'Contiene granos de calidad y un proceso artesanal que contiene una mayor fuente de antioxidantes, ayuda a combatir el estrés oxidativo y la inflamación celular.',
 20.00, 50, 1, 'c0000009-0000-0000-0000-000000000009');

-- ===================== MIEL DE ABEJA =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000033-0000-0000-0000-000000000033', 'Miel de Abeja 100ml', 'miel-de-abeja-100ml',
 'Producto artesanal que combate las bacterias y hongos. Ayuda a inhibir el crecimiento de patógenos en el sistema digestivo y la garganta. Reduce el riesgo de enfermedades del corazón.',
 15.00, 50, 1, 'c0000010-0000-0000-0000-000000000010'),

('p0000034-0000-0000-0000-000000000034', 'Miel de Abeja 200ml', 'miel-de-abeja-200ml',
 'Producto artesanal que combate las bacterias y hongos. Ayuda a inhibir el crecimiento de patógenos en el sistema digestivo y la garganta. Reduce el riesgo de enfermedades del corazón.',
 25.00, 50, 1, 'c0000010-0000-0000-0000-000000000010'),

('p0000035-0000-0000-0000-000000000035', 'Miel de Abeja 370ml', 'miel-de-abeja-370ml',
 'Producto artesanal que combate las bacterias y hongos. Ayuda a inhibir el crecimiento de patógenos en el sistema digestivo y la garganta. Reduce el riesgo de enfermedades del corazón.',
 45.00, 50, 1, 'c0000010-0000-0000-0000-000000000010'),

('p0000036-0000-0000-0000-000000000036', 'Miel de Abeja 720ml', 'miel-de-abeja-720ml',
 'Producto artesanal que combate las bacterias y hongos. Ayuda a inhibir el crecimiento de patógenos en el sistema digestivo y la garganta. Reduce el riesgo de enfermedades del corazón.',
 65.00, 50, 1, 'c0000010-0000-0000-0000-000000000010');

-- ===================== ACEITE DE COCO =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000037-0000-0000-0000-000000000037', 'Aceite de Coco 100ml', 'aceite-de-coco-100ml',
 'Es considerado un superalimento por sus múltiples propiedades beneficiosas para la salud. Gracias a su contenido de ácido láurico ayuda a eliminar hongos y bacterias del organismo y también favorece a la reducción de la grasa abdominal.',
 18.00, 50, 1, 'c0000011-0000-0000-0000-000000000011'),

('p0000038-0000-0000-0000-000000000038', 'Aceite de Coco 200ml', 'aceite-de-coco-200ml',
 'Es considerado un superalimento por sus múltiples propiedades beneficiosas para la salud. Gracias a su contenido de ácido láurico ayuda a eliminar hongos y bacterias del organismo y también favorece a la reducción de la grasa abdominal.',
 30.00, 50, 1, 'c0000011-0000-0000-0000-000000000011'),

('p0000039-0000-0000-0000-000000000039', 'Aceite de Coco 250ml', 'aceite-de-coco-250ml',
 'Es considerado un superalimento por sus múltiples propiedades beneficiosas para la salud. Gracias a su contenido de ácido láurico ayuda a eliminar hongos y bacterias del organismo y también favorece a la reducción de la grasa abdominal.',
 35.00, 50, 1, 'c0000011-0000-0000-0000-000000000011'),

('p0000040-0000-0000-0000-000000000040', 'Aceite de Coco 370ml', 'aceite-de-coco-370ml',
 'Es considerado un superalimento por sus múltiples propiedades beneficiosas para la salud. Gracias a su contenido de ácido láurico ayuda a eliminar hongos y bacterias del organismo y también favorece a la reducción de la grasa abdominal.',
 45.00, 50, 1, 'c0000011-0000-0000-0000-000000000011'),

('p0000041-0000-0000-0000-000000000041', 'Aceite de Coco 720ml', 'aceite-de-coco-720ml',
 'Es considerado un superalimento por sus múltiples propiedades beneficiosas para la salud. Gracias a su contenido de ácido láurico ayuda a eliminar hongos y bacterias del organismo y también favorece a la reducción de la grasa abdominal.',
 70.00, 50, 1, 'c0000011-0000-0000-0000-000000000011');

-- ===================== ACEITE DE OLIVA =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000042-0000-0000-0000-000000000042', 'Aceite de Oliva Extra Virgen 250ml', 'aceite-oliva-extra-virgen-250ml',
 'Te ayuda a proteger el corazón y evita que el colesterol se oxide en las arterias, lo que previene la formación de placas de ateromas. También ayuda a mantener las funciones cognitivas y la agilidad mental durante el envejecimiento.',
 25.00, 50, 1, 'c0000012-0000-0000-0000-000000000012'),

('p0000043-0000-0000-0000-000000000043', 'Aceite de Oliva Extra Virgen 500ml', 'aceite-oliva-extra-virgen-500ml',
 'Te ayuda a proteger el corazón y evita que el colesterol se oxide en las arterias, lo que previene la formación de placas de ateromas. También ayuda a mantener las funciones cognitivas y la agilidad mental durante el envejecimiento.',
 35.00, 50, 1, 'c0000012-0000-0000-0000-000000000012');

-- ===================== VINAGRES =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000044-0000-0000-0000-000000000044', 'Vinagre de Sachawira 500ml', 'vinagre-sachawira-500ml',
 'Potente fitonutriente, antioxidante, anticoagulante. Los usos principales de este producto son para tratar la diabetes, problemas urinarios, enfermedades venéreas (gonorrea), como diurético y contra el cáncer del riñón. Además, ayuda aliviar el hígado graso, vesícula, colesterol y triglicéridos.',
 45.00, 50, 1, 'c0000013-0000-0000-0000-000000000013'),

('p0000045-0000-0000-0000-000000000045', 'Vinagre de Caña 500ml', 'vinagre-de-cana-500ml',
 'Es un probiótico natural que ayuda a regenerar la flora intestinal y mejorar la digestión, especialmente tras comidas pesadas. Rico en antioxidantes, contribuye al control del azúcar en la sangre y puede reducir el riesgo de diabetes.',
 25.00, 50, 1, 'c0000013-0000-0000-0000-000000000013'),

('p0000046-0000-0000-0000-000000000046', 'Vinagre de Manzana 250ml', 'vinagre-manzana-250ml',
 'El consumo antes de las comidas ricas en carbohidratos puede reducir los picos de azúcar en la sangre. Ayuda a mejorar la acidez estomacal en personas que producen poco ácido gástrico, facilitando la descomposición de las proteínas.',
 9.00, 50, 1, 'c0000013-0000-0000-0000-000000000013'),

('p0000047-0000-0000-0000-000000000047', 'Vinagre de Manzana 500ml', 'vinagre-manzana-500ml',
 'El consumo antes de las comidas ricas en carbohidratos puede reducir los picos de azúcar en la sangre. Ayuda a mejorar la acidez estomacal en personas que producen poco ácido gástrico, facilitando la descomposición de las proteínas.',
 12.00, 50, 1, 'c0000013-0000-0000-0000-000000000013'),

('p0000048-0000-0000-0000-000000000048', 'Vinagre de Manzana 1lt', 'vinagre-manzana-1lt',
 'El consumo antes de las comidas ricas en carbohidratos puede reducir los picos de azúcar en la sangre. Ayuda a mejorar la acidez estomacal en personas que producen poco ácido gástrico, facilitando la descomposición de las proteínas.',
 15.00, 50, 1, 'c0000013-0000-0000-0000-000000000013'),

('p0000049-0000-0000-0000-000000000049', 'Agua de Plátano – Vinagre 500ml', 'agua-platano-vinagre-500ml',
 'Producto naturalmente beneficioso que ayuda a mejorar la digestión, ayuda a descomponer mejor los alimentos y a reducir la sensación de pesadez tras comidas copiosas, efecto probiótico. También ayuda a limpiar los pulmones (fibrosis pulmonar).',
 25.00, 50, 1, 'c0000013-0000-0000-0000-000000000013'),

('p0000050-0000-0000-0000-000000000050', 'Macerado de Ajos Macho 300ml', 'macerado-ajos-macho-300ml',
 'Producto naturalmente beneficioso para el sistema inmunológico, antioxidante y antiinflamatorio. Actúa como un potente antimicrobiano y antiviral que ayuda a la depuración y desintoxicación del cuerpo, mejorando la circulación.',
 18.00, 50, 1, 'c0000013-0000-0000-0000-000000000013');

-- ===================== FROTACIONES =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000051-0000-0000-0000-000000000051', 'Frotación Refrescaña 50ml', 'frotacion-refrescana-50ml',
 'Es una fórmula natural a base de palta, kion, cúrcuma y aceites esenciales, diseñado para aliviar molestias musculares. Es ideal para tratar torceduras, calambres, dolores articulares y contracturas.',
 15.00, 50, 1, 'c0000014-0000-0000-0000-000000000014'),

('p0000052-0000-0000-0000-000000000052', 'Repara Huesos – Frotación 50ml', 'repara-huesos-frotacion-50ml',
 'Es una fórmula natural a base de plátano, suelda con suelda, chupa sangre, semilla de palta y eucalipto, que te ayudan al alivio natural para huesos y articulaciones. Fortalece los huesos, desinflama y repara con hierbas naturales.',
 30.00, 50, 1, 'c0000014-0000-0000-0000-000000000014'),

('p0000053-0000-0000-0000-000000000053', 'Repara Huesos – Frotación 100ml', 'repara-huesos-frotacion-100ml',
 'Es una fórmula natural a base de plátano, suelda con suelda, chupa sangre, semilla de palta y eucalipto, que te ayudan al alivio natural para huesos y articulaciones. Fortalece los huesos, desinflama y repara con hierbas naturales.',
 45.00, 50, 1, 'c0000014-0000-0000-0000-000000000014');

-- ===================== PROPÓLEO SPRAY =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000054-0000-0000-0000-000000000054', 'Propóleo en Spray 15ml', 'propoleo-spray-15ml',
 'Es una sustancia natural elaborada por las abejas a partir de yemas de árboles, posee propiedades antibacterianas, antivirales y antifúngicas que fortalecen el sistema inmunológico, ayudan a prevenir gripes y resfriados.',
 25.00, 50, 1, 'c0000004-0000-0000-0000-000000000004');

-- ===================== ACEITES ESENCIALES E HIDROLATOS =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000055-0000-0000-0000-000000000055', 'Aceite de Copaiba 10ml', 'aceite-copaiba-10ml',
 'Extraído del árbol de copaiba, ofrece diversos beneficios para la salud, con propiedades cicatrizantes, antisépticas, antiinflamatorias, analgésico y sedantes. Es perfecto para tratar afecciones de la piel y dolores.',
 15.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000056-0000-0000-0000-000000000056', 'Aceite de Copaiba 15ml', 'aceite-copaiba-15ml',
 'Extraído del árbol de copaiba, ofrece diversos beneficios para la salud, con propiedades cicatrizantes, antisépticas, antiinflamatorias, analgésico y sedantes. Es perfecto para tratar afecciones de la piel y dolores.',
 20.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000057-0000-0000-0000-000000000057', 'Sangre de Grado 10ml', 'sangre-de-grado-10ml',
 'Es un poderoso remedio natural con propiedades cicatrizantes, antibacterianas, antisépticas. Es ideal para la curación de heridas y quemaduras, así como para tratar infecciones bacterianas y fúngicas. Es eficaz para el tratamiento de úlceras y gastritis.',
 15.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000058-0000-0000-0000-000000000058', 'Sangre de Grado 15ml', 'sangre-de-grado-15ml',
 'Es un poderoso remedio natural con propiedades cicatrizantes, antibacterianas, antisépticas. Es ideal para la curación de heridas y quemaduras, así como para tratar infecciones bacterianas y fúngicas. Es eficaz para el tratamiento de úlceras y gastritis.',
 20.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000059-0000-0000-0000-000000000059', 'Aceite Esencial de Orégano y Coco 2 en 1 (15ml)', 'aceite-esencial-oregano-coco-2en1-15ml',
 'La combinación de ambos ingredientes es beneficioso para la salud debido a sus propiedades medicinales de cada ingrediente. Ayuda a combatir la candidiasis, elimina el helicobacter pylori y cándida.',
 45.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000060-0000-0000-0000-000000000060', 'Aceite de Orégano Hidrolato 15ml', 'aceite-oregano-hidrolato-15ml',
 'Ayuda a combatir la candidiasis, actúa favorablemente en combatir infecciones respiratorias. Es útil para prevenir la formación de cálculos en la vesícula, antiséptica y antifúngicas.',
 20.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000061-0000-0000-0000-000000000061', 'Aceite de Orégano Hidrolato 30ml', 'aceite-oregano-hidrolato-30ml',
 'Ayuda a combatir la candidiasis, actúa favorablemente en combatir infecciones respiratorias. Es útil para prevenir la formación de cálculos en la vesícula, antiséptica y antifúngicas.',
 25.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000062-0000-0000-0000-000000000062', 'Aceite Esencial de Orégano 5ml', 'aceite-esencial-oregano-5ml',
 'Destacado en aromaterapia por su alta concentración de carvacrol y timol, compuesto con potentes efectos antibacterianos, antifúngicos y antivirales. Ayuda a combatir la fatiga mental, elimina la cándida y el helicobacter.',
 45.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000063-0000-0000-0000-000000000063', 'Aceite Esencial de Orégano 10ml', 'aceite-esencial-oregano-10ml',
 'Destacado en aromaterapia por su alta concentración de carvacrol y timol, compuesto con potentes efectos antibacterianos, antifúngicos y antivirales. Ayuda a combatir la fatiga mental, elimina la cándida y el helicobacter.',
 60.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000064-0000-0000-0000-000000000064', 'Aceite de Orégano – Corferro 30ml', 'aceite-oregano-corferro-30ml',
 'Destacado en aromaterapia por su alta concentración de carvacrol y timol, compuesto con potentes efectos antibacterianos, antifúngicos y antivirales. Ayuda a combatir la fatiga mental, elimina la cándida y el helicobacter.',
 25.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000065-0000-0000-0000-000000000065', 'Pack Aceite de Coco 100ml + Aceite Esencial de Orégano 5ml', 'pack-aceite-coco-100ml-oregano-5ml',
 'La combinación de ambos ingredientes es beneficioso para la salud debido a sus propiedades medicinales de cada producto, ayuda a combatir la cándida, eliminar el helicobacter pylori y candidiasis.',
 50.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000066-0000-0000-0000-000000000066', 'Pack Aceite de Coco 250ml + Aceite Esencial de Orégano 5ml', 'pack-aceite-coco-250ml-oregano-5ml',
 'La combinación de ambos ingredientes es beneficioso para la salud debido a sus propiedades medicinales de cada producto, ayuda a combatir la cándida, eliminar el helicobacter pylori y candidiasis.',
 75.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000067-0000-0000-0000-000000000067', 'Aceite de Matico Hidrolato 15ml', 'aceite-matico-hidrolato-15ml',
 'Posee propiedades antibacterianas, antifúngicas y cicatrizantes, es ideal para tratar acné, heridas, quemaduras, cicatrices, dolores musculares y reumáticos; así como la congestión respiratoria, dolor estomacal e incluso apoyo complementario en casos de covid-19.',
 20.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000068-0000-0000-0000-000000000068', 'Aceite de Matico Hidrolato 30ml', 'aceite-matico-hidrolato-30ml',
 'Posee propiedades antibacterianas, antifúngicas y cicatrizantes, es ideal para tratar acné, heridas, quemaduras, cicatrices, dolores musculares y reumáticos; así como la congestión respiratoria, dolor estomacal e incluso apoyo complementario en casos de covid-19.',
 25.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000069-0000-0000-0000-000000000069', 'Aceite Esencial de Matico 5ml', 'aceite-esencial-matico-5ml',
 'Es ideal para tratar infecciones, dolores y afecciones de la piel. Además de ser útil en la aromaterapia, congestión nasal y sinusitis para mejorar el bienestar.',
 45.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000070-0000-0000-0000-000000000070', 'Aceite Esencial de Matico 10ml', 'aceite-esencial-matico-10ml',
 'Es ideal para tratar infecciones, dolores y afecciones de la piel. Además de ser útil en la aromaterapia, congestión nasal y sinusitis para mejorar el bienestar.',
 60.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000071-0000-0000-0000-000000000071', 'Aceite de Muña Hidrolato 15ml', 'aceite-muna-hidrolato-15ml',
 'Este producto natural descongestiona las vías respiratorias, apoya energía y vitalidad, elimina la helicobacter pylori causante de la gastritis y alivia mareos, soroche y náuseas.',
 20.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000072-0000-0000-0000-000000000072', 'Aceite de Muña Hidrolato 30ml', 'aceite-muna-hidrolato-30ml',
 'Este producto natural descongestiona las vías respiratorias, apoya energía y vitalidad, elimina la helicobacter pylori causante de la gastritis y alivia mareos, soroche y náuseas.',
 25.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000073-0000-0000-0000-000000000073', 'Aceite Esencial de Muña 5ml', 'aceite-esencial-muna-5ml',
 'Este producto natural descongestiona las vías respiratorias, apoya energía y vitalidad, elimina la helicobacter pylori causante de la gastritis y alivia mareos, soroche y náuseas, siendo un excelente apoyo en situaciones de malestar general o durante viajes a zonas de altura.',
 45.00, 50, 1, 'c0000015-0000-0000-0000-000000000015'),

('p0000074-0000-0000-0000-000000000074', 'Aceite Esencial de Muña 10ml', 'aceite-esencial-muna-10ml',
 'Este producto natural descongestiona las vías respiratorias, apoya energía y vitalidad, elimina la helicobacter pylori causante de la gastritis y alivia mareos, soroche y náuseas, siendo un excelente apoyo en situaciones de malestar general o durante viajes a zonas de altura.',
 60.00, 50, 1, 'c0000015-0000-0000-0000-000000000015');

-- ===================== FLORES Y BIENESTAR =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000075-0000-0000-0000-000000000075', 'Flores de Dasha 15ml', 'flores-de-dasha-15ml',
 'Producto destilado y natural que ayuda a tratar trastornos emocionales como el estrés, la ansiedad, el miedo o la tristeza, promoviendo el equilibrio emocional. También apoya en el tratamiento de enfermedades físicas al mejorar el bienestar general de forma suave y sin efectos secundarios.',
 35.00, 50, 1, 'c0000016-0000-0000-0000-000000000016'),

('p0000076-0000-0000-0000-000000000076', 'Flores de Dasha 30ml', 'flores-de-dasha-30ml',
 'Producto destilado y natural que ayuda a tratar trastornos emocionales como el estrés, la ansiedad, el miedo o la tristeza, promoviendo el equilibrio emocional. También apoya en el tratamiento de enfermedades físicas al mejorar el bienestar general de forma suave y sin efectos secundarios.',
 50.00, 50, 1, 'c0000016-0000-0000-0000-000000000016');

-- ===================== JABONES NATURALES =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000077-0000-0000-0000-000000000077', 'Jabón Sangre de Grado 50gr', 'jabon-sangre-de-grado-50gr',
 'Jabón natural hecho con sangre de grado, copaiba, romero y miel de abeja; se convierte en un potente aliado de la salud cutánea debido a sus propiedades cicatrizantes y antioxidantes ideal para cortes menores, marcas de acné, enrojecimiento y hinchazón de la piel irritada.',
 15.00, 50, 1, 'c0000017-0000-0000-0000-000000000017'),

('p0000078-0000-0000-0000-000000000078', 'Jabón de Moringa 50gr', 'jabon-moringa-50gr',
 'Jabón natural hecho con moringa, extracto de avena, conocido como el árbol de la vida por su altísima densidad de nutrientes y beneficios ideal para eliminar células muertas devolviendo la vitalidad a la piel, mantiene la firmeza y elasticidad de la piel. Útil también para personas con dermatitis o psoriasis.',
 15.00, 50, 1, 'c0000017-0000-0000-0000-000000000017'),

('p0000079-0000-0000-0000-000000000079', 'Jabón de Cúrcuma 50gr', 'jabon-curcuma-50gr',
 'Jabón natural hecho con cúrcuma, rosa mosqueta, anís, es ideal para quienes buscan un rostro más iluminado y libre de imperfecciones. Ayuda a desvanecer manchas oscuras causadas por el sol o cicatrices de acné, con el uso constante la piel luce un tono más parejo y saludable.',
 15.00, 50, 1, 'c0000017-0000-0000-0000-000000000017'),

('p0000080-0000-0000-0000-000000000080', 'Jabón de Matico 50gr', 'jabon-matico-50gr',
 'Jabón natural hecho con matico, caléndula y avena; se enfoca exclusivamente en curar, regenerar y proteger la piel, es ideal para el tratamiento de afecciones como el pie de atleta, acelera la curación de cortes, raspaduras o marcas de acné.',
 15.00, 50, 1, 'c0000017-0000-0000-0000-000000000017');

-- ===================== LICORES Y MACERADOS =====================

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `is_active`, `category_id`) VALUES
('p0000081-0000-0000-0000-000000000081', 'Aguardiente de Caña 300ml', 'aguardiente-cana-300ml',
 'Es una bebida tradicional con un sabor intenso, ideal para disfrutar solo en cocteles, además en pequeñas cantidades estimula la digestión, mejora la circulación y aporta calor corporal en climas fríos y combinando con hierbas o miel es usado para aliviar resfriados leves gracias a sus propiedades antisépticas naturales.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000082-0000-0000-0000-000000000082', 'Aguardiente de Caña 500ml', 'aguardiente-cana-500ml',
 'Es una bebida tradicional con un sabor intenso, ideal para disfrutar solo en cocteles, además en pequeñas cantidades estimula la digestión, mejora la circulación y aporta calor corporal en climas fríos y combinando con hierbas o miel es usado para aliviar resfriados leves gracias a sus propiedades antisépticas naturales.',
 25.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000083-0000-0000-0000-000000000083', 'Aguardiente de Caña 750ml', 'aguardiente-cana-750ml',
 'Es una bebida tradicional con un sabor intenso, ideal para disfrutar solo en cocteles, además en pequeñas cantidades estimula la digestión, mejora la circulación y aporta calor corporal en climas fríos y combinando con hierbas o miel es usado para aliviar resfriados leves gracias a sus propiedades antisépticas naturales.',
 35.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000084-0000-0000-0000-000000000084', '7 Raíces 300ml', '7-raices-300ml',
 'Producto natural macerado de las raíces de las plantas que se emplean en la preparación de esta bebida como la uña de gato, chuchuhuasi, clavo huasca, cascarilla, sanango, sangre de grado y moruro. Muy bueno para el bronquio, mejora el sistema inmunológico, dolor de huesos, reumatismo y calambres.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000085-0000-0000-0000-000000000085', '7 Raíces 500ml', '7-raices-500ml',
 'Producto natural macerado de las raíces de las plantas que se emplean en la preparación de esta bebida como la uña de gato, chuchuhuasi, clavo huasca, cascarilla, sanango, sangre de grado y moruro. Muy bueno para el bronquio, mejora el sistema inmunológico, dolor de huesos, reumatismo y calambres.',
 25.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000086-0000-0000-0000-000000000086', 'Licor de Carambola y Piña 300ml', 'licor-carambola-pina-300ml',
 'La maceración de la fruta estrella, piña, clavo, canela y aguardiente es una combinación de sabor tropical vibrante. Ideal para disfrutar solo en cocteles o en pequeñas dosis servirse antes de comer para estimular el apetito o asentar el estómago.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000087-0000-0000-0000-000000000087', 'Chuchuhuasi 300ml', 'chuchuhuasi-300ml',
 'La maceración de la corteza más emblemática de la selva peruana con miel, canela, clavo y aguardiente otorga propiedades para aliviar dolores osteomusculares, tratamiento de artritis, artrosis y reumatismo. Se le conoce como un tónico vitalizador que mejora la libido y regula procesos hormonales.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000088-0000-0000-0000-000000000088', 'Chuchuhuasi 500ml', 'chuchuhuasi-500ml',
 'La maceración de la corteza más emblemática de la selva peruana con miel, canela, clavo y aguardiente otorga propiedades para aliviar dolores osteomusculares, tratamiento de artritis, artrosis y reumatismo. Se le conoce como un tónico vitalizador que mejora la libido y regula procesos hormonales.',
 25.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000089-0000-0000-0000-000000000089', 'Chuchuhuasi 750ml', 'chuchuhuasi-750ml',
 'La maceración de la corteza más emblemática de la selva peruana con miel, canela, clavo y aguardiente otorga propiedades para aliviar dolores osteomusculares, tratamiento de artritis, artrosis y reumatismo. Se le conoce como un tónico vitalizador que mejora la libido y regula procesos hormonales.',
 45.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000090-0000-0000-0000-000000000090', 'Uvachado 300ml', 'uvachado-300ml',
 'La maceración de la uva regional en aguardiente, miel, canela y clavo otorga un exquisito sabor dulce y aroma frutal, que mejora la elasticidad de las arterias y circulación sanguínea. En pequeñas cantidades ayuda a asentar comidas pesadas.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000091-0000-0000-0000-000000000091', 'Uvachado 500ml', 'uvachado-500ml',
 'La maceración de la uva regional en aguardiente, miel, canela y clavo otorga un exquisito sabor dulce y aroma frutal, que mejora la elasticidad de las arterias y circulación sanguínea. En pequeñas cantidades ayuda a asentar comidas pesadas facilitando el proceso digestivo.',
 25.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000092-0000-0000-0000-000000000092', 'Licor de Limón 300ml', 'licor-limon-300ml',
 'La maceración del limón en aguardiente, miel, canela y clavo captura un aroma vibrante ayuda a reducir la sensación de pesadez e hinchazón abdominal después de comidas copiosas. Se disfruta mejor extra frío lo que densifica su textura.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000093-0000-0000-0000-000000000093', 'Licor de Limón 500ml', 'licor-limon-500ml',
 'La maceración del limón en aguardiente, miel, canela y clavo captura un aroma vibrante ayuda a reducir la sensación de pesadez e hinchazón abdominal después de comidas copiosas. Se disfruta mejor extra frío lo que densifica su textura.',
 25.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000094-0000-0000-0000-000000000094', 'Licor de Muña 300ml', 'licor-muna-300ml',
 'La maceración de la muña conocida como la menta de los andes con miel, canela, clavo, aguardiente, contiene un aroma intensamente herbal, fresco y mentolado que favorece la digestión de carnes y alimentos grasos. También ayuda a expulsar gases y reducir la hinchazón abdominal.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000095-0000-0000-0000-000000000095', 'Licor de Muña 500ml', 'licor-muna-500ml',
 'La maceración de la muña conocida como la menta de los andes con miel, canela, clavo, aguardiente, contiene un aroma intensamente herbal, fresco y mentolado que favorece la digestión de carnes y alimentos grasos. También ayuda a expulsar gases y reducir la hinchazón abdominal.',
 25.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000096-0000-0000-0000-000000000096', 'Licor de Naranja 300ml', 'licor-naranja-300ml',
 'La maceración de la naranja, clavo, canela, miel y aguardiente, estimula a procesar alimentos pesados, ayuda a mejorar la circulación sanguínea. Es ideal para aromatizar bizcochos, postres de chocolate creando un contraste sofisticado.',
 18.00, 50, 1, 'c0000018-0000-0000-0000-000000000018'),

('p0000097-0000-0000-0000-000000000097', 'Licor de Naranja 500ml', 'licor-naranja-500ml',
 'La maceración de la naranja, clavo, canela, miel y aguardiente, estimula a procesar alimentos pesados, ayuda a mejorar la circulación sanguínea. Es ideal para aromatizar bizcochos, postres de chocolate creando un contraste sofisticado.',
 25.00, 50, 1, 'c0000018-0000-0000-0000-000000000018');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  Total: 18 categorías, 97 productos
--  Las imágenes se insertarán manualmente en product_images
-- ============================================================
