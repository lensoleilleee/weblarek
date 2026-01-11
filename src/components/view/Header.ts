import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Header extends Component<{ counter: number }> {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.basketButton = container.querySelector(".header__basket")!;
    this.counterElement = container.querySelector(".header__basket-counter")!;

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  // счетчик
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
