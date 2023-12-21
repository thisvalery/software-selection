console.log('[zv.js]')

let jsonFetch = fetch('js/data.json')

let fToJson = jsonFetch.then(function (fetchRes) {
    console.log('[zv.js] fetchRes', fetchRes)
    return fetchRes.json()
})

fToJson.then(function (resJson) {
    console.log('[zv.js] resJson', resJson)
    setDataPage(resJson)
})

function setDataPage(data) {
    console.log('[setDataPage]', data)

    activateProduct(data) // Заполнение программ для аналогов
    // activateFeaturesProg(data) // Заполнение возможностей программ
    activateSelect2(data) // Заполнение формы поиска
}

function activateProduct(data) {
    let getId = getGetParameters().id
    let product = data.program.find(function (el) {
        return (el.id == getId)
    })
    console.log('product', product)

    // Подстановка названия программы
    document.querySelector('.product__title').innerHTML = product.name

    // Подстановка возможностей
    let skill = document.querySelector('#skill')

    for (let s of product.features) {
        let ns = document.createElement('li')
        ns.innerHTML = data.skill.find((el) => (el.id == s)).name
        skill.append(ns)
    }

    // Подстановка описания
    let description = document.querySelector('#description')
    description.innerHTML = product.description

    // Заполнение системных требований
    let system_requirements = document.querySelector('.spec__section')
    system_requirements.innerHTML = product.system_requirements

    // Заполнение стоимости
    let cost = document.querySelector('#product-tab-reviews') 
    cost.innerHTML = product.cost
}

function activateAnalog(data) {
    // Заполнение программ для аналогов
    let owlCarusel = $('#owl-carousel-1')

    for (let prog of data.program) {
        let aap = addAnalogProg(prog)
        owlCarusel.trigger('add.owl.carousel', aap)
        // place_insertion.append(aap)
    }
    owlCarusel.trigger('remove.owl.carousel', [0]) // Удалить первый шаблонный элемент карусели
    owlCarusel.trigger('refresh.owl.carousel') // Обновить корусель
}

function getGetParameters() {
    var url = new URL(window.location.href);
    let getParam = {}
    url.searchParams.forEach(function (value, name) {
        getParam[name] = value
    })
    console.log('url getParam', getParam)
    return getParam
}

function activateSelect2(data) {
    console.log('activateSelect2', data)

    let features = document.querySelector('.zv-select-features')
    for (let c of data.skill) {
        let new_c = document.createElement('option')
        new_c.setAttribute('value', c.id)
        new_c.innerHTML = c.name
        features.append(new_c)
    }
    
    let country = document.querySelector('.zv-select-country')
    for (let c of data.country) {
        let new_c = document.createElement('option')
        new_c.setAttribute('value', c.id)
        new_c.innerHTML = c.name
        country.append(new_c)
    }
    
    /*
    // select2
    */
    $(function () {
        $('.form-control-select2, .block-finder__form-control--select select').select2({width: ''});
    });
}