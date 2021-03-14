document.addEventListener('DOMContentLoaded', () => {
  'use strict';
 
  const getData = (url, callback) => { //универсальная функция
    const request = new XMLHttpRequest(); // два метода настройка соединения и отправка
    request.open('GET', url);
    request.send()
    request.addEventListener('readystatechange', () => { //срабатывает когда меняется значение readystatechange
      if (request.readyState !== 4) return;  //нужно для отображения 4 элемента вместо всего всех
      if (request.status === 200) {
        const response = JSON.parse(request.response);
        callback(response);
      } else {
        console.error(new Error('Error ' + request.status));
      }
    });
  }; 
 /*   getData ('cross-sell-dbase/dbase.json', (data) => {
      console.log(data);
    }) */
 
  /* const getData = (url, callback) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
         return response.json()
        }
        throw new Error(response.statusText)
        })
      .then(callback)
      .catch((err) => {
            console.log(err);
      });
  } */

  const tabs = () => {
    const cardDetailChange = document.querySelectorAll('.card-detail__change');
    const cardDetailsTitle = document.querySelector('.card-details__title');
    const cardImage = document.querySelector('.card__image_item');
    const cardDetailsPrice = document.querySelector('.card-details__price');
    const descriptionMemory = document.querySelector('.description__memory');

    const data = [
      {
        name:'Смартфон Apple iPhone 12 Pro 128GB Graphite',
        img:'img/iPhone-graphite.png',
        price:2851,
        memoreROM:128,
      },
      {
        name:'Смартфон Apple iPhone 12 Pro 128GB Silve',
        img:'img/iPhone-silver.png',
        price:3851,
        memoreROM:256,
      },
      {
        name:'Смартфон Apple iPhone 12 Pro 128GB Pacific Blue',
        img:'img/iPhone-blue.png',
        price:4551,
        memoreROM:128,
      },
    ];
    const deactive = () => {
      cardDetailChange.forEach((btn) => btn.classList.remove('active'));
    }
    cardDetailChange.forEach((btn,i) => {
      btn.addEventListener('click', () => {
        if (!btn.classList.contains('active')) {//contains проверяет есть класс эктыв у кнопки
          deactive();
          btn.classList.add('active');
          cardDetailsTitle.textContent = data[i].name;
          cardImage.src = data[i].img;
          cardImage.alt = data[i].name;
          cardDetailsPrice.textContent = data[i].price + 'грн';
          descriptionMemory.textContent = `Встроенная память (ROM) ${data[i].memoreROM} ГБ`;
        }
      })
    })
  };
  const accordion = () => {
    const characteristicsList = document.querySelector('.characteristics__list');
    const characteristicItem = document.querySelectorAll('.characteristics__item');
    const characteristicsTitle = document.querySelectorAll('.characteristics__title')
    const characteristicsDescription = document.querySelectorAll('.characteristics__description')
    
    characteristicItem.forEach(elem => {
      if (elem.children[1].classList.contains('active')) { //вариант если нужна одна активная
        elem.children[1].style.height = `${elem.children[1].scrollHeight}px`;  //еще один вариант для плавности
      }
    })

    const open = (button, dropDown) => {
      closeAllDrops();
      dropDown.style.height = `${dropDown.scrollHeight}px`; //плавность при закритие открытие
      button.classList.add('active')
      dropDown.classList.add('active')
    }
    const close = (button, dropDown) => {
      button.classList.remove('active')
      dropDown.classList.remove('active')
      dropDown.style.height = '';
    }
     /* const closeAllDrops = (button, dropDown) => {
      characteristicItem.forEach((elem) => {
        if (elem.children[0] !== button && elem.children[1] !== dropDown) {
          close(elem.children[0], elem.children[1]);
        }
      })
    }  */
    const closeAllDrops = () => {
      characteristicsDescription.forEach(elem => {
        elem.classList.remove('active')
        elem.style.height = '';
      })
      characteristicsTitle.forEach(elem => {
        elem.classList.remove('active')
      })
    }

    characteristicsList.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('characteristics__title')) {
        const parent = target.closest('.characteristics__item');  //closest ищит родительский елемент выше
        const description = parent.querySelector('.characteristics__description');
        description.classList.contains('active') ?
          close(target, description) :
              open(target, description);
      }
    });
    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (!target.closest('.characteristics__list')) {
        closeAllDrops();
      }
    })
  }
  const modal = () => {
    const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy');
    const cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery');
    const modal = document.querySelector('.modal');
    const cardDetailPrice = document.querySelector('.card-details__price')
    const cardDetailsTitle = document.querySelector('.card-details__title')
    const modalTitle = modal.querySelector('.modal__title');
    const modalSubtitle = modal.querySelector('.modal__subtitle')
     const modalTitleSubmit = modal.querySelector('.modal__title-submit');

    const openModal = (event) => {
      const target = event.target;
      modal.classList.add('open');
      document.addEventListener('keydown', escapeHandler)
      modalTitle.textContent = cardDetailsTitle.textContent;
      modalTitleSubmit.value = cardDetailsTitle.textContent; //берем велюе и меняем его на название товара
      modalSubtitle.textContent = target.dataset.buttonBuy; //dataset.buttonBuy для получения атрибутов
    }
    
    const closeModal = () => {
      modal.classList.remove('open');
      document.removeEventListener('keydown', escapeHandler)  //удаляем, это событие что бы оно не повторялось 
    }
    const escapeHandler = event => {
        if (event.code === "Escape") {
          closeModal();
      }
    }

    modal.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('modal__close')|| target===modal) {
        closeModal();
      }
    })

  cardDetailsButtonBuy.addEventListener('click',  openModal)
  cardDetailsButtonDelivery.addEventListener('click', openModal)
  }
  

  const renderCrossSell = () => {
    const COUNT_ROW_GOODS = 4;
    const crossSellList = document.querySelector('.cross-sell__list');
    const crossSellAdd = document.querySelector('.cross-sell__add');
    const allGoods = []
    let wrapRender = null;
    // Перемешиваем массива
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
    
    const createCrossSellItem = ({ photo, name, price }) => {
      const liItem = document.createElement('li');
      liItem.innerHTML = `
            <article class="cross-sell__item">
							<img class="cross-sell__image" src="${photo}" alt="${name}">
							<h3 class="cross-sell__title">${name}</h3>
							<p class="cross-sell__price">${price}₽</p>
							<div class="button button_buy cross-sell__button">Купить</div>
						</article>
            `;
      return liItem;
    }
    const render = arr => {
        arr.forEach(item => {
        crossSellList.append(createCrossSellItem(item));
      })
    }
    
    const wrapper = (fn, count) => {
      let counter = 0
      return (...args) => {
        if (counter === count) return;
        counter++;
        return fn(...args)
      }
    };

   // const wrapRender = wrapper(render,COUNT_ROW_GOODS) //функция может вызваться максимум 2 раза

    const createCrossSellList = (goods) => {
      wrapRender = wrapper(render, parseInt(goods.length / COUNT_ROW_GOODS) + 1);
      allGoods.push(...shuffle(goods));//что бы не делать все время запрос записали его в константу и используем дальше
     // crossSellList.textContent = ""; //очищаем для того что бы сделвть по времени перезагрузку данных 
     // const shuffleGoods = shuffle(allGoods)
      const fourItem = allGoods.splice(0, COUNT_ROW_GOODS); //вырезает из массива элем, что б они потом не повторялись
     // setTimeout(createCrossSellList,5000) //рекурсия(запускает сама всебя через опр время)
      render(fourItem);
    };
      crossSellAdd.addEventListener('click', () => {
        wrapRender(allGoods.splice(0, COUNT_ROW_GOODS));
      })
    getData('cross-sell-dbase/dbase.json', createCrossSellList)

  }
 

  tabs();
  accordion();
  modal();
  renderCrossSell();
  amenu('.header__menu','.header-menu__list','.header-menu__item','.header-menu__burger');
});
