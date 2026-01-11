import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { ProductsCatalog } from './components/models/ProductsCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/communication/WebLarekApi';

// проверка каталога товаров (локальные данные из data.ts)
const productsModel = new ProductsCatalog();
productsModel.setProducts(apiProducts.items);

console.log('Массив товаров из каталога:', productsModel.getProducts());
console.log('Товар по id:', productsModel.getProductById(apiProducts.items[0].id));

productsModel.setPreview(apiProducts.items[0]);
console.log('Товар для подробного отображения (preview):', productsModel.getPreview());

// проверка корзины
const basketModel = new Basket();

basketModel.add(apiProducts.items[0]);
basketModel.add(apiProducts.items[1]);

console.log('Товары в корзине:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость товаров в корзине:', basketModel.getTotal());
console.log('Есть ли товар с id первого товара:', basketModel.has(apiProducts.items[0].id));

basketModel.remove(apiProducts.items[0]);
console.log('Корзина после удаления первого товара:', basketModel.getItems());

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

// проверка покупателя
const buyerModel = new Buyer();

console.log('Пустые данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации (пустые поля):', buyerModel.validate());

buyerModel.setData({
  email: 'test@mail.ru',
  phone: '+37400000000',
  address: 'Yerevan',
  payment: 'card',
});

console.log('Заполненные данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации (после заполнения):', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

// проверка получения каталога с сервера
const baseApi = new Api(API_URL);
const webApi = new WebLarekApi(baseApi);

webApi
  .getProducts()
  .then((items) => {
    // сохраняем товары, полученные с сервера, в модель каталога
    productsModel.setProducts(items);

    console.log('Каталог с сервера (сохранён в модель):', productsModel.getProducts());
  })
  .catch((err) => {
    console.error('Ошибка получения каталога с сервера:', err);
  });
