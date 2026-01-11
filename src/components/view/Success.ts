import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Success extends Component<{ total: number }> {
    private descriptionEl: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this.descriptionEl = container.querySelector('.order-success__description')!;
        this.closeButton = container.querySelector('.order-success__close')!;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.descriptionEl.textContent = `Списано ${value} синапсов`;
    }
}
