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

    activateProduct(data, getGetParameters()) // Заполнение писка программ
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

function activateProduct(data, searchParams) {
    // Заполнение программ для аналогов
    let product_template = document.querySelector('.products-list__item')
    let insert_block = product_template.parentNode

    // Ранжирование списка программ по поисковому запросу
    let mapPrograms = data.program.map((prog) => {
        prog.compliance = getDegreeCompliance(prog, searchParams)
        return prog
    })
    // Сортировка
    console.log('mapPrograms', mapPrograms)
    mapPrograms = mapPrograms.sort((a, b) => {
        let a_c = a.compliance.value / a.compliance.count
        let b_c = b.compliance.value / b.compliance.count
        return (a_c < b_c) ? 1 : -1
    })
    // Фильтрация нулевых совпаений
    mapPrograms = mapPrograms.filter((prog) => {
        return (prog.compliance.value != 0)
    })

    // Вывод сортированного списка
    for (let prog of mapPrograms) {
        let aap = product_template.cloneNode(true)
        
        // Подстановка названия продукта
        let procent = 100
        if (prog.compliance.count != 0) {
            procent = Math.round((prog.compliance.value / prog.compliance.count) * 100)
        }

        aap.querySelector('.product-name').innerHTML = `${prog.name} (${procent}%)`
        aap.querySelector('img').setAttribute('src', prog.logo)
        // Подстановка описания программы
        aap.querySelector('.description').innerHTML = prog.description
        // Подстановка возмоностей
        let features = aap.querySelector('.features')
        for (let s of prog.features) {
            let ns = document.createElement('li')

            let is_compliance = (prog.compliance.compliance.features.indexOf( s ) != -1) ? true : false
            if (is_compliance) {
                ns.style.fontWeight = "bold"
            }

            ns.innerHTML = data.skill.find((el) => (el.id == s)).name
            features.append(ns)
        }
        //  Подстановка ID
        aap.querySelector('.zv-f-src-id').innerHTML = prog.id
        // Подстановка значков
        if (prog.country == 0) {
            aap.querySelector(".tag-badge--sale").classList.remove('d-none')
        }
        if (prog.availability) {
            aap.querySelector(".tag-badge--new").classList.remove('d-none')
        }
        if (prog.reestr) {
            aap.querySelector(".tag-badge--hot").classList.remove('d-none')
        }
        // Подстановка URl
        aap.querySelector('.product-name').setAttribute('href', `product.html?id=${prog.id}`)
        aap.querySelector('.image__body').setAttribute('href', `product.html?id=${prog.id}`)

        // Вставка на страницу
        insert_block.append(aap)
    }
    
    product_template.parentNode.removeChild(product_template);
}

function getDegreeCompliance(prog, searchParams) {
    let degree = {
        count: 0,
        value: 0,
        compliance: {
            features: []
        }
    }

    if (Object.hasOwn(searchParams, 'features')) {
        let f = searchParams.features.map((el) => {return Number(el)})
        let c = getIntersection(f, prog.features)
        degree.compliance.features = c

        degree.count += f.length
        degree.value += c.length
    }
    if (Object.hasOwn(searchParams, 'country')) {
        if (searchParams.country != "none") {
            degree.count += 1
            if (Number(searchParams.country) == prog.country) {
                degree.value += 1
            }
        }
    }
    if (Object.hasOwn(searchParams, 'availability')) {
        if (searchParams.availability != "none") {
            degree.count += 1
            let av_bool = searchParams.availability 
            if (typeof searchParams.availability != "boolean") {
                av_bool = (searchParams.availability == "true") ? true : false
            }
            if (av_bool == prog.availability) {
                degree.value += 1
            }
        }
    }
    if (Object.hasOwn(searchParams, 'reestr')) {
        if (searchParams.reestr != "none") {
            degree.count += 1
            let r_bool = searchParams.reestr 
            if (typeof searchParams.reestr != "boolean") {
                r_bool = (searchParams.reestr == "true") ? true : false
            }
            if (r_bool == prog.reestr) {
                degree.value += 1
            }
        }
    }

    // console.log('getDegreeCompliance', degree)
    return degree
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
    // console.log('url getParam', getParam)
    return getParam
}

function getIntersection(a, b) {
    return a.filter(x => b.includes(x));
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