async function verificarClima() {
    let key = "78fbcd3d73a22f94b6ab97865846d89c"
    let Local = document.querySelector(".inputText").value
    let inform = document.querySelector(".dados")

    if (Local === "") {
        inform.innerHTML = "<p>Por favor, digite uma cidade.</p>";
        return;
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
        <p class="umidade">Sensação térmica: ${dados.main.feels_like}°C <br> Umidade: ${dados.main.humidity}%</p>
        <button class="button-ia" onclick="PedirSugestaoRoupa()">Sugestão de roupa</button>
        <p class="resposta-ia"></p>
        `
    } catch (error) {
        inform.innerHTML = "<p>Cidade não encontrada. Tente novamente.</p>"
    }
}

function transcricao() {
    let voz = new window.webkitSpeechRecognition()
    voz.lang = "pt-BR"
    voz.start()

    voz.onresult = function (evento) {
        let textoTranscrito = evento.results[0][0].transcript
        const buscaLimpa = textoTranscrito.replace(/\./g, '');
        document.querySelector(".inputText").value = buscaLimpa;
        verificarClima()
    }
}

async function PedirSugestaoRoupa() {
    let temperaturaa = document.querySelector(".temp").textContent
    let umidade = document.querySelector(".umidade").textContent
    let cidade = document.querySelector(".titulo").textContent
    let keyIA = "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"

    let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + keyIA
        },
        body: JSON.stringify({
            "model": "openai/gpt-oss-120b",
            messages: [
                {
                    "role": "user",
                    "content": ` Me dê uma sugestão de qual roupa usar hoje, estou na cidade de ${cidade} na umidade é ${umidade} e a temperatura é de ${temperaturaa}, quero duas sugestoes em 2 frases curtas`
                }
            ],
        })


    })

    let dados = await resposta.json()
    document.querySelector(".resposta-ia").innerHTML = dados.choices[0].message.content

    console.log(dados)
}