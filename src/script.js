let containerBettwen = document.getElementById('containerBettwen')
let tabLetreco = document.getElementById('containerDivTab');
let tabTeclado = document.getElementById('containerDivTec');
let body = document.getElementById('body');
body.classList.add('flex', 'justify-center', 'flex-col', 'items-center', 'bg-zinc-300')

let keyboards = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
["a", "s", "d", "f", "g", "h", "j", "k", "l"],
["z", "x", "c", "v", "b", "n", "m"]/*, ['<-', 'ENTER']*/]

let colunas = 5;
let linhas = 6;

let palavraSorteada = ''
let palavraNormal = ''
let palavraJoin = '';
let palavracomacento = ''
let final = false

let setLinha = 0
let setColuna = 0

async function carregarPalavras() {
    const response = await fetch('./src/palavras.txt');
    const data = await response.text();
    const palavras = data.split('\n').filter(p => p.length === 5 && !p.includes('-'))
    palavraNormal = palavras
    return palavras;
}

async function gerarPalavra() {
    const palavrasCincoLetras = await carregarPalavras();
    if (palavrasCincoLetras.length === 0) {
        console.log('Não há palavras com 5 letras no arquivo.');
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * palavrasCincoLetras.length);
    const palavraSelecionada = palavrasCincoLetras[indiceAleatorio];

    palavracomacento = palavraSelecionada

    palavraSorteada = palavraSelecionada
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    console.log(`Palavra sorteada (sem acentos): ${palavraSorteada}`);
    console.log(`Palavra sorteada (com acentos): ${palavracomacento}`);
}

gerarPalavra();

for (let linha = 0; linha < linhas; linha++) {

    let linhaDiv = document.createElement('div');
    linhaDiv.classList.add('flex');

    for (let coluna = 0; coluna < colunas; coluna++) {

        let blocosColunas = document.createElement('div');
        blocosColunas.classList.add('flex', 'items-center', 'text-zinc-600', 'justify-center', 'bg-zinc-400', 'bg-opacity-40', 'm-1',
            'w-14', 'h-14', 'border-4', 'border-neutral-400', 'p-7', 'rounded-lg', 'text-lg');

        if (linha === 0) {
            blocosColunas.classList.remove('border-neutral-400')
            blocosColunas.classList.add('border-blue-500');
        }
        blocosColunas.id = `l${linha}c${coluna}`
        linhaDiv.appendChild(blocosColunas);
    }
    tabLetreco.appendChild(linhaDiv);
}

function mudarCor() {
    const blinkDuration = 900; // Duração total do piscar em ms
    const blinkInterval = 100;   // Intervalo entre as trocas de cor em ms
    const setColorElements = [];  // Armazena os elementos a serem piscados
    let count = 0;                // Contador para controlar quantas vezes piscar

    // Adiciona todos os elementos ao array
    for (let i = 0; i < 5; i++) {
        setColorElements.push(document.getElementById(`l${setLinha}c${i}`));
    }

    // Define um intervalo para mudar a cor
    const interval = setInterval(() => {
        setColorElements.forEach((element) => {
            element.classList.toggle('border-red-400');
            element.classList.toggle('bg-red-400');
            element.classList.toggle('border-blue-500');
        });
        count++;

        // Para o piscar após 2 vezes
        if (count >= 6) {
            clearInterval(interval);
            // Reverte para a cor original
            setColorElements.forEach((element) => {
                element.classList.remove('border-red-400', 'bg-red-400');
                element.classList.add('border-blue-500');
            });
        }
    }, blinkInterval);
}


const eventteclas = (event) => {
    if (setLinha < 6 && setColuna < 5) {
        let getTeclas = document.getElementById(`l${setLinha}c${setColuna}`)
        getTeclas.textContent = event.target.textContent;
        setColuna++
    }
}

const backspaceEvent = () => {
    if (setColuna > 0 && setLinha < 6) {
        setColuna--
        let backspace = document.getElementById(`l${setLinha}c${setColuna}`)
        backspace.textContent = ''
    }
}

