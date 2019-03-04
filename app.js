//Storage Controller
const StorageCtrl = (function(){
  //StorageCtrl Public Methods
  return {
    //method to retrieve the items that are stored in the local storage
    getItemsFromLS: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemLS: function(updatedItem){
      const items = this.getItemsFromLS();
      items.forEach(function(item){
        if(item.id === updatedItem.id){
          item.name = updatedItem.name;
          item.calories = updatedItem.calories;
        }
      })
      localStorage.setItem('items', JSON.stringify(items));
    },

    //method to store a new item in the LS
    storeItemInLS: function(item){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }else{
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    //method to delete an item from the LS
    deleteItemFromLS: function(targetItem){
      const items = this.getItemsFromLS();
      items.forEach(function(item, index){
        if(item.id === targetItem.id){
          items.splice(index, 1);
        }
      })
      localStorage.setItem('items', JSON.stringify(items));
    },

    //method to clear the local storage
    clearLS: function(){
      localStorage.clear();
    }
  }
})();

//Item Controller
const ItemCtrl = (function(){

  //Constructor for new making new Item
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure
  const data = {
    items: StorageCtrl.getItemsFromLS(),
    currentItem: null,
    totalCalories: 0
  }

  //ItemCtrl Public Methods
  return {
    //method to show data in console
    logData: function(){
      return data;
    },

    //method to retrieve the items from data structure
    getItems: function(){
      return data.items;
    },

    //method to add a new item to the data structure
    addItem: function(name, calories){
      //must assign an ID to this new item first
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      }else{
        ID = 1;
      }
      
      //parse calories to int because calories was retrieved from .value which makes it a string
      calories = parseInt(calories);

      //create the new item
      const newItem = new Item(ID, name, calories);
      //push the new item into the data structure
      data.items.push(newItem);
      //add the new item's calories to the total count
      data.totalCalories += newItem.calories;
      //return the new item as an object
      return newItem;
    },
    //method to delete the current item when deleteBtn is clicked
    deleteCurrentItem: function(){
      data.items.forEach(function(item, index){
        if(item.id === data.currentItem.id){
          data.items.splice(index, 1);
        }
      })
    },
    //method to retrieve the total calories from data
    getTotalCalories: function(){
      return data.totalCalories;
    },
    getBegCalories: function(){
      data.totalCalories = 0;
      data.items.forEach(function(item){
        data.totalCalories += item.calories;
      })
      return data.totalCalories;
    },
    //method to retrieve the item to edit
    getItemById: function(id){
      let found = null;
      const items = this.getItems();
      items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      })
      return found;
    },
    //method to set the current item
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    //method to retrieve the current item from data
    getCurrentItem: function(){
      return data.currentItem;
    },

    //method to update the item
    updateItem: function(name, calories){
      let found = null;
      const items = this.getItems();
      items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = parseInt(calories);
          found = item;
        }
      })
      return found;
    },

    //method to clear all
    clearAll: function(){
      data.items = [];
    }
  }
})();


//UI Controller
const UICtrl = (function(){
  //defining UI selectors to make it easier to read and change in future
  const UI = {
    itemList: `#item-list`,
    addBtn: `.add-btn`,
    updateBtn: `.update-btn`,
    deleteBtn: `.delete-btn`,
    backBtn: `.back-btn`,
    clearBtn: `.clear-btn`,
    nameInput: `#item-name`,
    caloriesInput: `#item-calories`,
    totalCalories: `.total-calories`,
  }

  //UI controller public methods
  return {
    //method to retrieve the UISelectors in other modules
    getSelectors: function(){
      return UI;
    },
    //method to show the items in the UI
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
      //append the html to itemList
      document.querySelector(UI.itemList).innerHTML = html;
    },
    //method to grab the inputs from name and calories
    getInputs: function(){
      return {
        name: document.querySelector(UI.nameInput).value,
        calories: document.querySelector(UI.caloriesInput).value
      }
    },
    //method to add a new item to the item list
    addItemToList: function(item){
      let html = `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
      `;
      document.querySelector(UI.itemList).innerHTML += html;
    },
    updateCalories: function(){
      const totalCal = ItemCtrl.getTotalCalories();
      document.querySelector(UI.totalCalories).textContent = totalCal;
    },
    showBegCalories: function(){
      const totalCal = ItemCtrl.getBegCalories();
      document.querySelector(UI.totalCalories).textContent = totalCal;
    },
    //method to clear the input fields
    clearFields: function(){
      document.querySelector(UI.nameInput).value = '';
      document.querySelector(UI.caloriesInput).value = '';
    },
    //method for UI when not in 'edit state'
    clearEditState: function(){
      this.clearFields();
      document.querySelector(UI.addBtn).style.display = `inline`;
      document.querySelector(UI.updateBtn).style.display = `none`;
      document.querySelector(UI.deleteBtn).style.display = `none`;
      document.querySelector(UI.backBtn).style.display = `none`;
    },
    //method for UI when showing 'edit state'
    showEditState: function(){
      document.querySelector(UI.addBtn).style.display = `none`;
      document.querySelector(UI.updateBtn).style.display = `inline`;
      document.querySelector(UI.deleteBtn).style.display = `inline`;
      document.querySelector(UI.backBtn).style.display = `inline`;
    },

    //method to show the current item's input fields when edit button clicked
    showCurrentItem: function(){
      document.querySelector(UI.nameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UI.caloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },

    //method to show the updated item in list
    updateItemList: function(item){
      document.querySelector(`#item-${item.id}`).innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
    },
    //method to delete an item from the list
    deleteItemList: function(targetItem){
      const items = ItemCtrl.getItems();
      items.forEach(function(item){
        if(item.id === targetItem.id){
          document.querySelector(`#item-${item.id}`).remove();
        }
      })
    },

    //method to clear all
    clearAll: function(){
      document.querySelector(UI.itemList).innerHTML = '';
    }
  }
})();

