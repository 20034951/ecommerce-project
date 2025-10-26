/**
 * Seeder de productos (Idempotente)
 * Crea productos de prueba en diferentes categorías
 * Puede ejecutarse múltiples veces agregando más productos
 * Utiliza Pexels API para obtener imágenes reales de productos
 */

import { faker } from '@faker-js/faker';
import db from '../models/index.js';
import PexelsService from '../services/pexelsImageService.js';

const { Product, Category, ProductTag } = db;
const pexelsService = new PexelsService();
let useFaker = false; // Flag para cambiar a Faker cuando Pexels falle

/**
 * Obtiene una imagen de Pexels para un producto
 * @param {string} productName - Nombre del producto
 * @param {string} categoryName - Nombre de la categoría
 * @returns {Promise<string>} - URL de la imagen landscape
 */
const getProductImage = async (productName, categoryName) => {
    // Si ya estamos usando Faker o Pexels tiene rate limit, usar Faker directamente
    if (useFaker || pexelsService.isRateLimitExceeded()) {
        return faker.image.url();
    }

    try {
        // Intentar buscar por nombre del producto
        let photos = await pexelsService.searchPhotos({
            query: productName,
            orientation: 'landscape',
            per_page: 1
        });

        // Si no se encuentran resultados, buscar por categoría
        if (!photos || photos.length === 0) {
            photos = await pexelsService.searchPhotos({
                query: categoryName,
                orientation: 'landscape',
                per_page: 1
            });
        }

        // Si hay resultados, devolver la URL landscape
        if (photos && photos.length > 0) {
            return photos[0].src.landscape;
        }

        // Si no hay resultados, usar imagen de faker
        return faker.image.url();
    } catch (error) {
        // Detectar si es error de rate limit
        if (error.message === 'RATE_LIMIT_EXCEEDED') {
            console.log(`\n   ⚠️  RATE LIMIT ALCANZADO en Pexels API`);
            console.log(`   🔄 Cambiando a Faker para el resto de productos...`);
            useFaker = true;
            return faker.image.url();
        }

        // Otros errores, también cambiar a Faker
        console.log(`   ⚠️  Error obteniendo imagen de Pexels: ${error.message}`);
        console.log(`   🔄 Usando Faker para este producto...`);
        return faker.image.url();
    }
};

// Tags relevantes por categoría
const tagsByCategory = {
    'Electrónica': ['tecnología', 'digital', 'smart', 'gaming', 'portátil', 'inalámbrico', 'HD', '4K', 'USB', 'bluetooth'],
    'Ropa y Calzado': ['moda', 'casual', 'formal', 'deportivo', 'elegante', 'cómodo', 'algodón', 'unisex', 'temporada', 'tendencia'],
    'Hogar y Muebles': ['decoración', 'confort', 'moderno', 'clásico', 'funcional', 'espacio', 'hogar', 'diseño', 'elegante', 'práctico'],
    'Deportes y Aire Libre': ['fitness', 'outdoor', 'ejercicio', 'resistente', 'ligero', 'profesional', 'camping', 'aventura', 'deporte', 'activo'],
    'Libros y Medios': ['lectura', 'educativo', 'entretenimiento', 'cultura', 'bestseller', 'colección', 'digital', 'físico', 'nueva edición', 'popular'],
    'Juguetes y Videojuegos': ['diversión', 'infantil', 'educativo', 'coleccionable', 'multiplayer', 'familia', 'creatividad', 'interactivo', 'edades', 'regalo'],
    'Belleza y Salud': ['natural', 'orgánico', 'cuidado', 'hidratante', 'vitaminas', 'bienestar', 'saludable', 'dermatológico', 'hipoalergénico', 'spa'],
    'Alimentos y Bebidas': ['gourmet', 'orgánico', 'natural', 'saludable', 'premium', 'artesanal', 'importado', 'fresco', 'nutritivo', 'delicioso'],
    'Electrodomésticos y Cocina': ['eficiente', 'potente', 'fácil uso', 'multifuncional', 'ahorro energía', 'acero inoxidable', 'compacto', 'profesional', 'durable', 'cocina'],
    'Jardinería': ['exterior', 'plantas', 'jardín', 'orgánico', 'ecológico', 'decorativo', 'resistente', 'crecimiento', 'verde', 'naturaleza'],
    'Automotriz': ['auto', 'vehículo', 'repuesto', 'original', 'compatible', 'rendimiento', 'durabilidad', 'instalación', 'mantenimiento', 'calidad'],
    'Mascotas': ['mascota', 'perro', 'gato', 'nutritivo', 'saludable', 'natural', 'higiénico', 'cómodo', 'seguro', 'veterinario'],
    'Oficina y Papelería': ['escolar', 'oficina', 'profesional', 'organización', 'productividad', 'escritura', 'archivo', 'estudiante', 'trabajo', 'papelería'],
    'Instrumentos Musicales': ['música', 'profesional', 'principiante', 'sonido', 'acústico', 'eléctrico', 'afinado', 'calidad', 'concierto', 'estudio'],
    'Bebés y Maternidad': ['bebé', 'seguro', 'hipoalergénico', 'suave', 'cuidado', 'confort', 'práctico', 'portátil', 'lavable', 'certificado'],
    'Ferretería y Construcción': ['resistente', 'profesional', 'hogar', 'construcción', 'reparación', 'herramienta', 'durable', 'industrial', 'bricolaje', 'calidad'],
    'Artesanías Guatemaltecas': ['artesanal', 'hecho a mano', 'tradicional', 'guatemalteco', 'maya', 'típico', 'cultural', 'único', 'original', 'étnico'],
    'Fotografía': ['profesional', 'fotografía', 'lente', 'calidad', 'imagen', 'nitidez', 'estudio', 'portátil', 'versátil', 'compatible'],
    'Joyería': ['elegante', 'fino', 'lujo', 'brillante', 'exclusivo', 'regalo', 'especial', 'certificado', 'diseño', 'joyería'],
    'Arte y Manualidades': ['arte', 'creativo', 'manualidades', 'colores', 'pintura', 'diseño', 'hobby', 'artístico', 'DIY', 'proyecto']
};

/**
 * Genera tags aleatorios para un producto
 * @param {string} categoryName - Nombre de la categoría
 * @param {string} productName - Nombre del producto
 * @returns {Array<string>} - Array de tags (2-5 tags)
 */
const generateProductTags = (categoryName, productName) => {
    const categoryTags = tagsByCategory[categoryName] || ['producto', 'calidad', 'nuevo', 'oferta', 'destacado'];
    const numTags = faker.number.int({ min: 2, max: 5 });

    // Mezclar tags de la categoría y seleccionar aleatoriamente
    const shuffledTags = faker.helpers.shuffle(categoryTags);
    const selectedTags = shuffledTags.slice(0, numTags);

    // Agregar un tag basado en el nombre del producto (primera palabra)
    const productWords = productName.toLowerCase().split(' ');
    if (productWords.length > 0 && productWords[0].length > 3) {
        selectedTags.push(productWords[0]);
    }

    // Eliminar duplicados y limitar longitud a 50 caracteres
    return [...new Set(selectedTags)].map(tag => tag.substring(0, 50));
};

