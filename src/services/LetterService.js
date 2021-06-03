export default class LetterService {
    
    static getLetterTipByLetterId(id) {
        const tips = [
            '',
            'Gosto muito de dançar e ouvir músicas, mas tenho medo de um rapaz que fica lá.',
            'Ainda estou procurando uma folha que caiu, acho que perdi quando fui no quarto VI.',
            'Conheci esse lugar por meio de uma amiga, ela trabalha aqui faz um ano, mas ela sumiu recentemente.',
            'Acho que o banheiro é o único lugar que estou me sentindo segura.',
            'Um louco no armazém queria arrancar meu diário a força para ler minhas coisas, ele falava sobre alguma possível investigação.',
            'Amo as fontes perto da sala da presidência, elas me deixam mais calmas.',
            'Gosto de ficar vendo as pessoas cozinhando, tenho uma cadeira no cantinho da cozinha.',
            'A sala da presidência é muito grande, hoje entrei lá escondida, mais tive que fugir quando vi alguém chegando.',
            'Um cozinheiro me viu escrevendo e pediu um pedaço dos meus escritos para colar na cozinha, que fofo.',
            'Vi algo muito suspeito na garagem hoje, parecia que um homem enforcava alguém, não tenho certeza, estou com medo.',
            'Tive uma amiga que ficava no quarto I, mas o quarto dela está trancado a dias, não sei o que houve, preciso pegar minhas folhas.',
            'Os hóspedes estão estranhos, hoje ouvi alguém chorando no quarto IV, mas quando voltei lá, não tinha ninguém.',
            'A moça da recepção me avisou que achou um pedaço do meu diário, mas faz dias que ela não aparece para eu ir buscar.',
            'Estou com muito medo, meu carro hoje apareceu todo arranhado, não é mais seguro deixá-lo na garagem II.',
            'Posso está ficando louca, mas acho que vi uma mão boiando nas fontes próximas a garagem.',
            'Hoje tive que fugir correndo da cozinha, aquele rapaz que tenho medo entrou lá me procurando.'
        ];

        return tips[id];
    }

    static orderLetterPhaserObjectsByName(objArray, prefix = 'letter-position-') {
        const sorted = [];

        for (let i in objArray) {
            sorted[Number(objArray[i].name.replace(prefix, '')) - 1] = objArray[i];
        }

        return sorted;
    }

}