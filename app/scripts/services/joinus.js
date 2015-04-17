'use strict';

angular.module('myApp.service')
  .service("JoinUs", function ($location) {

    var footer = "GitHub: https://github.com/keima/machiasobi-app";
    var qb =
      "　 　 　 　 |＼　　 　 　 　 　 ／|" + "\n" +
      "　 　 　 　 |＼＼　　 　 　 ／／|" + "\n" +
      "　　　　 　 : 　,>　｀´￣｀´　<　 ′" + "\n" +
      ".　　　　 　 Ｖ　 　 　 　 　 　 Ｖ" + "　　　僕と一緒に" + "\n" +
      ".　　　　 　 i{　%c●%c　 　 　 %c●%c　}i" + "　　　　コードを書かないかい？" + "\n" +
      "　　　　 　 八　 　 ､_,_, 　 　 八" + "\n" +
      ". 　 　 　 /　个 . ＿　 ＿ . 个 '," + "\n" +
      "　　　＿/ 　 il 　 ,'　　　 '.　 li　 ',＿_";

    var decoAll = "font-size:14px;color:black;";
    var decoEye = "font-size:14px;color:rgb(208,65,115);";
    var decoFooter = "font-size: 20px;";

    return {
      outputLog: function () {
        // 開発環境ではQB氏を出さないようにする
        if ($location.port() == 80) {
          console.log("%c" + qb, decoAll, decoEye, decoAll, decoEye, decoAll);
          console.log("%c" + footer, decoFooter);
        }
      }
    }

  });