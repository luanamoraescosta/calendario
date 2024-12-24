const calendar = document.getElementById('calendar');
const addCommitmentButton = document.getElementById('addCommitment');
const clearAllCommitmentsButton = document.getElementById('clearAllCommitments');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const commitmentInput = document.getElementById('commitment');

// Configurando a data de início e fim corretamente
const startDate = new Date('2024-12-24T00:00:00Z'); // Ajuste para UTC
const endDate = new Date('2025-01-13T23:59:59Z'); // Ajuste para UTC

function generateCalendar() {
    calendar.innerHTML = ''; // Limpa o calendário antes de gerar novamente
    let currentDate = new Date(startDate); // Inicia a data corretamente

    while (currentDate <= endDate) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        // Exibe o dia do mês corretamente
        dayDiv.innerHTML = `<strong>${currentDate.getUTCDate()}</strong>`;
        dayDiv.setAttribute('data-date', currentDate.toISOString().split('T')[0]);

        // Recuperar compromissos do Local Storage
        const commitments = JSON.parse(localStorage.getItem(currentDate.toISOString().split('T')[0])) || [];
        commitments.forEach(commitment => {
            const commitmentDiv = document.createElement('div');
            commitmentDiv.classList.add('commitment');
            commitmentDiv.textContent = commitment.text;

            // Criar botão de marcar como completo
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Completei';
            completeButton.onclick = function() {
                markAsComplete(commitment, commitmentDiv);
            };
            commitmentDiv.appendChild(completeButton);

            dayDiv.appendChild(commitmentDiv);
        });

        calendar.appendChild(dayDiv);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Muda a data para o próximo dia
    }
}

function addCommitment() {
    const selectedDate = dateInput.value; // Formato YYYY-MM-DD
    const selectedTime = timeInput.value; 
    const commitmentText = commitmentInput.value;

    // Valida se a data, hora e texto da tarefa estão preenchidos
    if (selectedDate && selectedTime && commitmentText) {
        const formattedCommitment = {
            text: `${selectedTime} - ${commitmentText}`, // Formato "hh:mm - Compromisso"
            completed: false // Campo para indicar se está completo
        };
        
        // Recupera compromissos existentes
        const existingCommitments = JSON.parse(localStorage.getItem(selectedDate)) || [];
        existingCommitments.push(formattedCommitment);
        localStorage.setItem(selectedDate, JSON.stringify(existingCommitments)); // Atualiza o Local Storage

        // Atualiza o calendário em tempo real
        const dayDiv = document.querySelector(`.day[data-date='${selectedDate}']`);

        if (dayDiv) { // Verifica se o dia foi encontrado
            const commitmentDiv = document.createElement('div');
            commitmentDiv.classList.add('commitment');
            commitmentDiv.textContent = formattedCommitment.text;

            // Criar botão de marcar como completo
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Completei';
            completeButton.onclick = function() {
                markAsComplete(formattedCommitment, commitmentDiv);
            };
            commitmentDiv.appendChild(completeButton);

            // Não adiciona mais o botão de exclusão
            dayDiv.appendChild(commitmentDiv);
        } else {
            console.error('Dia não encontrado no calendário para a data:', selectedDate);
        }

        // Limpar os campos de entrada
        commitmentInput.value = '';
        timeInput.value = ''; 
    } else {
        console.error('Por favor, preencha a data, horário e compromisso.');
    }
}
function markAsComplete(commitment, commitmentDiv) {
    commitment.completed = true;

    // Atualiza o visual para indicar que foi completado
    commitmentDiv.style.textDecoration = "line-through"; // Risca o texto
    commitmentDiv.style.color = "grey"; // Muda a cor para cinza

    // Adiciona o efeito de "estrela"
    createStarEffect(commitmentDiv);

    // Atualiza o armazenamento local
    updateLocalStorage(commitment);
}

function createStarEffect(commitmentDiv) {
    const starCount = 5; // Número de estrelas a serem mostradas
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Adiciona a estrela ao body
        document.body.appendChild(star);

        // Varia a posição horizontal e vertical
        star.style.left = `${50 + (Math.random() * 20 - 10)}%`;
        star.style.top = `${50 + (Math.random() * 20 - 10)}%`;

        // Remove a estrela após a animação
        star.addEventListener('animationend', () => {
            star.remove();
        });
    }

    // Criar a imagem adicional
    const img = document.createElement('img');
    img.src = 'photo.png.JPG'; // Nome do arquivo da imagem local
    img.style.position = 'fixed';
    img.style.left = '50%'; // Centralização horizontal
    img.style.top = '50%'; // Centralização vertical
    img.style.transform = 'translate(-50%, -50%)'; // Ajusta para o centro
    img.style.width = '100px'; // Ajuste o tamanho conforme necessário
    img.style.height = '100px'; // Ajuste o tamanho conforme necessário
    img.style.opacity = 0; // Começa invisível
    img.style.transition = 'opacity 1s'; // Efeito de transição de opacidade

    // Adiciona a imagem ao body
    document.body.appendChild(img);

    // Anima a imagem para aparecer
    requestAnimationFrame(() => {
        img.style.opacity = 1; // Efeitos de fade-in
    });
    
    // Remove a imagem após um tempo
    setTimeout(() => {
        img.remove();
    }, 3000); // Mantém a imagem visível por 3 segundos
}


function updateLocalStorage(commitment) {
    const allCommitments = getAllCommitments(); // Recupera todas as tarefas

    // Atualiza a tarefa no localStorage
    const date = commitment.date; // Sincroniza com a data adequada
    const existingCommitments = JSON.parse(localStorage.getItem(date)) || [];
    const updatedCommitments = existingCommitments.map(c => c.text === commitment.text ? commitment : c);
    localStorage.setItem(date, JSON.stringify(updatedCommitments));
}

function getAllCommitments() {
    const allCommitments = [];
    for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
        const commitments = JSON.parse(localStorage.getItem(d.toISOString().split('T')[0])) || [];
        allCommitments.push(...commitments);
    }
    return allCommitments;
}

// Função para limpar todos os compromissos
function clearAllCommitments() {
    localStorage.clear(); // Limpa o localStorage
    generateCalendar(); // Regenera o calendário
    console.log('Todos os compromissos foram removidos.');
}

// Adiciona os eventos de clique
clearAllCommitmentsButton.addEventListener('click', clearAllCommitments);
addCommitmentButton.addEventListener('click', addCommitment);

// Inicializa o calendário
generateCalendar();
