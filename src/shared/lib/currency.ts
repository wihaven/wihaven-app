import { intlLocale } from './intl';

const wholeRublesFormat = new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
});

export const formatAsRubles = (rubles: number) => wholeRublesFormat.format(rubles);
