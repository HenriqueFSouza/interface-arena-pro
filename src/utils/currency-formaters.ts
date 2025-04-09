export const formatToBRL = (value: string | number) => {
    if (!value) return 'R$ 0,00'

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(value))
}


