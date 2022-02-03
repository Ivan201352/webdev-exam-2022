window.onload = function () {
    Data(1, '');

    document.querySelector('.searbutt').onclick = function () {
        filtertake();
    }
    document.querySelector('#OkrugInp').onchange = function () {
        givefiltres('admArea', '');
    }
    document.querySelector('#RaionInp').onchange = function () {
        givefiltres('district', '');
    }
    document.querySelector('.pagination').onclick = pagination;
    document.querySelector('.zakazcheckContainer').onclick = function (event) {
        if (event.target == document.querySelector('.zakazcheckContainer'))
            showProblem('Вы ничего не выбрали', 'warning', 'main');
    }
    document.querySelector('.modal-buttons').onclick = function (event) {
        if (event.target.querySelector('.provarkazakbutt').disabled) {
            showProblem('Ошибка, заполните пожалуйста полностью', 'warning', 'modal');
            document.querySelector('.modal').classList.add('fade');
        }
    }
    document.querySelector('#option-2').onchange = function (event) {
        onX2Btn(event.target);
    }
    document.querySelector('#option-gor').onchange = function (event) {
        onGorBtn(event.target);
    }
}

let zone = [], category = [];

function choosedCompany(event) {
    let id = event.target.closest('.list-group-item').id;

    let url_add = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants/" + id;
    let api_key = "37405276-3222-433a-b5ad-48208caaf72b";

    let url = new URL(url_add);
    url.searchParams.append("api_key", api_key);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        MenuRestoran(this.response);
        GiveInfoToModal(this.response);
    }
    xhr.send();
}

function modalCurrCount(elem) {
    let menuCont = document.querySelector('.menu-container');
    for (let item of menuCont.querySelectorAll('.menu-item')) {
        if (elem.querySelector('.modal-menu-name').innerHTML == item.querySelector('.menu-name').innerHTML) {
            return item.querySelector('.menu-input').value;
        }
    }
}

function showProblem(msg, color, place) {
    let container = document.querySelector('.alerts');
    let alert = container.querySelector('#alert-template').cloneNode(true);
    let ModalList = document.querySelector('.modal-alerts');
    alert.classList.add('alert-' + color);
    alert.querySelector('.msg').innerHTML = msg;
    alert.classList.remove('d-none');
    if (place == 'main')
        container.append(alert);
    if (place == 'modal')
    ModalList.append(alert);
}


function onGorBtn(target) {
    let cont = document.querySelector('.modal-menu-info');
    let total = document.querySelector('.totalPrice').innerHTML;
    document.querySelector('.totalPrice').innerHTML = total;
    document.querySelector('.modal-total-price').innerHTML = total;
    document.querySelector('.modal-option-gor').innerHTML = '-30% (Если заказ будет холодным)';
}

function onX2Btn(target) {
    let cont = document.querySelector('.modal-menu-info');
    let total = document.querySelector('.totalPrice').innerHTML;
    document.querySelector('.totalPrice').innerHTML = total * 1,6 ;
    document.querySelector('.modal-total-price').innerHTML = total * 1,6 ;
    document.querySelector('.modal-option-2').innerHTML = 'Позиций становится в 2 раза больше';
}

function filtertake(page = 1) {
    let form = document.querySelector('form');
    let filtr = {
        'admArea': form.elements['OkrugInp'].value,
        'district': form.elements['RaionInp'].value,
        'typeObject': form.elements['TipInp'].value,
        'discount': form.elements['SkidkaInp'].value
    };
    if (filtr['admArea'] == '' && filtr['district'] == '' && filtr['typeObject'] == '') filtr['isFilter'] = false;
    else filtr['isFilter'] = true;

    Data(page, filtr);
}

function Data(page = 1, filter = '') {
    let url_add = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
    let api_key = "37405276-3222-433a-b5ad-48208caaf72b";
    let url = new URL(url_add);
    url.searchParams.append("api_key", api_key);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        GiveCompanyL(this.response, page, filter);
        givefiltres('', this.response);
    }
    xhr.send();
}

