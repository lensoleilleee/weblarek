import { Form } from "./Form";
import { IEvents } from "../base/Events";

export class ContactsForm extends Form {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  //абстрактный метод input из Form
  protected onInput(field: string, value: string): void {
    if (field === "email" || field === "phone") {
      this.events.emit("contacts:change", { field, value });
    }
  }

  //абстрактный метод submit из Form
  protected onSubmit(): void {
    this.events.emit("contacts:submit");
  }
}
