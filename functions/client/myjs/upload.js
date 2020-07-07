
// signup
// alert('upload Script')


$(document).ready(function () {

    $('select').formSelect()
})

/* db.collection("products").get().then((querySnapshot) => {
    renderUl(querySnapshot);

}) */


function openProductRegisterForm() {
    document.getElementById('add-new-product').style.display = "";
}

function openUpdateProductForm() {
    document.getElementById('update-product-form').style.display = "";
}

function searchProducts() {
    var category = document.getElementById('categoryName').value;
    db.collection('products').doc(category).collection('All Products').get().then((querySnapshot) => {
        renderProducts(querySnapshot, category);
    })
}

function renderProducts(products, category) {
    var data = products.docs;
    var ul = document.getElementById('category-products');
    ul.style.display = "";
    data.forEach(product => {
        ul.innerHTML += `
        <li class="collection-item avatar">
        <img src="${product.data().productURL}" alt="" class="circle">
        <span class="title">${product.data().name}</span>
        <button class="btn green darken-2 z-depth-0 secondary-content" onclick="viewProduct(event)" id="${category}_${product.id}">View Product</button>
        </li>
        `;
    })
}

function viewProduct(e) {
    var cred = e.target.id;
    var category = cred.split("_")[0];
    var productId = cred.split("_")[1];
    db.collection('products').doc(category).collection('All Products').doc(productId).get().then((querySnapshot) => {
        //console.log(querySnapshot.data().productVarient);
        viewProductDetails(querySnapshot, category);
    });
}

function viewProductDetails(product, category) {
    var productDetail = document.getElementById('product-detail');
    productDetail.style.display = "";
    var detailSpan = productDetail.querySelector('#detail-span')
    detailSpan.innerHTML =
        `
        <div class="col s12 m6">
            <div class="row">
                <h3>${product.data().name}</h3>
            </div>
            <div class="row">
                <h5>${product.data().productNameHindi}</h5>
            </div>
            <div class="row">
                <h5>${product.data().company}</h5>
            </div>
            <div class="row">
                    <p>${product.data().productDescription}</p>
            </div>
            <div class="row">
                <div class="col">
                    <button class="btn green darken-2 z-depth-0" onclick="editProduct(event)" id="edit_${category}_${product.id}">Edit Product Description</button>
                </div>
                <div class="col">
                    <button class="btn red darken-2 z-depth-0" onclick="deleteProduct(event)" id="del_${category}_${product.id}">Delete Product</button>
                </div>
                <div class="col">
                    <button class="btn blue darken-2 z-depth-0" onclick="addProductVarient(event)" id="addVar_${category}_${product.id}">Add Varient</button>
                </div>        
            </div>
        </div>
    `

    var varients = product.data().productVarient
    varients.forEach(varient => {
        var item = productDetail.querySelector('#varient-span');
        item.innerHTML += `
        <div class="row">
            <div class="col s12">
                <h5>
                    Varient Name :${varient.productVarient}
                </h5><br>
                <h5>
                    Discount Price :${varient.discountPrice}
                </h5><br>
                <h5>
                    Original Price :${varient.productPrice}
                </h5><br>
                <h5>
                    Varient Qty :${varient.productQty}
                </h5><br>
            </div>
            <div class="col s6">
                <button class="btn green darken-2 z-depth-0" onclick="editProductVarient(event)" id="editVar_${category}_${product.id}">Edit Product Varient</button>
            </div>
            <div class="col s6">
                <button class="btn red darken-2 z-depth-0" onclick="deleteProductVarient(event)" id="delVar_${category}_${product.id}_${varient.productVarient}">Delete Product Varient</button>
            </div>
        </div>
        `
    })
}

function editProduct(e) {
    document.getElementById('product-detail').querySelector('#varient-span').style.display = "none";
    document.getElementById('edit-product-detail-form').style.display = "";
    var cred = e.target.id;
    var category = cred.split("_")[1];
    var productId = cred.split("_")[2];
    document.getElementById('edit-product-category-value').value = category;
    document.getElementById('edit-product-id-value').value = productId;
}

function editProductDescriptionDB() {
    var category = document.getElementById('edit-product-category-value').value;
    var productId = document.getElementById('edit-product-id-value').value;

    var newProductDescription = document.getElementById('productDescription').value;

    db.collection('products').doc(category).collection('All Products').doc(productId).update({
        productDescription: newProductDescription
    }).catch(error => console.log('error updating product.......' + error))
}

