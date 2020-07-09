
$(document).ready(async function () {

    $('.carousel').carousel();

    $('.featured__controls li').on('click', function () {
        $('.featured__controls li').removeClass('active');
        $(this).addClass('active');
    });

    $('.sidenav').sidenav();
    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });
    var heroQuery = db.collection('products').doc('All Products').collection('Products').orderBy("sold", "desc").limit(5);

    await heroQuery.get().then((querySnapshot) => {
        querySnapshot.forEach(snapshot => {
            // console.log(snapshot.data());
            changeHero(snapshot.data())
        })
    }).catch(error => { console.log('error getting hero products..' + error) })


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //document.cookie = `userid=${user.uid}`;
            //console.log(user.providerData[0].phoneNumber);
            db.collection('users').doc(user.uid).collection('cart').onSnapshot(snapshot => {
                document.cookie = `userid=${user?.uid}_usercart=${snapshot.docs.length}_userphonenumber=${user.providerData[0].phoneNumber}; Path=/;`;
                //console.log(snapshot.docs.length);

            })

            console.log(document.cookie)
            const usercookie = document.cookie.split("=");
            console.log(usercookie)
            const userphonenumber = usercookie[3]
            //const useruid = usercookie[1].split("_")[0]
            const usercartlength = usercookie[2].split("_")[0]
            document.getElementById('cartQty').innerText = usercartlength;
            document.getElementById('user-phone-number').innerText = userphonenumber;
        } else {
            console.log('No user');
            // No user is signed in.
        }
    });

    db.collection('products').doc('search').get().then((querySnapshot) => {
        // console.log(querySnapshot.data().search);
        displaySearchProducts(querySnapshot.data().search); 
    })
})
function changeHero(data) {

    const heroContainer = document.querySelector('.hero__item');
    if (heroContainer == null) {
        return;
    }

    heroContainer.innerHTML = `
        <div class="card-image">
                    <img class="responsive-img" src="${data.productURL}">
                    <div class="card-title black-text" style="font-weight:bolder">
                    ${data.productNameHindi}
                        <br><br>
                        ${data.company}
                    </div>
                </div>
                <div class="card-content">
                    <a href="#">View Product</a>
                    <button>Shop Now</button>
                </div>
        `

}

var featuredQuery = db.collection('products').doc('All Products').collection('Products');
featuredQuery.get().then((querySnapshot) => {
    renderFeatureProduct(querySnapshot);
})

function renderFeatureProduct(products) {
    const featuredFilter = document.querySelector('.featured__filter');
    if (featuredFilter == null) {
        return;
    }
    products.forEach(product => {
        var element = product.data();
        // console.log(element)
        /* $('.set-bg').each(function () {
            var bg = element.data().productURL
            $(this).css('background-image', 'url(' + bg + ')');
        }); */
        featuredFilter.innerHTML += `
        <div class="col m4 col s6 mix ${element.category}">
            <div class="featured__item">
                <div class="featured__item__pic set-bg" data-setbg="${element.productURL}" style="background-image: url('${element.productURL}');">
                    <ul class="featured__item__pic__hover">
                        <li><a><i id="${product.id}_${element.varients[0].varientName}" onclick="addToCart(event)" class="fa fa-shopping-cart"></i></a></li>
                        <li><a href="/product/${product.id}"><i class="material-icons">remove_red_eye</i></a></li>
                    </ul>
                </div>
                <div class="featured__item__text">
                    <h6><a href="#">${element.productNameHindi}--${element.company}</a></h6>
                    <h5>Rs ${element.varients[0].discountPrice}</h5>
                    <h5>${element.varients[0].varientName}</h5>
                </div>
            </div>
        </div>
        `

        //console.log(attribute)
    });

    /*------------------
        Gallery filter
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    $('.featured__controls li').on('click', function () {
        $('.featured__controls li').removeClass('active');
        $(this).addClass('active');
    });
    if ($('.featured__filter').length > 0) {
        var containerEl = document.querySelector('.featured__filter');
        var mixer = mixitup(containerEl);
    }
}


function addToCart(e) {
    var x = document.cookie;
    console.log(x);
    if (!x) {
        return window.location.href = '/login'
    }
    const usercookie = document.cookie.split("=");
    const useruid = usercookie[1].split("_")[0];
    console.log(useruid)
    if (!useruid) {
        alert('Please Login');
        return window.location.href = '/login'
    }
    var cartRef = db.collection('users').doc(useruid);
    var update = false;
    cartRef.collection('cart').get().then((querySnapshot) => {
        querySnapshot.forEach(snapshot => {
            if (snapshot.data().productID == e.target.id.split("_")[0]) {
                var newProductQty = Number(snapshot.data().productQty) + 1;
                return cartRef.collection('cart').doc(snapshot.id).update({
                    productQty: newProductQty
                }).then(function () {
                    M.toast({ html: 'Successfully increment to Cart', classes: 'rounded' });
                    update = true;
                    console.log('update after toast..' + update)

                })
            }
        })
    }).then(() => {
        console.log('update before if ' + update)
        if (update) {
            return;
        } else {
            var cart = {
                productQty: 1,
                productID: e.target.id.split("_")[0],
                varientName: e.target.id.split("_")[1]
            }
            return cartRef.collection('cart').add(cart)
                .then(function (docRef) {
                    //renderCartItems(docRef)
                    M.toast({ html: 'Successfully Added to Cart', classes: 'rounded' });
                    console.log("Document written with ID: ", docRef.id);

                }).catch(function (error) {
                    console.error("Error adding document: ", error);
                });
        }

    })

}
function displaySearchProducts(products){
    var ul = document.getElementById('search-content');
    var i=0;
    products.forEach(product => {
        ul.innerHTML += `
        <li class="collection-item avatar" onclick="viewProduct(event)" style="display: none;">
            <img src="${product.productURL}" alt="" class="circle">
            <span class="title black-text ${product.productId}" id="${i}-li-item">${product.productName} ${product.company}</span>
        </li>
        `;
        i+=1;
    })
}
function openSearch(){
    document.getElementById('search-div').style.display = "";    
    document.getElementById('search-content').style.display = "";
    
}

function searchProductLi(){
    var input = document.getElementById('search-input');

    // Declare variables
    var filter, ul, li, a, i, txtValue;
    filter = input.value.toUpperCase();
    ul = document.getElementById("search-content");
    li = ul.querySelectorAll('li');
    
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        var b = document.getElementById(i+'-li-item').innerText.split()[0];
        //console.log(b)
//        a = li[i].getElementsByClassName('title').innerText.split()[0];
  //      console.log(a)
        txtValue = b;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function viewProduct(e){
    var productid = e.target.className.split(" ")[2];
    console.log(productid)
    db.collection('products').doc('All Products').collection('Products').doc(productid).get().then((querySnapshot)=>{
        console.log(querySnapshot.data())
    })
}

function logout() {
    firebase.auth().signOut().then(function () {
        document.cookie = `userid=''_usercart=''_userphonenumber='';Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}