function GiveCompanyL(array, page, filter = '') {
    let spisokComp = document.querySelector('.company-list');
    spisokComp.innerHTML = '';
    let count = 0, start, end;
    let restorant = [];

    if (filter['isFilter']) {
        for (let elem of array) {
            if ((filter['admArea'] ? filter['admArea'] == elem['admArea'] : 1) &&
                (filter['district'] ? filter['district'] == elem['district'] : 1) &&
                (filter['typeObject'] ? filter['typeObject'] == elem['typeObject'] : 1)) {
                restorant.push(elem);
                count++;
            }
        }
    } else {
        for (let elem of array) {
            count++;
            restorant.push(elem);
        }
    }

    RatingSort(restorant, 'rate');
    console.log(restorant);

    let max_page = Math.ceil(count / 10);
    start = page * 10 - 10;
    (page < max_page) ? end = page * 10 : end = count;
    for (let i = start; i < end; ++i) {
        spisokComp.append(createCompElem(restorant[i]));
    }
    for (let btn of document.querySelectorAll('.chooseBtn')) {
        btn.onclick = choosedCompany;
    }
    SpisokPagination(page, max_page);
}

function createCompElem(company) {
    let item = document.getElementById('companyItem-template').cloneNode(true);
    item.querySelector('.company-name').innerHTML = company.name;
    item.querySelector('.company-type').innerHTML = company['typeObject'];
    item.querySelector('.company-address').innerHTML = company['address'];
    item.querySelector('.company-admArea').innerHTML = company['admArea'];
    item.querySelector('.company-district').innerHTML = company['district'];
    item.querySelector('.company-discount').innerHTML = company['socialDiscount'];
    item.setAttribute('id', company['id']);
    item.classList.remove('d-none');
    return item;
}

function SpisokPagination(page, max_page) {
    let item = document.querySelector('.page-item').cloneNode(true);
    let StrPagin = document.querySelector('.pagination');
    StrPagin.innerHTML = '';

    item.querySelector('.page-link').innerHTML = "Пред";
    item.classList.remove('d-none');
    StrPagin.append(item);

    for (let i = page - 2; i < page + 3; ++i) {
        if (i > 0 && i < max_page + 1) {
            item = item.cloneNode(true);
            item.classList.remove('active');
            item.querySelector('.page-link').innerHTML = i;
            item.classList.remove('d-none');
            if (i == page) item.classList.add('active');
            StrPagin.append(item);
        }
    }

    item = item.cloneNode(true);
    item.querySelector('.page-link').innerHTML = "След";
    item.classList.remove('active');
    item.classList.remove('d-none');
    StrPagin.append(item);
}

function pagination(event) {
    let currentPage = Number(document.querySelector(".pagination").querySelector(".active").querySelector(".page-link").innerHTML);
    let NewPagin = event.target.innerHTML;

    if (NewPagin == 'Пред' && currentPage != 1) filtertake(currentPage - 1);
    else if (NewPagin == 'След') filtertake(currentPage + 1);
    else if (NewPagin == currentPage) { }
    else filtertake(Number(NewPagin));
}

function RatingSort(array, key) {
    let banner = true, tmp;
    while (banner) {
        banner = false;
        for (let i = 1; i < array.length; ++i) {
            if (array[i - 1][key] < array[i][key]) {
                banner = true;
                tmp = array[i - 1];
                array[i - 1] = array[i];
                array[i] = tmp;
            }
        }
    }
}