// Templates de productos por categoría actualizada
const productTemplates = {
    'Electrónica': [
        'Laptop Gaming', 'Laptop Ultrabook', 'Laptop Workstation', 'PC Desktop Gaming',
        'PC All-in-One', 'Smartphone Android', 'iPhone', 'Smartphone Gaming',
        'Tablet Android', 'iPad', 'Tablet Windows', 'Auriculares Bluetooth',
        'Auriculares Gaming', 'Auriculares Deportivos', 'Smart Watch', 'Fitness Tracker',
        'Smartband', 'Cámara Digital', 'Cámara Mirrorless', 'Cámara DSLR',
        'Consola PlayStation', 'Consola Xbox', 'Consola Nintendo', 'Monitor 4K',
        'Monitor Gaming', 'Monitor Ultrawide', 'Teclado Mecánico', 'Mouse Gaming',
        'Webcam HD', 'Micrófono USB', 'Parlantes Bluetooth', 'Soundbar',
        'Router WiFi', 'Repetidor WiFi', 'Disco Duro Externo', 'SSD Externo',
        'Memoria USB', 'Tarjeta MicroSD', 'Cargador Inalámbrico', 'Power Bank',
        'Cable USB-C', 'Adaptador HDMI', 'Hub USB', 'Dock Station',
        'Soporte Laptop', 'Cooler Laptop', 'Funda Laptop', 'Mochila Laptop',
        'Impresora Multifuncional', 'Impresora Láser', 'Scanner', 'Proyector',
        'Luz LED USB', 'Ventilador USB', 'Calentador USB', 'Hub Ethernet',
        'Switch Ethernet', 'Cámara Seguridad', 'Timbre Inteligente', 'Enchufe Inteligente',
        'Bombilla Inteligente', 'Tira LED RGB', 'Alexa Echo', 'Google Home',
        'Apple TV', 'Chromecast', 'Fire TV Stick', 'Raspberry Pi',
        'Arduino Kit', 'Drone', 'Drone con Cámara', 'Gimbal Smartphone',
        'Estabilizador Cámara', 'Trípode', 'Ring Light', 'Softbox',
        'Micrófono Lavalier', 'Micrófono Condensador', 'Interfaz Audio', 'Mixer Audio',
        'Controlador MIDI', 'Pedal Efecto', 'Amplificador', 'Receptor Bluetooth',
        'Transmisor Bluetooth', 'Antena TV', 'Cable HDMI', 'Cable DisplayPort',
        'Cable VGA', 'Cable Audio', 'Extensión Eléctrica', 'Supresor Picos',
        'UPS', 'Regulador Voltaje', 'Multímetro Digital', 'Soldador Eléctrico'
    ],
    'Ropa y Calzado': [
        'Camiseta Algodón', 'Camiseta Polo', 'Camisa Casual', 'Camisa Formal',
        'Blusa Mujer', 'Top Mujer', 'Suéter', 'Cardigan',
        'Hoodie', 'Chaqueta Jean', 'Chaqueta Cuero', 'Chamarra Impermeable',
        'Abrigo Invierno', 'Blazer', 'Vestido Casual', 'Vestido Elegante',
        'Vestido Fiesta', 'Falda', 'Pantalón Jean', 'Pantalón Formal',
        'Pantalón Deportivo', 'Short Jean', 'Short Deportivo', 'Leggins',
        'Pijama', 'Bata', 'Ropa Interior Hombre', 'Ropa Interior Mujer',
        'Calcetines Deportivos', 'Calcetines Casuales', 'Medias Nylon', 'Pantimedia',
        'Zapatos Deportivos', 'Zapatillas Running', 'Zapatillas Casual', 'Botas Trabajo',
        'Botas Montaña', 'Botas Mujer', 'Sandalias Hombre', 'Sandalias Mujer',
        'Chanclas', 'Zapatos Formales', 'Tacones', 'Zapatos Planos',
        'Gorra', 'Sombrero', 'Bufanda', 'Guantes',
        'Cinturón Cuero', 'Cinturón Tela', 'Corbata', 'Moño',
        'Cartera Hombre', 'Cartera Mujer', 'Bolso Mano', 'Mochila Moda',
        'Lentes Sol', 'Reloj Casual', 'Reloj Formal', 'Pulsera',
        'Collar', 'Aretes', 'Anillo', 'Bufanda Lana',
        'Chaleco', 'Poncho', 'Ruana', 'Traje Completo',
        'Smoking', 'Traje Baño Hombre', 'Bikini', 'Traje Baño Completo',
        'Rash Guard', 'Traje Neopreno', 'Kimono', 'Uniforme Escolar',
        'Delantal Cocina', 'Bata Médica', 'Overol Trabajo', 'Chaleco Reflectivo',
        'Camiseta Térmica', 'Pantalón Térmico', 'Guantes Térmicos', 'Gorro Lana'
    ],
    'Hogar y Muebles': [
        'Sofá 3 Puestos', 'Sofá Esquinero', 'Sofá Cama', 'Sillón Reclinable',
        'Mesa Centro', 'Mesa Comedor', 'Mesa Escritorio', 'Mesa Noche',
        'Silla Comedor', 'Silla Oficina', 'Silla Gaming', 'Taburete Bar',
        'Cama Queen', 'Cama King', 'Cama Individual', 'Litera',
        'Base Cama', 'Colchón Memory Foam', 'Colchón Resortes', 'Almohada Memory Foam',
        'Juego Sábanas', 'Edredón', 'Cobertor', 'Funda Almohada',
        'Cortina Blackout', 'Cortina Transparente', 'Persiana', 'Tapete Sala',
        'Tapete Baño', 'Alfombra', 'Cojín Decorativo', 'Funda Cojín',
        'Lámpara Techo', 'Lámpara Pie', 'Lámpara Mesa', 'Lámpara LED',
        'Espejo Pared', 'Espejo Cuerpo Completo', 'Marco Foto', 'Cuadro Decorativo',
        'Estante Madera', 'Estante Metal', 'Librero', 'Organizador',
        'Clóset Armable', 'Cajonera', 'Baúl', 'Perchero',
        'Zapatero', 'Mueble TV', 'Mueble Cocina', 'Alacena',
        'Carrito Cocina', 'Isla Cocina', 'Barra Desayunador', 'Banco Cocina',
        'Maceta', 'Florero', 'Reloj Pared', 'Reloj Mesa',
        'Candelabro', 'Portavelas', 'Incienso', 'Difusor Aromas',
        'Humidificador', 'Purificador Aire', 'Ventilador Techo', 'Ventilador Pie',
        'Ventilador Mesa', 'Calefactor', 'Aire Acondicionado Portátil', 'Deshumidificador',
        'Cesto Basura', 'Cesto Ropa', 'Organizador Ropa', 'Bolsa Almacenamiento',
        'Caja Organizadora', 'Gancho Pared', 'Repisa Flotante', 'Mueble Baño'
    ],
    'Deportes y Aire Libre': [
        'Bicicleta Montaña', 'Bicicleta Ruta', 'Bicicleta Eléctrica', 'Bicicleta Estática',
        'Casco Bicicleta', 'Guantes Ciclismo', 'Jersey Ciclismo', 'Short Ciclismo',
        'Luces Bicicleta', 'Candado Bicicleta', 'Bomba Aire', 'Kit Reparación',
        'Pesas Ajustables', 'Mancuernas', 'Barra Pesas', 'Discos Pesas',
        'Banco Ejercicio', 'Rack Sentadillas', 'Barra Dominadas', 'Bandas Resistencia',
        'Pelota Yoga', 'Yoga Mat', 'Bloque Yoga', 'Correa Yoga',
        'Pelota Fútbol', 'Pelota Baloncesto', 'Pelota Voleibol', 'Pelota Tenis',
        'Raqueta Tenis', 'Raqueta Bádminton', 'Pelota Ping Pong', 'Raqueta Ping Pong',
        'Guantes Boxeo', 'Vendas Boxeo', 'Saco Boxeo', 'Cuerda Saltar',
        'Rodilleras', 'Coderas', 'Tobilleras', 'Muñequeras',
        'Termo Agua', 'Botella Agua', 'Shaker Proteína', 'Cinturón Peso',
        'Reloj Deportivo', 'Monitor Frecuencia', 'Podómetro', 'Cronómetro',
        'Carpa 2 Personas', 'Carpa 4 Personas', 'Carpa Familiar', 'Casa Campaña',
        'Sleeping Bag', 'Colchoneta Camping', 'Almohada Camping', 'Linterna LED',
        'Linterna Frontal', 'Lámpara Camping', 'Estufa Camping', 'Cooler',
        'Termo Camping', 'Set Utensilios Camping', 'Hacha', 'Machete',
        'Navaja Multiusos', 'Kit Supervivencia', 'Brújula', 'GPS Portátil',
        'Mochila Camping', 'Mochila Hidratación', 'Bolsa Impermeable', 'Poncho Lluvia',
        'Chaqueta Impermeable', 'Pantalón Impermeable', 'Botas Montaña', 'Bastones Trekking',
        'Guantes Montaña', 'Gorro Montaña', 'Buff', 'Lentes Deportivos'
    ],
    'Libros y Medios': [
        'Novela Romance', 'Novela Terror', 'Novela Misterio', 'Novela Ciencia Ficción',
        'Novela Fantasía', 'Novela Histórica', 'Libro Autoayuda', 'Libro Motivacional',
        'Libro Desarrollo Personal', 'Libro Negocios', 'Libro Finanzas', 'Libro Marketing',
        'Libro Programación Python', 'Libro JavaScript', 'Libro Java', 'Libro C++',
        'Libro Diseño Web', 'Libro Algoritmos', 'Libro Inteligencia Artificial', 'Libro Machine Learning',
        'Libro Cocina Internacional', 'Libro Repostería', 'Libro Cocina Saludable', 'Libro Cocina Vegana',
        'Libro Historia Mundial', 'Libro Historia Guatemala', 'Libro Geografía', 'Libro Política',
        'Libro Filosofía', 'Libro Psicología', 'Libro Sociología', 'Libro Economía',
        'Libro Arte', 'Libro Fotografía', 'Libro Pintura', 'Libro Escultura',
        'Libro Música', 'Libro Guitarra', 'Libro Piano', 'Libro Teoría Musical',
        'Comic Marvel', 'Comic DC', 'Manga Shonen', 'Manga Shojo',
        'Graphic Novel', 'Libro Infantil', 'Cuento Niños', 'Libro Juvenil',
        'Enciclopedia', 'Diccionario Español', 'Diccionario Inglés', 'Atlas Mundial',
        'Biblia', 'Libro Religioso', 'Libro Espiritual', 'Libro Meditación',
        'Revista Tecnología', 'Revista Moda', 'Revista Deportes', 'Revista Cocina',
        'DVD Película Acción', 'DVD Película Drama', 'DVD Película Comedia', 'DVD Película Terror',
        'Blu-ray Película', 'Serie TV Box Set', 'Documental Naturaleza', 'Documental Historia',
        'Audiolibro', 'Ebook Reader', 'Funda Ebook', 'Luz Lectura',
        'Marcapáginas', 'Atril Libros', 'Bookends', 'Caja Libros'
    ],
    'Juguetes y Videojuegos': [
        'Lego City', 'Lego Star Wars', 'Lego Technic', 'Lego Friends',
        'Muñeca Barbie', 'Muñeca Baby', 'Casa Muñecas', 'Accesorios Muñecas',
        'Carro Control Remoto', 'Drone Juguete', 'Helicóptero RC', 'Barco RC',
        'Puzzle 500 Piezas', 'Puzzle 1000 Piezas', 'Puzzle 3D', 'Rompecabezas Madera',
        'Juego Mesa Monopoly', 'Juego Mesa Scrabble', 'Ajedrez', 'Damas',
        'Uno Cartas', 'Poker Set', 'Dominó', 'Jenga',
        'Play-Doh', 'Slime', 'Plastilina', 'Masa Modelar',
        'Peluche Oso', 'Peluche Perro', 'Peluche Gato', 'Peluche Personaje',
        'Figura Acción Marvel', 'Figura Acción DC', 'Figura Anime', 'Figura Colección',
        'Hot Wheels', 'Pista Carreras', 'Garage Juguete', 'Set Construcción',
        'Nerf Blaster', 'Pistola Agua', 'Espada Juguete', 'Escudo Juguete',
        'Cocina Juguete', 'Set Doctor', 'Set Herramientas', 'Caja Registradora',
        'Triciclo', 'Bicicleta Niños', 'Patineta', 'Patines',
        'Pelota Juguete', 'Aro Basketball', 'Portería Fútbol', 'Set Baseball',
        'Nintendo Switch', 'PlayStation 5', 'Xbox Series X', 'Steam Deck',
        'Juego PlayStation', 'Juego Xbox', 'Juego Nintendo', 'Juego PC',
        'Control PlayStation', 'Control Xbox', 'Control Nintendo', 'Control PC',
        'Audífonos Gaming', 'Headset Gaming', 'Micrófono Gaming', 'Webcam Gaming',
        'Silla Gaming', 'Escritorio Gaming', 'Mouse Pad XXL', 'Soporte Control'
    ],
    'Belleza y Salud': [
        'Crema Facial Día', 'Crema Facial Noche', 'Crema Anti-edad', 'Crema Hidratante',
        'Serum Facial', 'Tónico Facial', 'Limpiador Facial', 'Exfoliante Facial',
        'Mascarilla Facial', 'Contorno Ojos', 'Bloqueador Solar', 'BB Cream',
        'Shampoo Hidratación', 'Shampoo Anti-caída', 'Shampoo Volumen', 'Shampoo Tinte',
        'Acondicionador', 'Tratamiento Capilar', 'Aceite Capilar', 'Mascarilla Capilar',
        'Gel Peinar', 'Cera Peinar', 'Spray Fijador', 'Mousse Cabello',
        'Perfume Mujer', 'Perfume Hombre', 'Colonia', 'Body Splash',
        'Desodorante Roll-on', 'Desodorante Spray', 'Desodorante Natural', 'Antitranspirante',
        'Crema Corporal', 'Loción Corporal', 'Aceite Corporal', 'Exfoliante Corporal',
        'Jabón Líquido', 'Gel Ducha', 'Sales Baño', 'Bombas Baño',
        'Set Maquillaje', 'Base Maquillaje', 'Corrector', 'Polvo Compacto',
        'Rubor', 'Iluminador', 'Bronceador', 'Paleta Sombras',
        'Delineador Ojos', 'Máscara Pestañas', 'Lápiz Cejas', 'Gel Cejas',
        'Labial Líquido', 'Labial Barra', 'Gloss', 'Tinte Labios',
        'Esmalte Uñas', 'Kit Manicure', 'Removedor Esmalte', 'Aceite Cutículas',
        'Cepillo Dientes Eléctrico', 'Pasta Dental Blanqueadora', 'Hilo Dental', 'Enjuague Bucal',
        'Vitamina C', 'Vitamina D', 'Multivitamínico', 'Omega 3',
        'Proteína Whey', 'Creatina', 'Pre-workout', 'Aminoácidos',
        'Termómetro Digital', 'Tensiómetro', 'Glucómetro', 'Oxímetro',
        'Vaporizer', 'Humidificador', 'Masajeador Eléctrico', 'Almohadilla Térmica'
    ],
    'Alimentos y Bebidas': [
        'Café Gourmet Guatemala', 'Café Orgánico', 'Café Instantáneo', 'Café Descafeinado',
        'Té Verde', 'Té Negro', 'Té Herbal', 'Té Chai',
        'Chocolate Tableta', 'Chocolate Bombones', 'Chocolate Oscuro', 'Chocolate Blanco',
        'Galletas Chocolate Chip', 'Galletas Avena', 'Galletas Integrales', 'Galletas Surtidas',
        'Cereales Corn Flakes', 'Cereales Avena', 'Granola', 'Muesli',
        'Miel Pura', 'Mermelada Fresa', 'Mermelada Mora', 'Mantequilla Maní',
        'Aceite Oliva Extra Virgen', 'Aceite Aguacate', 'Aceite Coco', 'Aceite Girasol',
        'Vinagre Balsámico', 'Vinagre Manzana', 'Salsa Soya', 'Salsa Inglesa',
        'Especias Italianas', 'Especias Mexicanas', 'Pimienta Negra', 'Sal Marina',
        'Azúcar Orgánica', 'Azúcar Morena', 'Miel Maple', 'Stevia',
        'Pasta Espagueti', 'Pasta Penne', 'Pasta Fusilli', 'Pasta Lasagna',
        'Arroz Blanco', 'Arroz Integral', 'Quinoa', 'Lentejas',
        'Frijoles Negros', 'Garbanzos', 'Harina Trigo', 'Harina Integral',
        'Leche Entera', 'Leche Deslactosada', 'Leche Almendra', 'Leche Coco',
        'Yogurt Natural', 'Yogurt Griego', 'Queso Crema', 'Queso Cheddar',
        'Atún Lata', 'Sardinas', 'Salmón Ahumado', 'Mariscos Mixtos',
        'Frutos Secos Mix', 'Almendras', 'Nueces', 'Pistachos',
        'Chips Papas', 'Palomitas Maíz', 'Nachos', 'Pretzels',
        'Salsa Tomate', 'Salsa BBQ', 'Mostaza', 'Ketchup',
        'Agua Mineral', 'Jugo Naranja', 'Jugo Manzana', 'Bebida Energética'
    ]
};

