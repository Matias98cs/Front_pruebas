import IncidenciaFormularioEdicion from "./components/Incidencias/Incidencia"
import FormularioIncidencias from "./components/Incidencias/Incidencias"
import FormularioPresupuesto from "./components/Presupuesto/Presupuesto"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="my-10">Frontend de Pruebas</h1>

      {/* POST de incidencia */}
      {/* <FormularioIncidencias/> */}

      {/* PATCH de incidencia */}
      {/* <IncidenciaFormularioEdicion/> */}

      {/* POST presupuesto */}
      <FormularioPresupuesto/>
    </div>
  )
}

export default App