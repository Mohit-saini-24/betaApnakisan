// DOM elements
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

//dataList
const dataList = document.querySelector('.guides');
//categorytabs
const tabsDisplayDiv = document.getElementById('tabsDisplayDiv')


$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.carousel').carousel();
  $('.modal').modal();
  $('select').formSelect();


  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);


  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});

const setupUI = (user) => {
  if (user) {
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
    document.getElementById('userEmail').innerHTML = user.email;

    var userRef = db.collection('users').doc(user.uid);
    userRef.onSnapshot(snapshot => {
      //console.log(snapshot.data())
      setUpUserData(snapshot.data());
    })
    userRef.collection('cart').onSnapshot(snapshot => {
      //console.log(snapshot.docs)
      renderCartItems(snapshot.docs)
    })

  } else {
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
    document.getElementById('userEmail').innerHTML = "Not found"
  }
};


// setup guides
const setUpUserData = (data) => {

  document.getElementById('mobileNo').innerHTML = data.phoneNumber;

  console.log(data.phoneNumber)
};

//render images from firebase storage

const featuredImageDisplay = (imageRef) => {
  var featuredProducts = document.getElementById('featuredProducts');
  imageRef.getDownloadURL().then(function (url) {

    // TODO: Display the image on the UI
    featuredProducts.innerHTML += '<div class="carousel-item "><img src="' + url + '" width="640px" height="360px""></div>';
    // featuredProducts.innerHTML += '<div class="carousel-item"><img src="'+url+'"></div>';
    //console.log(url);
    $('.carousel').carousel();
    const modal = document.querySelector('#featuredProducts');
    var instance = M.Carousel.getInstance(modal);        
    setInterval(() => {
      instance.next();
    }, 5000);
    
  }).catch(function (error) {
    // Handle any errors

  });


};

// display list of products got from snapshot
const productListDisplay = (data) => {
  // console.log(data)
  if (data.length) {

    data.forEach(doc => {
      const guide = doc.data();
      // console.log(doc.id)


      const tabCategoryItem = `
          
          <div class="col ${guide.productCategory} s6" style="display:none;">      
            <div class="card small">
              <div class="card-image">
                <img src="${guide.productURL}">          
              </div>
              <div class="card-content">
                <p>${guide.productName}<br>${guide.productCategory}<br>${guide.productCategoryDisplay}</p>
              </div>
              <div class="card-action">
                <button class="waves-effect waves-light btn"  id="${guide.productUID}" onclick="initiateToCart(event)">View</a>                
              </div>
            </div>
          </div>    
          `;

      tabsDisplayDiv.innerHTML += tabCategoryItem;

      let html = '';

      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${guide.productCategory} </div>
          <div class="collapsible-body white"> ${guide.productName}<br>${guide.productCategory}<br>${guide.productCategoryDisplay}<br>${guide.productURL} </div>
        </li>
      `;
      html += li;

      dataList.innerHTML += html;
    });

  } else {
    dataList.innerHTML = '<h5 class="center-align">Login to view Products</h5>';
  }
}

function displayCategoryProducts(e) {

  // hide all elements of tabDisplayDiv
  var rowItems = document.querySelectorAll('#tabsDisplayDiv .col');
  rowItems.forEach(element => {
    element.style.display = "none";
  });

  // display all products with id
  var tabId = e.target.id;
  var products = document.querySelectorAll(`.${tabId}`)

  products.forEach(element => {
    element.style.display = "block";
  });
}

function renderCartItems(cartItems) {
  var cartItemDisplay = document.getElementById('cartItem');

  if (cartItems.length) {
    cartItems.forEach(item => {
      const data = item.data();
      //console.log(item.id);
      //console.log(data)
      cartItemDisplay.innerHTML += `
      <div class="col s12">
        <div class="row">
          <div class="col s3">      
            <img src="${data.productURL}" alt="" width="80px" height="100px">
          </div>
          <div class="col s3">
            <span class="title">${data.productName}</span>
            <p>QTY : ${data.productQty}</p>            
          </div>
          <div class="col s6">
            <div class="row">
              <div class="col s2"><i onclick="incrementCartItem(event)" class="add_${item.id} material-icons">add</i></div>
              <div class="col s2"><input type="number" id="cartItemProductQty${item.id}" value="${data.productQty}"></div>
              <div class="col s2"><i onclick="decrementCartItem(event)" class="sub_${item.id} material-icons">remove</i></div>
            </div>
            <div class="row">
              <button onclick="removeFromCart(event)" id="${item.id}" class="btn red ">Remove</button>            
            </div>          
          </div> 
        </div>
      </div>
      `
    })
  }
}


function initiateToCart(e) {
  console.log(e.target.id);

  db.collection('products').onSnapshot(snapshot => {
    snapshot.docs.forEach(doc => {
      if (doc.data().productUID === e.target.id) {
        renderCartModalContent(doc.data());
        const modal = document.querySelector('#addToCartModal');
        M.Modal.getInstance(modal).open();
        console.log(doc.data().productUID);
      }
    });
  }, err => console.log(err.message));

}

function renderCartModalContent(data) {
  document.getElementById('cartModalProductName').innerText = data.productName;
  document.getElementById('cartModalProductURL').innerHTML = `<img src="${data.productURL}" width="200px" height="200px"`;
  document.getElementById('hiddenCartModalProductURL').innerText = data.productURL

}