function givefiltres(event, array = '') {
    let filterbox = document.querySelector(".filters");
    let admOkr, raion, districts, tip;
    if (array) {
        for (let element of array) {
            admOkr = element["admArea"];
            raion = element["district"];
            tip = element["typeObject"];
            districts = new Array();

            if (category.indexOf(tip) == -1) {
                category.push(tip);
            }

            if (!poiskElem(zone, admOkr, 'admArea')) {
                zone.push({ "admArea": admOkr, "district": districts });
            }
            if (!poiskElem(zone, raion, 'district')) {
                for (let item of zone) {
                    if (item['admArea'] == admOkr) {
                        item['district'].push(raion);
                    }
                }
            }
        }
    }

    let okrugFilter = filterbox.querySelector('#OkrugInp');
    let raionFilter = filterbox.querySelector('#RaionInp');

    if (event == 'district') {
        let int;
        for (let elem of zone) {
            for (let item of elem['district']) {
                if (item == raionFilter.value) {
                    int = elem['admArea'];
                }
            }
        }
        okrugFilter.value = int;
    }
    if (event == 'admArea') {
        raionFilter.innerHTML = '';
        raionFilter.append(document.createElement('option'));
        for (let elem of zone) {
            if (okrugFilter.value == elem['admArea']) {
                for (let item of elem['district']) {
                    let option = document.createElement('option');
                    option.innerHTML = item;
                    raionFilter.append(option);
                }
            }
        }
    }
    if (!okrugFilter.value && !raionFilter.value) {
        okrugFilter.innerHTML = '';
        okrugFilter.append(document.createElement('option'));
        raionFilter.innerHTML = '';
        raionFilter.append(document.createElement('option'));

        for (let elem of zone) {
            let option = document.createElement('option');
            option.innerHTML = elem['admArea'];
            okrugFilter.append(option);
        }
        for (let elem of zone) {
            for (let item of elem['district']) {
                let option = document.createElement('option');
                option.innerHTML = item;
                raionFilter.append(option);
            }
        }
    }

    let tipFilter = filterbox.querySelector('#TipInp');

    if (!tipFilter.value) {
        tipFilter.innerHTML = '';
        tipFilter.append(document.createElement('option'));

        for (let elem of category) {
            let option = document.createElement('option');
            option.innerHTML = elem;
            tipFilter.append(option);
        }
    }

    let skidkaFilter = filterbox.querySelector('#SkidkaInp');
    skidkaFilter.innerHTML = '';
    skidkaFilter.append(document.createElement('option'));

    let option = document.createElement('option');
    option.innerHTML = 'Да';
    skidkaFilter.append(option);

    option = document.createElement('option');
    option.innerHTML = 'Нет';
    skidkaFilter.append(option);
}

function poiskElem(zone, elem, key) {
    if (key == 'admArea') {
        for (let element of zone) {
            if (element['admArea'] == elem) return true;
        }
    } else if (key == 'district') {
        for (let element of zone) {
            for (let item of element['district']) {
                if (item == elem) return true;
            }
        }
    }
    return false;
}


function GiveInfoToModal(element) {
    let ModElem = document.querySelector('.modal');
    ModElem.querySelector('.modal-company-name').innerHTML = element['name'];
    ModElem.querySelector('.modal-company-admArea').innerHTML = element['admArea'];
    ModElem.querySelector('.modal-company-district').innerHTML = element['district'];
    ModElem.querySelector('.modal-company-address').innerHTML = element['address'];
    ModElem.querySelector('.modal-company-rate').innerHTML = (Number(element['rate']) / 20).toString() + '&#7777';

    let modalMenu = ModElem.querySelector('.modal-menu-info');
    modalMenu.innerHTML = '';
    for (let i = 1; i <= 10; ++i) {
        let name = 'set_' + i;
        modalMenu.append(ModMenElem(element[name], menu[i - 1]));
    }
}

function ModMenElem(price, elem) {
    let item = document.querySelector('#modalMenuElem-template').cloneNode(true);
    item.querySelector('.modal-menu-name').innerHTML = elem['name'];
    item.querySelector('.modal-menu-img').setAttribute('src', elem['image']);
    item.querySelector('.modal-menu-price').innerHTML = price;
    return item;
}

