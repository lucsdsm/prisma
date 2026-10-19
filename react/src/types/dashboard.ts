export interface DashboardGroup {
  id: string | number | null
  nome: string
  quantidade: number
}

export interface DashboardData {
  total_equipamentos: number
  gerado_em: string

  por_tipo: DashboardGroup[]
  por_propriedade: DashboardGroup[]
  por_status: DashboardGroup[]
  por_setor: DashboardGroup[]
  por_marca: DashboardGroup[]
  por_responsabilidade: DashboardGroup[]
}