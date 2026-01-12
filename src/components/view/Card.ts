import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";

export type CardData = {
  title: string;
  price: number | null;
  category?: string;
  image?: string;
};

export class Card<T extends CardData = CardData> extends Component<T> {
  protected titleEl: HTMLElement | null;
  protected priceEl: HTMLElement | null;
  protected categoryEl: HTMLElement | null;
  protected imageEl: HTMLImageElement | null;

  constructor(container: HTMLElement) {
    super(container);
    
    this.titleEl = container.querySelector(".card__title");
    this.priceEl = container.querySelector(".card__price");
    this.categoryEl = container.querySelector(".card__category");
    this.imageEl = container.querySelector(".card__image");
  }

  set title(value: string) {
    if (this.titleEl) this.titleEl.textContent = value;
  }

  set price(value: number | null) {
    if (!this.priceEl) return;
    this.priceEl.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }

  set category(value: string) {
    if (!this.categoryEl) return;

    // удаление старых модификаторов категории
    Object.values(categoryMap).forEach((cls) =>
      this.categoryEl!.classList.remove(cls)
    );

    // добавление новых модификаторов
    const cls = categoryMap[value as keyof typeof categoryMap];
    if (cls) this.categoryEl.classList.add(cls);

    this.categoryEl.textContent = value;
  }

  set image(value: string) {
    if (!this.imageEl) return;
    this.setImage(this.imageEl, value);
  }
}
