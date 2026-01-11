import { Card, CardData } from "./Card";
import { IEvents } from "../base/Events";

export class CatalogCard extends Card<CardData> {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this._id });
    });
  }
}
