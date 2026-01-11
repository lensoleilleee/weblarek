import { Card, CardData } from "./Card";
import { IEvents } from "../base/Events";

export type PreviewCardData = CardData & {
  description: string;
  buttonText?: string;
};

export class PreviewCard extends Card<PreviewCardData> {
  private descriptionEl: HTMLElement | null;
  private buttonEl: HTMLButtonElement | null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.descriptionEl = container.querySelector(".card__text");
    this.buttonEl = container.querySelector(".card__button");

    this.buttonEl?.addEventListener("click", () => {
      this.events.emit("preview:toggle");
    });
  }

  set description(value: string) {
    if (this.descriptionEl) this.descriptionEl.textContent = value;
  }

  set buttonText(value: string) {
    if (this.buttonEl) this.buttonEl.textContent = value;
  }

  // отключение кнопки при price === null
  set price(value: number | null) {
    super.price = value;
    if (this.buttonEl) this.buttonEl.disabled = value === null;
  }
}