const validarPalavras = () => {
    palavraJoin = ''

    for (let i = 0; i < 5; i++) {

        let very = document.getElementById(`l${setLinha}c${i}`)
        let veryOut = very.textContent.toLowerCase()
        palavraJoin += veryOut
    }

    return palavraJoin
}

function mostrarModal(txt, exibir) {
    const modal = document.getElementById('modal');
    const img = document.getElementById('imgmodal');
    const palavracerta = document.getElementById('palavracerta');
    const exibirpalavra = document.getElementById('exibirpalavra');
    exibirpalavra.classList.add(exibir)
    img.src = txt
    modal.classList.remove('hidden'); // Mostra o modal
    modal.classList.add('flex'); // Mostra o modal

    palavracerta.textContent = palavracomacento.toUpperCase()

    // Fecha o modal quando o botão de fechar é clicado
    const closeButton = document.getElementById('closeModal');
    const reload = document.getElementById('recarregar');

    reload.addEventListener('click', () => {
        location.reload();
    })
    closeButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}


const enterEvent = () => {

    let valor = validarPalavras();
    let trueorfalse = false

    if (setColuna > 4) {
        setColuna = 4;
    }
    if (setLinha > 4) {
        setLinha = 5;
        final = true;
    }

    let very = document.getElementById(`l${setLinha}c${setColuna}`);

    if (very.textContent == "") {
        mudarCor()
        return
    }

    if (setLinha < 6 && very.textContent !== "") {

        for (let i = 0; i < palavraNormal.length; i++) {
            let out = palavraNormal[i]
            let out1 = out
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            if (out1 === valor) {
                trueorfalse = true;

                for (let i = 0; i < 5; i++) {
                    let setColor = document.getElementById(`l${setLinha}c${i}`);
                    setColor.textContent = out.charAt(i).toUpperCase()
                }
            }
        }
        if (trueorfalse == false) {
            setColuna = 5;
            mudarCor()
            return
        }
        if (trueorfalse == false && setLinha > 4) {
            setLinha = 4;
        }
    }

    if (setLinha < 6 && very.textContent !== "" && trueorfalse == true) {

        let resultado = [];
        let letrasJaUsadas = {};

        // Copiando a palavra sorteada para evitar mudanças na comparação
        let palavraTemp = [...palavraSorteada];

        // Primeira passada: marca verde para as letras que estão na posição correta
        for (let i = 0; i < 5; i++) {
            let setColor = document.getElementById(`l${setLinha}c${i}`);
            let letraAtual = setColor.textContent.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            if (letraAtual === palavraSorteada[i]) {
                resultado.push({ letra: letraAtual, cor: "verde" });
                letrasJaUsadas[letraAtual] = (letrasJaUsadas[letraAtual] || 0) + 1;
                palavraTemp[i] = null; // Marca como usada para evitar contar novamente
                setColor.classList.remove('bg-zinc-400', 'text-zinc-600', 'bg-opacity-40');
                setColor.classList.add('bg-green-500', 'text-white', 'bg-opacity-60');
            } else {
                resultado.push({ letra: letraAtual, cor: "pendente" });
            }
        }

        // Segunda passada: marca amarelo para as letras que estão presentes, mas em posição errada
        for (let i = 0; i < 5; i++) {
            let setColor = document.getElementById(`l${setLinha}c${i}`);
            let letraAtual = setColor.textContent.toLowerCase();

            if (resultado[i].cor === "pendente") {
                let posicaoErrada = palavraTemp.indexOf(letraAtual);

                if (posicaoErrada !== -1) {
                    resultado[i].cor = "amarelo";
                    palavraTemp[posicaoErrada] = null; // Marca a posição como usada
                    setColor.classList.remove('bg-zinc-400', 'text-zinc-600', 'bg-opacity-40');
                    setColor.classList.add('bg-yellow-500', 'text-gray-200', 'bg-opacity-50');
                } else {
                    resultado[i].cor = "cinza";
                    setColor.classList.remove('bg-zinc-400', 'text-zinc-600', 'bg-opacity-40');
                    setColor.classList.add('bg-gray-600', 'text-white', 'bg-opacity-50');
                }
            }
        }

        // Verifica se o jogador ganhou
        const todasVerdes = resultado.every(item => item.cor === "verde");
        if (todasVerdes) {
            mostrarModal('./src/ganhou.png', 'bg-green-500')
        }

        if (setLinha > 4 && todasVerdes !== true) {

            mostrarModal('./src/perdeu.png', 'bg-red-500')
        }

        // Avança a linha
        setLinha++;
        setColuna = 0;

        // Ajuste de bordas
        if (setLinha < 6 && todasVerdes !== true) {
            for (let i = 0; i < colunas; i++) {
                let setColor = document.getElementById(`l${setLinha - 1}c${i}`);
                setColor.classList.add('border-neutral-500');
                setColor.classList.remove('border-blue-500');
            }

            for (let i = 0; i < colunas; i++) {
                let setColor = document.getElementById(`l${setLinha}c${i}`);
                setColor.classList.remove('border-neutral-400');
                setColor.classList.add('border-blue-500');
            }
        } else {
            for (let i = 0; i < colunas; i++) {
                let setColor = document.getElementById(`l${setLinha - 1}c${i}`);
                setColor.classList.add('border-neutral-500');
                setColor.classList.remove('border-blue-500');
            }
        }
    }
}

