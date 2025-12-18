# QlikSense-Extension-Alerta

📊 **QlikSense-Extension-Alerta** é uma extensão para **Qlik Sense** que permite criar alertas visuais através de **efeito de piscagem (blink)** em objetos do dashboard, ajudando a destacar KPIs ou indicadores críticos.

## 🚨 Funcionalidades

- Faz o objeto selecionado **piscar alterando a opacidade**.
- Permite definir se a piscagem será:
  - Para **todas as cores**, ou  
  - Apenas para **uma cor específica** (ex: pisca quando vermelho, para quando verde).
- Suporte a **mais de um objeto** simultaneamente através do **ID do objeto**.
- Configuração do **tempo/velocidade da piscagem**.
- Ideal para **KPIs, caixas de texto e objetos com cor única**.

## ⚙️ Configurações Disponíveis

- Seleção de **um ou múltiplos objetos** via `Object ID`.
- Definição da **cor que ativa o alerta**.
- Opção para ativar o alerta em **todas as cores**.
- Ajuste do **intervalo da piscagem** (tempo em ms).

## ❗ Limitações Importantes

> ⚠️ O efeito de piscagem funciona **apenas no objeto como um todo**.

Não funciona corretamente em objetos com **cores segmentadas**, como por exemplo:
- Mapas com múltiplas cores
- Gráficos de barras
- Gráficos com dimensões coloridas

## 🧩 Exemplos de Uso

- KPI de faturamento piscando em **vermelho** quando abaixo da meta.
- Indicador de SLA piscando quando em estado crítico.
- Destaque visual para métricas que exigem atenção imediata.

## 📦 Instalação

### 🔹 Qlik Sense On-Premise (Server)

No ambiente **Qlik Sense Enterprise On-Premise**, a instalação é feita **somente via arquivo `.zip`**.

1. Baixe o arquivo:

ExtensaoAlerta.zip


2. Acesse o **Qlik Management Console (QMC)**

3. Navegue até:

Extensions → Import


4. Faça o upload do arquivo:

ExtensaoAlerta.zip


5. Após a importação:
- Verifique se a extensão está com status **Enabled**
- Confirme se os usuários possuem permissão de uso

6. Acesse o **Qlik Sense Hub**
- Abra um aplicativo
- Entre em **Modo de Edição**
- A extensão estará disponível em **Objetos personalizados**

✅ **Nenhuma configuração adicional é necessária no servidor**.

## 🛠️ Tecnologias Utilizadas

- JavaScript
- Qlik Sense Extension API
- CSS (animações de opacidade)

## 🤝 Contribuição

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir **issues**, enviar **pull requests** ou sugerir melhorias.

## 📄 Licença

Este projeto está sob a licença **MIT**.  
Consulte o arquivo `LICENSE` para mais informações.