// Continúa con las demás categorías...

const productTemplatesRest = {
    'Electrodomésticos y Cocina': [
        'Refrigeradora', 'Congelador', 'Horno Eléctrico', 'Microondas',
        'Licuadora', 'Batidora', 'Procesador Alimentos', 'Extractor Jugos',
        'Cafetera Espresso', 'Cafetera Goteo', 'Tetera Eléctrica', 'Tostadora',
        'Freidora Aire', 'Olla Arrocera', 'Olla Presión Eléctrica', 'Olla Lenta',
        'Plancha Vapor', 'Plancha Ropa', 'Centro Planchado', 'Aspiradora Robot',
        'Aspiradora Mano', 'Lavadora', 'Secadora', 'Lavaplatos',
        'Horno Tostador', 'Parrilla Eléctrica', 'Sandwichera', 'Waflera',
        'Crepera', 'Fondue', 'Raclette', 'Pizza Maker',
        'Deshidratador Alimentos', 'Picadora Carne', 'Embutidora', 'Amasadora',
        'Báscula Cocina', 'Termómetro Cocina', 'Timer Cocina', 'Molino Café',
        'Set Cuchillos', 'Tabla Cortar', 'Pelador Eléctrico', 'Abrelatas Eléctrico',
        'Rallador Eléctrico', 'Exprimidor', 'Prensa Ajos', 'Cortador Vegetales',
        'Set Ollas', 'Sartén Antiadherente', 'Wok', 'Cacerola',
        'Olla Vapor', 'Colador', 'Bowl Set', 'Vasos Medidores',
        'Espátulas Set', 'Cucharones', 'Pinzas Cocina', 'Batidor Manual',
        'Rodillo Amasar', 'Moldes Hornear', 'Bandeja Horno', 'Refractarios',
        'Tazas Café', 'Copas Vino', 'Vasos', 'Platos Set',
        'Cubiertos Set', 'Servilletero', 'Salero Pimentero', 'Azucarera',
        'Recipientes Almacenamiento', 'Frascos Vidrio', 'Contenedores Plástico', 'Lunch Box',
        'Termo Comida', 'Fiambrera', 'Botella Aceite', 'Botella Vinagre'
    ],
    'Jardinería': [
        'Cortadora Césped Manual', 'Cortadora Césped Eléctrica', 'Bordeadora', 'Motosierra',
        'Sopladora Hojas', 'Aspiradora Hojas', 'Tijeras Podar', 'Serrucho Podar',
        'Rastrillo', 'Pala Jardinería', 'Azada', 'Pico',
        'Carretilla', 'Regadera', 'Manguera Jardín', 'Pistola Riego',
        'Sistema Riego Automático', 'Aspersor', 'Timer Riego', 'Bomba Agua',
        'Guantes Jardinería', 'Rodillera Jardinería', 'Delantal Jardinería', 'Botas Jardín',
        'Maceta Plástico', 'Maceta Cerámica', 'Maceta Colgante', 'Jardinera',
        'Tierra Abono', 'Sustrato Universal', 'Humus Lombriz', 'Compost',
        'Fertilizante Plantas', 'Fertilizante Césped', 'Insecticida Natural', 'Fungicida',
        'Semillas Vegetales', 'Semillas Flores', 'Semillas Hierbas', 'Bulbos',
        'Cerca Jardín', 'Enrejado', 'Soporte Plantas', 'Estacas',
        'Invernadero Mini', 'Invernadero Grande', 'Malla Sombra', 'Plástico Invernadero',
        'Piedras Decorativas', 'Corteza Pino', 'Gravilla', 'Arena Jardín',
        'Fuente Agua Decorativa', 'Estatua Jardín', 'Gnomo Jardín', 'Luz Solar Jardín',
        'Reflector Jardín', 'Poste Luz', 'Guirnalda Luces', 'Antorcha Jardín',
        'Comedero Pájaros', 'Bebedero Pájaros', 'Casa Pájaros', 'Hotel Insectos',
        'Hamaca Jardín', 'Columpio', 'Reposera', 'Set Muebles Jardín',
        'Sombrilla Jardín', 'Toldo', 'Pérgola', 'Gazebo',
        'Parrilla Carbón', 'Parrilla Gas', 'Ahumador', 'Pizza Oven',
        'Mesa Jardín', 'Sillas Jardín', 'Banco Jardín', 'Cojines Exterior'
    ],
    'Automotriz': [
        'Aceite Motor Sintético', 'Aceite Motor Semi-sintético', 'Aceite Transmisión', 'Líquido Frenos',
        'Refrigerante Motor', 'Líquido Dirección', 'Aditivo Motor', 'Limpia Inyectores',
        'Filtro Aceite', 'Filtro Aire', 'Filtro Combustible', 'Filtro Cabina',
        'Batería Auto', 'Alternador', 'Motor Arranque', 'Bujías',
        'Cables Bujías', 'Bobina Encendido', 'Sensor Oxígeno', 'Sensor Temperatura',
        'Pastillas Freno', 'Discos Freno', 'Tambor Freno', 'Zapatas Freno',
        'Amortiguadores', 'Resortes Suspensión', 'Rotulas', 'Terminales Dirección',
        'Llanta 14"', 'Llanta 15"', 'Llanta 16"', 'Llanta 17"',
        'Rin Aluminio', 'Tapón Rueda', 'Válvula Llanta', 'Parche Llanta',
        'Limpia Parabrisas', 'Escobilla Limpiaparabrisas', 'Líquido Limpiaparabrisas', 'Repelente Lluvia',
        'Foco Halógeno', 'Foco LED', 'Foco Xenón', 'Kit Luces LED',
        'Espejo Retrovisor', 'Espejo Lateral', 'Vidrio Lateral', 'Parabrisas',
        'Alarma Auto', 'GPS Rastreo', 'Cámara Retroceso', 'Sensor Estacionamiento',
        'Radio Bluetooth', 'Parlantes Auto', 'Subwoofer', 'Amplificador',
        'Cargador USB Auto', 'Soporte Celular', 'Transmisor FM', 'Dash Cam',
        'Funda Asiento', 'Tapetes Goma', 'Tapetes Alfombra', 'Organizador Baúl',
        'Perfume Auto', 'Ambientador', 'Limpiador Tablero', 'Cera Auto',
        'Shampoo Auto', 'Pulidor', 'Sellador Pintura', 'Limpiador Llantas',
        'Aspiradora Auto', 'Compresor Aire', 'Inflador Portátil', 'Manómetro',
        'Gato Hidráulico', 'Llave Cruz', 'Kit Herramientas', 'Cable Pasar Corriente',
        'Triángulo Seguridad', 'Chaleco Reflectivo', 'Extintor', 'Botiquín Auto'
    ],
    'Mascotas': [
        'Alimento Perro Adulto', 'Alimento Perro Cachorro', 'Alimento Perro Senior', 'Alimento Perro Light',
        'Alimento Gato Adulto', 'Alimento Gato Gatito', 'Alimento Gato Senior', 'Alimento Gato Esterilizado',
        'Snacks Perro', 'Snacks Gato', 'Hueso Masticable', 'Premios Entrenamiento',
        'Shampoo Perro', 'Shampoo Gato', 'Acondicionador Mascotas', 'Antipulgas',
        'Collar Perro', 'Collar Gato', 'Correa', 'Arnés',
        'Placa Identificación', 'Bozal', 'Pechera', 'Correa Retráctil',
        'Cama Perro Pequeño', 'Cama Perro Grande', 'Cama Gato', 'Casita Mascotas',
        'Transportadora Pequeña', 'Transportadora Grande', 'Mochila Transporte', 'Bolso Transporte',
        'Comedero Perro', 'Comedero Gato', 'Bebedero Automático', 'Fuente Agua Gatos',
        'Arenero Gato', 'Arena Sanitaria', 'Pala Arenero', 'Tapete Arenero',
        'Juguete Pelota', 'Juguete Cuerda', 'Juguete Interactivo', 'Rascador Gato',
        'Poste Rascador', 'Torre Gatos', 'Túnel Gatos', 'Ratón Juguete',
        'Cepillo Perro', 'Cepillo Gato', 'Peine Antipulgas', 'Cortauñas',
        'Jaula Pájaros', 'Jaula Hámster', 'Jaula Conejo', 'Terrario',
        'Alimento Pájaros', 'Alimento Hámster', 'Alimento Conejo', 'Alimento Peces',
        'Acuario 10L', 'Acuario 20L', 'Acuario 50L', 'Filtro Acuario',
        'Bomba Aire Acuario', 'Calentador Acuario', 'Luz LED Acuario', 'Decoración Acuario',
        'Vitaminas Perro', 'Vitaminas Gato', 'Suplemento Articulaciones', 'Antiparasitario',
        'Pañales Perro', 'Toallitas Húmedas', 'Repelente Orina', 'Neutralizador Olores',
        'GPS Mascota', 'Cámara Mascota', 'Dispensador Automático', 'Fuente Viaje'
    ],
    'Oficina y Papelería': [
        'Papel Bond Carta', 'Papel Bond Oficio', 'Papel Fotográfico', 'Papel Adhesivo',
        'Cuaderno Espiral', 'Cuaderno Cosido', 'Libreta', 'Agenda',
        'Folder Manila', 'Folder Plástico', 'Archivador', 'Caja Archivo',
        'Lapicero Azul', 'Lapicero Negro', 'Lapicero Rojo', 'Set Lapiceros',
        'Lápiz HB', 'Lápiz 2B', 'Portaminas', 'Minas',
        'Marcador Permanente', 'Marcador Borrable', 'Marcador Fluorescente', 'Marcador Pizarra',
        'Corrector Líquido', 'Corrector Cinta', 'Borrador', 'Sacapuntas',
        'Cinta Adhesiva', 'Cinta Doble Cara', 'Cinta Empaque', 'Dispensador Cinta',
        'Grapadora', 'Grapas', 'Perforadora', 'Clips',
        'Tijeras', 'Cutter', 'Regla 30cm', 'Escuadra',
        'Pegamento Barra', 'Pegamento Líquido', 'Silicón Caliente', 'Pistola Silicón',
        'Post-it', 'Banderitas', 'Etiquetas Adhesivas', 'Papel Contacto',
        'Calculadora Básica', 'Calculadora Científica', 'Calculadora Impresora', 'Sumadora',
        'Escritorio Oficina', 'Silla Oficina', 'Archivero', 'Estante Oficina',
        'Lámpara Escritorio', 'Organizador Escritorio', 'Porta Lapiceros', 'Bandeja Documentos',
        'Pizarra Blanca', 'Pizarra Corcho', 'Caballete', 'Atril',
        'Calendario Pared', 'Calendario Escritorio', 'Planificador', 'Reloj Pared Oficina',
        'Sello Automático', 'Almohadilla Sello', 'Numerador', 'Fechador',
        'Sobre Manila', 'Sobre Blanco', 'Sobre Burbuja', 'Portafolio',
        'Maletín Ejecutivo', 'Mochila Laptop', 'Lonchera Térmica', 'Termo Oficina'
    ],
    'Instrumentos Musicales': [
        'Guitarra Acústica', 'Guitarra Eléctrica', 'Guitarra Clásica', 'Bajo Eléctrico',
        'Cuerdas Guitarra', 'Púas', 'Capotraste', 'Afinador Guitarra',
        'Soporte Guitarra', 'Funda Guitarra', 'Estuche Guitarra', 'Amplificador Guitarra',
        'Piano Digital', 'Teclado Musical', 'Sintetizador', 'Controlador MIDI',
        'Banco Piano', 'Atril Partituras', 'Pedal Sustain', 'Metrónomo',
        'Batería Acústica', 'Batería Electrónica', 'Cajón Peruano', 'Bongos',
        'Congas', 'Djembe', 'Timbal', 'Platillos',
        'Baquetas', 'Escobillas', 'Pad Práctica', 'Alfombra Batería',
        'Violín', 'Viola', 'Cello', 'Contrabajo',
        'Arco Violín', 'Cuerdas Violín', 'Resina', 'Barbada',
        'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 'Clarinete',
        'Flauta Traversa', 'Flauta Dulce', 'Armónica', 'Ocarina',
        'Ukulele Soprano', 'Ukulele Concierto', 'Ukulele Tenor', 'Charango',
        'Mandolina', 'Banjo', 'Acordeón', 'Melódica',
        'Micrófono Dinámico', 'Micrófono Condensador', 'Micrófono Inalámbrico', 'Cable XLR',
        'Interfaz Audio USB', 'Mixer', 'Monitor Estudio', 'Auriculares Estudio',
        'Pedal Efectos Guitarra', 'Pedal Distorsión', 'Pedal Delay', 'Pedal Reverb',
        'Pedalera Multiefectos', 'Amplificador Bajo', 'Amplificador Teclado', 'DI Box',
        'Funda Teclado', 'Estuche Trompeta', 'Estuche Saxofón', 'Funda Ukulele',
        'Libro Teoría Musical', 'Libro Guitarra', 'Libro Piano', 'Partituras'
    ],
    'Bebés y Maternidad': [
        'Pañales Recién Nacido', 'Pañales Etapa 1', 'Pañales Etapa 2', 'Pañales Etapa 3',
        'Toallitas Húmedas', 'Crema Pañalera', 'Aceite Bebé', 'Loción Bebé',
        'Shampoo Bebé', 'Jabón Bebé', 'Talco Bebé', 'Colonia Bebé',
        'Biberón 4oz', 'Biberón 8oz', 'Chupón Ortodóntico', 'Esterilizador',
        'Calienta Biberones', 'Cepillo Biberones', 'Baberos', 'Paños Lactancia',
        'Extractor Leche Manual', 'Extractor Leche Eléctrico', 'Bolsas Almacenar Leche', 'Cojín Lactancia',
        'Cuna Madera', 'Cuna Colecho', 'Moisés', 'Corral',
        'Colchón Cuna', 'Protector Colchón', 'Sábanas Cuna', 'Cobija Bebé',
        'Móvil Musical', 'Monitor Bebé', 'Luz Nocturna', 'Humidificador Bebé',
        'Coche Paraguas', 'Coche Sistema Viaje', 'Coche Doble', 'Coche Jogger',
        'Silla Auto', 'Portabebés', 'Canguro Ergonómico', 'Fular',
        'Pañalera', 'Cambiador Portátil', 'Organizador Coche', 'Espejo Retrovisor Bebé',
        'Bañera Bebé', 'Tina Plegable', 'Asiento Baño', 'Termómetro Baño',
        'Toalla Capucha', 'Esponja Bebé', 'Cepillo Cabello', 'Cortauñas Bebé',
        'Termómetro Digital', 'Aspirador Nasal', 'Nebulizador', 'Botiquín Bebé',
        'Silla Comer', 'Booster', 'Platos Bebé', 'Cubiertos Bebé',
        'Vasos Antiderrame', 'Bowl Ventosa', 'Babero Silicón', 'Triturador Alimentos',
        'Body Manga Corta', 'Body Manga Larga', 'Pijama Bebé', 'Conjuntos Bebé',
        'Calcetines Antideslizantes', 'Gorros Bebé', 'Guantes Bebé', 'Zapatos Primeros Pasos',
        'Mordedor', 'Sonajero', 'Peluche Bebé', 'Gimnasio Bebé'
    ],
    'Ferretería y Construcción': [
        'Taladro Percutor', 'Taladro Inalámbrico', 'Rotomartillo', 'Atornillador Eléctrico',
        'Esmeriladora Angular', 'Sierra Circular', 'Sierra Caladora', 'Lijadora Orbital',
        'Compresor Aire', 'Pistola Pintura', 'Soldadora Eléctrica', 'Soldadora Inverter',
        'Generador Eléctrico', 'Planta Soldar', 'Hidrolavadora', 'Aspiradora Industrial',
        'Martillo', 'Martillo Demolición', 'Combo Herramientas', 'Alicate',
        'Destornilladores Set', 'Llaves Combinadas', 'Llaves Allen', 'Llaves Torque',
        'Caja Herramientas', 'Carrito Herramientas', 'Panel Herramientas', 'Organizador Tornillos',
        'Nivel Burbuja', 'Nivel Láser', 'Flexómetro', 'Escuadra Metálica',
        'Cemento Gris', 'Cemento Blanco', 'Cal', 'Arena',
        'Piedrín', 'Block', 'Ladrillo', 'Adoquín',
        'Hierro Varilla', 'Alambre Amarre', 'Malla Electrosoldada', 'Clavos',
        'Tornillos', 'Pernos', 'Tuercas', 'Arandelas',
        'Pegamento Construcción', 'Sellador Silicón', 'Espuma Expandible', 'Cinta Teflón',
        'Tubo PVC', 'Codo PVC', 'Tee PVC', 'Válvula PVC',
        'Tubo Cobre', 'Soldadura Plata', 'Pasta Soldar', 'Soplete',
        'Llave Paso', 'Llave Ducha', 'Mezcladora', 'Grifo Jardín',
        'Inodoro', 'Lavamanos', 'Fregadero', 'Tina Baño',
        'Cerámica Piso', 'Cerámica Pared', 'Porcelanato', 'Adhesivo Cerámica',
        'Puerta Madera', 'Puerta Metal', 'Ventana Aluminio', 'Ventana PVC',
        'Pintura Látex', 'Pintura Aceite', 'Barniz', 'Thinner',
        'Brocha', 'Rodillo', 'Bandeja Pintura', 'Cinta Enmascarar',
        'Candado', 'Cerradura', 'Bisagra', 'Chapa'
    ],
    'Artesanías Guatemaltecas': [
        'Huipil Tradicional', 'Corte Típico', 'Faja Tejida', 'Güipil Ceremonial',
        'Blusa Bordada', 'Camisa Típica', 'Pantalón Típico', 'Falda Típica',
        'Bolso Tejido', 'Morral Típico', 'Mochila Artesanal', 'Cartera Bordada',
        'Textil Pared Pequeño', 'Textil Pared Grande', 'Camino Mesa', 'Individual Mesa',
        'Cojín Bordado', 'Funda Cojín Típica', 'Manta Típica', 'Colcha Artesanal',
        'Joyero Madera', 'Cofre Tallado', 'Caja Decorativa', 'Alhajero',
        'Máscara Ceremonial', 'Máscara Decorativa', 'Máscara Danza', 'Máscara Animales',
        'Cerámica Pintada', 'Vasija Barro', 'Olla Barro', 'Plato Decorativo',
        'Taza Artesanal', 'Jarra Cerámica', 'Florero Cerámica', 'Maceta Pintada',
        'Jade Guatemalteco', 'Collar Jade', 'Pulsera Jade', 'Aretes Jade',
        'Anillo Jade', 'Dije Jade', 'Figura Jade', 'Piedra Jade',
        'Marimba Miniatura', 'Instrumento Decorativo', 'Tambor Artesanal', 'Flauta Madera',
        'Imán Guatemala', 'Llavero Típico', 'Pin Guatemala', 'Adorno Navideño',
        'Nacimiento Artesanal', 'Figura Religiosa', 'Cruz Madera', 'Rosario Artesanal',
        'Pintura Colonial', 'Cuadro Típico', 'Arte Naif', 'Paisaje Guatemala',
        'Escultura Madera', 'Talla Santos', 'Figura Animal', 'Estatua Decorativa',
        'Tapete Lana', 'Alfombra Artesanal', 'Petate', 'Estera',
        'Canasta Palma', 'Cesto Mimbre', 'Frutero Artesanal', 'Panera Típica',
        'Portarretrato Madera', 'Espejo Tallado', 'Marco Artesanal', 'Reloj Madera',
        'Vela Artesanal', 'Incensario', 'Sahumerio', 'Portavelas Cerámica'
    ],
    'Fotografía': [
        'Cámara DSLR Canon', 'Cámara DSLR Nikon', 'Cámara Mirrorless Sony', 'Cámara Mirrorless Fuji',
        'Lente 50mm f/1.8', 'Lente 85mm f/1.8', 'Lente 24-70mm', 'Lente 70-200mm',
        'Lente Gran Angular', 'Lente Macro', 'Lente Ojo Pez', 'Teleobjetivo',
        'Flash Externo', 'Flash Anular', 'Transmisor Flash', 'Difusor Flash',
        'Trípode Carbono', 'Trípode Aluminio', 'Monopié', 'Trípode Viaje',
        'Cabezal Bola', 'Cabezal Fluido', 'Rotula Panorámica', 'Plato Rápido',
        'Mochila Fotográfica', 'Bolso Cámara', 'Estuche Lente', 'Cubre Lluvia',
        'Tarjeta SD 64GB', 'Tarjeta SD 128GB', 'Tarjeta CF', 'Lector Tarjetas',
        'Batería Extra', 'Cargador Doble', 'Empuñadura Batería', 'Power Bank Cámara',
        'Filtro UV', 'Filtro Polarizador', 'Filtro ND', 'Set Filtros',
        'Parasol Lente', 'Tapa Lente', 'Correa Cámara', 'Correa Muñeca',
        'Kit Limpieza', 'Soplador', 'Paño Microfibra', 'Hisopos',
        'Fondo Blanco', 'Fondo Negro', 'Fondo Verde', 'Soporte Fondos',
        'Softbox 60x60', 'Softbox 80x80', 'Paraguas Blanco', 'Paraguas Plateado',
        'Ring Light 18"', 'Panel LED', 'Luz Continua', 'Reflector',
        'Disparador Remoto', 'Intervalómetro', 'Control Inalámbrico', 'Cable Disparador',
        'Estabilizador Gimbal', 'Slider', 'Steadicam', 'Rig Cámara',
        'Micrófono Shotgun', 'Micrófono Lavalier', 'Monitor Externo', 'Grabador Audio',
        'Impresora Fotográfica', 'Papel Fotográfico', 'Marcos', 'Álbum Fotos',
        'Software Edición', 'Tablet Gráfica', 'Calibrador Monitor', 'Disco Duro'
    ],
    'Joyería': [
        'Anillo Oro 14k', 'Anillo Oro 18k', 'Anillo Plata 925', 'Anillo Compromiso',
        'Anillo Diamante', 'Anillo Esmeralda', 'Anillo Rubí', 'Anillo Zafiro',
        'Collar Oro', 'Collar Plata', 'Collar Perlas', 'Collar Cadena',
        'Gargantilla', 'Choker', 'Collar Largo', 'Collar Múltiple',
        'Pulsera Oro', 'Pulsera Plata', 'Pulsera Tenis', 'Pulsera Eslabones',
        'Brazalete', 'Pulsera Dijes', 'Pulsera Macramé', 'Pulsera Cuero',
        'Aretes Oro', 'Aretes Plata', 'Aretes Diamante', 'Aretes Perla',
        'Arracadas', 'Aretes Botón', 'Aretes Largos', 'Aretes Argolla',
        'Dije Oro', 'Dije Plata', 'Dije Inicial', 'Dije Corazón',
        'Cadena Oro', 'Cadena Plata', 'Cadena Cubana', 'Cadena Figaro',
        'Tobillera Oro', 'Tobillera Plata', 'Tobillera Dijes', 'Tobillera Cadena',
        'Broche Oro', 'Broche Plata', 'Broche Vintage', 'Pin Decorativo',
        'Gemelos', 'Pisacorbata', 'Alfiler Corbata', 'Clip Dinero',
        'Rosario Oro', 'Rosario Plata', 'Cruz Oro', 'Cruz Plata',
        'Reloj Oro', 'Reloj Plata', 'Reloj Diamantes', 'Reloj Suizo',
        'Anillo Bodas', 'Set Novios', 'Alianza Oro', 'Alianza Platino',
        'Piercing Oro', 'Piercing Plata', 'Piercing Titanio', 'Expansor',
        'Joyero Grande', 'Joyero Viaje', 'Organizador Joyas', 'Porta Anillos',
        'Limpiador Joyas', 'Paño Limpieza', 'Kit Reparación', 'Caja Regalo',
        'Certificado Autenticidad', 'Tasación', 'Pulido Joyas', 'Baño Oro'
    ],
    'Arte y Manualidades': [
        'Set Pinturas Acrílicas', 'Set Pinturas Óleo', 'Acuarelas', 'Témperas',
        'Pinceles Redondos', 'Pinceles Planos', 'Espátulas', 'Rodillo Pintura',
        'Lienzo 20x30', 'Lienzo 30x40', 'Lienzo 40x50', 'Bastidor',
        'Block Dibujo', 'Papel Acuarela', 'Papel Opalina', 'Cartulina',
        'Lápices Colores', 'Lápices Grafito', 'Carboncillo', 'Pasteles',
        'Marcadores Artísticos', 'Rotuladores', 'Plumones', 'Tinta China',
        'Paleta Madera', 'Paleta Plástico', 'Godete', 'Recipiente Agua',
        'Caballete Madera', 'Caballete Aluminio', 'Atril Mesa', 'Caja Pintura',
        'Arcilla Polimerica', 'Arcilla Natural', 'Pasta Flexible', 'Porcelana Fría',
        'Moldes Silicona', 'Rodillo Arcilla', 'Herramientas Modelado', 'Cortadores',
        'Resina Epoxi', 'Catalizador', 'Pigmentos', 'Purpurina',
        'Foami Liso', 'Foami Glitter', 'Foami Estampado', 'Goma Eva',
        'Fieltro', 'Tela', 'Hilo Bordar', 'Aguja Bordar',
        'Pistola Silicón', 'Barras Silicón', 'Pegamento Universal', 'Pegamento Foami',
        'Tijeras Normales', 'Tijeras Zigzag', 'Cutter Precisión', 'Bisturí',
        'Papel Seda', 'Papel Crepe', 'Papel Metálico', 'Papel Estampado',
        'Cintas Decorativas', 'Encajes', 'Botones', 'Lentejuelas',
        'Cuentas', 'Mostacillas', 'Alambre', 'Hilo Nylon',
        'Stickers', 'Calcomanías', 'Stencil', 'Plantillas',
        'Barniz Acrílico', 'Barniz Spray', 'Fijador', 'Medium'
    ]
};

