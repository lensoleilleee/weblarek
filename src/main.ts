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

import { TOrder } from "./types";

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

const basketNode = basketTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;
const basketView = new BasketView(basketNode, events);

basketView.items = [];
basketView.total = 0;

const orderFormNode = orderTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLFormElement;
const orderFormView = new OrderForm(orderFormNode, events);

const contactsFormNode = contactsTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLFormElement;
const contactsFormView = new ContactsForm(contactsFormNode, events);

const previewNode = previewTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;
const previewCardView = new PreviewCard(previewNode, {
  onToggle: () => events.emit("preview:toggle"),
});

const successNode = successTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;
const successView = new Success(successNode, events);

function syncForms(): void {
  const data = buyerModel.getData();

  orderFormView.setValues({
    address: data.address ?? "",
  });

  orderFormView.setPayment((data.payment as "card" | "cash" | "") ?? "");

  contactsFormView.setValues({
    email: data.email ?? "",
    phone: data.phone ?? "",
  });
}

//обработчик изменения каталога
events.on("catalog:changed", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const node = catalogTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    const card = new CatalogCard(node, {
      onClick: () => productsModel.setPreview(product),
    });

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}/${product.image}`,
    });
  });

  gallery.render({ catalog: cards });
});

// preview в модалке
events.on("preview:changed", () => {
  const product = productsModel.getPreview();
  if (!product) return;

  const inBasket = basketModel.has(product.id);

  modal.render({
    content: previewCardView.render({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      image: `${CDN_URL}/${product.image}`,
      buttonText: inBasket ? "Удалить из корзины" : "Купить",
    }),
  });

  modal.open();
});

events.on("preview:toggle", () => {
  const selected = productsModel.getPreview();
  if (!selected) return;

  if (basketModel.has(selected.id)) {
    basketModel.remove(selected);
  } else {
    basketModel.add(selected);
  }

  modal.close();
});

//обновление ui при изменении корзины
events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  const items = basketModel.getItems();

  const renderedItems = items.map((product, index) => {
    const node = basketItemTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const itemCard = new BasketItemCard(node, {
      onRemove: () => basketModel.remove(product),
    });

    return itemCard.render({
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
});

//открытие корзины
events.on("basket:open", () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

//переход к оформлению из корзины
events.on("order:open", () => {
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
  syncForms();

  const errors = buyerModel.validate();
  const errorsText = Object.values(errors).filter(Boolean).join(". ");

  const orderValid = !errors.payment && !errors.address;
  const contactsValid = !errors.email && !errors.phone;

  orderFormView.render({ valid: orderValid, errors: errorsText });

  contactsFormView.render({ valid: contactsValid, errors: errorsText });
});

events.on("contacts:submit", () => {
  const order: TOrder = {
    ...buyerModel.getData(),
    items: basketModel.getItems().map((p) => p.id),
    total: basketModel.getTotal(),
  };

  webApi
    .createOrder(order)
    .then((result) => {
      modal.render({ content: successView.render({ total: result.total }) });
      modal.open();

      basketModel.clear();
      buyerModel.clear();
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
