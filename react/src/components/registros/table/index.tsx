import type {
  AcaoRegistro,
  JsonValue,
  Registro,
} from '../../../types/registro'

import './styles.css'

interface RegistroTableProps {
  registros: Registro[]
}

const acaoLabels: Record<AcaoRegistro, string> = {
  CRIACAO: 'Criação',
  ALTERACAO: 'Alteração',
  EXCLUSAO: 'Exclusão',
}

const modeloLabels: Record<string, string> = {
  equipamento: 'Equipamento',
  funcionario: 'Funcionário',
  setor: 'Setor',
  cargo: 'Cargo',
  tipo: 'Tipo de equipamento',
  propriedade: 'Propriedade',
  status: 'Status',
  usuario: 'Usuário',
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Data inválida'
  }

  return dateFormatter.format(date)
}

function DadosRegistro({ dados }: { dados: JsonValue }) {
  if (dados === null) {
    return (
      <span className="registro-table__muted">
        Não disponível
      </span>
    )
  }

  return (
    <details className="registro-table__details">
      <summary>Ver dados</summary>

      <pre className="registro-table__json">
        {JSON.stringify(dados, null, 2)}
      </pre>
    </details>
  )
}

export function RegistroTable({
  registros,
}: RegistroTableProps) {
  return (
    <div
      className="registro-table__scroll"
      role="region"
      aria-label="Tabela de registros de auditoria"
      tabIndex={0}
    >
      <table className="registro-table">
        <caption className="registro-table__caption">
          Registros de auditoria do Prisma
        </caption>

        <thead>
          <tr>
            <th scope="col">Data / hora</th>
            <th scope="col">Ação</th>
            <th scope="col">Tipo de objeto</th>
            <th scope="col">Objeto</th>
            <th scope="col">Autor</th>
            <th scope="col">Dados anteriores</th>
            <th scope="col">Dados novos</th>
          </tr>
        </thead>

        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td className="registro-table__date">
                <time dateTime={registro.criado_em}>
                  {formatDate(registro.criado_em)}
                </time>
              </td>

              <td>
                <span
                  className={`registro-table__badge registro-table__badge--${registro.acao.toLowerCase()}`}
                >
                  {acaoLabels[registro.acao] || registro.acao}
                </span>
              </td>

              <td>
                {modeloLabels[registro.content_type_nome] ||
                  registro.content_type_nome}
              </td>

              <td>
                <div className="registro-table__object">
                  <span>{registro.representacao_objeto}</span>

                  <span className="registro-table__muted">
                    ID do objeto: {registro.object_id}
                  </span>
                </div>
              </td>

              <td>
                {registro.autor_nome ||
                  (registro.autor !== null
                    ? `Usuário #${registro.autor}`
                    : 'Sem autor associado')}
              </td>

              <td>
                <DadosRegistro dados={registro.dados_anteriores} />
              </td>

              <td>
                <DadosRegistro dados={registro.dados_novos} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}