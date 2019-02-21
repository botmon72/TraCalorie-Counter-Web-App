//Storage Controller


//Item Controller
const ItemCtrl = (function(){
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    items: [
      // {id: 1, name: 'Steak Dinner', calories: 1200},
      // {id: 2, name: 'Cookies', calories: 400},
      // {id: 3, name: 'Egg', calories: 200}
    ],

    currentItem: null,

    totalCalories: 0
  }

  //public methods
  return {
    getCalories: function(){
      let total = 0;

      data.items.forEach(function(item){
        total += parseInt(item.calories);
      })

      data.totalCalories = total;

      return data.totalCalories;
    },

    logData: function(){
      return data;
    },

    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      }else{
        ID = 0;
      }

      calories = parseInt(calories);

      const newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },

    checkDupe: function(name, calories){
      let dupe = false;
      data.items.forEach(function(item){
        if(item.name === name){
          dupe = true;
        }
      })
      return dupe;
    },

    deleteAllItems: function(){
      data.items = [];
    }
  }


})();


//UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: `#item-list`,
    addBtn: `.add-btn`,
    backBtn: `.back-btn`,
    itemNameInput: `#item-name`,
    itemCaloriesInput: `#item-calories`,
    totalCalories: `.total-calories`,
    clearBtn: `.clear-btn`
  }
  
  //public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      })
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getSelectors: function(){
      return UISelectors;
    },

    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addItemToList: function(item){
      //Show the itemList
      document.querySelector(UISelectors.itemList).style.display = `block`;

      let html = `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
      `;

      document.querySelector(UISelectors.itemList).innerHTML += html;
    },

    showAlert: function(message, className){
      (function clearAlerts(){
        const currentAlert = document.querySelector('.alert');
        if(currentAlert){
          currentAlert.remove();
        }
      })();
      const div = document.createElement('div');
      div.appendChild(document.createTextNode(message));
      div.className = `alert ${className}`;

      const card = document.querySelector('.card-content');
      const title = document.querySelector('.card-title');

      card.insertBefore(div, title);

      setTimeout(function(){
        const currentAlert = document.querySelector('.alert');
        if(currentAlert){
          currentAlert.remove();
        }
      }, 3000)
    },

    clearInputs: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = `none`;
    },

    updateCalories: function(totalCal){
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    }
  }
})();


//App Controller
const App = (function(ItemCtrl, UICtrl){

  //Grab UISelectors from UICtrl
  const UISelectors = UICtrl.getSelectors();
  //loadEventListeners
  const loadEventListeners = function(){
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);
  }

  //clearBtn function clearAllItems
  const clearAllItems = function(){
    document.querySelector(UISelectors.itemList).innerHTML = '';
    UICtrl.hideList();
    ItemCtrl.deleteAllItems();
    const totalCal = ItemCtrl.getCalories();
    UICtrl.updateCalories(totalCal);
  }

  //itemAddSubmit function
  const itemAddSubmit = function(e){
    const inputs = UICtrl.getItemInput();

    if(inputs.name !== '' && inputs.calories !== ''){
      const dupe = ItemCtrl.checkDupe(inputs.name, inputs.calories);
      if(dupe === true){
        UICtrl.showAlert(`This is a duplicate.`, `alert-danger`);
      }else{
        const newItem = ItemCtrl.addItem(inputs.name, inputs.calories);
        const totalCal = ItemCtrl.getCalories();
        UICtrl.updateCalories(totalCal);
        UICtrl.addItemToList(newItem);
        UICtrl.clearInputs();
      }
    }else{
      UICtrl.showAlert(`Please enter all fields`, `alert-danger`);
    }

    e.preventDefault();
  }
  
  //public methods
  return {
    init: function(){
      console.log(`Initialized...`);

      const items = ItemCtrl.getItems();
      //Check if there are any items
      if(items.length === 0){
        UICtrl.hideList();
      }else{ 
        UICtrl.populateItemList(items);
      }
      //Get the total calories and show on app
      const totalCal = ItemCtrl.getCalories();
      UICtrl.updateCalories(totalCal);

      //Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();