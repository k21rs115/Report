// NCMB アクセスの準備
var ncmb = new NCMB(appKey, clientKey);

///// Called when app launch
$(function() {
    $.mobile.defaultPageTransition = 'none';
    $("#LoginBtn").click(onLoginBtn);
    $("#RegisterBtn").click(onRegisterBtn);
    $("#YesBtn_logout").click(onLogoutBtn);
});

//----------------------------------USER MANAGEMENT-------------------------------------//
var currentLoginUser; //現在ログイン中ユーザー

function onRegisterBtn() {
    //入力フォームからusername, password変数にセット
    var username = $("#reg_username").val();
    var password = $("#reg_password").val();
    
    var user = new ncmb.User();
    user.set("userName", username)
        .set("password", password);
    
    // ユーザー名とパスワードで新規登録
    user.signUpByAccount()
        .then(function(reg_user) {
            // 新規登録したユーザーでログイン
            ncmb.User.login(reg_user)
                     .then(function(login_user) {
                         alert("新規登録とログイン成功");
                         currentLoginUser = ncmb.User.getCurrentUser();
                         $.mobile.changePage('#DetailPage');
                     })
                     .catch(function(error) {
                         alert("ログイン失敗！次のエラー発生: " + error);
                     });
        })
        .catch(function(error) {
            alert("新規登録に失敗！次のエラー発生：" + error);
        });
}

function onLoginBtn() {
    var username = $("#login_username").val();
    var password = $("#login_password").val();
    // ユーザー名とパスワードでログイン
    ncmb.User.login(username, password)
        .then(function(user) {
            alert("ログイン成功");
            currentLoginUser = ncmb.User.getCurrentUser();
            $.mobile.changePage('#ChoosePage');
        })
        .catch(function(error) {
            alert("ログイン失敗！次のエラー発生: " + error);
        });
}

function onLogoutBtn() {
    ncmb.User.logout();
    alert('ログアウト成功');
    currentLoginUser = null;
    $.mobile.changePage('#LoginPage');
}


// ----------------------------ここから下に書く-------------------------------

// SubmitBtn()
function SubmitBtn() {
    // 利用するデータベースを指定（存在しなければ生成）
    var QuestionClass = ncmb.DataStore("Question");
    // 登録するレコードを用意
    var questionClass = new QuestionClass();
    var key1 = "StudentNume";
    var value1 = $("#StudentNum").val();
    var key2 = "SeatNum";
    var value2 = $("#SeatNum").val();
    var key3 = "Question";
    var value3 = $("#Question").val();
    // レコードのフィールドと値を設定
    questionClass.set(key1, value1);
    questionClass.set(key2, parseInt(value2));
    questionClass.set(key3, value3);
    // レコードをデータベースに登録
    questionClass.save()
    .then(function(m) {
    $("#message").html("送信しました。送信時間: " + questionClass.createDate);
    })
    .catch(function(err){
    $("#message").html("送信に失敗しました。:" + JSON.stringify(err));
    })
}

// FetchAll()
function FetchAll() {
    var QuestionClass = ncmb.DataStore("Question");
    QuestionClass.fetchAll()
    .then(function(results){
        var msg = "";
        msg += "<table border=50 bordercolor=#FAAB78 bgcolor=#D7E9B9 style=font-size:20px>";
        msg += "<tr><th bgcolor=#FFFBAC>学籍番号</th><th bgcolor=#FFFBAC>座席</th><th bgcolor=#FFFBAC>質問</th></tr>";
        for(var i = 0; i < results.length; i++) {
            var stuNum=results[i].get("StudentNume");
            var seatNum=results[i].get("SeatNum");
            var question=results[i].get("Question");
            msg += "<tr><th>" + stuNum + "</th><th>" + seatNum + "</th><th>" + question + "<br></th></tr>";
        }
        msg += "</table>";
        $("#message").html(msg);
    })
}

// 本アプリで使うクラスの指定。const は定数の宣言。変更できない変数と思えば良い。
const db = "Question";

// deleteBtn()
    function deleteBtn() {
    var QuestionClass = ncmb.DataStore(db);
    QuestionClass.fetch()
        .then(function(results) {
            return results.delete();
        })
        .then(function(results) {
          $("#message").removeClass();
          $("#message").html("<font color='#ff0000'> 削除成功 <br>");
        })
        .catch(function(error) {
          $("#message").removeClass();
          $("#message").addClass("bg-warning");
          $("#message").html("削除失敗:" + JSON.stringify(error));
        })
}