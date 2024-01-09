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
    activateFeaturesProg(data) // Заполнение похожих программ
    // activateSelect2(data) // Заполнение формы поиска
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

    // Подстановка изображений
    let arr_imgs_500 = document.querySelectorAll('.zv-img500')
    for (let i = 0; i < arr_imgs_500.length; i++) {
        const img_500 = arr_imgs_500[i];
        if (i == 0) {
            img_500.querySelector('img').setAttribute('src', product.logo)
        } else {
            img_500.querySelector('img').setAttribute('src', product.imgs[i-1])
        }
    }
    let arr_imgs_70 = document.querySelectorAll('.zv-img70')
    for (let i = 0; i < arr_imgs_70.length; i++) {
        const img_70 = arr_imgs_70[i];
        if (i == 0) {
            img_70.querySelector('img').setAttribute('src', product.logo)
        } else {
            img_70.querySelector('img').setAttribute('src', product.imgs[i-1])
        }
    }
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

function getIntersection(a, b) {
    return a.filter(x => b.includes(x));
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
            let av_bool = (searchParams.availability == "true") ? true : false
            if (av_bool == prog.availability) {
                degree.value += 1
            }
        }
    }
    if (Object.hasOwn(searchParams, 'reestr')) {
        if (searchParams.reestr != "none") {
            degree.count += 1
            let r_bool = (searchParams.reestr == "true") ? true : false
            if (r_bool == prog.reestr) {
                degree.value += 1
            }
        }
    }

    // console.log('getDegreeCompliance', degree)
    return degree
}

function activateFeaturesProg(data) {
    let owlCarusel2 = $('#owl-carousel-2')

    let getId = getGetParameters().id
    let product = data.program.find(function (el) {
        return (el.id == getId)
    })

    // Ранжирование списка программ по поисковому запросу
    let mapPrograms = data.program.map((prog) => {
        prog.compliance = getDegreeCompliance(prog, product)
        return prog
    })
    // Сортировка
    console.log('mapPrograms', mapPrograms)
    mapPrograms = mapPrograms.sort((a, b) => {
        let a_c = a.compliance.value / a.compliance.count
        let b_c = b.compliance.value / b.compliance.count
        return (a_c < b_c) ? 1 : -1
    })
    // Фильтрация маленьких значений соответствич
    mapPrograms = mapPrograms.filter((el) => {
        let procent = 1
        if (el.compliance.count != 0) {
            procent = (el.compliance.value / el.compliance.count)
        }
        return (procent > 0.6)
    })

    for (let prog of mapPrograms) {
        let aap = addFeaturesProg(prog)
        owlCarusel2.trigger('add.owl.carousel', aap)
        // place_insertion.append(aap)
    }
    owlCarusel2.trigger('remove.owl.carousel', [0]) // Удалить первый шаблонный элемент карусели
    owlCarusel2.trigger('refresh.owl.carousel') // Обновить корусель
}

function addFeaturesProg(data) {
    let analog_prog_template = document.querySelector('.zv-features-prog')
    let new_ap = analog_prog_template.cloneNode(true)

    // Подстановка названия продукта
    let procent = 100
    if (data.compliance.count != 0) {
        procent = Math.round((data.compliance.value / data.compliance.count) * 100)
    }

    new_ap.querySelector('.zv-f-src-id').innerHTML = data.id
    new_ap.querySelector('.zv-f-src-name').innerHTML = `${data.name} (${procent}%)`
    new_ap.querySelector('.zv-f-src-name').setAttribute('href', `/product.html?id=${data.id}`)
    new_ap.querySelector('.image__body').setAttribute('href', `/product.html?id=${data.id}`)
    new_ap.querySelector('img').setAttribute('src', data.logo)
    
    if (data.country == 0) {
        new_ap.querySelector(".tag-badge--sale").classList.remove('d-none')
    }
    if (data.availability) {
        new_ap.querySelector(".tag-badge--new").classList.remove('d-none')
    }
    if (data.reestr) {
        new_ap.querySelector(".tag-badge--hot").classList.remove('d-none')
    }

    return new_ap
}