export interface ItemDespesa {
  id: string;
  name: string;
  value: number;
  checked: boolean;
  mes: string;
  categoryId?: string;
  profileId?: string;
}

export interface Category {
  id: string;
  name: string;
  items: ItemDespesa[];
}

export interface Profile {
  id: string;
  name: string;
  limit: number;
  categories: Category[];
}

export interface CreateDespesaDto {
  name: string;
  value: number;
  mes: string;
  categoryId: string;
  profileId: string;
}

export interface UpdateDespesaDto {
  name?: string;
  value?: number;
  checked?: boolean;
}

export interface CreateCategoriaDto {
  name: string;
  profileId: string;
}