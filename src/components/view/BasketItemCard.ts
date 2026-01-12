import { Card, CardData } from "./Card";

export type BasketItemCardData = CardData & {
  index: number;
};

type BasketItemCardActions = {
  onRemove: () => void;
};

export class BasketItemCard extends Card<BasketItemCardData> {
  private indexEl: HTMLElement | null;
  private deleteButton: HTMLButtonElement | null;

  constructor(container: HTMLElement, actions: BasketItemCardActions) {
    super(container);

    this.indexEl = container.querySelector(".basket__item-index");
    this.deleteButton = container.querySelector(".basket__item-delete");

    this.deleteButton?.addEventListener("click", (e) => {
      e.stopPropagation();
      actions.onRemove();
    });
  }

  set index(value: number) {
    if (this.indexEl) this.indexEl.textContent = String(value);
  }
}
