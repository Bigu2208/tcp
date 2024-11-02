function setCookie(name, value, days) {
    console.log(`Definindo cookie: ${name} com valor: ${value} por ${days} dias`);
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    console.debug('Cookie definido com sucesso');
}

// Função para obter cookie
function getCookie(name) {
    console.log(`Tentando obter cookie: ${name}`);
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    const result = parts.length === 2 ? parts.pop().split(';').shift() : null;
    console.debug(`Valor do cookie ${name}:`, result);
    return result;
}

// Função principal de rastreamento de conversão
function handleConversion() {
    console.log('=== Iniciando o manuseio de conversão ===');
    
    // Obter valor total do carrinho
    const cartTotalElement = document.getElementById('Carrinho_ValorTotal');
    console.debug('Elemento total do carrinho:', cartTotalElement);
    const cartTotal = cartTotalElement?.value || '0';
    
    // Obter ID da transação
    const transactionElement = document.getElementById('pixTransactionId');
    console.debug('Elemento da transação:', transactionElement);
    const transactionId = transactionElement?.value || '';
    
    console.log({
        cartTotal: cartTotal,
        transactionId: transactionId
    });

    // Salvar valores em cookies
    setCookie('cartTotal', cartTotal, 30);
    setCookie('transactionId', transactionId, 30);

    // Verificações de URL
    const currentUrl = window.location.href;
    const referrer = document.referrer;
    const isOrderSent = currentUrl.includes('pedido/enviado');
    const isFromPayment = referrer.includes('pedido/ConfirmarPagamento');
    
    console.log('Verificações de URL:', {
        currentUrl: currentUrl,
        referrer: referrer,
        isOrderSent: isOrderSent,
        isFromPayment: isFromPayment
    });

    // Obter ID da transação anterior
    const previousTransactionId = getCookie('lastConversionTxId');
    console.log('ID da transação anterior:', previousTransactionId);

    // Lógica de conversão
    if (isOrderSent && isFromPayment && transactionId) {
        console.log('Condições iniciais atendidas para conversão');
        
        if (previousTransactionId !== transactionId) {
            console.log('Nova transação detectada - disparando conversão');
            
            try {
                gtag('event', 'conversion', {
                    'send_to': 'AW-16759698567/upR6CI_xveQZEIfp0rc-',
                    'value': parseFloat(cartTotal),
                    'currency': 'BRL',
                    'transaction_id': transactionId
                });
                console.log('Evento de conversão disparado com sucesso');
                
                // Salvar transação como rastreada
                setCookie('lastConversionTxId', transactionId, 365);
            } catch (error) {
                console.error('Erro ao disparar conversão:', error);
            }
        } else {
            console.log('Transação já rastreada - pulando conversão');
        }
    } else {
        console.log('Condições de conversão não atendidas:', {
            isOrderSent: isOrderSent,
            isFromPayment: isFromPayment,
            hasTransactionId: !!transactionId
        });
    }
    
    console.log('=== Manuseio de conversão concluído ===');
}

// Adicionar listener de evento quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - inicializando rastreamento de conversão');
    handleConversion();
});
