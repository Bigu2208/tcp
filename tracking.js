function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    console.log(`Cookie definido: ${name}=${value}`);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

function handleConversion() {
    console.log('Iniciando o manuseio de conversão');
    
    const cartTotalElement = document.getElementById('Carrinho_ValorTotal');
    const transactionElement = document.getElementById('pixTransactionId');
    
    if (!cartTotalElement || !transactionElement) {
        console.error('Elementos de carrinho ou transação não encontrados');
        return;
    }
    
    const cartTotal = cartTotalElement.value || '0';
    const transactionId = transactionElement.value || '';
    
    console.log({ cartTotal, transactionId });

    setCookie('cartTotal', cartTotal, 30);
    setCookie('transactionId', transactionId, 30);

    const currentUrl = window.location.href;
    const referrer = document.referrer;
    const isOrderSent = currentUrl.includes('pedido/enviado');
    const isFromPayment = referrer.includes('pedido/ConfirmarPagamento');
    
    console.log({ currentUrl, referrer, isOrderSent, isFromPayment });

    const previousTransactionId = getCookie('lastConversionTxId');

    if (isOrderSent && isFromPayment && transactionId) {
        if (previousTransactionId !== transactionId) {
            console.log('Nova transação detectada - disparando conversão');
            try {
                gtag('event', 'conversion', {
                    'send_to': 'AW-16759698567/upR6CI_xveQZEIfp0rc-',
                    'value': parseFloat(cartTotal),
                    'currency': 'BRL',
                    'transaction_id': transactionId
                });
                setCookie('lastConversionTxId', transactionId, 365);
            } catch (error) {
                console.error('Erro ao disparar conversão:', error);
            }
        } else {
            console.log('Transação já rastreada - pulando conversão');
        }
    } else {
        console.log('Condições de conversão não atendidas');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - inicializando rastreamento de conversão');
    handleConversion();
});