//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  //Grab the UI selectors from UICtrl
  const UI = UICtrl.getSelectors();
  
  //event listener function
  const loadEventListeners = function(){
    //Add Button
    document.querySelector(UI.addBtn).addEventListener('click', itemAddSubmit);
    
    //Edit Button
    document.querySelector(UI.itemList).addEventListener('click', itemEditClick);

    //Update Button
    document.querySelector(UI.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Delete Button
    document.querySelector(UI.deleteBtn).addEventListener('click', deleteItemSubmit);

    //Back Button
    document.querySelector(UI.backBtn).addEventListener('click', function(e){
      UICtrl.clearFieldS();
      UICtrl.clearEditState();
      e.preventDefault();
    });

    //Clear Button
    document.querySelector(UI.clearBtn).addEventListener('click', function(e){
      StorageCtrl.clearLS();
      ItemCtrl.clearAll();
      UICtrl.clearAll();
      UICtrl.clearFields();
    })
  }
  //deleteItemSubmit - delete targeted item from data and LS
  const deleteItemSubmit = function(e){
    const currentItemId = ItemCtrl.getCurrentItem();
    const itemToDelete = ItemCtrl.getItemById(currentItemId.id);

    UICtrl.deleteItemList(itemToDelete);
    ItemCtrl.deleteCurrentItem();
    StorageCtrl.deleteItemFromLS(itemToDelete);
    UICtrl.showBegCalories();
    UICtrl.clearFields();
    UICtrl.clearEditState();

    e.preventDefault();
  }

  //itemUpdateSubmit - change the data and UI to the updated name and calories
  const itemUpdateSubmit = function(e){
    const inputs = UICtrl.getInputs();

    const updatedItem = ItemCtrl.updateItem(inputs.name, inputs.calories);

    StorageCtrl.updateItemLS(updatedItem);
    UICtrl.updateItemList(updatedItem);
    UICtrl.showBegCalories();
    UICtrl.clearFields();
    UICtrl.clearEditState();
    e.preventDefault();
  }

  //itemEditClick- when edit button is clicked, show edit state
  const itemEditClick = function(e){
    UICtrl.showEditState();
    if(e.target.classList.contains('edit-item')){
      const itemId = e.target.parentElement.parentElement.id;

      //break up into array
      const itemIdArr = itemId.split('-');

      //isolate only the id
      const id = parseInt(itemIdArr[1]);

      //returns the item object that is to be edited
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.showCurrentItem();
    }
  }

  //itemAddSubmit function
  const itemAddSubmit = function(e){
    const inputs = UICtrl.getInputs();
    if(inputs.name !== '' && inputs.calories !== ''){
      const newItem = ItemCtrl.addItem(inputs.name, inputs.calories);
      UICtrl.addItemToList(newItem);
      StorageCtrl.storeItemInLS(newItem);
      UICtrl.clearFields();
  
      //calories
      UICtrl.updateCalories();
    }else{
      alert('Please fill in all fields.')
    }


    e.preventDefault();
  }

  //App Public Method to initialize the app
  return {
    init: function(){
      console.log('Initialized...');
      //retrieve the items from data structure
      const items = ItemCtrl.getItems();
      //populate the item list using the items in data
      UICtrl.populateItemList(items);

      //update the calories
      UICtrl.showBegCalories();
      //load the event listener function
      loadEventListeners();
      UICtrl.clearEditState();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

//initalize the app
App.init();