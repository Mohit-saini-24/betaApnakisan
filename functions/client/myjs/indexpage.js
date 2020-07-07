
$(document).ready(async function () {

    $('.carousel').carousel();

    $('.featured__controls li').on('click', function () {
        $('.featured__controls li').removeClass('active');
        $(this).addClass('active');
    });

    $('.sidenav').sidenav();

    $(".categories__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            }
        }
    });

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
            setInterval(changeHero(snapshot.data()), 5000);
        })
    }).catch(error => { console.log('error getting hero products..' + error) })


})
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // document.cookie = `userid=${user.uid}`;
        console.log(user.providerData[0].phoneNumber);
        db.collection('users').doc(user.uid).set({
            // need to change
            phoneNumber: user.providerData[0].phoneNumber
        })
        document.getElementById('user-phone-number').innerText = user.providerData[0].phoneNumber;
        return db.collection('users').doc(user.uid).collection('cart').onSnapshot(snapshot => {
            console.log(snapshot.docs.length);
            document.getElementById('cartQty').innerText = snapshot.docs.length;
        })
    } else {
        console.log('No user');
        // No user is signed in.
    }
});




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
    var userid = document.cookie.split("=")[1];
    console.log(userid)
    if (!userid) {
        alert('Please Login');
        return window.location.href = '/login'
    }

    var cart = {
        productQty: 1,
        productID: e.target.id.split("_")[0],
        varientName: e.target.id.split("_")[1]
    }
    var cartRef = db.collection('users').doc(userid);

    cartRef.collection('cart').add(cart)
        .then(function (docRef) {
            //renderCartItems(docRef)
            console.log("Document written with ID: ", docRef.id);

        }).catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

function logout() {
    firebase.auth().signOut().then(function () {
        document.cookie = `userid='';Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}


