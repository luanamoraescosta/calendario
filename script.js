const calendar = document.getElementById('calendar');
const addCommitmentButton = document.getElementById('addCommitment');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const commitmentInput = document.getElementById('commitment');

// Configurando a data de início e fim corretamente
const startDate = new Date('2024-12-24T00:00:00Z'); // Ajuste para UTC para evitar problemas de fuso horário
const endDate = new Date('2025-01-02T23:59:59Z'); // Ajuste para UTC para evitar problemas de fuso horário

// Função para limpar o localStorage
function clearLocalStorage() {
 localStorage.clear();
 console.log('LocalStorage limpo.');
}

function generateCalendar() {
 calendar.innerHTML = ''; // Limpa o calendário antes de gerar novamente
 let currentDate = new Date(startDate); // Inicia a data corretamente

 while (currentDate <= endDate) {
 const dayDiv = document.createElement('div');
 dayDiv.classList.add('day');

 // Exibe o dia do mês corretamente
 dayDiv.innerHTML = `<strong>${currentDate.getUTCDate()}</strong>`; // Use getUTCDate para garantir a data correta
 dayDiv.setAttribute('data-date', currentDate.toISOString().split('T')[0]);

 // Recuperar compromissos do Local Storage
 const commitments = JSON.parse(localStorage.getItem(currentDate.toISOString().split('T')[0])) || [];
 commitments.forEach(commitment => {
 const commitmentDiv = document.createElement('div');
 commitmentDiv.classList.add('commitment');
 commitmentDiv.textContent = commitment;

 // Criar botão de exclusão
 const deleteButton = document.createElement('button');
 deleteButton.textContent = 'Excluir';
 deleteButton.classList.add('deleteCommitment');
 deleteButton.onclick = function() {
 deleteCommitment(currentDate.toISOString().split('T')[0], commitment, commitmentDiv); // Passa a data e o div do compromisso
 };

 commitmentDiv.appendChild(deleteButton);
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
 const formattedCommitment = `${selectedTime} - ${commitmentText}`; // Formato "hh:mm - Compromisso"
 
 // Recupera compromissos existentes
 const existingCommitments = JSON.parse(localStorage.getItem(selectedDate)) || [];
 existingCommitments.push(formattedCommitment);
 localStorage.setItem(selectedDate, JSON.stringify(existingCommitments)); // Atualiza o Local Storage

 // Atualiza o calendário em tempo real
 const dayDiv = document.querySelector(`.day[data-date='${selectedDate}']`);

 if (dayDiv) { // Verifica se o dia foi encontrado
 const commitmentDiv = document.createElement('div');
 commitmentDiv.classList.add('commitment');
 commitmentDiv.textContent = formattedCommitment; 

 // Criar botão de exclusão
 const deleteButton = document.createElement('button');
 deleteButton.textContent = 'Excluir';
 deleteButton.classList.add('deleteCommitment');
 deleteButton.onclick = function() {
 deleteCommitment(selectedDate, formattedCommitment, commitmentDiv); // Passa a data e o div do compromisso
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

function deleteCommitment(date, commitment, commitmentDiv) {
 // Atualiza o Local Storage
 const existingCommitments = JSON.parse(localStorage.getItem(date)) || [];
 const updatedCommitments = existingCommitments.filter(c => c !== commitment); // Remove o compromisso
 localStorage.setItem(date, JSON.stringify(updatedCommitments)); // Atualiza o Local Storage

 // Remove apenas o compromisso do DOM
 commitmentDiv.remove(); 

 // Log para depuração
 console.log('Compromisso excluído:', commitment);
 console.log('Compromissos atualizados no Local Storage:', updatedCommitments);
}

// Limpar o localStorage antes de iniciar o calendário
clearLocalStorage();

// Inicializa o calendário
addCommitmentButton.addEventListener('click', addCommitment);
generateCalendar();
