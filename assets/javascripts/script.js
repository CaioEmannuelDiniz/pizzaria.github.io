//Variaveis
//variavel responsavel pela quantidade 
let modalQt = 1;
//variavel do carrinho de compras 
let cart = [];
//variavel que armazena um localizador de pizza igual
let modalKey;

//constante para diminuir o codigo que utiliza o document.querySelector
const c = (el)=>document.querySelector(el);

//constante para diminuir o codigo que utiliza o document.querySelectorAll
const cs = (el)=>document.querySelectorAll(el);

//Listagens das Pizzas
pizzaJson.map((item, index)=>{
    
    //variavel que clona/duplica todo modelo html e armazena na variavel, para poder ser feito as alterações no clone depois sobrescrever 
    let pizzaItem = c('.models .pizza-item').cloneNode(true);


    //cria um atributo data key na tag com o valor do index 
    pizzaItem.setAttribute('data-key', index);

    //preencher as informações em pizza

    //localiza a are da imagem e inserir o endereço da imagem
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; 

    //localiza a area que inserir o nome, não pode ser o utilizado a função c que abrevia o querySelector devido o
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    //localiza a area que inserir o preço 
    //pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$${item.price.toFixed(2)}`;

    let pizzaPrices = '';

    
    item.price.forEach((pizzaPrice,priceIndex)=>{
        let sizeChar;
        switch (priceIndex) {
            case 0:
                sizeChar = 'P:'
                break;
            case 1:
                sizeChar = 'M:'
                break;
            case 2:
                sizeChar = 'G:'
                break;
        }
        pizzaPrices += `${sizeChar} $${pizzaPrice.toFixed(2).toString()} `;
    });

    pizzaItem.querySelector('.pizza-item--price').innerHTML = pizzaPrices;

    //localiza a area da descrição 
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //adicionar um evento de click nas area das pizza
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        //retira o comando padra de atualizar pagina da tag a
        e.preventDefault();

        //variavel que sempre instancia a quantidade em 1
        modalQt = 1;


        //variavel que localiza o elemento mais proximo que tenha o .pizza item por meio do comando closest
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //instancia a variavel que armazena a chave da pizza com o valor obtido na key 
        modalKey = key;

        //localiza a area da imagen e inserir a imagem referente a pizza
        c('.pizzaBig img').src = pizzaJson[key].img;

        //localiza a area do nome e inserir o nome referente a pizza
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;

        //localiza a area da descrição e inserir a descrição referente a pizza
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        
        //localiza a area para remover a classe selected 
        c('.pizzaInfo--size.selected').classList.remove('selected');
        
        let sizeSelected;
        //localiza as area de tamanhanho clicado 
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            //se para verificar se ta na maior pizza
            if(sizeIndex == 2){
                //adiciona a classe de selecionar
                size.classList.add('selected');
            }

            //localiza o span responsavel pelo tamanho
            size.querySelector('span').innerHTML = 
            pizzaJson[key].sizes[sizeIndex];

            sizeSelected = sizeIndex;


        });

        //localiza a area de quantidade e inseria a quantidade
        c('.pizzaInfo--qt').innerHTML = modalQt;

        //localiza a area do preço e inserir o preço
        c('.pizzaInfo--actualPrice').innerHTML =`R$ ${pizzaJson[key].price[sizeSelected].toFixed(2)}`;


        //localiza a area pela transparencia do modal de uma pizza
        c('.pizzaWindowArea').style.opacity = 0;

        //localiza a area do modal e deixa ele clicavel e
        c('.pizzaWindowArea').style.display = 'flex';

        //função que aguarda um tempo para executar o que esta dentro
        setTimeout(()=>{

            //localiza a area pela transparencia do modal de uma pizza
            c('.pizzaWindowArea').style.opacity = 1;


         //2 milisegundos
        },200);
    })



    //localizou a area da pizza e vai adicionando as pizzas
    c('.pizza-area').append(pizzaItem);
});

