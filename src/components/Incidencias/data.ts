export interface FormIncidencias {
  fecha_inicio: string
  fecha_vencimiento: string
  tipo: number
  apertura: number
  medio: string
  consorcio: number
  unidad: number
  reportado_por_tipo: number
  descripcion: string
  archivos: File[]
  inspeccion?: Inspeccion
  inspeccion_archivos?: File[],
}

export interface Inspeccion {
  fecha_inspeccion: string
  responsable_text: string,
  inspeccion_archivos: Array<{ file: File }>;
}


export interface IncidenciaResponse {
  id: number;
  nro: string;
  fecha_inicio: Date;
  fecha_vencimiento: Date;
  tipo: number;
  apertura: number;
  medio: string;
  consorcio: number;
  unidad: number;
  reportado_por_tipo: number;
  reportado_por: null;
  estado: number;
  descripcion: string;
  observaciones: string;
}


export interface Archivo {
  id: number
  archivo: string
  archivo_url: string | null
}

export interface TipoEstado {
  id: number
  nombre: string
}

export interface Consorcio {
  id: number
  name: string
}

export interface Unidad {
  id: number
  name: string
}

export interface IncidenciaData {
  id: number
  nro: string
  fecha_inicio: string
  fecha_vencimiento: string
  tipo: TipoEstado
  estado: TipoEstado
  reportado_por_tipo: TipoEstado
  reportado_por: string
  descripcion: string
  observaciones: string
  apertura: TipoEstado
  medio: string
  consorcio: Consorcio
  unidad: Unidad
  //   proveedores: any[]
  archivos: Archivo[]
  //   inspeccion: any[]
  //   presupuestos: any[]
}