// Mapeo de rangos de precios y stock por categoría
const categoryPriceRanges = {
    'Electrónica': { price: [50, 2500], stock: [5, 100] },
    'Ropa y Calzado': { price: [15, 200], stock: [30, 150] },
    'Hogar y Muebles': { price: [25, 1500], stock: [10, 80] },
    'Deportes y Aire Libre': { price: [20, 1000], stock: [15, 100] },
    'Libros y Medios': { price: [8, 80], stock: [30, 200] },
    'Juguetes y Videojuegos': { price: [10, 500], stock: [20, 150] },
    'Belleza y Salud': { price: [15, 200], stock: [30, 150] },
    'Alimentos y Bebidas': { price: [5, 60], stock: [40, 300] },
    'Electrodomésticos y Cocina': { price: [30, 1500], stock: [10, 80] },
    'Jardinería': { price: [15, 800], stock: [15, 100] },
    'Automotriz': { price: [20, 500], stock: [20, 100] },
    'Mascotas': { price: [10, 150], stock: [25, 150] },
    'Oficina y Papelería': { price: [5, 300], stock: [30, 200] },
    'Instrumentos Musicales': { price: [50, 2000], stock: [5, 50] },
    'Bebés y Maternidad': { price: [10, 300], stock: [20, 150] },
    'Ferretería y Construcción': { price: [15, 1200], stock: [15, 100] },
    'Artesanías Guatemaltecas': { price: [25, 500], stock: [10, 50] },
    'Fotografía': { price: [30, 3000], stock: [5, 60] },
    'Joyería': { price: [50, 5000], stock: [5, 30] },
    'Arte y Manualidades': { price: [5, 200], stock: [20, 150] }
};

