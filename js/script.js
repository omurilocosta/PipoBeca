    // variavel modalKey sera global
    let modalKey = 0

    // variavel para controlar a quantidade inicial de pipocas na modal
    let quantPipocas = 1

    let click = false

    let cart = [] //carrinho

    // funções auxiliares ou uteis
    const seleciona = (elemento) => document.querySelector(elemento)
    const selecionaTodos = elemento => document.querySelectorAll(elemento)

    const formatoReal = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    const formatoMonetario = (valor) => {
        if(valor) {
            return valor.toFixed(2)
        }
    }
    const abrirModal = () => {
        seleciona('.pipocaWindowArea').style.opacity = 0
        seleciona('.pipocaWindowArea').style.display = 'flex'
        setTimeout(() => seleciona('.pipocaWindowArea').style.opacity = 1, 150)
    }
    const fecharModal = () => {
        seleciona('.pipocaWindowArea').style.opacity = 0
        setTimeout(() => seleciona('.pipocaWindowArea').style.display = 'none', 500)
    }
    const botoesFechar = () => {
        selecionaTodos('.pipocaInfo--cancelButton, .pipocaInfo--cancelMobileButton').forEach((item) => {
            item.addEventListener('click', fecharModal)
        })
    }
    const preencherDadosPipocas = (pipocaItem, item, index) => {
        pipocaItem.setAttribute('data-key', index)
        pipocaItem.querySelector('.pipoca-item--img img').src = item.imagem   
        pipocaItem.querySelector('.pipoca-item--price').innerHTML = formatoReal(item.preco)
        pipocaItem.querySelector('.pipoca-item--name').innerHTML = item.nome
    }
    const preencheDadosModal = (item) => {
        seleciona('.pipocaInfo h1').innerHTML = item.nome
        seleciona('.pipocaBig img').src = item.imagem
        seleciona('.pipocaInfo--actualPrice').innerHTML = formatoReal(item.preco)
    }
    const pegarKey = (e) => {
        let key = e.target.closest('.pipoca-item').getAttribute('data-key')
        //console.log('Pipoca clicada ' + key)
        console.log(pipocaJson[key])

        quantPipocas = 1
        modalKey = key
        return key
    }
    const mudarQuantidade = () => {
        seleciona('.pipocaInfo--qtmais').addEventListener('click', () => {
            quantPipocas++
            seleciona('.pipocaInfo--qt').innerHTML = quantPipocas
        })

        seleciona('.pipocaInfo--qtmenos').addEventListener('click', () => {
            if(quantPipocas > 1) {
                quantPipocas--
                seleciona('.pipocaInfo--qt').innerHTML = quantPipocas
            }
        })
    }
    const adicionarNoCarrinho = () => {
        seleciona('.pipocaInfo--addButton').addEventListener('click', () => {
            console.log('Adicionar no carrinho');
    
            console.log('Pipoca ' + modalKey);
    
            console.log('Quant. ' + quantPipocas);
    
            let price = seleciona('.pipocaInfo--actualPrice').innerHTML.replace('R$&nbsp;','');
    
            let size = 1
            let identificador = pipocaJson[modalKey].id + 't' + size;
            let itemIndex = cart.findIndex(item => item.identificador === identificador);
    
            if (itemIndex !== -1) {
                cart[itemIndex].qt += quantPipocas;
            } else {
                let pipoca = {
                    identificador,
                    id: pipocaJson[modalKey].id,
                    qt: quantPipocas,
                    price: parseFloat(price)
                };
                cart.push(pipoca);
            }
    
            fecharModal();
            abrirCarrinho()
            atualizarCarrinho(); 
        });
    };
    const clickCarrinho = () => {
        seleciona('.menu-openner').addEventListener('click', () => {
            // Alterado para verificar se o carrinho está aberto ou fechado e agir de acordo
            if (seleciona('aside').classList.contains('show')) {
                fecharCarrinho();
            } else {
                abrirCarrinho();
            }
        });
    };
    
    const abrirCarrinho = () => {

        seleciona('aside').classList.add('show');
        seleciona('header').style.display = 'flex';

    };
    
    const fecharCarrinho = () => {
        seleciona('.menu-closer').addEventListener('click', () => {
            seleciona('aside').classList.remove('show')
            seleciona('header').style.display = 'flex'
        })
    }
    const atualizarCarrinho = () => {
        seleciona('.menu-openner span').innerHTML = cart.length;
    
        seleciona('.cart').innerHTML = '';
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
    
        if (cart.length > 0) {
            seleciona('.cart--item-vazio').style.display = 'none';
            seleciona('aside').classList.add('show');
    
            cart.forEach((item) => {
                let pipocaItem = pipocaJson.find(pipoca => pipoca.id === item.id);
                let cartItem = seleciona('.models .cart--item').cloneNode(true);
    
                subtotal += item.price * item.qt;
    
                let pipocaName = `${pipocaItem.nome}`;
    
                cartItem.querySelector('img').src = pipocaItem.imagem;
                cartItem.querySelector('.cart--item-nome').innerHTML = pipocaName;
                cartItem.querySelector('.cart--item--qt').innerHTML = item.qt;
    
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                    item.qt++;
                    atualizarCarrinho();
                });
                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                    if (item.qt > 1) {
                        item.qt--;
                        atualizarCarrinho();
                    } else {
                        const itemIndex = cart.findIndex(cartItem => cartItem.identificador === item.identificador);
                        cart.splice(itemIndex, 1);
                        atualizarCarrinho();
                    }
                });
    
                seleciona('.cart').append(cartItem)
            });
    
            desconto = 0;
    
            total = subtotal - desconto;

            seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal);
            seleciona('.total span:last-child').innerHTML = formatoReal(total);
        } else {
            
            seleciona('.cart--item-vazio').style.display = 'block';
            seleciona('aside').classList.remove('show');

            seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal);
            seleciona('.total span:last-child').innerHTML = formatoReal(total);
        }
    };
    const finalizarCompra = () => {
        seleciona('.cart--finalizar').addEventListener('click', () => {
            console.log('Finalizar compra')
            if (cart.length <= 0) {
                alert('Carrinho vazio. Impossivel finalizar a compra')
            } else {
                seleciona('aside').classList.remove('show')
                seleciona('header').style.display = 'flex'
            }
        })
    }

    pipocaJson.map((item, index ) => {
        //console.log(item)
        let pipocaItem = document.querySelector('.models .pipoca-item').cloneNode(true)
        //console.log(pipocaItem)
        seleciona('.pipoca-area').append(pipocaItem)

        // preencher os dados de cada pipoca
        preencherDadosPipocas(pipocaItem, item, index)

        // pipoca clicada

        pipocaItem.querySelector('.pipoca-item a').addEventListener('click', (e) => {
            e.preventDefault()
            console.log('Clicou na pipoca')

            pegarKey(e)

            //abrir janela modal
            abrirModal()

            // preenchimento dos dados
        preencheDadosModal(item)

        seleciona('.pipocaInfo--qt').innerHTML = quantPipocas

        

        })
        
        botoesFechar()
        
    })
    clickCarrinho()
    
    mudarQuantidade()
    
    adicionarNoCarrinho()
    atualizarCarrinho()
    fecharCarrinho()
    finalizarCompra()