import type { ComponentType } from 'react'

import type { SectionId } from '../components/sidebar/navigation'

import { DashboardPage } from '../pages/Dashboard'
import { EquipamentosPage } from '../pages/Equipamentos'
import { FuncionariosPage } from '../pages/Funcionarios'
import { SetoresPage } from '../pages/Setores'
import { CargosPage } from '../pages/Cargos'
import { TiposPage } from '../pages/Tipos'
import { PropriedadesPage } from '../pages/Propriedades'
import { StatusPage } from '../pages/Status'
import { RegistrosPage } from '../pages/Registros'

export const section: Record<SectionId, ComponentType> = {
  dashboard: DashboardPage,
  equipamentos: EquipamentosPage,
  funcionarios: FuncionariosPage,
  setores: SetoresPage,
  cargos: CargosPage,
  tipos: TiposPage,
  propriedades: PropriedadesPage,
  status: StatusPage,
  registros: RegistrosPage,
}