//

$(document).ready(function(){

    $('.carousel').carousel()
    $('.tabs').tabs()
    var productid = document.getElementById('productId').value;
    //alert(productid)
    db.collection('products').doc('All Products').collection('Products').doc(productid).onSnapshot(snapshot => {
        console.log(snapshot.data())
    }).catch(error => console.log('error fetching data ....'+error))    
})

 

/*
function renderProductDetails(product){
    document.getElementById('product-detail-image').innerHTML = `
    <img src="${product.productURL}">
    `
    document.getElementById('product-detail-name').innerText = product.productNameHindi;
    product.varients.forEach(vairent => {
        document.getElementById('product-detail-varients').innerHTML += `
            <div class="col">
                <button class="btn green darken-2 z-depth-0">${vairent.vairentName}</button>
            </div>
        `        
    });
    document.getElementById('product-detail-description').innerText = product.productDescription;

} */