function MenuRestoran(element) {
    let menuContainer = document.querySelector('.menu-container');
    if (menuContainer.innerHTML) {
        console.log(true);
        let X2 = document.querySelector('#option-2');
        if (X2.checked) {
            X2.checked = false;
            onX2Btn(X2);
        }
        let onGroup = document.querySelector('#option-2');
        if (onGroup.checked) {
            onGroup.checked = false;
        }
        document.querySelector('#option-gor').checked = false;
    }
    menuContainer.innerHTML = '';
    document.querySelector('#menu').classList.remove("d-none");
    document.querySelector('#total').classList.remove("d-none");
    document.querySelector('.totalPrice').innerHTML = 0;
    document.querySelector('.modal-total-price').innerHTML = 0;


    for (let i = 1; i <= 10; ++i) {
        let name = 'set_' + i;
        menuContainer.append(menuPosition(element[name], menu[i - 1]));
    }
    for (let btn of document.querySelectorAll('.input-group')) {
        btn.onclick = function (event) {
            let name = event.target.closest('.menu-item').querySelector('.menu-name').innerHTML;
            let modalMenuInfo = document.querySelector('.modal-menu-info');
            let menuItem = modalMenuItem(modalMenuInfo, name);

            if (event.target.innerHTML == '+') {
                btn.querySelector('.menu-input').value = Number(btn.querySelector('.menu-input').value) + 1;
            } else if (event.target.innerHTML == '-' && btn.querySelector('.menu-input').value != 0) {
                btn.querySelector('.menu-input').value = Number(btn.querySelector('.menu-input').value) - 1;
            }

            if (btn.querySelector('.menu-input').value == 0) {
                btn.querySelector('.menu-input').value = '';
                menuItem.classList.add('d-none');
                menuItem.querySelector('.modal-menu-count').innerHTML = 0;
                menuItem.querySelector('.modal-menu-sum').innerHTML = 0;
            }

            let groupBtn = document.querySelector('#option-gor');
            let isGroupOn = groupBtn.checked;
            if (isGroupOn) {
                groupBtn.checked = false;
                onGorBtn(groupBtn);
            }

            if (btn.querySelector('.menu-input').value) {
                let count = Number(btn.querySelector('.menu-input').value);
                let price = Number(menuItem.querySelector('.modal-menu-price').innerHTML);

                menuItem.classList.remove('d-none');
                if (document.querySelector('#option-2').checked) {
                    let X2n = document.querySelector('.modal-option-2').querySelector('.modal-menu-name').innerHTML;
                    if (menuItem.querySelector('.modal-menu-name').innerHTML == X2n) {
                        menuItem.querySelector('.modal-menu-count').innerHTML = count;
                    } else {
                        menuItem.querySelector('.modal-menu-count').innerHTML = count;
                    }
                } else {
                    menuItem.querySelector('.modal-menu-count').innerHTML = count;
                }
                menuItem.querySelector('.modal-menu-sum').innerHTML = count * price;
            }


            let FunalCheck = 0;
            for (let elem of modalMenuInfo.querySelectorAll('.modal-menu-element')) {
                FunalCheck += Number(elem.querySelector('.modal-menu-sum').innerHTML);
            }
            document.querySelector('.totalPrice').innerHTML = FunalCheck;
            document.querySelector('.modal-total-price').innerHTML = FunalCheck;

            if (FunalCheck == 0) document.querySelector(".checkBtn").setAttribute('disabled', 'disabled');
            else document.querySelector(".checkBtn").disabled = false;

            if (isGroupOn) {
                groupBtn.checked = true;
                onGorBtn(groupBtn);
            }
        };
    }
}

function modalMenuItem(cont, name) {
    for (let menuItem of cont.querySelectorAll('.modal-menu-element')) {
        if (menuItem.querySelector('.modal-menu-name').innerHTML == name) {
            return menuItem;
        }
    }
}

function menuPosition(price, elem) {
    let item = document.querySelector('#menuItem-template').cloneNode(true);
    item.querySelector('.menu-name').innerHTML = elem['name'];
    item.querySelector('.menu-img').setAttribute('src', elem['image']);
    item.querySelector('.menu-desc').innerHTML = elem['desc'];
    item.querySelector('.menu-price').innerHTML = price;
    item.classList.remove('d-none');
    return item;
}

let menu = [
    {
        'name': 'Пицца "3 мяса"',
        'desc': 'Вы гарантируете себе вкусовое удовольствие.',
        'image': 'img/2.2.png'
    },
    {
        'name': 'Картофель Фри',
        'desc': 'Всеми любимый обжареный в масле картофель.',
        'image': 'img/2.4.png'
    },
    {
        'name': 'Грибной суп',
        'desc': 'Очень вкусный и полезеый.',
        'image': 'img/2.5.jpg'
    },
    {
        'name': 'Курица с рисом',
        'desc': 'Сбалансированный и полезный готовый продукт.',
        'image': 'img/2.6.jpg'
    },
    {
        'name': 'Овежавыжатый сок',
        'desc': 'Освежающий и полный ватиминами сок.',
        'image': 'img/2.7.jpg'
    },
    {
        'name': 'Суши сет',
        'desc': 'Вкусные и всежие суши',
        'image': 'img/2.1.jpg'
    },
    {
        'name': 'Фруктовый микс',
        'desc': 'Свежая нарезка из разных фруктов.',
        'image': 'img/2.8.png'
    },
    {
        'name': 'Бургер',
        'desc': 'Много мяса, мало теста.',
        'image': 'img/2.3.jpg'
    },
    {
        'name': 'Паста "Карбонара"',
        'desc': 'Вкусная паста у вас дома.',
        'image': 'img/2.9.jpeg'
    },
    {
        'name': 'Запечённые овощи',
        'desc': 'Низколорийный и натуральный продукт',
        'image': 'img/2.10.jpg'
    }
]