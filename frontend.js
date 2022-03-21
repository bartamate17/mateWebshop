console.log('Frontend fut!');

var parsedProducts = [];
var likedProducts = [];
var clickLike = 0;
var messageCode = 0;

document.getElementById('clickLike').innerHTML = clickLike;

//AJAX - GET
function loadDoc(method, url, functDatabase) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            functDatabase(this.responseText);
        }
    };
    xhttp.open(method, url, true);
    xhttp.send();
};

//AJAX - POST
function writeDocument(objectData) {

    objectData.method == objectData.method || "GET",
        objectData.contentType == objectData.contentType || "application/x-www-form-urlencoded",
        objectData.data == objectData.data || {},
        objectData.success == objectData.success || function() {}

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            objectData.success(this.responseText);
        }
    };

    var dataObject = [];
    var dataString = "";

    if (objectData.contentType != "application/json") {
        for (let key in objectData.data) {
            dataObject.push = (`${key} = ${objectData.data[key]}`);
            dataString = dataObject.join("&");
        }
    } else {
        dataString = JSON.stringify(objectData.data);
    }

    xhttp.open(objectData.method, objectData.url + (objectData.method == "GET" ? "?" + dataString : ""));
    xhttp.send(dataString);
};

loadDoc("GET", "/products", function(getData) {

    parsedProducts = JSON.parse(getData);

    for (let product in parsedProducts) {

        document.getElementById('innerDataProduct').innerHTML += templateProduct(parsedProducts[product]);
        console.log(parsedProducts[product]);
    }
});

document.querySelector('.subscribeButton').addEventListener("click", function() {

    var nameProduct = document.getElementById('nameProduct').value;
    var numberProduct = document.getElementById('numberProduct').value;
    var guaranteeProduct = document.getElementById('guaranteeProduct').value;
    var distributorProduct = document.getElementById('distributorProduct').value;

    if (nameProduct != "" && numberProduct != "" && guaranteeProduct != "" && distributorProduct != "") {

        writeDocument({
            method: "POST",
            url: "/newproducts",
            contentType: "application/json",
            data: {
                megnevezes: document.getElementById('nameProduct').value,
                ar: document.getElementById('numberProduct').value,
                garancia: document.getElementById('guaranteeProduct').value,
                forgalmazo: document.getElementById('distributorProduct').value,
                kep: "image/no_image.jpg",
                id: Date.now()
            },
            success: function(resp) {
                console.log({ saved: "Ok!" });
                console.log(resp);

                document.getElementById('innerDataProduct').innerHTML = "";

                loadDoc("GET", "/products", function(getData) {

                    parsedProducts = JSON.parse(getData);

                    for (let product in parsedProducts) {

                        document.getElementById('innerDataProduct').innerHTML += templateProduct(parsedProducts[product]);
                        console.log(parsedProducts[product]);
                    }
                })

                document.getElementById('nameProduct').value = "";
                document.getElementById('numberProduct').value = "";
                document.getElementById('guaranteeProduct').value = "";
                document.getElementById('distributorProduct').value = "";
            }
        })
    } else {
        messageCode = 3;
        ModalWorking(messageCode);
    }
});

function likeFunction(data) {

    var getId = data.getAttribute("value-data");

    if (likedProducts.indexOf(getId) !== -1 && likedProducts.length != 0) {

        likedProducts.splice(data.getId, 1);
        clickLike -= 1;
        document.getElementById('clickLike').innerHTML = clickLike;
        data.style.color = "";

    } else if (likedProducts.length == 0) {
        likedProducts.push(getId);
        clickLike = 1;
        document.getElementById('clickLike').innerHTML = clickLike;
        data.style.color = "#62ab00";

    } else {
        likedProducts.push(getId);
        clickLike += 1;
        document.getElementById('clickLike').innerHTML = clickLike;
        data.style.color = "#62ab00";
    }
};

