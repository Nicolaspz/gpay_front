## MInhas tarefas

- 

1. **Adicionar bloquei e ativação de clientes na tela de gestão de clientes na área do admin**

   Ativação de conta do usuário:
    PATCH /users/:id/activate

    Bloquear a conta
    PATCH /users/:id/block

    *NOTA:* **Para bloquear ou ativar conta de usuário, só o admin pode fazer isso.**

2. **upload de foto do usuário área do cliente**

    Inserir foto do usuário:
    POST /users/photo
    form-data: photo

    Atualização da foto do usuário:
    PUT /users/photo
    form-data: photo

    Apagar foto do usuário:
    DELETE /users/photo

    *NOTA:* **Para usuário apagar a sua fot é a rota com o método DELETE https://api.gpayangola.com/users/photo, o usuário deve estar logado.**

3. **Adicionar funcionalidade de gestão de notificações na área do cliente**

    Listar notificações do utilizador autenticado:
    GET /notifications

    Contador de não lidas (para o badge no frontend):
    GET /notifications/unread-count

    Marcar uma notificação como lida:
    PACTH /notifications/:id/read

    Marcar todas como lidas:
    PACTH /notifications/read-all

    Listagem de notificações para a área do admin:
    GET /notifications/all