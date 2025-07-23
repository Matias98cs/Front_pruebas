import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  FileText,
  Plus,
  Calendar,
  User,
  Trash2,
} from "lucide-react";

interface Archivo {
  id?: number;
  archivo?: string;
  archivo_url?: string | null;
  file?: File;
}

interface InspeccionUnica {
  fecha_inspeccion: string;
  responsable_text: string;
  inspeccion_archivos: Archivo[];
}

interface InspeccionMultiple extends InspeccionUnica {
  id?: number;
}

interface ComponenteInspeccionProps {
  inspeccion?: InspeccionUnica;
  onInspeccionChange?: (inspeccion: InspeccionUnica) => void;

  inspecciones?: InspeccionMultiple[];
  onInspeccionesChange?: (inspecciones: InspeccionMultiple[]) => void;

  modoEdicion?: boolean;
}

export default function ComponenteInspeccion({
  inspeccion,
  onInspeccionChange,
  inspecciones,
  onInspeccionesChange,
  modoEdicion = false,
}: ComponenteInspeccionProps) {
  if (!modoEdicion && !inspeccion && onInspeccionChange) {
    const nuevaInspeccion: InspeccionUnica = {
      fecha_inspeccion: "",
      responsable_text: "",
      inspeccion_archivos: [],
    };
    onInspeccionChange(nuevaInspeccion);
    return null;
  }

  if (!modoEdicion && inspeccion && onInspeccionChange) {
    const handleInspeccionChange = (
      field: keyof InspeccionUnica,
      value: string
    ) => {
      onInspeccionChange({
        ...inspeccion,
        [field]: value,
      });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const nuevosArchivos = files.map((file) => ({ file }));

      onInspeccionChange({
        ...inspeccion,
        inspeccion_archivos: [
          ...inspeccion.inspeccion_archivos,
          ...nuevosArchivos,
        ],
      });
    };

    const removeFile = (archivoIndex: number) => {
      onInspeccionChange({
        ...inspeccion,
        inspeccion_archivos: inspeccion.inspeccion_archivos.filter(
          (_, i) => i !== archivoIndex
        ),
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inspección</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="fecha_inspeccion"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Fecha de Inspección *
              </Label>
              <Input
                id="fecha_inspeccion"
                type="date"
                value={inspeccion.fecha_inspeccion}
                onChange={(e) =>
                  handleInspeccionChange("fecha_inspeccion", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="responsable_text"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Responsable *
              </Label>
              <Input
                id="responsable_text"
                type="text"
                value={inspeccion.responsable_text}
                onChange={(e) =>
                  handleInspeccionChange("responsable_text", e.target.value)
                }
                placeholder="Nombre del responsable"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Archivos de la Inspección
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Adjuntar documentos o fotos de la inspección
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload-inspeccion"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("file-upload-inspeccion")?.click()
                  }
                >
                  Seleccionar Archivos
                </Button>
              </div>
            </div>

            {inspeccion.inspeccion_archivos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">
                  Archivos ({inspeccion.inspeccion_archivos.length}):
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {inspeccion.inspeccion_archivos.map(
                    (archivo, archivoIndex) => (
                      <div
                        key={archivoIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-700">
                              {archivo.file?.name ||
                                archivo.archivo?.split("/").pop() ||
                                "archivo"}
                            </span>
                            {archivo.file && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({(archivo.file.size / 1024).toFixed(1)} KB)
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(archivoIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (modoEdicion && inspecciones && onInspeccionesChange) {
    const handleInspeccionChange = (
      index: number,
      field: keyof InspeccionMultiple,
      value: string
    ) => {
      const nuevasInspecciones = [...inspecciones];
      nuevasInspecciones[index] = {
        ...nuevasInspecciones[index],
        [field]: value,
      };
      onInspeccionesChange(nuevasInspecciones);
    };

    const handleFileChange = (
      inspeccionIndex: number,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = Array.from(e.target.files || []);
      const nuevasInspecciones = [...inspecciones];
      const nuevosArchivos = files.map((file) => ({ file }));

      nuevasInspecciones[inspeccionIndex] = {
        ...nuevasInspecciones[inspeccionIndex],
        inspeccion_archivos: [
          ...nuevasInspecciones[inspeccionIndex].inspeccion_archivos,
          ...nuevosArchivos,
        ],
      };

      onInspeccionesChange(nuevasInspecciones);
    };

    const removeFile = (inspeccionIndex: number, archivoIndex: number) => {
      const nuevasInspecciones = [...inspecciones];
      nuevasInspecciones[inspeccionIndex] = {
        ...nuevasInspecciones[inspeccionIndex],
        inspeccion_archivos: nuevasInspecciones[
          inspeccionIndex
        ].inspeccion_archivos.filter((_, i) => i !== archivoIndex),
      };
      onInspeccionesChange(nuevasInspecciones);
    };

    const addInspeccion = () => {
      onInspeccionesChange([
        ...inspecciones,
        {
          fecha_inspeccion: "",
          responsable_text: "",
          inspeccion_archivos: [],
        },
      ]);
    };

    const removeInspeccion = (index: number) => {
      const nuevasInspecciones = inspecciones.filter((_, i) => i !== index);
      onInspeccionesChange(nuevasInspecciones);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Inspecciones</h3>
          <Button
            type="button"
            onClick={addInspeccion}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-transparent"
          >
            <Plus className="h-4 w-4" />
            Agregar Inspección
          </Button>
        </div>

        {inspecciones.map((inspeccionItem, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Inspección #{index + 1}
              </CardTitle>
              {inspecciones.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInspeccion(index)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`fecha_inspeccion_${index}`}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Fecha de Inspección *
                  </Label>
                  <Input
                    id={`fecha_inspeccion_${index}`}
                    type="date"
                    value={inspeccionItem.fecha_inspeccion}
                    onChange={(e) =>
                      handleInspeccionChange(
                        index,
                        "fecha_inspeccion",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`responsable_text_${index}`}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Responsable *
                  </Label>
                  <Input
                    id={`responsable_text_${index}`}
                    type="text"
                    value={inspeccionItem.responsable_text}
                    onChange={(e) =>
                      handleInspeccionChange(
                        index,
                        "responsable_text",
                        e.target.value
                      )
                    }
                    placeholder="Nombre del responsable"
                    required
                  />
                </div>
              </div>

              {/* Archivos para cada inspección */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Archivos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Adjuntar archivos</p>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(index, e)}
                      className="hidden"
                      id={`file-upload-inspeccion-${index}`}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document
                          .getElementById(`file-upload-inspeccion-${index}`)
                          ?.click()
                      }
                    >
                      Seleccionar Archivos
                    </Button>
                  </div>
                </div>

                {inspeccionItem.inspeccion_archivos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Archivos ({inspeccionItem.inspeccion_archivos.length}):
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {inspeccionItem.inspeccion_archivos.map(
                        (archivo, archivoIndex) => (
                          <div
                            key={archivoIndex}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <div>
                                <span className="text-sm text-gray-700">
                                  {archivo.file?.name ||
                                    archivo.archivo?.split("/").pop() ||
                                    "archivo"}
                                </span>
                                {archivo.file && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({(archivo.file.size / 1024).toFixed(1)} KB)
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, archivoIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-sm text-gray-500">
          Total: {inspecciones.length} inspecciones
        </div>
      </div>
    );
  }

  return null;
}
