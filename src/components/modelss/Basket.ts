import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  private emitChanged(): void {
    this.events.emit('basket:changed', {
      items: this.items,
      total: this.getTotal(),
      count: this.getCount(),
    });
  }

  add(item: IProduct): void {
    this.items.push(item);
    this.emitChanged();
  }

  remove(item: IProduct): void {
    this.items = this.items.filter(i => i.id !== item.id);
    this.emitChanged();
  }

  clear(): void {
    this.items = [];
    this.emitChanged();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.price ?? 0);
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}