function deleteProduct(e) {
    var cred = e.target.id.split('_');

    var category = cred[1];
    var productId = cred[2];
    // [START delete_document]
    db.collection("products").doc(category).collection('All Products').doc(productId).delete().then(function() {
        console.log("Document successfully deleted!");
        location.reload()
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    // [END delete_document]
 }

function addProductVarient(e) {
    document.getElementById('product-detail').querySelector('#varient-span').style.display = "none";
    document.getElementById('add-product-varient-form').style.display = "";
    var cred = e.target.id.split("_");
    var category = cred[1];
    var productId = cred[2];
    document.getElementById('add-product-category-value').value = category;
    document.getElementById('add-product-id-value').value = productId;
}

function addProductVarientDB() {
    var category = document.getElementById('add-product-category-value').value;
    var productId = document.getElementById('add-product-id-value').value;

    var fieldValue = firebase.firestore.FieldValue;

    var newProductVarient = document.getElementById('newProductVarient').value;
    var newProductVarientQty = document.getElementById('newProductVarientQty').value;
    var newProductVarientPrice = document.getElementById('newProductVarientPrice').value;
    var newProductVarientDiscountPrice = document.getElementById('newProductVarientDiscountPrice').value;
    db.collection('products').doc(category).collection('All Products').doc(productId).update({
        productVarient: fieldValue.arrayUnion({
            productVarient: newProductVarient,
            productQty: newProductVarientQty,
            productPrice: newProductVarientPrice,
            discountPrice: newProductVarientDiscountPrice
        })
    }).then(() => {
        return location.reload();
    }).catch(error => console.log('error adding varient........' + error));
}

function editProductVarient(e) {
    // document.getElementById('product-detail').querySelector('#varient-span').style.display = "none";
    document.getElementById('edit-product-varient-form').style.display = "";
    var cred = e.target.id.split("_");
    var category = cred[1];
    var productId = cred[2];
    document.getElementById('edit-product-varient-category-value').value = category;
    document.getElementById('edit-product-varient-id-value').value = productId;
}

function editProductVarientDB() {
    var category = document.getElementById('edit-product-varient-category-value').value;
    var productId = document.getElementById('edit-product-varient-id-value').value;

    var fieldValue = firebase.firestore.FieldValue;

    var newEditProductVarient = document.getElementById('newEditProductVarient').value;
    var newEditProductVarientQty = document.getElementById('newEditProductVarientQty').value;
    var newEditProductVarientPrice = document.getElementById('newEditProductVarientPrice').value;
    var newEditProductVarientDiscountPrice = document.getElementById('newEditProductVarientDiscountPrice').value;
    db.collection('products').doc(category).collection('All Products').doc(productId).update({
        productVarient: fieldValue.arrayUnion({
            productVarient: newEditProductVarient,
            productQty: newEditProductVarientQty,
            productPrice: newEditProductVarientPrice,
            discountPrice: newEditProductVarientDiscountPrice
        })
    }).then(() => {
        return location.reload();
    }).catch(error => console.log('error adding varient........' + error))
}

async function deleteProductVarient(e) {
    var fieldValue = firebase.firestore.FieldValue;

    var cred = e.target.id.split("_");
    var category = cred[1];
    var productId = cred[2];
    var varientName = cred[3];


    var allVarients = []
    await db.collection('products').doc(category).collection('All Products').doc(productId).get().then((querySnapshot) => {
        if (querySnapshot.data().productVarient == null) return console.log('no varient found')
        querySnapshot.data().productVarient.forEach(varient => {
            allVarients.push({
                name: varient.productVarient,
                qty: varient.productQty,
                discountPrice: varient.discountPrice,
                price: varient.productPrice
            });
        });
    }).catch(error => console.log('error removing varient......' + error));
    console.log(allVarients.length)
    for (let index = 0; index < allVarients.length; index++) {
        const varient = allVarients[index];
        if (varient.name == varientName) {
            console.log(varient.name, varient.qty, varient.price, varient.discountPrice);
            delete allVarients[index];
        } else {
            console.log('notfound')
        }
    }
    console.log(allVarients.length)

}

function registerNewProduct() {
    document.getElementById('add-product-to-category').style.display = "";
}

function addNewProductToCategory() {
    var fieldValue = firebase.firestore.FieldValue;

    var categoryName = document.getElementById('categoryName').value;
    var companyName = document.getElementById('productCompany-add').value;
    var productName = document.getElementById('productName-add').value;
    var productNameHindi = document.getElementById('productNameHindi-add').value;
    var productDescription = document.getElementById('productDescription-add').value;

    var productVarient = document.getElementById('newProductVarient-add').value;
    var productQty = document.getElementById('newProductVarientQty-add').value;
    var productPrice = document.getElementById('newProductVarientPrice-add').value;
    var discountPrice = document.getElementById('newProductVarientDiscountPrice-add').value;



    var storageRef = firebase.storage().ref('images').child(`${categoryName}_${companyName}_${productName}.jpg`);
    storageRef.getDownloadURL().then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'

        db.collection('products').doc(categoryName).collection('All Products').add({
            company: companyName,
            name: productName,
            productNameHindi: productNameHindi,
            productDescription: productDescription,
            sold: 0,
            productURL: url,
            productVarient: fieldValue.arrayUnion({
                productVarient: productVarient,
                productQty: productQty,
                productPrice: productPrice,
                discountPrice: discountPrice
            })
        }).then(function (docRef) {
            db.collection('products').doc(categoryName).collection('search').doc('products').update({
                search: fieldValue.arrayUnion({
                    productName: productName,
                    sold: 0,
                    productURL: url,
                    productId: docRef.id
                })
            }).then(() => {

                location.reload();
            }).catch(error => { console.log('error saving to database.......... =>' + error) })
        }).catch(error => console.log('add error root.........' + error))


    }).catch(function (error) {
        // Handle any errors
        console.log('file not found ==>' + error + '===>');
        var storageRef = firebase.storage().ref('images').child(`${categoryName}_${companyName}_${productName}.png`);
        storageRef.getDownloadURL().then(function (url) {
            // `url` is the download URL for 'images/stars.jpg'

            db.collection('products').doc(categoryName).collection('All Products').add({
                company: companyName,
                name: productName,
                productNameHindi: productNameHindi,
                productDescription: productDescription,
                sold: 0,
                productURL: url,
                productVarient: fieldValue.arrayUnion({
                    productVarient: productVarient,
                    productQty: productQty,
                    productPrice: productPrice,
                    discountPrice: discountPrice
                })
            }).then(function (docRef) {
                db.collection('products').doc(categoryName).collection('search').doc('products').update({
                    search: fieldValue.arrayUnion({
                        productName: productName,
                        sold: 0,
                        productURL: url,
                        productId: docRef.id
                    })
                }).then(() => {
                    location.reload();
                }).catch(error => { console.log('error saving to database.......... =>' + error) })
            }).catch(error => console.log('add error root.........' + error));

        }).catch(function (error) {
            // Handle any errors
            console.log('file not found ==>' + error + '===>')
        });
    });

}

