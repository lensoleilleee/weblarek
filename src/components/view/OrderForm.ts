import { Form } from "./Form";
import { IEvents } from "../base/Events";

export class OrderForm extends Form {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.cardButton = container.querySelector('button[name="card"]')!;
    this.cashButton = container.querySelector('button[name="cash"]')!;

    this.cardButton.addEventListener("click", () => this.selectPayment("card"));
    this.cashButton.addEventListener("click", () => this.selectPayment("cash"));
  }

  public setPayment(payment: "card" | "cash" | ""): void {
    this.cardButton.classList.toggle("button_alt-active", payment === "card");
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }

  private selectPayment(payment: "card" | "cash") {
    this.setPayment(payment);
    this.events.emit("order:payment", { payment });
  }

  //абстрактный метод input из Form
  protected onInput(field: string, value: string): void {
    if (field === "address") {
      this.events.emit("order:change", { field, value });
    }
  }

  //абстрактный метод submit из Form
  protected onSubmit(): void {
    this.events.emit("order:submit");
  }
}
