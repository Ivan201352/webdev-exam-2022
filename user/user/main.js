window.onload = function () {
    downloadData()
    let menuButt = document.querySelectorAll('.menuButt');
    menuButt.forEach(function (btn) {
        btn.addEventListener('click', setFunk)
    })

    //let choseBut = document.querySelector(".choseBut")
    //choseBut.addEventListener("click", createMenu)
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
    // alert(oper);
}

function downloadData() {
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

function GETSpisok(array) {
    let companyList = document.querySelector('.company-list');
    let counter = 0
    sortByR(array);
    while (counter < 20){
        counter = counter + 1
        companyList.append(createELEMENTS(array[counter]))
    }
}

function createELEMENTS(company) {
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