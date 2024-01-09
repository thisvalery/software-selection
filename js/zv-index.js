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

    activateAnalog(data) // Заполнение программ для аналогов
    activateFeaturesProg(data) // Заполнение возможностей программ
    activateSelect2(data) // Заполнение формы поиска
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

function addAnalogProg(data) {
    let analog_prog_template = document.querySelector('.zv-analog-prog')
    let new_ap = analog_prog_template.cloneNode(true)

    new_ap.querySelector('.zv-p-src-analogs')
    new_ap.querySelector('.zv-p-src-product').innerHTML = data.name
    new_ap.querySelector('img').setAttribute('src', data.logo)

    for (let h of new_ap.querySelectorAll('[href]')) {
        h.setAttribute('href', `/product.html?id=${data.id}`)
        console.log('setAttribute', data.id, h)
    }
    
    // place_insertion.append(new_ap)
    // console.log('[addAnalogProg]', data, new_ap)
    return new_ap
}

function activateFeaturesProg(data) {
    let owlCarusel2 = $('#owl-carousel-2')

    for (let prog of data.skill) {
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

    new_ap.querySelector('.zv-f-src-id').innerHTML = data.id
    new_ap.querySelector('.zv-f-src-name').innerHTML = data.name
    new_ap.querySelector('.zv-f-src-name').setAttribute('href', `/search.html?features[]=${data.id}`)
    new_ap.querySelector('.zv-href-features').setAttribute('href', `/search.html?features[]=${data.id}`)

    return new_ap
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