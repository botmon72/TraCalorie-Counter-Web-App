//Storage Controller***********************************************
const Storage = (function(){
  
  return {
    storeItem: function(item){
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
    getItems: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    deleteItemLS: function(id){
      let items = this.getItems();
      items.forEach(function(item, index){
        if(item.id === id){
          items.splice(index, 1);
        }
      })
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearLS: function(){
      localStorage.clear();
    }

  }
})();

//Item Controller*************************************************
const ItemCtrl = (function(){
  //constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //data structure
  const data = {
    items: Storage.getItems(),
    currentItem: null,
    totalCalories: 0
  }

  //Item Ctrl Public Methods
  return {
    deleteCurrentItem: function(){
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
    getItemById: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      })
      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    logData: function(){
      return data;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getItems: function(){
      return data.items;
    },

    getTotalCalBeg: function(){
      data.totalCalories = 0;
      data.items.forEach(function(item){
        data.totalCalories += parseInt(item.calories);
      })
      return data.totalCalories;
    },

    getUpdatedCal: function(){
      return data.totalCalories; 
    },

    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      let ID;
      if(data.items.length >0){
        ID = data.items[data.items.length - 1].id + 1;
      }else{
        ID = 1;
      }
      calories = parseInt(calories);

      const newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      data.totalCalories += calories;

      return newItem;
    },

    deleteItem: function(id){
      let found = null;
      const items = ItemCtrl.getItems();
      items.forEach(function(item, index){
        if(item.id === id){
          items.splice(index, 1);
        }
      })
    },
    clearAll: function(){
      data.items = [];
      data.totalCalories = 0;
      UICtrl.clearAll();
    },

  }
})();

//UI Controller***************************************************
const UICtrl = (function(){
  const UISelectors = {
    itemList: `#item-list`,
    addBtn: `.add-btn`,
    updateBtn: `.update-btn`,
    clearBtn: `.clear-btn`,
    backBtn: `.back-btn`,
    deleteBtn: `.delete-btn`,
    nameInput: `#item-name`,
    caloriesInput: `#item-calories`,
    totalCalories: `.total-calories`,
  }

  //UI Public Methods
  return {
    getSelectors: function(){
      return UISelectors;
    },
    clearFields: function(){
      document.querySelector(UISelectors.nameInput).value = '';
      document.querySelector(UISelectors.caloriesInput).value = '';
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
    getInputs: function(){
      return {
        name: document.querySelector(UISelectors.nameInput).value,
        calories: document.querySelector(UISelectors.caloriesInput).value
      }
    },
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
    addItemToList : function(item){
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
    showCaloriesBeg: function(totalCal){
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    },
    updateCalories: function(){
      const totalCal = ItemCtrl.getUpdatedCal();
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    },
    clearAll: function(){
      document.querySelector(UISelectors.itemList).innerHTML = '';
    },
    showCurrentItem: function(){
      document.querySelector(UISelectors.nameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.caloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },
    updateItemList: function(updatedItem){
      const items = ItemCtrl.getItems();
      items.forEach(function(item){
        if(item.id === updatedItem.id){
          document.querySelector(`#item-${item.id}`).innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      })
    }

  }
})();


//App Controller**********************************************
const App = (function(ItemCtrl, UICtrl, Storage){
  const UISelectors = UICtrl.getSelectors();
  //loadEventListeners
  const loadEventListeners = function(){
    //add button
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //clear all button
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAll);

    //Edit button
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update Button
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //back button
    document.querySelector(UISelectors.backBtn).addEventListener('click', function(e){
      UICtrl.clearEditState();
      UICtrl.clearFields();
      e.preventDefault();
    });

    //disable the enter button
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })

    //remove button
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);
  }
  //delete item button
  const deleteItem = function(e){
    ItemCtrl.deleteCurrentItem();
    const currentItemId = ItemCtrl.getCurrentItem().id;
    Storage.deleteItemLS(currentItemId);
    const items = ItemCtrl.getItems();
    UICtrl.populateItemList(items);
    UICtrl.clearEditState();
    UICtrl.clearFields();
    ItemCtrl.getTotalCalBeg();
    UICtrl.updateCalories();
    console.log('delete')

    e.preventDefault();
  }

  //item update button
  const itemUpdateSubmit = function(e){
    //update to new information using id to target the html element
    const input = UICtrl.getInputs();
    //return the updated item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    UICtrl.updateItemList(updatedItem);
    ItemCtrl.getTotalCalBeg();
    UICtrl.updateCalories();
    UICtrl.clearFields();
    UICtrl.clearEditState();
    e.preventDefault();
  }

  //item edit button
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      UICtrl.showEditState();
      const inputs = UICtrl.getInputs();

      const itemID = e.target.parentElement.parentElement.id;
      const itemIDArr = itemID.split('-');
      const id = parseInt(itemIDArr[1]);
      
      const itemToEdit = ItemCtrl.getItemById(id); //returns item
      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.showCurrentItem();
    }

    e.preventDefault()
  }
  //clear all button
  const clearAll = function(e){
    ItemCtrl.clearAll();
    UICtrl.updateCalories();
    Storage.clearLS();
    e.preventDefault()
  }

  //Add Button
  const itemAddSubmit = function(e){
    const inputs = UICtrl.getInputs();
    const newItem = ItemCtrl.addItem(inputs.name, inputs.calories);
    
    Storage.storeItem(newItem);
    UICtrl.updateCalories();
    UICtrl.addItemToList(newItem);
    UICtrl.clearFields();
    e.preventDefault();
  }


  //App Public Methods
  return {
    init: function(){
      UICtrl.clearEditState();
      loadEventListeners();

      const totalCal = ItemCtrl.getTotalCalBeg();
      UICtrl.showCaloriesBeg(totalCal);

      const items = ItemCtrl.getItems();
      UICtrl.populateItemList(items);
    }
  }
})(ItemCtrl, UICtrl, Storage);

App.init();