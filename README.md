## Проект Mesto бэкенд

get localhost:3000/cards - получение всех карточек;
post localhost:3000/cards - добавление новой карточки;
тело запроса:
  {
   "name" : "Название",
    "link": "Ссылка на изображение"
  };
delete localhost:3000/cards/:cardId - удаление карточки;
put localhost:3000/cards/:cardId/likes - лайк карточки;
delete localhost:3000/cards/:cardId/likes - дизлайк карточки;

get localhost:3000/users - получение всех пользователей;
post localhost:3000/users - добавление нового пользователя;
тело запроса:
  {
   "name" : "Имя",
   "about": "Описание",
   "avatar": "Ссылка на изображение"
  };
patch localhost:3000/users/me - обновление данных профиля;
тело запроса: 
  {
   "name" : "Имя",
   "about": "Описание"   
  }
patch localhost:3000/users/me/avatar - обновление аватара;
тело запроса: 
  {
    "avatar": "Ссылка на изображение" ;  
  }

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
