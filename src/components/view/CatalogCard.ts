import { Card, CardData } from "./Card";

type CatalogCardActions = {
  onClick: () => void
};

export class CatalogCard extends Card<CardData> {
  constructor(container: HTMLElement, actions: CatalogCardActions) {
    super(container);

    this.container.addEventListener("click", actions.onClick);
  }
}