//Eventos do Modal
function closeModal(){
    //localiza a area de visibilidade do modal deixando invisivel
    c('.pizzaWindowArea').style.opacity = 0;

    //função por espera um tempo para executar o que ta dentro
    setTimeout(()=>{

        //localiza a area do modal e deixa ela não clicavel
        c('.pizzaWindowArea').style.display = 'none';


     //5 milisegundos
    },500);
}

//localiza a area de fechar tanto modo desktop quanto mobile e adiciona a função de fechar a ambos
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

//localiza a area de clica no menos e adiciona a função de diminuir
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    //se a quantidade for maior que 1 ele permite diminuir
    if(modalQt > 1){
        //tira um 
        modalQt--;
        
        //localiza a area de quantidade e inseri a quantidade
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }

});

//localiza a area de clica no mais e adiciona a função de somar
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    //soma mais um 
    modalQt++;
    
    //localiza a area da quantidade e inseri a quantidade
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//localiza as areas de tamanho e remove e coloca a classe selected
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',()=>{
        //localiza e retira a classe selected
        c('.pizzaInfo--size.selected').classList.remove('selected');
        //localiza e adiciona a classe selected
        size.classList.add('selected');

        sizeSelected = sizeIndex;

        c('.pizzaInfo--actualPrice').innerHTML =`R$ ${pizzaJson[modalKey].price[sizeSelected].toFixed(2)}`;
    });
});

//localiza a area de adicionar no carrinho
c('.pizzaInfo--addButton').addEventListener('click',()=>{

    //variavel que armazena o tamanho em forma de um inteiro
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    //variavel que armazena um identificador e o tamanho
    let identifier =  pizzaJson[modalKey].id+''+size;

    //variavel que localiza o item pelo identifier e armazena variavel
    let key = cart.findIndex((item)=>item.identifier == identifier);

    //se ele achar o item no carrinho
    if(key>-1){
        //adiciona a quantidade do item a um ja existente no carrinho
        cart[key].qt += modalQt;
    }else{

        //caso não exista ele cria um novo item/obejeto e adiciona ao carrinho 
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });

    }
    //chama a função que atualiza o carrinho
    updateCart();

    //chama função que fecha o modal
    closeModal();
});

//localiza a area de abrir o carrinho
c('.menu-openner').addEventListener('click',()=>{
    //verifica se a quantidade no carrinho é maior que 0 para pode abrir
    if(cart.length > 0){
        //localiza a area de aside e esconde o carrinho
        c('aside').style.left = '0';
    }
})

//localiza a area responsavel por fechar o carrinho
c('.menu-closer').addEventListener('click', ()=>{
    //localiza a tag aside e coloca 100vw mostrando
    c('aside').style.left = '100vw';
})


