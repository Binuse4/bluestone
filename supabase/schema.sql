-- ============================================================
-- 1. CRÉATION DES TABLES
-- ============================================================

-- Table des Boutiques (stores)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,           -- Utilisé dans l'URL : /c/catalogue/{slug}
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  whatsapp_number TEXT,                -- Numéro WhatsApp de la boutique (ex: 22997000000)
  address TEXT,                        -- Adresse physique
  theme_color TEXT DEFAULT '#8c6239',  -- Couleur de thème personnalisable
  template TEXT DEFAULT 'elegance',    -- Template de la vitrine : 'elegance', 'minimal'
  currency TEXT DEFAULT 'FCFA',        -- Devise par défaut
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des Catégories (categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_url TEXT,                      -- Ajouté pour le thème moderne
  is_selected BOOLEAN DEFAULT false,  -- Ajouté pour le thème moderne
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des Produits (products)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  currency TEXT DEFAULT 'FCFA',
  image_url TEXT,                     -- Image principale (rétro-compatibilité)
  product_images TEXT[] DEFAULT '{}', -- Multiples images (thème moderne)
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des Bannières de Réduction (banners)
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT,
  discount_rate INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activer Row Level Security (RLS) pour la sécurité
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Créer des règles de lecture publique (tout le monde peut voir les catalogues)
CREATE POLICY "Lecture publique pour stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour products" ON products FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour banners" ON banners FOR SELECT USING (true);

-- Règles d'écriture (à lier avec l'authentification Supabase plus tard)
-- Pour la démo, on autorise l'écriture publique si besoin ou on la restreint aux administrateurs
CREATE POLICY "Écriture publique temporaire pour stores" ON stores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Écriture publique temporaire pour categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Écriture publique temporaire pour products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Écriture publique temporaire pour banners" ON banners FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- 2. INSERTION DES DONNÉES INITIALES (SEED DE DÉMO)
-- ============================================================

-- Variable temporaire pour stocker l'ID de la boutique
DO $$
DECLARE
  v_store_id UUID;
  v_cat_vetements UUID;
  v_cat_sacs UUID;
  v_cat_bijoux UUID;
  v_cat_chaussures UUID;
BEGIN
  -- 1. Créer la boutique de démo
  INSERT INTO stores (slug, name, description, logo_url, cover_url, whatsapp_number, theme_color, currency)
  VALUES (
    'africa-chic',
    'Africa Chic',
    'Créateur de mode contemporaine inspirée du patrimoine africain. Prêt-à-porter de luxe, maroquinerie d''art et accessoires faits main.',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    '22955584187',
    '#8c6239',
    'FCFA'
  )
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_store_id;

  -- 2. Créer les Catégories
  INSERT INTO categories (store_id, name, description, image_url, sort_order)
  VALUES (v_store_id, 'Prêt-à-Porter', 'Robes, vestes et ensembles contemporains en wax.', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=400', 1)
  RETURNING id INTO v_cat_vetements;

  INSERT INTO categories (store_id, name, description, image_url, sort_order)
  VALUES (v_store_id, 'Maroquinerie', 'Sacs à main, pochettes et bagagerie en cuir fin.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400', 2)
  RETURNING id INTO v_cat_sacs;

  INSERT INTO categories (store_id, name, description, image_url, sort_order)
  VALUES (v_store_id, 'Bijoux d''Art', 'Colliers et bracelets sculptés en bronze et perles.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400', 3)
  RETURNING id INTO v_cat_bijoux;

  INSERT INTO categories (store_id, name, description, image_url, sort_order)
  VALUES (v_store_id, 'Chaussures', 'Sandales et souliers en cuir artisanal confortables.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400', 4)
  RETURNING id INTO v_cat_chaussures;

  -- 3. Créer quelques Produits de démonstration
  -- Prêt-à-Porter
  INSERT INTO products (store_id, category_id, name, description, price, image_url, sizes, colors, is_available, sort_order)
  VALUES 
    (v_store_id, v_cat_vetements, 'Robe Muna', 'Robe longue fluide en lin blanc avec broderie fine dorée.', 45000, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blanc', 'Noir', 'Ocre', 'Indigo'], true, 1),
    (v_store_id, v_cat_vetements, 'Blazer Kente Moderne', 'Veste blazer cintrée pour femme avec revers en tissage Kente.', 65000, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blanc', 'Noir', 'Ocre', 'Indigo'], true, 2),
    (v_store_id, v_cat_vetements, 'Chemise Bogolan', 'Chemise en coton bio ornée de motifs Bogolan noirs et ocres.', 32000, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blanc', 'Noir', 'Ocre', 'Indigo'], true, 3);

  -- Maroquinerie
  INSERT INTO products (store_id, category_id, name, description, price, image_url, sizes, colors, is_available, sort_order)
  VALUES 
    (v_store_id, v_cat_sacs, 'Cabas Tote Bogolan', 'Grand cabas du quotidien mariant le cuir et le Bogolan.', 38000, 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600', ARRAY['Standard'], ARRAY['Marron', 'Noir', 'Ocre'], true, 1),
    (v_store_id, v_cat_sacs, 'Mini Sac Seau Kente', 'Sac bandoulière en cuir rigide marron habillé de Kente.', 42000, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600', ARRAY['Standard'], ARRAY['Marron', 'Noir', 'Ocre'], true, 2);

  -- Bijoux
  INSERT INTO products (store_id, category_id, name, description, price, image_url, sizes, colors, is_available, sort_order)
  VALUES 
    (v_store_id, v_cat_bijoux, 'Collier Reine Amina', 'Collier plastron en bronze massif sculpté.', 35000, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600', ARRAY['Unique'], ARRAY['Bronze', 'Or', 'Argent'], true, 1),
    (v_store_id, v_cat_bijoux, 'Créoles Perles Massaï', 'Créoles colorées entièrement perlées à la main.', 12000, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600', ARRAY['Unique'], ARRAY['Bronze', 'Or', 'Argent'], true, 2);

  -- Chaussures
  INSERT INTO products (store_id, category_id, name, description, price, image_url, sizes, colors, is_available, sort_order)
  VALUES 
    (v_store_id, v_cat_chaussures, 'Sandales Nomades Cuir', 'Sandales plates en cuir naturel tanné végétal.', 25000, 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=600', ARRAY['38', '39', '40', '41', '42', '43'], ARRAY['Marron', 'Noir', 'Camel'], true, 1),
    (v_store_id, v_cat_chaussures, 'Mules Raffia Tissé', 'Mules à petit talon en raphia naturel tressé.', 28000, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600', ARRAY['38', '39', '40', '41', '42', '43'], ARRAY['Marron', 'Noir', 'Camel'], true, 2);

  -- 4. Créer des bannières de démonstration
  INSERT INTO banners (store_id, product_id, title, discount_rate, sort_order)
  SELECT 
    v_store_id, 
    id, 
    '20% de réduction sur ' || name,
    20,
    1
  FROM products 
  WHERE name = 'Robe Muna' AND store_id = v_store_id;

  INSERT INTO banners (store_id, product_id, title, discount_rate, sort_order)
  SELECT 
    v_store_id, 
    id, 
    '15% de réduction sur ' || name,
    15,
    2
  FROM products 
  WHERE name = 'Cabas Tote Bogolan' AND store_id = v_store_id;

END $$;