// Combinar todos los templates
const allProductTemplates = {
    ...productTemplates,
    ...productTemplatesRest
};

export const seedProducts = async (categories, productsPerCategory = 10) => {
    const products = [];
    let created = 0;
    let skipped = 0;
    let tagsAdded = 0;

    // Si no se pasan categorías, obtenerlas de la BD
    if (!categories || categories.length === 0) {
        categories = await Category.findAll();
    }

    // Resetear flags al inicio
    useFaker = false;
    pexelsService.resetRateLimit();

    console.log(`   🎨 Iniciando seeding de ${productsPerCategory} productos por categoría con imágenes de Pexels...`);
    console.log(`   ⏱️  Nota: Hay un delay de 3-5 segundos entre cada consulta a Pexels API para evitar rate limit`);
    console.log(`   🔄 Si se alcanza el límite de Pexels, se cambiará automáticamente a Faker`);
    console.log(`   🏷️  Se verificarán y agregarán tags a productos sin tags\n`);

    for (const category of categories) {
        const categoryName = category.name;
        const productNames = allProductTemplates[categoryName] || [];
        const priceRange = categoryPriceRanges[categoryName] || { price: [10, 500], stock: [10, 100] };

        console.log(`\n   📦 Procesando categoría: ${categoryName}`);

        let categoryCreated = 0;
        let attempts = 0;
        const maxAttempts = productsPerCategory * 3;

        while (categoryCreated < productsPerCategory && attempts < maxAttempts) {
            attempts++;

            // Usar nombre del template o generar uno aleatorio
            let productName;
            if (attempts <= productNames.length) {
                productName = productNames[attempts - 1];
            } else {
                // Generar nombre aleatorio basado en la categoría
                const adjective = faker.commerce.productAdjective();
                const material = faker.commerce.productMaterial();
                productName = `${adjective} ${material} ${categoryName}`;
            }

            // Verificar si el producto ya existe
            const existing = await Product.findOne({
                where: {
                    name: productName,
                    category_id: category.category_id
                },
                include: [{
                    model: ProductTag,
                    as: 'tags'
                }]
            });

            if (existing) {
                products.push(existing);
                skipped++;

                // Verificar si el producto no tiene tags
                if (!existing.tags || existing.tags.length === 0) {
                    console.log(`      🏷️  Agregando tags al producto existente: ${productName}`);
                    const tags = generateProductTags(categoryName, productName);
                    for (const tag of tags) {
                        await ProductTag.create({
                            product_id: existing.product_id,
                            tag: tag
                        });
                    }
                    tagsAdded++;
                }
                continue;
            }

            // Generar precio y stock
            const price = faker.number.float({
                min: priceRange.price[0],
                max: priceRange.price[1],
                precision: 0.01
            });

            const stock = faker.number.int({
                min: priceRange.stock[0],
                max: priceRange.stock[1]
            });

            // Obtener imagen de Pexels (ya incluye delay de 3-5 segundos)
            const imagePath = await getProductImage(productName, categoryName);

            // Crear producto
            const product = await Product.create({
                category_id: category.category_id,
                name: productName,
                description: faker.commerce.productDescription(),
                price: price,
                stock: stock,
                sku: faker.string.alphanumeric(8).toUpperCase(),
                image_path: imagePath
            });

            // Generar y crear tags para el producto
            const tags = generateProductTags(categoryName, productName);
            for (const tag of tags) {
                await ProductTag.create({
                    product_id: product.product_id,
                    tag: tag
                });
            }

            products.push(product);
            created++;
            categoryCreated++;

            // Mostrar progreso cada 10 productos
            if (created % 10 === 0) {
                console.log(`      ✅ ${created} productos creados hasta ahora...`);
            }
        }

        console.log(`   ✨ Completado ${categoryName}: ${categoryCreated} productos nuevos`);
    }

    console.log(`\n   🎉 RESUMEN FINAL:`);
    console.log(`   ✨ ${created} productos nuevos creados`);
    console.log(`   ♻️  ${skipped} productos ya existían`);
    if (tagsAdded > 0) {
        console.log(`   🏷️  ${tagsAdded} productos existentes recibieron tags`);
    }
    console.log(`   📊 Total de productos: ${products.length}`);
    console.log(`   🏷️  Tags: 2-5 tags por producto (generados automáticamente)`);

    // Mostrar estadísticas de la fuente de imágenes
    if (useFaker) {
        console.log(`   📸 Imágenes: Pexels (hasta rate limit) + Faker`);
    } else {
        console.log(`   📸 Imágenes: 100% desde Pexels API`);
    } return products;
};
