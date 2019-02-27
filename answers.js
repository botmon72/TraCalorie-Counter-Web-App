//Storage Controller
const StorageCtrl = (function(){

  //Storage Public Methods
  return {
    storeItem: function(item){
      let items;

      //check if any items are in local storage already
      if(localStorage.getItem('items') === null){
        items = [];
        //push the new item
        items.push(item);
        //set the local storage
        localStorage.setItem('items', JSON.stringify(items));
      }else{
        //retrieve what's already in local storage and set it to items array
        items = JSON.parse(localStorage.getItem('items'));

        //push the new item
        items.push(item);

        //set the local storage with new item list
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }
  }
})();


//Item Controller
const ItemCtrl = (function(){
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    // items: [
    //   {id: 1, name: 'Steak', calories: 1200},
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  //public methods

  return {
    getTotalCalories: function(){
      data.totalCalories = 0;
      data.items.forEach(function(item){
        data.totalCalories += parseInt(item.calories);
      })
      return data.totalCalories;
    },

    
    deleteItem: function(name, calories){
      data.items.forEach(function(item, index){
        if(item.id === data.currentItem.id){
          data.items.splice(index, 1);
        }
      })
    },

    updateItem: function(name, calories){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      })
      return found;
    },

    logData: function(){
      return data;
    },

    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      let ID;
      if(data.items.length > 0 ){
        ID = data.items[data.items.length - 1].id + 1;
      }else{
        ID = 1;
      }
      calories = parseInt(calories);
      const newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      data.totalCalories += parseInt(newItem.calories)
      return newItem;
    },

    clearAll: function(){
      data.items = [];
    },

    updateCalories: function(item){
      data.totalCalories += item.calories;
      return data.totalCalories;
    },
    
    getItemById: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      })
      return found;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    setCurrentItem: function(item){
      data.currentItem = item;
    },
  }
})();

//UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: `#item-list`,
    nameInput: `#item-name`,
    caloriesInput: `#item-calories`,
    addBtn: `.add-btn`,
    clearBtn: `.clear-btn`,
    backBtn: `.back-btn`,
    updateBtn: `.update-btn`,
    deleteBtn: `.delete-btn`,
    totalCalories: `.total-calories`
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

    addItem: function(item){
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

    getInputs: function(){
      return {
        name: document.querySelector(UISelectors.nameInput).value,
        calories: document.querySelector(UISelectors.caloriesInput).value
      }
    },

    clearFields: function(){
      document.querySelector(UISelectors.nameInput).value = '';
      document.querySelector(UISelectors.caloriesInput).value = '';
    },

    showCalories: function(totalCal){
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    },

    showCurrentItem: function(){
      document.querySelector(UISelectors.nameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.caloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },

    clearEditState: function(){
      UICtrl.clearFields();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },

    showEditState: function(){
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },

    updateItemList: function(item){
      const listItems = ItemCtrl.getItems();

      listItems.forEach(function(listItem){
        if(listItem.id === item.id){
          document.querySelector(`#item-${item.id}`).innerHTML = `
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      })
    },

    updateAllCalories: function(){
      const totalCal = ItemCtrl.getTotalCalories();
      this.showCalories(totalCal);
    }
  }
})();

//App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){
  //get selectors
  const UISelectors = UICtrl.getSelectors();


  //load event listener function
  const loadEventListener = function(){

    //add button
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Prevent Enter Key
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault()
        return false;
      }
    });
    
    //clear btn
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAll);

    //edit button
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEdit);

    //back button
    document.querySelector(UISelectors.backBtn).addEventListener('click', function(e){
      UICtrl.clearEditState();
      e.preventDefault();
    });

    //Update button
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemEditClick);

    //delete button
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);
  }


  //define delete item function
  const deleteItem = function(e){
    const input = UICtrl.getInputs();

    ItemCtrl.deleteItem(input.name, input.calories)

    const items = ItemCtrl.getItems();
    UICtrl.populateItemList(items);

    UICtrl.updateAllCalories();

    UICtrl.clearFields();
    UICtrl.clearEditState();
    e.preventDefault();
  }

  //define item edit click function
  const itemEditClick = function(e){
    //grab the inputs
    const input = UICtrl.getInputs();

    //update the item name and calories and store it into new variable
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //update the UI
    UICtrl.updateItemList(updatedItem);

    //edit the calories
    UICtrl.updateAllCalories();

    UICtrl.clearFields();
    UICtrl.clearEditState();
    e.preventDefault();
  }

  //go back
  const goBack = function(e){
    UICtrl.clearFields();
    UICtrl.clearEditState();
    e.preventDefault();
  }

  //item edit function
  const itemEdit = function(e){
    if(e.target.classList.contains('edit-item')){
      const itemId = e.target.parentElement.parentElement.id;
      console.log(itemId);
      
      //break up into array
      const itemIdArray = itemId.split('-');
      
      //get only the ID number
      const id = parseInt(itemIdArray[1]);
      
      //get current item
      const itemToEdit = ItemCtrl.getItemById(id);


      //set the current item
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.showCurrentItem();
      UICtrl.showEditState();
    }

    e.preventDefault();
  }

  //clearAll function
  const clearAll = function(e){
    ItemCtrl.clearAll();
    const items = ItemCtrl.getItems();
    UICtrl.populateItemList(items);
    UICtrl.updateAllCalories();

    e.preventDefault();
  }

  //itemAddSubmit function
  const itemAddSubmit = function(e){
    const name = document.querySelector(UISelectors.nameInput).value;
    const calories = document.querySelector(UISelectors.caloriesInput).value;
    if(name !== '' && calories !== ''){
      const newItem = ItemCtrl.addItem(name, calories);
      console.log(newItem);
      UICtrl.addItem(newItem);
      UICtrl.updateAllCalories();

      //store in local storage
      StorageCtrl.storeItem(newItem);

      UICtrl.clearFields();
    }else{
      alert(`Please input all fields`)
    }

    e.preventDefault();
  }

  //public methods
  return {
    init: function(){
      console.log(`Initialized...`);
      UICtrl.clearEditState();
      const items = ItemCtrl.getItems();
      UICtrl.populateItemList(items);
      loadEventListener();
      UICtrl.updateAllCalories();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();