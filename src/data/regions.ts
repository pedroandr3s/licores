export interface Region {
  name: string;
  comunas: string[];
}

export const regions: Region[] = [
  { name: 'Ñuble', comunas: ['San Carlos', 'Chillán', 'Chillán Viejo', 'Bulnes', 'Yungay', 'Quillón', 'Coihueco', 'Pinto', 'El Carmen', 'San Nicolás', 'Ñiquén', 'San Fabián'] },
  { name: 'Biobío', comunas: ['Concepción', 'Talcahuano', 'Hualpén', 'San Pedro de la Paz', 'Chiguayante', 'Coronel', 'Los Ángeles', 'Lota'] },
  { name: 'Maule', comunas: ['Talca', 'Curicó', 'Linares', 'Cauquenes', 'Constitución', 'Parral', 'San Javier'] },
  { name: "O'Higgins", comunas: ['Rancagua', 'Machalí', 'San Fernando', 'Rengo', 'Santa Cruz', 'Graneros'] },
  { name: 'Metropolitana de Santiago', comunas: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 'San Bernardo', 'Peñalolén', 'Vitacura'] },
  { name: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón', 'Quillota', 'San Antonio'] },
  { name: 'La Araucanía', comunas: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Victoria'] },
];
