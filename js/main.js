const resultado = document.querySelector("#resultado");
const container = document.querySelector(".container");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", ()=>{
    formulario.addEventListener("submit", buscarClima)
})

function buscarClima(e){
    e.preventDefault();
    
    //validar
    const ciudad = document.querySelector("#ciudad").value 
    const pais = document.querySelector('#pais').value

    if(ciudad === "" || pais === ""){
        mostrarError("Ambos campos son obligatorios");
        return;
    }

    // Consultar la API
    consultarAPI(ciudad, pais);
    
}

function mostrarError(mensaje){
    console.log(mensaje);

    const alerta = document.querySelector('.alert');
    if(!alerta){       
        //Crear una alerta
        
        const alerta = document.createElement("div");
        alerta.classList.add('alert');
        
        alerta.innerHTML = `
        <strong >
        Error!
        </strong>
        <span >
        ${mensaje}
        </span>
        `;
        container.appendChild(alerta);

        //Eliminando la alerta pasado 5 segundos
        setTimeout(()=>{
            alerta.remove();
        },5000);
    }
}

function consultarAPI(ciudad, pais){
    const appId = "85a0dab7b8ec0efd038dc0029e127cc2";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    spinner();

    fetch(url)
        .then(res=>res.json())
        .then(resJSON =>{
            limpiarHTML();
            if(resJSON.cod === "404"){
                mostrarError("Ciudad no encontrada");
            }
            //Mostrar la respuesta HTML
            mostrarClima(resJSON);
        })
}
function mostrarClima(datos){
    const {name, main:{temp, temp_max, temp_min}} = datos;

    const centigrados = kelvinCentigrados(temp);
    const max = kelvinCentigrados(temp_max);
    const min = kelvinCentigrados(temp_min);

    const nombreCiudad = document.createElement("p");
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add("nameCity");

    const tempMax = document.createElement("p");
    tempMax.innerHTML= `Max: ${max} &#8451`;
    tempMax.classList.add("max");

    const tempMin = document.createElement("p");
    tempMin.innerHTML= `Min: ${min} &#8451`;
    tempMin.classList.add("min");
    
    const actual = document.createElement("p");
    actual.innerHTML= `${centigrados} &#8451`;
    actual.classList.add("temp");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);

}

const kelvinCentigrados = grados=> parseInt(grados - 273.15);

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner(){
    limpiarHTML();
    const divSpinner = document.createElement("div");
    divSpinner.classList.add("spinner");

    divSpinner.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `;

    resultado.appendChild(divSpinner);
}