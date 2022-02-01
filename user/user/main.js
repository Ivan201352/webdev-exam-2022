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
        createMenu(this.response);
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
    let modalContainer = document.querySelector('.modal-alerts');

    alert.classList.add('alert-' + color);
    alert.querySelector('.msg').innerHTML = msg;
    alert.classList.remove('d-none');

    if (place == 'main')
        container.append(alert);
    if (place == 'modal')
        modalContainer.append(alert);
}


function onGorBtn(target) {
    let cont = document.querySelector('.modal-menu-info');
    if (target.checked) {
        for (let elem of cont.querySelectorAll('.modal-menu-element')) {
            let price = elem.querySelector('.modal-menu-price').innerHTML;
            let count = modalCurrCount(elem);
            
            if (document.querySelector('#option-2').checked) {
                let name = document.querySelector('.modal-option-2').querySelector('.modal-menu-name').innerHTML;
                if (name == elem.querySelector('.modal-menu-name').innerHTML) {
                    elem.querySelector('.modal-menu-count').innerHTML = Number(count);
                    elem.querySelector('.modal-menu-sum').innerHTML = count * price;
                } else {
                    elem.querySelector('.modal-menu-count').innerHTML = count;
                    elem.querySelector('.modal-menu-sum').innerHTML = count * price;
                }
            } else {
                elem.querySelector('.modal-menu-count').innerHTML = count;
                elem.querySelector('.modal-menu-sum').innerHTML = count * price;
            }
        }
        let total = document.querySelector('.totalPrice').innerHTML;
        document.querySelector('.totalPrice').innerHTML = total;
        document.querySelector('.modal-total-price').innerHTML = total;
        document.querySelector('.modal-option-gor').innerHTML = '-30% (Если заказ будет холодным)';
    } else {
        for (let elem of cont.querySelectorAll('.modal-menu-element')) {
            let count = modalCurrCount(elem);
            let price = elem.querySelector('.modal-menu-price').innerHTML;

            if (document.querySelector('#option-2').checked) {
                let name = document.querySelector('.modal-option-2').querySelector('.modal-menu-name').innerHTML;
                if (name == elem.querySelector('.modal-menu-name').innerHTML) {
                    elem.querySelector('.modal-menu-count').innerHTML = Number(count);
                    elem.querySelector('.modal-menu-sum').innerHTML = count * price;
                } else {
                    elem.querySelector('.modal-menu-count').innerHTML = count;
                    elem.querySelector('.modal-menu-sum').innerHTML = count * price;
                }
            } else {
                elem.querySelector('.modal-menu-count').innerHTML = count;
                elem.querySelector('.modal-menu-sum').innerHTML = count * price;
            }
        }
        let total = document.querySelector('.totalPrice').innerHTML;
        document.querySelector('.totalPrice').innerHTML = total;
        document.querySelector('.modal-total-price').innerHTML = total;
    }
}

function onX2Btn(target) {
    let cont = document.querySelector('.modal-menu-info');
    if (target.checked) {
        document.querySelector('.modal-option-2').innerHTML = '';
        let num = 0;
        let i = 0;
        for (let elem of cont.querySelectorAll('.modal-menu-element')) {
            i += 1;
            if (i == num) {
                let elemClone = elem.cloneNode(true);
                elemClone.classList.remove('d-none');
                elem.querySelector('.modal-menu-count').innerHTML = Number(elem.querySelector('.modal-menu-count').innerHTML) + 1;
                elem.classList.remove('d-none');
                elemClone.querySelector('.modal-menu-count').innerHTML = 1;
                elemClone.querySelector('.modal-menu-sum').innerHTML = 0;
                document.querySelector('.modal-option-2').append(elemClone);
            }
        }
    } else {
        let name = document.querySelector('.modal-option-2').querySelector('.modal-menu-name').innerHTML;
        document.querySelector('.modal-option-2').innerHTML = '';
        let menuItem = findModalMenuItem(cont, name);
        console.log(menuItem);
        menuItem.querySelector('.modal-menu-count').innerHTML = Number(menuItem.querySelector('.modal-menu-count').innerHTML) - 1;
        if (menuItem.querySelector('.modal-menu-count').innerHTML == 0) {
            menuItem.classList.add('d-none');
            menuItem.querySelector('.modal-menu-count').innerHTML = '';
        }
        document.querySelector('.modal-option-2').innerHTML = 'нет';
    }
}