//função de atualizar carrinho 
function updateCart(){
    
    //localiza a classe e inser a quantidade de itens que possui no carrinho
    c('.menu-openner span').innerHTML = cart.length;



    if(cart.length > 0){

        //variavel que armazena o sub total da compra
        let subtotal = 0;
        //variavel que armazena o valor do desconto
        let desconto = 0;

        //variavel que armazena o valor total da compra
        let total = 0;


        //localiza a tag aside e inseri uma classe que mostra o carrinho na tela
        c('aside').classList.add('show');

        //localiza a classe do carrinho e esvazia
        c('.cart').innerHTML = '';

        //loop que roda todo array do carrinho
        for(let i in cart){

            //variavel que localiza o item no carrinho pelo id
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            //variavel que armazena preço vezes quantidade daquele item no carrinho
            subtotal += pizzaItem.price[cart[i].size] * cart[i].qt;

            //variavel que armazena um clone do modelo de carrinho
            let cartItem = c('.models .cart--item').cloneNode(true);

            //variavel que armazena uma tag span com valor da pizza vezes a quantidade
            let spanPricePizza = `<span style="color:#FFF;font-weight: bold";>R$ ${(pizzaItem.price[cart[i].size] * cart[i].qt).toFixed(2)}</span>`;

            //variavel que armazena o valor inserido na nova span referente ao valor da pizza
            let pricePizza = document.innerHTML = spanPricePizza;

            
            //variavel que serve para zerar
            let pizzaSizeName = '';

            //seletor que recebe um inteiro referente ao tamanho 
            switch(cart[i].size){
                case 0:
                    //armazena a letra tamanho P
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    //armazena a letra tamanho M
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    //armazena a letra tamanho G
                    pizzaSizeName = 'G';
                    break;
            }

            //variavel que armazena nome tamanho e o preço que é mostrado no carrinho
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName}) ${pricePizza} `;

            //localiza a area de por a imagem do carrinho 
            cartItem.querySelector('img').src = pizzaItem.img;

            //localiza a area de por o nome do carrinho 
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;

            //localiza a area de por a quantidade  
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //localiza o botao menos e colocar o evento de diminuir no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                
                //verifica se a quantidade do carrinho é maior que um significaa que possui item
                if(cart[i].qt > 1){
                    //retira mais um
                    cart[i].qt--;
                }else{
                    //caso não seja maior pode ser retirado do carrinho
                    cart.splice(i,1);
                }
                //chama o carrinho para ser atualizado
                updateCart();
            });

            //localiza o botao mais de adicionar mais quantidade
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                //adicionar mais um
                cart[i].qt++;
                //chama o carrinho para ser atualizado
                updateCart();
            });

            //localiza a classe cart e inserir nela um item que copia os outros modelos
            c('.cart').append(cartItem);

        }

        //variavel que armazena o valor do desconto
        c('.cart--desconto input').addEventListener('keydown',(e)=>{

            if(e.key === 'Enter'){
        
                let descInput = c('.cart--desconto input').value.toString();
                switch (descInput) {
                    case "dev":
                        
                        //variavel que armazena o valor do desconto
                        desconto = subtotal*0.05;
                        c('.desconto span:first-child').innerHTML = `Desconto (-${((desconto*100)/subtotal).toFixed(2)}%) <i style="color:#FFF;font-weight: bold";>${descInput}</i>`

                        break;
                    case "b7web":
                        
                        //variavel que armazena o valor do desconto
                        desconto = subtotal*0.2;
                        c('.desconto span:first-child').innerHTML = `Desconto (-${((desconto*100)/subtotal).toFixed(2)}%) <i style="color:#FFF;font-weight: bold";>${descInput}</i>`
        
                        break;
                    case "caiodev":
                        
                        //variavel que armazena o valor do desconto
                        desconto = subtotal;
                        c('.desconto span:first-child').innerHTML = `Desconto (-${((desconto*100)/subtotal).toFixed(2)}%) <i style="color:#FFF;font-weight: bold";>${descInput}</i>`
        
                        break;
                    default:
                        c('.cart--desconto input').style.border = "2px solid #FF0000"
                        break;
                };

                //localiza ultimo span de desconto e inseri nele o valor desconto com 2 algarismo
                c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
                total = subtotal - desconto;
                //localiza ultimo span de total e inseri nele o valor total com 2 algarismo
                c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
                setTimeout(()=>{
                    c('.cart--desconto input').value = '';
                    c('.cart--desconto input').style.border = "2px solid #48d05f";
                },500);

            };

        });

        
        //variavel que armazena total menos o desconto
        total = subtotal - desconto;

        c('.desconto span:first-child').innerHTML = `Desconto (%)`
        //localiza ultimo span de subtotal e inseri nele o valor subtotal com 2 algarismo
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        //localiza ultimo span de total e inseri nele o valor total com 2 algarismo
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        //localiza ultimo span de total e inseri nele o valor total com 2 algarismo
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        //localiza o aside e remove a classe que o mostra
        c('aside').classList.remove('show');

        //localiza o aside e o esconde por meio da view width
        c('aside').style.left = '100vw';
    }
}