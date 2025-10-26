# 🏷️ Sistema de Tags para Productos

## 📋 Resumen

Se ha implementado un sistema completo de etiquetas (tags) para los productos del e-commerce, permitiendo categorizar y buscar productos de manera más flexible.

## 🎯 Características Implementadas

### Backend

#### 1. **Modelo ProductTag**
- ✅ Ya existía en `backend/src/models/productTag.js`
- Estructura:
  - `tag_id`: ID único del tag
  - `product_id`: Referencia al producto
  - `tag`: Texto del tag (máximo 50 caracteres)
- Relación: `belongsTo Product`

#### 2. **ProductService Actualizado**
- ✅ `getAll()`: Incluye tags en listado de productos
- ✅ `getById()`: Incluye tags en detalle de producto
- ✅ `create()`: Permite agregar tags al crear producto
- ✅ `update()`: Permite actualizar tags (elimina existentes y crea nuevos)
- ✅ Validación: Limita tags a 50 caracteres máximo

#### 3. **API Endpoints**
Los endpoints existentes ahora soportan tags:

**GET /api/products**
```json
{
  "items": [
    {
      "product_id": 1,
      "name": "Producto ejemplo",
      "tags": [
        { "tag_id": 1, "tag": "nuevo" },
        { "tag_id": 2, "tag": "oferta" }
      ]
    }
  ]
}
```

**GET /api/products/:id**
```json
{
  "product_id": 1,
  "name": "Producto ejemplo",
  "tags": [
    { "tag_id": 1, "tag": "nuevo" },
    { "tag_id": 2, "tag": "oferta" }
  ]
}
```

**POST /api/products**
```json
{
  "name": "Producto nuevo",
  "description": "Descripción",
  "price": 100.00,
  "stock": 50,
  "category_id": 1,
  "tags": ["nuevo", "oferta", "destacado"]
}
```

**PUT /api/products/:id**
```json
{
  "name": "Producto actualizado",
  "tags": ["actualizado", "oferta"]
}
```

### Frontend Admin

#### 1. **Componente TagInput**
Ubicación: `frontend-admin/src/components/ui/TagInput.jsx`

**Características:**
- ✅ Input interactivo para agregar tags
- ✅ Presionar `Enter` para agregar tag
- ✅ Presionar `Backspace` en input vacío para eliminar último tag
- ✅ Validación: máximo 50 caracteres por tag
- ✅ Prevención de duplicados
- ✅ Contador de caracteres en tiempo real
- ✅ Botón de eliminar en cada tag
- ✅ Soporte para dark mode
- ✅ Estado disabled

**Uso:**
```jsx
import { TagInput } from '../../../components/ui/TagInput.jsx';

<TagInput
  tags={tags}
  onChange={setTags}
  placeholder="Escribe un tag..."
  maxLength={50}
  disabled={false}
/>
```

#### 2. **ProductFormModal Actualizado**
- ✅ Campo de tags agregado al formulario
- ✅ Integrado con TagInput component
- ✅ Se envía array de strings al backend
- ✅ Carga tags existentes al editar producto

#### 3. **ProductDetailModal Actualizado**
- ✅ Muestra tags del producto
- ✅ Badges con icono de tag
- ✅ Diseño responsivo
- ✅ Solo muestra sección si hay tags

## 🎨 Interfaz de Usuario

### Agregar Tags
1. En el formulario de producto, encontrarás el campo "Etiquetas (Tags)"
2. Escribe el tag deseado (máximo 50 caracteres)
3. Presiona `Enter` para agregarlo
4. Se mostrará como badge con botón para eliminar
5. Repite para agregar más tags

### Eliminar Tags
- **Opción 1**: Click en el botón `×` del tag
- **Opción 2**: Con el input vacío, presiona `Backspace`

### Visualización
Los tags se muestran en:
- Modal de detalle de producto
- Listado de productos (próximamente)

## 📝 Validaciones

### Backend
- ✅ Tag no puede estar vacío
- ✅ Tag limitado a 50 caracteres
- ✅ Se trunca automáticamente si excede límite
- ✅ Tags se guardan como array de strings

### Frontend
- ✅ No permite tags vacíos
- ✅ Previene exceder 50 caracteres
- ✅ No permite duplicados
- ✅ Muestra errores en tiempo real
- ✅ Contador de caracteres visible

## 🔄 Flujo de Datos

### Crear Producto con Tags
```
Usuario escribe tags → TagInput → formData.tags → ProductService.create() → 
ProductTag.bulkCreate() → Producto guardado con tags
```

### Actualizar Tags
```
Usuario modifica tags → TagInput → formData.tags → ProductService.update() → 
ProductTag.destroy() → ProductTag.bulkCreate() → Tags actualizados
```

### Cargar Producto
```
Product.findByPk() → include: ProductTag → product.tags → 
ProductFormModal recibe tags → TagInput muestra tags
```

## 🧪 Ejemplos de Uso

### Crear producto con tags
```javascript
const newProduct = {
  name: "Laptop Gaming",
  description: "Laptop de alto rendimiento",
  price: 1200.00,
  stock: 15,
  category_id: 1,
  tags: ["gaming", "oferta", "nuevo", "alta-gama"]
};

await productsApi.create(newProduct);
```

### Actualizar solo tags
```javascript
const updates = {
  tags: ["oferta-especial", "liquidación", "último-modelo"]
};

await productsApi.update(productId, updates);
```

### Eliminar todos los tags
```javascript
const updates = {
  tags: []
};

await productsApi.update(productId, updates);
```

## 🚀 Próximas Mejoras

### Sugeridas
- [ ] Búsqueda de productos por tags
- [ ] Tags populares (autocomplete)
- [ ] Límite de cantidad de tags por producto
- [ ] Filtro de productos por tags en el listado
- [ ] Tags predefinidos del sistema
- [ ] Colores personalizados para tags
- [ ] Estadísticas de tags más usados

## 📚 Referencias

### Archivos Modificados
- `backend/src/services/ProductService.js`
- `frontend-admin/src/components/ui/TagInput.jsx` (nuevo)
- `frontend-admin/src/modules/products/components/ProductFormModal.jsx`
- `frontend-admin/src/modules/products/components/ProductDetailModal.jsx`
- `frontend-admin/src/components/ui/index.js`

### Modelos Relacionados
- `backend/src/models/product.js`
- `backend/src/models/productTag.js`

### Base de Datos
Tabla `product_tag`:
```sql
CREATE TABLE product_tag (
  tag_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  tag VARCHAR(50) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

---

✅ **Sistema de tags completamente funcional y listo para usar**