function filtertake(page = 1) {
    let form = document.querySelector('form');
    let filter = {
        'admArea': form.elements['OkrugInp'].value,
        'district': form.elements['RaionInp'].value,
        'typeObject': form.elements['TipInp'].value,
        'discount': form.elements['SkidkaInp'].value
    };
    if (filter['admArea'] == '' && filter['district'] == '' && filter['typeObject'] == '') filter['isFilter'] = false;
    else filter['isFilter'] = true;

    Data(page, filter);
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
    let companyList = document.querySelector('.company-list');
    companyList.innerHTML = '';
    let count = 0, start, end;
    let companies = [];

    if (filter['isFilter']) {
        for (let elem of array) {
            if ((filter['admArea'] ? filter['admArea'] == elem['admArea'] : 1) &&
                (filter['district'] ? filter['district'] == elem['district'] : 1) &&
                (filter['typeObject'] ? filter['typeObject'] == elem['typeObject'] : 1)) {
                companies.push(elem);
                count++;
            }
        }
    } else {
        for (let elem of array) {
            count++;
            companies.push(elem);
        }
    }

    ComeSortedArray(companies, 'rate');
    console.log(companies);

    let max_page = Math.ceil(count / 10);
    start = page * 10 - 10;
    (page < max_page) ? end = page * 10 : end = count;

    for (let i = start; i < end; ++i) {
        companyList.append(createCompElem(companies[i]));
    }

    for (let btn of document.querySelectorAll('.chooseBtn')) {
        btn.onclick = choosedCompany;
    }

    createPagination(page, max_page);
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

function createPagination(page, max_page) {
    let item = document.querySelector('.page-item').cloneNode(true);
    let pagCont = document.querySelector('.pagination');
    pagCont.innerHTML = '';

    item.querySelector('.page-link').innerHTML = "Предыдущая";
    item.classList.remove('d-none');
    pagCont.append(item);

    for (let i = page - 2; i < page + 3; ++i) {
        if (i > 0 && i < max_page + 1) {
            item = item.cloneNode(true);
            item.classList.remove('active');
            item.querySelector('.page-link').innerHTML = i;
            item.classList.remove('d-none');
            if (i == page) item.classList.add('active');
            pagCont.append(item);
        }
    }

    item = item.cloneNode(true);
    item.querySelector('.page-link').innerHTML = "Следующая";
    item.classList.remove('active');
    item.classList.remove('d-none');
    pagCont.append(item);
}

function pagination(event) {
    let currentPage = Number(document.querySelector(".pagination").querySelector(".active").querySelector(".page-link").innerHTML);
    let newPage = event.target.innerHTML;

    if (newPage == 'Предыдущая' && currentPage != 1) filtertake(currentPage - 1);
    else if (newPage == 'Следующая') filtertake(currentPage + 1);
    else if (newPage == currentPage) { }
    else filtertake(Number(newPage));
}

function ComeSortedArray(array, key) {
    let flag = true, tmp;
    while (flag) {
        flag = false;
        for (let i = 1; i < array.length; ++i) {
            if (array[i - 1][key] < array[i][key]) {
                flag = true;
                tmp = array[i - 1];
                array[i - 1] = array[i];
                array[i] = tmp;
            }
        }
    }
}

function givefiltres(event, array = '') {
    let containerFiltres = document.querySelector(".filters");
    let admArea, district, districts, type;

    if (array) {
        for (let element of array) {
            admArea = element["admArea"];
            district = element["district"];
            type = element["typeObject"];
            districts = new Array();

            if (category.indexOf(type) == -1) {
                category.push(type);
            }

            if (!poiskElem(zone, admArea, 'admArea')) {
                zone.push({ "admArea": admArea, "district": districts });
            }
            if (!poiskElem(zone, district, 'district')) {
                for (let item of zone) {
                    if (item['admArea'] == admArea) {
                        item['district'].push(district);
                    }
                }
            }
        }
    }

    let admAreaFilter = containerFiltres.querySelector('#OkrugInp');
    let districtFilter = containerFiltres.querySelector('#RaionInp');

    if (event == 'district') {
        let temp;
        for (let elem of zone) {
            for (let item of elem['district']) {
                if (item == districtFilter.value) {
                    temp = elem['admArea'];
                }
            }
        }
        admAreaFilter.value = temp;
    }
    if (event == 'admArea') {
        districtFilter.innerHTML = '';
        districtFilter.append(document.createElement('option'));
        for (let elem of zone) {
            if (admAreaFilter.value == elem['admArea']) {
                for (let item of elem['district']) {
                    let option = document.createElement('option');
                    option.innerHTML = item;
                    districtFilter.append(option);
                }
            }
        }
    }
    if (!admAreaFilter.value && !districtFilter.value) {
        admAreaFilter.innerHTML = '';
        admAreaFilter.append(document.createElement('option'));
        districtFilter.innerHTML = '';
        districtFilter.append(document.createElement('option'));

        for (let elem of zone) {
            let option = document.createElement('option');
            option.innerHTML = elem['admArea'];
            admAreaFilter.append(option);
        }
        for (let elem of zone) {
            for (let item of elem['district']) {
                let option = document.createElement('option');
                option.innerHTML = item;
                districtFilter.append(option);
            }
        }
    }

    let typeFilter = containerFiltres.querySelector('#TipInp');

    if (!typeFilter.value) {
        typeFilter.innerHTML = '';
        typeFilter.append(document.createElement('option'));

        for (let elem of category) {
            let option = document.createElement('option');
            option.innerHTML = elem;
            typeFilter.append(option);
        }
    }

    let discountFilter = containerFiltres.querySelector('#SkidkaInp');
    discountFilter.innerHTML = '';
    discountFilter.append(document.createElement('option'));

    let option = document.createElement('option');
    option.innerHTML = 'Да';
    discountFilter.append(option);

    option = document.createElement('option');
    option.innerHTML = 'Нет';
    discountFilter.append(option);
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
    let modal = document.querySelector('.modal');
    modal.querySelector('.modal-company-name').innerHTML = element['name'];
    modal.querySelector('.modal-company-admArea').innerHTML = element['admArea'];
    modal.querySelector('.modal-company-district').innerHTML = element['district'];
    modal.querySelector('.modal-company-address').innerHTML = element['address'];
    modal.querySelector('.modal-company-rate').innerHTML = (Number(element['rate']) / 20).toString() + '&#7777';

    let modalMenu = modal.querySelector('.modal-menu-info');
    modalMenu.innerHTML = '';
    for (let i = 1; i <= 10; ++i) {
        let name = 'set_' + i;
        modalMenu.append(createModalMenuElem(element[name], menu[i - 1]));
    }
}

function createModalMenuElem(price, elem) {
    let item = document.querySelector('#modalMenuElem-template').cloneNode(true);
    item.querySelector('.modal-menu-name').innerHTML = elem['name'];
    item.querySelector('.modal-menu-img').setAttribute('src', elem['image']);
    item.querySelector('.modal-menu-price').innerHTML = price;
    return item;
}

function createMenu(element) {
    let menuContainer = document.querySelector('.menu-container');
    if (menuContainer.innerHTML) {
        console.log(true);
        let surp = document.querySelector('#option-2');
        if (surp.checked) {
            surp.checked = false;
            onX2Btn(surp);
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
        menuContainer.append(createMenuElem(element[name], menu[i - 1]));
    }
    for (let btn of document.querySelectorAll('.input-group')) {
        btn.onclick = function (event) {
            let name = event.target.closest('.menu-item').querySelector('.menu-name').innerHTML;
            let modalMenuInfo = document.querySelector('.modal-menu-info');
            let menuItem = findModalMenuItem(modalMenuInfo, name);

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
                    let surpName = document.querySelector('.modal-option-2').querySelector('.modal-menu-name').innerHTML;
                    if (menuItem.querySelector('.modal-menu-name').innerHTML == surpName) {
                        menuItem.querySelector('.modal-menu-count').innerHTML = count + 1;
                    } else {
                        menuItem.querySelector('.modal-menu-count').innerHTML = count;
                    }
                } else {
                    menuItem.querySelector('.modal-menu-count').innerHTML = count;
                }
                menuItem.querySelector('.modal-menu-sum').innerHTML = count * price;
            }


            let totalSum = 0;
            for (let elem of modalMenuInfo.querySelectorAll('.modal-menu-element')) {
                totalSum += Number(elem.querySelector('.modal-menu-sum').innerHTML);
            }
            document.querySelector('.totalPrice').innerHTML = totalSum;
            document.querySelector('.modal-total-price').innerHTML = totalSum;

            if (totalSum == 0) document.querySelector(".checkBtn").setAttribute('disabled', 'disabled');
            else document.querySelector(".checkBtn").disabled = false;

            if (isGroupOn) {
                groupBtn.checked = true;
                onGorBtn(groupBtn);
            }
        };
    }
}

function findModalMenuItem(cont, name) {
    for (let menuItem of cont.querySelectorAll('.modal-menu-element')) {
        if (menuItem.querySelector('.modal-menu-name').innerHTML == name) {
            return menuItem;
        }
    }
}

function createMenuElem(price, elem) {
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