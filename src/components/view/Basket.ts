import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Basket extends Component<{
  items: HTMLElement[];
  total: number;
  valid: boolean;
}> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.listEl = container.querySelector(".basket__list")!;
    this.totalEl = container.querySelector(".basket__price")!;
    this.submitButton = container.querySelector(".basket__button")!;

    this.submitButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(value: HTMLElement[]) {
    this.listEl.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }
}
