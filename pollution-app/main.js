    const apiKey = "590d02c4-b488-43ac-9d28-3775384ca7ae"
    const cityField = document.querySelector('#city')
    const countryField = document.querySelector('#country')
    const yourCurrentCityUrl = "https://api.airvisual.com/v2/nearest_city?key="+apiKey
    const mainUrl = "api.airvisual.com/v2/"
    const start = document.querySelector('.start')
    let chosenCityAQI
    let beijingAQI
    const pollutionLevelChosenCity = document.querySelector('.aqi')
    const pollutionLevelBeijing = document.querySelector('.beijing-aqi')
    const beijing = `http://api.airvisual.com/v2/city?city=Beijing&state=Beijing&country=China&key=${apiKey}`
    const chosenCityPollutionData = document.querySelector('.chosen-pollution-data')
    const beijingPollutionData = document.querySelector('.beijing-pollution-data')
    const convertFromCelsiusToFahrenheit = (celsius) => parseInt(celsius*1.8+32)
    const regexOnlyLetters = /^[a-zA-Z\s]*$/


    const validateInput = (input, regexVariable) => regexVariable.test(input)
   
    function comparePollutionLevels(placeOne, placeTwo, aqiPlaceOne, aqiPlaceTwo) {
        if (aqiPlaceOne > aqiPlaceTwo && aqiPlaceOne-aqiPlaceTwo !== 1){
            return `The AQI level in ${placeOne} is ${aqiPlaceOne-aqiPlaceTwo} AQI points higher than in ${placeTwo}.`
        }else if (aqiPlaceTwo > aqiPlaceOne && aqiPlaceTwo-aqiPlaceOne !== 1){
            return `The AQI level in ${placeTwo} is ${aqiPlaceTwo-aqiPlaceOne} AQI points higher than in ${placeOne}.`
        }else if (aqiPlaceOne-aqiPlaceTwo === 1){
            return `The AQI level in ${placeOne} is 1 AQI point higher than in ${placeTwo}.`
        }else if (aqiPlaceTwo-aqiPlaceOne === 1){
            return `The AQI level in ${placeTwo} is 1 AQI point higher than in ${placeOne}.`
        }
    }

    
    function pollutionLevelDescription(aqi){
        if (aqi <= 50){
            return 'Good: Air quality is satifactory and poses little or no risk. Ventilating your home is recommended.'
        } else if(aqi > 50 && aqi <= 100){
            return 'Moderate: Sensitive individuals should avoid outdoor activity as they may experience respiratory symptoms.'
        } else if (aqi > 100 && aqi <= 150){
            return 'Unhealthy for sensitive groups: General public and sensitive individuals in particular are at risk to experience irritation and respiratory problems.'
        } else if (aqi > 150 && aqi <= 200){
            return 'Unhealthy: Increased likelihood of adverse effects and aggravation to the heart and lungs amoung general public- particularly for sensitive groups.'
        } else if (aqi >200 && aqi <=300){
            return 'Very Unhealthy: General public will be noticeably affected. Sensitive groups will experience reduced endurance in activities. These individuals should remain indoors and restrict activities.'
        } else if (aqi > 300){
            return 'Hazardous: General Public and sensitive groups are at high risk to experience strong irritations and adverse health effects that could trigger other illnesses. Everyone should avoid exercise and remain indoors.'
        }
    }

    function pollutionBasedColorChanger(location, aqi){
        if (aqi <= 50){
            location.style.background = '#83d489'
        } else if(aqi > 50 && aqi <= 100){
            location.style.background = '#fbfc9f' 
        } else if (aqi > 100 && aqi <= 150){
            location.style.background = '#eb852d'
        } else if (aqi > 150 && aqi <= 200){
            location.style.background = '#ed3945'
            location.style.color = 'white'
        } else if (aqi > 300){
            location.style.background = 'black'
            location.style.color = 'white'
        }
    }

   
    //gradually shows fields relevent to app to minimize errors
    //checks default HTML offers drop down for US states, secondary drop down for Canada, other countries require an input text box
    function countrySelection(){
        if (countryField.value === 'USA'){
            document.querySelector('#state-wrap').innerHTML = '<select id="state"><option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option><option value="Arkansas">Arkansas</option><option value="California">California</option><option value="Colorado">Colorado</option><option value="Connecticut">Connecticut</option><option value="Delaware">Delaware</option><option value="Washington, D.C.">District Of Columbia</option><option value="Florida">Florida</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Idaho">Idaho</option><option value="Illinois">Illinois</option><option value="Indiana">Indiana</option><option value="Iowa">Iowa</option><option value="Kansas">Kansas</option><option value="Kentucky">Kentucky</option><option value="Louisiana">Louisiana</option><option value="Maine">Maine</option><option value="Maryland">Maryland</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Minnesota">Minnesota</option><option value="Mississippi">Mississippi</option><option value="Missouri">Missouri</option><option value="Montana">Montana</option><option value="Nebraska">Nebraska</option><option value="Nevada">Nevada</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="North Carolina">North Carolina</option><option value="North Dakota">North Dakota</option><option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Vermont">Vermont</option><option value="Virginia">Virginia</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option></select>'
        } else if (countryField.value === 'Canada'){
            document.querySelector('#state-wrap').innerHTML = '<select id="state"><option value="Alberta">Alberta</option><option value="British Columbia">British Columbia</option><option value="Manitoba">Manitoba</option><option value="New Brunswick">New Brunswick</option<option value="Newfoundland and Labrador">Newfoundland and Labrador</option><option value="Nova Scotia">Nova Scotia</option><option value="Ontario">Ontario</option><option value="Prince Edward Island">Prince Edward Island</option><option value="Quebec">Quebec</option><option value="Saskatchewan">Saskatchewan</option><option value="Northwest Territories">Northwest Territories</option><option value="Nunavut">Nunavut</option></select>'
        } else if(countryField.value !== 'Canada' && countryField.value !== 'USA'){
            document.querySelector('#state-wrap').innerHTML = '<input placeholder="State/Province/Territory" id="state" type="text">'
        }
    }
    
    //DOM malipulation functions for when the chosen city and Beijing url's are successfuly requested
    function setUISuccessAQI(parsedData){
        let chosenCityTempC = parsedData.data.current.weather.tp
        chosenCityAQI = parsedData.data.current.pollution.aqius
        document.querySelector('.aqi').innerHTML = chosenCityAQI
        document.querySelector('.celsius').innerHTML = chosenCityTempC
        document.querySelector('.fahrenheit').innerHTML = convertFromCelsiusToFahrenheit(chosenCityTempC)
    }

    function setUISuccessBeijingAQI (parsedData) {
        let beijingTempC = parsedData.data.current.weather.tp
        beijingAQI = parsedData.data.current.pollution.aqius
        document.querySelector('.beijing-aqi').innerHTML = beijingAQI
        document.querySelector('.celsius-beijing').innerHTML = beijingTempC
        document.querySelector('.fahrenheit-beijing').innerHTML = convertFromCelsiusToFahrenheit(beijingTempC)
    }

    //error handlers 
    const aqiUpdateUIError = (error) => console.log(error)
    function handleErrors (response) {
        
        if(!response.ok) throw(`${response.status}: ${response.text}`)
        return response.json()
    }

    //fetch functions for getting urls for Beijing(immediately called) and the city chosen by the user
    // DRY Need to practice more with promises and make a fetch request that uses promise.all with two requests 
    //to limit global variables 
    function createRequestBeijing(url, succeed, fail) {
        fetch(url)
            .then((response) => handleErrors(response))
            .then((data) => succeed(data))
            .catch((error) => fail(error))
    }
    createRequestBeijing(beijing, setUISuccessBeijingAQI, handleErrors)

    //similar, but guarentees createRequestBeijing runs first and adds data to the DOM only when all requests have been completed
    function createRequestChosenCity(url, succeed, fail) {
        fetch(url)
            .then((response) => handleErrors(response))
            .then((data) => succeed(data))
            .then(()=> {
                document.querySelector('.chosen-city').innerHTML = cityField.value
                document.querySelector('.beijing').innerHTML = 'Beijing'
                document.querySelector('.comparison-box').innerHTML =  comparePollutionLevels(cityField.value, 'Beijing', chosenCityAQI, beijingAQI) 
                document.querySelector('.chosen-pollution-description').innerHTML = pollutionLevelDescription(chosenCityAQI)
                document.querySelector('.beijing-pollution-description').innerHTML = pollutionLevelDescription(beijingAQI)
                pollutionBasedColorChanger(chosenCityPollutionData, chosenCityAQI)
                pollutionBasedColorChanger(beijingPollutionData, beijingAQI)
            })
            .catch((error) => fail(error))
    }

    function checkCompletion (){
        if (validateInput(cityField.value, regexOnlyLetters) === true &&
            validateInput(document.querySelector('#state').value, regexOnlyLetters) === true &&
            cityField.value !== '' &&
            document.querySelector('#state').value !== '' &&
            countryField.value !== ''){
                let cityRequest = `http://api.airvisual.com/v2/city?city=${cityField.value}&state=${document.querySelector('#state').value}&country=${countryField.value}&key=${apiKey}`
                createRequestChosenCity(cityRequest, setUISuccessAQI, aqiUpdateUIError)
        }
    }



    function shrinkCityForm(){
        document.querySelector('.app').style.gridTemplateRows = '.1em 5em 1fr 1fr 1fr 1fr'
        let mq = window.matchMedia('(max-width: 500px)') 
        if (mq.matches) document.querySelector('.app').style.gridTemplateRows = '.1em 3em 1fr 4em 3em 1fr 4em 1fr 3em'
        
    }

    //event handlers 
    countryField.addEventListener('click', countrySelection)
    countryField.addEventListener('click', () => document.querySelector('#state-wrap').style.visibility = 'visible', false)
    document.querySelector('#state-wrap').addEventListener('click', () => {
        if (document.querySelector('#country').value === 'USA' || document.querySelector('#country').value === 'Canada') {
            document.querySelector('#city').style.visibility = 'visible'
        }
    }, false)
    document.querySelector('#state-wrap').addEventListener('keydown', () => {
        if (document.querySelector('#country').value !== 'USA' && document.querySelector('#country').value !== 'Canada') {
            document.querySelector('#city').style.visibility = 'visible'
        }
    }, false)
    start.addEventListener('click', checkCompletion)
    start.addEventListener('click', () => {
        if (validateInput(cityField.value, regexOnlyLetters) === false ||
        validateInput(document.querySelector('#state').value, regexOnlyLetters) === false){
            alert('Please only enter letters and spaces!')
        }else if (cityField.value !== ''){
            hideShowByClassName('reveal', 'visible')
            hideShowByClassName('hide', 'hidden')
            shrinkCityForm()
        }else{
            alert('Please fill out all fields')
        }
    },false)
    document.querySelector('.restart').addEventListener('click', () => {
        location.reload()
    }, false) 