function registerNewCategory(){
    document.getElementById('add-new-category-form').style.display = "";
}

function registerNewCategoryProduct() {
    var fieldValue = firebase.firestore.FieldValue;

    var categoryName = document.getElementById('productCategory-add').value;
    var companyName = document.getElementById('productCompany-add').value;
    var productName = document.getElementById('productName-add').value;
    var productNameHindi = document.getElementById('productNameHindi-add').value;
    var productDescription = document.getElementById('productDescription-add').value;

    var productVarient = document.getElementById('newProductVarient-add').value;
    var productQty = document.getElementById('newProductVarientQty-add').value;
    var productPrice = document.getElementById('newProductVarientPrice-add').value;
    var discountPrice = document.getElementById('newProductVarientDiscountPrice-add').value;



    var storageRef = firebase.storage().ref('images').child(`${categoryName}_${companyName}_${productName}.jpg`);
    storageRef.getDownloadURL().then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'

        db.collection('products').doc(categoryName).collection('All Products').add({
            company: companyName,
            name: productName,
            productNameHindi: productNameHindi,
            productDescription: productDescription,
            sold: 0,
            productURL: url,
            productVarient: fieldValue.arrayUnion({
                productVarient: productVarient,
                productQty: productQty,
                productPrice: productPrice,
                discountPrice: discountPrice
            })
        }).then(function (docRef) {
            db.collection('products').doc(categoryName).collection('search').doc('products').set({
                search: fieldValue.arrayUnion({
                    productName: productName,
                    sold: 0,
                    productURL: url,
                    productId: docRef.id
                })
            }).then(() => {

                location.reload();
            }).catch(error => { console.log('error saving to database.......... =>' + error) })
        }).catch(error => console.log('add error root.........' + error))


    }).catch(function (error) {
        // Handle any errors
        console.log('file not found ==>' + error + '===>');
        var storageRef = firebase.storage().ref('images').child(`${categoryName}_${companyName}_${productName}.png`);
        storageRef.getDownloadURL().then(function (url) {
            // `url` is the download URL for 'images/stars.jpg'

            db.collection('products').doc(categoryName).collection('All Products').add({
                company: companyName,
                name: productName,
                productNameHindi: productNameHindi,
                productDescription: productDescription,
                sold: 0,
                productURL: url,
                productVarient: fieldValue.arrayUnion({
                    productVarient: productVarient,
                    productQty: productQty,
                    productPrice: productPrice,
                    discountPrice: discountPrice
                })
            }).then(function (docRef) {
                db.collection('products').doc(categoryName).collection('search').doc('products').set({
                    search: fieldValue.arrayUnion({
                        productName: productName,
                        sold: 0,
                        productURL: url,
                        productId: docRef.id
                    })
                }).then(() => {
                    location.reload();
                }).catch(error => { console.log('error saving to database.......... =>' + error) })
            }).catch(error => console.log('add error root.........' + error))


        }).catch(function (error) {
            // Handle any errors
            console.log('file not found ==>' + error + '===>')
        });
    });

}

