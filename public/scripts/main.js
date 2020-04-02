$(function () {
    var rolls = [];
    var username = "";

    var roll = function () {

        rolls = [];

        for (var i = 0; i < 9; i++) {
            add(rollDie(), 0);
        }

        var yd = $("#yellow_dice").val();
        if (yd) {
            if (yd > 3) { yd = 3; }
            for (var i = 0; i < yd; i++) {
                add(rollDie(), 1);
            }
        }

        showRolls(this.username);

        socket.emit("rolled", {
            rolls: rolls
        });
    };

    var setName = function() {  
        this.username = getName();
        socket.emit("added user", this.username);        
    }

    var getName = function () {
        this.username = $("#name").val();
    };

    var add = function (value, yellow) {
        rolls.push({ v: value, y: yellow });
    };

    var addChat = function(msg) {
        $("#chat").append("<li>" + msg+ "</li>");
    }

    var showRolls = function (name) {
        addChat(name + ": Rolled @ " + new Date().toLocaleTimeString("en-GB"));

        $(".die_container").empty(".die");

        for (var i = 0; i < rolls.length; i++) {
            var die = getDie(rolls[i].v, rolls[i].y);
            $("#panel_" + rolls[i].v + "").append(die);
        }
    };

    var getDie = function (value, yellow) {
        var die = document.createElement("div");
        die.className = "die";
        if (yellow) {
            die.className += " yellow";
        }
        return die;
    };

    var rollDie = function () {
        return Math.floor((Math.random() * 6) + 1);
    };

    $("#roll_me").click(roll);
    $("#set_name").click(setName);

    var socket = io();

    socket.on("rolled", function (r) {
        rolls = r.rolls;
        showRolls(r.name);
    });

    socket.on("player joined", function (d) {
        addChat("Player joined: " + d.username);
        addChat("Total Players: <strong>" + d.total + "</strong>");
    });

    socket.on("message", function (msg) {
        addChat(msg);
    });
});