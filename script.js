const calendar = document.getElementById('calendar');
const addCommitmentButton = document.getElementById('addCommitment');
const clearAllCommitmentsButton = document.getElementById('clearAllCommitments');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const commitmentInput = document.getElementById('commitment');
const progressBar = document.getElementById('progress');

// Configurando a data de início e fim corretamente
const startDate = new Date('2024-12-24T00:00:00Z'); // Ajuste para UTC
const endDate = new Date('2025-01-02T23:59:59Z'); // Ajuste para UTC

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

            // Criar botão de exclusão
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('deleteCommitment');
            deleteButton.onclick = function() {
                deleteCommitment(currentDate.toISOString().split('T')[0], commitment, commitmentDiv);
            };

            commitmentDiv.appendChild(deleteButton);
            dayDiv.appendChild(commitmentDiv);
        });

        calendar.appendChild(dayDiv);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Muda a data para o próximo dia
    }

    // Atualiza a barra de conquistas sempre que o calendário é gerado
    updateProgressBar();
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

            // Criar botão de exclusão
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('deleteCommitment');
            deleteButton.onclick = function() {
                deleteCommitment(selectedDate, formattedCommitment, commitmentDiv);
            };

            commitmentDiv.appendChild(deleteButton);
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

    // Atualiza o armazenamento local
    updateLocalStorage(commitment);

    // Atualiza a barra de conquistas
    updateProgressBar();
}

// Função para atualizar o localStorage
function updateLocalStorage(commitment) {
    const allCommitments = getAllCommitments(); // Recupera todas as tarefas

    // Atualiza a tarefa no localStorage
    const date = commitment.date; // Sincroniza com a data adequada
    const existingCommitments = JSON.parse(localStorage.getItem(date)) || [];
    const updatedCommitments = existingCommitments.map(c => c.text === commitment.text ? commitment : c);
    localStorage.setItem(date, JSON.stringify(updatedCommitments));
}

function updateProgressBar() {
    const allCommitments = getAllCommitments();

    const completedCount = allCommitments.filter(commitment => commitment.completed).length;
    const totalCount = allCommitments.length;

    // Calcula a porcentagem
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0; 
    progressBar.style.width = `${percentage}%`;
}

function getAllCommitments() {
    const allCommitments = [];
    for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
        const commitments = JSON.parse(localStorage.getItem(d.toISOString().split('T')[0])) || [];
        allCommitments.push(...commitments);
    }
    return allCommitments;
}

function deleteCommitment(date, commitment, commitmentDiv) {
    const existingCommitments = JSON.parse(localStorage.getItem(date)) || [];
    const updatedCommitments = existingCommitments.filter(c => c.text !== commitment.text); // Remove o compromisso
    localStorage.setItem(date, JSON.stringify(updatedCommitments)); // Atualiza o Local Storage

    // Remove apenas o compromisso do DOM
    commitmentDiv.remove(); 

    // Atualiza a barra de conquistas
    updateProgressBar();

    // Log para depuração
    console.log('Compromisso excluído:', commitment);
}

// Função para limpar todos os compromissos
function clearAllCommitments() {
    localStorage.clear(); // Limpa o localStorage
    generateCalendar(); // Regenera o calendário
    updateProgressBar(); // Reseta a barra
    console.log('Todos os compromissos foram removidos.');
}

// Adiciona os eventos de clique
clearAllCommitmentsButton.addEventListener('click', clearAllCommitments);
addCommitmentButton.addEventListener('click', addCommitment);

// Inicializa o calendário
generateCalendar();
