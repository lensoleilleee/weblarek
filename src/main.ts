import "./scss/styles.scss";

import { ProductsCatalog } from "./components/models/ProductsCatalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";

import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { WebLarekApi } from "./components/communication/WebLarekApi";

import { EventEmitter } from "./components/base/Events";

import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";

import { CatalogCard } from "./components/view/CatalogCard";
import { PreviewCard } from "./components/view/PreviewCard";

import { Basket as BasketView } from "./components/view/Basket";
import { BasketItemCard } from "./components/view/BasketItemCard";

import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

import { IOrder } from "./types";

//инициализация брокера событий
const events = new EventEmitter();

//модели данных
const productsModel = new ProductsCatalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

//api
const baseApi = new Api(API_URL);
const webApi = new WebLarekApi(baseApi);

//компоненты страницы
const header = new Header(
  document.querySelector(".header") as HTMLElement,
  events
);
const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);
const modal = new Modal(
  document.querySelector("#modal-container") as HTMLElement,
  events
);

//template
const catalogTemplate = document.querySelector(
  "#card-catalog"
) as HTMLTemplateElement;
const previewTemplate = document.querySelector(
  "#card-preview"
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketItemTemplate = document.querySelector(
  "#card-basket"
) as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts"
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success"
) as HTMLTemplateElement;

let basketView: BasketView | null = null;
let orderFormView: OrderForm | null = null;
let contactsFormView: ContactsForm | null = null;
let isBasketModalOpen = false;

events.on("modal:close", () => {
  isBasketModalOpen = false;
});

//обработчик изменения каталога
events.on("catalog:changed", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const node = catalogTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    const card = new CatalogCard(node, events);

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}/${product.image}`,
    });
  });

  gallery.render({ catalog: cards });
});

//клик по карточке
events.on<{ id: string }>("card:select", ({ id }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  productsModel.setPreview(product);
});

// preview в модалке
events.on("preview:changed", () => {
  const product = productsModel.getPreview();
  if (!product) return;

  const node = previewTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;
  const previewCard = new PreviewCard(node, events);

  const content = previewCard.render({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    description: product.description,
    image: `${CDN_URL}/${product.image}`,
  });

  modal.render({ content });
  modal.open();
});

//добавление товара в корзину
events.on<{ id: string }>("product:buy", ({ id }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  basketModel.add(product);
});

//обновление ui при изменении корзины
events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  const basketNode = basketTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;
  basketView = new BasketView(basketNode, events);

  const items = basketModel.getItems();

  const renderedItems = items.map((product, index) => {
    const node = basketItemTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const itemCard = new BasketItemCard(node, events);

    return itemCard.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: renderedItems,
    total: basketModel.getTotal(),
    valid: items.length > 0,
  });

  if (isBasketModalOpen) {
    modal.render({ content: basketView.render() });
  }
});

//открытие корзины
events.on("basket:open", () => {
  isBasketModalOpen = true;
  const basketNode = basketTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;
  basketView = new BasketView(basketNode, events);

  const items = basketModel.getItems();
  const renderedItems = items.map((product, index) => {
    const node = basketItemTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const itemCard = new BasketItemCard(node, events);

    return itemCard.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: renderedItems,
    total: basketModel.getTotal(),
    valid: items.length > 0,
  });

  modal.render({ content: basketView.render() });
  modal.open();
});

//удаление товара из корзины
events.on<{ id: string }>("basket:remove", ({ id }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  basketModel.remove(product);
});

//переход к оформлению из корзины
events.on("order:open", () => {
  const formNode = orderTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLFormElement;
  orderFormView = new OrderForm(formNode, events);

  modal.render({ content: orderFormView.render({ valid: false, errors: "" }) });
  modal.open();
});

//выбор оплаты
events.on<{ payment: "card" | "cash" }>("order:payment", ({ payment }) => {
  buyerModel.setData({ payment });
});
//изменение адреса
events.on<{ field: "address"; value: string }>("order:change", ({ value }) => {
  buyerModel.setData({ address: value });
});

//переход к contactform из orderform
events.on("order:submit", () => {
  const formNode = contactsTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLFormElement;
  contactsFormView = new ContactsForm(formNode, events);

  modal.render({
    content: contactsFormView.render({ valid: false, errors: "" }),
  });
  modal.open();
});

//обработка ввода contactsform
events.on<{ field: "email" | "phone"; value: string }>(
  "contacts:change",
  ({ field, value }) => {
    buyerModel.setData({ [field]: value });
  }
);

//валидность
events.on("buyer:changed", () => {
  const errors = buyerModel.validate();
  const errorsText = Object.values(errors).filter(Boolean).join(". ");

  const orderValid = !errors.payment && !errors.address;
  const contactsValid = !errors.email && !errors.phone;

  if (orderFormView) {
    orderFormView.render({
      valid: orderValid,
      errors: errorsText,
    });
  }

  if (contactsFormView) {
    contactsFormView.render({
      valid: contactsValid,
      errors: errorsText,
    });
  }
});


events.on("contacts:submit", () => {
  const buyer = buyerModel.getData();

  const order: IOrder = {
    ...buyer,
    items: basketModel.getItems().map((p) => p.id),
    total: basketModel.getTotal(),
  };

  webApi
    .createOrder(order)
    .then((result) => {
      const node = successTemplate.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
      const success = new Success(node, events);

      modal.render({ content: success.render({ total: result.total }) });
      modal.open();

      basketModel.clear();
      buyerModel.clear();

      orderFormView = null;
      contactsFormView = null;
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
    });
});

events.on("success:close", () => {
  modal.close();
});

webApi
  .getProducts()
  .then((items) => {
    // сохраняем товары, полученные с сервера, в модель каталога
    productsModel.setProducts(items);
  })
  .catch((err) => {
    console.error("Ошибка получения каталога с сервера:", err);
  });
