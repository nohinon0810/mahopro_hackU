
//let db = firebase.firestore(); // データベースに関する機能の取得

function room_init(){
  let db = firebase.firestore(); // データベースに関する機能の取得
  let room_name=$("#name").val()
  let room_size=$("#room_size").val();
//  let room_locationtype=$("#place_choice").val();
  let room_id= Math.floor( Math.random() * (999 + 1 - 100) ) + 100 ;
  const room_id_disp= document.querySelector('#room_id_disp');

    var user = firebase.auth().currentUser;
    function success(position) {
    db.collection("Room").add({ //Roomに新しいドキュメント追加
        room_host: user.uid,
        room_id:room_id,
        room_name:room_name, 
        room_size:room_size,
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
//        room_locationtype:room_locationtype,
        create_at: new Date() // 現在時刻
    }).then(function() { // 成功した場合に実行される箇所
        db.collection("Room_Member").add({ //RoomMemberに新しいドキュメント追加
            room_id:room_id,
            room_member:user.uid, 
            create_at: new Date() // 現在時刻
        }).then(function() { // 成功した場合に実行される箇所
            room_id_disp.textContent = `部屋ID:${room_id}`;
            //room_id_disp.append(room_id);
        })
        .catch(function(error) { // 失敗した場合に実行される箇所
            console.error("Error adding Member: ", error);
        });
        })
    .catch(function(error) { // 失敗した場合に実行される箇所
        console.error("Error adding Room: ", error);
    });
}
    function error() {
        console.log("Error");
    }
    if(!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
  }
  
function room_check(){
    const room_id_disp= document.querySelector('#room_id_disp');
    const room_name_disp= document.querySelector('#room_name_disp');
    let db = firebase.firestore(); // データベースに関する機能の取得
    //var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged( (user) => {
    var docRoom = db.collection("Room").where("room_host","==",user.uid).orderBy("create_at","desc").limit(1);
    
    docRoom
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            room_id_disp.textContent = `食事会の名前：${doc.data().room_name} `;
            room_name_disp.textContent = `食事会のパスワード：${doc.data().room_id} `;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    });

}

function member_add(){
    let db = firebase.firestore(); // データベースに関する機能の取得
    var room_id = $("#join_dinne_id").val();     
    var room_name = $("#join_dinne_name").val();
    var user = firebase.auth().currentUser;
    var docRoom = db.collection("Room").where("room_id", "==", parseInt(room_id)).where("room_name","==",room_name);
    const room_error= document.querySelector('#room_error');

    docRoom
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
//                if(!doc.exists)room_error.textContent = `食事会の名前またはIDが違います`;
                db.collection("Room_Member").add({ //RoomMemberに新しいドキュメント追加
                    room_id:parseInt(room_id),
                    room_member:user.uid, 
                    create_at: new Date() // 現在時刻
                }).then(function() { // 成功した場合に実行される箇所
                    window.location.replace("question.html");
                })
                .catch(function(error) { // 失敗した場合に実行される箇所
                    console.error("Error adding Member: ", error);
                });
                        
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting Room: ", error);
    });
    
}

function Answer_add(){
    let db = firebase.firestore(); // データベースに関する機能の取得
    var room_id;     
    var user = firebase.auth().currentUser;
    var ans_1=$("#lunch_type").val(); 
    var ans_2=$("#lunch_volume").val();
    var ans_3=$("#lunch_main").val(); 
    var ans_4=$("#alcohol").val();
    var ans_5=$("#noodle").val();

      console.log(ans_3,ans_4,ans_5);
      var docRoomMember=db.collection("Room_Member").where("room_member","==",user.uid).orderBy("create_at","desc").limit(1);
  
      docRoomMember
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            room_id=doc.data().room_id;
            db.collection("Answer").add({ //Answerに新しいドキュメント追加
                room_id:room_id,
                ans_member:user.uid,
                q_1:parseInt(ans_1),
                q_2:parseInt(ans_2),
                q_3:parseInt(ans_3), 
                q_4:parseInt(ans_4),
                q_5:parseInt(ans_5), 
                create_at: new Date() // 現在時刻
            }).then(function() { // 成功した場合に実行される箇所
                window.location.replace("stay.html");
            })
            .catch(function(error) { // 失敗した場合に実行される箇所
                console.error("Error adding Answer: ", error);
            });
        });
    })
    .catch(function(error) {
        console.log("Error getting Room: ", error);
    });

    }

