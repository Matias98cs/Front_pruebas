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
import { Upload, X, FileText } from "lucide-react";
import type { FormIncidencias } from "./data";
import { postIncidencia } from "./actions";
import ComponenteInspeccion from "../Inspeccion/Inspeccion";

export default function FormularioIncidencias() {
  const [formData, setFormData] = useState<FormIncidencias>({
    fecha_inicio: "",
    fecha_vencimiento: "",
    tipo: 0,
    apertura: 0,
    medio: "",
    consorcio: 0,
    unidad: 0,
    reportado_por_tipo: 0,
    descripcion: "",
    archivos: [],
    inspeccion_archivos: [],
    inspeccion: {
      fecha_inspeccion: "",
      responsable_text: "",
      inspeccion_archivos: [],
    },
  });

  const handleInputChange = (
    field: keyof FormIncidencias,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      archivos: [...prev.archivos, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index),
    }));
  };

  const handleInspeccionChange = (inspeccion: any) => {
    setFormData((prev) => ({
      ...prev,
      inspeccion,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formulario:", formData);
    postIncidencia(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-10">
      <CardHeader>
        <CardTitle>Formulario de Reporte</CardTitle>
        <CardDescription>Complete todos los campos requeridos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
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
                value={formData.fecha_vencimiento}
                onChange={(e) =>
                  handleInputChange("fecha_vencimiento", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Input
                id="tipo"
                type="number"
                value={formData.tipo}
                onChange={(e) =>
                  handleInputChange(
                    "tipo",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apertura">Apertura</Label>
              <Input
                id="apertura"
                type="number"
                value={formData.apertura}
                onChange={(e) =>
                  handleInputChange(
                    "apertura",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medio">Medio</Label>
            <Input
              id="medio"
              type="text"
              value={formData.medio}
              onChange={(e) => handleInputChange("medio", e.target.value)}
              placeholder="Ingrese el medio"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consorcio">Consorcio</Label>
              <Input
                id="consorcio"
                type="number"
                value={formData.consorcio}
                onChange={(e) =>
                  handleInputChange(
                    "consorcio",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidad">Unidad</Label>
              <Input
                id="unidad"
                type="number"
                value={formData.unidad}
                onChange={(e) =>
                  handleInputChange(
                    "unidad",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportado_por_tipo">Reportado Por Tipo</Label>
              <Input
                id="reportado_por_tipo"
                type="number"
                value={formData.reportado_por_tipo}
                onChange={(e) =>
                  handleInputChange(
                    "reportado_por_tipo",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              placeholder="Ingrese la descripción"
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Archivos */}
          <div className="space-y-4">
            <Label>Archivos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Seleccionar Archivos
                </Button>
              </div>
            </div>

            {formData.archivos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Archivos seleccionados:</p>
                <div className="space-y-2">
                  {formData.archivos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Componente de Inspección */}
          <ComponenteInspeccion
            inspeccion={formData.inspeccion}
            onInspeccionChange={handleInspeccionChange}
            modoEdicion={false}
          />
          <Button type="submit" className="w-full">
            Enviar Formulario
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
