import user from '~/assets/user.svg';

export const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:7000';

export const PERMISSIONS_NAMES = {
  W: 'Alteração',
  C: 'Conciliar',
  S: 'Extrato Bancário'
};

export const getAvatar = ({ avatar, avatarBase64 }) => {
  return (avatar) ? `${BASE_URL}/users/load-avatar?filename=${avatar}` : (avatarBase64 || null);
};

export const getAvatarDefault = function() {
  return user;
};

export const ChartOfAccountTypesMapping = {
  'Assets': 'Ativo',
  'Compensation': 'Compensação',
  'Cost': 'Custos',
  'Expenses': 'Despesas',
  'Liabilities': 'Passivo',
  'Revenues': 'Receitas',
};

export const BusinessPartnerTypesMapping = {
  'Customer': 'Cliente',
  'Supplier': 'Fornecedor',
  'Lead': 'Cliente em Potencial',
};

export const SalesStatusMapping = {
  'pending': 'Pendente',
  'paid': 'Paga',
  'canceled': 'Cancelada',
  'review': 'Revisada',
  'scheduled': 'Agendada',
};

export const brStatesValues = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

export const MASK_DATE = {
  date: true,
  delimiter: '/',
  datePattern: ['d', 'm', 'Y']
};

export const MASK_CNPJ = {
  numericOnly: true,
  delimiters: ['.', '.', '/', '-'],
  blocks: [2, 3, 3, 4, 2],
};

export const MASK_CPF = {
  numericOnly: true,
  delimiters: ['.', '.', '-'],
  blocks: [3, 3, 3, 2],
};

export const MASK_PHONE = {
  phone: true,
  phoneRegionCode: 'BR'
};

