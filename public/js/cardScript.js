
$(document).ready(function () {
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });
    renderCart()
    $('select').formSelect();
})


var x = document.cookie.split("=")[1].split("_")[0];
//var uid = x.split('_')[0];
console.log('user id: ==>' + x);

function renderCart() {
    //alert('loaded')

    db.collection("users").doc(x).collection("cart").get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            // console.log('user cart data  ' + `${doc.id} => ${doc.data().productUID}`);
            // console.log('user full cart : ==>' + 'id ==>' + doc.data());
            // pass three parameters..
            // product collection id, product collection data, user's cart id
            getCartItem(doc.data().productID, doc.data().productQty, doc.data().varientName, doc.id);
        });
    });

}

function getCartItem(data, qty, varientName, cartid) {
    db.collection('products').doc('All Products').collection('Products').doc(data).get().then((snapshot) => {
        if (snapshot.data() == undefined) {
            // console.log('product data : ==>' + snapshot.id + '  data: ==>' + snapshot.data().productName)
            return;
        }
        renderCartProduct(snapshot, varientName, qty, cartid);
    })
}

function renderCartProduct(dataRef, varientName, qty, cartid) {

    var data = dataRef.data()



    // console.log('cart product id: ==>' + dataRef.id)
    // console.log('cart product data: ==>' + dataRef.data().productName + '== price ==> :' + dataRef.data().productPrice)
    let varientData = {
        productPrice: Number,
        discountPrice: Number
    }
    data.varients.forEach(varient => {
        if (varient.varientName == varientName) {
            varientData.productPrice = varient.priceOriginal,
                varientData.discountPrice = varient.discountPrice
        }
    })

    var cartTotaldiv = document.querySelector('#total-amount span')
    var cartSubTotaldiv = document.querySelector('#sub-total-amount span')
    cartSubTotaldiv.innerText = Number(cartSubTotaldiv.innerText) + varientData.discountPrice * qty;
    cartTotaldiv.innerText = Number(cartTotaldiv.innerText) + varientData.discountPrice * qty;

    console.log(varientData);
    
    const productCartTable = document.getElementById('product-cart-table')
    var tableItem = productCartTable.querySelector('tbody');

    tableItem.innerHTML += `
        <tr>
            <td><img src="${data.productURL}" alt="" width="50px" height="50px"></td>                
            <td>${data.productNameHindi}</td>
            <td>
            ₹ ${varientData.discountPrice}
            <br>
            <span style="text-decoration: line-through; text-decoration-thickness: 1px;">₹ ${varientData.productPrice}</span>
            </td>
            <td>
            <i class="material-icons red-text" id="dec_${cartid}_${qty}" onclick="incrementCart(event)">add_circle_outline</i>
            ${qty}
            <i class="material-icons red-text" id="inc_${cartid}_${qty}" onclick="decrementCart(event)">remove_circle_outline</i>
            </td>
            <td>₹ ${qty*varientData.discountPrice}</td>
            <td>
                <i class="material-icons" id="${cartid}" onclick="removeFromCart(event)">close</i>                                       
            </td>
        </tr>
    `
    //  console.log(productTable)
}

function removeFromCart(e) {

    const cartItemId = e.target.id;
    // console.log('cart item id: to be deteled ==>' + cartItemId)
    db.collection('users').doc(x).collection("cart")
        .doc(cartItemId).delete().then(function () {
            // location.reload();
            return location.reload();

        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

}

function incrementCart(e) {
    var cartItemId1 = e.target.id;
    console.log(cartItemId1)
    var incCartId = cartItemId1.split("_")[1]
    var pqty = Number(cartItemId1.split("_")[2]) + 1;
    console.log(incCartId)
    // [START update_document]
    var washingtonRef = db.collection('users').doc(x).collection("cart").doc(incCartId)

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        productQty: pqty
    }).then(function () {
        return location.reload();

    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    // [END update_document]
}

function decrementCart(e) {
    var cartItemId2 = e.target.id;
    var decCartId = cartItemId2.split("_")[1]
    var pdqty = Number(cartItemId1.split("_")[2]) - 1;
    // [START update_document]
    var washingtonRef = db.collection('users').doc(x).collection("cart").doc(decCartId)

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        productQty: pdqty
    })
        .then(function () {
            return location.reload();

        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    // [END update_document]



}

