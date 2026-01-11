import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form extends Component<{ valid: boolean; errors: string }> {
    protected submitButton: HTMLButtonElement;
    protected errorsEl: HTMLElement;
    protected inputs: HTMLInputElement[];

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitButton = container.querySelector('button[type="submit"]')!;
        this.errorsEl = container.querySelector('.form__errors')!;
        this.inputs = Array.from(container.querySelectorAll('.form__input'));

        this.inputs.forEach((input) => {
            input.addEventListener('input', () => {
                this.onInput(input.name, input.value);
            });
        });

        container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.onSubmit();
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsEl.textContent = value;
    }

    // абстрактные методы
    protected abstract onInput(field: string, value: string): void;
    protected abstract onSubmit(): void;
}