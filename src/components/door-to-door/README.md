# Venda Porta a Porta

Este módulo permite que parceiros realizem vendas presenciais de forma organizada e rastreável.

## Componentes

### 1. DoorToDoorSaleForm

Formulário para registro de vendas porta a porta.

**Propriedades:**
- `onSuccess`: Função chamada após o registro bem-sucedido de uma venda
- `onCancel`: Função opcional chamada quando o usuário cancela o formulário

### 2. PendingDoorToDoorSales

Lista de vendas porta a porta pendentes de acerto.

## Fluxo de Uso

1. **Registrar Venda**
   - Acesse a aba "Venda Porta a Porta"
   - Preencha os dados do cliente
   - Selecione a quantidade de números
   - Confirme a venda

2. **Acerto de Vendas**
   - As vendas aparecerão na lista de "Vendas Pendentes"
   - Clique em "Acertar" quando receber o pagamento
   - O valor será creditado na sua conta

3. **Cancelamento**
   - Caso necessário, cancele a venda
   - Os números voltarão a ficar disponíveis

## Dados Armazenados

Cada venda porta a porta armazena:
- Dados do cliente (nome, WhatsApp, cidade)
- Números sorteados
- Valor total e comissão
- Data e localização (opcional)
- Status (pendente, acertado, cancelado)

## Integração

O módulo se integra com o hook `usePartner` para gerenciar o estado e as chamadas à API.

## Estilização

Os estilos estão disponíveis em `door-to-door.css` e utilizam classes do Tailwind CSS.

## Boas Práticas

1. Sempre obtenha a localização ao registrar uma venda
2. Informe ao cliente sobre o processo de acerto
3. Mantenha os dados do cliente atualizados
4. Faça o acerto das vendas no mesmo dia

## Solução de Problemas

- **Venda não aparece na lista**: Atualize a página ou verifique sua conexão
- **Erro ao acertar venda**: Verifique se o valor informado está correto
- **Problemas com localização**: Verifique as permissões do navegador

## Segurança

- Todas as comunicações são criptografadas
- Apenas o parceiro que realizou a venda pode acertá-la
- Os dados sensíveis são armazenados de forma segura
