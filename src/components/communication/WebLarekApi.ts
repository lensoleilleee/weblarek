import { IApi, IOrder, IOrderResult, IProduct, IProductsResponse } from '../../types';

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<IProductsResponse>('/product/');
    return res.items;
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', order);
  }
}