function searchCat() {
    var input = document.getElementById('sproduct-category');
    // Declare variables
    var filter, ul, li, a, i, txtValue;
    filter = input.value.toUpperCase();
    ul = document.getElementById("product-category");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].innerText.split()[0];
        // console.log(a)
        txtValue = a;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function addValueToInput(e) {
    console.log(document.getElementById('sproduct-category').value = e.target.innerText);
    document.getElementById('sproduct-category').value = e.target.innerText;
}

function searchCategory() {
    const category = document.getElementById('sproduct-category').value;
    var ul = document.getElementById('search-category');
    ul.style.display = "";

    /* db.collection('products').doc(category).collection('All Products').get().then((querySnapshot) => {
        querySnapshot.docs.forEach((product) => {
            
        })
    }) */
    db.collection('products').doc(category).get().then((querySnapshot) => {
        if (querySnapshot.exists) {
            console.log("Document data:", querySnapshot.docs);
            const allProducts = querySnapshot.data().companies;
            companies.forEach((company) => {
                ul.innerHTML += `
                <li class="collection-item">
                    <div>
                        ${company}
                        <button id="${category}-${company}" onclick="openCompany(event)" class="secondary-content">View Products</button>
                        <button id="add-${category}-${company}" onclick="addProduct(event)" class="secondary-content">Add Product</button>
                    </div>
                </li>
                `
            })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
    // [END get_document]
}

function addCategory() {
    var addCompany = document.getElementById('add-company')
    addCompany.style.display = "";
}

function registerProduct() {

    var fieldValue = firebase.firestore.FieldValue;

    /* var categoryName = document.getElementById('categoryName').value.toUpperCase();
    var companyName = document.getElementById('companyName').value.toUpperCase();
    var productName = document.getElementById('productName').value.toUpperCase();
    var productVarient = document.getElementById('productVarient').value;
    var productQty = document.getElementById('productQty').value;
    var productPrice = document.getElementById('productPrice').value;
    var productDescription = document.getElementById('productDescription').value;
 */
    var categoryName = 'Insecticide';
    var companyName = 'FMC';
    var productName = 'Marshal 25% EC';
    var productNameHindi = 'मार्शल 25% ईसी';
    var productVarient = '250 ML';
    var productQty = 10;
    var productPrice = 350;
    var discountPrice = 300;
    var productDescription = `
    कार्बोसल्फान का मार्शल 25% ईसी सूत्रीकरण, कई फसलों में व्यापक स्पेक्ट्रम कीट नियंत्रण प्रदान करने वाला एक नेता है। मार्शल 80 से अधिक देशों में पंजीकृत एक प्रणालीगत, व्यापक स्पेक्ट्रम कार्बामेट कीटनाशक है।

    मार्शल की अद्वितीय रसायन विज्ञान उपज और गुणवत्ता को अधिकतम करने के लिए चावल और मिर्च में कीटों का बेहतर नियंत्रण प्रदान करता है। मार्शल द्वारा प्रदान की गई सुरक्षा किसान को एफिड्स, थ्रिप्स, हॉपर, बोरर्स आदि जैसे अधिकांश चूसने वाले और लेपिडोप्टेरस कीटों से लड़ने में मदद करती है।    
    `;

    //    var storageRef = firebase.storage().ref('images').child(`${categoryName}_${companyName}_${productName}.jpg`);
    var storageRef = firebase.storage().ref('images').child(`${categoryName}_${companyName}_Marshal (2).png`);

    console.log(storageRef.location)
    storageRef.getDownloadURL().then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'

        db.collection('products').doc(categoryName).collection('All Products').add({
            company: companyName,
            name: productName,
            productNameHindi: productNameHindi,
            productDescription: productDescription,
            sold: 0,
            productURL: url,
            productVarient: fieldValue.arrayUnion({
                productVarient: productVarient,
                productQty: productQty,
                productPrice: productPrice,
                discountPrice: discountPrice
            })
        }).then(function (docRef) {
            db.collection('products').doc(categoryName).collection('Top Products').add({
                productId: docRef.id,
                company: companyName,
                name: productName,
                productNameHindi: productNameHindi,
                productDescription: productDescription,
                sold: 0,
                productURL: url,
                productVarient: fieldValue.arrayUnion({
                    productVarient: productVarient,
                    productQty: productQty,
                    productPrice: productPrice,
                    discountPrice: discountPrice
                })
            }).then(() => {
                db.collection('products').doc(categoryName).collection('search').doc('products').set({
                    search: fieldValue.arrayUnion({
                        productName: productName,
                        sold: 0,
                        productURL: url,
                        productId: docRef.id
                    })
                }).then(() => {

                    location.reload();
                }).catch(error => { console.log('error saving to database.......... =>' + error) })
            })
        }).catch(error => console.log('add error root.........' + error))


    }).catch(function (error) {
        // Handle any errors
        console.log('file not found ==>' + error + '===>')
    });

}

function openCompany(e) {
    var cred = e.target.id;
    const category = cred.split("-")[0];
    const company = cred.split("-")[1]
    var productsList = document.getElementById('products-list');
    productsList.style.display = "";
    db.collection('products').doc(category).collection(company).get().then((products) => {
        console.log(products.docs);
        products.docs.forEach(product => {
            console.log(product.id + '==>' + product.data().productVarient);
            productsList.innerHTML =
                `
                <li class="collection-item avatar">
                <img src="${product.data().productURL}" alt="" class="circle">
                <span class="title">${product.id}</span>
                <p>First Line <br>
                    ${product.data().productDescription}, + , ${product.data().productQty}, + rs. + ${product.data().productPrice}
                </p>
                <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                </li>
               ` + productsList.innerHTML;
        })

    }).catch(function (error) {
        console.log('error getting data ==>' + error);
    })
    console.log(category, company);

}


function addProduct(e) {
    var cred = e.target.id;
    var category = cred.split("-")[1];
    var company = cred.split("-")[2];
    document.getElementById('add-product-in-company').style.display = "";
    document.getElementById('category-name-for-add').innerText = category;
    document.getElementById('company-name-for-add').innerText = company;
}


function login() {

    const name = document.getElementById('name').value;
    var phoneNumber = document.getElementById('phoneNumber').value;
    phoneNumber = '+91' + phoneNumber;

    // [START get_all_users]
    // [START listen_for_users]
    db.collection("users")
        .onSnapshot(function (snapshot) {
            snapshot.forEach(function (userSnapshot) {
                var data = userSnapshot.data()
                //console.log(userSnapshot.data().phoneNumber)
                if (data.name == name && data.phoneNumber == phoneNumber) {
                    console.log(userSnapshot.id);
                    document.cookie = `uid=${userSnapshot.id}`
                    window.location.href = '/'
                    return;
                }
            });
        });
}



function registerUser() {
    alert('upload Script')
    var name = document.getElementById('name').value;
    var phoneNumber = document.getElementById('phoneNumber').value;
    phoneNumber = '+91' + phoneNumber;
    return db.collection('users').add({
        name: name,
        phoneNumber: phoneNumber
    }).then((docref) => {
        db.collection('users').doc(docref.id).collection("cart").add({

            productName: 'default',
            productQty: 0,
            productUID: 'default',
            productURL: 'default'
        }).then((docRef) => {
            console.log('user created with cart..' + docRef)
        });
    });



}



function proceedToCheckout() {
    return
}








