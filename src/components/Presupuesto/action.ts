import { https } from "@/core/api/https";
import type { PresupuestoIncidencia } from "./data";

export const postPresupuestoIncidencia = async (idIncidencia: number, form: PresupuestoIncidencia): Promise<PresupuestoIncidencia[]> => {
    const formData = new FormData();
    formData.append("fecha_emision", form.fecha_emision);
    formData.append("fecha_vencimiento", form.fecha_vencimiento);
    formData.append("responsable", form.responsable);
    formData.append("valor", String(form.valor));
    formData.append("se_debe_evaluar_valor", String(form.se_debe_evaluar_valor));

    form.archivos.forEach((file) => {
        formData.append("archivos", file);
    });

    console.log("--- FormData entries ---");
    for (const [key, val] of formData.entries()) {
        console.log(key, val instanceof File ? val.name : val);
    }


    try {
        const { data } = await https.post(`/incidencias/${idIncidencia}/presupuesto/`, formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        )
        console.log(data)
        return data
    } catch (error) {
        console.log("Error al crear el presupuesto", error)
        throw error

    }
}