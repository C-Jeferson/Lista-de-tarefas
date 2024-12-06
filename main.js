let linhas = 0; // Usado para IDs únicos
let tarefas = 0; // Quantidade de tarefas
let tarefaEditando = null; // Indica se estamos editando uma tarefa

$(document).ready(function(){
    // Botão adicionar tarefas
    $('footer button').click(function(){
        $('footer').slideUp()
        $('form').slideDown()
        $('#addTarefa').focus()
    })

    //botão de cancelar
    $('#cancelar').click(function(){
        $('footer').slideDown()
        $('form').slideUp()
        tarefaEditando = null;
        $('#confirmar').html('Adicionar')
    })

    // Função para formatar a data
    function formatarDataAtual() {
        const dataAtual = new Date();
        const diasSemana = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SABADO'];
        const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];

        const diaSemana = diasSemana[dataAtual.getDay()];
        const dia = dataAtual.getDate();
        const mesAtual = meses[dataAtual.getMonth()];

        return `${diaSemana} ${dia} ${mesAtual}`;
    }
    $('header div').html(formatarDataAtual());

    // Submissão do formulário para adicionar ou editar tarefa
    $('form').on('submit', function(e){ 
        e.preventDefault()
        const adicionarTarefa = $("#addTarefa").val().trim()

        if (!adicionarTarefa) return // Evitar tarefas vazias

        if (tarefaEditando){
            tarefaEditando.text(adicionarTarefa); //adiciona o texto da tarefa editado
        } else {  //criar uma nova tarefa
            const novoItem = $("<ul></ul>")
            $(`<li> 
                <input type="checkbox" id="rond${linhas}">
                <label title="Marque como concluída" for="rond${linhas}"></label>
            </li>
            `).appendTo(novoItem)
        
            const textoTarefa = $(`<li class="editar">${adicionarTarefa}</li>`);
            textoTarefa.appendTo(novoItem);

            $(`<li title="Deletar" class="botão-excluir"> -</li>`).appendTo(novoItem)
            
            $(novoItem).appendTo('main')
            $('#addTarefa').val('')
            $('#addTarefa').focus()

            $(novoItem.find('.botão-excluir')).click(function(){ // deleta tarefas
                novoItem.remove()
                tarefas--;
                atualizar() // sincroniza em tempo real
            })

            textoTarefa.click(function () { // clicar na tarefa para editar
                $('#confirmar').html('Editar')
                $('#addTarefa').val(textoTarefa.text());
                $('footer').slideUp();
                $('form').slideDown();
                $('#addTarefa').focus()
                tarefaEditando = textoTarefa;
            });

            $(`#rond${linhas}`).click(function(){ //sistema de tarefas concluidas ✔
                $ (this).prop('checked') ? $(textoTarefa).css('text-decoration', 'line-through') : $(textoTarefa).css('text-decoration', 'none')
                atualizar()
            })
    
            linhas++
            tarefas++
            atualizar()
        }  
    })

    function atualizar() {
        const concluidos = $('input[type="checkbox"]:checked').length;
        const progresso = tarefas > 0 ? (concluidos / tarefas) * 100 : 0 // Evitar NaN verificando se tarefas é 0

        $('#progresso').css({
            width: `${progresso}%`
        });
        
        $('#texto-progresso').html(`${Math.round(Number(progresso))}%`);
    }
})
