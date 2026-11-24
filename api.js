
const form = document.getElementById("formulario")
const cidadeInput = document.getElementById("cidades")
const pesquisar = document.getElementById("pesquisar")
const metricas = document.getElementById("metricas")

async function buscarClima(event) {

    event.preventDefault()

    const cidade = cidadeInput.value.trim()

    if (!cidade) {
        metricas.innerHTML = "Digite o nome de uma cidade!"
        return
    }

    pesquisar.disabled = true
    pesquisar.textContent = "Buscando..."
    metricas.innerHTML = "Consultando informações do clima..."

    try {


        const urlCidade = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`

        const respostaCidade = await fetch(urlCidade)

        console.log("Status da cidade:", respostaCidade.status)

        if (!respostaCidade.ok) {
            throw new Error("Erro ao pesquisar a cidade")
        }

        const dadosCidade = await respostaCidade.json()

        if (!dadosCidade.results || dadosCidade.results.length === 0) {
            metricas.innerHTML = "Cidade não encontrada!"
            return
        }

        const local = dadosCidade.results[0]


        const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`

        const respostaClima = await fetch(urlClima)

        console.log("Status do clima:", respostaClima.status)

        if (!respostaClima.ok) {
            throw new Error("Erro ao consultar o clima")
        }

        const dadosClima = await respostaClima.json()

        metricas.innerHTML = `
            <h2>${local.name}</h2>

            <p>Estado: ${local.admin1 || "Não informado"}</p>

            <p>País: ${local.country || "Não informado"}</p>

            <p>Temperatura: ${dadosClima.current.temperature_2m} °C</p>

            <p>Umidade: ${dadosClima.current.relative_humidity_2m}%</p>

            <p>Vento: ${dadosClima.current.wind_speed_10m} km/h</p>
        `

    } catch (erro) {

        metricas.innerHTML = "Não foi possível consultar o clima!"

        console.log("Erro:", erro)

    } finally {

        pesquisar.disabled = false
        pesquisar.textContent = "Pesquisar"

    }

}

form.addEventListener("submit", buscarClima)
