import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, FileText, Download, Eye } from "lucide-react";
import type { IncidenciaData } from "./data";
import { getIncidenciaId, patchIncidencia } from "./actions";

export default function IncidenciaFormularioEdicion() {
  const [formData, setFormData] = useState<IncidenciaData>();
  const [nuevosArchivos, setNuevosArchivos] = useState<File[]>([]);
  const [archivosAEliminar, setArchivosAEliminar] = useState<number[]>([]);
  const [nroIncidencia, setNroIncidencia] = useState<number>();

  const handleInputChange = (field: keyof IncidenciaData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNuevosArchivos((prev) => [...prev, ...files]);
  };

  const removeNewFile = (index: number) => {
    setNuevosArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const markFileForDeletion = (archivoId: number) => {
    setArchivosAEliminar((prev) => [...prev, archivoId]);
  };

  const unmarkFileForDeletion = (archivoId: number) => {
    setArchivosAEliminar((prev) => prev.filter((id) => id !== archivoId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const fd = new FormData();

    fd.append("fecha_inicio", formData.fecha_inicio);
    fd.append("fecha_vencimiento", formData.fecha_vencimiento);

    fd.append("tipo", String(formData.tipo.id));
    fd.append("apertura", String(formData.apertura.id));
    fd.append("medio", formData.medio);
    fd.append("consorcio", String(formData.consorcio.id));
    fd.append("unidad", String(formData.unidad.id));
    fd.append("reportado_por_tipo", String(formData.reportado_por_tipo.id));

    fd.append("estado", String(formData.estado.id));
    fd.append("descripcion", formData.descripcion);
    fd.append("observaciones", formData.observaciones || "");

    const keepIds = formData.archivos
      .filter((a) => !archivosAEliminar.includes(a.id))
      .map((a) => a.id);

    keepIds.forEach((id) => fd.append("keep_archivos", String(id)));
    nuevosArchivos.forEach((file) => fd.append("archivos", file));

    console.log("=== FormData entries ===");
    for (const [k, v] of fd.entries()) {
      console.log(k, v instanceof File ? v.name : v);
    }

    try {
      const updated = await patchIncidencia(formData.id, fd);

      console.log("Incidencia actualizada:", updated);
    } catch (err) {
      console.error("Error al guardar incidencia:", err);
    }
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "archivo";
  };

  const getInfoIncidencia = async () => {
    if (!nroIncidencia) return alert("Ingresa un nro de incidencia");
    const incidencia = await getIncidenciaId(nroIncidencia);
    setFormData(incidencia);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Reporte #{formData?.nro}</CardTitle>
        <CardDescription>
          ID: {formData?.id} - Modifica los campos necesarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 py-10 justify-center items-center">
          <p>Buscar incidencia:</p>
          <Input
            id="nroIncidencia"
            value={nroIncidencia}
            className="w-50"
            placeholder="Buscar incidencia"
            onChange={(e) => setNroIncidencia(Number(e.target.value))}
          />

          <Button type="button" onClick={() => getInfoIncidencia()}>
            Buscar
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nro">Número</Label>
              <Input
                id="nro"
                value={formData?.nro}
                onChange={(e) => handleInputChange("nro", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData?.fecha_inicio}
                onChange={(e) =>
                  handleInputChange("fecha_inicio", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
              <Input
                id="fecha_vencimiento"
                type="date"
                value={formData?.fecha_vencimiento}
                onChange={(e) =>
                  handleInputChange("fecha_vencimiento", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="p-2 bg-gray-50 rounded-md text-sm">
                {formData?.tipo.nombre} (ID: {formData?.tipo.id})
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <div className="p-2 bg-gray-50 rounded-md text-sm">
                {formData?.estado.nombre} (ID: {formData?.estado.id})
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reportado Por Tipo</Label>
              <div className="p-2 bg-gray-50 rounded-md text-sm">
                {formData?.reportado_por_tipo.nombre} (ID:{" "}
                {formData?.reportado_por_tipo.id})
              </div>
            </div>
            <div className="space-y-2">
              <Label>Apertura</Label>
              <div className="p-2 bg-gray-50 rounded-md text-sm">
                {formData?.apertura.nombre} (ID: {formData?.apertura.id})
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medio">Medio</Label>
            <Input
              id="medio"
              value={formData?.medio}
              onChange={(e) => handleInputChange("medio", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Consorcio</Label>
              <div className="p-2 bg-gray-50 rounded-md text-sm">
                {formData?.consorcio.name}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Unidad</Label>
              <div className="p-2 bg-gray-50 rounded-md text-sm">
                {formData?.unidad.name}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData?.descripcion}
                onChange={(e) =>
                  handleInputChange("descripcion", e.target.value)
                }
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData?.observaciones}
                onChange={(e) =>
                  handleInputChange("observaciones", e.target.value)
                }
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Gestión de Archivos</Label>

            {formData && formData?.archivos?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Archivos actuales:
                </p>
                <div className="space-y-2">
                  {formData?.archivos.map((archivo) => (
                    <div
                      key={archivo.id}
                      className={`flex items-center justify-between p-3 rounded-md border ${
                        archivosAEliminar.includes(archivo.id)
                          ? "bg-red-50 border-red-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {getFileName(archivo.archivo)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {archivo.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(archivo.archivo, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = archivo.archivo;
                            link.download = getFileName(archivo.archivo);
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                        {archivosAEliminar.includes(archivo.id) ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => unmarkFileForDeletion(archivo.id)}
                          >
                            Restaurar
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => markFileForDeletion(archivo.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Agregar nuevos archivos</p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="new-file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("new-file-upload")?.click()
                  }
                >
                  Seleccionar Archivos
                </Button>
              </div>
            </div>

            {nuevosArchivos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-700">
                  Nuevos archivos a subir:
                </p>
                <div className="space-y-2">
                  {nuevosArchivos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          {file.name}
                        </span>
                        <span className="text-xs text-green-600">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNewFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
