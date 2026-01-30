
async function verificarClima() {
    let key = "78fbcd3d73a22f94b6ab97865846d89c"
    let Local = document.querySelector(".inputText").value
    let inform = document.querySelector(".dados")

    if (Local === "") {
        inform.innerHTML = "<p>Por favor, digite uma cidade.</p>";
        return; // Para a execução aqui mesmo
    }

    try {
        let verificacaoClima = `https://api.openweathermap.org/data/2.5/weather?q=${Local}&appid=${key}&units=metric&lang=pt_br`
        let resposta = await fetch(verificacaoClima)

        if (!resposta.ok) {
            throw new Error("Cidade inexistente");
        }
        
        let dados = await resposta.json()
        let clima = dados.weather[0].icon

        inform.innerHTML =
        `
        <h3 class="titulo">Clima em ${dados.name}</h3>
        <div class="graus">
            <p class="temp">${dados.main.temp}°C</p>
            <img src="https://openweathermap.org/img/wn/${clima}.png ">
        </div>
        
        <p>Sensação térmica: ${dados.main.feels_like} <br> Umidade: ${dados.main.humidity}%</p>
        `
    } catch (error) {
        inform.innerHTML = "<p>Cidade não encontrada. Tente novamente.</p>"
    }
}