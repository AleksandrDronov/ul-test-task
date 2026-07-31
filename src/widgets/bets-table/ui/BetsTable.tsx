import type { BetItemVm } from '@/entities/bet'
import { formatDateTime, formatPrice } from '@/shared/lib'
import { Badge } from '@/shared/ui'

export type BetsTableProps = {
  bets: BetItemVm[]
}

export const BetsTable = ({ bets }: BetsTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full min-w-160 text-sm">
      <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th scope="col" className="px-3 py-2 font-medium">
            Место
          </th>
          <th scope="col" className="px-3 py-2 font-medium">
            Организация
          </th>
          <th scope="col" className="px-3 py-2 font-medium">
            Дата
          </th>
          <th scope="col" className="px-3 py-2 text-right font-medium">
            Цена с НДС
          </th>
          <th scope="col" className="px-3 py-2 font-medium">
            Статус
          </th>
        </tr>
      </thead>
      <tbody>
        {bets.map((bet, index) => (
          <tr key={bet.id ?? index} className="border-t border-border">
            <td className="px-3 py-2 text-foreground">{bet.place ?? '—'}</td>
            <td className="px-3 py-2">
              <p className="font-medium text-foreground">{bet.organizationName ?? '—'}</p>
              {bet.organizationInn && (
                <p className="text-xs text-muted-foreground">ИНН {bet.organizationInn}</p>
              )}
            </td>
            <td className="px-3 py-2 text-muted-foreground">{formatDateTime(bet.createdAt)}</td>
            <td className="px-3 py-2 text-right font-medium text-foreground">
              {formatPrice(bet.priceWithVat)}
            </td>
            <td className="px-3 py-2">
              <div className="flex flex-wrap gap-1">
                {bet.isWin && <Badge>Победитель</Badge>}
                {bet.isRejected && <Badge variant="destructive">Отклонена</Badge>}
                {bet.isCounter && <Badge variant="outline">Встречная</Badge>}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
