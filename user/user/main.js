let maketOfDude
window.onload = function () {
    maketOfDude = document.getElementById('companyItem-template').cloneNode(true);

    GetInformationAboutCom();
    console.log(maketOfDude);
    addListenerFindBtn();

    let menuButt = document.querySelectorAll('.menuButt');
    menuButt.forEach(function (btn) {
        btn.addEventListener('click', setFunk)
    })
}
let data

function setFunk(event) {
    let oper = event.target.innerHTML;
    // let idE = event.currentTarget.children('.pole').id;
    // alert(idE);
    let pole = event.target.closest('.menuButt').querySelector('.pole');
    let clicks = 0;
    switch(oper){
        case '+':
            // alert("+")
                pole.innerHTML = Number(pole.innerHTML) + 1;
            break
        case '-':
            // alert("-")
                if (pole.innerHTML != 0 && pole.innerHTML != NaN){
                    pole.innerHTML = Number(pole.innerHTML) - 1;
                }
            break
    }
    if (pole.innerHTML == "0"){
        pole.innerHTML = "";
    }
}
function GetInformationAboutCom() {
    let url_add = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
    let api_key = "b47b35cf-b327-43d6-9683-88e83dd06714";
    let url = new URL(url_add);
    url.searchParams.append("api_key", api_key);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        console.log(this.response);
        GETSpisok(this.response);
        data = this.response
    }
    xhr.send();
}

function sortComElements(array) {
    let companyList = document.querySelector('.company-list');
    let counter = 0
    sortByR(array);
    while (counter < 5){
        // for (let element of array) {
        //     companyList.append(createComBlock(element));
        // }
        counter = counter + 1
        companyList.append(createComBlock(array[counter]))
    }
}

function createComBlock(company) {
    let item = document.getElementById('companyItem-template').cloneNode(true);
    item.querySelector('.company-name').innerHTML = company['name'];
    item.querySelector('.company-type').innerHTML = company['typeObject'];
    item.querySelector('.company-address').innerHTML = company['address'];
    item.querySelector('.company-admArea').innerHTML = company['admArea'];
    item.querySelector('.company-district').innerHTML = company['district'];
    item.querySelector('.company-discount').innerHTML = company['socialDiscount'];
    item.querySelector('.company-rating').innerHTML = company['rate']/20;
    item.setAttribute('id', company['id']);
    item.classList.remove('d-none');

    item.querySelector(".chooseButt").addEventListener('click', event => {createMenu(company['id'])} )
    item.classList.add("new"); //класс для последующего удаления в использовании фильтров
    return item;
}

function createComBlockforFilter(company) {
    console.log(maketOfDude);
    // let item = document.getElementById('companyItem-template').cloneNode(true);
    let item = maketOfDude.cloneNode(true);
    item.querySelector('.company-name').innerHTML = company['name'];
    item.querySelector('.company-type').innerHTML = company['typeObject'];
    item.querySelector('.company-address').innerHTML = company['address'];
    item.querySelector('.company-admArea').innerHTML = company['admArea'];
    item.querySelector('.company-district').innerHTML = company['district'];
    item.querySelector('.company-discount').innerHTML = company['socialDiscount'];
    item.querySelector('.company-rating').innerHTML = "Рейтинг " + company['rate']/20;
    item.setAttribute('id', company['id']);
    item.classList.remove('d-none');

    item.querySelector(".chooseButt").addEventListener('click', event => {createMenu(company['id'])} )
    item.classList.add("new"); //класс для последующего удаления в использовании фильтров
    console.log(item);
    return item;
}
function sortByR(array) { 
    array.sort()
    array.sort(function (a, b) {
        if (a.rate /20 < b.rate / 20) {
          return 1;
        }
        if (a.rate / 20 > b.rate / 20) {
          return -1;
        }
        return 0;
      });
}

function createMenu(id){
    // alert(id);
    let menu = document.getElementById('gal');
    menu.style.display = 'block';
    console.log(data);
    data.forEach(element => {
        if (element['id'] == id ){
            document.getElementById('set-1').innerHTML = element['set_1'] + " Р";
            document.getElementById('set-2').innerHTML = element['set_2'] + " Р";
            document.getElementById('set-3').innerHTML = element['set_3'] + " Р";
            document.getElementById('set-4').innerHTML = element['set_4'] + " Р";
            document.getElementById('set-5').innerHTML = element['set_5'] + " Р";
            document.getElementById('set-6').innerHTML = element['set_6'] + " Р";
            document.getElementById('set-7').innerHTML = element['set_7'] + " Р";
            document.getElementById('set-8').innerHTML = element['set_8'] + " Р";
            document.getElementById('set-9').innerHTML = element['set_9'] + " Р";
            document.getElementById('set-10').innerHTML = element['set_10'] + " Р";
            
        } 
    }); 

}

function addListenerFindBtn() {

    const divs = document.querySelectorAll('.poisk');
    divs.forEach(el => el.addEventListener('click', event => {
        var filter1 = document.getElementById("select");
        var area = filter1.options[filter1.selectedIndex].text;

        var filter2 = document.getElementById("selec");
        var district = filter2.options[filter2.selectedIndex].text;

        var filter3 = document.getElementById("sele");
        var type = filter3.options[filter3.selectedIndex].text;

        var filter4 = document.getElementById("sel");
        var discount = filter4.options[filter4.selectedIndex].text;

        sortArray(data, district, area, type, discount)
    }));
}

function sortArray(array, district, area, type, discount) {
    let companyList = document.querySelector('.company-list');
    // companyList.remove(".new");
    ///todo нужно очисть массив от прошлых данных companyList.remove()
    let activeCounter = 0// это счетчик именно элементов массива которые удовлетворяют сортировки
    let counter = 0// индек элемента в массиве
    companyList.innerHTML = "";
    while (activeCounter < 20 && counter < array.length - 2) {
        counter = counter + 1
        let current = array[counter + 1]
        // if (current['district'] == district
        //     && current['admArea'] == area
        //     && current['typeObject'] == type
        //     && current['socialDiscount'] == discount) {
        //     activeCounter = activeCounter + 1
        //     companyList.append(createComBlock(array[counter]))
        // }
        let point = 0



        console.log(current['district'], current['admArea'], current['typeObject'], current['socialDiscount'] );
        console.log(district, area, type, discount);

        if(district == "Не выбрано"){
            point = point + 1 
        }
        else{
            if(current['district'] == district) {
            point = point + 1
            }
        }
        if(area == "Не выбрано"){
            point = point + 1 
        }
        else{
            if(current['admArea'] == area) {
            point = point + 1
            }
        }
        if(type == "Не выбрано"){
            point = point + 1 
        }
        else{
            if(current['typeObject'] == type) {
            point = point + 1
            }
        }
        if(discount == "Не выбрано"){
            point = point + 1 
        }
        else{
            if(current['socialDiscount'] == discount) {
            point = point + 1
            }
        }

        if(point == 4){ 
            console.log(maketOfDude);
            activeCounter = activeCounter + 1
            companyList.append(createComBlockforFilter(array[counter + 1]))
            console.log("joopa")
        }
    }
}