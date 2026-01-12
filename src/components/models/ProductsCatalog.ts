import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductsCatalog {
  private products: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private events: IEvents) {}

  setProducts(items: IProduct[]): void {
    this.products = items;
    this.events.emit('catalog:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(item => item.id === id);
  }

  setPreview(item: IProduct): void {
    this.preview = item;
    this.events.emit('preview:changed');
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}

