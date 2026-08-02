import type { AuctionDetailCarRequirementsVm, AuctionDetailCargoVm } from '@/entities/auction'
import { formatNumber, formatYesNo } from '@/shared/lib'
import { DetailFieldsFromConfig, type DetailFieldConfig } from '../detail-field-config'
import { DetailSection } from '../DetailSection'

type CargoSectionContext = {
  noViewCargoPrice: boolean
}

const CARGO_FIELDS: DetailFieldConfig<AuctionDetailCargoVm, CargoSectionContext>[] = [
  {
    label: 'Стоимость груза',
    getValue: (cargo) => cargo.price ?? '—',
    hidden: (_, context) => context?.noViewCargoPrice ?? false,
  },
  { label: 'Тип кузова', getValue: (cargo) => cargo.bodyType ?? '—' },
  {
    label: 'Расстояние',
    getValue: (cargo) => `${formatNumber(cargo.distance)} км`,
  },
  {
    label: 'Количество ТС',
    getValue: (cargo) => formatNumber(cargo.truckCount),
  },
  {
    label: 'Международная перевозка',
    getValue: (cargo) => formatYesNo(cargo.isInternational),
  },
  {
    label: 'Контейнерная перевозка',
    getValue: (cargo) => formatYesNo(cargo.containered),
  },
]

const CAR_FIELDS: DetailFieldConfig<AuctionDetailCarRequirementsVm>[] = [
  { label: 'Тип ТС', getValue: (car) => car.type ?? '—' },
  {
    label: 'Грузоподъёмность',
    getValue: (car) => `${formatNumber(car.weight)} т`,
  },
  {
    label: 'Объём кузова',
    getValue: (car) => `${formatNumber(car.volume)} м³`,
  },
  {
    label: 'Габариты (Ш×Д×В)',
    getValue: (car) =>
      `${formatNumber(car.width)}×${formatNumber(car.length)}×${formatNumber(car.height)} м`,
  },
]

type CargoSectionProps = {
  cargo: AuctionDetailCargoVm
  noViewCargoPrice: boolean
}

export const CargoSection = ({ cargo, noViewCargoPrice }: CargoSectionProps) => (
  <DetailSection title="Груз и требования к транспорту">
    <DetailFieldsFromConfig fields={CARGO_FIELDS} data={cargo} context={{ noViewCargoPrice }} />
    {cargo.car && <DetailFieldsFromConfig fields={CAR_FIELDS} data={cargo.car} />}
  </DetailSection>
)
