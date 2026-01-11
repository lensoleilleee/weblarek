import { Card, CardData } from "./Card";
import { IEvents } from "../base/Events";

export type BasketItemCardData = CardData & {
  index: number;
};

export class BasketItemCard extends Card<BasketItemCardData> {
  private indexEl: HTMLElement | null;
  private deleteButton: HTMLButtonElement | null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.indexEl = container.querySelector(".basket__item-index");
    this.deleteButton = container.querySelector(".basket__item-delete");

    this.deleteButton?.addEventListener("click", () => {
      this.events.emit("basket:remove", { id: this._id });
    });
  }

  set index(value: number) {
    if (this.indexEl) this.indexEl.textContent = String(value);
  }
}