function total_OK(){//集計してもよいかの判定
    console.log("total_okin!");
        let db = firebase.firestore(); // データベースに関する機能の取得
        var user = firebase.auth().currentUser;
        var docRoomid = db.collection("Room_Member").where("room_member","==",user.uid).orderBy("create_at","desc").limit(1);
        docRoomid
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                room_id=doc.data().room_id;
                console.log("room_id",room_id);
                var docAnswe_total=db.collection("Answer_Total").doc(String(room_id));
                if (docAnswe_total.exists){
                            console.log("mouatta");
//                            window.location.replace("rec_store.html");
                }else{
                var docRoomsize = db.collection("Room").where("room_id", "==", room_id);
                docRoomsize
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        room_size=doc.data().room_size;
                        room_id=doc.data().room_id;
                        console.log("room_size",room_size);                        
                        var docAnswer=db.collection("Answer").where("room_id","==",room_id);
                        docAnswer.get().then(res => {
                            console.log(room_size,res.size);
                            if(room_size<=res.size){
                                Answer_total();
                            }else{
                            }
                        })
                        
                    });
                })
                .catch(function(error) {
                    console.log("Error getting Room_size: ", error);
                });
            }
            });
        })
        .catch(function(error) {
            console.log("Error getting Room_id: ", error);
        });
}
    
        function Answer_total(){//集計
            let db = firebase.firestore(); // データベースに関する機能の取得
            var user = firebase.auth().currentUser;
        
            var docRoomMember=db.collection("Room_Member").where("room_member","==",user.uid).orderBy("create_at","desc").limit(1);
          
              docRoomMember
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("step1");
                    room_id=doc.data().room_id;
                    db.collection("Room").where("room_id","==",room_id)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            room_id=doc.data().room_id;
                            room_size=doc.data().room_size;
                            latitude=doc.data().latitude;
                            longitude=doc.data().longitude;
                            db.collection("Answer").where("room_id","==",room_id).get().then((querySnapshot) => {
                                console.log("step2");
                                var ans_t_1=0;
                                var ans_t_2=0;
                                var ans_t_3=0;
                                var ans_t_4=0;
                                var ans_t_5=0;
                                querySnapshot.docs.forEach((doc) => {
                                    // doc.data() is never undefined for query doc snapshots
                                    console.log("step3");
                                    ans_t_1+=doc.data().q_1;
                                    ans_t_2+=doc.data().q_2;
                                    ans_t_3+=doc.data().q_3;
                                    ans_t_4+=doc.data().q_4;
                                    ans_t_5+=doc.data().q_5;
                                    console.log(doc.id, " => ", doc.data());
                                    
                                });
                                db.collection("Answer_Total").doc(String(room_id)).set({ //Answerに新しいドキュメント追加
                                    room_id:room_id,
                                    latitude:latitude,
                                    longitude:longitude,
                                    q_1:ans_t_1/room_size,
                                    q_2:ans_t_2/room_size,
                                    q_3:ans_t_3/room_size, 
                                    q_4:ans_t_4/room_size,
                                    q_5:ans_t_5/room_size, 
                                    create_at: new Date() // 現在時刻
                                }).then(function() { // 成功した場合に実行される箇所
                                    window.location.replace("rec_store.html");
                                })
                                .catch(function(error) { // 失敗した場合に実行される箇所
                                    console.error("Error adding Answer_Total: ", error);
                                });
                            });
        
                        });
                    })
                    .catch(function(error) {
                        console.log("Error getting Answer: ", error);
                    });
                    console.log("roomsize:",room_size);

                });
            })
            .catch(function(error) {
                console.log("Error getting Room: ", error);
            });
            }