function editFunction(valueData) {

    var getId = valueData.getAttribute("value-data");
    console.log(getId);

    loadDoc("GET", "/products", function(getData) {

        parsedProducts = JSON.parse(getData);

        for (let product in parsedProducts) {

            if (parsedProducts[product].id == getId) {
                console.log(parsedProducts[product].megnevezes);

                document.getElementById('nameProduct').value = parsedProducts[product].megnevezes;
                document.getElementById('numberProduct').value = parsedProducts[product].ar;
                document.getElementById('guaranteeProduct').value = parsedProducts[product].garancia;
                document.getElementById('distributorProduct').value = parsedProducts[product].forgalmazo;

                document.querySelector('.subscribeButton').addEventListener("click", function() {

                    writeDocument({
                        method: "POST",
                        url: "/editproduct",
                        contentType: "application/json",
                        data: {
                            megnevezes: document.getElementById('nameProduct').value,
                            ar: document.getElementById('numberProduct').value,
                            garancia: document.getElementById('guaranteeProduct').value,
                            forgalmazo: document.getElementById('distributorProduct').value,
                            id: getId
                        },
                        success: function(resp) {
                            console.log({ edited: "Ok!" });
                            console.log(resp);

                            document.getElementById('innerDataProduct').innerHTML = "";

                            loadDoc("GET", "/products", function(getData) {

                                parsedProducts = JSON.parse(getData);

                                for (let product in parsedProducts) {

                                    document.getElementById('innerDataProduct').innerHTML += templateProduct(parsedProducts[product]);
                                    console.log(parsedProducts[product]);
                                }
                            })
                        }
                    })
                })
            }
        }
    })
};

document.getElementById("submitEmail").onclick = function() {

    var form5Example21 = document.getElementById("form5Example21").value;
    if (form5Example21 != "" && form5Example21.indexOf("@") != -1 && form5Example21.indexOf(".") != -1) {

        writeDocument({
            method: "POST",
            url: "/newsletter",
            contentType: "application/json",
            data: {
                email: document.getElementById("form5Example21").value,
                id: Date.now()
            },
            success: function(resp) {
                console.log({ saved: "Ok!" });
                console.log(resp);

                console.log("A messageCode === " + messageCode);
                ModalWorking(messageCode);
                document.getElementById("form5Example21").value = "";
            }
        });
        messageCode = 0;

    } else {
        messageCode = 2;
        ModalWorking(messageCode);
        document.getElementById("form5Example21").value = "";
    }
    messageCode = 0;
};

//MODAL - GET ERROR
function ModalWorking(messageCode) {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    if (messageCode == 0) {

        modal.style.display = "block";
        document.getElementById("modalError").innerText = "Sikeres hírlevél feliratkozás!";

    } else if (messageCode == 2) {

        modal.style.display = "block";
        document.getElementById("modalError").innerText = "Helytelen e-mail címet adtál meg!";

    } else if (messageCode == 3) {

        modal.style.display = "block";
        document.getElementById("modalError").innerText = "Nem töltöttél ki minden mezőt!";
    }


    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

var templateProduct = function(dataProduct) {

    return `<div class="card border col-sm-4 col-md-3 rounded p-3" style="margin: 0 auto">
                                <img class="card-img-top" src="${dataProduct.kep}" alt="Card image cap">
                                <div class="card-body text-center">
                                <span class="wish-icon"><i class="fa fa-heart-o" onClick="likeFunction(this)" value-data="${dataProduct.id}"></i></span>
                                    <h3 id="underlineTag" class="card-title mt-3" style="font-size: 15px">${dataProduct.forgalmazo}</h2>
                                    <p id="dataGuarantee" class="card-text">${dataProduct.garancia}</p>
                                    <div class="thumb-content ">
                                    <div class="productDescription">
                                    <h5 id="productName">${dataProduct.megnevezes}</h5>
                                    </div>
                                    <p class="item-price "><span>${dataProduct.ar}</span></p>
                                    <button id="editProduct" onClick="editFunction(this)" class="btn btn-warning" value-data="${dataProduct.id}">Szerkesztés</button> 
                                </div>
                            </div>`
};