export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = string;

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// ответ сервера с товарами
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// данные для отправки заказа
export type IOrder = IBuyer & {
  items: string[]; // массив id товаров
  total: number;   // итоговая сумма
};

// ответ сервера на создание заказа
export interface IOrderResult {
  id: string;
  total: number;
}
