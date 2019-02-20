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
      {id: 1, name: `Steak Dinner`, calories: 1200},
      {id: 2, name: `Cookies`, calories: 500},
      {id: 3, name: `Eggs`, calories: 200}
    ],

    currentItem: null,

    totalCalories: 0
  }

  //Public Methods
  return {
    logData: function(){
      return data;
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

    getItems: function(){
      return data.items;
    }
  }

})();

//UI Controller
const UICtrl = (function(){

  //UI Selectors
  const UISelectors = {
    itemList: '#item-list',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    addBtn: '.add-btn',
    backBtn: '.back-btn'
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

    addItemToList: function(newItem){
      let html = `
        <li class="collection-item" id="item-${newItem.id}">
          <strong>${newItem.name}: </strong><em>${newItem.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
      `;

      document.querySelector(UISelectors.itemList).innerHTML += html;
    },

    getItemInput: function(){
      return{
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    getSelectors: function(){
      return UISelectors;
    }
  }
})();

//App Controller
const App = (function(ItemCtrl, UICtrl){
  //LoadEventListners function
  const loadEventListeners = function(){
    //get uiselectors from UICtrl
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', addItemSubmit);
  }

  //addItemSubmit function
  const addItemSubmit = function(e){
    const input = UICtrl.getItemInput();

    //Validate the inputs empty
    if(input.name !== '' && input.calories !== ''){
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addItemToList(newItem);
    }
  }
  
  //Public Methods
  return {
    init: function(){
      console.log(`Initializing...`);
      const items = ItemCtrl.getItems();

      UICtrl.populateItemList(items);

      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();