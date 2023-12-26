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

    activateProduct(data) // Заполнение писка программ
    activateSelect2(data) // Заполнение формы поиска
    activateSearchForm(getGetParameters())
}

function getSkills(data) {
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

function activateProduct(data) {
    // Заполнение программ для аналогов
    let product_template = document.querySelector('.products-list__item')
    let insert_block = product_template.parentNode

    for (let prog of data.program) {
        let aap = product_template.cloneNode(true)
        
        // Подстановка названия продукта
        aap.querySelector('.product-name').innerHTML = prog.name
        // Подстановка описания программы
        aap.querySelector('.description').innerHTML = prog.description
        // Подстановка возмоностей
        let features = aap.querySelector('.features')
        for (let s of prog.features) {
            let ns = document.createElement('li')
            ns.innerHTML = data.skill.find((el) => (el.id == s)).name
            features.append(ns)
        }
        //  Подстановка ID
        aap.querySelector('.zv-f-src-id').innerHTML = prog.id

        // Вставка на страницу
        insert_block.append(aap)
    }
    
    product_template.parentNode.removeChild(product_template);
}

function getGetParameters() {
    var url = new URL(window.location.href);
    let getParam = {}
    url.searchParams.forEach(function (value, name) {
        if (name.indexOf("[]") >= 0) {
            let clearName = name.replace('[]','')
            if (!Object.hasOwn(getParam, clearName)) {
                getParam[clearName] = []
            }
            getParam[clearName].push(value)
        } else {
            getParam[name] = value
        }
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

function activateSearchForm(data) {
    if (Object.hasOwn(data, 'features')) {
        let features = document.querySelector('select.zv-select-features')
        for (let f of features.querySelectorAll('option')) {
            if (data.features.includes(f.value)) {
                f.selected = true
            }
        }
    }
    if (Object.hasOwn(data, 'country')) {
        let country = document.querySelector('select.zv-select-country')
        for (let f of country.querySelectorAll('option')) {
            if (data.country == f.value) {
                f.selected = true
            }
        }
    }
    if (Object.hasOwn(data, 'availability')) {
        let availability = document.querySelector('select.zv-select-availability')
        for (let f of availability.querySelectorAll('option')) {
            if (data.availability == f.value) {
                f.selected = true
            }
        }
    }
    if (Object.hasOwn(data, 'reestr')) {
        let reestr = document.querySelector('select.zv-select-reestr')
        for (let f of reestr.querySelectorAll('option')) {
            if (data.reestr == f.value) {
                f.selected = true
            }
        }
    }
}