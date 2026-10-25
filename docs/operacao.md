# Guia de operação do restaurante

Como a equipe usa o Bella Cucina no dia a dia.

## Antes de abrir

- Cada mesa tem um **QR code** colado. Ele é único da mesa: não troque QRs entre mesas.
- Garçom, cozinha e salão entram com **e-mail e senha** nos painéis. Deixe cada painel aberto num tablet ou computador do seu setor.

| Setor | Endereço |
|-------|----------|
| Garçom | `/garcom` |
| Cozinha | `/cozinha` |
| Salão | `/salao` |

## Durante o serviço

1. **Cliente senta e escaneia o QR.** Ele informa o nome e faz o pedido pelo celular. Várias pessoas da mesma mesa podem pedir, cada uma do próprio celular.
2. **Garçom** vê o pedido chegar em `/garcom` e **aprova**. Se o cliente não tiver celular, o garçom pode ler o QR do pedido pelo leitor do painel.
3. **Cozinha** vê em `/cozinha` os pratos a preparar, agrupados por prato e por convidado, e marca cada um como **pronto**.
4. **Salão** vê em `/salao` os pratos prontos e a mesa de destino, e marca como **entregue**.
5. O cliente acompanha a **conta ao vivo** pelo próprio celular.

## Fechando a mesa

Depois do pagamento, em `/salao` → **Mesas abertas**, feche a sessão da mesa.

> **Sempre feche a mesa.** Enquanto ela estiver aberta, quem sentar depois e escanear o QR entra na mesma conta.

## Reservas

Os clientes reservam pelo site (`/menu`, seção Reservas). As reservas aparecem para a equipe no banco. A tela de gestão de reservas ainda vai ser criada ([#10](https://github.com/devthomaseduardo/bella-cucina/issues/10)).