function contarLetras(palavra, letra) {
    return palavra.split(letra).length - 1;
}

for (let linha = 0; linha < keyboards.length; linha++) {

    let linhaDivTec = document.createElement('div');

    for (let coluna = 0; coluna < keyboards[linha].length; coluna++) {

        let blocosColunasTec = document.createElement('button');
        blocosColunasTec.classList.add('bg-blue-500', 'm-1',
            'h-[50px]', 'text-white', 'shadow-sm', 'w-full', 'max-w-10', 'rounded-lg', 'sm:hover:-translate-y-1', 'outline-none');

        blocosColunasTec.textContent = keyboards[linha][coluna].toLocaleUpperCase()

        blocosColunasTec.id = `lt${linha}ct${coluna}`
        if ((linha !== 3) && (linha !== 3)) {
            blocosColunasTec.addEventListener('click', eventteclas)
        }

        tabTeclado.classList.add('mt-8', 'flex-col', 'px-3', 'flex', 'items-center', 'w-full')
        linhaDivTec.classList.add('flex', 'items-center', 'justify-center', 'w-full', 'max-w-[430px]', 'sm:max-w-[600px]')
        linhaDivTec.appendChild(blocosColunasTec);
        tabTeclado.appendChild(linhaDivTec);
    }
    if (linha == 1) {
        let buttonBackspace = document.createElement('button');
        buttonBackspace.textContent = '<-'
        buttonBackspace.classList.add('bg-blue-500', 'text-white', 'hover:-translate-y-1',
            'h-[50px]', 'w-[10px]', 'min-w-14', 'mr-1', 'ml-1', 'rounded-lg', 'border', 'border-blue-500')
        buttonBackspace.addEventListener('click', backspaceEvent)
        linhaDivTec.appendChild(buttonBackspace);
    }
    if (linha == 2) {
        let buttonAdicionais = document.createElement('button');
        buttonAdicionais.textContent = 'ENTER'
        buttonAdicionais.addEventListener('click', enterEvent)
        //linhaDivTec.classList.add('')
        buttonAdicionais.classList.add('bg-blue-500', 'text-white', 'hover:-translate-y-1',
            'h-[50px]', 'w-[70px]', 'min-w-20', 'mr-1', 'ml-1', 'rounded-lg', 'border', 'border-blue-500',)
        linhaDivTec.appendChild(buttonAdicionais);
    }
    if (linha == 0) {
        //linhaDivTec.classList.add('sm:-translate-x-10', 'sm:pl-8')
    }
}