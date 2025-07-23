import type React from "react";
import { DollarSign } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, FileText, Calendar } from "lucide-react";
import { postPresupuestoIncidencia } from "./action";

interface PresupuestoData {
  fecha_emision: string;
  fecha_vencimiento: string;
  responsable: string;
  valor: number;
  se_debe_evaluar_valor: boolean;
  archivos: File[];
}

export default function FormularioPresupuesto() {
  const [incidenciaId, setIncidenciaId] = useState<number>(0);

  const [formData, setFormData] = useState<PresupuestoData>({
    fecha_emision: new Date().toISOString().split("T")[0],
    fecha_vencimiento: "",
    responsable: "",
    valor: 0,
    se_debe_evaluar_valor: false,
    archivos: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof PresupuestoData,
    value: string | number | boolean
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Datos del presupuesto:", formData);

      await postPresupuestoIncidencia(incidenciaId, formData);

      setFormData({
        fecha_emision: new Date().toISOString().split("T")[0],
        fecha_vencimiento: "",
        responsable: "",
        valor: 0,
        se_debe_evaluar_valor: false,
        archivos: [],
      });
    } catch (error) {
      console.error("Error al enviar presupuesto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Cargar Presupuesto
        </CardTitle>
        <CardDescription>
          Complete los datos del presupuesto para la incidencia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="incidencia_id" className="text-sm font-medium">
              ID de Incidencia *
            </Label>
            <Input
              id="incidencia_id"
              type="number"
              value={incidenciaId}
              onChange={(e) =>
                setIncidenciaId(Number.parseInt(e.target.value) || 0)
              }
              placeholder="Ingrese el ID de la incidencia"
              min="1"
              required
              className="text-lg font-semibold"
            />
            <p className="text-xs text-gray-500">
              ID de la incidencia a la cual se asignará este presupuesto
            </p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="fecha_emision"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Fecha de Emisión *
              </Label>
              <Input
                id="fecha_emision"
                type="date"
                value={formData.fecha_emision}
                onChange={(e) =>
                  handleInputChange("fecha_emision", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="fecha_vencimiento"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Fecha de Vencimiento *
              </Label>
              <Input
                id="fecha_vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) =>
                  handleInputChange("fecha_vencimiento", e.target.value)
                }
                min={formData.fecha_emision}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable *</Label>
            <Input
              id="responsable"
              type="text"
              value={formData.responsable}
              onChange={(e) => handleInputChange("responsable", e.target.value)}
              placeholder="Nombre del responsable del presupuesto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor del Presupuesto *
            </Label>
            <div className="relative">
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) =>
                  handleInputChange(
                    "valor",
                    Number.parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
                className="pl-8"
                required
              />
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {formData.valor > 0 && (
              <p className="text-sm text-gray-600">
                Valor formateado:{" "}
                <span className="font-semibold">
                  {formatCurrency(formData.valor)}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="se_debe_evaluar_valor"
              checked={formData.se_debe_evaluar_valor}
              onCheckedChange={(checked) =>
                handleInputChange("se_debe_evaluar_valor", checked as boolean)
              }
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="se_debe_evaluar_valor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se debe evaluar el valor
              </Label>
              <p className="text-xs text-muted-foreground">
                Marque esta opción si el valor del presupuesto requiere
                evaluación adicional
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">
              Archivos del Presupuesto
            </Label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                  PDF, imágenes, documentos (máx. 10MB por archivo)
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
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
                <p className="text-sm font-medium text-gray-700">
                  Archivos seleccionados ({formData.archivos.length}):
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.archivos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-blue-600">
                            {(file.size / 1024).toFixed(1)} KB •{" "}
                            {file.type || "Archivo"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  fecha_emision: new Date().toISOString().split("T")[0],
                  fecha_vencimiento: "",
                  responsable: "",
                  valor: 0,
                  se_debe_evaluar_valor: false,
                  archivos: [],
                });
              }}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || incidenciaId === 0}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Enviando..." : "Cargar Presupuesto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
