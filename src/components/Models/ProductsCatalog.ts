import { IProduct } from '../../types';

export class ProductsCatalog {
  private products: IProduct[] = [];
  private preview: IProduct | null = null;

  setProducts(items: IProduct[]): void {
    this.products = items;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(item => item.id === id);
  }

  setPreview(item: IProduct): void {
    this.preview = item;
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}

