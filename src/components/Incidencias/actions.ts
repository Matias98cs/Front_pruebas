import { https } from "@/core/api/https";
import type { FormIncidencias, IncidenciaData, IncidenciaResponse } from "./data";

export const postIncidencia = async (
    incidencia: FormIncidencias
): Promise<IncidenciaResponse> => {
    const form = new FormData();

    form.append("fecha_inicio", incidencia.fecha_inicio);
    form.append("fecha_vencimiento", incidencia.fecha_vencimiento);
    form.append("tipo", String(incidencia.tipo));
    form.append("apertura", String(incidencia.apertura));
    form.append("medio", incidencia.medio);
    form.append("consorcio", String(incidencia.consorcio));
    form.append("unidad", String(incidencia.unidad));
    form.append("reportado_por_tipo", String(incidencia.reportado_por_tipo));
    form.append("descripcion", incidencia.descripcion);

    incidencia.archivos.forEach((file) => {
        form.append("archivos", file);
    });

    try {
        const { data } = await https.post<IncidenciaResponse>(
            "/incidencias/",
            form,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return data;
    } catch (error) {
        console.error("Error al crear incidencia:", error);
        throw error;
    }
};


export const getIncidenciaId = async (id: number): Promise<IncidenciaData> => {
    try {
        const { data } = await https.get<IncidenciaData>(`/incidencias/${id}/`);
        return data;
    } catch (error) {
        console.log('Error al obtener la incidencia', error);
        throw error;

    }
}

export const patchIncidencia = async (
    id: number,
    form: FormData
): Promise<IncidenciaData> => {
    try {
        const { data } = await https.patch<IncidenciaData>(
            `/incidencias/${id}/`,
            form,
            {
                headers: { "Content-Type": "multipart/form-data" },
                transformRequest: (payload) => payload,
            }
        );
        return data;
    } catch (err) {
        console.error("Error en patchIncidencia:", err);
        throw err;
    }
};

