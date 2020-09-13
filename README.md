# MagicPotion
Allow user to order magic potion

Steps to setup the env locally to test the project on both front-end and back-end:
1. In a folder, run "git clone https://github.com/HongYu-Cupertino/MagicPotion.git". After command, you should see a new folder named MagicPotion. 
2. cd Magicpotion folder, youshould see 2 sub folders under it: magic_potion_api and magic_potion_ui.
3. First, setup back-end, go to foler magic_potion_api, run command "npm install", and then run "npm start", by default, the server will run in port 5000.
   If port is already taken in your env, lease change to a different unused port. And remember to use the same port for the front-end fetch api call.
4. In server console, you should see a message saying "magic potion server is listening on port 5000:", which means the server is uo running.
5. Go to folder magic_potion_ui, run command "npm install", and then run command "npm start", once it's ready, in console, you should see a message like:
Compiled successfully!

You can now view magic_potion_ui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.2:3000
  
6. Open a new browser window, type in url: http://localhost:3000, you should be able to see the UI. From UI, you can create an order, you need to fill in all required fields and enter valid values in order to be able to submit an order. If failed, you will see validation error under the invalid UI fields. The validation errors will disappear once you correct the value. After order issuccesfully submitted, you should see a message displa above the Submit button, if api failed, 
you should see an error message displayed. 
7. You can use postman to check teh  newly created order. 
8. back-end provides 5 endpoints: POST, GET (get all orders and get an order by id), PATCH and DELETE. Feel free to test using a tool like postman.  


