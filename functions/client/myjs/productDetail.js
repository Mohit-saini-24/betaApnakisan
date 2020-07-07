//alert(document.getElementById('productId').value)
$('.carousel').carousel()
$('.tabs').tabs()
/* 
db.collection('products').doc('All Products').collection('Products').doc(document.getElementById('productId').value).get().then((snapshot) => {
    console.log(snapshot.data())
    if (snapshot.data() == undefined) {
        console.log('product data : ==>' + snapshot.id + '  data: ==>' + snapshot.data().productName)
        return;
    }
    renderProductDetails(snapshot.data());
})

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