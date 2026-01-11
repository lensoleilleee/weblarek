import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export type CardData = {
    id: string;
    title: string;
    price: number | null;
    category?: string;
    image?: string;
};

export class Card<T extends CardData = CardData> extends Component<T> {
    protected events: IEvents;

    // DOM-элементы
    protected titleEl: HTMLElement | null;
    protected priceEl: HTMLElement | null;
    protected categoryEl: HTMLElement | null;
    protected imageEl: HTMLImageElement | null;

    // для презентера
    protected _id: string = '';

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.titleEl = container.querySelector('.card__title');
        this.priceEl = container.querySelector('.card__price');
        this.categoryEl = container.querySelector('.card__category');
        this.imageEl = container.querySelector('.card__image');
    }

    // Сеттеры работают с твоим render(): Object.assign(this, data)
    set id(value: string) {
        this._id = value;
    }

    set title(value: string) {
        if (this.titleEl) this.titleEl.textContent = value;
    }

    set price(value: number | null) {
        if (!this.priceEl) return;
        this.priceEl.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set category(value: string) {
        if (!this.categoryEl) return;

        // удаление старых модификаторов категории
        Object.values(categoryMap).forEach((cls) => this.categoryEl!.classList.remove(cls));

        // добавление новых модификаторов
        const cls = categoryMap[value as keyof typeof categoryMap];
        if (cls) this.categoryEl.classList.add(cls);

        this.categoryEl.textContent = value;
    }

    set image(value: string) {
        if (!this.imageEl) return;
        this.setImage(this.imageEl, value);
    }
}
