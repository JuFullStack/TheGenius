function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

var brow = {
  is_my_turn: Boolean,
  socket: null,
  p1numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  p2numbers: [],

  init: function (socket) {
    var self = this;
    var user_cnt = 0;

    shuffle(this.p1numbers);

    this.is_my_turn = false;

    socket = io();

    socket.on("check_number", function (data) {
      console.log(data);
      console.log("selected : ", data.num);
      if (data.num % 2 == 0) self.print_msg(data.username + "씨 '" + "흑!'");
      else self.print_msg(data.username + "씨 '" + "백!'");
    });

    socket.on("game_started", function (data) {
      console.log("enter the game_started");
      self.print_msg(data.username + " 님이 게임을 시작했습니다.");

      $("#start_button").hide();
    });

    socket.on("update_users", function (data, user_count) {
      console.log(data, "update user");
      user_cnt = user_count;
      if (user_count == 2) {
        window.ju = data;

        for (let i = 0; i < user_count; i++) {
          if (data[i].name != $("#username").val()) {
            console.log(data[i].tile);
            brow.p2numbers = data[i].tile.split(",");
          }
        }
        make();
      }
      self.update_userlist(data, socket);
    });

    socket.on("connect", function () {
      socket.emit("join", {
        username: $("#username").val(),
        tile: brow.p1numbers.join(),
      });
    });

    $("table.brow-board td").each(function (i) {
      $(this).click(function () {
        if (user_cnt == 1) {
          self.print_msg("<알림> 최소 2명부터 게임이 가능합니다.");
        } else {
          self.select_num(this, socket);
        }
      });
    });

    $("#start_button").click(function () {
      if (user_cnt == 1) {
        self.print_msg("<알림> 최소 2명부터 게임이 가능합니다.");
      } else {
        socket.emit("game_start", { username: $("#username").val() });
        self.print_msg("<알림> 게임을 시작했습니다.");
        $("#start_button").hide();
      }
    });
  },

  // init 끝
  select_num: function (obj, socket) {
    if (this.is_my_turn && !$(obj).attr("checked")) {
      //send num to other players
      socket.emit("select", {
        username: $("#username").val(),
        num: $(this).children("obj").attr("alt"),
      });
      this.check_num(obj);

      this.is_my_turn = false;
    } else {
      this.print_msg("<알림> 차례가 아닙니다!");
    }
  },

  where_is_it: function (num) {
    var self = this;
    var obj = null;

    $("table.brow-board td").each(function (i) {
      if ($(this).val == num) {
        self.check_num(this);
      }
    });
  },

  check_num: function (obj) {
    $(obj).css("opacity", "0.5");
    $(obj).attr("checked", true);
  },

  update_userlist: function (data, this_socket) {
    var self = this;
    $("#list").empty();
    console.log(data);

    $.each(data, function (key, value) {
      var turn = "(-) ";
      if (value.turn === true) {
        turn = "(*) ";
        console.log(value.name);
        console.log($("#username").val());
        if (value.id == this_socket.id) {
          self.is_my_turn = true;
        }
      }

      if (value.id == this_socket.id) {
        $("#list").append(
          "<font color='DodgerBlue'>" + turn + value.name + "<br></font>"
        );
      } else {
        $("#list").append(
          "<font color='black'>" + turn + value.name + "<br></font>"
        );
      }
    });
  },

  print_msg: function (msg) {
    $("#logs").append(msg + "<br />");
    $("#logs").scrollTop($("#logs")[0].scrollHeight);
  },
};

function make() {
  console.log("make");
  $("table.brow-board td").each(function (i) {
    if (i < 9) {
      if (brow.p2numbers.length != 0) {
        if (brow.p2numbers[i] % 2 == 0) {
          $(this).html(
            "<img alt=" +
              brow.p2numbers[i] +
              " " +
              "src= " +
              "/" +
              "images" +
              "/" +
              "bother.svg" +
              " " +
              "/>"
          );
        } else {
          $(this).html(
            "<img alt=" +
              brow.p2numbers[i] +
              " " +
              "src= " +
              "/" +
              "images" +
              "/" +
              "wother.svg" +
              " " +
              "/>"
          );
        }
      }
    } else if (i > 26 && i < 36) {
      $(this).html(
        "<img src=" +
          "/" +
          "images" +
          "/" +
          brow.p1numbers[i - 27] +
          ".svg " +
          "/>"
      );
    }
  });
}

$(document).ready(function () {
  brow.init();
  make();
});
