
// CODE TO ADD SAVING CATEGORY

console.log("My world");
    var config = {
        apiKey: "AIzaSyAy0YE0IICU1S48Z81yyJh-feRx63kCikQ",
        authDomain: "mywallpaperapp-1ce27.firebaseapp.com",
        databaseURL: "https://mywallpaperapp-1ce27.firebaseio.com",
        projectId: "mywallpaperapp-1ce27",
        storageBucket: "mywallpaperapp-1ce27.appspot.com",
        messagingSenderId: "148594201157",
        appId: "1:148594201157:web:c645eacfabcca74c"
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }else{
        firebase.app();
    }
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    console.log("aa toh gya h");
    $("#selected-thumbnail").hide();
        function previewThumbnail(thumbnail){
            if(thumbnail.files && thumbnail.files[0]){
                var reader = new FileReader();

                reader.onload = function(e){
                    $("#selected-thumbnail").attr('src',e.target.result);
                    $("#selected-thumbnail").fadeIn();
                }

            reader.readAsDataURL(thumbnail.files[0]);
        }
    }
    $("#category-thumbnail").change(function(){
        previewThumbnail(this);
    });
        
    $("#save-category").click(function(){

        $("#category-name").removeClass("is-invalid");
        $("#category-desc").removeClass("is-invalid");
        $("#category-thumbnail").removeClass("is-invalid");

        var name=$("#category-name").val();
        var desc=$("#category-desc").val();
        var thumbnail=$("#category-thumbnail").prop("files")[0];

        //Validations

        if(!name){
            $("#category-name").addClass("is-invalid");
                return;
            }

            if(!desc){
                $("#category-desc").addClass("is-invalid");
                return;
            }

            if(thumbnail==null){
                $("#category-thumbnail").addClass("is-invalid");
                return;
            }

            if($.inArray(thumbnail["type"],validImageTypes)<0){
                $("#category-thumbnail").addClass("is-invalid");
                return;
            }

            //upload the image ad save category
            
            var database = firebase.database().ref("categories/"+name);

            database.once("value").then(function(snapshot){

                if(snapshot.exists()){
                    $("#result").attr("class","alert alert-danger");
                    $("#result").html("Category already exist.");
                    resetForm();
                }else{
                    //1. upload the selected thumbnail to firebase storage

                    var cat_name = thumbnail["name"];
                    var ext = cat_name.substring(cat_name.lastIndexOf("."), cat_name.length);

                    //current time in millis
                    var thumbname = new Date().getTime();
                    var image=thumbname+ext

                    var storageRef =firebase.storage().ref(name + "/" + image);
                    var uploadTask = storageRef.put(thumbnail);

                    uploadTask.on("state_changed",
                    
                        function progress(snapshot){
                            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("current progress",percentage)
                            $("#upload-progress").html(percentage + "%");
                            $("#upload-progress").attr("style"," width: "+percentage+"%");
                        },
                        function error(err){
                            console("state_changed error","yes")
                            $("#result").attr("class","alert alert-danger");
                            $("#result").html(err.message);
                        },
                        function complete(){
                            var thumbnailUrl=storageRef.getDownloadURL();
                            //console.log("thumbnailUrl",thumbnailUrl)
                            
                            storageRef.getDownloadURL().then(function(uri,error){
                                if(!error){
                                    console.log("thumbnailUrl",uri)
                                    thumbnailUrl=uri;
                                    var cat = {
                                        "thumbnail": thumbnailUrl,
                                        "desc": desc
                                    }
                                    database.set(cat, function(err){
                                        if(!err){
                                            console.log("setting error","no")
                                            $("#result").attr("class","alert alert-success");
                                            $("#result").html("Category added");
                                        }else{
                                            console.log("setting error","yes")
                                            $("#result").attr("class","alert alert-danger");
                                            $("#result").html(err.message);
                                        }
                                    });
                                }else{
                                    console.log("error in getting url",error)
                                }
                            })
                            resetForm();
                        }
                    )
                }
            });

        });


        function resetForm(){
            $("#category-form")[0].reset();
            $("#selected-thumbnail").fadeOut();
            $("#upload-progress").html("Completed")
        }

        var dbCategories = firebase.database().ref("categories")
        console.log("chl to rha h")

        dbCategories.on("value",function(categories){
            console.log("value changed")

            if(categories.exists()){
                var categoriesHtml = "";
                console.log("categories exist")
                categories.forEach(function(category){
                    
                    console.log("category ",category)
                    categoriesHtml += "<tr>"

                    //for category name
                    categoriesHtml += "<td>"
                    categoriesHtml += category.key
                    categoriesHtml += "</td>"

                    //for category description
                    categoriesHtml += "<td>"
                    categoriesHtml += category.val().desc
                    categoriesHtml += "</td>"

                    //for category thumbnail
                    categoriesHtml += "<td> <img height='250' src='"
                    categoriesHtml += category.val().thumbnail
                    categoriesHtml += "' /></td>"
                    categoriesHtml += "</tr>"
                })
                $("#categories-table").html(categoriesHtml)
            }else{
                console.log("categories not exist")
            }


        })