export interface PresupuestoIncidencia {
    fecha_emision: string;
    fecha_vencimiento: string;
    responsable: string;
    valor: number;
    se_debe_evaluar_valor: boolean;
    archivos: File[]
}
